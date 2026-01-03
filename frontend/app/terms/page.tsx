import Link from 'next/link'
import Footer from '@/components/Footer'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <Link href="/" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-8 inline-block">
          ← Back to Home
        </Link>
        
        <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">Terms and Conditions</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 space-y-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">Last updated: January 3, 2026</p>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">1. Acceptance of Terms</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              By accessing and using PromptRouter (&quot;the Service&quot;), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these Terms, please do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">2. Description of Service</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
              PromptRouter is an AI API cost optimization service that intelligently routes prompts to the most cost-effective AI model based on your requirements. The Service provides:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
              <li>Intelligent prompt routing across multiple AI providers</li>
              <li>Cost optimization and savings tracking</li>
              <li>API key management and encryption</li>
              <li>Usage analytics and metrics</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">3. User Accounts</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
              To use the Service, you must:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
              <li>Provide accurate and complete registration information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Be at least 18 years old or have parental consent</li>
              <li>Not share your account with others</li>
              <li>Notify us immediately of any unauthorized use</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">4. API Keys and Security</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
              You are responsible for:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
              <li>Providing valid API keys from third-party AI providers</li>
              <li>Maintaining the security of your API keys</li>
              <li>Any charges incurred through your API keys</li>
              <li>Compliance with third-party provider terms of service</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-3">
              We encrypt your API keys using industry-standard encryption, but you remain responsible for their security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">5. Pricing and Payment</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
              Our pricing tiers are:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
              <li><strong>Free:</strong> €0/month - 10,000 tokens/month</li>
              <li><strong>Starter:</strong> €25/month - 500,000 tokens/month</li>
              <li><strong>Pro:</strong> €59/month - 5,000,000 tokens/month</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-3">
              Payments are processed through Stripe. Subscriptions auto-renew monthly unless canceled. No refunds for partial months.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">6. Usage Limits</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Each tier has monthly token limits. Exceeding limits may result in service interruption. Upgrade your plan to increase limits. We reserve the right to throttle or suspend accounts for abuse.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">7. Prohibited Uses</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
              You may not use the Service to:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
              <li>Violate any laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Generate harmful, illegal, or abusive content</li>
              <li>Attempt to reverse engineer or hack the Service</li>
              <li>Resell or redistribute the Service without permission</li>
              <li>Use the Service for cryptocurrency mining or similar activities</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">8. Data and Privacy</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We collect and process data as described in our <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">Privacy Policy</Link>. We do not store the content of your prompts or AI responses. Usage metrics and metadata are retained for analytics.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">9. Service Availability</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We strive for 99.9% uptime but do not guarantee uninterrupted service. We are not liable for:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4 mt-3">
              <li>Third-party AI provider outages</li>
              <li>Scheduled maintenance (with notice)</li>
              <li>Force majeure events</li>
              <li>Internet connectivity issues</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">10. Intellectual Property</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              All content, features, and functionality of PromptRouter are owned by us and protected by copyright, trademark, and other laws. You may not copy, modify, or distribute our intellectual property.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">11. Termination</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We may suspend or terminate your account at any time for:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4 mt-3">
              <li>Violation of these Terms</li>
              <li>Fraudulent activity</li>
              <li>Non-payment</li>
              <li>Abuse or misuse of the Service</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-3">
              You may cancel your subscription at any time from your account settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">12. Disclaimer of Warranties</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              THE SERVICE IS PROVIDED &quot;AS IS&quot; WITHOUT WARRANTIES OF ANY KIND. We do not guarantee accuracy, reliability, or availability. We are not responsible for outputs from third-party AI models.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">13. Limitation of Liability</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              To the maximum extent permitted by law, we are not liable for any indirect, incidental, special, or consequential damages. Our total liability is limited to the amount you paid in the past 12 months.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">14. Indemnification</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              You agree to indemnify and hold us harmless from any claims, damages, or expenses arising from your use of the Service or violation of these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">15. Changes to Terms</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We may update these Terms at any time. Continued use after changes constitutes acceptance. Material changes will be notified via email or dashboard notification.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">16. Governing Law</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              These Terms are governed by the laws of Spain. Any disputes will be resolved in the courts of Madrid, Spain.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">17. Contact</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              For questions about these Terms, contact us at: <a href="mailto:legal@promptrouter.com" className="text-blue-600 dark:text-blue-400 hover:underline">legal@promptrouter.com</a>
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  )
}
