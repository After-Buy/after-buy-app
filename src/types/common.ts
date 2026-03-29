import React from "react";

export type AppHeaderProps = {
  title: string;
  leftType?: "none" | "back" | "menu";
  rightType?: "none" | "search";
  rightText?: string;
  leftComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
  onPressLeft?: () => void;
  onPressRight?: () => void;
};
