import "./App.css";
import { ReactNode, useContext } from "react";
//import { UserInfoContext } from "./components/userInfo/UserInfoProvider";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Login from "./components/authentication/login/Login";
import Register from "./components/authentication/register/Register";
import MainLayout from "./components/mainLayout/MainLayout";
import Toaster from "./components/toaster/Toaster";
import useUserInfo from "./components/userInfo/UserInfoHook";
import { FolloweePresenter } from "./presenter/FolloweePresenter";
import { UserItemView } from "./presenter/UserItemPresenter";
import { FollowerPresenter } from "./presenter/FollowerPresenter";
import { StatusItemView } from "./presenter/StatusItemPresenter";
import { FeedPresenter } from "./presenter/FeedPresenter";
import { StoryPresenter } from "./presenter/StoryPresenter";
import { ItemScroller } from "./components/mainLayout/ItemScroller";
import { Status, User } from "tweeter-shared";
import StatusItem from "./components/statusItem/statusItem";
import { StatusService } from "./model/service/StatusService";
import UserItem from "./components/userItem/UserItem";
import { FollowService } from "./model/service/FollowService";

const App = () => {
  const { currentUser, authToken } = useUserInfo();

  const isAuthenticated = (): boolean => {
    return !!currentUser && !!authToken;
  };

  return (
    <div>
      <Toaster position="top-right" />
      <BrowserRouter>
        {isAuthenticated() ? (
          <AuthenticatedRoutes />
        ) : (
          <UnauthenticatedRoutes />
        )}
      </BrowserRouter>
    </div>
  );
};

const AuthenticatedRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Navigate to="/feed" />} />
        <Route
          path="feed"
          element={
            <ItemScroller<Status, StatusService, ReactNode>
              key={1}
              presenterGenerator={(view: StatusItemView) =>
                new FeedPresenter(view)
              }
              itemGenerator={(value: Status) => <StatusItem item={value} />}
            />
          }
        />
        <Route
          path="story"
          element={
            <ItemScroller<Status, StatusService, ReactNode>
              key={2}
              presenterGenerator={(view: StatusItemView) =>
                new StoryPresenter(view)
              }
              itemGenerator={(value: Status) => <StatusItem item={value} />}
            />
          }
        />
        <Route
          path="followees"
          element={
            <ItemScroller<User, FollowService, ReactNode>
              key={3}
              presenterGenerator={(view: UserItemView) =>
                new FolloweePresenter(view)
              }
              itemGenerator={(value: User) => <UserItem value={value} />}
            />
          }
        />
        <Route
          path="followers"
          element={
            <ItemScroller<User, FollowService, ReactNode>
              key={4}
              presenterGenerator={(view: UserItemView) =>
                new FollowerPresenter(view)
              }
              itemGenerator={(value: User) => <UserItem value={value} />}
            />
          }
        />
        <Route path="logout" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/feed" />} />
      </Route>
    </Routes>
  );
};

const UnauthenticatedRoutes = () => {
  const location = useLocation();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Login originalUrl={location.pathname} />} />
    </Routes>
  );
};

export default App;
