import RouteProtector from "@/components/route-protector";
import React from "react";

export default function GoalsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RouteProtector>{children}</RouteProtector>;
}
