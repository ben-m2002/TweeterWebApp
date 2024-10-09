import { User } from "tweeter-shared";
import { ItemPresenter, ItemView } from "./ItemPresenter";
import { FollowService } from "../model/service/FollowService";

export const PAGE_SIZE = 10;

export interface UserItemView extends ItemView<User> {}

export abstract class UserItemPresenter extends ItemPresenter<
  User,
  FollowService
> {
  protected constructor(view: UserItemView) {
    super(view, FollowService);
  }
}
