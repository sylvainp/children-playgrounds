import { useState } from "react";
import { container } from "tsyringe";
import UsecaseResponse from "../common/usecase/usecase_response";
import SignoutUsecase from "../domain/usecases/logout/signout.usecase";
import SigninUsecase from "../domain/usecases/signin/signin.usecase";
import SignupUsecase from "../domain/usecases/signup/signup.usecase";

function useAuthState() {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const signup = async (
    email: string,
    firstName: string,
    lastName: string,
    password: string
  ) => {
    setLoading(true);
    const signupUsecase = container.resolve(SignupUsecase);
    const result: UsecaseResponse<void> = await signupUsecase.call({
      email,
      familyName: lastName,
      givenName: firstName,
      password,
    });
    if (result.error) {
      setError(result.error);
    } else {
      setError(null);
    }
    setLoading(false);
  };

  const signin = async (email: string, password: string) => {
    setLoading(true);
    const signinUsecase: SigninUsecase = container.resolve(SigninUsecase);
    const result: UsecaseResponse<void> = await signinUsecase.call({
      email,
      password,
    });
    if (result.error) {
      setError(result.error);
    } else {
      setError(null);
    }
    setLoading(false);
  };

  const signout = async () => {
    setLoading(true);
    const signoutUsecase: SignoutUsecase = container.resolve(SignoutUsecase);
    const result = await signoutUsecase.call();
    if (result.error) {
      setError(result.error);
    } else {
      setError(null);
    }
    setLoading(false);
  };

  return { isLoading, error, signup, signin, signout };
}

export default useAuthState;
