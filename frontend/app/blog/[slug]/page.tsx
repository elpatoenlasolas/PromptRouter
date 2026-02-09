'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Calendar, Clock, ArrowLeft, Share2, Linkedin, Copy } from 'lucide-react'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import Footer from '@/components/Footer'
import { getBlogPostBySlug, getAllBlogPosts } from '../data'
import { useToast } from '@/lib/toast'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function BlogPostPage() {
  const params = useParams()
  const slug = params.slug as string
  const post = getBlogPostBySlug(slug)
  const allPosts = getAllBlogPosts()
  const { showToast } = useToast()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Basics': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      'Comparisons': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      'Optimization': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      'Trends': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
      'Tutorials': 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
      'Use Cases': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300',
      'Security': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    }
    return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href)
    showToast('URL copied to clipboard', 'success')
  }

  const shareOnTwitter = () => {
    if (!post) return
    const url = encodeURIComponent(window.location.href)
    const text = encodeURIComponent(post.title)
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank')
  }

  const shareOnLinkedIn = () => {
    const url = encodeURIComponent(window.location.href)
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank')
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-base">
        <DashboardHeader />
        <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 mt-14 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Article not found
          </h1>
          <p className="text-gray-600 dark:text-dark-text-muted mb-8">
            The article you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <Link href="/blog" className="btn-primary inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to blog
          </Link>
        </main>
        <Footer />
      </div>
    )
  }

  // Get related posts (same category, excluding current)
  const relatedPosts = allPosts
    .filter(p => p.category === post.category && p.slug !== post.slug)
    .slice(0, 3)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-base">
      <DashboardHeader />
      
      <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 mt-14">
        {/* Back link */}
        <Link 
          href="/blog" 
          className="inline-flex items-center gap-2 text-gray-600 dark:text-dark-text-muted hover:text-primary dark:hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to blog
        </Link>

        {/* Article Header */}
        <article>
          <header className="mb-8">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(post.category)}`}>
                {post.category}
              </span>
              <span className="text-sm text-gray-500 dark:text-dark-text-muted flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(post.date)}
              </span>
              <span className="text-sm text-gray-500 dark:text-dark-text-muted flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {post.readTime}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              {post.title}
            </h1>

            <p className="text-xl text-gray-600 dark:text-dark-text-muted mb-8">
              {post.excerpt}
            </p>

            <div className="flex items-center justify-between flex-wrap gap-4 pb-8 border-b border-gray-200 dark:border-dark-border">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold">PR</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{post.author.name}</p>
                  <p className="text-sm text-gray-500 dark:text-dark-text-muted">{post.author.role}</p>
                </div>
              </div>

              {/* Share buttons */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 dark:text-dark-text-muted mr-2">Share:</span>
                <button
                  onClick={shareOnTwitter}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-surface transition-colors"
                  title="Share on X"
                >
                  <svg className="w-5 h-5 text-gray-600 dark:text-dark-text-muted" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </button>
                <button
                  onClick={shareOnLinkedIn}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-surface transition-colors"
                  title="Share on LinkedIn"
                >
                  <Linkedin className="w-5 h-5 text-gray-600 dark:text-dark-text-muted" />
                </button>
                <button
                  onClick={copyToClipboard}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-surface transition-colors"
                  title="Copy link"
                >
                  <Copy className="w-5 h-5 text-gray-600 dark:text-dark-text-muted" />
                </button>
              </div>
            </div>
          </header>

          {/* Article Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-600 dark:prose-p:text-dark-text-muted prose-a:text-primary hover:prose-a:text-primary/80 prose-code:bg-gray-100 dark:prose-code:bg-dark-surface prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-900 dark:prose-pre:bg-dark-surface prose-pre:border prose-pre:border-gray-200 dark:prose-pre:border-dark-border prose-table:border-collapse prose-th:border prose-th:border-gray-200 dark:prose-th:border-dark-border prose-th:p-2 prose-th:bg-gray-50 dark:prose-th:bg-dark-surface prose-td:border prose-td:border-gray-200 dark:prose-td:border-dark-border prose-td:p-2">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="mt-16 pt-8 border-t border-gray-200 dark:border-dark-border">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
              Related articles
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link key={relatedPost.slug} href={`/blog/${relatedPost.slug}`}>
                  <article className="card group hover:shadow-lg transition-all duration-300 h-full">
                    <div className="p-5">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-3 ${getCategoryColor(relatedPost.category)}`}>
                        {relatedPost.category}
                      </span>
                      <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors line-clamp-2 mb-2">
                        {relatedPost.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-dark-text-muted">
                        {relatedPost.readTime}
                      </p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="mt-16">
          <div className="card bg-gradient-to-br from-primary/5 to-accent/5 dark:from-primary/10 dark:to-accent/10 border-primary/20">
            <div className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                Did you find this article helpful?
              </h2>
              <p className="text-gray-600 dark:text-dark-text-muted mb-6">
                Try PromptRouter free and start optimizing your AI costs today.
              </p>
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 btn-primary px-6 py-3"
              >
                Get started free
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
