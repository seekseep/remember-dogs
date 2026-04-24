import { useI18n } from "../i18n/context";
import { locales } from "../i18n/locales";
import type { Locale } from "../i18n/locales";
import { Twemoji } from "./Twemoji";

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  return (
    <div className="flex gap-4 flex-wrap justify-center">
      {(Object.keys(locales) as Locale[]).map((key) => (
        <button
          key={key}
          className={`cursor-pointer border-none bg-transparent transition-all w-24 h-24 overflow-hidden rounded ${
            locale === key ? "scale-110 opacity-100" : "opacity-50 hover:opacity-80"
          }`}
          style={{ padding: 0 }}
          onClick={() => setLocale(key)}
          title={locales[key].label}
        >
          <Twemoji
            emoji={locales[key].flag}
            className="w-24 h-24 [&_img]:w-full [&_img]:h-full [&_img]:block"
          />
        </button>
      ))}
    </div>
  );
}
