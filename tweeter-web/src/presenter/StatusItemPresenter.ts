import { useState } from "react";
import { AuthToken, Status } from "tweeter-shared";
import { Presenter, View } from "./Presenter";

export interface StatusItemView extends View {
  addItems(newItems: Status[]): void;
}

export abstract class StatusItemPresenter extends Presenter<StatusItemView> {
  private _hasMoreItems: boolean = true;
  private _lastItem: Status | null = null;

  constructor(view: StatusItemView) {
    super(view);
  }

  public get hasMoreItems(): boolean {
    return this._hasMoreItems;
  }

  public get lastItem(): Status | null {
    return this._lastItem;
  }

  public set hasMoreItems(hasMoreItems: boolean) {
    this._hasMoreItems = hasMoreItems;
  }

  public set lastItem(lastItem: Status | null) {
    this._lastItem = lastItem;
  }

  public abstract loadMoreItems(
    authToken: AuthToken,
    userAlias: string,
  ): Promise<void>;

  public reset() {
    this._hasMoreItems = true;
    this._lastItem = null;
  }
}
