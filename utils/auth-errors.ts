import type { AuthError as SupabaseAuthError } from "@supabase/supabase-js";
import { PostgrestError } from "@supabase/supabase-js";

export type AuthErrorType =
  | "InvalidCredentials"
  | "EmailNotConfirmed"
  | "InvalidEmail"
  | "WeakPassword"
  | "EmailInUse"
  | "DatabaseError"
  | "RateLimit"
  | "Default";

export const getAuthError = (
  error: SupabaseAuthError | PostgrestError | any
): { type: AuthErrorType; message: string } => {
  if (error?.code) {
    switch (error.code) {
      case "23505":
      case "23503":
        return {
          type: "EmailInUse",
          message: "Cet email est déjà utilisé. Veuillez vous connecter à la place.",
        };
    }
  }

  // Handle Supabase auth errors
  if (error?.error_description) {
    const errorMessage = error.error_description.toLowerCase();
    if (errorMessage.includes("user already registered")) {
      return {
        type: "EmailInUse",
        message: "Cet email est déjà utilisé. Veuillez vous connecter à la place.",
      };
    }
  }

  // Handle error message directly
  const errorMessage = error?.message?.toLowerCase() || "";

  if (errorMessage.includes("invalid login credentials")) {
    return {
      type: "InvalidCredentials",
      message: "Email ou mot de passe incorrect. Veuillez réessayer.",
    };
  }

  if (errorMessage.includes("email not confirmed")) {
    return {
      type: "EmailNotConfirmed",
      message: "Veuillez vérifier votre email avant de vous connecter.",
    };
  }

  if (errorMessage.includes("invalid email")) {
    return {
      type: "InvalidEmail",
      message: "Veuillez entrer une adresse email valide.",
    };
  }

  if (errorMessage.includes("password")) {
    return {
      type: "WeakPassword",
      message: "Le mot de passe doit contenir au moins 6 caractères.",
    };
  }

  if (errorMessage.includes("rate limit")) {
    return {
      type: "RateLimit",
      message: "Trop de tentatives. Veuillez réessayer dans quelques minutes.",
    };
  }

  if (errorMessage.includes("email already registered") ||
      errorMessage.includes("email is already registered")) {
    return {
      type: "EmailInUse",
      message: "Cet email est déjà utilisé. Veuillez vous connecter à la place.",
    };
  }

  return {
    type: "Default",
    message: "Une erreur est survenue. Veuillez réessayer.",
  };
};
