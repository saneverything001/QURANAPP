declare module 'expo-router' {
  import * as React from 'react';

  type RouterHref = string | { pathname: string; params?: Record<string, string | number | boolean | undefined> };

  interface Router {
    push: (href: RouterHref) => void;
    replace: (href: RouterHref) => void;
    back: () => void;
  }

  type ScreenOptions = Record<string, unknown>;
  type IconProps = { color: string; focused: boolean; size?: number };
  type ScreenComponent = React.FC<{
    name?: string;
    options?: ScreenOptions & {
      tabBarIcon?: (props: IconProps) => React.ReactNode;
    };
  }>;

  type NavigatorComponent = React.FC<{
    children?: React.ReactNode;
    screenOptions?: ScreenOptions;
  }> & { Screen: ScreenComponent };

  export const Stack: NavigatorComponent;
  export const Tabs: NavigatorComponent;
  export const Slot: React.FC;
  export const Redirect: React.FC<{ href: RouterHref }>;
  export const Link: React.FC<{ href: RouterHref; children?: React.ReactNode; style?: unknown }>;
  export function useRouter(): Router;
  export function useLocalSearchParams<T extends Record<string, string | undefined> = Record<string, string | undefined>>(): T;
}
