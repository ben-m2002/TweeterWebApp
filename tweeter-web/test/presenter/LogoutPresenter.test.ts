import {
  LogoutPresenter,
  LogoutView,
} from "../../src/presenter/LogoutPresenter";
import {
  instance,
  mock,
  verify,
  spy,
  when,
  capture,
  anything,
} from "ts-mockito";
import { AuthToken } from "tweeter-shared";
import { UserService } from "../../src/model/service/UserService";

describe("LogoutPresenter", () => {
  let mockView: LogoutView;
  let mockUserService: UserService;
  let spyPresenter: LogoutPresenter;
  let logoutPresenter: LogoutPresenter;
  const authToken = new AuthToken("token", Date.now());

  beforeEach(() => {
    mockView = mock<LogoutView>();
    spyPresenter = spy(new LogoutPresenter(instance(mockView)));
    mockUserService = mock(UserService);

    // Correctly mock the user service
    when(spyPresenter.userService).thenReturn(instance(mockUserService));
    when(spyPresenter.setItemDescription("Logging Out...")).thenCall(() => {
      // Do nothing
    });

    // Use the spy instance in the test
    logoutPresenter = instance(spyPresenter);
  });

  it("tells the view to display a logging out message", async () => {
    await logoutPresenter.logOut(authToken);
    verify(mockView.displayInfoMessage("Logging Out...", 0)).once();
  });

  it("calls logout on the user service with correct authToken", async () => {
    await logoutPresenter.logOut(authToken);
    verify(mockUserService.logout(authToken)).once();
    capture(mockUserService.logout).last();
    expect(capture(mockUserService.logout).last()[0]).toEqual(authToken);
  });

  it("tells the view to clear the last info message, clear the post, and display a status posted message.", async () => {
    await logoutPresenter.logOut(authToken);
    verify(mockView.clearLastInfoMessage()).once();
    verify(mockView.clearUserInfo()).once();
    verify(mockView.displayErrorMessage(anything())).never();
  });

  it("tells the view to display an error message and does not clear the last info message or clear user info", async () => {
    when(mockUserService.logout(authToken)).thenReject(new Error("Error"));
    await logoutPresenter.logOut(authToken);
    verify(
      mockView.displayErrorMessage(
        "Failed to  because of exception: Error: Error",
      ),
    ).once();
    verify(mockView.clearLastInfoMessage()).never();
    verify(mockView.clearUserInfo()).never();
  });
});
