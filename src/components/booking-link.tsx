"use client";
import { useSyncExternalStore, type ReactNode } from "react";
import { bookingUrl } from "@/lib/booking-url";
const subscribe = () => () => {};
const getSearch = () => window.location.search;
const serverSearch = () => "";
export default function BookingLink({ href, placement, children, className }: {href: string; placement: string; children: ReactNode; className?: string}) {
  const search = useSyncExternalStore(subscribe, getSearch, serverSearch);
  return <a href={bookingUrl(href, placement, search)} className={className} target="_blank" rel="noopener noreferrer">{children}</a>;
}
