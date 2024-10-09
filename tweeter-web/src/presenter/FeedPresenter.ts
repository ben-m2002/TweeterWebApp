import { AuthToken, Status, User } from "tweeter-shared";
import { StatusItemPresenter, StatusItemView } from "./StatusItemPresenter";
import { PAGE_SIZE } from "./StatusItemPresenter";

export class FeedPresenter extends StatusItemPresenter {
  constructor(view: StatusItemView) {
    super(view);
  }

  protected getItemDescription(): string {
    return "load more feed items";
  }

  protected serviceLoadMoreItems(): (
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null,
  ) => Promise<[Status[], boolean]> {
    return this.service.loadMoreFeedItems;
  }
}
