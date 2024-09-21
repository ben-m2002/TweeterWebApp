import { SetStateAction, useCallback, useState } from "react";

const useAliasPassword = () => {
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");

  const setAliasCallback = useCallback((newAlias: SetStateAction<string>) => {
    setAlias(newAlias);
  }, []);

  const setPasswordCallback = useCallback(
    (newPassword: SetStateAction<string>) => {
      setPassword(newPassword);
    },
    [],
  );

  return { alias, password, setAliasCallback, setPasswordCallback };
};

export default useAliasPassword;
