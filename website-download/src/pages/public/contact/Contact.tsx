import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { HiEnvelope, HiPhone, HiMapPin, HiCheckCircle } from 'react-icons/hi2'
import SEOMeta from '@/components/seo/SEOMeta'

export default function Contact() {
  const { t } = useTranslation()
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <>
      <SEOMeta title={t('nav.contact')} description={t('contact.subtitle')} path="contact" />

      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="section-title">{t('contact.title')}</h1>
            <p className="section-subtitle">{t('contact.subtitle')}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <HiEnvelope className="w-6 h-6 text-primary-400 mt-1" />
                  <div>
                    <p className="text-white font-medium">{t('contact.info.email')}</p>
                    <p className="text-gray-400 text-sm">contact@happyserv.app</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <HiPhone className="w-6 h-6 text-primary-400 mt-1" />
                  <div>
                    <p className="text-white font-medium">{t('contact.info.phone')}</p>
                    <p className="text-gray-400 text-sm">+33 1 23 45 67 89</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <HiMapPin className="w-6 h-6 text-primary-400 mt-1" />
                  <div>
                    <p className="text-white font-medium">{t('contact.info.address')}</p>
                    <p className="text-gray-400 text-sm">123 Rue de l'Innovation, 75001 Paris</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              {submitted ? (
                <div className="text-center py-8">
                  <HiCheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <p className="text-gray-300">{t('contact.form.success')}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">{t('contact.form.name')}</label>
                    <input type="text" required className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary-500 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">{t('contact.form.email')}</label>
                    <input type="email" required className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary-500 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">{t('contact.form.subject')}</label>
                    <input type="text" required className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary-500 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">{t('contact.form.message')}</label>
                    <textarea rows={5} required className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary-500 transition-colors resize-none" />
                  </div>
                  <button type="submit" className="btn-primary w-full">{t('contact.form.submit')}</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
