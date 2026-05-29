import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import { useState, useEffect, useRef } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import { Palette, Plus, Trash2, Check } from "lucide-react";
import { whiteboardService } from "../../api/whiteboard.service";
import type { WhiteboardItem } from "../../api/whiteboard.service";



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

const Whiteboard = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useOutletContext<{ isDarkMode: boolean }>();

  const [whiteboards, setWhiteboards] = useState<WhiteboardItem[]>([]);
  const [activeBoardId, setActiveBoardId] = useState<string>("");
  const [newTitle, setNewTitle] = useState("");
  const [isAutosaving, setIsAutosaving] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const activeBoard = whiteboards.find((b) => b._id === activeBoardId) || whiteboards[0];

  const saveTimeoutRef = useRef<any>(null);
  const lastSavedElementsRef = useRef<string>("");

  const fetchWhiteboards = async () => {
    try {
      setLoading(true);
      const data = await whiteboardService.getWhiteboards();
      setWhiteboards(data);
      if (data.length > 0) {
        setActiveBoardId(data[0]._id);
      }
    } catch (error) {
      console.error("Error loading whiteboards:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWhiteboards();
  }, []);

  useEffect(() => {
    if (activeBoard) {
      lastSavedElementsRef.current = JSON.stringify(activeBoard.elements || []);
    }
  }, [activeBoardId]);

  const handleCreateBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    const title = newTitle.trim() || `Untitled Board`;
    try {
      const item = await whiteboardService.createWhiteboard({
        title,
        elements: []
      });
      setWhiteboards((prev) => [item, ...prev]);
      setActiveBoardId(item._id);
      setNewTitle("");
    } catch (error) {
      console.error("Error creating whiteboard:", error);
      alert("Failed to create whiteboard.");
    }
  };

  const handleDeleteBoard = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this whiteboard?")) {
      return;
    }
    try {
      await whiteboardService.deleteWhiteboard(id);
      const filtered = whiteboards.filter((b) => b._id !== id);
      setWhiteboards(filtered);
      if (activeBoardId === id && filtered.length > 0) {
        setActiveBoardId(filtered[0]._id);
      } else if (filtered.length === 0) {
        setActiveBoardId("");
      }
    } catch (error) {
      console.error("Error deleting whiteboard:", error);
      alert("Failed to delete whiteboard.");
    }
  };

  const handleRenameActiveBoard = async (title: string) => {
    if (!activeBoardId) return;
    setWhiteboards((prev) =>
      prev.map((board) => (board._id === activeBoardId ? { ...board, title } : board))
    );
    try {
      await whiteboardService.updateWhiteboard(activeBoardId, { title });
    } catch (error) {
      console.error("Error renaming whiteboard:", error);
    }
  };

  const handleCanvasChange = (elements: readonly any[]) => {
    if (!activeBoardId || !activeBoard) return;
    
    const elementsStr = JSON.stringify(elements);
    if (elementsStr === lastSavedElementsRef.current) {
      return;
    }

    lastSavedElementsRef.current = elementsStr;
    setIsAutosaving(true);

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        const updated = await whiteboardService.updateWhiteboard(activeBoardId, {
          elements: elements as any[]
        });
        setWhiteboards((prev) =>
          prev.map((b) => (b._id === activeBoardId ? updated : b))
        );
      } catch (error) {
        console.error("Error saving whiteboard:", error);
      } finally {
        setIsAutosaving(false);
      }
    }, 1500);
  };

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#f0f0eb] dark:bg-slate-950 text-gray-500 dark:text-gray-400 transition-colors duration-300">
        <div className="text-center space-y-4">
          <Palette className="w-12 h-12 animate-pulse mx-auto text-blue-500" />
          <p className="text-sm font-semibold font-['Inter']">Loading whiteboards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#f0f0eb] dark:bg-slate-950 px-4 sm:px-8 pb-4 relative overflow-hidden transition-colors duration-300">
      {/* Header Area */}
      <header className="flex items-center justify-between py-4 flex-shrink-0">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)}>
            <div className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-slate-800 transition-colors">
              <LeftArrowIcon />
            </div>
          </button>
          <Breadcrumbs
            items={[
              { label: "Integrations", to: "/dashboard/integrations" },
              { label: "Whiteboard", to: "/dashboard/integrations/whiteboard" },
            ]}
          />
        </div>
        <div className="flex items-center gap-3">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
          </span>
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 font-['Inter']">
            Canvas Active
          </span>
        </div>
      </header>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-100px)] overflow-hidden pb-4">
        {/* Left Column: Form & Saved Whiteboards */}
        <div className="space-y-6 lg:col-span-1 flex flex-col h-full overflow-y-auto pr-1">
          {/* Create Board Form */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
            <h2 className="text-lg font-bold mb-4 font-space-grotesk flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-600" /> New Whiteboard
            </h2>
            <form onSubmit={handleCreateBoard} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Board Title</label>
                <input
                  type="text"
                  placeholder="e.g., UI Flow Sketch"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
                />
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-750 text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-blue-500/10 cursor-pointer"
              >
                Create Board
              </button>
            </form>
          </div>

          {/* Boards List */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex-1 flex flex-col min-h-[250px] overflow-hidden">
            <h3 className="text-md font-bold mb-3 font-space-grotesk text-slate-600 dark:text-slate-300">Whiteboards Library</h3>
            <div className="space-y-2 overflow-y-auto flex-1 pr-1">
              {whiteboards.map((board) => (
                <div
                  key={board._id}
                  onClick={() => setActiveBoardId(board._id)}
                  className={`flex items-start justify-between gap-3 p-3 rounded-xl cursor-pointer border transition-all ${
                    activeBoardId === board._id
                      ? "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900"
                      : "bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-900 hover:bg-slate-100 dark:hover:bg-slate-900/50"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`p-1.5 rounded-lg shrink-0 ${
                      activeBoardId === board._id ? "bg-blue-500 text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-500"
                    }`}>
                      <Palette className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold truncate text-slate-800 dark:text-slate-200">{board.title}</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500">
                        {board.updatedAt ? new Date(board.updatedAt).toLocaleDateString() : ""}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleDeleteBoard(board._id, e)}
                    className="p-1 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors shrink-0"
                    title="Remove Board"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {whiteboards.length === 0 && (
                <p className="text-xs text-slate-400 text-center py-6">No boards in workspace.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Canvas Editor */}
        <div className="lg:col-span-3 flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
          {activeBoard ? (
            <div className="flex flex-col h-full relative">
              {/* Active Board Header */}
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 flex-shrink-0 bg-white dark:bg-slate-900 z-10">
                <input
                  type="text"
                  value={activeBoard.title}
                  onChange={(e) => handleRenameActiveBoard(e.target.value)}
                  className="text-lg font-bold font-space-grotesk bg-transparent border-none outline-none text-slate-800 dark:text-slate-100 flex-1 focus:ring-2 focus:ring-blue-500/25 rounded-md px-1"
                />
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
                    Saved: {activeBoard.updatedAt ? new Date(activeBoard.updatedAt).toLocaleDateString() : ""}
                  </span>
                  {isAutosaving ? (
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                  ) : (
                    <Check className="w-3.5 h-3.5 text-green-500" />
                  )}
                </div>
              </div>

              {/* Excalidraw Container */}
              <div className="flex-1 w-full relative min-h-[400px]">
                <Excalidraw
                  key={activeBoard._id}
                  initialData={{
                    elements: activeBoard.elements || [],
                  }}
                  theme={isDarkMode ? "dark" : "light"}
                  onChange={handleCanvasChange}
                  UIOptions={{
                    canvasActions: {
                      toggleTheme: false,
                    },
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-gray-500 dark:text-gray-400">
              <Palette className="w-12 h-12 mb-2 text-gray-300" />
              <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300">No Active Whiteboard</h3>
              <p className="text-sm">Create a new whiteboard from the sidebar to start sketching.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Whiteboard;
