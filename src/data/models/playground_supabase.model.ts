import TestedPlaygroundSupabaseModel from "./tested_playground_supabase.model";

export interface PlaygroundSupabaseModel {
  coordinate: any;
  cityName: string;
  id: string;
  updateDate: string;
  tested_playground?: TestedPlaygroundSupabaseModel[];
}
