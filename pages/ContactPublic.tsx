
import React from 'react';

const ContactPublic: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto md:max-w-none md:grid md:grid-cols-2 md:gap-8">
        
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
            Get in touch
          </h2>
          <div className="mt-3">
            <p className="text-lg text-gray-500">
              Have questions about AcademicFlow? We're here to help. Whether you're a student needing technical support or an administrator looking to streamline your workflow, reach out to us.
            </p>
          </div>
          <div className="mt-9">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div className="ml-3 text-base text-gray-500">
                <p>+254787052272</p>
                <p className="mt-1">Mon-Fri 8am to 6pm PST</p>
              </div>
            </div>
            <div className="mt-6 flex">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-3 text-base text-gray-500">
                <p>support@academicflow.com</p>
              </div>
            </div>
             <div className="mt-6 flex">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="ml-3 text-base text-gray-500">
                <p>123 Education Lane</p>
                <p className="mt-1">Academic City, AC 90210</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 sm:mt-16 md:mt-0">
          <h2 className="text-2xl font-extrabold text-gray-900 sm:text-3xl mb-4">
            Office Locations
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <h3 className="font-bold text-gray-900">North America</h3>
                  <p className="mt-2 text-sm text-gray-500">
                      500 Howard Street<br />
                      San Francisco, CA 94105<br />
                      United States
                  </p>
              </div>
               <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <h3 className="font-bold text-gray-900">Europe</h3>
                  <p className="mt-2 text-sm text-gray-500">
                      10 Downing Street<br />
                      London, SW1A 2AA<br />
                      United Kingdom
                  </p>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPublic;
