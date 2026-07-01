import { Helmet } from 'react-helmet-async'
import { CONFIG } from '@/config/constants'

interface SEOMetaProps {
  title: string
  description: string
  path?: string
  image?: string
  type?: string
}

export default function SEOMeta({ title, description, path = '', image, type = 'website' }: SEOMetaProps) {
  const url = `${CONFIG.SITE_URL}${path ? '/' + path.replace(/^\//, '') : ''}`
  const ogImage = image || `${CONFIG.SITE_URL}/favicon.svg`

  return (
    <Helmet>
      <title>{title} | HappyServ</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={`${title} | HappyServ`} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={ogImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={`${title} | HappyServ`} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  )
}
