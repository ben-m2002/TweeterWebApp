import { AuthToken, Status } from "tweeter-shared";
import { StatusItemPresenter, StatusItemView } from "./StatusItemPresenter";
import { StatusService } from "../model/service/StatusService";
import { PAGE_SIZE } from "../components/mainLayout/UserItemScroller";

export class FeedPresenter extends StatusItemPresenter {
  private statusService: StatusService;

  constructor(view: StatusItemView) {
    super(view);
    this.statusService = new StatusService();
  }

  public async loadMoreItems(authToken: AuthToken, userAlias: string) {
    try {
      const [newItems, hasMore] = await this.statusService.loadMoreFeedItems(
        authToken!,
        userAlias,
        PAGE_SIZE,
        this.lastItem,
      );

      this.hasMoreItems = hasMore;
      this.lastItem = newItems[newItems.length - 1];
      this.view.addItems(newItems);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to load feed items because of exception: ${error}`,
      );
    }
  }
}