import React, { useState } from 'react';
import Header from './components/Header';
import EmailExtractor from './components/EmailExtractor';
import { MailIcon, SparklesIcon } from './components/icons';

// --- Page Components defined within App.tsx to avoid creating new files ---

const HomePage: React.FC = () => (
  <>
    <div className="text-center mb-8">
      <p className="text-slate-400 max-w-2xl mx-auto">
        Simply enter a website URL below, and our AI will use Google Search to intelligently find and list all publicly available email addresses for you.
      </p>
    </div>
    <EmailExtractor />
  </>
);

const AboutPage: React.FC = () => (
  <div className="bg-slate-800/50 border border-slate-700 rounded-xl shadow-2xl p-6 sm:p-8 max-w-4xl mx-auto animate-fade-in">
    <div className="flex items-center gap-4 mb-6">
      <SparklesIcon className="w-8 h-8 text-sky-400" />
      <h2 className="text-3xl font-bold text-slate-100">About AI Email Finder Pro</h2>
    </div>
    <div className="space-y-4 text-slate-300">
      <p>
        AI Email Finder Pro is a sophisticated tool designed to assist professionals in sales, marketing, and research by identifying publicly available email addresses associated with a website. In today's digital landscape, connecting with the right people is key, and our tool is built to make that process more efficient and effective.
      </p>
      <h3 className="text-xl font-semibold text-slate-200 pt-4">Our Technology</h3>
      <p>
        We leverage the power of Google's advanced Gemini AI model. When you provide a URL, our system instructs the AI to perform a comprehensive search across the public web, mimicking how a human researcher would look for contact information. The AI sifts through web pages, directories, and other public sources linked to the domain to find and compile a list of relevant email addresses.
      </p>
      <h3 className="text-xl font-semibold text-slate-200 pt-4">Our Commitment to Ethical Use</h3>
      <p>
        We are committed to ethical data practices. This tool is designed to find information that is already in the public domain. It does not access private databases or bypass any security measures. We strongly encourage our users to use the information gathered responsibly and in compliance with all applicable laws and regulations, including anti-spam legislation like CAN-SPAM and GDPR. The purpose of this tool is to facilitate professional communication, not to encourage unsolicited bulk emailing.
      </p>
    </div>
  </div>
);

const PrivacyPolicyPage: React.FC = () => (
  <div className="bg-slate-800/50 border border-slate-700 rounded-xl shadow-2xl p-6 sm:p-8 max-w-4xl mx-auto animate-fade-in">
    <h2 className="text-3xl font-bold text-slate-100 mb-6">Privacy Policy</h2>
    <div className="space-y-4 text-slate-300">
      <p>Last updated: {new Date().toLocaleDateString()}</p>
      <p>AI Email Finder Pro ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website.</p>
      <h3 className="text-xl font-semibold text-slate-200 pt-4">1. Information We Collect</h3>
      <p>We do not collect any personally identifiable information from our users. We do utilize your browser's local storage to enhance your experience by caching search history and results. This data is stored exclusively on your local device and is not transmitted to our servers.</p>
      <h3 className="text-xl font-semibold text-slate-200 pt-4">2. How We Use Information</h3>
      <p>The URLs you provide are sent to the Google Gemini API for the sole purpose of fulfilling your request. We do not log or store the URLs you enter on our servers.</p>
      <h3 className="text-xl font-semibold text-slate-200 pt-4">3. Data Source</h3>
      <p>Our tool queries the Google Gemini API, which uses Google Search to find information that is already publicly available. We are not responsible for the accuracy or the source of the data provided by the AI model.</p>
      <h3 className="text-xl font-semibold text-slate-200 pt-4">4. Changes to This Privacy Policy</h3>
      <p>We may update this Privacy Policy from time to time. You are advised to review this Privacy Policy periodically for any changes.</p>
    </div>
  </div>
);

const ContactPage: React.FC = () => (
  <div className="bg-slate-800/50 border border-slate-700 rounded-xl shadow-2xl p-6 sm:p-8 max-w-4xl mx-auto text-center animate-fade-in">
    <div className="flex items-center justify-center gap-4 mb-6">
      <MailIcon className="w-8 h-8 text-sky-400" />
      <h2 className="text-3xl font-bold text-slate-100">Contact Us</h2>
    </div>
    <div className="space-y-4 text-slate-300">
      <p>Have questions, feedback, or need support? We'd love to hear from you.</p>
      <p>Please reach out to our team via email, and we will get back to you as soon as possible.</p>
      <div className="pt-4">
        <a href="mailto:support@emailfinderpro.com" className="inline-block bg-sky-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-sky-700 transition-colors duration-200">
          support@emailfinderpro.com
        </a>
      </div>
    </div>
  </div>
);

const Footer: React.FC<{ setCurrentPage: (page: string) => void; }> = ({ setCurrentPage }) => (
  <footer className="w-full max-w-4xl mx-auto text-center mt-12 py-8 border-t border-slate-800 text-slate-500 text-sm">
    <div className="flex justify-center gap-6 mb-4">
      <button onClick={() => setCurrentPage('home')} className="hover:text-sky-400 transition-colors">Home</button>
      <button onClick={() => setCurrentPage('about')} className="hover:text-sky-400 transition-colors">About</button>
      <button onClick={() => setCurrentPage('privacy-policy')} className="hover:text-sky-400 transition-colors">Privacy Policy</button>
      <button onClick={() => setCurrentPage('contact')} className="hover:text-sky-400 transition-colors">Contact</button>
    </div>
    <p className="mb-2">&copy; {new Date().getFullYear()} AI Email Finder Pro. All rights reserved.</p>
    <p>Powered by Google Gemini</p>
  </footer>
);

// --- Main App Component ---

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'about':
        return <AboutPage />;
      case 'privacy-policy':
        return <PrivacyPolicyPage />;
      case 'contact':
        return <ContactPage />;
      case 'home':
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <Header setCurrentPage={setCurrentPage} />
      <main className="w-full max-w-4xl mx-auto flex-grow">
        {renderPage()}
      </main>
      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
};

export default App;