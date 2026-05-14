import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { API_URL } from "../../config/api";
import PageLayout from "../../components/PageLayout";
import PageHeader from "../../components/PageHeader";
import { motion } from "framer-motion";

const BusinessFolder = () => {
  const { folderId } = useParams();
  const [searchParams] = useSearchParams();
  const businessId = searchParams.get("businessId") || localStorage.getItem("currentBusinessId") || "";
  const navigate = useNavigate();

  const [folderName, setFolderName] = useState("Loading...");
  const [projects, setProjects] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);

  useEffect(() => {
    // Fetch folder details to get the name
    const fetchFolder = async () => {
      try {
        const res = await fetch(`${API_URL}/folders`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []);
          const folder = list.find((f: any) => f._id === folderId || f.id === folderId);
          if (folder) setFolderName(folder.folderName || folder.name || "Folder");
          else setFolderName("Folder");
        }
      } catch (e) {
        console.error(e);
        setFolderName("Folder");
      }
    };
    fetchFolder();

    if (businessId) {
      const fetchProjects = async () => {
        try {
          const response = await fetch(`${API_URL}/portfolio/projects/${businessId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` }
          });
          if (response.ok) {
            const data = await response.json();
            const list = Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []);
            setProjects(list.filter((p: any) => p.folderId === folderId));
          }
        } catch (e) { console.error(e); }
      };

      const fetchTasks = async () => {
        try {
          const response = await fetch(`${API_URL}/businessitems/task/${businessId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` }
          });
          if (response.ok) {
            const data = await response.json();
            const list = Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []);
            setTasks(list.filter((t: any) => t.folderId === folderId));
          }
        } catch (e) { console.error(e); }
      };

      const fetchDocuments = async () => {
        try {
          const response = await fetch(`${API_URL}/businessdocuments/${businessId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` }
          });
          if (response.ok) {
            const data = await response.json();
            const list = Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []);
            setDocuments(list.filter((d: any) => d.folderId === folderId));
          }
        } catch (e) { console.error(e); }
      };

      fetchProjects();
      fetchTasks();
      fetchDocuments();
    }
  }, [businessId, folderId]);

  const base = "/dashboard/portfolio/saas";
  const queryString = businessId ? `?businessId=${businessId}` : "";

  const projectCards = projects.map((project) => ({
    id: project._id,
    label: project.projectName || "Unnamed Project",
    to: `${base}/project/${project._id}${queryString}`,
    isProject: true,
  }));

  const taskCards = tasks.map((task) => ({
    id: task._id,
    label: task.taskName || "Unnamed Task",
    to: `${base}/showbusinesstask/${task._id}${queryString}`,
    isTask: true,
  }));

  const documentCards = documents.map((doc) => ({
    id: doc._id,
    label: doc.name || "Unnamed Document",
    to: `${base}/showbusinessdoc/${doc._id}${queryString}`,
    isDocument: true,
  }));

  const displayItems = [...projectCards, ...taskCards, ...documentCards];

  const currentCrumbs = [
    { label: "Portfolio", to: "/dashboard/portfolio" },
    { label: "SaaS", to: "/dashboard/portfolio/saas" },
    { label: folderName, to: "#" },
  ];

  return (
    <PageLayout>
      <PageHeader
        breadcrumbs={currentCrumbs}
      />
      <div className="flex flex-col items-center justify-start py-8 px-4 w-full max-w-7xl mx-auto h-[calc(100vh-100px)] overflow-y-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">{folderName}</h1>
        
        {displayItems.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-12">
            This folder is empty. Drag and drop items into it from the SaaS dashboard.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            {displayItems.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center gap-3 w-full group cursor-pointer p-6 rounded-[2.5rem] bg-white dark:bg-slate-800 shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-md transition-all font-bold relative"
                onClick={() => navigate(item.to)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-full aspect-16/10 bg-white dark:bg-slate-800 rounded-4xl shadow-sm border border-gray-100 dark:border-slate-700 group-hover:shadow-md transition-shadow flex items-center justify-center overflow-hidden relative">
                  <div className="absolute inset-0 bg-linear-to-br from-blue-50/20 dark:from-blue-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-60 group-hover:opacity-100 transition-opacity">
                    {(item as any).isProject ? (
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500 group-hover:scale-110 transition-transform duration-300">
                        <rect x="3" y="3" width="7" height="7"></rect>
                        <rect x="14" y="3" width="7" height="7"></rect>
                        <rect x="14" y="14" width="7" height="7"></rect>
                        <rect x="3" y="14" width="7" height="7"></rect>
                      </svg>
                    ) : (item as any).isTask ? (
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 group-hover:scale-110 transition-transform duration-300">
                        <path d="M9 11l3 3L22 4"></path>
                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                      </svg>
                    ) : (item as any).isDocument ? (
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500 group-hover:scale-110 transition-transform duration-300">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                      </svg>
                    ) : (
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:scale-110 transition-transform duration-300">
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                      </svg>
                    )}
                  </div>
                </div>

                <div className="text-center mt-2 px-2">
                  <h3 className="text-base text-gray-900 dark:text-gray-100 line-clamp-2">
                    {item.label}
                  </h3>
                </div>

                {(item as any).isProject && (
                  <div className="absolute top-4 left-4 px-2 py-1 bg-blue-600/10 dark:bg-blue-400/10 text-blue-600 dark:text-blue-400 rounded-lg text-[10px] font-black uppercase tracking-widest">
                    Project
                  </div>
                )}
                {(item as any).isTask && (
                  <div className="absolute top-4 left-4 px-2 py-1 bg-green-600/10 dark:bg-green-400/10 text-green-600 dark:text-green-400 rounded-lg text-[10px] font-black uppercase tracking-widest">
                    Task
                  </div>
                )}
                {(item as any).isDocument && (
                  <div className="absolute top-4 left-4 px-2 py-1 bg-purple-600/10 dark:bg-purple-400/10 text-purple-600 dark:text-purple-400 rounded-lg text-[10px] font-black uppercase tracking-widest">
                    Document
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default BusinessFolder;
