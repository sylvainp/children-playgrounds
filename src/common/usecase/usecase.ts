import UsecaseRequest from "./usecase_request";
import UsecaseResponse from "./usecase_response";

export default abstract class Usecase<P extends UsecaseRequest | null, R> {
  abstract call(request: P): Promise<UsecaseResponse<R>>;
}
