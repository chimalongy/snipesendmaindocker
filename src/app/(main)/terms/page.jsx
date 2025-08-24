"use client";

import { FaShieldAlt, FaEnvelope, FaBan, FaUserLock, FaGavel } from 'react-icons/fa';
import Link from 'next/link';

export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Terms of Service
        </h1>
        <p className="mt-3 text-xl text-gray-500">
          Last Updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            SnipeSend Email Platform Agreement
          </h2>
        </div>

        <div className="px-4 py-5 sm:p-6">
          {/* Section 1 */}
          <div className="mb-8">
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-indigo-100 p-2 rounded-md">
                <FaGavel className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">1. Acceptance of Terms</h3>
                <p className="text-gray-600">
                  By accessing or using SnipeSend ("Service"), you agree to comply with and be bound by these Terms of Service ("Terms"). If you do not agree, you must not use the Service.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="mb-8">
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-indigo-100 p-2 rounded-md">
                <FaEnvelope className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">2. Service Description</h3>
                <p className="text-gray-600 mb-4">
                  SnipeSend is an email delivery platform that allows users to:
                </p>
                <ul className="list-disc pl-5 text-gray-600 space-y-1">
                  <li>Connect multiple Gmail accounts</li>
                  <li>Schedule and send bulk emails</li>
                  <li>Track email performance analytics</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="mb-8">
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-indigo-100 p-2 rounded-md">
                <FaUserLock className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">3. User Responsibilities</h3>
                
                <h4 className="font-medium text-gray-800 mt-4 mb-2">3.1 Compliance with Laws</h4>
                <p className="text-gray-600 mb-3">
                  You agree to comply with all applicable laws including:
                </p>
                <ul className="list-disc pl-5 text-gray-600 space-y-1 mb-4">
                  <li><strong>CAN-SPAM Act</strong> (US commercial email regulations)</li>
                  <li><strong>GDPR</strong> (EU data protection)</li>
                  <li><strong>CASL</strong> (Canadian anti-spam law)</li>
                </ul>
                <p className="text-gray-600 mb-4">
                  All marketing emails must include a clear, functioning unsubscribe link.
                </p>

                <h4 className="font-medium text-gray-800 mt-4 mb-2">3.2 Prohibited Content</h4>
                <p className="text-gray-600 mb-2">
                  You <strong>must not</strong> use SnipeSend to send:
                </p>
                <ul className="list-disc pl-5 text-gray-600 space-y-1">
                  <li>Unsolicited bulk emails (spam)</li>
                  <li>Phishing or fraudulent content</li>
                  <li>Malware or viruses</li>
                  <li>Harassing, abusive, or illegal content</li>
                  <li>Promotion of hate speech, violence, or illegal activities</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Gmail Compliance Section */}
          <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex">
              <div className="flex-shrink-0">
                <FaShieldAlt className="h-5 w-5 text-blue-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-blue-800 mb-2">Gmail Compliance Requirements</h3>
                <p className="text-blue-700 mb-3">
                  To ensure compliance with <strong>Gmail's Bulk Sender Guidelines</strong>, you must:
                </p>
                <ul className="list-disc pl-5 text-blue-700 space-y-1">
                  <li>Authenticate your emails (SPF, DKIM, DMARC)</li>
                  <li>Keep spam complaint rates below 0.3%</li>
                  <li>Include one-click unsubscribe in all emails</li>
                  <li>Use clear "From" names and addresses</li>
                  <li>Avoid misleading subject lines</li>
                </ul>
                <p className="text-blue-700 mt-3">
                  <strong>Failure to comply may result in Gmail blocking your emails.</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Additional Sections */}
          <div className="space-y-8">
            {/* Section 4 */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">4. Account Security</h3>
              <p className="text-gray-600">
                You are responsible for maintaining the security of your account credentials. Do not share your login information. Notify us immediately of any unauthorized access.
              </p>
            </div>

            {/* Section 5 */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">5. Data Privacy</h3>
              <p className="text-gray-600">
                We comply with GDPR, CCPA, and other privacy regulations. We do not permanently store email content. See our <Link href="/privacy" className="text-indigo-600 hover:text-indigo-500">Privacy Policy</Link> for details.
              </p>
            </div>

            {/* Section 6 */}
            <div>
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-indigo-100 p-2 rounded-md">
                  <FaBan className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">6. Termination</h3>
                  <p className="text-gray-600">
                    We may suspend or terminate your account if you violate these Terms, send spam, or engage in fraudulent activity. Appeals may be sent to <span className="text-indigo-600">support@snipesend.com</span>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 py-4 bg-gray-50 sm:px-6 text-center">
          <p className="text-gray-600 text-sm">
            By using SnipeSend, you acknowledge that you have read, understood, and agreed to these Terms.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            © {new Date().getFullYear()} SnipeSend. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}