"use client"

import React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { Locale } from "@/lib/firebase/types"

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

const LOCALE_COOKIE_NAME = "NEXT_LOCALE"

function detectBrowserLocale(): Locale {
  if (typeof window === "undefined") return "en-US"

  const browserLang = navigator.language

  if (browserLang.startsWith("pt")) return "pt-BR"
  if (browserLang.startsWith("es")) return "es-ES"
  return "en-US"
}

function getInitialLocale(): Locale {
  if (typeof window === "undefined") return "en-US"

  const cookies = document.cookie.split("; ")
  const localeCookie = cookies.find((c) => c.startsWith(`${LOCALE_COOKIE_NAME}=`))

  if (localeCookie) {
    const locale = localeCookie.split("=")[1] as Locale
    if (["en-US", "pt-BR", "es-ES"].includes(locale)) {
      return locale
    }
  }

  const stored = localStorage.getItem(LOCALE_COOKIE_NAME)
  if (stored && ["en-US", "pt-BR", "es-ES"].includes(stored)) {
    return stored as Locale
  }

  return detectBrowserLocale()
}

function saveLocale(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE_NAME}=${locale}; path=/; max-age=${30 * 24 * 60 * 60}`

  localStorage.setItem(LOCALE_COOKIE_NAME, locale)
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale)
  const [currentMessages, setCurrentMessages] = useState()

  useEffect(() => {
    import(`@/messages/${locale}.json`).then((module) => {
      setCurrentMessages(module.default)
    })
  }, [locale])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    saveLocale(newLocale)
  }

  const t = (key: string): string => {
    const keys = key.split(".")
    let value: any = currentMessages

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k]
      } else {
        return key
      }
    }

    return typeof value === "string" ? value : key
  }

  return React.createElement(I18nContext.Provider, { value: { locale, setLocale, t } }, children)
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider")
  }
  return context
}

export function useTranslatedText() {
  const { locale } = useI18n()

  return (text: { "en-US": string; "pt-BR": string; "es-ES": string } | string | undefined): string => {
    if (!text) return ""
    if (typeof text === "string") return text
    return text[locale] || text["en-US"] || ""
  }
}

export function useTranslations() {
  const { locale, t } = useI18n()

  const getMultilingualText = (
    text: { "en-US": string; "pt-BR": string; "es-ES": string } | string | undefined,
  ): string => {
    if (!text) return ""
    if (typeof text === "string") return text
    return text[locale] || text["en-US"] || ""
  }

  return Object.assign(t, { getMultilingualText })
}
