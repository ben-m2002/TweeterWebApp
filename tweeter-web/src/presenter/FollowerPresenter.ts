import { UserItemPresenter, UserItemView } from "./UserItemPresenter";
import { PAGE_SIZE } from "./UserItemPresenter";
import { AuthToken, User } from "tweeter-shared";

export class FollowerPresenter extends UserItemPresenter {
  constructor(view: UserItemView) {
    super(view);
  }

  protected serviceLoadMoreItems(): (
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null,
  ) => Promise<[User[], boolean]> {
    this.itemDescription = "load more followers";
    return this.service.loadMoreFollowers.bind(this.service);
  }
}
