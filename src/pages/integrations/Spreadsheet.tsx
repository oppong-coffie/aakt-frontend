import { useState, useEffect, useRef } from "react";
import { 
  FileSpreadsheet, 
  Plus, 
  Trash2, 
  Save, 
  Check, 
  Loader2, 
  AlertCircle
} from "lucide-react";
import { createUniver, LocaleType } from "@univerjs/presets";
import { UniverSheetsCorePreset } from "@univerjs/preset-sheets-core";
import "@univerjs/preset-sheets-core/lib/index.css";
import enUS from "@univerjs/preset-sheets-core/locales/en-US";
import { spreadsheetService } from "../../api/spreadsheet.service";
import type { SpreadsheetItem } from "../../api/spreadsheet.service";

const Spreadsheet = () => {
  const [spreadsheets, setSpreadsheets] = useState<SpreadsheetItem[]>([]);
  const [activeSpreadsheetId, setActiveSpreadsheetId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [newTitle, setNewTitle] = useState<string>("");
  const [saveStatus, setSaveStatus] = useState<"All changes saved" | "Saving..." | "Sync Error" | "Saved">("All changes saved");
  
  const containerRef = useRef<HTMLDivElement>(null);
  const univerAPIRef = useRef<any>(null);
  const activeSheetInfoRef = useRef<{ id: string; title: string }>({ id: "", title: "" });
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch spreadsheets on mount
  useEffect(() => {
    const fetchSpreadsheets = async () => {
      try {
        setLoading(true);
        const data = await spreadsheetService.getSpreadsheets();
        setSpreadsheets(data);
        if (data.length > 0) {
          setActiveSpreadsheetId(data[0]._id);
        }
      } catch (err) {
        console.error("Error loading spreadsheets:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSpreadsheets();
  }, []);

  // Update active sheet info ref whenever activeSpreadsheetId or its title changes
  const activeSheet = spreadsheets.find(s => s._id === activeSpreadsheetId);
  useEffect(() => {
    if (activeSheet) {
      activeSheetInfoRef.current = { id: activeSheet._id, title: activeSheet.title };
    }
  }, [activeSpreadsheetId, activeSheet?.title]);

  // Debounced save helper
  const debouncedSave = (id: string, title: string, snapshot: any) => {
    setSaveStatus("Saving...");
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await spreadsheetService.updateSpreadsheet(id, { title, workbookData: snapshot });
        setSaveStatus("All changes saved");
      } catch (err) {
        console.error("Error saving spreadsheet:", err);
        setSaveStatus("Sync Error");
      }
    }, 1200);
  };

  // Force immediate save
  const forceSave = async () => {
    if (!activeSpreadsheetId || !univerAPIRef.current) return;
    const wb = univerAPIRef.current.getActiveWorkbook();
    if (!wb) return;
    
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }
    
    setSaveStatus("Saving...");
    try {
      const snapshot = wb.save();
      const title = activeSheetInfoRef.current.title;
      await spreadsheetService.updateSpreadsheet(activeSpreadsheetId, { title, workbookData: snapshot });
      setSaveStatus("All changes saved");
    } catch (err) {
      console.error("Error saving spreadsheet:", err);
      setSaveStatus("Sync Error");
    }
  };

  // Save before switching sheet
  const saveBeforeSwitch = async (prevId: string) => {
    if (saveTimeoutRef.current && univerAPIRef.current) {
      const prevSheet = spreadsheets.find(s => s._id === prevId);
      if (prevSheet) {
        const wb = univerAPIRef.current.getActiveWorkbook();
        if (wb) {
          const snapshot = wb.save();
          if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
            saveTimeoutRef.current = null;
          }
          try {
            await spreadsheetService.updateSpreadsheet(prevId, { title: prevSheet.title, workbookData: snapshot });
          } catch (err) {
            console.error("Error saving spreadsheet on switch:", err);
          }
        }
      }
    }
  };

  const handleSelectSheet = async (id: string) => {
    if (activeSpreadsheetId === id) return;
    if (activeSpreadsheetId) {
      await saveBeforeSwitch(activeSpreadsheetId);
    }
    setActiveSpreadsheetId(id);
    setSaveStatus("All changes saved");
  };

  // Initialize Univer instance when activeSpreadsheetId changes
  useEffect(() => {
    if (!activeSpreadsheetId || !containerRef.current) {
      univerAPIRef.current = null;
      return;
    }

    const currentSheet = spreadsheets.find(s => s._id === activeSpreadsheetId);
    if (!currentSheet) return;

    // Clear container
    containerRef.current.innerHTML = "";

    // Initialize Univer
    const { univer, univerAPI } = createUniver({
      locale: LocaleType.EN_US,
      locales: {
        [LocaleType.EN_US]: enUS,
      },
      presets: [
        UniverSheetsCorePreset({
          container: containerRef.current,
        }),
      ],
    });

    univerAPIRef.current = univerAPI;

    // Create / load worksheet with workbookData snapshot
    univerAPI.createUniverSheet(currentSheet.workbookData || {});

    // Listen to command changes (CommandType.MUTATION = 2)
    const disposable = univerAPI.onCommandExecuted((command) => {
      if (command.type === 2) {
        const wb = univerAPI.getActiveWorkbook();
        if (wb) {
          const snapshot = wb.save();
          debouncedSave(activeSheetInfoRef.current.id, activeSheetInfoRef.current.title, snapshot);
        }
      }
    });

    return () => {
      disposable.dispose();
      univer.dispose();
      univerAPIRef.current = null;
    };
  }, [activeSpreadsheetId]);

  // Clean up any pending saves on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const handleCreateSheet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const created = await spreadsheetService.createSpreadsheet({ title: newTitle.trim() });
      setSpreadsheets((prev) => [created, ...prev]);
      setActiveSpreadsheetId(created._id);
      setNewTitle("");
    } catch (err) {
      console.error("Error creating spreadsheet:", err);
    }
  };

  const handleDeleteSheet = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this spreadsheet?")) return;

    try {
      await spreadsheetService.deleteSpreadsheet(id);
      const updated = spreadsheets.filter((s) => s._id !== id);
      setSpreadsheets(updated);
      
      if (activeSpreadsheetId === id) {
        if (updated.length > 0) {
          setActiveSpreadsheetId(updated[0]._id);
        } else {
          setActiveSpreadsheetId(null);
        }
      }
    } catch (err) {
      console.error("Error deleting spreadsheet:", err);
    }
  };

  const handleRenameActiveSheet = (title: string) => {
    if (!activeSpreadsheetId) return;
    setSpreadsheets((prev) =>
      prev.map((s) => (s._id === activeSpreadsheetId ? { ...s, title } : s))
    );
    
    // Trigger debounced save for the new title (keeping the current snapshot)
    if (univerAPIRef.current) {
      const wb = univerAPIRef.current.getActiveWorkbook();
      const snapshot = wb ? wb.save() : activeSheet?.workbookData;
      debouncedSave(activeSpreadsheetId, title, snapshot);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
        <div>
          <h1 className="text-3xl font-extrabold font-space-grotesk tracking-tight text-white flex items-center gap-3">
            <FileSpreadsheet className="w-8 h-8 text-emerald-500 animate-pulse" />
            Spreadsheets
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Build models, run formulas, and organize data in a premium collaborative grid.
          </p>
        </div>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left pane: creation and list */}
        <div className="space-y-6 lg:col-span-1">
          {/* Create Spreadsheet form */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <h2 className="text-lg font-bold mb-4 font-space-grotesk text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-emerald-500" /> New Spreadsheet
            </h2>
            <form onSubmit={handleCreateSheet} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Spreadsheet Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sales Forecast 2026"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-100 placeholder-slate-500"
                />
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-emerald-500/10 cursor-pointer"
              >
                Create Sheet
              </button>
            </form>
          </div>

          {/* Spreadsheet Library list */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col max-h-[450px]">
            <h3 className="text-md font-bold mb-3 font-space-grotesk text-slate-300">
              Spreadsheets Library
            </h3>
            <div className="space-y-2 overflow-y-auto flex-1 pr-1">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-10 space-y-2">
                  <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
                  <p className="text-xs text-slate-500">Loading sheets...</p>
                </div>
              ) : spreadsheets.map((sheet) => (
                <div
                  key={sheet._id}
                  onClick={() => handleSelectSheet(sheet._id)}
                  className={`flex items-start justify-between gap-3 p-3 rounded-xl cursor-pointer border transition-all ${
                    activeSpreadsheetId === sheet._id
                      ? "bg-emerald-950/20 border-emerald-900 text-white"
                      : "bg-slate-950 border-slate-900 text-slate-300 hover:bg-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`p-1.5 rounded-lg shrink-0 ${
                      activeSpreadsheetId === sheet._id
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-800 text-slate-500"
                    }`}>
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold truncate">{sheet.title}</p>
                      <p className="text-[10px] text-slate-500">
                        {sheet.updatedAt ? new Date(sheet.updatedAt).toLocaleDateString() : ""}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleDeleteSheet(sheet._id, e)}
                    className="p-1 text-slate-500 hover:text-red-500 rounded-lg hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
                    title="Delete Spreadsheet"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {!loading && spreadsheets.length === 0 && (
                <p className="text-xs text-slate-500 text-center py-8">
                  No spreadsheets in workspace.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right pane: Univer Spreadsheet Editor */}
        <div className="lg:col-span-3">
          {activeSheet ? (
            <div className="flex flex-col bg-slate-900 border border-slate-800 rounded-2xl shadow-lg overflow-hidden h-full">
              {/* Active sheet header / controls */}
              <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between gap-4 flex-wrap bg-slate-900/50">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <input
                    type="text"
                    value={activeSheet.title}
                    onChange={(e) => handleRenameActiveSheet(e.target.value)}
                    className="text-lg font-bold font-space-grotesk bg-transparent border-none outline-none text-white focus:ring-2 focus:ring-emerald-500/25 rounded-md px-1.5 py-0.5 min-w-[200px]"
                    title="Rename Spreadsheet"
                  />
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium px-2 py-1 bg-slate-800/50 rounded-lg">
                    {saveStatus === "Saving..." && (
                      <>
                        <Loader2 className="w-3.5 h-3.5 text-emerald-500 animate-spin" />
                        <span>Autosaving...</span>
                      </>
                    )}
                    {saveStatus === "All changes saved" && (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span>All changes saved</span>
                      </>
                    )}
                    {saveStatus === "Sync Error" && (
                      <>
                        <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                        <span className="text-red-400">Save failed</span>
                      </>
                    )}
                  </div>
                </div>

                <button
                  onClick={forceSave}
                  className="flex items-center gap-2 py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-all cursor-pointer border border-slate-700/50"
                >
                  <Save className="w-3.5 h-3.5" /> Save Now
                </button>
              </div>

              {/* Mount point for Univer */}
              <div className="p-1 bg-slate-950 flex-1 relative min-h-[550px] md:min-h-[650px] w-full h-[calc(100vh-18rem)]">
                <div 
                  ref={containerRef} 
                  className="absolute inset-0 w-full h-full overflow-hidden" 
                />
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-20 shadow-lg text-center flex flex-col items-center justify-center min-h-[500px]">
              <FileSpreadsheet className="w-20 h-20 text-slate-800 mb-6 animate-pulse" />
              <h4 className="text-xl font-bold text-slate-300 mb-2">No Active Spreadsheet</h4>
              <p className="text-sm text-slate-500 max-w-sm">
                Create a spreadsheet from the left pane to begin calculating, graphing, and modeling data.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Spreadsheet;
