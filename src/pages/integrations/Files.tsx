import { useState, useEffect, useRef } from "react";
import { FilePond, registerPlugin } from "react-filepond";
import {
  File,
  Trash2,
  Download,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  Video,
  Music,
  FileSpreadsheet,
  FileCode,
  FileArchive,
  CloudUpload,
  AlertCircle
} from "lucide-react";

// Import FilePond styles
import "filepond/dist/filepond.min.css";

// Import FilePond plugins
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";

import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../config/firebase";
import { fileService } from "../../api/file.service";
import type { FileItem } from "../../api/file.service";
import apiClient from "../../api/apiClient";

// Register the plugins
registerPlugin(FilePondPluginImagePreview, FilePondPluginFileValidateSize, FilePondPluginFileValidateType);

export const getFileIcon = (filename: string, className = "w-4 h-4") => {
  const ext = filename.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "pdf":
      return <FileText className={`${className} text-red-500`} />;
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
    case "svg":
    case "webp":
      return <ImageIcon className={`${className} text-emerald-500`} />;
    case "mp4":
    case "webm":
    case "avi":
    case "mov":
      return <Video className={`${className} text-indigo-500`} />;
    case "mp3":
    case "wav":
    case "ogg":
      return <Music className={`${className} text-violet-500`} />;
    case "xls":
    case "xlsx":
    case "csv":
      return <FileSpreadsheet className={`${className} text-green-600`} />;
    case "html":
    case "css":
    case "js":
    case "ts":
    case "tsx":
    case "json":
      return <FileCode className={`${className} text-amber-500`} />;
    case "zip":
    case "rar":
    case "tar":
    case "gz":
      return <FileArchive className={`${className} text-amber-600`} />;
    default:
      return <File className={`${className} text-blue-500`} />;
  }
};

export const formatFileSize = (bytes?: number) => {
  if (bytes === undefined || bytes === null) return "Unknown size";
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const Files = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [activeFileId, setActiveFileId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pondFiles, setPondFiles] = useState<any[]>([]);

  const activeFile = files.find((f) => f._id === activeFileId) || files[0];
  const saveTimeoutRef = useRef<any>(null);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fileService.getFiles();
      setFiles(data);
      if (data.length > 0) {
        setActiveFileId(data[0]._id);
      }
    } catch (err: any) {
      console.error("Error loading files:", err);
      setError(err.message || "Failed to load files from server. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleUploadSuccess = async (name: string, url: string, size: number, type: string) => {
    try {
      const savedFile = await fileService.createFile({
        name,
        url,
        size,
        type
      });
      setFiles((prev) => [savedFile, ...prev]);
      setActiveFileId(savedFile._id);
      
      // Clear FilePond queue after upload succeeds
      setTimeout(() => {
        setPondFiles([]);
      }, 1500);
    } catch (error) {
      console.error("Error saving file in backend:", error);
      alert("Uploaded to storage, but failed to save file details in backend.");
    }
  };

  const handleRenameActiveFile = async (name: string) => {
    if (!activeFileId) return;

    setFiles((prevFiles) =>
      prevFiles.map((file) =>
        file._id === activeFileId ? { ...file, name } : file
      )
    );

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await fileService.updateFile(activeFileId, { name });
      } catch (error) {
        console.error("Error renaming file:", error);
      }
    }, 1500);
  };

  const handleDeleteFile = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this file?")) {
      return;
    }
    try {
      await fileService.deleteFile(id);
      const filtered = files.filter((f) => f._id !== id);
      setFiles(filtered);
      if (activeFileId === id && filtered.length > 0) {
        setActiveFileId(filtered[0]._id);
      } else if (filtered.length === 0) {
        setActiveFileId("");
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      alert("Failed to delete file.");
    }
  };

  // Custom Firebase Storage FilePond Server Process Config
  const serverConfig = {
    process: (
      _fieldName: string,
      file: Blob,
      _metadata: any,
      load: (source: string) => void,
      error: (errorText: string) => void,
      progress: (computable: boolean, loaded: number, total: number) => void,
      abort: () => void
    ) => {
      const fileName = (file as File).name || `file_${Date.now()}`;
      const fileType = file.type || "application/octet-stream";
      const fileSize = file.size || 0;
      
      const fileRef = ref(storage, `user_files/${Date.now()}_${fileName}`);
      const uploadTask = uploadBytesResumable(fileRef, file);
      
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          progress(true, snapshot.bytesTransferred, snapshot.totalBytes);
        },
        (err) => {
          console.error("Firebase upload error:", err);
          error(err.message);
        },
        async () => {
          try {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            load(downloadUrl);
            handleUploadSuccess(fileName, downloadUrl, fileSize, fileType);
          } catch (err: any) {
            console.error("Error obtaining download URL:", err);
            error(err.message || "Failed to finalize upload");
          }
        }
      );
      
      return {
        abort: () => {
          uploadTask.cancel();
          abort();
        }
      };
    }
  };

  const renderPreview = (file: FileItem) => {
    const ext = file.name.split(".").pop()?.toLowerCase();
    const isImage = ["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(ext || "");
    const isPdf = ext === "pdf";
    const isVideo = ["mp4", "webm", "ogg"].includes(ext || "");
    
    if (isImage) {
      return (
        <div className="flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 min-h-[400px]">
          <img
            src={file.url}
            alt={file.name}
            className="max-w-full max-h-[450px] object-contain rounded-xl shadow-md"
          />
        </div>
      );
    }
    
    if (isPdf) {
      return (
        <div className="w-full h-[550px] bg-slate-50 dark:bg-slate-950 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800">
          <iframe
            src={`${file.url}#toolbar=0`}
            className="w-full h-full border-none bg-white"
            title={file.name}
          />
        </div>
      );
    }

    if (isVideo) {
      return (
        <div className="flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 min-h-[400px]">
          <video
            src={file.url}
            controls
            className="max-w-full max-h-[450px] rounded-xl shadow-md"
          />
        </div>
      );
    }
    
    return (
      <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-xs border border-slate-100 dark:border-slate-800 mb-4">
          {getFileIcon(file.name, "w-12 h-12")}
        </div>
        <h4 className="text-md font-bold text-slate-800 dark:text-slate-200 mb-1">{file.name}</h4>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-6 uppercase tracking-wider">
          {file.type || "Unknown Type"} • {formatFileSize(file.size)}
        </p>
        <div className="flex gap-3">
          <a
            href={file.url}
            download
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-blue-500/10 cursor-pointer"
          >
            <Download className="w-4 h-4" /> Download File
          </a>
        </div>
      </div>
    );
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
      <div className="flex flex-col items-center justify-center h-screen bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 transition-colors duration-300">
        <div className="text-center space-y-4">
          <File className="w-12 h-12 animate-pulse mx-auto text-blue-500" />
          <p className="text-sm font-semibold font-['Inter']">Loading files...</p>
        </div>
        <div className="mt-8 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-left text-xs max-w-sm space-y-1 font-mono">
          <p className="font-bold border-b border-slate-200 dark:border-slate-800 pb-1 mb-2 text-slate-700 dark:text-slate-300">Connection Diagnostics</p>
          <p><span className="text-slate-400">Base URL:</span> {apiClient.defaults.baseURL || "not set"}</p>
          <p><span className="text-slate-400">Token Present:</span> {localStorage.getItem("token") ? "Yes (starts with " + localStorage.getItem("token")?.substring(0, 10) + "...)" : "No"}</p>
          <p><span className="text-slate-400">Pond Installed:</span> Yes</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 transition-colors duration-300">
        <div className="text-center space-y-4 max-w-md p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-md">
          <AlertCircle className="w-12 h-12 mx-auto text-red-500" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 font-space-grotesk">Failed to load files</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-['Inter']">{error}</p>
          <button
            onClick={fetchFiles}
            className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-blue-500/10 cursor-pointer"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 text-slate-800 dark:text-slate-100 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="p-3 bg-blue-100 dark:bg-blue-950/50 rounded-xl">
          <CloudUpload className="w-8 h-8 text-blue-600 dark:text-blue-500" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight font-space-grotesk">Workspace Files</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Upload, store, rename, and preview your media files and assets</p>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: FilePond & Library */}
        <div className="space-y-6 lg:col-span-1">
          {/* FilePond Uploader */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
            <h2 className="text-lg font-bold mb-4 font-space-grotesk flex items-center gap-2">
              <CloudUpload className="w-5 h-5 text-blue-600" /> Upload File
            </h2>
            <FilePond
              files={pondFiles}
              onupdatefiles={setPondFiles}
              allowMultiple={false}
              maxFiles={1}
              server={serverConfig}
              name="file"
              labelIdle='Drag & Drop your file or <span class="filepond--label-action">Browse</span>'
              className="filepond-premium"
            />
          </div>

          {/* Library list */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col max-h-[400px]">
            <h3 className="text-md font-bold mb-3 font-space-grotesk text-slate-600 dark:text-slate-300">Files Library</h3>
            <div className="space-y-2 overflow-y-auto flex-1 pr-1">
              {files.map((file) => (
                <div
                  key={file._id}
                  onClick={() => setActiveFileId(file._id)}
                  className={`flex items-start justify-between gap-3 p-3 rounded-xl cursor-pointer border transition-all ${
                    activeFileId === file._id
                      ? "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900"
                      : "bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-900 hover:bg-slate-100 dark:hover:bg-slate-900/50"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`p-1.5 rounded-lg shrink-0 ${
                      activeFileId === file._id ? "bg-blue-500 text-white" : "bg-slate-200 dark:bg-slate-800"
                    }`}>
                      {getFileIcon(file.name, activeFileId === file._id ? "w-3.5 h-3.5 text-white" : "w-3.5 h-3.5")}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold truncate text-slate-800 dark:text-slate-200">{file.name}</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500">
                        {formatFileSize(file.size)} • {file.updatedAt ? new Date(file.updatedAt).toLocaleDateString() : ""}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleDeleteFile(file._id, e)}
                    className="p-1 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors shrink-0"
                    title="Remove File"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {files.length === 0 && (
                <p className="text-xs text-slate-400 text-center py-6">No files in library.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Viewer */}
        <div className="lg:col-span-3 space-y-4">
          {activeFile ? (
            <div className="flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
                <input
                  type="text"
                  value={activeFile.name}
                  onChange={(e) => handleRenameActiveFile(e.target.value)}
                  className="text-lg font-bold font-space-grotesk bg-transparent border-none outline-none text-slate-800 dark:text-slate-100 flex-1 focus:ring-2 focus:ring-blue-500/25 rounded-md px-1"
                />
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
                    Saved: {activeFile.updatedAt ? new Date(activeFile.updatedAt).toLocaleDateString() : ""}
                  </span>
                  <a
                    href={activeFile.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
                    title="Open in new tab"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <div className="p-6 flex-1 overflow-y-auto">
                {renderPreview(activeFile)}
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-20 shadow-xs text-center flex flex-col items-center justify-center min-h-[450px]">
              <File className="w-16 h-16 text-slate-300 dark:text-slate-700 mb-4" />
              <h4 className="text-lg font-bold text-slate-600 dark:text-slate-300 mb-1">No Active File</h4>
              <p className="text-sm text-slate-400 max-w-sm">Upload a file in the left panel or select an existing one to begin previewing and managing assets.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Files;