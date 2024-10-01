import { useState } from "react";
import { AuthToken, Status } from "tweeter-shared";

export interface StatusItemView {
  addItems(newItems: Status[]): void;
  displayErrorMessage(message: string): void;
}

export abstract class StatusItemPresenter {
  private _view: StatusItemView;
  private _hasMoreItems: boolean = true;
  private _lastItem: Status | null = null;

  constructor(view: StatusItemView) {
    this._view = view;
  }

  protected get view(): StatusItemView {
    return this._view;
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
