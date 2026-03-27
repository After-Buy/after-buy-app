export type AppHeaderProps = {
  title: string;
  leftType?: "none" | "back" | "menu";
  rightType?: "none" | "search";
  rightText?: string;
  onPressLeft?: () => void;
  onPressRight?: () => void;
};
