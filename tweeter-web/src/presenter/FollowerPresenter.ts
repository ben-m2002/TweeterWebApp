import { FollowService } from "../model/service/FollowService";
import { UserItemPresenter, UserItemView } from "./UserItemPresenter";
import { PAGE_SIZE } from "../components/mainLayout/UserItemScroller";
import { AuthToken } from "tweeter-shared";

export class FollowerPresenter extends UserItemPresenter {
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
      const [newItems, hasMore] = await this.followService.loadMoreFollowers(
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
        `Failed to load followers because of exception: ${error}`,
      );
    }
  }
}
