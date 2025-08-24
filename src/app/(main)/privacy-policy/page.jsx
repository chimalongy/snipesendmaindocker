"use client";

import { FaShieldAlt, FaDatabase, FaUserCog, FaCookie, FaEnvelope } from 'react-icons/fa';
import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100">
          <FaShieldAlt className="h-6 w-6 text-indigo-600" />
        </div>
        <h1 className="mt-3 text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-3 text-xl text-gray-500">
          Last Updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-medium text-gray-900">
            Your Data Protection Rights
          </h2>
        </div>

        <div className="px-4 py-5 sm:p-6">
          {/* Introduction */}
          <div className="mb-8">
            <p className="text-gray-600 mb-4">
              SnipeSend ("we", "us", or "our") operates the SnipeSend email delivery platform (the "Service"). This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service.
            </p>
          </div>

          {/* Data Collection Section */}
          <div className="mb-8">
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-indigo-100 p-2 rounded-md">
                <FaDatabase className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">1. Information We Collect</h3>
                <h4 className="font-medium text-gray-800 mt-3 mb-2">1.1 Personal Data</h4>
                <p className="text-gray-600 mb-2">
                  When using our Service, we may collect:
                </p>
                <ul className="list-disc pl-5 text-gray-600 space-y-1 mb-4">
                  <li>Account information (name, email, profile details)</li>
                  <li>Connected email account credentials (OAuth tokens only)</li>
                  <li>Billing information for paid plans</li>
                </ul>

                <h4 className="font-medium text-gray-800 mt-4 mb-2">1.2 Email Campaign Data</h4>
                <ul className="list-disc pl-5 text-gray-600 space-y-1">
                  <li>Recipient email addresses (processed but not stored long-term)</li>
                  <li>Email open/click tracking data</li>
                  <li>Bounce and complaint reports</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Data Use Section */}
          <div className="mb-8">
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-indigo-100 p-2 rounded-md">
                <FaUserCog className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">2. How We Use Your Data</h3>
                <p className="text-gray-600 mb-2">
                  We use the collected data for:
                </p>
                <ul className="list-disc pl-5 text-gray-600 space-y-1">
                  <li>Providing and maintaining our Service</li>
                  <li>Processing email delivery and tracking</li>
                  <li>Notifying you about service changes</li>
                  <li>Preventing abuse and ensuring compliance</li>
                  <li>Improving our Service's performance</li>
                </ul>
                <p className="text-gray-600 mt-3">
                  <strong>We do not:</strong> Sell your data, read your email content, or store sensitive information beyond what's necessary for service operation.
                </p>
              </div>
            </div>
          </div>

          {/* Data Protection Section */}
          <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex">
              <div className="flex-shrink-0">
                <FaShieldAlt className="h-5 w-5 text-blue-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-blue-800 mb-2">3. Data Protection & Security</h3>
                <p className="text-blue-700 mb-3">
                  We implement industry-standard measures to protect your information:
                </p>
                <ul className="list-disc pl-5 text-blue-700 space-y-1">
                  <li>End-to-end encryption for data in transit</li>
                  <li>OAuth authentication (we never see your passwords)</li>
                  <li>Regular security audits and monitoring</li>
                  <li>Limited employee access to user data</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Cookies Section */}
          <div className="mb-8">
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-indigo-100 p-2 rounded-md">
                <FaCookie className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">4. Cookies & Tracking</h3>
                <p className="text-gray-600 mb-2">
                  We use cookies and similar technologies to:
                </p>
                <ul className="list-disc pl-5 text-gray-600 space-y-1 mb-3">
                  <li>Authenticate users and maintain sessions</li>
                  <li>Analyze service usage (via anonymized analytics)</li>
                  <li>Remember preferences</li>
                </ul>
                <p className="text-gray-600">
                  You can control cookies through your browser settings. Disabling cookies may affect Service functionality.
                </p>
              </div>
            </div>
          </div>

          {/* Email Specific Section */}
          <div className="mb-8">
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-indigo-100 p-2 rounded-md">
                <FaEnvelope className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">5. Email Data Handling</h3>
                <h4 className="font-medium text-gray-800 mt-3 mb-2">5.1 Recipient Data</h4>
                <p className="text-gray-600 mb-3">
                  When you send emails through SnipeSend:
                </p>
                <ul className="list-disc pl-5 text-gray-600 space-y-1 mb-4">
                  <li>Recipient email addresses are processed but not stored after delivery</li>
                  <li>We retain only aggregate statistics (open rates, etc.)</li>
                  <li>You are responsible for complying with data protection laws for your recipient lists</li>
                </ul>

                <h4 className="font-medium text-gray-800 mt-4 mb-2">5.2 Gmail API Compliance</h4>
                <p className="text-gray-600">
                  Our use and transfer of information received from Google APIs adhere to <a href="https://developers.google.com/terms/api-services-user-data-policy" className="text-indigo-600 hover:text-indigo-500" target="_blank" rel="noopener noreferrer">Google API Services User Data Policy</a>, including the Limited Use requirements.
                </p>
              </div>
            </div>
          </div>

          {/* User Rights Section */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-2">6. Your Data Rights</h3>
            <p className="text-gray-600 mb-3">
              Under GDPR, CCPA, and other privacy laws, you may:
            </p>
            <ul className="list-disc pl-5 text-gray-600 space-y-1 mb-4">
              <li>Request access to your personal data</li>
              <li>Request correction or deletion of your data</li>
              <li>Object to processing of your data</li>
              <li>Request export of your data in a portable format</li>
              <li>Withdraw consent (where processing is based on consent)</li>
            </ul>
            <p className="text-gray-600">
              To exercise these rights, contact us at <span className="text-indigo-600">privacy@snipesend.com</span>.
            </p>
          </div>

          {/* Changes & Contact */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">7. Policy Changes</h3>
              <p className="text-gray-600">
                We may update this Privacy Policy. We will notify you of significant changes via email or through our Service.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">8. Contact Us</h3>
              <p className="text-gray-600">
                For privacy-related inquiries, contact our Data Protection Officer at:
              </p>
              <p className="text-gray-600 mt-1">
                <span className="text-indigo-600">privacy@snipesend.com</span>
              </p>
            </div>
          </div>
        </div>

        <div className="px-4 py-4 bg-gray-50 sm:px-6 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} SnipeSend. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}