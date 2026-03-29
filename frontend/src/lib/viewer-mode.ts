import type { ViewerMode } from "@/types/listings";

export const VIEWER_STORAGE_KEY = "listing_viewer_mode";
export const VIEWER_MODE_CHANGED_EVENT = "viewer-mode-changed";

export function getViewerModeSnapshot(): ViewerMode {
  if (typeof window === "undefined") {
    return "user";
  }

  return window.localStorage.getItem(VIEWER_STORAGE_KEY) === "admin"
    ? "admin"
    : "user";
}

export function subscribeToViewerMode(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === VIEWER_STORAGE_KEY) {
      onStoreChange();
    }
  };

  const handleLocalChange = () => {
    onStoreChange();
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(VIEWER_MODE_CHANGED_EVENT, handleLocalChange);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(VIEWER_MODE_CHANGED_EVENT, handleLocalChange);
  };
}

export function setViewerMode(mode: ViewerMode): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(VIEWER_STORAGE_KEY, mode);
  window.dispatchEvent(new Event(VIEWER_MODE_CHANGED_EVENT));
}
