import { injectable } from "tsyringe";
import PlaygroundHeraultDataModel from "../models/playground_heraultdata.model";

@injectable()
export default class HeraultdataDatasource {
  static readonly injectorName: string = "HeraultdataDatasource";

  private readonly url =
    "https://www.herault-data.fr/api/records/1.0/search/?dataset=aires-de-jeux-herault";

  async fetchAllPlaygrounds(): Promise<PlaygroundHeraultDataModel[]> {
    const serverResponse: Response = await fetch(this.url, { method: "GET" });
    const serverResponseJson: any = await serverResponse.json();
    if (serverResponse.status === 200) {
      return serverResponseJson.records;
    }
    throw new Error(JSON.stringify(serverResponseJson));
  }
}
