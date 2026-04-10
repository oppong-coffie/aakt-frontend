import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../../config/firebase";

const LeftArrowIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M19 12H5M5 12L12 19M5 12L12 5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const UploadIcon = () => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="text-blue-500"
  >
    <path
      d="M12 16V8M12 8L9 11M12 8L15 11M20 16.7428C21.2215 15.734 22 14.2079 22 12.5C22 9.46243 19.5376 7 16.5 7C16.2815 7 16.0771 7.01231 15.8773 7.03635C15.0157 4.54433 12.6069 3 10 3C6.13401 3 3 6.13401 3 10C3 10.2529 3.01338 10.5027 3.03939 10.7481C1.81776 11.7513 1 13.2753 1 15C1 18.3137 3.68629 21 7 21H16"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ImageQuestion = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("bizConcept_businessImage");
    if (saved) setImage(saved);
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setError(null);
      await uploadFile(file);
    }
  };

  const uploadFile = async (file: File) => {
    try {
      setUploading(true);
      const storageRef = ref(storage, `aakt/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const prog = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(prog);
        },
        (error) => {
          console.error("Upload failed:", error);
          setError("Upload failed. This is likely a CORS or Permission issue. Please ensure your bucket is configured to allow requests from localhost.");
          setUploading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setImage(downloadURL);
          localStorage.setItem("bizConcept_businessImage", downloadURL);
          setUploading(false);
        }
      );
    } catch (err) {
      console.error("Error starting upload:", err);
      setUploading(false);
    }
  };

  const handleContinue = () => {
    navigate("/dashboard/portfolio/questions/what");
  };

  return (
    <div className="flex flex-col h-full bg-[#f0f0eb] dark:bg-slate-950 p-6 sm:p-12 font-sans text-gray-900 dark:text-gray-100 justify-center items-center relative min-h-screen transition-colors duration-300">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 w-10 h-10 flex items-center justify-center rounded-xl text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-slate-800 transition-colors"
      >
        <LeftArrowIcon />
      </button>

      <Link
        to="/dashboard/portfolio/questions/what"
        className="absolute top-6 right-6 px-4 py-2 text-gray-400 dark:text-gray-500 font-bold hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-colors z-10"
      >
        Skip
      </Link>

      <div className="max-w-3xl w-full flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl sm:text-4xl font-bold leading-tight font-['Space_Grotesk'] text-gray-900 dark:text-gray-100">
            Show us your business vision
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed font-['Inter']">
            Upload an image that represents your business or product.
          </p>
        </div>

        <div className="w-full">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="group relative w-full aspect-video sm:aspect-[21/9] rounded-[2.5rem] border-2 border-dashed border-gray-300 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-500 dark:hover:border-blue-400 transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center gap-4 px-6 text-center shadow-sm hover:shadow-xl hover:shadow-blue-500/10"
          >
            {image ? (
              <>
                <img
                  src={image}
                  alt="Business preview"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/30 text-white font-medium">
                    Change Image
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="w-20 h-20 rounded-3xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 mb-2">
                  <UploadIcon />
                </div>
                <div>
                  <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">
                    SVG, PNG, JPG or GIF (max. 800x400px)
                  </p>
                </div>
              </>
            )}

            {uploading && (
                <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-white dark:from-slate-900 to-transparent">
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between text-sm font-semibold">
                      <span className="text-blue-600 dark:text-blue-400">Uploading...</span>
                      <span className="text-gray-600 dark:text-gray-300">{progress}%</span>
                    </div>
                    <div className="w-full h-3 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden border border-gray-200 dark:border-slate-700">
                      <div
                        className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-300 rounded-full shadow-[0_0_12px_rgba(37,99,235,0.4)]"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          {error && (
            <div className="mt-4 p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex flex-col gap-2 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-2 text-red-700 dark:text-red-400 font-semibold">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                Upload Error
              </div>
              <p className="text-sm text-red-600 dark:text-red-300 leading-relaxed italic">
                {error}
              </p>
              <p className="text-xs text-red-500/70 dark:text-red-400/50 mt-1">
                Tip: If you're on localhost, you may need to set CORS on your bucket using <code className="bg-red-100 dark:bg-red-900/40 px-1 rounded">gsutil</code>.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 sm:p-12 flex justify-end gap-4 max-w-7xl mx-auto w-full pointer-events-none">
        <div className="pointer-events-auto flex gap-4">
          <button
            onClick={handleContinue}
            className="px-8 py-3 rounded-xl bg-blue-600 dark:bg-blue-500 text-white font-bold hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors shadow-lg shadow-blue-600/20 dark:shadow-blue-500/10"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageQuestion;
