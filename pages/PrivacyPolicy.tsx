
import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8 bg-white mt-8 rounded-xl shadow-sm border border-gray-100">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Privacy Policy</h1>
      <div className="space-y-6 text-gray-600">
        <p className="text-sm text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
        
        <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">1. Introduction</h2>
            <p>
                Welcome to AcademicFlow ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. 
                This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you 
                about your privacy rights and how the law protects you.
            </p>
        </section>

        <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">2. Data We Collect</h2>
            <p>We may collect, use, store, and transfer different kinds of personal data about you which we have grouped together as follows:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong>Identity Data:</strong> Includes first name, last name, and role (student or admin).</li>
                <li><strong>Contact Data:</strong> Includes email address.</li>
                <li><strong>Content Data:</strong> Includes assignments you upload, messages you send, and feedback/grades you receive.</li>
                <li><strong>Technical Data:</strong> Includes internet protocol (IP) address, browser type and version, time zone setting and location, and operating system.</li>
            </ul>
        </section>

        <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">3. How We Use Your Data</h2>
            <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>To register you as a new user.</li>
                <li>To process and deliver your orders/assignments.</li>
                <li>To manage our relationship with you (e.g., notifying you about changes to our terms or privacy policy).</li>
                <li>To administer and protect our business and this website.</li>
            </ul>
        </section>

        <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">4. Data Security</h2>
            <p>
                We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed. 
                In addition, we limit access to your personal data to those employees, agents, contractors, and other third parties who have a business need to know.
                We utilize Appwrite's secure cloud infrastructure which adheres to industry standards for data encryption and protection.
            </p>
        </section>

        <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">5. Data Retention</h2>
            <p>
                We will only retain your personal data for as long as necessary to fulfil the purposes we collected it for, including for the purposes of satisfying any legal, accounting, or reporting requirements.
            </p>
        </section>

        <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">6. Contact Us</h2>
            <p>
                If you have any questions about this privacy policy or our privacy practices, please contact us via our Contact page.
            </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
