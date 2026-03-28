import { getRequestConfig } from "next-intl/server"
import { IntlErrorCode } from "next-intl"
import { routing } from "./routing"

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale

  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale
  }

  const messages = (await import(`../messages/${locale}.json`)).default

  return {
    locale,
    messages,
    onError(error) {
      if (error.code === IntlErrorCode.MISSING_MESSAGE) {
        console.error("Missing translation:", error.path)
      }
    },
    getMessageFallback({ namespace, key, error }) {
      const path = [namespace, key].filter((part) => part != null).join(".")
      if (error.code === IntlErrorCode.MISSING_MESSAGE) {
        console.warn(`Translation missing: ${path}`)
        return path
      }
      return `Translation error: ${path}`
    },
  }
})
