import InfiniteScroll from "react-infinite-scroll-component";
import StatusItem from "../statusItem/statusItem";
import { AuthToken, Status } from "tweeter-shared";
import useToastListener from "../toaster/ToastListenerHook";
import { useContext, useEffect, useState } from "react";
import useUserInfo from "../userInfo/UserInfoHook";
import {
  StatusItemPresenter,
  StatusItemView,
} from "../../presenter/StatusItemPresenter";
//import { UserInfoContext } from "../userInfo/UserInfoProvider";
const PAGE_SIZE = 10;

interface Props {
  generatePresenter: (view: StatusItemView) => StatusItemPresenter;
}

const StatusItemScroller = ({ generatePresenter }: Props) => {
  const { displayErrorMessage } = useToastListener();
  const [items, setItems] = useState<Status[]>([]);
  const [newItems, setNewItems] = useState<Status[]>([]);
  const [changedDisplayedUser, setChangedDisplayedUser] = useState(true);
  const { displayedUser, setDisplayedUser, currentUser, authToken } =
    useUserInfo();

  const listener: StatusItemView = {
    addItems: (newItems: Status[]) => setNewItems(newItems),
    displayErrorMessage: displayErrorMessage,
  };

  const [presenter] = useState(() => generatePresenter(listener));

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
    setChangedDisplayedUser(true);
    presenter.reset();
  };

  const loadMoreItems = async () => {
    setChangedDisplayedUser(false);
    await presenter.loadMoreItems(authToken!, displayedUser!.alias);
  };

  return (
    <>
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
              <StatusItem item={item} />
            </div>
          ))}
        </InfiniteScroll>
      </div>
    </>
  );
};

export default StatusItemScroller;
