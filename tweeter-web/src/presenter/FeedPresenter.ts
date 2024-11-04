import { AuthToken, Status, User } from "tweeter-shared/src";
import { StatusItemPresenter, StatusItemView } from "./StatusItemPresenter";
import { PAGE_SIZE } from "./StatusItemPresenter";

export class FeedPresenter extends StatusItemPresenter {
  constructor(view: StatusItemView) {
    super(view);
  }

  protected serviceLoadMoreItems(): (
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null,
  ) => Promise<[Status[], boolean]> {
    this.itemDescription = "load more feed items";
    return this.service.loadMoreFeedItems.bind(this.service);
  }
}
