import { AuthToken } from "tweeter-shared";
import { PAGE_SIZE } from "../components/mainLayout/UserItemScroller";

export interface View {
  displayErrorMessage: (message: string) => void;
}

export interface MessageView extends View {
  displayInfoMessage(message: string, duration: number): void;
  clearLastInfoMessage(): void;
}

export class Presenter<T extends View> {
  private _view: T;

  protected constructor(view: T) {
    this._view = view;
  }

  public get view(): T {
    return this._view;
  }

  public async doFailureReportOperation(
    operation: () => Promise<void>,
    operationDescription: string,
  ): Promise<void> {
    try {
      await operation();
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to ${operationDescription} because of exception: ${error}`,
      );
    }
  }
}
