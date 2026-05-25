import { useState } from "react";
import { Youtube, Plus, Trash2, Play, ExternalLink } from "lucide-react";

interface SavedVideo {
  id: string;
  videoId: string;
  title: string;
  addedAt: string;
}

const DEFAULT_VIDEOS: SavedVideo[] = [
  {
    id: "default-1",
    videoId: "EngW7tLk6R8",
    title: "How to Build a SaaS Startup - Step-by-Step Guide",
    addedAt: "Tutorial",
  },
  {
    id: "default-2",
    videoId: "zojyEzWyr8U",
    title: "Business Infrastructure & Scaling Strategies",
    addedAt: "Business",
  }
];

const YouTube = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [activeVideoId, setActiveVideoId] = useState("EngW7tLk6R8");
  const [savedVideos, setSavedVideos] = useState<SavedVideo[]>(DEFAULT_VIDEOS);
  const [videoTitle, setVideoTitle] = useState("");

  const extractVideoId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleEmbed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl) return;
    
    const id = extractVideoId(videoUrl);
    if (!id) {
      alert("Invalid YouTube URL. Please enter a valid watch link or sharing link.");
      return;
    }
    setActiveVideoId(id);
    const title = videoTitle.trim() || `YouTube Video (${id})`;
    const newVideo: SavedVideo = {
      id: Date.now().toString(),
      videoId: id,
      title: title,
      addedAt: new Date().toLocaleDateString(),
    };
    setSavedVideos([newVideo, ...savedVideos]);
    setVideoUrl("");
    setVideoTitle("");
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedVideos(savedVideos.filter((v) => v.id !== id));
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 text-slate-800 dark:text-slate-100 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="p-3 bg-red-100 dark:bg-red-950/50 rounded-xl">
          <Youtube className="w-8 h-8 text-red-600 dark:text-red-500" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight font-space-grotesk">YouTube Integration</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Embed and manage your workspace video guides, training tutorials, and references</p>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Form & Saved Videos */}
        <div className="space-y-6 lg:col-span-1">
          {/* Embed Form */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
            <h2 className="text-lg font-bold mb-4 font-space-grotesk flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-600" /> Embed Video
            </h2>
            <form onSubmit={handleEmbed} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Video Title (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g., Team Onboarding Guide"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">YouTube URL</label>
                <input
                  type="text"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
                />
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-blue-500/10 cursor-pointer"
              >
                Embed Video
              </button>
            </form>
          </div>

          {/* Video List */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col max-h-[400px]">
            <h3 className="text-md font-bold mb-3 font-space-grotesk text-slate-600 dark:text-slate-300">Workspace Library</h3>
            <div className="space-y-2 overflow-y-auto flex-1 pr-1">
              {savedVideos.map((video) => (
                <div
                  key={video.id}
                  onClick={() => setActiveVideoId(video.videoId)}
                  className={`flex items-start justify-between gap-3 p-3 rounded-xl cursor-pointer border transition-all ${
                    activeVideoId === video.videoId
                      ? "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900"
                      : "bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-900 hover:bg-slate-100 dark:hover:bg-slate-900/50"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`p-1.5 rounded-lg shrink-0 ${
                      activeVideoId === video.videoId ? "bg-blue-500 text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-500"
                    }`}>
                      <Play className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold truncate text-slate-800 dark:text-slate-200">{video.title}</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500">{video.addedAt}</p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleDelete(video.id, e)}
                    className="p-1 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors shrink-0"
                    title="Remove Video"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {savedVideos.length === 0 && (
                <p className="text-xs text-slate-400 text-center py-6">No embedded videos saved yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Embedded Player */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col h-full min-h-[450px]">
            {activeVideoId ? (
              <div className="flex flex-col h-full justify-between gap-4">
                <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <iframe
                    src={`https://www.youtube.com/embed/${activeVideoId}`}
                    title="Embedded YouTube Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-slate-600 dark:text-slate-400">
                    Playing: {activeVideoId}
                  </span>
                  <a
                    href={`https://www.youtube.com/watch?v=${activeVideoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                  >
                    Open on YouTube <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center flex-1 text-center py-20 text-slate-400">
                <Youtube className="w-16 h-16 text-slate-300 dark:text-slate-700 mb-4" />
                <h4 className="text-lg font-bold text-slate-600 dark:text-slate-300 mb-1">No Video Selected</h4>
                <p className="text-sm text-slate-400 max-w-sm">Select a video from the library on the left or add a new watch link to start playing.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default YouTube;
