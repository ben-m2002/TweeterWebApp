import { MessageView, Presenter } from "./Presenter";

export interface ItemChangeView extends MessageView {
  setIsLoading: (isLoading: boolean) => void;
}

export abstract class ItemChangePresenter<
  T extends ItemChangeView,
> extends Presenter<T> {
  protected async doItemChangeOperation(
    displayInfoMessage: string,
    operation: () => Promise<void>,
  ) {
    await this.doFailureReportOperation(async () => {
      this.view.setIsLoading(true);
      this.view.displayInfoMessage(displayInfoMessage, 0);
      await operation();
    });
    this.view.clearLastInfoMessage();
    this.view.setIsLoading(false);
  }
}
