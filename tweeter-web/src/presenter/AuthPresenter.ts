import { Presenter, View } from "./Presenter";
import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export interface AuthView extends View {
  updateUserInfo(
    currentUser: User,
    displayedUser: User,
    authToken: AuthToken,
    remember: boolean,
  ): void;
  navigate(path: string): void;
}

export abstract class AuthPresenter<T extends AuthView> extends Presenter<T> {
  private _userService;
  private _isLoading = false;
  private _rememberMe: boolean = false;

  constructor(view: T) {
    super(view);
    this._userService = new UserService();
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  get rememberMe(): boolean {
    return this._rememberMe;
  }

  set rememberMe(value: boolean) {
    this._rememberMe = value;
  }

  set isLoading(value: boolean) {
    this._isLoading = value;
  }

  get userService(): UserService {
    return this._userService;
  }
}
