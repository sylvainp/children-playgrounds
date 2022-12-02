export interface Fields {
  com_nom: string;
  epci: string;
  geopoint: number[];
  access: string;
  com_insee: number;
}

export interface Geometry {
  type: string;
  coordinates: number[];
}
export default interface PlaygroundHeraultDataModel {
  datasetid: string;
  recordid: string;
  fields: Fields;
  geometry: Geometry;
  record_timestamp: string;
}
