import useUserInfo from "./userInfo/UserInfoHook";
import useToastListener from "./toaster/ToastListenerHook";
import {
  UserNavigationPresenter,
  UserNavigationView,
} from "../presenter/UserNavigationPresenter";
import { useState } from "react";

interface UserNavigation {
  navigateToUser: (event: React.MouseEvent) => Promise<void>;
}

const useUserNavigation = (): UserNavigation => {
  const { displayErrorMessage } = useToastListener();
  const { setDisplayedUser, currentUser, authToken } = useUserInfo();

  const listener: UserNavigationView = {
    setDisplayedUser: setDisplayedUser,
    displayErrorMessage: displayErrorMessage,
  };
  const [presenter] = useState(() => new UserNavigationPresenter(listener));

  const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
    // THIS AWAIT MIGHT CAUSE GAME BREAKING CHANGES
    await presenter.navigateToUser(event, authToken!, currentUser!);
  };

  return { navigateToUser };
};

export default useUserNavigation;
