import { useContext } from "react";
import { UserInfoContext } from "./UserInfoProvider";

const userHook = () => useContext(UserInfoContext);

export default userHook;
