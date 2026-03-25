import React, { useState } from "react";
import AuthNavigator from "./AuthNavigator";
import MainTabNavigator from "./MainTabNavigator";

export default function RootNavigator() {
  const [isLogin, setIsLogin] = useState(false);

  const handleLogin = () => {
    setIsLogin(true);
  };

  return isLogin ? (
    <MainTabNavigator />
  ) : (
    <AuthNavigator onLogin={handleLogin} />
  );
}
