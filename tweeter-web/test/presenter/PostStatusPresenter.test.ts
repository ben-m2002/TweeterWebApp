import {
  instance,
  mock,
  verify,
  spy,
  when,
  capture,
  anything,
} from "ts-mockito";
import {
  PostStatusPresenter,
  PostStatusView,
} from "../../src/presenter/PostStatusPresenter";
import { StatusService } from "../../src/model/service/StatusService";
import { AuthToken, User } from "tweeter-shared";

describe("PostStatusPresenter", () => {
  let mockView: PostStatusView;
  let mockViewInstance: PostStatusView;
  let mockStatusService: StatusService;
  let mockStatusServiceInstance: StatusService;
  let presenter: PostStatusPresenter;
  let user: User = new User("Ben", "M", "ben@gmail.com", "");
  let authToken: AuthToken = new AuthToken("token", Date.now());

  beforeEach(() => {
    mockView = mock<PostStatusView>();
    mockViewInstance = instance(mockView);
    mockStatusService = mock(StatusService);
    mockStatusServiceInstance = instance(mockStatusService);
    const spyPresenter = spy(new PostStatusPresenter(mockViewInstance));
    presenter = instance(spyPresenter);
    when(spyPresenter.statusService).thenReturn(mockStatusServiceInstance);
    when(spyPresenter.setItemDescription("Posting status...")).thenCall(() => {
      // Do nothing
    });
  });

  async function sumbitPost() {
    await presenter.submitPost(
      new MouseEvent("click") as unknown as React.MouseEvent,
      "Hello",
      authToken,
      user,
    );
  }

  it("tells the view to display a posting status message", async () => {
    await sumbitPost();
    verify(mockView.setPost(anything())).once();
  });

  it("calls postStatus on the post service with correct authToken and status", async () => {
    await sumbitPost();
    verify(mockStatusService.postStatus(authToken, anything())).once();
    const [authTokenArg, statusArg] = capture(
      mockStatusService.postStatus,
    ).last();
    expect(authTokenArg).toEqual(authToken);
    expect(statusArg.post).toEqual("Hello");
  });

  it("tells the view to clear the last info message, clear the post, and display a status posted message", async () => {
    await sumbitPost();
    verify(mockView.clearLastInfoMessage()).once();
    verify(mockView.setPost("")).once();
    verify(mockView.displayInfoMessage("Status posted!", anything())).once();
    verify(mockView.displayErrorMessage(anything())).never();
  });

  it("tells view to display an error message and clear the last info message and does not tell it to clear the post or display a status posted message", async () => {
    when(mockStatusService.postStatus(authToken, anything())).thenReject(
      new Error("Error"),
    );
    await sumbitPost();
    verify(
      mockView.displayErrorMessage(
        "Failed to  because of exception: Error: Error",
      ),
    ).once();
    verify(mockView.clearLastInfoMessage()).once();
    verify(mockView.setPost("")).never();
    verify(mockView.displayInfoMessage("Status posted!", anything())).never();
  });
});
