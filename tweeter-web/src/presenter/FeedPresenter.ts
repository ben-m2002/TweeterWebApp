import { AuthToken } from "tweeter-shared";
import { StatusItemPresenter, StatusItemView } from "./StatusItemPresenter";
import { PAGE_SIZE } from "./StatusItemPresenter";

export class FeedPresenter extends StatusItemPresenter {
  constructor(view: StatusItemView) {
    super(view);
  }

  public async loadMoreItems(authToken: AuthToken, userAlias: string) {
    await this.doFailureReportOperation(async () => {
      const [newItems, hasMore] = await this.service.loadMoreFeedItems(
        authToken!,
        userAlias,
        PAGE_SIZE,
        this.lastItem,
      );
      this.hasMoreItems = hasMore;
      this.lastItem = newItems[newItems.length - 1];
      this.view.addItems(newItems);
    }, "load feed items");
  }
}
