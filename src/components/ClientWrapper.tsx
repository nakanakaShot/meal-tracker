"use client";

import { useServiceWorker } from "../hooks/useServiceWorker";

export default function ClientWrapper() {
  useServiceWorker();
  return null;
}
