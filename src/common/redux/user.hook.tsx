import UserEntity from "../../domain/entities/user.entity";
import { useAppSelector } from "./store";

const useLoggedUser = () =>
  useAppSelector((state: any) => {
    const { loggedUser } = state;
    if (loggedUser.user) {
      return new UserEntity(
        loggedUser.user.id,
        loggedUser.user.email!,
        loggedUser.user.familyName,
        loggedUser.user.givenName,
        loggedUser.user.accessToken,
        loggedUser.user.refreshToken
      );
    }

    return null;
  });

export default useLoggedUser;
