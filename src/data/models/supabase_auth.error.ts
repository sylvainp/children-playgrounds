import { AuthError } from "@supabase/supabase-js";
import AppError from "../../common/app_error";

export default class SupabaseAuthError extends AppError {
  constructor(error?: AuthError) {
    super();
    if (error?.message === "User already registered") {
      this.message = "Un compte avec cette adresse email existe déjà";
    } else {
      this.message =
        "Impossible de créer le compte. Veuillez ré-essayer plus tard";
    }
  }
}
