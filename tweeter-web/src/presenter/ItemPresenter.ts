import { Presenter, View } from "./Presenter";
import { AuthToken } from "tweeter-shared/src";

export const PAGE_SIZE: number = 10;

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

  public async loadMoreItems(
    authToken: AuthToken,
    userAlias: string,
  ): Promise<void> {
    const loadMoreItemsFunction = this.serviceLoadMoreItems();
    await this.doFailureReportOperation(async () => {
      const [newItems, hasMore] = await loadMoreItemsFunction(
        authToken!,
        userAlias!,
        PAGE_SIZE,
        this.lastItem,
      );
      this.hasMoreItems = hasMore;
      this.lastItem = newItems[newItems.length - 1];
      this.view.addItems(newItems);
    });
  }

  protected abstract serviceLoadMoreItems(): (
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: T | null,
  ) => Promise<[T[], boolean]>;

  public reset(): void {
    this._lastItem = null;
    this._hasMoreItems = true;
  }
}
