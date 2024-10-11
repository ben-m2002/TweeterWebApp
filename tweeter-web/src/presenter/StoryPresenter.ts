import { StatusItemPresenter, StatusItemView } from "./StatusItemPresenter";
import { AuthToken, Status } from "tweeter-shared";
import { PAGE_SIZE } from "./StatusItemPresenter";

export class StoryPresenter extends StatusItemPresenter {
  constructor(view: StatusItemView) {
    super(view);
  }

  protected serviceLoadMoreItems(): (
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null,
  ) => Promise<[Status[], boolean]> {
    this.itemDescription = "load more story items";
    return this.service.loadMoreStoryItems.bind(this.service);
  }
}
