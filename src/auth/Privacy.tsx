import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const sections = [
  { id: "info-collect", num: "1", title: "Information We Collect" },
  { id: "how-use", num: "2", title: "How We Use Information" },
  { id: "sharing-info", num: "3", title: "Sharing of Information" },
  { id: "data-security", num: "4", title: "Data Storage and Security" },
  { id: "data-retention", num: "5", title: "Data Retention" },
  { id: "user-rights", num: "6", title: "User Rights" },
  { id: "intl-transfers", num: "7", title: "International Data Transfers" },
  { id: "third-party", num: "8", title: "Third-Party Services" },
  { id: "children-privacy", num: "9", title: "Children’s Privacy" },
  { id: "changes-policy", num: "10", title: "Changes to Privacy Policy" },
  { id: "contact-info", num: "11", title: "Contact Information" },
];

export default function PrivacyPolicy() {
  useEffect(() => {
    document.title = "Privacy Policy — AAKT";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-white border-b border-slate-200/80 pt-3 pb-16">
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
              Privacy Policy
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

          {/* Policy Content Area */}
          <main className="col-span-12 md:col-span-8 lg:col-span-9 bg-white rounded-2xl border border-slate-200/80 p-8 md:p-12 shadow-sm">
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-600 leading-relaxed mb-8 text-base">
                Welcome to AAKT (“AAKT”, “we”, “our”, or “us”). We are committed to protecting your privacy and ensuring that your personal information is handled responsibly and securely.
                This Privacy Policy explains how AAKT collects, uses, stores, shares, and protects information when you use our platform, website, mobile applications, products, services, events, software, and related offerings (collectively, the “Services”).
                By using AAKT, you agree to the practices described in this Privacy Policy.
              </p>

              {/* Section 1 */}
              <section id="info-collect" className="scroll-mt-28 py-8 border-b border-slate-100 first:pt-0">
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="text-[#3461FF]">1.</span> Information We Collect
                </h2>
                <p className="text-slate-600 leading-relaxed mb-4">
                  We may collect the following categories of information:
                </p>

                <div className="mt-6 space-y-6">
                  <div>
                    <h3 className="text-base font-semibold text-slate-800 mb-2">1.1 Personal Information</h3>
                    <p className="text-slate-600 mb-3">Information you voluntarily provide to us, including:</p>
                    <ul className="list-disc pl-6 space-y-1.5 text-slate-600 text-sm">
                      <li>Full name</li>
                      <li>Email address</li>
                      <li>Phone number</li>
                      <li>Company or organization name</li>
                      <li>Username and account credentials</li>
                      <li>Billing and payment details</li>
                      <li>Government-issued identification where required</li>
                      <li>Profile information and preferences</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-base font-semibold text-slate-800 mb-2">1.2 Usage Information</h3>
                    <p className="text-slate-600 mb-3">We may automatically collect information about how you interact with the Services, including:</p>
                    <ul className="list-disc pl-6 space-y-1.5 text-slate-600 text-sm">
                      <li>IP address</li>
                      <li>Browser type and version</li>
                      <li>Device identifiers</li>
                      <li>Operating system</li>
                      <li>Access times and dates</li>
                      <li>Pages viewed</li>
                      <li>Features used</li>
                      <li>Clickstream and activity logs</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-base font-semibold text-slate-800 mb-2">1.3 Communication Data</h3>
                    <p className="text-slate-600 mb-3">We may collect information from:</p>
                    <ul className="list-disc pl-6 space-y-1.5 text-slate-600 text-sm">
                      <li>Customer support requests</li>
                      <li>Feedback submissions</li>
                      <li>Emails and messages sent to us</li>
                      <li>Surveys and promotional engagements</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-base font-semibold text-slate-800 mb-2">1.4 Cookies and Tracking Technologies</h3>
                    <p className="text-slate-600 mb-3">We may use cookies, analytics tools, and similar technologies to:</p>
                    <ul className="list-disc pl-6 space-y-1.5 text-slate-600 text-sm">
                      <li>Improve platform functionality</li>
                      <li>Remember user preferences</li>
                      <li>Analyze usage patterns</li>
                      <li>Enhance security</li>
                      <li>Personalize user experiences</li>
                    </ul>
                    <p className="text-xs text-slate-500 mt-3 italic">
                      Users may disable cookies through their browser settings; however, certain features may not function properly.
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 2 */}
              <section id="how-use" className="scroll-mt-28 py-8 border-b border-slate-100">
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="text-[#3461FF]">2.</span> How We Use Information
                </h2>
                <p className="text-slate-600 leading-relaxed mb-4">
                  We may use collected information to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-600 text-sm md:text-base">
                  <li>Provide and maintain the Services</li>
                  <li>Create and manage accounts</li>
                  <li>Authenticate users</li>
                  <li>Process payments and transactions</li>
                  <li>Improve functionality and user experience</li>
                  <li>Monitor platform performance and security</li>
                  <li>Communicate updates, notices, and support information</li>
                  <li>Conduct analytics and research</li>
                  <li>Prevent fraud, abuse, and unauthorized access</li>
                  <li>Enforce our Terms of Service</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              {/* Section 3 */}
              <section id="sharing-info" className="scroll-mt-28 py-8 border-b border-slate-100">
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="text-[#3461FF]">3.</span> Sharing of Information
                </h2>
                <p className="text-slate-600 leading-relaxed mb-6 font-medium">
                  We do not sell personal information.
                </p>
                <p className="text-slate-600 leading-relaxed mb-4">
                  We may share information with:
                </p>

                <div className="mt-6 space-y-6">
                  <div>
                    <h3 className="text-base font-semibold text-slate-800 mb-2">3.1 Service Providers</h3>
                    <p className="text-slate-600 mb-2">Third-party vendors and partners that assist with:</p>
                    <ul className="list-disc pl-6 space-y-1.5 text-slate-600 text-sm">
                      <li>Hosting</li>
                      <li>Payment processing</li>
                      <li>Customer support</li>
                      <li>Analytics</li>
                      <li>Infrastructure and cloud services</li>
                      <li>Security operations</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-base font-semibold text-slate-800 mb-2">3.2 Legal and Regulatory Authorities</h3>
                    <p className="text-slate-600 mb-2">We may disclose information if required to:</p>
                    <ul className="list-disc pl-6 space-y-1.5 text-slate-600 text-sm">
                      <li>Comply with applicable laws</li>
                      <li>Respond to lawful requests</li>
                      <li>Protect our legal rights</li>
                      <li>Investigate fraud or security incidents</li>
                      <li>Protect users, employees, or the public</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-base font-semibold text-slate-800 mb-2">3.3 Business Transfers</h3>
                    <p className="text-slate-600 text-sm">
                      If AAKT undergoes a merger, acquisition, restructuring, or sale of assets, information may be transferred as part of the transaction.
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 4 */}
              <section id="data-security" className="scroll-mt-28 py-8 border-b border-slate-100">
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="text-[#3461FF]">4.</span> Data Storage and Security
                </h2>
                <p className="text-slate-600 leading-relaxed mb-4 text-sm md:text-base">
                  We implement commercially reasonable administrative, technical, and physical safeguards designed to protect user information.
                </p>
                <p className="text-slate-600 leading-relaxed mb-4 text-sm md:text-base">
                  However, no method of electronic transmission or storage is completely secure, and we cannot guarantee absolute security.
                </p>
                <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                  Users are responsible for maintaining the confidentiality of their account credentials.
                </p>
              </section>

              {/* Section 5 */}
              <section id="data-retention" className="scroll-mt-28 py-8 border-b border-slate-100">
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="text-[#3461FF]">5.</span> Data Retention
                </h2>
                <p className="text-slate-600 leading-relaxed mb-4 text-sm md:text-base">
                  We retain information for as long as necessary to:
                </p>
                <ul className="list-disc pl-6 space-y-1.5 text-slate-600 text-sm mb-4">
                  <li>Provide Services</li>
                  <li>Fulfill contractual obligations</li>
                  <li>Resolve disputes</li>
                  <li>Enforce agreements</li>
                  <li>Comply with legal and regulatory requirements</li>
                </ul>
                <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                  We may retain anonymized or aggregated information indefinitely.
                </p>
              </section>

              {/* Section 6 */}
              <section id="user-rights" className="scroll-mt-28 py-8 border-b border-slate-100">
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="text-[#3461FF]">6.</span> User Rights
                </h2>
                <p className="text-slate-600 leading-relaxed mb-4 text-sm md:text-base">
                  Subject to applicable laws, users may have rights to:
                </p>
                <ul className="list-disc pl-6 space-y-1.5 text-slate-600 text-sm mb-4">
                  <li>Access personal information</li>
                  <li>Correct inaccurate information</li>
                  <li>Request deletion of information</li>
                  <li>Restrict or object to processing</li>
                  <li>Withdraw consent where applicable</li>
                  <li>Request data portability</li>
                </ul>
                <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                  Requests may be submitted through our official support channels.
                </p>
              </section>

              {/* Section 7 */}
              <section id="intl-transfers" className="scroll-mt-28 py-8 border-b border-slate-100">
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="text-[#3461FF]">7.</span> International Data Transfers
                </h2>
                <p className="text-slate-600 leading-relaxed mb-4 text-sm md:text-base">
                  Your information may be processed and stored in countries outside your jurisdiction where privacy laws may differ.
                </p>
                <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                  By using the Services, you consent to such transfers where permitted by law.
                </p>
              </section>

              {/* Section 8 */}
              <section id="third-party" className="scroll-mt-28 py-8 border-b border-slate-100">
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="text-[#3461FF]">8.</span> Third-Party Services
                </h2>
                <p className="text-slate-600 leading-relaxed mb-4 text-sm md:text-base">
                  The Services may contain links or integrations with third-party platforms or services.
                </p>
                <p className="text-slate-600 leading-relaxed mb-4 text-sm md:text-base">
                  AAKT is not responsible for the privacy practices, policies, or content of third-party services.
                </p>
                <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                  Users are encouraged to review the privacy policies of external services before engaging with them.
                </p>
              </section>

              {/* Section 9 */}
              <section id="children-privacy" className="scroll-mt-28 py-8 border-b border-slate-100">
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="text-[#3461FF]">9.</span> Children’s Privacy
                </h2>
                <p className="text-slate-600 leading-relaxed mb-4 text-sm md:text-base">
                  AAKT does not knowingly collect personal information from children under the age required by applicable law without appropriate consent.
                </p>
                <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                  If we become aware that information has been collected improperly, we may take steps to delete it.
                </p>
              </section>

              {/* Section 10 */}
              <section id="changes-policy" className="scroll-mt-28 py-8 border-b border-slate-100">
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="text-[#3461FF]">10.</span> Changes to This Privacy Policy
                </h2>
                <p className="text-slate-600 leading-relaxed mb-4 text-sm md:text-base">
                  We may update this Privacy Policy periodically.
                </p>
                <p className="text-slate-600 leading-relaxed mb-4 text-sm md:text-base">
                  Updated versions will become effective upon posting unless otherwise stated.
                </p>
                <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                  Continued use of the Services after updates constitutes acceptance of the revised Privacy Policy.
                </p>
              </section>

              {/* Section 11 */}
              <section id="contact-info" className="scroll-mt-28 pt-8">
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="text-[#3461FF]">11.</span> Contact Information
                </h2>
                <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                  For questions, requests, or concerns regarding this Privacy Policy, users may contact AAKT through official communication channels.
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
