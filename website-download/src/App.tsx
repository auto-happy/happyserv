import { Routes, Route } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import AdminLayout from '@/components/layout/AdminLayout'

import Accueil from '@/pages/public/accueil/Accueil'
import Telechargement from '@/pages/public/telechargement/Telechargement'
import Nouveautes from '@/pages/public/nouveautes/Nouveautes'
import Documentation from '@/pages/public/documentation/Documentation'
import Tutoriels from '@/pages/public/tutoriels/Tutoriels'
import FAQ from '@/pages/public/faq/FAQ'
import Captures from '@/pages/public/captures/Captures'
import Videos from '@/pages/public/videos/Videos'
import Support from '@/pages/public/support/Support'
import BlogPage from '@/pages/public/blog/BlogPage'
import ArticlePage from '@/pages/public/blog/ArticlePage'
import APropos from '@/pages/public/a-propos/APropos'
import Contact from '@/pages/public/contact/Contact'
import MentionsLegales from '@/pages/public/mentions-legales/MentionsLegales'
import Confidentialite from '@/pages/public/confidentialite/Confidentialite'
import CGU from '@/pages/public/cgu/CGU'
import Statut from '@/pages/public/statut/Statut'

import AdminDashboard from '@/pages/admin/dashboard/AdminDashboard'
import AdminVersions from '@/pages/admin/versions/AdminVersions'
import AdminUtilisateurs from '@/pages/admin/utilisateurs/AdminUtilisateurs'
import AdminStats from '@/pages/admin/stats/AdminStats'
import AdminBlog from '@/pages/admin/blog/AdminBlog'
import AdminLogs from '@/pages/admin/logs/AdminLogs'

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg">
      <div className="text-center">
        <h1 className="text-6xl font-bold gradient-text mb-4">404</h1>
        <p className="text-gray-400 text-lg mb-8">Page non trouvée</p>
        <a href="/" className="btn-primary">Retour à l'accueil</a>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Accueil />} />
        <Route path="/telechargement" element={<Telechargement />} />
        <Route path="/nouveautes" element={<Nouveautes />} />
        <Route path="/documentation" element={<Documentation />} />
        <Route path="/documentation/:slug" element={<Documentation />} />
        <Route path="/tutoriels" element={<Tutoriels />} />
        <Route path="/tutoriels/:slug" element={<Tutoriels />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/captures" element={<Captures />} />
        <Route path="/videos" element={<Videos />} />
        <Route path="/support" element={<Support />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<ArticlePage />} />
        <Route path="/a-propos" element={<APropos />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/mentions-legales" element={<MentionsLegales />} />
        <Route path="/confidentialite" element={<Confidentialite />} />
        <Route path="/conditions-utilisation" element={<CGU />} />
        <Route path="/statut" element={<Statut />} />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="versions" element={<AdminVersions />} />
        <Route path="utilisateurs" element={<AdminUtilisateurs />} />
        <Route path="statistiques" element={<AdminStats />} />
        <Route path="blog" element={<AdminBlog />} />
        <Route path="logs" element={<AdminLogs />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
