"use client";

import { useState } from "react";
import { FileText, Download, UploadCloud, Folder, Plus, Trash2, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { Modal } from "@/components/ui/modal";
import { 
  useGetDocumentsQuery, 
  useUploadDocumentMutation, 
  useDeleteDocumentMutation 
} from "@/lib/redux/slices/documentsApi";

export default function DocumentsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: documents = [], isLoading } = useGetDocumentsQuery();
  const [uploadDocument] = useUploadDocumentMutation();
  const [deleteDocument] = useDeleteDocumentMutation();

  // Form State
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Policies");
  const [file, setFile] = useState<File | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !file) return;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("category", category);
    formData.append("file", file);
    formData.append("uploadedBy", "Admin User");

    const res = await uploadDocument(formData);
    setIsModalOpen(false);

    if (!res.error) {
      toast.success("Document uploaded successfully!");
      setName(""); setCategory("Policies"); setFile(null);
    } else {
      const errorMsg = (res.error as any).data?.message || "Failed to upload document";
      toast.error(errorMsg);
    }
  };

  const handleDelete = async (id: string) => {
    const res = await deleteDocument(id);
    if (!res.error) {
      toast.success("Document deleted successfully!");
    } else {
      const errorMsg = (res.error as any).data?.message || "Failed to delete document";
      toast.error(errorMsg);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  // Count by category
  const policiesCount = documents.filter(d => d.category === "Policies").length;
  const certsCount = documents.filter(d => d.category === "Certificates").length;
  const auditsCount = documents.filter(d => d.category === "Audit Reports").length;
  const archivesCount = documents.filter(d => d.category === "Archives").length;

  const handleDownload = (fileUrl: string) => {
    if (!fileUrl) return;
    const url = fileUrl.startsWith("http") ? fileUrl : `http://localhost:5000${fileUrl}`;
    window.open(url, "_blank");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Document Repository</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage ESG policies, certificates, and reports securely.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-1" /> Upload Document
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card rounded-xl p-4 flex items-center gap-4 hover:border-emerald-500 cursor-pointer transition-colors border border-border">
          <div className="p-3 bg-blue-100/85 text-blue-600 rounded-lg"><Folder className="w-6 h-6" /></div>
          <div>
            <h3 className="font-semibold text-sm">Policies</h3>
            <p className="text-xs text-muted-foreground">{policiesCount} Files</p>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4 flex items-center gap-4 hover:border-emerald-500 cursor-pointer transition-colors border border-border">
          <div className="p-3 bg-yellow-100/85 text-yellow-600 rounded-lg"><Folder className="w-6 h-6" /></div>
          <div>
            <h3 className="font-semibold text-sm">Certificates</h3>
            <p className="text-xs text-muted-foreground">{certsCount} Files</p>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4 flex items-center gap-4 hover:border-emerald-500 cursor-pointer transition-colors border border-border">
          <div className="p-3 bg-purple-100/85 text-purple-600 rounded-lg"><Folder className="w-6 h-6" /></div>
          <div>
            <h3 className="font-semibold text-sm">Audit Reports</h3>
            <p className="text-xs text-muted-foreground">{auditsCount} Files</p>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4 flex items-center gap-4 hover:border-emerald-500 cursor-pointer transition-colors border border-border">
          <div className="p-3 bg-gray-100/85 text-gray-600 rounded-lg"><Folder className="w-6 h-6" /></div>
          <div>
            <h3 className="font-semibold text-sm">Archives</h3>
            <p className="text-xs text-muted-foreground">{archivesCount} Files</p>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-xl overflow-hidden border border-border mt-6">
        <div className="p-4 border-b border-border bg-muted/20 flex justify-between items-center">
          <h3 className="font-semibold text-lg flex items-center">Recent Uploads</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="p-4 font-medium">Document Name</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Uploaded By</th>
                <th className="p-4 font-medium">Size</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {documents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-muted-foreground">No documents uploaded yet.</td>
                </tr>
              ) : (
                documents.map((doc: any) => (
                  <tr key={doc._id || doc.id} className="hover:bg-muted/10 transition-colors">
                    <td className="p-4 font-medium flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      <span className="truncate max-w-xs" title={doc.name}>{doc.name}</span>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 bg-muted rounded text-xs font-semibold">{doc.category}</span>
                    </td>
                    <td className="p-4 text-muted-foreground">{doc.uploadedBy}</td>
                    <td className="p-4 text-muted-foreground">{doc.fileSize || "N/A"}</td>
                    <td className="p-4 text-right flex justify-end gap-2">
                      <button 
                        onClick={() => handleDownload(doc.fileUrl)}
                        className="text-emerald-600 hover:text-emerald-700 p-1"
                        title="Download Document"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(doc._id || doc.id)}
                        className="text-red-600 hover:text-red-700 p-1"
                        title="Delete Document"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Upload Document">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Document Name</label>
            <input 
              type="text" 
              required 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Q3 Environmental Report" 
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none" 
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Category</label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none"
            >
              <option value="Policies">Policies</option>
              <option value="Certificates">Certificates</option>
              <option value="Audit Reports">Audit Reports</option>
              <option value="General Documents">General Documents</option>
              <option value="Archives">Archives</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Upload File (PDF/Docx)</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-border border-dashed rounded-lg bg-muted/20">
              <div className="space-y-1 text-center">
                <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                <div className="flex text-sm text-muted-foreground justify-center">
                  <label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-transparent font-medium text-emerald-600 hover:text-emerald-500">
                    <span>{file ? file.name : "Upload a file"}</span>
                    <input 
                      id="file-upload" 
                      name="file-upload" 
                      type="file" 
                      className="sr-only" 
                      required 
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                  </label>
                  {!file && <p className="pl-1">or drag and drop</p>}
                </div>
                <p className="text-xs text-muted-foreground">PDF, DOCX up to 10MB</p>
              </div>
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3 mt-6">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg text-sm font-medium">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium">Upload</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
