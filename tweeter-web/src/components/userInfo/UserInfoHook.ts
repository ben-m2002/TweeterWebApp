import { AuthToken, User } from "tweeter-shared";
import { useContext } from "react";
import { UserInfoContext } from "./UserInfoProvider";

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

const useUserInfo = (userId: string): UserInfoProps => {
  const {
    currentUser,
    displayedUser,
    authToken,
    updateUserInfo,
    clearUserInfo,
    setDisplayedUser,
  } = useContext(UserInfoContext);
  return {
    currentUser,
    displayedUser,
    authToken,
    updateUserInfo,
    clearUserInfo,
    setDisplayedUser,
  };
};
