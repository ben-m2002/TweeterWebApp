import { UserService } from "../model/service/UserService";
import { AuthToken } from "tweeter-shared";

export interface LogoutView {
  displayInfoMessage(message: string, duration: number): void;
  displayErrorMessage(message: string): void;
  clearLastInfoMessage(): void;
  clearUserInfo(): void;
}

export class LogoutPresenter {
  private _view: LogoutView;
  private _userService: UserService;

  constructor(view: LogoutView) {
    this._view = view;
    this._userService = new UserService();
  }

  get view(): LogoutView {
    return this._view;
  }

  set view(value: LogoutView) {
    this._view = value;
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
