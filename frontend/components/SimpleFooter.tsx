import Link from 'next/link'

export default function SimpleFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white dark:bg-dark-surface border-t border-gray-200 dark:border-dark-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0 text-sm text-gray-600 dark:text-dark-text-muted">
          <p>
            © {currentYear} PromptRouter. All rights reserved.
          </p>
          <div className="flex items-center space-x-6">
            <Link href="/privacy" className="hover:text-primary dark:hover:text-primary transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-primary dark:hover:text-primary transition-colors">
              Terms
            </Link>
            <a href="mailto:contact@promptrouter.com" className="hover:text-primary dark:hover:text-primary transition-colors">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
