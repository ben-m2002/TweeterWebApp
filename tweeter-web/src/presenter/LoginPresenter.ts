import { AuthPresenter, AuthView } from "./AuthPresenter";
import { AuthToken, User } from "tweeter-shared/src";

export interface LoginView extends AuthView {}

export class LoginPresenter extends AuthPresenter<LoginView> {
  constructor(view: LoginView) {
    super(view);
  }

  public async doLogin(alias: string, password: string, originalUrl: string) {
    this.itemDescription = "login";
    await this.doAuthOperation(alias, password, originalUrl);
  }

  protected authenticate(): Promise<[User, AuthToken]> {
    return this.userService.login(this.alias, this.password);
  }
}
