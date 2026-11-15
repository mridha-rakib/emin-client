"use client";

import React from "react";
import { CMS_ICONS, type CmsIconName } from "@/components/cms-icons";

const ALLOWED_TAGS = new Set([
  "p", "h1", "h2", "h3", "h4", "ul", "ol", "li", "strong", "em", "u", "s",
  "blockquote", "a", "br", "span", "img", "pre", "code", "mark", "hr", "div",
]);

const SAFE_STYLES = new Set(["color", "font-size", "font-family", "text-align", "background-color", "line-height"]);

function styleObject(value: string | null): React.CSSProperties | undefined {
  if (!value) return undefined;
  const style: Record<string, string> = {};
  for (const part of value.split(";")) {
    const [rawKey, ...rest] = part.split(":");
    const key = rawKey?.trim().toLowerCase();
    const cssValue = rest.join(":").trim();
    if (!key || !cssValue || !SAFE_STYLES.has(key)) continue;
    if (/url\(|expression|javascript:/i.test(cssValue)) continue;
    style[key.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase())] = cssValue;
  }
  return Object.keys(style).length ? style : undefined;
}

function safeUrl(value: string | null, kind: "link" | "image") {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (kind === "image" && /^data:image\/(png|jpe?g|gif|webp);base64,/i.test(trimmed)) return trimmed;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (kind === "link" && (/^mailto:/i.test(trimmed) || trimmed.startsWith("/"))) return trimmed;
  return undefined;
}

function renderNode(node: ChildNode, key: number): React.ReactNode {
  if (node.nodeType === Node.TEXT_NODE) return node.textContent;
  if (!(node instanceof HTMLElement)) return null;

  const iconName = node.getAttribute("data-cms-icon");
  if (iconName && CMS_ICONS[iconName as CmsIconName]) {
    const Icon = CMS_ICONS[iconName as CmsIconName];
    return <Icon key={key} size={22} aria-hidden className="cms-icon" />;
  }

  const tag = node.tagName.toLowerCase();
  if (!ALLOWED_TAGS.has(tag)) {
    return Array.from(node.childNodes).map((child, index) => renderNode(child, index));
  }

  const children = Array.from(node.childNodes).map((child, index) => renderNode(child, index));
  const props: React.HTMLAttributes<HTMLElement> & { src?: string; alt?: string; href?: string; target?: string; rel?: string } = {
    style: styleObject(node.getAttribute("style")),
  };

  if (tag === "a") {
    const href = safeUrl(node.getAttribute("href"), "link");
    if (href) {
      props.href = href;
      if (/^https?:\/\//i.test(href)) {
        props.target = "_blank";
        props.rel = "noreferrer";
      }
    }
  }

  if (tag === "img") {
    const src = safeUrl(node.getAttribute("src"), "image");
    if (!src) return null;
    props.src = src;
    props.alt = node.getAttribute("alt") ?? "";
  }

  return React.createElement(tag, { ...props, key }, ...children);
}

export function CmsHtml({ html }: { html: string }) {
  const content = React.useMemo(() => {
    if (typeof window === "undefined") return null;
    const document = new DOMParser().parseFromString(html, "text/html");
    return Array.from(document.body.childNodes).map((node, index) => renderNode(node, index));
  }, [html]);

  return (
    <div className="cms-content text-[15px] leading-7 text-slate-800 [&_h1]:mt-4 [&_h1]:mb-2 [&_h1]:text-[2rem] [&_h1]:leading-tight [&_h1]:font-bold [&_h1]:text-slate-900 [&_h2]:mt-4 [&_h2]:mb-2 [&_h2]:text-[1.5rem] [&_h2]:leading-tight [&_h2]:font-bold [&_h2]:text-slate-900 [&_h3]:mt-3 [&_h3]:mb-1.5 [&_h3]:text-[1.25rem] [&_h3]:leading-snug [&_h3]:font-bold [&_h3]:text-slate-900 [&_h4]:mt-3 [&_h4]:mb-1.5 [&_h4]:text-lg [&_h4]:font-bold [&_h4]:text-slate-900 [&_p]:my-2 [&_p]:leading-7 [&_strong]:font-bold [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-1 [&_a]:text-[#199ea8] [&_a]:underline [&_blockquote]:my-3 [&_blockquote]:border-l-[3px] [&_blockquote]:border-slate-200 [&_blockquote]:pl-3 [&_img]:my-3 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-2xl [&_mark]:rounded-sm [&_mark]:px-0.5 [&_.cms-icon]:mx-1 [&_.cms-icon]:inline-flex [&_.cms-icon]:align-[-0.2em] [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
      {content}
    </div>
  );
}
