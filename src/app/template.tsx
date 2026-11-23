import React from "react";

export default function RootTemplate({ children }: { children: React.ReactNode }) {
  return <div className="animate-fade-in-up flex-1 w-full">{children}</div>;
}
