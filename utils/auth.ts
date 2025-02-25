import { createClient } from "./supabase/client";
import { users } from "./users";

let supabase = createClient();

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

  login: async () => {},

  signInWithOAuth: async () => {},

  logout: async () => {},
};
