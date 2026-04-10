import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface EditItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, newName: string, newImage: string | null) => void;
  item: { id: string; label: string; image?: string | null } | null;
  hideImage?: boolean;
}

const EditItemModal = ({
  isOpen,
  onClose,
  onSave,
  item,
  hideImage = false,
}: EditItemModalProps) => {
  const [name, setName] = useState("");
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && item) {
      setName(item.label);
      setImage(item.image || null);
    }
  }, [isOpen, item]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (item) {
      onSave(item.id, name, image);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl relative z-100 p-8 font-['Inter'] border border-gray-100 dark:border-slate-800"
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 font-['Space_Grotesk']">
              Edit Item
            </h3>

            <div className="space-y-6">
              {/* Image Upload - Conditionally Rendered */}
              {!hideImage && (
                <div className="flex flex-col items-center gap-4">
                  <div className="relative w-24 h-24 rounded-2xl bg-gray-100 dark:bg-slate-800 border-2 border-dashed border-gray-300 dark:border-slate-700 flex items-center justify-center overflow-hidden group hover:border-blue-500 transition-colors cursor-pointer">
                    {image ? (
                      <img
                        src={image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-gray-400 dark:text-gray-500 group-hover:text-blue-500">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect
                            x="3"
                            y="3"
                            width="18"
                            height="18"
                            rx="2"
                            ry="2"
                          />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
                        </svg>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                  <span className="text-sm text-gray-500">
                    Click to upload image
                  </span>
                </div>
              )}

              {/* Name Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900/20 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  placeholder="Item name"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 px-4 py-3 rounded-xl bg-blue-600 dark:bg-blue-500 text-white font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors shadow-lg shadow-blue-600/10 dark:shadow-blue-500/10"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EditItemModal;
