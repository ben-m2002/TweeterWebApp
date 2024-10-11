import { FollowService } from "../model/service/FollowService";
import { AuthToken, User } from "tweeter-shared";
import { ItemChangePresenter, ItemChangeView } from "./ItemChangePresenter";

export interface UserInfoView extends ItemChangeView {
  setIsFollower(isFollower: boolean): void;
  setFolloweeCount(count: number): void;
  setFollowerCount(count: number): void;
}

export class UserInfoPresenter extends ItemChangePresenter<UserInfoView> {
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
      this.itemDescription = "determine follower status";
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
    });
  }

  public async setNumbFollowees(authToken: AuthToken, displayedUser: User) {
    await this.doFailureReportOperation(async () => {
      this.itemDescription = "get followees count";
      this.view.setFolloweeCount(
        await this.followService.getFolloweeCount(authToken, displayedUser),
      );
    });
  }

  public async setNumbFollowers(authToken: AuthToken, displayedUser: User) {
    await this.doFailureReportOperation(async () => {
      this.itemDescription = "get followers count";
      this.view.setFollowerCount(
        await this.followService.getFollowerCount(authToken, displayedUser),
      );
    });
  }

  private async followOrUnfollowDisplayedUser(
    type: string,
    event: React.MouseEvent,
    authToken: AuthToken,
    displayedUser: User,
  ) {
    event.preventDefault();
    await this.doItemChangeOperation(
      `${type}ing ${displayedUser!.name}...`,
      async () => {
        let operation;
        if (type === "follow") {
          operation = this.followOperation();
          this.itemDescription = "follow user";
        } else {
          operation = this.unfollowOperation();
          this.itemDescription = "unfollow user";
        }
        const [followerCount, followeeCount] = await operation(
          authToken!,
          displayedUser!,
        );
        if (type === "follow") {
          this.view.setIsFollower(true);
        } else {
          this.view.setIsFollower(false);
        }
        this.view.setFollowerCount(followerCount);
        this.view.setFolloweeCount(followeeCount);
      },
    );
  }

  public async followDisplayedUser(
    event: React.MouseEvent,
    authToken: AuthToken,
    displayedUser: User,
  ): Promise<void> {
    await this.followOrUnfollowDisplayedUser(
      "follow",
      event,
      authToken,
      displayedUser,
    );
  }

  public async unfollowDisplayedUser(
    event: React.MouseEvent,
    authToken: AuthToken,
    displayedUser: User,
  ): Promise<void> {
    await this.followOrUnfollowDisplayedUser(
      "unfollow",
      event,
      authToken,
      displayedUser,
    );
  }

  protected followOperation(): (
    authToken: AuthToken,
    userToFollow: User,
  ) => Promise<[number, number]> {
    return this.followService.follow.bind(this.followService);
  }

  protected unfollowOperation(): (
    authToken: AuthToken,
    userToUnfollow: User,
  ) => Promise<[number, number]> {
    return this.followService.unfollow.bind(this.followService);
  }
}
