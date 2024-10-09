import { Presenter, View } from "./Presenter";
import { AuthToken } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export interface ItemView<T> extends View {
  addItems: (newItems: T[]) => void;
}

export abstract class ItemPresenter<T, U> extends Presenter<ItemView<T>> {
  private _hasMoreItems: boolean = true;
  private _lastItem: T | null = null;
  private _service: U;

  protected constructor(view: ItemView<T>, serviceFactory: new () => U) {
    super(view);
    this._service = new serviceFactory();
  }

  public get hasMoreItems(): boolean {
    return this._hasMoreItems;
  }

  protected get lastItem(): T | null {
    return this._lastItem;
  }

  protected get service(): U {
    return this._service;
  }

  protected set hasMoreItems(hasMoreItems: boolean) {
    this._hasMoreItems = hasMoreItems;
  }

  protected set lastItem(lastItem: T | null) {
    this._lastItem = lastItem;
  }

  protected set service(service: U) {
    this._service = service;
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
