import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { HiCalendarDays, HiClock } from 'react-icons/hi2'
import SEOMeta from '@/components/seo/SEOMeta'
import { getBlogPosts } from '@/services/blogData'

export default function BlogPage() {
  const { t } = useTranslation()
  const posts = getBlogPosts()

  return (
    <>
      <SEOMeta title={t('nav.blog')} description={t('blog.subtitle')} path="blog" />

      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="section-title">{t('blog.title')}</h1>
            <p className="section-subtitle">{t('blog.subtitle')}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <Link key={post.id} to={`/blog/${post.slug}`} className="card-hover group">
                <div className="h-48 rounded-lg overflow-hidden mb-4 bg-gray-800">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="flex items-center text-xs text-gray-500 space-x-4 mb-2">
                  <span className="flex items-center"><HiCalendarDays className="mr-1" />{post.date}</span>
                  <span className="flex items-center"><HiClock className="mr-1" />{post.readTime} {t('blog.minRead')}</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary-400 transition-colors">{post.title}</h3>
                <p className="text-gray-400 text-sm">{post.excerpt}</p>
                <span className="text-xs text-primary-400 mt-3 inline-block">{t('blog.readMore')} →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
