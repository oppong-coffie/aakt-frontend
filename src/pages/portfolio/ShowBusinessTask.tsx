import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { API_URL } from "../../config/api";

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

const ShowBusinessTask = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDocUrl, setSelectedDocUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await fetch(`${API_URL}/businessitems/task/detail/${taskId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`
          }
        });
        if (!response.ok) {
          throw new Error("Failed to fetch task");
        }
        const data = await response.json();
        setTask(data.data || data);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (taskId) {
      fetchTask();
    }
  }, [taskId]);

  return (
    <div className="flex flex-col h-full bg-[#f0f0eb] dark:bg-slate-950 p-4 sm:p-8 relative overflow-hidden font-['Inter'] transition-colors duration-300 min-h-screen">
      <header className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          <div className="flex items-center gap-2">
            <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-slate-100 hover:bg-blue-600 dark:hover:bg-blue-500 rounded-xl transition-colors cursor-pointer">
              <LeftArrowIcon />
            </button>
          </div>
          <div className="flex items-center text-sm font-medium text-gray-500">
            <span>Portfolio</span>
            <span className="mx-2">/</span>
            <span>SaaS</span>
            <span className="mx-2">/</span>
            <span className="text-gray-900 dark:text-white font-bold">Task Documents</span>
          </div>
        </div>
      </header>

      <div className="flex-1 bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm relative overflow-hidden flex flex-col max-w-5xl mx-auto w-full">
        <div className="p-8 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
            {task?.taskName ? `${task.taskName} - Documents` : "Task Documents"}
          </h1>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-4">
          {loading ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400 font-medium">Loading...</div>
          ) : error ? (
            <div className="text-center py-12 text-red-500 font-medium">{error}</div>
          ) : !task || !task.documents || task.documents.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400 font-medium">
              <p>No documents found for this task.</p>
            </div>
          ) : (
            task.documents.map((doc: any, idx: number) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.02 }}
                className="p-4 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{doc.name || "Unnamed Document"}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Document</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedDocUrl(doc.url)}
                  className="px-4 py-2 text-sm font-bold text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors cursor-pointer"
                >
                  Open Document
                </button>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Document Viewer Modal */}
      {selectedDocUrl && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-900 w-full h-full max-w-6xl rounded-3xl shadow-2xl flex flex-col overflow-hidden relative border border-gray-200 dark:border-slate-800"
          >
            <div className="p-4 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between bg-gray-50 dark:bg-slate-800/50">
              <h3 className="font-bold text-gray-900 dark:text-white">Document Viewer</h3>
              <button 
                onClick={() => setSelectedDocUrl(null)}
                className="w-8 h-8 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors cursor-pointer text-gray-600 dark:text-gray-300"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="flex-1 bg-gray-100 dark:bg-black relative">
              <iframe 
                src={selectedDocUrl} 
                className="w-full h-full border-none"
                title="Document Viewer"
              />
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ShowBusinessTask;
