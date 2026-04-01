import React from "react";

export type AppHeaderProps = {
  title: string;
  leftType?: "none" | "back" | "menu";
  rightType?: "none" | "search";
  rightText?: string;
  leftComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
  isEditing?: boolean;
  onPressLeft?: () => void;
  onPressRight?: () => void;
};
