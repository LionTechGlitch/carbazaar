export type ToastType = "success" | "error" | "info";

export function showToast(message: string, type: ToastType = "info") {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("carbazaar:toast", { detail: { message, type } }));
}
