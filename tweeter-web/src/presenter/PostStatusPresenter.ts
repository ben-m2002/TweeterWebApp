import { StatusService } from "../model/service/StatusService";
import { AuthToken, Status, User } from "tweeter-shared/src";
import { Presenter } from "./Presenter";
import { ItemChangePresenter, ItemChangeView } from "./ItemChangePresenter";

export interface PostStatusView extends ItemChangeView {
  setPost: (post: string) => void;
}

export class PostStatusPresenter extends ItemChangePresenter<PostStatusView> {
  private _statusService: StatusService | null = null;

  constructor(view: PostStatusView) {
    super(view);
  }

  get statusService(): StatusService {
    if (this._statusService === null) {
      this._statusService = new StatusService();
    }
    return this._statusService;
  }

  public setItemDescription(itemDescription: string) {
    this.itemDescription = itemDescription;
  }

  public async submitPost(
    event: React.MouseEvent,
    post: string,
    authToken: AuthToken,
    currentUser: User,
  ) {
    event.preventDefault();
    await this.doItemChangeOperation("Posting status...", async () => {
      this.setItemDescription("Posting status...");
      const status = new Status(post, currentUser!, Date.now());
      await this.statusService.postStatus(authToken!, status);
      this.view.setPost("");
      this.view.displayInfoMessage("Status posted!", 2000);
    });
  }
}
