import {
  EMPTY,
  expand,
  from,
  lastValueFrom,
  Observable,
  switchMap,
  tap,
} from "rxjs";
import { injectable } from "tsyringe";
import PlaygroundHeraultDataModel from "../models/playground_heraultdata.model";

@injectable()
export default class HeraultdataDatasource {
  static readonly injectorName: string = "HeraultdataDatasource";

  readonly records_per_page: number = 25;

  private startIndex: number = 0;

  private readonly base_url =
    "https://www.herault-data.fr/api/records/1.0/search/?dataset=aires-de-jeux-herault";

  async fetchAllPlaygrounds(): Promise<PlaygroundHeraultDataModel[]> {
    let datas: PlaygroundHeraultDataModel[] = [];

    await lastValueFrom(
      this.fetchPlaygroundsForStartIndex().pipe(
        tap((serverResponse: { status: number; response: any }) => {
          datas = datas.concat(serverResponse.response.records);
        }),
        expand((previousData: { status: number; response: any }) =>
          previousData.status === 200 &&
          previousData.response.records.length === this.records_per_page
            ? this.fetchPlaygroundsForStartIndex(
                this.startIndex + this.records_per_page
              )
            : EMPTY
        )
      )
    );
    return datas;
    // const serverResponse: { status: number; response: any } =
    //   await lastValueFrom(this.fetchPlaygroundsForStartIndex());
    // const serverResponseJson: any = serverResponse.response;
    // if (serverResponse.status === 200) {
    //   return serverResponseJson.records;
    // }
    // throw new Error(JSON.stringify(serverResponseJson));
  }

  fetchPlaygroundsForStartIndex(
    startIndex: number = 0
  ): Observable<{ status: number; response: any }> {
    this.startIndex = startIndex;
    const url = `${this.base_url}?rows=${this.records_per_page}&start=${this.startIndex}`;

    return from(
      fetch(url, {
        method: "GET",
      })
    ).pipe(
      switchMap(async (response) => ({
        status: response.status,
        response: await response.json(),
      }))
    );
  }
}
