export function nowMs() {
  return typeof performance !== "undefined" ? performance.now() : Date.now();
}

