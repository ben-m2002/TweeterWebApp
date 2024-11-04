import { Status } from "tweeter-shared/src";
import { ItemPresenter, ItemView } from "./ItemPresenter";
import { StatusService } from "../model/service/StatusService";

export const PAGE_SIZE = 10;

export interface StatusItemView extends ItemView<Status> {}

export abstract class StatusItemPresenter extends ItemPresenter<
  Status,
  StatusService
> {
  protected constructor(view: StatusItemView) {
    super(view, StatusService);
  }
}
