
import es from "./es";
import en from "./en";

export const languages = ["es", "en"] as const;

export type Language = (typeof languages)[number];

export const defaultLanguage: Language = "es";

export type Translations = {
  [Section in keyof typeof es]: {
    [Key in keyof (typeof es)[Section]]: (typeof es)[Section][Key] extends string
      ? string
      : {
          [NestedKey in keyof (typeof es)[Section][Key]]: string;
        };
  };
};

export const dictionaries: Record<Language, Translations> = {
  es,
  en,
};

export function isLanguage(value: unknown): value is Language {
  return value === "es" || value === "en";
}

export function getDictionary(language: Language): Translations {
  return dictionaries[language];
}
