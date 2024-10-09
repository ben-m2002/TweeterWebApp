import { UserItemPresenter, UserItemView } from "./UserItemPresenter";
import { PAGE_SIZE } from "./UserItemPresenter";
import { AuthToken, User } from "tweeter-shared";

export class FolloweePresenter extends UserItemPresenter {
  constructor(view: UserItemView) {
    super(view);
  }

  protected getItemDescription(): string {
    return "load more followees";
  }

  protected serviceLoadMoreItems(): (
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null,
  ) => Promise<[User[], boolean]> {
    return this.service.loadMoreFollowees;
  }
}
