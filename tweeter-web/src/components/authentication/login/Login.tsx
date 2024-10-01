import "./Login.css";
import "bootstrap/dist/css/bootstrap.css";
import { SetStateAction, useCallback, useContext } from "react";
//import { UserInfoContext } from "../../userInfo/UserInfoProvider";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import { AuthToken, FakeData, User } from "tweeter-shared";
import useToastListener from "../../toaster/ToastListenerHook";
import AuthenticationFields from "../AuthenticationFields";
import useAliasPassword from "../UseAliasPasswordHook.js";
import useUserInfo from "../../userInfo/UserInfoHook";

interface Props {
  originalUrl?: string;
}

const Login = (props: Props) => {
  const { alias, password, setAliasCallback, setPasswordCallback } =
    useAliasPassword();
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { updateUserInfo } = useUserInfo();
  const { displayErrorMessage } = useToastListener();

  const checkSubmitButtonStatus = (): boolean => {
    return !alias || !password;
  };

  const loginOnEnter = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key == "Enter" && !checkSubmitButtonStatus()) {
      doLogin();
    }
  };

  const doLogin = async () => {
    try {
      setIsLoading(true);

      const [user, authToken] = await login(alias, password);

      updateUserInfo(user, user, authToken, rememberMe);

      if (!!props.originalUrl) {
        navigate(props.originalUrl);
      } else {
        navigate("/");
      }
    } catch (error) {
      displayErrorMessage(
        `Failed to log user in because of exception: ${error}`,
      );
    } finally {
      setIsLoading(false);
    }
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
      setRememberMe={setRememberMe}
      submitButtonDisabled={checkSubmitButtonStatus}
      isLoading={isLoading}
      submit={doLogin}
    />
  );
};

export default Login;
