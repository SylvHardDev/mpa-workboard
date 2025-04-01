import { createClient } from "./supabase/client";
import { users } from "./users";

let supabase = createClient();

export type AuthError = {
  message: string;
  status?: number;
};

export const auth = {
  signUp: async (email: string, password: string) => {
    // check if the user already exist
    const { data: existingUser, error } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();
    //if existew, throw error. user already exists
    if (existingUser) {
      throw new Error("This email is already registred.");
    }

    if (error) {
      throw error;
    }
    //if not, signup user
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });
    if (signUpError) {
      throw new Error("Fail to create new account");
    }
    //save user edtails

    // If no user data, something went wrong
    if (!data.user) {
      throw new Error("Failed to create user account");
    }

    //save user details

    // Step 3: Only proceed with profile creation for new signups
    try {
      await users.captureUserDetails(data.user);
    } catch (profileError) {
      // If profile creation fails, clean up the auth user
      await supabase.auth.admin.deleteUser(data.user.id);
      throw profileError;
    }

    return data;
  },

  login: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;

    if (data.user) {
      await users.captureUserDetails(data.user);
    }

    return data;
  },

  // OAuth Sign In (Google, GitHub)
  signInWithOAuth: async (provider: "github" | "google", nextUrl?: string) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${location.origin}/auth/callback?next=${nextUrl || "/"}`,
      },
    });
    if (error) throw error;
    return data;
  },

  logout: async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw { message: error.message, status: error.status };

  
},

async resetPasswordRequest(email: string) {
  console.log('Starting password reset request for:', email);
  
  // First check if user exists in our users table and uses email provider
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("id, provider")
    .eq("email", email)
    .single();

  console.log('User check result:', { user, userError });

  if (userError && userError.code !== "PGRST116") {
    console.error('Database error:', userError);
    throw { 
      message: "Une erreur est survenue lors de la vérification de l'email. Veuillez réessayer.",
      status: 500 
    };
  }

  // If user doesn't exist or doesn't use email auth
  if (!user) {
    console.log('User not found');
    throw { 
      message: "Aucun compte n'existe avec cet email.",
      status: 404 
    };
  }

  if (user.provider !== "email") {
    console.log('User not using email auth');
    throw { 
      message: "Ce compte utilise une autre méthode de connexion. Veuillez utiliser la méthode appropriée.",
      status: 400 
    };
  }

  const resetLink = `${location.origin}/auth/reset-password`;
  console.log('Sending reset email with link:', resetLink);
  
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: resetLink,
  });

  console.log('Reset email result:', { data, error });

  if (error) {
    console.error('Reset email error:', error);
    if (error.message.includes('rate limit')) {
      throw { 
        message: "Trop de tentatives. Veuillez réessayer dans quelques minutes.",
        status: 429 
      };
    }
    throw { 
      message: "Une erreur est survenue lors de l'envoi de l'email. Veuillez réessayer.",
      status: 500 
    };
  }

  return {
    success: true,
    message: "Un lien de réinitialisation a été envoyé à votre adresse email.",
  };
},

// Password Reset
async resetPassword(newPassword: string) {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  if (error) throw { message: error.message, status: error.status };
  return data;
},
};
