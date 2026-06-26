import { useState } from 'react'
import { Globe, Check } from 'lucide-react'
import { useI18n, localeNames, type Locale } from '../../context/I18nContext'

const locales: Locale[] = ['en', 'zh', 'ja', 'es']

function LanguageSwitcher() {
  const { locale, setLocale } = useI18n()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
        title="Language"
      >
        <Globe size={16} className="text-gray-500" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-[50]" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full right-0 mt-1 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-[55] py-1 animate-banner-enter">
            {locales.map((loc) => (
              <button
                key={loc}
                onClick={() => {
                  setLocale(loc)
                  setIsOpen(false)
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${
                  locale === loc ? 'text-primary-600 font-medium' : 'text-gray-700'
                }`}
              >
                {locale === loc && <Check size={12} className="text-primary-600" />}
                {locale !== loc && <span className="w-3" />}
                {localeNames[loc]}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default LanguageSwitcher
