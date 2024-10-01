import { StatusItemPresenter, StatusItemView } from "./StatusItemPresenter";
import { StatusService } from "../model/service/StatusService";
import { AuthToken } from "tweeter-shared";
import { PAGE_SIZE } from "../components/mainLayout/UserItemScroller";

export class StoryPresenter extends StatusItemPresenter {
  private statusService: StatusService;

  constructor(view: StatusItemView) {
    super(view);
    this.statusService = new StatusService();
  }

  public async loadMoreItems(authToken: AuthToken, userAlias: string) {
    try {
      const [newItems, hasMore] = await this.statusService.loadMoreStoryItems(
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
        `Failed to load story items because of exception: ${error}`,
      );
    }
  }
}
