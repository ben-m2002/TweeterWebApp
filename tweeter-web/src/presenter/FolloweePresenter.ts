import { FollowService } from "../model/service/FollowService";
import { UserItemPresenter, UserItemView } from "./UserItemPresenter";
import { PAGE_SIZE } from "../components/mainLayout/UserItemScroller";
import { useState } from "react";
import { AuthToken, User } from "tweeter-shared";

export class FolloweePresenter extends UserItemPresenter {
  private followService: FollowService;

  constructor(view: UserItemView) {
    super(view);
    this.followService = new FollowService();
  }

  public async loadMoreItems(
    authToken: AuthToken,
    userAlias: string,
  ): Promise<void> {
    try {
      const [newItems, hasMore] = await this.followService.loadMoreFollowees(
        authToken!,
        userAlias!,
        PAGE_SIZE,
        this.lastItem,
      );

      this.hasMoreItems = hasMore;
      this.lastItem = newItems[newItems.length - 1];
      this.view.addItems(newItems);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to load followees because of exception: ${error}`,
      );
    }
  }
}