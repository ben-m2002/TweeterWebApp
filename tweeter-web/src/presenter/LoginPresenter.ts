import { UserService } from "../model/service/UserService";
import { AuthToken, User } from "tweeter-shared";

export interface LoginView {
  updateUserInfo(
    user: User,
    displayedUser: User | null,
    authToken: AuthToken,
    rememberMe: boolean,
  ): void;
  navigate(url: string): void;
  displayErrorMessage(message: string): void;
}

export class LoginPresenter {
  private view: LoginView;
  private userService;
  private _isLoading = false;
  private _rememberMe: boolean = false;

  constructor(view: LoginView) {
    this.view = view;
    this.userService = new UserService();
  }

  public get rememberMe(): boolean {
    return this._rememberMe;
  }

  public set rememberMe(value: boolean) {
    this._rememberMe = value;
  }

  public get isLoading(): boolean {
    return this._isLoading;
  }

  public set isLoading(value: boolean) {
    this._isLoading = value;
  }

  public async doLogin(alias: string, password: string, originalUrl: string) {
    try {
      this._isLoading = true;

      const [user, authToken] = await this.userService.login(alias, password);

      this.view.updateUserInfo(user, user, authToken, this._rememberMe);

      if (!!originalUrl) {
        this.view.navigate(originalUrl);
      } else {
        this.view.navigate("/");
      }
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to log user in because of exception: ${error}`,
      );
    } finally {
      this._isLoading = false;
    }
  }
}
