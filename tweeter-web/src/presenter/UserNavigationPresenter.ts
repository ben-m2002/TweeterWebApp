import { UserService } from "../model/service/UserService";
import React from "react";
import { Simulate } from "react-dom/test-utils";
import error = Simulate.error;
import { AuthToken, User } from "tweeter-shared";

export interface UserNavigationView {
  setDisplayedUser: (user: User) => void;
  displayErrorMessage: (message: string) => void;
}

export class UserNavigationPresenter {
  private _view: UserNavigationView;
  private _userService: UserService;

  constructor(view: UserNavigationView) {
    this._view = view;
    this._userService = new UserService();
  }

  get view(): UserNavigationView {
    return this._view;
  }

  set view(value: UserNavigationView) {
    this._view = value;
  }

  get userService(): UserService {
    return this._userService;
  }

  set userService(value: UserService) {
    this._userService = value;
  }

  public async navigateToUser(
    event: React.MouseEvent,
    authToken: AuthToken,
    currentUser: User,
  ): Promise<void> {
    event.preventDefault();

    try {
      const alias = this.extractAlias(event.target.toString());

      const user = await this.userService.getUser(authToken!, alias);

      if (!!user) {
        if (currentUser!.equals(user)) {
          this.view.setDisplayedUser(currentUser!);
        } else {
          this.view.setDisplayedUser(user);
        }
      }
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to get user because of exception: ${error}`,
      );
    }
  }

  public extractAlias(value: string): string {
    const index = value.indexOf("@");
    return value.substring(index);
  }
}
