'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-4">Dava AI</h1>
            <p className="text-xl md:text-2xl italic text-[#00c851]">(Da)ta + (Va)lue = Story</p>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Turn Spreadsheets + Strategy into Clear Action
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Upload files, include written context, and receive a business-ready executive summary with next steps.
          </p>
          <Link 
            href="/analyze" 
            className="inline-block bg-[#00c851] text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#00b548] transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            Try the Executive Summary Builder
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            What Dava AI Delivers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Analysis</h3>
              <p className="text-gray-600">AI-powered insights that understand your business context</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Clear Actions</h3>
              <p className="text-gray-600">Get specific, actionable recommendations you can implement today</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Time Saving</h3>
              <p className="text-gray-600">From data to insights in minutes, not days</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">CRM Integration</h3>
              <p className="text-gray-600">Connect with Salesforce, HubSpot, ServiceNow (coming soon)</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Why Dava AI?
          </h2>
          <div className="text-lg text-gray-600 space-y-4">
            <p>
              In today's data-driven world, organizations struggle to transform raw information into actionable insights. 
              Dava AI bridges this gap by combining advanced AI technology with business context to deliver clear, 
              strategic recommendations.
            </p>
            <p>
              Our platform doesn't just analyze numbers – it understands the story behind them. By considering both 
              quantitative data and qualitative context, Dava AI provides comprehensive insights that drive better 
              business decisions.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Transform Your Data?</h2>
          <p className="text-xl text-gray-600 mb-8">Start getting actionable insights in minutes</p>
          <Link 
            href="/analyze" 
            className="inline-block bg-[#00c851] text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#00b548] transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            Try the Executive Summary Builder
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-gray-600">
              <a 
                href="mailto:info@davaai.com" 
                className="hover:text-[#00c851] transition-colors duration-300"
              >
                info@davaai.com
              </a>
            </div>
            <button className="px-6 py-2 border-2 border-[#00c851] text-[#00c851] rounded-lg font-medium hover:bg-[#00c851] hover:text-white transition-all duration-300 transform hover:scale-105">
              Join Waitlist
            </button>
            <div className="flex items-center gap-4">
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-[#00c851] transition-colors duration-300"
              >
                LinkedIn
              </a>
              <span className="text-gray-600">
                © {new Date().getFullYear()} Dava AI. All rights reserved.
              </span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
} 