import { UserService } from "../model/service/UserService";
import { AuthToken } from "tweeter-shared/src";
import { MessageView, Presenter, View } from "./Presenter";

export interface LogoutView extends MessageView {
  clearUserInfo(): void;
}

export class LogoutPresenter extends Presenter<LogoutView> {
  private _userService: UserService | null = null;

  constructor(view: LogoutView) {
    super(view);
  }

  get userService(): UserService {
    if (this._userService === null) {
      this._userService = new UserService();
    }
    return this._userService;
  }

  public setItemDescription(itemDescription: string) {
    this.itemDescription = itemDescription;
  }

  public async logOut(authToken: AuthToken) {
    this.setItemDescription("Logging Out...");
    this.view.displayInfoMessage("Logging Out...", 0);
    await this.doFailureReportOperation(async () => {
      await this.userService.logout(authToken!);
      this.view.clearLastInfoMessage();
      this.view.clearUserInfo();
    });
  }
}
