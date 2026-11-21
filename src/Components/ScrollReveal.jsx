import { useLayoutEffect, useRef } from "react";

export default function ScrollReveal({
  children,
  selector = "main > section:not(:has(.page-hero-content)), .page-hero-content, [data-scroll-reveal]",
  stagger = false,
  observeChanges = false,
}) {
  const container = useRef(null);

  useLayoutEffect(() => {
    if (!window.IntersectionObserver || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const targets = new Set();
    const observer = new IntersectionObserver((entries) => {
      let visibleIndex = 0;
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        if (stagger) {
          entry.target.style.setProperty("--reveal-delay", `${Math.min(visibleIndex, 6) * 65}ms`);
          visibleIndex += 1;
        }
        entry.target.dataset.revealState = "visible";
        observer.unobserve(entry.target);
      }
    });

    function observeTargets() {
      for (const target of container.current.querySelectorAll(selector)) {
        if (targets.has(target)) continue;
        targets.add(target);
        target.dataset.revealState = "waiting";
        observer.observe(target);
      }
      for (const target of targets) {
        if (container.current.contains(target)) continue;
        observer.unobserve(target);
        targets.delete(target);
      }
    }

    observeTargets();
    const mutations = observeChanges ? new MutationObserver(observeTargets) : null;
    mutations?.observe(container.current, { childList: true, subtree: true });
    return () => {
      mutations?.disconnect();
      observer.disconnect();
      for (const target of targets) {
        delete target.dataset.revealState;
        target.style.removeProperty("--reveal-delay");
      }
    };
  }, [selector, stagger, observeChanges]);

  return <div ref={container}>{children}</div>;
}
