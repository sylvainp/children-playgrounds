import UsecaseRequest from "../../../common/usecase/usecase_request";

export default interface SigninRequest extends UsecaseRequest {
  email: string;
  password: string;
}
