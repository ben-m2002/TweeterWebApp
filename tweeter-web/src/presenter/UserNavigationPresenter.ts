import { UserService } from "../model/service/UserService";
import React from "react";
import { AuthToken, User } from "tweeter-shared/src";
import { Presenter, View } from "./Presenter";

export interface UserNavigationView extends View {
  setDisplayedUser: (user: User) => void;
}

export class UserNavigationPresenter extends Presenter<UserNavigationView> {
  private _userService: UserService;

  constructor(view: UserNavigationView) {
    super(view);
    this._userService = new UserService();
  }

  get userService(): UserService {
    return this._userService;
  }

  public async navigateToUser(
    event: React.MouseEvent,
    authToken: AuthToken,
    currentUser: User,
  ): Promise<void> {
    event.preventDefault();
    await this.doFailureReportOperation(async () => {
      this.itemDescription = "navigate to user";
      const alias = this.extractAlias(event.target.toString());
      const user = await this.userService.getUser(authToken!, alias);

      if (!!user) {
        if (currentUser!.equals(user)) {
          this.view.setDisplayedUser(currentUser!);
        } else {
          this.view.setDisplayedUser(user);
        }
      }
    });
  }

  public extractAlias(value: string): string {
    const index = value.indexOf("@");
    return value.substring(index);
  }
}
