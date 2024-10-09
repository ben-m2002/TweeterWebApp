import { StatusItemPresenter, StatusItemView } from "./StatusItemPresenter";
import { AuthToken } from "tweeter-shared";
import { PAGE_SIZE } from "./StatusItemPresenter";

export class StoryPresenter extends StatusItemPresenter {
  constructor(view: StatusItemView) {
    super(view);
  }

  public async loadMoreItems(authToken: AuthToken, userAlias: string) {
    await this.doFailureReportOperation(async () => {
      const [newItems, hasMore] = await this.service.loadMoreStoryItems(
        authToken!,
        userAlias,
        PAGE_SIZE,
        this.lastItem,
      );

      this.hasMoreItems = hasMore;
      this.lastItem = newItems[newItems.length - 1];
      this.view.addItems(newItems);
    }, "load more story items");
  }
}
