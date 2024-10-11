export interface View {
  displayErrorMessage: (message: string) => void;
}

export interface MessageView extends View {
  displayInfoMessage(message: string, duration: number): void;
  clearLastInfoMessage(): void;
}

export abstract class Presenter<T extends View> {
  private _view: T;
  private _itemDescription: string = "";

  protected constructor(view: T) {
    this._view = view;
  }

  public get view(): T {
    return this._view;
  }

  public get itemDescription(): string {
    return this._itemDescription;
  }

  public set itemDescription(value: string) {
    this._itemDescription = value;
  }

  public async doFailureReportOperation(
    operation: () => Promise<void>,
  ): Promise<void> {
    try {
      await operation();
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to ${this.itemDescription} because of exception: ${error}`,
      );
    }
  }
}
