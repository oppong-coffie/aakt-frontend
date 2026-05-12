import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
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

const ShowBusinessDoc = () => {
  const { docId } = useParams<{ docId: string }>();
  const [searchParams] = useSearchParams();
  const businessId = searchParams.get("businessId");
  const navigate = useNavigate();
  
  const [document, setDocument] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        let foundDoc = null;
        
        // 1. First attempt: detail endpoint if it exists
        try {
          const detailRes = await fetch(`${API_URL}/businessdocuments/detail/${docId}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token") || ""}`
            }
          });
          if (detailRes.ok) {
            const data = await detailRes.json();
            foundDoc = data.data || data;
          }
        } catch (e) {
          console.warn("Detail fetch failed, falling back to business list fetch", e);
        }

        // 2. Second attempt: fetch all for business and find (if businessId exists)
        if (!foundDoc && businessId) {
          const listRes = await fetch(`${API_URL}/businessdocuments/${businessId}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token") || ""}`
            }
          });
          if (listRes.ok) {
            const json = await listRes.json();
            const docs = Array.isArray(json.data) ? json.data : (Array.isArray(json) ? json : []);
            foundDoc = docs.find((d: any) => d._id === docId);
          }
        }
        
        if (foundDoc) {
          setDocument(foundDoc);
        } else {
          throw new Error("Document not found");
        }
        
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (docId) {
      fetchDoc();
    }
  }, [docId, businessId]);

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
            <span className="text-gray-900 dark:text-white font-bold">Document Viewer</span>
          </div>
        </div>
      </header>

      <div className="flex-1 bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm relative overflow-hidden flex flex-col max-w-6xl mx-auto w-full">
        <div className="p-8 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
            {document?.name || "Loading Document..."}
          </h1>
          {document?.url && (
            <a 
              href={document.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 py-2 text-sm font-bold bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 rounded-lg transition-colors cursor-pointer"
            >
              Open in New Tab
            </a>
          )}
        </div>

        <div className="flex-1 bg-gray-100 dark:bg-black relative flex flex-col overflow-hidden">
          {loading ? (
            <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400 font-medium">
              Loading Document...
            </div>
          ) : error ? (
            <div className="flex-1 flex items-center justify-center text-red-500 font-medium">
              {error}
            </div>
          ) : document?.url ? (
            <iframe 
              src={document.url} 
              className="w-full h-full flex-1 border-none bg-white"
              title={document.name}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400 font-medium">
              Document format not supported or URL is missing.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShowBusinessDoc;
