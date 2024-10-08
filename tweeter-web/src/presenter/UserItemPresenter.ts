import { AuthToken, User } from "tweeter-shared";
import { Presenter, View } from "./Presenter";

export interface UserItemView extends View {
  addItems: (newItems: User[]) => void;
}

export abstract class UserItemPresenter extends Presenter<UserItemView> {
  private _hasMoreItems: boolean = true;
  private _lastItem: User | null = null;

  protected constructor(view: UserItemView) {
    super(view);
  }

  public get hasMoreItems(): boolean {
    return this._hasMoreItems;
  }

  protected get lastItem(): User | null {
    return this._lastItem;
  }

  protected set hasMoreItems(hasMoreItems: boolean) {
    this._hasMoreItems = hasMoreItems;
  }

  protected set lastItem(lastItem: User | null) {
    this._lastItem = lastItem;
  }

  public abstract loadMoreItems(
    authToken: AuthToken | null,
    userAlias: string | null,
  ): Promise<void>;

  public reset(): void {
    this._lastItem = null;
    this._hasMoreItems = true;
  }
}
