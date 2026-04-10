import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";

/**
 * Finish Page - Finalize account setup and profile information.
 * Features a progress tracker and categorized setup cards.
 */

const Finish = () => {
  const [profile, setProfile] = useState({
    fullName: "",
    role: "",
    bio: "",
    currency: "USD",
    timezone: "UTC+0",
  });

  // Calculate completion percentage based on filled fields
  const fields = Object.values(profile);
  const filledFields = fields.filter((f) => f !== "").length;
  const progress = Math.round((filledFields / fields.length) * 100);

  const inputClasses =
    "w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-300 font-medium";
  const labelClasses =
    "block text-xs font-bold text-gray-400 uppercase tracking-widest px-1 mb-3";

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 flex flex-col gap-12">
      {/* Header & Progress */}
      <div
        className="flex flex-col sm:flex-row justify-between items-end gap-6"
       
      >
        <div className="flex-1">
          <Link
            to="/dashboard/home"
            className="text-blue-600 text-xs font-bold uppercase tracking-widest hover:underline mb-4 block"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Complete your setup
          </h1>
          <p className="text-gray-400 mt-2 font-medium">
            Almost there! Just a few more details to unlock full potential.
          </p>
        </div>

        <div className="w-full sm:w-64 flex flex-col gap-2">
          <div className="flex justify-between items-end px-1">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Progress
            </span>
            <span className="text-xl font-black text-blue-600">
              {progress}%
            </span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden border border-gray-200/50">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-linear-to-r from-blue-500 to-indigo-600"
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Main Form Sections */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          {/* Card 1: Profile Mastery */}
          <section>
            <div className="bg-white rounded-4xl p-8 sm:p-10 shadow-sm border border-gray-100 flex flex-col gap-8 transition-all hover:shadow-md">
              <div className="flex items-center gap-4 border-b border-gray-50 pb-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 text-xl">
                  👤
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Profile Mastery
                  </h2>
                  <p className="text-gray-400 text-xs font-medium">
                    How the community sees you
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className={labelClasses}>Full Name</label>
                  <input
                    className={inputClasses}
                    placeholder="Enter your name"
                    value={profile.fullName}
                    onChange={(e) =>
                      setProfile({ ...profile, fullName: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className={labelClasses}>Professional Role</label>
                  <input
                    className={inputClasses}
                    placeholder="e.g. Founder, Creator, Consultant"
                    value={profile.role}
                    onChange={(e) =>
                      setProfile({ ...profile, role: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className={labelClasses}>Bio Snippet</label>
                  <textarea
                    rows={4}
                    className={`${inputClasses} resize-none`}
                    placeholder="Tell us a bit about your mission..."
                    value={profile.bio}
                    onChange={(e) =>
                      setProfile({ ...profile, bio: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Card 2: Workspace Logic */}
          <section>
            <div className="bg-white rounded-4xl p-8 sm:p-10 shadow-sm border border-gray-100 flex flex-col gap-8 transition-all hover:shadow-md">
              <div className="flex items-center gap-4 border-b border-gray-50 pb-6">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 text-xl">
                  ⚙️
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Workspace Logic
                  </h2>
                  <p className="text-gray-400 text-xs font-medium">
                    Localize your experience
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className={labelClasses}>Preferred Currency</label>
                  <select
                    className={inputClasses}
                    value={profile.currency}
                    onChange={(e) =>
                      setProfile({ ...profile, currency: e.target.value })
                    }
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
                <div>
                  <label className={labelClasses}>Timezone</label>
                  <select
                    className={inputClasses}
                    value={profile.timezone}
                    onChange={(e) =>
                      setProfile({ ...profile, timezone: e.target.value })
                    }
                  >
                    <option value="UTC+0">GMT / UTC +0</option>
                    <option value="UTC-5">EST / UTC -5</option>
                    <option value="UTC+8">CST / UTC +8</option>
                  </select>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar Status */}
        <div className="lg:col-span-1 flex flex-col gap-8 sticky top-8">
          {/* Account Status */}
          <div
            className="bg-linear-to-br from-gray-900 to-gray-800 rounded-4xl p-8 text-white shadow-xl"
           
           
          >
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">
              Account Status
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-300">Email Verified</span>
                <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                  Yes
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-300">Onboarding Status</span>
                <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between text-sm pt-4 border-t border-white/5">
                <span className="text-gray-300">Plan</span>
                <span className="font-black text-blue-400 tracking-tight">
                  Aakt Pro
                </span>
              </div>
            </div>

            <button className="w-full mt-10 py-4 bg-blue-600 rounded-2xl font-bold text-sm hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20">
              Save All Changes
            </button>
          </div>

          {/* Quick Help */}
          <div
            className="bg-white rounded-3xl p-6 border border-gray-100 flex flex-col gap-4"
           
           
          >
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
              💡
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">Need help?</h4>
              <p className="text-gray-400 text-xs mt-1 leading-relaxed">
                Fill out these details to enable customized insights and
                tailored workload suggestions.
              </p>
            </div>
            <button className="text-blue-600 text-xs font-bold text-left hover:underline">
              Read Onboarding Guide →
            </button>
          </div>
        </div>
      </div>
      <div className="h-20" /> {/* Spacer */}
    </div>
  );
};

export default Finish;

