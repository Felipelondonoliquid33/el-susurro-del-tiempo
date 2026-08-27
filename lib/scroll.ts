import type Lenis from "lenis";

let lenisInstance: Lenis | null = null;

export function setLenis(instance: Lenis | null) {
  lenisInstance = instance;
}

export function scrollToSection(selector: string) {
  const el = document.querySelector(selector);
  if (!el) return;
  if (lenisInstance) {
    lenisInstance.scrollTo(el as HTMLElement, { duration: 1.4 });
  } else {
    el.scrollIntoView({ behavior: "smooth" });
  }
}
