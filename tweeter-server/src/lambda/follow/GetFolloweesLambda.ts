import { PagedUserItemRequest } from "tweeter-shared/src";
import { PagedUserItemResponse } from "tweeter-shared/src";
import { FollowService } from "../../model/service/FollowService";

export const handler = async (
  request: PagedUserItemRequest,
): Promise<PagedUserItemResponse> => {
  const followService = new FollowService();
  const [items, hasMore] = await followService.loadMoreFollowees(
    request.token,
    request.userAlias,
    request.pageSize,
    request.lastItem,
  );
  return {
    success: true,
    message: null,
    items: items,
    hasMore: hasMore,
  };
};
