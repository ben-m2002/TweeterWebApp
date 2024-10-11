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
  private _alias: string = "";
  private _password: string = "";

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

  get userService(): UserService {
    return this._userService;
  }

  get alias(): string {
    return this._alias;
  }

  get password(): string {
    return this._password;
  }

  set rememberMe(value: boolean) {
    this._rememberMe = value;
  }

  set isLoading(value: boolean) {
    this._isLoading = value;
  }

  set alias(value: string) {
    this._alias = value;
  }

  set password(value: string) {
    this._password = value;
  }

  public async doAuthOperation(
    alias: string,
    password: string,
    originalUrl: string,
  ): Promise<void> {
    await this.doFailureReportOperation(async () => {
      this.isLoading = true;
      this.alias = alias;
      this.password = password;
      const [user, authToken] = await this.authenticate();
      this.view.updateUserInfo(user, user, authToken, this.rememberMe);
      if (!!originalUrl) {
        this.view.navigate(originalUrl);
      } else {
        this.view.navigate("/");
      }
    });
    this.isLoading = false;
  }

  protected abstract authenticate(): Promise<[User, AuthToken]>;
}
