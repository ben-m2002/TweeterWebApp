import { FollowService } from "../model/service/FollowService";
import { AuthToken, User } from "tweeter-shared";
import { MessageView, Presenter, View } from "./Presenter";

export interface UserInfoView extends MessageView {
  setIsFollower(isFollower: boolean): void;
  setIsLoading(isLoading: boolean): void;
  setFolloweeCount(count: number): void;
  setFollowerCount(count: number): void;
}

export class UserInfoPresenter extends Presenter<UserInfoView> {
  private _followService: FollowService;

  constructor(view: UserInfoView) {
    super(view);
    this._followService = new FollowService();
  }

  get followService(): FollowService {
    return this._followService;
  }

  public async setIsFollowerStatus(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User,
  ) {
    await this.doFailureReportOperation(async () => {
      if (currentUser === displayedUser) {
        this.view.setIsFollower(false);
      } else {
        this.view.setIsFollower(
          await this.followService.getIsFollowerStatus(
            authToken!,
            currentUser!,
            displayedUser!,
          ),
        );
      }
    }, "determine follower status");
  }

  public async setNumbFollowees(authToken: AuthToken, displayedUser: User) {
    await this.doFailureReportOperation(async () => {
      this.view.setFolloweeCount(
        await this.followService.getFolloweeCount(authToken, displayedUser),
      );
    }, "get followees count");
  }

  public async setNumbFollowers(authToken: AuthToken, displayedUser: User) {
    await this.doFailureReportOperation(async () => {
      this.view.setFollowerCount(
        await this.followService.getFollowerCount(authToken, displayedUser),
      );
    }, "get followers count");
  }

  public async followDisplayedUser(
    event: React.MouseEvent,
    authToken: AuthToken,
    displayedUser: User,
  ): Promise<void> {
    event.preventDefault();
    await this.doFailureReportOperation(async () => {
      this.view.setIsLoading(true);
      this.view.displayInfoMessage(`Following ${displayedUser!.name}...`, 0);

      const [followerCount, followeeCount] = await this.followService.follow(
        authToken!,
        displayedUser!,
      );

      this.view.setIsFollower(true);
      this.view.setFollowerCount(followerCount);
      this.view.setFolloweeCount(followeeCount);
    }, "follow user");
    this.view.clearLastInfoMessage();
    this.view.setIsLoading(false);
  }

  public async unfollowDisplayedUser(
    event: React.MouseEvent,
    authToken: AuthToken,
    displayedUser: User,
  ): Promise<void> {
    event.preventDefault();
    await this.doFailureReportOperation(async () => {
      this.view.setIsLoading(true);
      this.view.displayInfoMessage(`Unfollowing ${displayedUser!.name}...`, 0);

      const [followerCount, followeeCount] = await this.followService.unfollow(
        authToken!,
        displayedUser!,
      );

      this.view.setIsFollower(false);
      this.view.setFollowerCount(followerCount);
      this.view.setFolloweeCount(followeeCount);
    }, "unfollow user");
    this.view.clearLastInfoMessage();
    this.view.setIsLoading(false);
  }
}
