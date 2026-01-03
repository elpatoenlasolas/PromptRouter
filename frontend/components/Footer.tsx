import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white dark:bg-dark-surface border-t border-gray-200 dark:border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <span className="text-2xl font-bold text-gray-900 italic dark:text-white">
                PromptRouter
              </span>
            </Link>
            <p className="text-sm text-gray-600 dark:text-dark-text-muted mb-4">
              Intelligent AI API cost optimizer. <br/> Save up to 99.5% on your AI costs automatically.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Product</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/pricing" className="text-sm text-gray-600 dark:text-dark-text-muted hover:text-primary dark:hover:text-primary transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/docs" className="text-sm text-gray-600 dark:text-dark-text-muted hover:text-primary dark:hover:text-primary transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/dashboard/playground" className="text-sm text-gray-600 dark:text-dark-text-muted hover:text-primary dark:hover:text-primary transition-colors">
                  Playground
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-sm text-gray-600 dark:text-dark-text-muted hover:text-primary dark:hover:text-primary transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <a href="http://localhost:3000/docs#api-reference" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 dark:text-dark-text-muted hover:text-primary dark:hover:text-primary transition-colors">
                  API Reference
                </a>
              </li>
              <li>
                <a href="mailto:support@promptrouter.com" className="text-sm text-gray-600 dark:text-dark-text-muted hover:text-primary dark:hover:text-primary transition-colors">
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy" className="text-sm text-gray-600 dark:text-dark-text-muted hover:text-primary dark:hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-gray-600 dark:text-dark-text-muted hover:text-primary dark:hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <a href="mailto:legal@promptrouter.com" className="text-sm text-gray-600 dark:text-dark-text-muted hover:text-primary dark:hover:text-primary transition-colors">
                  Legal
                </a>
              </li>
              <li>
                <a href="mailto:security@promptrouter.com" className="text-sm text-gray-600 dark:text-dark-text-muted hover:text-primary dark:hover:text-primary transition-colors">
                  Security
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-dark-border">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-600 dark:text-dark-text-muted">
              © {currentYear} PromptRouter. All rights reserved.
            </p>
            <div className="flex items-center space-x-6">
              <Link href="/privacy" className="text-sm text-gray-600 dark:text-dark-text-muted hover:text-primary dark:hover:text-primary transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-sm text-gray-600 dark:text-dark-text-muted hover:text-primary dark:hover:text-primary transition-colors">
                Terms
              </Link>
              <a href="mailto:contact@promptrouter.com" className="text-sm text-gray-600 dark:text-dark-text-muted hover:text-primary dark:hover:text-primary transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
