import { StatusService } from "../model/service/StatusService";
import { AuthToken, Status, User } from "tweeter-shared";
import { Presenter, View } from "./Presenter";

export interface PostStatusView extends View {
  setIsLoading: (isLoading: boolean) => void;
  displayInfoMessage: (message: string, duration: number) => void;
  setPost: (post: string) => void;
  clearLastInfoMessage: () => void;
}

export class PostStatusPresenter extends Presenter<PostStatusView> {
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
    await this.doFailureReportOperation(async () => {
      this.view.setIsLoading(true);
      this.view.displayInfoMessage("Posting status...", 0);

      const status = new Status(post, currentUser!, Date.now());

      await this.statusService.postStatus(authToken!, status);

      this.view.setPost("");
      this.view.displayInfoMessage("Status posted!", 2000);
    }, "post status");

    this.view.clearLastInfoMessage();
    this.view.setIsLoading(false);
  }
}
