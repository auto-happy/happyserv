import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { HiChevronDown } from 'react-icons/hi2'
import SEOMeta from '@/components/seo/SEOMeta'
import { getFAQs } from '@/services/faqData'

export default function FAQ() {
  const { t } = useTranslation()
  const [openId, setOpenId] = useState<string | null>(null)
  const faqs = getFAQs()

  return (
    <>
      <SEOMeta title={t('nav.faq')} description={t('faq.subtitle')} path="faq" />

      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="section-title">{t('faq.title')}</h1>
            <p className="section-subtitle">{t('faq.subtitle')}</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq) => (
              <div key={faq.id} className="card overflow-hidden">
                <button
                  onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                  className="w-full flex items-center justify-between text-left"
                >
                  <span className="text-white font-medium pr-4">{faq.question}</span>
                  <HiChevronDown className={`w-5 h-5 text-gray-400 shrink-0 transition-transform ${openId === faq.id ? 'rotate-180' : ''}`} />
                </button>
                {openId === faq.id && (
                  <div className="mt-4 pt-4 border-t border-gray-800">
                    <p className="text-gray-400 text-sm leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
