"use client";

import { useEffect } from "react";

const blockedAttributes = new Set(["bis_skin_checked", "bis_register", "contenteditable"]);

function cleanAttribute(target: Element, attributeName: string | null) {
  if (!attributeName) return;

  if (blockedAttributes.has(attributeName)) {
    target.removeAttribute(attributeName);
  }

  if (attributeName === "style" && target.getAttribute("style") === "cursor: pointer;") {
    target.removeAttribute("style");
  }
}

export function ExtensionAttributeCleanup() {
  useEffect(() => {
    document.querySelectorAll("[bis_skin_checked], [bis_register], [contenteditable]").forEach((element) => {
      blockedAttributes.forEach((attribute) => {
        if (element.hasAttribute(attribute)) {
          element.removeAttribute(attribute);
        }
      });
    });

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes" && mutation.target instanceof Element) {
          cleanAttribute(mutation.target, mutation.attributeName);
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      subtree: true,
      attributeFilter: ["bis_skin_checked", "bis_register", "contenteditable", "style"],
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
