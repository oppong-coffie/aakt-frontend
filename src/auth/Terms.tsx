import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const sections = [
  { id: "eligibility", num: "1", title: "Eligibility" },
  { id: "user-accounts", num: "2", title: "User Accounts" },
  { id: "acceptable-use", num: "3", title: "Acceptable Use" },
  { id: "intellectual-property", num: "4", title: "Intellectual Property" },
  { id: "user-content", num: "5", title: "User Content" },
  { id: "payments-billing", num: "6", title: "Payments and Billing" },
  { id: "availability-services", num: "7", title: "Availability of Services" },
  { id: "third-party-services", num: "8", title: "Third-Party Services" },
  { id: "disclaimer-warranties", num: "9", title: "Disclaimer of Warranties" },
  { id: "limitation-liability", num: "10", title: "Limitation of Liability" },
  { id: "indemnification", num: "11", title: "Indemnification" },
  { id: "termination", num: "12", title: "Termination" },
  { id: "governing-law", num: "13", title: "Governing Law" },
  { id: "dispute-resolution", num: "14", title: "Dispute Resolution" },
  { id: "changes-terms", num: "15", title: "Changes to the Terms" },
  { id: "entire-agreement", num: "16", title: "Entire Agreement" },
  { id: "contact-info", num: "17", title: "Contact Information" },
];

export default function TermsOfService() {
  useEffect(() => {
    document.title = "Terms of Service — AAKT";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-100 selection:text-blue-900">

      {/* Hero Header */}
      <div className="relative overflow-hidden bg-white border-b border-slate-200/80 pt-32 pb-16">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-transparent to-indigo-50/10 pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-start"
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#3461FF] hover:text-blue-700 transition-colors mb-6 group"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 transform group-hover:-translate-x-0.5 transition-transform"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Back to Home
            </Link>
            
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
              Terms of Service
            </h1>
            <p className="mt-3 text-sm font-medium text-slate-500">
              Effective Date: 24 May 2026
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-12 gap-10"
        >
          {/* Sticky Sidebar Navigation (TOC) */}
          <aside className="md:col-span-4 lg:col-span-3 h-fit sticky top-28 hidden md:block">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm max-h-[calc(100vh-160px)] overflow-y-auto">
              <h2 className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-4">
                On This Page
              </h2>
              <nav className="space-y-1">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="group flex items-start gap-2 text-sm font-medium text-slate-500 hover:text-[#3461FF] py-2 transition-colors duration-200"
                  >
                    <span className="text-slate-400 group-hover:text-[#3461FF]/70 font-semibold w-5 text-right flex-shrink-0">
                      {section.num}.
                    </span>
                    <span>{section.title}</span>
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Terms Content Area */}
          <main className="col-span-12 md:col-span-8 lg:col-span-9 bg-white rounded-2xl border border-slate-200/80 p-8 md:p-12 shadow-sm">
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-600 leading-relaxed mb-8 text-base">
                These Terms of Service (“Terms”) govern access to and use of AAKT’s services, products, websites, software, applications, platforms, APIs, events, and related offerings (collectively, the “Services”).
                By accessing or using the Services, you agree to be bound by these Terms.
                If you do not agree, you must not use the Services.
              </p>

              {/* Section 1 */}
              <section id="eligibility" className="scroll-mt-28 py-8 border-b border-slate-100 first:pt-0">
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="text-[#3461FF]">1.</span> Eligibility
                </h2>
                <p className="text-slate-600 leading-relaxed mb-4">
                  You must have the legal capacity to enter into binding agreements in your jurisdiction to use the Services.
                </p>
                <p className="text-slate-600 leading-relaxed mb-4">
                  By using AAKT, you represent that:
                </p>
                <ul className="list-disc pl-6 space-y-1.5 text-slate-600 text-sm">
                  <li>The information you provide is accurate</li>
                  <li>You will comply with applicable laws</li>
                  <li>You are authorized to use the Services</li>
                </ul>
              </section>

              {/* Section 2 */}
              <section id="user-accounts" className="scroll-mt-28 py-8 border-b border-slate-100">
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="text-[#3461FF]">2.</span> User Accounts
                </h2>
                <p className="text-slate-600 leading-relaxed mb-4">
                  Users may be required to create an account to access certain Services.
                </p>
                <p className="text-slate-600 leading-relaxed mb-4">
                  Users are responsible for:
                </p>
                <ul className="list-disc pl-6 space-y-1.5 text-slate-600 text-sm mb-4">
                  <li>Maintaining account confidentiality</li>
                  <li>Securing login credentials</li>
                  <li>All activities conducted under their accounts</li>
                </ul>
                <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                  AAKT reserves the right to suspend or terminate accounts that violate these Terms.
                </p>
              </section>

              {/* Section 3 */}
              <section id="acceptable-use" className="scroll-mt-28 py-8 border-b border-slate-100">
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="text-[#3461FF]">3.</span> Acceptable Use
                </h2>
                <p className="text-slate-600 leading-relaxed mb-4">
                  Users agree not to:
                </p>
                <ul className="list-disc pl-6 space-y-1.5 text-slate-600 text-sm mb-4">
                  <li>Violate laws or regulations</li>
                  <li>Infringe intellectual property rights</li>
                  <li>Upload malicious code or harmful content</li>
                  <li>Attempt unauthorized access to systems or accounts</li>
                  <li>Interfere with platform functionality or security</li>
                  <li>Use the Services for fraudulent or deceptive purposes</li>
                  <li>Abuse, harass, or threaten other users</li>
                  <li>Reverse engineer or exploit the Services unlawfully</li>
                </ul>
                <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                  AAKT reserves the right to investigate and take action against prohibited activities.
                </p>
              </section>

              {/* Section 4 */}
              <section id="intellectual-property" className="scroll-mt-28 py-8 border-b border-slate-100">
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="text-[#3461FF]">4.</span> Intellectual Property
                </h2>
                <p className="text-slate-600 leading-relaxed mb-4">
                  All rights, titles, and interests in the Services, including:
                </p>
                <ul className="list-disc pl-6 space-y-1.5 text-slate-600 text-sm mb-4">
                  <li>Software</li>
                  <li>Branding</li>
                  <li>Logos</li>
                  <li>Designs</li>
                  <li>Content</li>
                  <li>Features</li>
                  <li>Technology</li>
                </ul>
                <p className="text-slate-600 leading-relaxed mb-4 text-sm md:text-base">
                  remain the exclusive property of AAKT and its licensors.
                </p>
                <p className="text-slate-600 leading-relaxed mb-4 text-sm md:text-base">
                  Nothing in these Terms transfers ownership rights to users.
                </p>
                <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                  Users may not copy, reproduce, distribute, or exploit AAKT intellectual property without prior written authorization.
                </p>
              </section>

              {/* Section 5 */}
              <section id="user-content" className="scroll-mt-28 py-8 border-b border-slate-100">
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="text-[#3461FF]">5.</span> User Content
                </h2>
                <p className="text-slate-600 leading-relaxed mb-4 text-sm md:text-base">
                  Users may submit, upload, or share content through the Services.
                </p>
                <p className="text-slate-600 leading-relaxed mb-4 text-sm md:text-base">
                  Users retain ownership of their content but grant AAKT a non-exclusive, worldwide, royalty-free license to host, process, display, and use such content for the purpose of operating and improving the Services.
                </p>
                <p className="text-slate-600 leading-relaxed mb-4 text-sm md:text-base">
                  Users represent that they have all necessary rights to submit their content.
                </p>
                <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                  AAKT may remove content that violates these Terms or applicable laws.
                </p>
              </section>

              {/* Section 6 */}
              <section id="payments-billing" className="scroll-mt-28 py-8 border-b border-slate-100">
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="text-[#3461FF]">6.</span> Payments and Billing
                </h2>
                <p className="text-slate-600 leading-relaxed mb-4 text-sm md:text-base">
                  Certain Services may require payment.
                </p>
                <p className="text-slate-600 leading-relaxed mb-4">
                  By purchasing paid Services, users agree to:
                </p>
                <ul className="list-disc pl-6 space-y-1.5 text-slate-600 text-sm mb-6">
                  <li>Pay all applicable fees</li>
                  <li>Provide valid payment information</li>
                  <li>Authorize payment processing</li>
                </ul>

                <p className="text-slate-600 leading-relaxed mb-4">
                  Unless otherwise stated:
                </p>
                <ul className="list-disc pl-6 space-y-1.5 text-slate-600 text-sm">
                  <li>Payments are non-refundable</li>
                  <li>Pricing may change at any time</li>
                  <li>Taxes may apply where required by law</li>
                </ul>
              </section>

              {/* Section 7 */}
              <section id="availability-services" className="scroll-mt-28 py-8 border-b border-slate-100">
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="text-[#3461FF]">7.</span> Availability of Services
                </h2>
                <p className="text-slate-600 leading-relaxed mb-4">
                  AAKT may:
                </p>
                <ul className="list-disc pl-6 space-y-1.5 text-slate-600 text-sm mb-4">
                  <li>Modify features</li>
                  <li>Update systems</li>
                  <li>Suspend Services temporarily</li>
                  <li>Discontinue portions of the platform</li>
                </ul>
                <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                  without prior notice.
                </p>
                <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                  We do not guarantee uninterrupted or error-free availability.
                </p>
              </section>

              {/* Section 8 */}
              <section id="third-party-services" className="scroll-mt-28 py-8 border-b border-slate-100">
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="text-[#3461FF]">8.</span> Third-Party Services and Integrations
                </h2>
                <p className="text-slate-600 leading-relaxed mb-4 text-sm md:text-base">
                  The Services may integrate with third-party products or platforms.
                </p>
                <p className="text-slate-600 leading-relaxed mb-4">
                  AAKT is not responsible for:
                </p>
                <ul className="list-disc pl-6 space-y-1.5 text-slate-600 text-sm mb-4">
                  <li>Third-party content</li>
                  <li>External systems</li>
                  <li>Availability of third-party services</li>
                  <li>Actions or omissions of third parties</li>
                </ul>
                <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                  Use of third-party services may be subject to separate terms and policies.
                </p>
              </section>

              {/* Section 9 */}
              <section id="disclaimer-warranties" className="scroll-mt-28 py-8 border-b border-slate-100">
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="text-[#3461FF]">9.</span> Disclaimer of Warranties
                </h2>
                <p className="text-slate-600 leading-relaxed mb-4 text-sm md:text-base font-medium">
                  The Services are provided on an “as is” and “as available” basis.
                </p>
                <p className="text-slate-600 leading-relaxed mb-4">
                  To the fullest extent permitted by law, AAKT disclaims all warranties, whether express, implied, statutory, or otherwise, including:
                </p>
                <ul className="list-disc pl-6 space-y-1.5 text-slate-600 text-sm mb-4">
                  <li>Merchantability</li>
                  <li>Fitness for a particular purpose</li>
                  <li>Non-infringement</li>
                  <li>Reliability</li>
                  <li>Availability</li>
                </ul>
                <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                  AAKT does not guarantee that the Services will be secure, uninterrupted, or error-free.
                </p>
              </section>

              {/* Section 10 */}
              <section id="limitation-liability" className="scroll-mt-28 py-8 border-b border-slate-100">
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="text-[#3461FF]">10.</span> Limitation of Liability
                </h2>
                <p className="text-slate-600 leading-relaxed mb-4">
                  To the maximum extent permitted by law, AAKT and its affiliates, officers, employees, partners, and licensors shall not be liable for:
                </p>
                <ul className="list-disc pl-6 space-y-1.5 text-slate-600 text-sm mb-4">
                  <li>Indirect damages</li>
                  <li>Incidental damages</li>
                  <li>Consequential damages</li>
                  <li>Loss of profits</li>
                  <li>Loss of data</li>
                  <li>Business interruption</li>
                  <li>Losses arising from unauthorized access or use</li>
                </ul>
                <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                  In all cases, AAKT’s aggregate liability shall not exceed the amount paid by the user to AAKT within the preceding twelve (12) months, where applicable.
                </p>
              </section>

              {/* Section 11 */}
              <section id="indemnification" className="scroll-mt-28 py-8 border-b border-slate-100">
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="text-[#3461FF]">11.</span> Indemnification
                </h2>
                <p className="text-slate-600 leading-relaxed mb-4">
                  Users agree to indemnify and hold harmless AAKT and its affiliates from claims, liabilities, damages, losses, and expenses arising from:
                </p>
                <ul className="list-disc pl-6 space-y-1.5 text-slate-600 text-sm">
                  <li>Use of the Services</li>
                  <li>Violation of these Terms</li>
                  <li>Violation of laws or third-party rights</li>
                  <li>User content or activities</li>
                </ul>
              </section>

              {/* Section 12 */}
              <section id="termination" className="scroll-mt-28 py-8 border-b border-slate-100">
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="text-[#3461FF]">12.</span> Termination
                </h2>
                <p className="text-slate-600 leading-relaxed mb-4">
                  AAKT may suspend or terminate access to the Services at any time, with or without notice, if:
                </p>
                <ul className="list-disc pl-6 space-y-1.5 text-slate-600 text-sm mb-4">
                  <li>Users violate these Terms</li>
                  <li>Required by law</li>
                  <li>Necessary to protect the platform or users</li>
                </ul>
                <p className="text-slate-600 leading-relaxed mb-4">
                  Upon termination:
                </p>
                <ul className="list-disc pl-6 space-y-1.5 text-slate-600 text-sm">
                  <li>Access rights cease immediately</li>
                  <li>Certain obligations and provisions survive termination</li>
                </ul>
              </section>

              {/* Section 13 */}
              <section id="governing-law" className="scroll-mt-28 py-8 border-b border-slate-100">
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="text-[#3461FF]">13.</span> Governing Law
                </h2>
                <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                  These Terms shall be governed and interpreted in accordance with the laws applicable in the jurisdiction where AAKT operates, unless otherwise required by applicable law.
                </p>
              </section>

              {/* Section 14 */}
              <section id="dispute-resolution" className="scroll-mt-28 py-8 border-b border-slate-100">
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="text-[#3461FF]">14.</span> Dispute Resolution
                </h2>
                <p className="text-slate-600 leading-relaxed mb-4 text-sm md:text-base">
                  Users agree to first attempt to resolve disputes informally by contacting AAKT.
                </p>
                <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                  Where disputes cannot be resolved informally, disputes may be resolved through courts or alternative dispute resolution mechanisms permitted under applicable law.
                </p>
              </section>

              {/* Section 15 */}
              <section id="changes-terms" className="scroll-mt-28 py-8 border-b border-slate-100">
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="text-[#3461FF]">15.</span> Changes to the Terms
                </h2>
                <p className="text-slate-600 leading-relaxed mb-4 text-sm md:text-base">
                  AAKT may modify these Terms from time to time.
                </p>
                <p className="text-slate-600 leading-relaxed mb-4 text-sm md:text-base">
                  Updated Terms become effective upon posting unless otherwise specified.
                </p>
                <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                  Continued use of the Services after changes constitutes acceptance of the updated Terms.
                </p>
              </section>

              {/* Section 16 */}
              <section id="entire-agreement" className="scroll-mt-28 py-8 border-b border-slate-100">
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="text-[#3461FF]">16.</span> Entire Agreement
                </h2>
                <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                  These Terms, together with the Privacy Policy and any supplemental agreements, constitute the entire agreement between users and AAKT regarding the Services.
                </p>
              </section>

              {/* Section 17 */}
              <section id="contact-info" className="scroll-mt-28 pt-8">
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="text-[#3461FF]">17.</span> Contact Information
                </h2>
                <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                  For inquiries regarding these Terms, users may contact AAKT through official communication channels.
                </p>
              </section>
            </div>
          </main>
        </motion.div>
      </div>

      {/* Light Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-8 text-center text-slate-500 text-xs">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} AAKT. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/terms-of-service" className="hover:text-[#3461FF] transition-colors">
              Terms of Service
            </Link>
            <Link to="/privacy-policy" className="hover:text-[#3461FF] transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
