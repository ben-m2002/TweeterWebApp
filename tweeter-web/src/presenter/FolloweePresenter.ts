import { UserItemPresenter, UserItemView } from "./UserItemPresenter";
import { PAGE_SIZE } from "./UserItemPresenter";
import { AuthToken, User } from "tweeter-shared/src";

export class FolloweePresenter extends UserItemPresenter {
  constructor(view: UserItemView) {
    super(view);
  }

  protected serviceLoadMoreItems(): (
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null,
  ) => Promise<[User[], boolean]> {
    this.itemDescription = "load more followees";
    return this.service.loadMoreFollowees.bind(this.service);
  }
}
