import { AuthError } from "@supabase/supabase-js";
import AppError from "../../common/app_error";

export default class SupabaseAuthError extends AppError {
  constructor(error?: AuthError) {
    super();
    switch (error?.message) {
      case "Invalid login credentials":
        this.message = "Vos identifiants sont incorrects";
        break;
      case "User already registered":
        this.message = "Un compte avec cette adresse email existe déjà";
        break;
      default:
        this.message =
          "Impossible de créer le compte. Veuillez ré-essayer plus tard";
        break;
    }
  }
}
