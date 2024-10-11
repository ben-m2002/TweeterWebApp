import { UserService } from "../model/service/UserService";
import { AuthToken } from "tweeter-shared";
import { MessageView, Presenter, View } from "./Presenter";

export interface LogoutView extends MessageView {
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

  public async logOut(authToken: AuthToken) {
    this.itemDescription = "log user out";
    this.view.displayInfoMessage("Logging Out...", 0);
    await this.doFailureReportOperation(async () => {
      await this.userService.logout(authToken!);
      this.view.clearLastInfoMessage();
      this.view.clearUserInfo();
    });
  }
}
