import Login from "../../../../src/components/authentication/login/Login";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { LoginPresenter } from "../../../../src/presenter/LoginPresenter";

import { instance, mock, verify, capture, anything } from "ts-mockito";

library.add(fab);

describe("Login component", () => {
  // jest.mock("../../../components/authentication/UseAliasPasswordHook", () => {
  //   return jest.fn(() => {
  //     return {
  //       alias: "testAlias",
  //       password: "testPassword",
  //       setAliasCallback: jest.fn(),
  //       setPasswordCallback: jest.fn(),
  //     };
  //   });
  // });

  it("starts with the sign in button disabled", () => {
    const { submitButton } = renderLoginAndGetElement("/");
    expect(submitButton).toBeDisabled();
  });

  it("enables the sign in button when the alias and password are entered", async () => {
    const { user, aliasInput, passwordInput, submitButton } =
      renderLoginAndGetElement("/");
    await user.type(await aliasInput, "testAlias");
    await user.type(await passwordInput, "testPassword");
    expect(submitButton).toBeEnabled();
  });

  it("disables the sign-in button when alias or password is cleared", async () => {
    const { user, aliasInput, passwordInput, submitButton } =
      renderLoginAndGetElement("/");
    await user.type(await aliasInput, "testAlias");
    await user.type(await passwordInput, "testPassword");
    await user.clear(await aliasInput);
    expect(submitButton).toBeDisabled();
    await user.type(await aliasInput, "testAlias");
    expect(submitButton).toBeEnabled();
    await user.clear(await passwordInput);
    expect(submitButton).toBeDisabled();
  });

  it("calls the presenters login method with correct parameters", async () => {
    const mockPresenter = mock(LoginPresenter);
    const presenter = instance(mockPresenter);
    const { user, aliasInput, passwordInput, submitButton } =
      renderLoginAndGetElement("/", presenter);
    await user.type(await aliasInput, "testAlias");
    await user.type(await passwordInput, "testPassword");
    await user.click(await submitButton);
    verify(mockPresenter.doLogin("testAlias", "testPassword", "/")).once();
    const [aliasArg, passwordArg, originalUrl] = capture(
      mockPresenter.doLogin,
    ).last();
    expect(aliasArg).toEqual("testAlias");
    expect(passwordArg).toEqual("testPassword");
  });
});

const renderLogin = (originalUrl?: string, presenter?: LoginPresenter) => {
  return render(
    <MemoryRouter>
      {!!presenter ? (
        <Login originalUrl={originalUrl} presenter={presenter} />
      ) : (
        <Login originalUrl={originalUrl} />
      )}
    </MemoryRouter>,
  );
};

const renderLoginAndGetElement = (
  originalUrl?: string,
  presenter?: LoginPresenter,
) => {
  const user = userEvent.setup();
  renderLogin(originalUrl, presenter);
  const aliasInput = screen.findByTestId("aliasInput");
  const passwordInput = screen.findByTestId("passwordInput");
  const submitButton = screen.getByRole("button", { name: /Sign in/i });

  return { user, aliasInput, passwordInput, submitButton };
};
