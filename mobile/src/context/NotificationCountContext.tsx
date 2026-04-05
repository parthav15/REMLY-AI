import React, { createContext, useContext, useState } from "react";

interface NotificationCountState {
  count: number;
  setCount: (count: number) => void;
}

const NotificationCountContext = createContext<NotificationCountState>({
  count: 0,
  setCount: () => {},
});

export function NotificationCountProvider({ children }: { children: React.ReactNode }) {
  const [count, setCount] = useState(0);

  return (
    <NotificationCountContext.Provider value={{ count, setCount }}>
      {children}
    </NotificationCountContext.Provider>
  );
}

export const useNotificationCount = () => useContext(NotificationCountContext);
