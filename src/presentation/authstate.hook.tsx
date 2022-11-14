import { useState } from "react";
import { container } from "tsyringe";
import UsecaseResponse from "../common/usecase/usecase_response";
import SigninUsecase from "../domain/usecases/signin/signin.usecase";
import SignupUsecase from "../domain/usecases/signup/signup.usecase";

function authState() {
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

  return { isLoading, error, signup, signin };
}

export default authState;
