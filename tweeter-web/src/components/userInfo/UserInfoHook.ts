import { AuthToken, User } from "tweeter-shared";
import userHook from "./UserHook";

interface UserInfoProps {
  currentUser: User | null;
  displayedUser: User | null;
  authToken: AuthToken | null;
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean,
  ) => void;
  clearUserInfo: () => void;
  setDisplayedUser: (user: User) => void;
}

const useUserInfo = (): UserInfoProps => {
  const {
    currentUser,
    displayedUser,
    authToken,
    updateUserInfo,
    clearUserInfo,
    setDisplayedUser,
  } = userHook();
  return {
    currentUser,
    displayedUser,
    authToken,
    updateUserInfo,
    clearUserInfo,
    setDisplayedUser,
  };
};

export default useUserInfo;
