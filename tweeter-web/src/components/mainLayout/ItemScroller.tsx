import { ItemPresenter, ItemView } from "../../presenter/ItemPresenter";
import useToastListener from "../toaster/ToastListenerHook";
import { ReactNode, useEffect, useState } from "react";
import { User } from "tweeter-shared";
import useUserInfo from "../userInfo/UserInfoHook";
import { UserItemView } from "../../presenter/UserItemPresenter";
import InfiniteScroll from "react-infinite-scroll-component";
import UserItem from "../userItem/UserItem";

// T is like User or Status, U is like FolloweeService or FollowerService, V is like UserItem or StatusItem
interface props<T, U, V extends ReactNode> {
  presenterGenerator: (view: ItemView<T>) => ItemPresenter<T, U>;
  itemGenerator: (value: T) => V;
}

export const ItemScroller = <T, U, V extends ReactNode>(
  props: props<T, U, V>,
) => {
  const { displayErrorMessage } = useToastListener();
  const [items, setItems] = useState<T[]>([]);
  const [newItems, setNewItems] = useState<T[]>([]);
  const [changedDisplayedUser, setChangedDisplayedUser] = useState(true);
  const { displayedUser, authToken } = useUserInfo();

  const listener: ItemView<T> = {
    addItems: (newItems: T[]) => setNewItems(newItems),
    displayErrorMessage: displayErrorMessage,
  };

  const [presenter] = useState(() => props.presenterGenerator(listener));

  // Initialize the component whenever the displayed user changes
  useEffect(() => {
    reset();
  }, [displayedUser]);

  // Load initial items whenever the displayed user changes. Done in a separate useEffect hook so the changes from reset will be visible.
  useEffect(() => {
    if (changedDisplayedUser) {
      loadMoreItems();
    }
  }, [changedDisplayedUser]);

  // Add new items whenever there are new items to add
  useEffect(() => {
    if (newItems) {
      setItems([...items, ...newItems]);
    }
  }, [newItems]);

  const reset = async () => {
    setItems([]);
    setNewItems([]);
    presenter.reset();
    setChangedDisplayedUser(true);
  };

  const loadMoreItems = async () => {
    await presenter.loadMoreItems(authToken!, displayedUser!.alias);
    setChangedDisplayedUser(false);
  };

  return (
    <div className="container px-0 overflow-visible vh-100">
      <InfiniteScroll
        className="pr-0 mr-0"
        dataLength={items.length}
        next={loadMoreItems}
        hasMore={presenter.hasMoreItems}
        loader={<h4>Loading...</h4>}
      >
        {items.map((item, index) => (
          <div
            key={index}
            className="row mb-3 mx-0 px-0 border rounded bg-white"
          >
            {props.itemGenerator(item)}
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
};
