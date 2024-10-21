import "./Login.css";
import "bootstrap/dist/css/bootstrap.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import useToastListener from "../../toaster/ToastListenerHook";
import AuthenticationFields from "../AuthenticationFields";
import useAliasPassword from "../UseAliasPasswordHook";
import useUserInfo from "../../userInfo/UserInfoHook";
import { LoginPresenter, LoginView } from "../../../presenter/LoginPresenter";

interface Props {
  originalUrl?: string;
  presenter?: LoginPresenter;
}

const Login = (props: Props) => {
  const { alias, password, setAliasCallback, setPasswordCallback } =
    useAliasPassword();
  //const navigate = useNavigate();
  const { updateUserInfo } = useUserInfo();
  const { displayErrorMessage } = useToastListener();

  const listener: LoginView = {
    updateUserInfo: updateUserInfo,
    navigate: useNavigate(),
    displayErrorMessage: displayErrorMessage,
  };

  const [presenter] = useState(() => {
    return props.presenter ?? new LoginPresenter(listener);
  });

  const checkSubmitButtonStatus = (): boolean => {
    return !alias || !password;
  };

  const loginOnEnter = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key == "Enter" && !checkSubmitButtonStatus()) {
      doLogin();
    }
  };

  const doLogin = async () => {
    await presenter.doLogin(alias, password, props.originalUrl || "");
  };

  const inputFieldGenerator = () => {
    return (
      <>
        <AuthenticationFields
          callbackFunc={loginOnEnter}
          setAliasCallback={setAliasCallback}
          setPasswordCallback={setPasswordCallback}
        />
      </>
    );
  };

  const switchAuthenticationMethodGenerator = () => {
    return (
      <div className="mb-3">
        Not registered? <Link to="/register">Register</Link>
      </div>
    );
  };

  return (
    <AuthenticationFormLayout
      headingText="Please Sign In"
      submitButtonLabel="Sign in"
      oAuthHeading="Sign in with:"
      inputFieldGenerator={inputFieldGenerator}
      switchAuthenticationMethodGenerator={switchAuthenticationMethodGenerator}
      setRememberMe={(value) => (presenter.rememberMe = value)}
      submitButtonDisabled={checkSubmitButtonStatus}
      isLoading={presenter.isLoading}
      submit={doLogin}
    />
  );
};

export default Login;
