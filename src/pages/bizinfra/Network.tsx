import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import { contactService } from "../../api/contact.service";
import type { Contact } from "../../api/contact.service";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../config/firebase";

const SearchIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const PlusIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" cy="12" x2="12" y2="12"></line>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const LeftArrowIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m12 19-7-7 7-7" />
    <path d="M19 12H5" />
  </svg>
);



/**
 * NetworkTree Component - Visualizes connections in a radial tree/map layout.
 * @param onSelectPerson - callback when a person node is clicked
 */
const NetworkTree = ({
  people,
  onSelectPerson,
}: {
  people: Contact[];
  onSelectPerson: (person: Contact) => void;
}) => {
  return (
    <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
      {/* Center Circle */}
      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs ring ring-slate-500 z-50">
        {/* Connection Lines Illustration */}
        <svg
          className="absolute inset-0 w-full h-full overflow-visible pointer-events-none"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "500px",
            height: "500px",
          }}
        >
          {people.map((_, i) => {
            const angle = (i * 360) / people.length;
            const rad = (angle * Math.PI) / 180;
            const x2 = 250 + Math.cos(rad) * 150;
            const y2 = 250 + Math.sin(rad) * 150;
            return (
              <line
                key={i}
                x1="250"
                y1="250"
                x2={x2}
                y2={y2}
                stroke="currentColor"
                strokeWidth="1"
                className="text-gray-200 dark:text-slate-800"
              />
            );
          })}
        </svg>
      </div>

      {/* Nodes */}
      {people.map((person, i) => {
        const angle = (i * 360) / people.length;
        const rad = (angle * Math.PI) / 180;
        const x = Math.cos(rad) * 180;
        const y = Math.sin(rad) * 180;
        const avatarUrl = person.imageUrl || person.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(person.name)}`;

        return (
          <motion.div
            key={person._id || i}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1, x, y }}
            transition={{ delay: i * 0.1 }}
            className="absolute flex items-center gap-3 z-30 cursor-pointer"
            onClick={() => onSelectPerson(person)}
          >
            <div className="w-10 h-10 rounded-full border-2 border-white shadow-md overflow-hidden bg-white hover:scale-110 transition-transform">
              <img
                src={avatarUrl}
                className="w-full h-full object-cover"
                alt={person.name}
              />
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-gray-900 dark:text-gray-100 leading-tight">
                {person.name}
              </span>
              <span className="text-[8px] text-gray-400 dark:text-gray-500 leading-tight">
                {person.role}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

/**
 * ListView Component - Renders the network directory in a standard table format.
 * @param onSelectPerson - callback when a row is clicked
 */
const ListView = ({
  people,
  onSelectPerson,
}: {
  people: Contact[];
  onSelectPerson: (person: Contact) => void;
}) => {
  return (
    <div className="w-full h-full bg-white dark:bg-slate-900 rounded-4xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden flex flex-col transition-colors">
      <div className="overflow-y-auto no-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-50 dark:border-slate-800">
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                Person
              </th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                Role
              </th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest hidden md:table-cell">
                Contact
              </th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest text-right">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {people.map((person, i) => {
              const avatarUrl = person.imageUrl || person.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(person.name)}`;
              return (
                <motion.tr
                  key={person._id || i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="group hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors cursor-pointer border-b border-gray-50 dark:border-slate-800 last:border-0"
                  onClick={() => onSelectPerson(person)}
                >
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={avatarUrl}
                        className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700"
                        alt={person.name}
                      />
                      <span className="text-sm font-bold text-gray-900 dark:text-gray-100 font-['Space_Grotesk']">
                        {person.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-lg">
                      {person.role}
                    </span>
                  </td>
                  <td className="px-8 py-4 hidden md:table-cell">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-medium text-gray-500">
                        {person.email || "No email"}
                      </span>
                      <span className="text-[10px] font-medium text-gray-400">
                        {person.phone || "No phone"}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <button className="text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </button>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Network = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"people" | "tree" | "list">(
    "people",
  );
  const [isPlusDropdownOpen, setIsPlusDropdownOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewDropdownOpen, setIsViewDropdownOpen] = useState(false);

  // Contacts states
  const [people, setPeople] = useState<Contact[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);

  // Form states for adding connection
  const [newContactName, setNewContactName] = useState("");
  const [newContactRole, setNewContactRole] = useState("");
  const [newContactEmail, setNewContactEmail] = useState("");
  const [newContactPhone, setNewContactPhone] = useState("");
  const [newContactImageUrl, setNewContactImageUrl] = useState("");
  const [newContactBio, setNewContactBio] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const data = await contactService.getContacts();
      setPeople(data);
    } catch (error) {
      console.error("Error loading contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingImage(true);
      const fileRef = ref(storage, `contacts/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(fileRef, file);
      const downloadUrl = await getDownloadURL(snapshot.ref);
      setNewContactImageUrl(downloadUrl);
    } catch (error) {
      console.error("Error uploading image to Firebase Storage:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSaveContact = async () => {
    if (!newContactName.trim() || !newContactRole.trim()) {
      alert("Name and Role are required");
      return;
    }

    try {
      const newContact = await contactService.createContact({
        name: newContactName.trim(),
        role: newContactRole.trim(),
        email: newContactEmail.trim() || undefined,
        phone: newContactPhone.trim() || undefined,
        avatar: newContactImageUrl.trim() || undefined,
        imageUrl: newContactImageUrl.trim() || undefined,
        bio: newContactBio.trim() || undefined,
      });

      setPeople((prev) => [newContact, ...prev]);
      setIsAddModalOpen(false);

      // Reset form states
      setNewContactName("");
      setNewContactRole("");
      setNewContactEmail("");
      setNewContactPhone("");
      setNewContactImageUrl("");
      setNewContactBio("");
    } catch (error) {
      console.error("Error creating contact:", error);
      alert("Failed to save contact. Please try again.");
    }
  };

  const handleDeleteContact = async (id: string) => {
    if (!confirm("Are you sure you want to delete this contact?")) {
      return;
    }

    try {
      await contactService.deleteContact(id);
      setPeople((prev) => prev.filter((p) => p._id !== id));
      setSelectedPerson(null);
    } catch (error) {
      console.error("Error deleting contact:", error);
      alert("Failed to delete contact.");
    }
  };

  /**
   * Modal component to display detailed information about a selected connection.
   */
  const renderPersonDetailsModal = () => (
    <AnimatePresence>
      {selectedPerson && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => setSelectedPerson(null)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className="bg-white dark:bg-slate-900 w-full max-w-md rounded-5xl shadow-2xl relative z-100 overflow-hidden border border-gray-100 dark:border-slate-800"
          >
            {/* Modal Header/Art */}
            <div className="h-40 bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-500 relative">
              <button
                onClick={() => setSelectedPerson(null)}
                className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center bg-black/20 backdrop-blur-md rounded-full text-white hover:bg-black/30 transition-colors border border-white/10"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Avatar & Info */}
            <div className="px-8 -mt-20 text-center relative z-10">
              <div className="inline-block p-1.5 bg-white dark:bg-slate-800 rounded-[2rem] shadow-2xl">
                <img
                  src={selectedPerson.imageUrl || selectedPerson.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(selectedPerson.name)}`}
                  className="w-36 h-36 rounded-[1.7rem] bg-gray-50 dark:bg-slate-900 object-cover"
                  alt={selectedPerson.name}
                />
              </div>

              <div className="mt-4 mb-6">
                <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight mb-1 font-['Space_Grotesk']">
                  {selectedPerson.name}
                </h2>
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-wider">
                  {selectedPerson.role}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center gap-4 mb-8">
                <button className="flex flex-col items-center gap-2 group">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/30 group-hover:scale-110 transition-transform">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>
                  <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    Call
                  </span>
                </button>
                <button className="flex flex-col items-center gap-2 group">
                  <div className="w-12 h-12 rounded-2xl bg-gray-900 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                  <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                    Email
                  </span>
                </button>
              
                {selectedPerson._id && (
                  <button
                    onClick={() => handleDeleteContact(selectedPerson._id)}
                    className="flex flex-col items-center gap-2 group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-500/35 group-hover:scale-110 transition-transform">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        <line x1="10" y1="11" x2="10" y2="17" />
                        <line x1="14" y1="11" x2="14" y2="17" />
                      </svg>
                    </div>
                    <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                      Delete
                    </span>
                  </button>
                )}
              </div>

              {/* Bio/Info */}
              <div className="text-left space-y-4 mb-2">
                <div className="bg-gray-50 dark:bg-slate-800/50 rounded-3xl p-6 border border-gray-100 dark:border-slate-800">
                  <h3 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-blue-500"></div>
                    Professional Bio
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium break-words whitespace-pre-wrap">
                    {selectedPerson.bio || "No professional bio available."}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  /**
   * Modal component to add a new connection (Contact).
   */
  const renderAddConnectionModal = () => (
    <AnimatePresence>
      {isAddModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsAddModalOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-4xl shadow-2xl relative z-100 p-10 overflow-hidden border border-gray-100 dark:border-slate-800"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Add New Contact
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-10 h-10 flex items-center justify-center bg-gray-100/80 dark:bg-slate-800 rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                title="Close"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Name"
                value={newContactName}
                onChange={(e) => setNewContactName(e.target.value)}
                className="w-full p-3 border rounded-xl outline-none focus:border-blue-500 bg-gray-50/50 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              />
              <input
                type="text"
                placeholder="Role"
                value={newContactRole}
                onChange={(e) => setNewContactRole(e.target.value)}
                className="w-full p-3 border rounded-xl outline-none focus:border-blue-500 bg-gray-50/50 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              />
              <input
                type="email"
                placeholder="Email (Optional)"
                value={newContactEmail}
                onChange={(e) => setNewContactEmail(e.target.value)}
                className="w-full p-3 border rounded-xl outline-none focus:border-blue-500 bg-gray-50/50 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              />
              <input
                type="tel"
                placeholder="Phone (Optional)"
                value={newContactPhone}
                onChange={(e) => setNewContactPhone(e.target.value)}
                className="w-full p-3 border rounded-xl outline-none focus:border-blue-500 bg-gray-50/50 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              />
              <div className="flex items-center gap-4 p-3 border border-dashed rounded-xl bg-gray-50/50 dark:bg-slate-800/50 dark:border-slate-700 border-gray-200 dark:border-slate-700">
                <div className="relative w-12 h-12 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 flex items-center justify-center overflow-hidden shrink-0 group">
                  {newContactImageUrl ? (
                    <img
                      src={newContactImageUrl}
                      alt="Avatar Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      className="text-gray-400"
                    >
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                      <circle cx="12" cy="13" r="4" />
                    </svg>
                  )}
                  {isUploadingImage && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    disabled={isUploadingImage}
                    onChange={handleImageUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-0.5">
                    Contact Photo
                  </span>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 truncate">
                    {isUploadingImage ? "Uploading to Firebase..." : newContactImageUrl ? "Upload successful" : "Click to upload image file"}
                  </p>
                </div>
              </div>
             
              <textarea
                placeholder="Bio (Optional)"
                value={newContactBio}
                onChange={(e) => setNewContactBio(e.target.value)}
                className="w-full p-3 border rounded-xl outline-none focus:border-blue-500 bg-gray-50/50 dark:bg-slate-800 dark:border-slate-700 dark:text-white h-20 resize-none"
              />
              <button
                onClick={handleSaveContact}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold mt-4 hover:bg-blue-700 transition-colors"
              >
                Save Contact
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="flex flex-col h-full bg-[#f0f0eb] dark:bg-slate-950 px-4 sm:px-8 relative overflow-hidden transition-colors duration-300">
      {/* Header Area */}
      <header className="flex items-center justify-between mb-6 relative z-20">
        <div className="flex gap-2">
          <div className="flex items-center gap-2">
            <button onClick={() => navigate(-1)}>
              <div className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-slate-800 transition-colors">
                <LeftArrowIcon />
              </div>
            </button>
          </div>
          <Breadcrumbs
            items={[
              { label: "BizInfra", to: "/dashboard/bizinfra" },
              { label: "Network", to: "/dashboard/bizinfra/network" },
            ]}
          />
        </div>

        <div className="flex items-center gap-2 relative">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-slate-800 transition-colors"
          >
            <SearchIcon />
          </motion.button>

          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsPlusDropdownOpen(!isPlusDropdownOpen)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isPlusDropdownOpen ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30" : "text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-slate-800"}`}
            >
              <PlusIcon />
            </motion.button>

            <AnimatePresence>
              {isPlusDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsPlusDropdownOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="absolute right-0 top-12 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-800 z-50 overflow-hidden py-2"
                  >
                    <button
                      onClick={() => {
                        setIsAddModalOpen(true);
                        setIsPlusDropdownOpen(false);
                      }}
                      className="w-full text-left px-5 py-3 text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-3"
                    >
                      Contact
                    </button>
                    <div className="h-px bg-gray-50 dark:bg-slate-800 mx-4 my-1"></div>
                    <button
                      onClick={() => {
                        console.log("Outreach Campaign (Cold)");
                        setIsPlusDropdownOpen(false);
                      }}
                      className="w-full text-left px-5 py-3 text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-3"
                    >
                      Outreach Campaign
                    </button>
               
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      <div className="flex justify-end items-center mb-8 relative z-10">
        <div className="flex items-center gap-2 relative">
          <div className="relative">
            <button
              onClick={() => setIsViewDropdownOpen(!isViewDropdownOpen)}
              className="px-4 py-2 bg-white dark:bg-slate-900 rounded-xl flex items-center gap-2 shadow-sm border border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors text-xs font-bold text-gray-700 dark:text-gray-300"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {viewMode === "people" && (
                  <>
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </>
                )}
              </svg>
              {viewMode === "people" ? "Directory" : "Outreach"}
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-transform duration-200 ${isViewDropdownOpen ? "rotate-180" : ""}`}
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            <AnimatePresence>
              {isViewDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsViewDropdownOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-800 py-2 z-50 overflow-hidden"
                  >
                    {[
                      {
                        id: "people",
                        label: "People view",
                        icon: <path d="M4 6h16M4 12h16M4 18h16" />,
                      },
                      {
                        id: "tree",
                        label: "Tree view",
                        icon: (
                          <rect width="18" height="18" x="3" y="3" rx="2" />
                        ),
                      },
                      {
                        id: "list",
                        label: "List view",
                        icon: <path d="M4 6h16M4 12h16M4 18h16" />,
                      },
                    ].map((option) => (
                      <button
                        key={option.id}
                        onClick={() => {
                          setViewMode(option.id as "list" | "people" | "tree");
                          setIsViewDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-xs font-bold transition-colors flex items-center gap-3
                          ${viewMode === option.id ? "text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/40" : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800"}
                        `}
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          {option.icon}
                        </svg>
                        {option.label}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-20 relative">
        {/* Contacts Section */}
        <div className="mb-8 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-0 px-1 font-['Space_Grotesk']">
            Contacts
          </h3>
          {loading && (
            <span className="text-xs text-gray-400 dark:text-gray-500 animate-pulse">
              Loading...
            </span>
          )}
        </div>
        {/* Existing Views */}
        {viewMode === "people" ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 mb-8">
            {people.map((person, i) => {
              const avatarUrl = person.imageUrl || person.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(person.name)}`;
              return (
                <motion.div
                  key={person._id || i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex flex-col items-center group cursor-pointer"
                  onClick={() => setSelectedPerson(person)}
                >
                  <div className="w-full aspect-square bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 p-0 mb-0 group-hover:shadow-md transition-shadow relative overflow-hidden">
                    <div className="absolute inset-0 bg-linear-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <img
                      src={avatarUrl}
                      className="w-full h-full object-cover rounded-2xl relative z-10"
                      alt={person.name}
                    />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-0.5">
                    {person.name}
                  </h3>
                  <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500">
                    {person.role}
                  </p>
                </motion.div>
              );
            })}
          </div>
        ) : viewMode === "tree" ? (
          <div className="w-full h-[500px] rounded-4xl relative overflow-hidden bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 mb-8">
            <NetworkTree people={people} onSelectPerson={setSelectedPerson} />
          </div>
        ) : (
          <ListView people={people} onSelectPerson={setSelectedPerson} />
        )}

        <div className="h-px bg-gray-200 dark:bg-slate-800 w-full my-8"></div>
      </div>

      {renderAddConnectionModal()}
      {renderPersonDetailsModal()}
    </div>
  );
};

export default Network;
