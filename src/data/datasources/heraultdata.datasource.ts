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

  private startIndex: number = 0;

  private readonly base_url =
    "https://www.herault-data.fr/api/records/1.0/search/?dataset=aires-de-jeux-herault";

  protected get records_per_page(): number {
    return 800;
  }

  async fetchAllPlaygrounds(): Promise<PlaygroundHeraultDataModel[]> {
    let datas: PlaygroundHeraultDataModel[] = [];
    let error: Error | null = null;
    await lastValueFrom(
      this.fetchPlaygroundsForStartIndex().pipe(
        expand((previousData: { status: number; response: any }) =>
          error === null &&
          previousData.response.records.length === this.records_per_page
            ? this.fetchPlaygroundsForStartIndex(
                this.startIndex + this.records_per_page
              )
            : EMPTY
        ),
        tap((serverResponse: { status: number; response: any }) => {
          if (serverResponse.status === 200) {
            datas = datas.concat(serverResponse.response.records);
          } else {
            error = new Error(JSON.stringify(serverResponse.response));
          }
        })
      )
    );
    if (error) {
      throw error;
    }

    return datas;
  }

  fetchPlaygroundsForStartIndex(
    startIndex: number = 0
  ): Observable<{ status: number; response: any }> {
    this.startIndex = startIndex;
    const url = `${this.base_url}&rows=${this.records_per_page}&start=${this.startIndex}`;

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
