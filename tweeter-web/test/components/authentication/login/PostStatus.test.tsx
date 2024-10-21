import PostStatus from "../../../../src/components/postStatus/PostStatus";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import useUserInfo from "../../../../src/components/userInfo/UserInfoHook";
import { anything, capture, instance, mock, verify } from "ts-mockito";
import { AuthToken, User } from "tweeter-shared";
import { PostStatusPresenter } from "../../../../src/presenter/PostStatusPresenter";

jest.mock("../../../../src/components/userInfo/UserInfoHook", () => ({
  ...jest.requireActual("../../../../src/components/userInfo/UserInfoHook"),
  __esModule: true,
  default: jest.fn(),
})); // mock the UserInfoHook

describe("PostStatus", () => {
  beforeAll(() => {
    (useUserInfo as jest.Mock).mockReturnValue({
      currentUser: instance(mock(User)),
      authToken: instance(mock(AuthToken)),
    });
  });

  it("should render with post status button and clear button disabled", async () => {
    const { postStatusButton, clearStatusButton } = await getPostStatusItems();
    expect(postStatusButton).toBeDisabled();
    expect(clearStatusButton).toBeDisabled();
  });

  it("should enable post status button and clear button when text field has text", async () => {
    const { user, postStatusTextArea, postStatusButton, clearStatusButton } =
      await getPostStatusItems();
    await user.type(postStatusTextArea, "Hello");
    expect(postStatusButton).toBeEnabled();
    expect(clearStatusButton).toBeEnabled();
  });

  it("should disable post status button and clear button when text field is cleared", async () => {
    const { user, postStatusTextArea, postStatusButton, clearStatusButton } =
      await getPostStatusItems();
    await user.type(postStatusTextArea, "Hello");
    await user.clear(postStatusTextArea);
    expect(postStatusButton).toBeDisabled();
    expect(clearStatusButton).toBeDisabled();
  });

  it("should call presenter postStatus method when post status button is clicked", async () => {
    const mockPresenter = mock(PostStatusPresenter);
    const presenter = instance(mockPresenter);
    const { user, postStatusTextArea, postStatusButton } =
      await getPostStatusItems(presenter);
    await user.type(postStatusTextArea, "Hello");
    await user.click(postStatusButton);
    verify(
      mockPresenter.submitPost(anything(), "Hello", anything(), anything()),
    ).once();
    const [_, post] = capture(mockPresenter.submitPost).last();
    expect(post).toEqual("Hello");
  });
});

const renderPostStatus = (presenter?: PostStatusPresenter) => {
  render(
    <MemoryRouter>
      {!!presenter ? <PostStatus presenter={presenter} /> : <PostStatus />}
    </MemoryRouter>,
  );
};

const getPostStatusItems = async (presenter?: PostStatusPresenter) => {
  const user = userEvent.setup();
  renderPostStatus(presenter);
  const postStatusTextArea = await screen.findByTestId("postStatusTextArea");
  const postStatusButton = await screen.findByTestId("postStatusButton");
  const clearStatusButton = await screen.findByTestId("clearStatusButton");
  return { user, postStatusTextArea, postStatusButton, clearStatusButton };
};
