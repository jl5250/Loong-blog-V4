export interface ScrollToApi {
  scrollTo: (target: number, immediate?: boolean) => void;
}

export function scrollDocumentTo(target: number, lenisApi?: ScrollToApi | null, immediate = false) {
  if (lenisApi) {
    lenisApi.scrollTo(target, immediate);
    return;
  }
  window.scrollTo({ top: target, behavior: immediate ? "auto" : "smooth" });
}
