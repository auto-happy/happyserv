import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { HiEnvelope, HiPhone, HiClock, HiCheckCircle } from 'react-icons/hi2'
import SEOMeta from '@/components/seo/SEOMeta'

export default function Support() {
  const { t } = useTranslation()
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <>
      <SEOMeta title={t('nav.support')} description={t('support.subtitle')} path="support" />

      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="section-title">{t('support.title')}</h1>
            <p className="section-subtitle">{t('support.subtitle')}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="card text-center">
              <HiEnvelope className="w-8 h-8 text-primary-400 mx-auto mb-3" />
              <p className="text-white font-medium">{t('support.email')}</p>
              <p className="text-gray-500 text-sm">support@happyserv.app</p>
            </div>
            <div className="card text-center">
              <HiPhone className="w-8 h-8 text-primary-400 mx-auto mb-3" />
              <p className="text-white font-medium">{t('support.phone')}</p>
              <p className="text-gray-500 text-sm">+33 1 23 45 67 89</p>
            </div>
            <div className="card text-center">
              <HiClock className="w-8 h-8 text-primary-400 mx-auto mb-3" />
              <p className="text-white font-medium">{t('support.hours')}</p>
              <p className="text-gray-500 text-sm">Lun-Ven, 9h-18h</p>
            </div>
          </div>

          <div className="card max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-white mb-6">{t('support.contactForm')}</h2>
            {submitted ? (
              <div className="text-center py-8">
                <HiCheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <p className="text-gray-300">{t('support.successMessage')}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">{t('support.nameLabel')}</label>
                    <input type="text" required className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary-500 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">{t('support.emailLabel')}</label>
                    <input type="email" required className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary-500 transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">{t('support.subjectLabel')}</label>
                  <input type="text" required className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">{t('support.messageLabel')}</label>
                  <textarea rows={5} required className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary-500 transition-colors resize-none" />
                </div>
                <button type="submit" className="btn-primary w-full">{t('support.submit')}</button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
