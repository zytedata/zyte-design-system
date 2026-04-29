"use client";

import * as React from "react";

const subscribe = () => () => {};

export function useMounted(): boolean {
  return React.useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
