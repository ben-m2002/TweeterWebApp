import { AuthToken, User } from "tweeter-shared";

export interface UserItemView {
  addItems: (newItems: User[]) => void;
  displayErrorMessage: (message: string) => void;
}

export abstract class UserItemPresenter {
  private _view: UserItemView;
  private _hasMoreItems: boolean = true;
  private _lastItem: User | null = null;

  protected constructor(view: UserItemView) {
    this._view = view;
  }

  protected get view(): UserItemView {
    return this._view;
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
