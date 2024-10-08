import { StatusService } from "../model/service/StatusService";
import { AuthToken, Status, User } from "tweeter-shared";

export interface PostStatusView {
  setIsLoading: (isLoading: boolean) => void;
  displayInfoMessage: (message: string, duration: number) => void;
  setPost: (post: string) => void;
  displayErrorMessage: (message: string) => void;
  clearLastInfoMessage: () => void;
}

export class PostStatusPresenter {
  private _view: PostStatusView;
  private _statusService: StatusService;

  constructor(view: PostStatusView) {
    this._view = view;
    this._statusService = new StatusService();
  }

  get view(): PostStatusView {
    return this._view;
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

    try {
      this.view.setIsLoading(true);
      this.view.displayInfoMessage("Posting status...", 0);

      const status = new Status(post, currentUser!, Date.now());

      await this.statusService.postStatus(authToken!, status);

      this.view.setPost("");
      this.view.displayInfoMessage("Status posted!", 2000);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to post the status because of exception: ${error}`,
      );
    } finally {
      this.view.clearLastInfoMessage();
      this.view.setIsLoading(false);
    }
  }
}
