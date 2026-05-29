import { useState, useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { BubbleMenu, FloatingMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import {
  FileText,
  Plus,
  Trash2,
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Terminal,
  Undo,
  Redo,
} from "lucide-react";
import { documentService } from "../../api/document.service";
import type { DocumentItem } from "../../api/document.service";

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-1 p-2 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 rounded-t-xl">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`p-1.5 rounded-lg transition-colors ${
          editor.isActive("bold")
            ? "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400 font-bold"
            : "text-slate-500 hover:bg-slate-200/50 dark:text-slate-400 dark:hover:bg-slate-800/50"
        }`}
        title="Bold"
      >
        <Bold className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`p-1.5 rounded-lg transition-colors ${
          editor.isActive("italic")
            ? "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400 font-bold"
            : "text-slate-500 hover:bg-slate-200/50 dark:text-slate-400 dark:hover:bg-slate-800/50"
        }`}
        title="Italic"
      >
        <Italic className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={`p-1.5 rounded-lg transition-colors ${
          editor.isActive("strike")
            ? "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400 font-bold"
            : "text-slate-500 hover:bg-slate-200/50 dark:text-slate-400 dark:hover:bg-slate-800/50"
        }`}
        title="Strike"
      >
        <Strikethrough className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCode().run()}
        disabled={!editor.can().chain().focus().toggleCode().run()}
        className={`p-1.5 rounded-lg transition-colors ${
          editor.isActive("code")
            ? "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400 font-bold"
            : "text-slate-500 hover:bg-slate-200/50 dark:text-slate-400 dark:hover:bg-slate-800/50"
        }`}
        title="Inline Code"
      >
        <Code className="w-4 h-4" />
      </button>
      
      <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-1 self-center" />

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-1.5 rounded-lg transition-colors ${
          editor.isActive("heading", { level: 1 })
            ? "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400 font-bold"
            : "text-slate-500 hover:bg-slate-200/50 dark:text-slate-400 dark:hover:bg-slate-800/50"
        }`}
        title="Heading 1"
      >
        <Heading1 className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-1.5 rounded-lg transition-colors ${
          editor.isActive("heading", { level: 2 })
            ? "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400 font-bold"
            : "text-slate-500 hover:bg-slate-200/50 dark:text-slate-400 dark:hover:bg-slate-800/50"
        }`}
        title="Heading 2"
      >
        <Heading2 className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`p-1.5 rounded-lg transition-colors ${
          editor.isActive("heading", { level: 3 })
            ? "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400 font-bold"
            : "text-slate-500 hover:bg-slate-200/50 dark:text-slate-400 dark:hover:bg-slate-800/50"
        }`}
        title="Heading 3"
      >
        <Heading3 className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-1 self-center" />

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-1.5 rounded-lg transition-colors ${
          editor.isActive("bulletList")
            ? "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400 font-bold"
            : "text-slate-500 hover:bg-slate-200/50 dark:text-slate-400 dark:hover:bg-slate-800/50"
        }`}
        title="Bullet List"
      >
        <List className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-1.5 rounded-lg transition-colors ${
          editor.isActive("orderedList")
            ? "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400 font-bold"
            : "text-slate-500 hover:bg-slate-200/50 dark:text-slate-400 dark:hover:bg-slate-800/50"
        }`}
        title="Ordered List"
      >
        <ListOrdered className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`p-1.5 rounded-lg transition-colors ${
          editor.isActive("codeBlock")
            ? "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400 font-bold"
            : "text-slate-500 hover:bg-slate-200/50 dark:text-slate-400 dark:hover:bg-slate-800/50"
        }`}
        title="Code Block"
      >
        <Terminal className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-1.5 rounded-lg transition-colors ${
          editor.isActive("blockquote")
            ? "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400 font-bold"
            : "text-slate-500 hover:bg-slate-200/50 dark:text-slate-400 dark:hover:bg-slate-800/50"
        }`}
        title="Blockquote"
      >
        <Quote className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-1 self-center" />

      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        className="p-1.5 rounded-lg transition-colors text-slate-500 hover:bg-slate-200/50 dark:text-slate-400 dark:hover:bg-slate-800/50 disabled:opacity-40"
        title="Undo"
      >
        <Undo className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        className="p-1.5 rounded-lg transition-colors text-slate-500 hover:bg-slate-200/50 dark:text-slate-400 dark:hover:bg-slate-800/50 disabled:opacity-40"
        title="Redo"
      >
        <Redo className="w-4 h-4" />
      </button>
    </div>
  );
};

const Documents = () => {
  const [docs, setDocs] = useState<DocumentItem[]>([]);
  const [activeDocId, setActiveDocId] = useState<string>("");
  const [newTitle, setNewTitle] = useState("");
  const [loading, setLoading] = useState(true);

  const activeDoc = docs.find((d) => d._id === activeDocId) || docs[0];

  const fetchDocs = async () => {
    try {
      setLoading(true);
      const data = await documentService.getDocuments();
      setDocs(data);
      if (data.length > 0) {
        setActiveDocId(data[0]._id);
      }
    } catch (error) {
      console.error("Error loading documents:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const saveTimeoutRef = useRef<any>(null);

  const handleEditorUpdate = (html: string) => {
    if (!activeDocId) return;

    setDocs((prevDocs) =>
      prevDocs.map((doc) =>
        doc._id === activeDocId ? { ...doc, content: html } : doc
      )
    );

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await documentService.updateDocument(activeDocId, { content: html });
      } catch (error) {
        console.error("Error autosaving document content:", error);
      }
    }, 1500);
  };

  const editor = useEditor({
    extensions: [StarterKit],
    content: activeDoc ? activeDoc.content : "",
    editorProps: {
      attributes: {
        class: "min-h-[400px] max-h-[600px] overflow-y-auto outline-none p-6 text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 rounded-b-xl border border-t-0 border-slate-200 dark:border-slate-800 tiptap",
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      handleEditorUpdate(html);
    },
  });

  useEffect(() => {
    if (editor && activeDoc && editor.getHTML() !== activeDoc.content) {
      editor.commands.setContent(activeDoc.content);
    }
  }, [activeDocId, editor]);

  const handleCreateDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    const title = newTitle.trim() || `Untitled Document`;
    try {
      const item = await documentService.createDocument({
        title,
        content: "<h1>New Document</h1><p>Start writing here...</p>"
      });
      setDocs((prev) => [item, ...prev]);
      setActiveDocId(item._id);
      setNewTitle("");
    } catch (error) {
      console.error("Error creating document:", error);
      alert("Failed to create document.");
    }
  };

  const handleDeleteDoc = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this document?")) {
      return;
    }
    try {
      await documentService.deleteDocument(id);
      const filtered = docs.filter((d) => d._id !== id);
      setDocs(filtered);
      if (activeDocId === id && filtered.length > 0) {
        setActiveDocId(filtered[0]._id);
      } else if (filtered.length === 0) {
        setActiveDocId("");
      }
    } catch (error) {
      console.error("Error deleting document:", error);
      alert("Failed to delete document.");
    }
  };

  const handleRenameActiveDoc = async (title: string) => {
    if (!activeDocId) return;
    setDocs((prevDocs) =>
      prevDocs.map((doc) =>
        doc._id === activeDocId ? { ...doc, title } : doc
      )
    );
    try {
      await documentService.updateDocument(activeDocId, { title });
    } catch (error) {
      console.error("Error renaming document:", error);
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
      <div className="flex items-center justify-center h-screen bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 transition-colors duration-300">
        <div className="text-center space-y-4">
          <FileText className="w-12 h-12 animate-pulse mx-auto text-blue-500" />
          <p className="text-sm font-semibold font-['Inter']">Loading documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 text-slate-800 dark:text-slate-100 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="p-3 bg-blue-100 dark:bg-blue-950/50 rounded-xl">
          <FileText className="w-8 h-8 text-blue-600 dark:text-blue-500" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight font-space-grotesk">Workspace Documents</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Write, edit, and format workspace notes, project scopes, and wiki articles</p>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Form & Saved Docs */}
        <div className="space-y-6 lg:col-span-1">
          {/* Create Doc Form */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
            <h2 className="text-lg font-bold mb-4 font-space-grotesk flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-600" /> New Document
            </h2>
            <form onSubmit={handleCreateDoc} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Document Title</label>
                <input
                  type="text"
                  placeholder="e.g., Q3 Planning Session"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
                />
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-blue-500/10 cursor-pointer"
              >
                Create Document
              </button>
            </form>
          </div>

          {/* Doc List */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col max-h-[400px]">
            <h3 className="text-md font-bold mb-3 font-space-grotesk text-slate-600 dark:text-slate-300">Documents Library</h3>
            <div className="space-y-2 overflow-y-auto flex-1 pr-1">
              {docs.map((doc) => (
                <div
                  key={doc._id}
                  onClick={() => setActiveDocId(doc._id)}
                  className={`flex items-start justify-between gap-3 p-3 rounded-xl cursor-pointer border transition-all ${
                    activeDocId === doc._id
                      ? "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900"
                      : "bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-900 hover:bg-slate-100 dark:hover:bg-slate-900/50"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`p-1.5 rounded-lg shrink-0 ${
                      activeDocId === doc._id ? "bg-blue-500 text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-500"
                    }`}>
                      <FileText className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold truncate text-slate-800 dark:text-slate-200">{doc.title}</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500">
                        {doc.updatedAt ? new Date(doc.updatedAt).toLocaleDateString() : ""}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleDeleteDoc(doc._id, e)}
                    className="p-1 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors shrink-0"
                    title="Remove Document"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {docs.length === 0 && (
                <p className="text-xs text-slate-400 text-center py-6">No documents in workspace.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Editor */}
        <div className="lg:col-span-3 space-y-4">
          {activeDoc ? (
            <div className="flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
                <input
                  type="text"
                  value={activeDoc.title}
                  onChange={(e) => handleRenameActiveDoc(e.target.value)}
                  className="text-lg font-bold font-space-grotesk bg-transparent border-none outline-none text-slate-800 dark:text-slate-100 flex-1 focus:ring-2 focus:ring-blue-500/25 rounded-md px-1"
                />
                <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
                  Saved: {activeDoc.updatedAt ? new Date(activeDoc.updatedAt).toLocaleDateString() : ""}
                </span>
              </div>

              <div className="flex flex-col flex-1">
                <MenuBar editor={editor} />
                <div className="relative flex-1">
                  <EditorContent editor={editor} />
                  {editor && (
                    <BubbleMenu
                      editor={editor}
                      className="flex items-center gap-0.5 bg-slate-950 text-white rounded-lg shadow-lg border border-slate-800 p-1"
                    >
                      <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={`p-1 hover:bg-slate-800 rounded transition-colors ${
                          editor.isActive("bold") ? "text-blue-400" : "text-slate-300"
                        }`}
                      >
                        <Bold className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={`p-1 hover:bg-slate-800 rounded transition-colors ${
                          editor.isActive("italic") ? "text-blue-400" : "text-slate-300"
                        }`}
                      >
                        <Italic className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        className={`p-1 hover:bg-slate-800 rounded transition-colors ${
                          editor.isActive("strike") ? "text-blue-400" : "text-slate-300"
                        }`}
                      >
                        <Strikethrough className="w-3.5 h-3.5" />
                      </button>
                    </BubbleMenu>
                  )}

                  {editor && (
                    <FloatingMenu
                      editor={editor}
                      className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-md p-1"
                    >
                      <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        className="p-1 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                      >
                        <Heading1 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        className="p-1 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                      >
                        <Heading2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className="p-1 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                      >
                        <List className="w-3.5 h-3.5" />
                      </button>
                    </FloatingMenu>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-20 shadow-xs text-center flex flex-col items-center justify-center min-h-[450px]">
              <FileText className="w-16 h-16 text-slate-300 dark:text-slate-700 mb-4" />
              <h4 className="text-lg font-bold text-slate-600 dark:text-slate-300 mb-1">No Active Document</h4>
              <p className="text-sm text-slate-400 max-w-sm">Create a document from the left library pane to begin writing and styling notes.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Documents;