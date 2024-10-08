import { AuthPresenter, AuthView } from "./AuthPresenter";

export interface LoginView extends AuthView {}

export class LoginPresenter extends AuthPresenter<LoginView> {
  constructor(view: LoginView) {
    super(view);
  }

  public async doLogin(alias: string, password: string, originalUrl: string) {
    await this.doFailureReportOperation(async () => {
      this.isLoading = true;

      const [user, authToken] = await this.userService.login(alias, password);

      this.view.updateUserInfo(user, user, authToken, this.rememberMe);

      if (!!originalUrl) {
        this.view.navigate(originalUrl);
      } else {
        this.view.navigate("/");
      }
    }, "log user in");
  }
}
