import { createClient } from "./supabase/server";

const supabase = createClient();

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

    //save user edtails
  },

  login: async () => {},

  signInWithOAuth: async () => {},

  logout: async () => {},
};
