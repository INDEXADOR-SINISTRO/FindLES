import { ReactElement } from "react";

export type Route = {
  url: string;
  name: string;
  icon: ReactElement;
  isCollapsible?: boolean;
  navOverlay?: number;
  children?: { name: string; url: string }[]; // Sub-rotas opcionais.
};