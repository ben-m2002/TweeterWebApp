import React from "react";

interface Props {
  callbackFunc: (event: React.KeyboardEvent<HTMLElement>) => void;
  setAliasCallback: (newAlias: string) => void;
  setPasswordCallback: (newPassword: string) => void;
}

const AuthenticationFields = ({
  callbackFunc,
  setAliasCallback,
  setPasswordCallback,
}: Props) => {
  return (
    <>
      <div className="form-floating">
        <input
          type="text"
          className="form-control"
          size={50}
          id="aliasInput"
          placeholder="name@example.com"
          onKeyDown={callbackFunc}
          onChange={(event) => setAliasCallback(event.target.value)}
        />
        <label htmlFor="aliasInput">Alias</label>
      </div>
      <div className="form-floating mb-3">
        <input
          type="password"
          className="form-control bottom"
          id="passwordInput"
          placeholder="Password"
          onKeyDown={callbackFunc}
          onChange={(event) => setPasswordCallback(event.target.value)}
        />
        <label htmlFor="passwordInput">Password</label>
      </div>
    </>
  );
};

export default AuthenticationFields;
