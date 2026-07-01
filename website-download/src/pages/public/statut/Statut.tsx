import { useTranslation } from 'react-i18next'
import { HiCheckCircle, HiExclamationTriangle, HiXCircle } from 'react-icons/hi2'
import SEOMeta from '@/components/seo/SEOMeta'
import { getServiceStatuses } from '@/services/statusData'

const statusIcons = {
  operational: HiCheckCircle,
  degraded: HiExclamationTriangle,
  down: HiXCircle,
}

const statusColors = {
  operational: 'text-green-400',
  degraded: 'text-yellow-400',
  down: 'text-red-400',
}

export default function Statut() {
  const { t } = useTranslation()
  const services = getServiceStatuses()

  return (
    <>
      <SEOMeta title={t('nav.statut')} description={t('status.subtitle')} path="statut" />

      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="section-title">{t('status.title')}</h1>
            <p className="section-subtitle">{t('status.subtitle')}</p>
          </div>

          <div className="space-y-4">
            {services.map((s) => {
              const Icon = statusIcons[s.status]
              const color = statusColors[s.status]
              return (
                <div key={s.name} className="card">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Icon className={`w-6 h-6 ${color}`} />
                      <div>
                        <p className="text-white font-medium">{t(`status.services.${s.name.toLowerCase()}`)}</p>
                        <p className="text-sm text-gray-500">
                          {s.status === 'operational' && t('status.operational')}
                          {s.status === 'degraded' && t('status.degraded')}
                          {s.status === 'down' && t('status.down')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">{t('status.uptime')} : {s.uptime}%</p>
                      {s.lastIncident ? (
                        <p className="text-xs text-gray-500">{t('status.lastIncident')} : {s.lastIncident}</p>
                      ) : (
                        <p className="text-xs text-gray-500">{t('status.noIncident')}</p>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
