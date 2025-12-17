// src/router/HomeRedirect.tsx
import {Navigate} from "react-router-dom";
import {useUserStore} from "@/stores/userStore";
import {roleDefaultPathMap} from "./defaultHome";

const HomeRedirect = () => {
  const {user} = useUserStore();
  // 用户信息还没加载好，先不跳（防止乱跳）
  if (!user?.role) return null;
  const target = roleDefaultPathMap[user.role] || "/login";
  return <Navigate to={target} replace />;
};

export default HomeRedirect;
