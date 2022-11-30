import UsecaseRequest from "../../../common/usecase/usecase_request";

export default interface GetPlaygroundUsecaseRequest extends UsecaseRequest {
  playgroundId: string;
}
