import { useState, useEffect, useRef } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { 
  Presentation, 
  Play, 
  Settings, 
  Plus, 
  Trash2, 
  Check, 
  Maximize2, 
  Layers,
  Info
} from "lucide-react";
import Breadcrumbs from "../../components/Breadcrumbs";
import { slideService } from "../../api/slide.service";
import type { SlideItem } from "../../api/slide.service";
import Reveal from "reveal.js";

// Import Reveal.js styles
import "reveal.js/reveal.css";
import "reveal.js/theme/black.css";

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

const Slides = () => {
  const navigate = useNavigate();
  const { isDarkMode: _isDarkMode } = useOutletContext<{ isDarkMode: boolean }>();

  const [decks, setDecks] = useState<SlideItem[]>([]);
  const [activeDeckId, setActiveDeckId] = useState<string>("");
  const [newTitle, setNewTitle] = useState("");
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [isPresentMode, setIsPresentMode] = useState<boolean>(false);
  const [isAutosaving, setIsAutosaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const activeDeck = decks.find((d) => d._id === activeDeckId) || decks[0];
  const activeSlide = activeDeck?.slides?.[activeSlideIndex] || activeDeck?.slides?.[0];

  const saveTimeoutRef = useRef<any>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const revealInstanceRef = useRef<any>(null);

  const fetchDecks = async () => {
    try {
      setLoading(true);
      const data = await slideService.getSlideDecks();
      setDecks(data);
      if (data.length > 0) {
        setActiveDeckId(data[0]._id);
      }
    } catch (error) {
      console.error("Error loading slide decks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDecks();
  }, []);

  // Initialize Reveal when Present Mode is turned on
  useEffect(() => {
    if (isPresentMode && revealRef.current && activeDeck) {
      const deck = new Reveal(revealRef.current, {
        embedded: true,
        keyboardCondition: "focused",
        controls: true,
        progress: true,
        center: true,
        hash: false,
        mouseWheel: false,
        transition: "slide"
      });

      deck.initialize().then(() => {
        revealInstanceRef.current = deck;
      });

      return () => {
        if (revealInstanceRef.current) {
          try {
            revealInstanceRef.current.destroy();
          } catch (e) {
            console.error("Reveal destroy failed:", e);
          }
          revealInstanceRef.current = null;
        }
      };
    }
  }, [isPresentMode, activeDeckId]);

  const handleCreateDeck = async (e: React.FormEvent) => {
    e.preventDefault();
    const title = newTitle.trim() || `Untitled Slideshow`;
    try {
      const item = await slideService.createSlideDeck({
        title,
        slides: [
          {
            id: "1",
            content: "<h2>" + title + "</h2><p>Use edit mode to replace this text.</p>",
            background: "#1e293b",
            notes: "Speaker notes go here."
          }
        ]
      });
      setDecks((prev) => [item, ...prev]);
      setActiveDeckId(item._id);
      setActiveSlideIndex(0);
      setNewTitle("");
    } catch (error) {
      console.error("Error creating slide deck:", error);
      alert("Failed to create presentation.");
    }
  };

  const handleDeleteDeck = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this presentation?")) {
      return;
    }
    try {
      await slideService.deleteSlideDeck(id);
      const filtered = decks.filter((d) => d._id !== id);
      setDecks(filtered);
      if (activeDeckId === id && filtered.length > 0) {
        setActiveDeckId(filtered[0]._id);
        setActiveSlideIndex(0);
      } else if (filtered.length === 0) {
        setActiveDeckId("");
      }
    } catch (error) {
      console.error("Error deleting slide deck:", error);
      alert("Failed to delete presentation.");
    }
  };

  const handleUpdateActiveDeck = (updatedSlides: any[], title?: string) => {
    if (!activeDeckId) return;

    setDecks((prevDecks) =>
      prevDecks.map((deck) =>
        deck._id === activeDeckId
          ? { ...deck, title: title !== undefined ? title : deck.title, slides: updatedSlides }
          : deck
      )
    );

    setIsAutosaving(true);

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await slideService.updateSlideDeck(activeDeckId, {
          title: title !== undefined ? title : activeDeck.title,
          slides: updatedSlides
        });
      } catch (error) {
        console.error("Error saving slide deck:", error);
      } finally {
        setIsAutosaving(false);
      }
    }, 1500);
  };

  const handleRenameActiveDeck = (title: string) => {
    if (!activeDeck) return;
    handleUpdateActiveDeck(activeDeck.slides, title);
  };

  const handleUpdateActiveSlide = (fields: Partial<typeof activeSlide>) => {
    if (!activeDeck || !activeSlide) return;
    const updatedSlides = activeDeck.slides.map((slide, index) =>
      index === activeSlideIndex ? { ...slide, ...fields } : slide
    );
    handleUpdateActiveDeck(updatedSlides);
  };

  const handleAddSlide = () => {
    if (!activeDeck) return;
    const newSlide = {
      id: Date.now().toString(),
      content: "<h2>New Slide</h2><p>Add HTML or text content here.</p>",
      background: "#1e293b",
      notes: ""
    };
    const updatedSlides = [...activeDeck.slides, newSlide];
    handleUpdateActiveDeck(updatedSlides);
    setActiveSlideIndex(updatedSlides.length - 1);
  };

  const handleDeleteSlide = (indexToDelete: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activeDeck || activeDeck.slides.length <= 1) {
      alert("You must have at least one slide in your presentation.");
      return;
    }
    if (!confirm("Are you sure you want to delete this slide?")) {
      return;
    }
    const updatedSlides = activeDeck.slides.filter((_, idx) => idx !== indexToDelete);
    handleUpdateActiveDeck(updatedSlides);
    if (activeSlideIndex >= updatedSlides.length) {
      setActiveSlideIndex(updatedSlides.length - 1);
    }
  };

  const toggleFullscreen = () => {
    if (revealRef.current) {
      if (!document.fullscreenElement) {
        revealRef.current.requestFullscreen().catch((err) => {
          console.error("Fullscreen failed:", err);
        });
      } else {
        document.exitFullscreen();
      }
    }
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
          <Presentation className="w-12 h-12 animate-pulse mx-auto text-blue-500" />
          <p className="text-sm font-semibold font-['Inter']">Loading presentations...</p>
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
              { label: "Slides", to: "/dashboard/integrations/slides" },
            ]}
          />
        </div>
        <div className="flex items-center gap-3">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
          </span>
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 font-['Inter']">
            Slides Engine Active
          </span>
        </div>
      </header>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-100px)] overflow-hidden pb-4">
        {/* Left Column: Form & Saved Decks */}
        <div className="space-y-6 lg:col-span-1 flex flex-col h-full overflow-y-auto pr-1">
          {/* Create slides Form */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
            <h2 className="text-lg font-bold mb-4 font-space-grotesk flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-600" /> New Presentation
            </h2>
            <form onSubmit={handleCreateDeck} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Slideshow Title</label>
                <input
                  type="text"
                  placeholder="e.g., Pitch Deck v2"
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
                Create Presentation
              </button>
            </form>
          </div>

          {/* Library list */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex-1 flex flex-col min-h-[250px] overflow-hidden">
            <h3 className="text-md font-bold mb-3 font-space-grotesk text-slate-600 dark:text-slate-300">Presentations Library</h3>
            <div className="space-y-2 overflow-y-auto flex-1 pr-1">
              {decks.map((deck) => (
                <div
                  key={deck._id}
                  onClick={() => {
                    setActiveDeckId(deck._id);
                    setActiveSlideIndex(0);
                    setIsPresentMode(false);
                  }}
                  className={`flex items-start justify-between gap-3 p-3 rounded-xl cursor-pointer border transition-all ${
                    activeDeckId === deck._id
                      ? "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900"
                      : "bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-900 hover:bg-slate-100 dark:hover:bg-slate-900/50"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`p-1.5 rounded-lg shrink-0 ${
                      activeDeckId === deck._id ? "bg-blue-500 text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-500"
                    }`}>
                      <Presentation className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold truncate text-slate-800 dark:text-slate-200">{deck.title}</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500">
                        {deck.slides?.length || 0} slides • {deck.updatedAt ? new Date(deck.updatedAt).toLocaleDateString() : ""}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleDeleteDeck(deck._id, e)}
                    className="p-1 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors shrink-0"
                    title="Remove Presentation"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {decks.length === 0 && (
                <p className="text-xs text-slate-400 text-center py-6">No presentations in workspace.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Presentation Viewport */}
        <div className="lg:col-span-3 flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
          {activeDeck ? (
            <div className="flex flex-col h-full overflow-hidden">
              {/* Active Deck Header */}
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 flex-shrink-0 bg-white dark:bg-slate-900 z-10">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <input
                    type="text"
                    value={activeDeck.title}
                    onChange={(e) => handleRenameActiveDeck(e.target.value)}
                    className="text-lg font-bold font-space-grotesk bg-transparent border-none outline-none text-slate-800 dark:text-slate-100 w-full focus:ring-2 focus:ring-blue-500/25 rounded-md px-1"
                  />
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
                      Saved: {activeDeck.updatedAt ? new Date(activeDeck.updatedAt).toLocaleDateString() : ""}
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

                {/* Mode Selector */}
                <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-xl flex-shrink-0">
                  <button
                    onClick={() => setIsPresentMode(false)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      !isPresentMode
                        ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs"
                        : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                    }`}
                  >
                    <Settings className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => setIsPresentMode(true)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      isPresentMode
                        ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs"
                        : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                    }`}
                  >
                    <Play className="w-3.5 h-3.5" /> Present
                  </button>
                </div>
              </div>

              {/* Viewport Content */}
              <div className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-950">
                {isPresentMode ? (
                  /* Present/Preview Mode (Reveal.js) */
                  <div className="space-y-4 h-full flex flex-col">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                        <Info className="w-3.5 h-3.5" /> Use keyboard arrow keys or click bottom-right controls to navigate.
                      </p>
                      <button
                        onClick={toggleFullscreen}
                        className="flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-lg text-xs border border-slate-200 dark:border-slate-800 transition-colors shadow-xs cursor-pointer"
                      >
                        <Maximize2 className="w-3.5 h-3.5" /> Fullscreen
                      </button>
                    </div>

                    <div className="flex-1 min-h-[400px] relative rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800 bg-slate-900">
                      {/* Scoped Reveal Container */}
                      <div 
                        ref={revealRef} 
                        className="reveal w-full h-full"
                        style={{ height: "480px" }}
                      >
                        <div className="slides">
                          {activeDeck.slides.map((slide, index) => (
                            <section
                              key={slide.id || index}
                              data-background-color={slide.background || "#1e293b"}
                              dangerouslySetInnerHTML={{ __html: slide.content }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Edit Mode (WYSIWYG split interface) */
                  <div className="space-y-6 flex flex-col h-full">
                    {/* Horizontal Slide Thumbnails Bar */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex items-center gap-3 overflow-x-auto select-none flex-shrink-0">
                      <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pr-2 shrink-0">Slides</span>
                      
                      <div className="flex items-center gap-2 overflow-x-auto py-1">
                        {activeDeck.slides.map((slide, index) => (
                          <div
                            key={slide.id || index}
                            onClick={() => setActiveSlideIndex(index)}
                            className={`group relative flex flex-col items-center justify-center w-28 h-18 rounded-xl cursor-pointer border text-center font-bold text-xs shrink-0 transition-all ${
                              activeSlideIndex === index
                                ? "bg-blue-500 text-white border-blue-500 shadow-md shadow-blue-500/10"
                                : "bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-blue-400"
                            }`}
                            style={{
                              backgroundColor: activeSlideIndex === index ? undefined : (slide.background || undefined),
                              color: activeSlideIndex === index ? "#fff" : "#fff"
                            }}
                          >
                            <span className="z-10 bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-md text-[10px] tracking-tight">Slide {index + 1}</span>
                            
                            {/* Individual Delete slide button */}
                            {activeDeck.slides.length > 1 && (
                              <button
                                onClick={(e) => handleDeleteSlide(index, e)}
                                className="absolute -top-1.5 -right-1.5 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full transition-transform scale-0 group-hover:scale-100 shadow-sm"
                                title="Delete Slide"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        ))}

                        {/* Add Slide button */}
                        <button
                          onClick={handleAddSlide}
                          className="w-28 h-18 border-2 border-dashed border-slate-350 dark:border-slate-800 hover:border-blue-500 rounded-xl flex flex-col items-center justify-center text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all shrink-0 cursor-pointer"
                        >
                          <Plus className="w-5 h-5 mb-0.5" />
                          <span className="text-[10px] font-bold">Add Slide</span>
                        </button>
                      </div>
                    </div>

                    {/* Current Slide Editor (split layout) */}
                    {activeSlide ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 min-h-[350px]">
                        {/* Left Side: Editor Parameters */}
                        <div className="space-y-4 flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Slide HTML Content</label>
                              <span className="text-[10px] text-slate-400 font-mono">&lt;html/&gt; tags allowed</span>
                            </div>
                            <textarea
                              value={activeSlide.content}
                              onChange={(e) => handleUpdateActiveSlide({ content: e.target.value })}
                              rows={8}
                              placeholder="e.g. <h2>Slide Title</h2><p>Description text</p>"
                              className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Background Color</label>
                              <div className="flex gap-2 items-center">
                                <input
                                  type="color"
                                  value={activeSlide.background || "#1e293b"}
                                  onChange={(e) => handleUpdateActiveSlide({ background: e.target.value })}
                                  className="w-8 h-8 rounded-lg cursor-pointer border border-slate-200 dark:border-slate-800"
                                />
                                <input
                                  type="text"
                                  value={activeSlide.background || "#1e293b"}
                                  onChange={(e) => handleUpdateActiveSlide({ background: e.target.value })}
                                  className="flex-1 px-3 py-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono focus:outline-none text-slate-900 dark:text-slate-100"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Slide Index</label>
                              <div className="px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-650 dark:text-slate-350">
                                Slide {activeSlideIndex + 1} of {activeDeck.slides.length}
                              </div>
                            </div>
                          </div>

                          <div className="flex-1 flex flex-col min-h-[120px]">
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Speaker Notes (Optional)</label>
                            <textarea
                              value={activeSlide.notes || ""}
                              onChange={(e) => handleUpdateActiveSlide({ notes: e.target.value })}
                              rows={3}
                              placeholder="Add reminders or bullet points for when you present."
                              className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100 flex-1 resize-none"
                            />
                          </div>
                        </div>

                        {/* Right Side: Real-time Render Sandbox */}
                        <div className="flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 overflow-hidden">
                          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">Real-time Sandbox Preview</label>
                          <div 
                            className="flex-1 rounded-xl p-8 flex flex-col items-center justify-center text-center overflow-auto shadow-inner border border-slate-100 dark:border-slate-950 font-['Inter']"
                            style={{ 
                              backgroundColor: activeSlide.background || "#1e293b",
                              color: "#ffffff"
                            }}
                          >
                            <div 
                              className="prose prose-invert max-w-none break-words select-none w-full"
                              dangerouslySetInnerHTML={{ __html: activeSlide.content || "<i>Empty slide</i>" }}
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-20 text-center flex flex-col items-center justify-center min-h-[350px]">
                        <Layers className="w-12 h-12 text-slate-300 mb-2" />
                        <h4 className="text-md font-bold text-slate-700 dark:text-slate-300">No slides found</h4>
                        <button
                          onClick={handleAddSlide}
                          className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-750 text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-blue-500/10 cursor-pointer"
                        >
                          Add Your First Slide
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-20 text-center text-gray-500 dark:text-gray-400">
              <Presentation className="w-16 h-16 mb-4 text-slate-350 dark:text-slate-700" />
              <h3 className="text-lg font-bold text-slate-750 dark:text-slate-300 font-space-grotesk mb-1">No Slideshow Selected</h3>
              <p className="text-sm text-slate-400 dark:text-slate-500 font-['Inter'] max-w-sm">Create a presentation from the sidebar library or select an existing one to begin presentation styling.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Slides;
