import { StatusService } from "../model/service/StatusService";
import { AuthToken, Status, User } from "tweeter-shared";
import { Presenter } from "./Presenter";
import { ItemChangePresenter, ItemChangeView } from "./ItemChangePresenter";

export interface PostStatusView extends ItemChangeView {
  setPost: (post: string) => void;
}

export class PostStatusPresenter extends ItemChangePresenter<PostStatusView> {
  private _statusService: StatusService;

  constructor(view: PostStatusView) {
    super(view);
    this._statusService = new StatusService();
  }

  get statusService(): StatusService {
    return this._statusService;
  }

  public async submitPost(
    event: React.MouseEvent,
    post: string,
    authToken: AuthToken,
    currentUser: User,
  ) {
    event.preventDefault();
    await this.doItemChangeOperation("Posting status...", async () => {
      this.itemDescription = "post status";
      const status = new Status(post, currentUser!, Date.now());
      await this.statusService.postStatus(authToken!, status);
      this.view.setPost("");
      this.view.displayInfoMessage("Status posted!", 2000);
    });
  }
}
