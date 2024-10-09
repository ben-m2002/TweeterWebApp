import { UserItemPresenter, UserItemView } from "./UserItemPresenter";
import { PAGE_SIZE } from "./UserItemPresenter";
import { AuthToken } from "tweeter-shared";

export class FollowerPresenter extends UserItemPresenter {
  constructor(view: UserItemView) {
    super(view);
  }

  public async loadMoreItems(
    authToken: AuthToken,
    userAlias: string,
  ): Promise<void> {
    await this.doFailureReportOperation(async () => {
      const [newItems, hasMore] = await this.service.loadMoreFollowers(
        authToken!,
        userAlias!,
        PAGE_SIZE,
        this.lastItem,
      );

      this.hasMoreItems = hasMore;
      this.lastItem = newItems[newItems.length - 1];
      this.view.addItems(newItems);
    }, "load more followers");
  }
}
