import UsecaseRequest from "../../../common/usecase/usecase_request";

export default interface SignupRequest extends UsecaseRequest {
  givenName: string;
  familyName: string;
  email: string;
  password: string;
}
