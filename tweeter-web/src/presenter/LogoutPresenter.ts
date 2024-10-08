import { UserService } from "../model/service/UserService";
import { AuthToken } from "tweeter-shared";
import { Presenter, View } from "./Presenter";

export interface LogoutView extends View {
  displayInfoMessage(message: string, duration: number): void;
  clearLastInfoMessage(): void;
  clearUserInfo(): void;
}

export class LogoutPresenter extends Presenter<LogoutView> {
  private _userService: UserService;

  constructor(view: LogoutView) {
    super(view);
    this._userService = new UserService();
  }

  get userService(): UserService {
    return this._userService;
  }

  set userService(value: UserService) {
    this._userService = value;
  }

  public async logOut(authToken: AuthToken) {
    this.view.displayInfoMessage("Logging Out...", 0);

    try {
      await this.userService.logout(authToken!);

      this.view.clearLastInfoMessage();
      this.view.clearUserInfo();
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to log user out because of exception: ${error}`,
      );
    }
  }
}
