import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { HiArrowLeft, HiCalendarDays, HiClock, HiUser } from 'react-icons/hi2'
import { marked } from 'marked'
import SEOMeta from '@/components/seo/SEOMeta'
import { getBlogPostBySlug } from '@/services/blogData'

export default function ArticlePage() {
  const { t } = useTranslation()
  const { slug } = useParams()
  const post = slug ? getBlogPostBySlug(slug) : undefined

  if (!post) {
    return (
      <section className="py-20 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="section-title">{t('common.error')}</h1>
          <p className="text-gray-400 mb-6">Article non trouvé</p>
          <Link to="/blog" className="btn-primary">{t('common.back')}</Link>
        </div>
      </section>
    )
  }

  return (
    <>
      <SEOMeta title={post.title} description={post.excerpt} path={`blog/${slug}`} image={post.image} />
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/blog" className="inline-flex items-center text-sm text-gray-400 hover:text-white mb-8 transition-colors">
            <HiArrowLeft className="mr-2" /> {t('common.back')}
          </Link>

          <div className="h-64 rounded-xl overflow-hidden mb-8 bg-gray-800">
            <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
          </div>

          <div className="flex items-center text-sm text-gray-500 space-x-4 mb-4">
            <span className="flex items-center"><HiCalendarDays className="mr-1" />{post.date}</span>
            <span className="flex items-center"><HiClock className="mr-1" />{post.readTime} {t('blog.minRead')}</span>
            <span className="flex items-center"><HiUser className="mr-1" />{t('blog.by')} {post.author}</span>
          </div>

          <h1 className="text-3xl font-bold text-white mb-6">{post.title}</h1>

          <div
            className="prose prose-invert max-w-none text-gray-300 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: marked(post.content) }}
          />
        </div>
      </section>
    </>
  )
}
