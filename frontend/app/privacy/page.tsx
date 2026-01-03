import Link from 'next/link'
import Footer from '@/components/Footer'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <Link href="/" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-8 inline-block">
          ← Back to Home
        </Link>
        
        <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">Privacy Policy</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 space-y-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">Last updated: January 3, 2026</p>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">1. Introduction</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              PromptRouter (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you use our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">2. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold mb-3 mt-4 text-gray-900 dark:text-white">2.1 Account Information</h3>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
              <li>Email address</li>
              <li>Name (if provided)</li>
              <li>Authentication data (via Clerk)</li>
              <li>Subscription tier and payment status</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-4 text-gray-900 dark:text-white">2.2 API Keys</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We store your third-party AI provider API keys in encrypted form using industry-standard Fernet encryption. We cannot decrypt or access your API keys outside of processing your requests.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-4 text-gray-900 dark:text-white">2.3 Usage Data</h3>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
              <li>Number of prompts executed</li>
              <li>Token usage and costs</li>
              <li>Selected AI models and providers</li>
              <li>Response times and latency</li>
              <li>Success/error rates</li>
              <li>Timestamps of requests</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-4 text-gray-900 dark:text-white">2.4 Technical Data</h3>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Device information</li>
              <li>Operating system</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">3. What We DO NOT Collect</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-semibold mb-3">
              We do NOT store:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
              <li>The content of your prompts</li>
              <li>AI model responses</li>
              <li>Any personal data from your prompts</li>
              <li>Chat histories or conversations</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-3">
              Your prompts and responses pass through our service for routing purposes only and are immediately discarded after processing.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">4. How We Use Your Information</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
              We use collected information to:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
              <li>Provide and maintain the Service</li>
              <li>Route prompts to optimal AI models</li>
              <li>Track usage and enforce tier limits</li>
              <li>Calculate costs and savings</li>
              <li>Process payments via Stripe</li>
              <li>Send service-related notifications</li>
              <li>Improve our routing algorithms</li>
              <li>Detect and prevent fraud or abuse</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">5. Data Sharing and Disclosure</h2>
            
            <h3 className="text-xl font-semibold mb-3 mt-4 text-gray-900 dark:text-white">5.1 Third-Party Services</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
              We share data with:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
              <li><strong>Clerk:</strong> Authentication and user management</li>
              <li><strong>Stripe:</strong> Payment processing</li>
              <li><strong>Railway:</strong> Infrastructure hosting (backend)</li>
              <li><strong>Vercel:</strong> Infrastructure hosting (frontend)</li>
              <li><strong>AI Providers:</strong> Your prompts (OpenAI, Anthropic, Google, Grok)</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-4 text-gray-900 dark:text-white">5.2 Legal Requirements</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We may disclose your information if required by law, court order, or government regulation, or to protect our rights, property, or safety.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-4 text-gray-900 dark:text-white">5.3 What We Do NOT Do</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We do NOT sell, rent, or trade your personal information to third parties for marketing purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">6. Data Security</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
              We implement security measures including:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
              <li>Fernet encryption for API keys at rest</li>
              <li>HTTPS/TLS encryption for data in transit</li>
              <li>Secure authentication via Clerk</li>
              <li>Regular security audits</li>
              <li>Access controls and monitoring</li>
              <li>Database encryption</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-3">
              However, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">7. Data Retention</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We retain your data:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4 mt-3">
              <li><strong>Account data:</strong> Until you delete your account</li>
              <li><strong>Usage metrics:</strong> Indefinitely for analytics and billing</li>
              <li><strong>API keys:</strong> Until you remove them</li>
              <li><strong>Payment records:</strong> As required by law (typically 7 years)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">8. Your Rights (GDPR)</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
              If you are in the EU/EEA, you have the right to:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Rectification:</strong> Correct inaccurate data</li>
              <li><strong>Erasure:</strong> Request deletion of your data</li>
              <li><strong>Restriction:</strong> Limit how we use your data</li>
              <li><strong>Portability:</strong> Receive your data in a structured format</li>
              <li><strong>Object:</strong> Object to processing of your data</li>
              <li><strong>Withdraw consent:</strong> At any time</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-3">
              To exercise these rights, contact us at <a href="mailto:privacy@promptrouter.com" className="text-blue-600 dark:text-blue-400 hover:underline">privacy@promptrouter.com</a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">9. Cookies and Tracking</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
              We use:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
              <li><strong>Essential cookies:</strong> For authentication and session management (Clerk)</li>
              <li><strong>Analytics:</strong> To understand usage patterns (anonymized)</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-3">
              You can control cookies through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">10. International Data Transfers</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Your data may be transferred to and processed in countries outside the EU/EEA. We ensure adequate safeguards through:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4 mt-3">
              <li>Standard contractual clauses</li>
              <li>Privacy Shield framework (where applicable)</li>
              <li>Adequacy decisions by EU Commission</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">11. Children&apos;s Privacy</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Our Service is not intended for children under 18. We do not knowingly collect data from children. If you believe we have collected data from a child, please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">12. Third-Party Links</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Our Service may contain links to third-party websites. We are not responsible for their privacy practices. Please review their privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">13. Changes to This Policy</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date. Material changes will be notified via email or dashboard notification.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">14. Contact Us</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
              For questions or concerns about this Privacy Policy:
            </p>
            <ul className="list-none text-gray-700 dark:text-gray-300 space-y-2">
              <li><strong>Email:</strong> <a href="mailto:privacy@promptrouter.com" className="text-blue-600 dark:text-blue-400 hover:underline">privacy@promptrouter.com</a></li>
              <li><strong>Legal inquiries:</strong> <a href="mailto:legal@promptrouter.com" className="text-blue-600 dark:text-blue-400 hover:underline">legal@promptrouter.com</a></li>
            </ul>
          </section>

          <section className="border-t pt-6">
            <p className="text-gray-600 text-sm">
              By using PromptRouter, you acknowledge that you have read and understood this Privacy Policy.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  )
}
