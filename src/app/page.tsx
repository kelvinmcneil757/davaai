'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <main className="bg-white text-black font-sans">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-20 bg-gray-50">
        {/* Text Logo */}
        <div className="mb-8">
          <h2 className="text-6xl md:text-7xl font-bold text-gray-900 mb-2">Dava AI</h2>
          <p className="text-lg text-gray-600 italic">(Da)ta + (Va)lue = Story</p>
        </div>

        <p className="text-sm uppercase tracking-widest text-gray-600 mb-2">Data. Value. Story.</p>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Turn Spreadsheets + Strategy into Clear Action
        </h1>
        <p className="text-lg md:text-xl text-gray-700 max-w-2xl mb-8">
          Upload files, include written context, and receive a business-ready executive summary with next steps.
        </p>

        <Link 
          href="/analyze"
          className="bg-[#00c851] text-white font-semibold px-8 py-3 rounded-lg shadow-md hover:bg-green-600 transition"
        >
          Try the Executive Summary Builder
        </Link>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">What Dava AI Delivers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-8 text-left">
            <div>
              <h3 className="font-semibold text-lg">📁 Drag-and-drop CSV/Excel upload</h3>
              <p className="text-gray-600">Easily upload structured data for rapid insight generation.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg">📝 2000-word description field</h3>
              <p className="text-gray-600">Add strategic context so our AI understands the bigger picture.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg">🤖 AI-generated action items</h3>
              <p className="text-gray-600">Receive immediate, tailored next steps you can act on.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg">🔌 CRM integration (coming soon)</h3>
              <p className="text-gray-600">Plug into Salesforce, HubSpot, or ServiceNow for recurring reports.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg">📊 Product Success Stories</h3>
              <p className="text-gray-600">Transform data into compelling narratives that showcase your product's impact and value.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg">📈 Usage Analytics & Insights</h3>
              <p className="text-gray-600">Identify high-value features, user patterns, and opportunities for product development.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg">🎯 Feature Prioritization</h3>
              <p className="text-gray-600">Make data-driven decisions about what to build next based on actual user behavior.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg">📱 User Behavior Analysis</h3>
              <p className="text-gray-600">Understand how users interact with your product and why certain features succeed.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">Why Dava AI?</h2>
          <p className="text-gray-700 mb-4">
            At Dava AI, we believe the most powerful insights don't just sit in dashboards — they tell a story.
          </p>
          <p className="text-gray-700 mb-4">
            We go beyond charts and canned reports to uncover the narrative inside your data — delivering clarity, action, and impact. Whether you're briefing a stakeholder, analyzing your team's performance, or tracking product outcomes post-launch, Dava AI helps you get to the "why" faster.
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Connect directly to your CRM or upload data for instant analysis</li>
            <li>Prompt the AI right within the tool for tailored insights</li>
            <li>Automate insight delivery with an AI agent that sends smart summaries daily, weekly, or monthly</li>
            <li>Clean and structure messy data, so the story is actually worth telling</li>
            <li>Get expert consulting to ensure your systems are capturing the right data across support, finance, and product workflows</li>
            <li>Plan smarter by bringing us in during development prep, not just after launch</li>
          </ul>
          <p className="text-gray-700 mt-6">
            We're not just building a reporting tool — we're your strategic partner in making data meaningful.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white text-center py-16">
        <Link 
          href="/analyze"
          className="bg-[#00c851] text-white font-semibold px-8 py-4 rounded-lg shadow-md hover:bg-green-600 transition"
        >
          Try the Executive Summary Builder
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 text-center py-6 text-sm text-gray-600">
        <p>Contact us: <a href="mailto:info@davaai.com" className="underline">info@davaai.com</a></p>
        <div className="mt-2">
          <Link 
            href="https://www.linkedin.com/company/davaai" 
            className="text-blue-600 hover:underline"
            target="_blank"
          >
            LinkedIn
          </Link>
        </div>
        <div className="mt-2">
          <button className="mt-2 bg-black text-white px-4 py-2 rounded hover:bg-gray-800">Join Waitlist</button>
        </div>
        <p className="mt-4">&copy; {new Date().getFullYear()} Dava AI. All rights reserved.</p>
      </footer>
    </main>
  );
} 