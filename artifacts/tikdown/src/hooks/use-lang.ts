import { useLocation } from "wouter";
import { getLangFromPath, getPageKeyFromSlug, Lang, PageKey } from "@/i18n/langMeta";

export function useLang(): { lang: Lang; pageKey: PageKey; pageSlug: string } {
  const [loc] = useLocation();
  const { lang, pageSlug } = getLangFromPath(loc);
  const pageKey = getPageKeyFromSlug(pageSlug);
  return { lang, pageKey, pageSlug };
}
