
import React from 'react';
import { Link } from 'react-router-dom';

const TermsOfService: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8 bg-white mt-8 rounded-xl shadow-sm border border-gray-100">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Terms of Service</h1>
      <div className="space-y-6 text-gray-600">
        <p className="text-sm text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
        
        <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">1. Acceptance of Terms</h2>
            <p>
                By accessing and using AcademicFlow (the "Service"), you accept and agree to be bound by the terms and provision of this agreement. 
                In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
            </p>
        </section>

        <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">2. Academic Integrity</h2>
            <p>
                AcademicFlow is designed to facilitate the management of academic assignments. Users agree to maintain high standards of academic integrity. 
                Any misuse of the platform to facilitate cheating, plagiarism, or dishonest academic practices is strictly prohibited and may result in immediate account termination.
            </p>
        </section>

        <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">3. User Accounts</h2>
            <p>
                To access certain features of the Service, you must register for an account. You agree to provide accurate, current, and complete information during the registration process 
                and to update such information to keep it accurate, current, and complete. You are responsible for safeguarding your password and for all activities that occur under your account.
            </p>
        </section>

        <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">4. Content Ownership and License</h2>
            <p>
                You retain all rights to the assignments and content you upload to the Service. By uploading content, you grant AcademicFlow a worldwide, non-exclusive, 
                royalty-free license to use, store, and display your content solely for the purpose of providing the Service to you (e.g., allowing instructors to grade your work).
            </p>
        </section>

        <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">5. Termination</h2>
            <p>
                We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
            </p>
        </section>

        <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">6. Limitation of Liability</h2>
            <p>
                In no event shall AcademicFlow, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, 
                including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
            </p>
        </section>

        <div className="mt-8 pt-6 border-t border-gray-100">
            <p>
                Questions about the Terms of Service should be sent to us at <Link to="/contact-us" className="text-primary hover:underline">contact us</Link>.
            </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
