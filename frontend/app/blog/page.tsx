'use client'

import Link from 'next/link'
import { Calendar, Clock, ArrowRight, BookOpen } from 'lucide-react'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import Footer from '@/components/Footer'
import { getAllBlogPosts } from './data'

export default function BlogPage() {
  const posts = getAllBlogPosts()
  
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

  const featuredPost = posts[0]
  const otherPosts = posts.slice(1)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-base">
      <DashboardHeader />
      
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 mt-14">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <BookOpen className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            PromptRouter Blog
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-dark-text-muted max-w-3xl mx-auto">
            News, tutorials, and insights about artificial intelligence, cost optimization, and the future of AI APIs.
          </p>
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <div className="mb-12 sm:mb-16">
            <Link href={`/blog/${featuredPost.slug}`}>
              <article className="card group hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="p-6 sm:p-8">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(featuredPost.category)}`}>
                      {featuredPost.category}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-dark-text-muted flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(featuredPost.date)}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-dark-text-muted flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {featuredPost.readTime}
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                    {featuredPost.title}
                  </h2>
                  <p className="text-gray-600 dark:text-dark-text-muted text-lg mb-6">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-semibold">PR</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{featuredPost.author.name}</p>
                        <p className="text-sm text-gray-500 dark:text-dark-text-muted">{featuredPost.author.role}</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all">
                      Read more <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          </div>
        )}

        {/* Other Posts Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {otherPosts.map((post: any) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <article className="card group hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
                      {post.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-white group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 dark:text-dark-text-muted text-sm mb-4 flex-1 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-dark-text-muted pt-4 border-t border-gray-100 dark:border-dark-border">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(post.date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {post.readTime}
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* Newsletter CTA */}
        <div className="mt-16 sm:mt-20">
          <div className="card bg-gradient-to-br from-primary/5 to-accent/5 dark:from-primary/10 dark:to-accent/10 border-primary/20">
            <div className="p-8 sm:p-12 text-center">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                Ready to optimize your AI costs?
              </h2>
              <p className="text-gray-600 dark:text-dark-text-muted mb-6 max-w-2xl mx-auto">
                Join hundreds of companies already saving up to 99.5% on their AI API bills with PromptRouter.
              </p>
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 btn-primary px-8 py-3 text-lg"
              >
                Get started free <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
