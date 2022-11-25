import UsecaseRequest from "../../../common/usecase/usecase_request";

export default interface AddPlaygroundInfoRequest extends UsecaseRequest {
  playgroundId: string;
  userId: string;
  rate: number;
  comment: string;
  gamesId: string[];
}
