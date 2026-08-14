"use client";

import React, { useRef } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  // We use a ref to make sure the store is only initialized once
  // across renders/hot reloads (standard RTK + Next.js App Router practice)
  const storeRef = useRef(store);

  return <Provider store={storeRef.current}>{children}</Provider>;
}
