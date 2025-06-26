import RouteProtector from "@/components/route-protector";
import React from "react";

export default function InterviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RouteProtector>{children}</RouteProtector>;
}
