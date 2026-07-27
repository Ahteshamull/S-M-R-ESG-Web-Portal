"use client";

import { useState } from "react";
import { FileText, Download, UploadCloud, Folder, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { Modal } from "@/components/ui/modal";

export default function DocumentsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsModalOpen(false);
    toast.success("Document uploaded successfully!");
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
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><Folder className="w-6 h-6" /></div>
          <div>
            <h3 className="font-medium">Policies</h3>
            <p className="text-xs text-muted-foreground">12 Files</p>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4 flex items-center gap-4 hover:border-emerald-500 cursor-pointer transition-colors border border-border">
          <div className="p-3 bg-yellow-100 text-yellow-600 rounded-lg"><Folder className="w-6 h-6" /></div>
          <div>
            <h3 className="font-medium">Certificates</h3>
            <p className="text-xs text-muted-foreground">8 Files</p>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4 flex items-center gap-4 hover:border-emerald-500 cursor-pointer transition-colors border border-border">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-lg"><Folder className="w-6 h-6" /></div>
          <div>
            <h3 className="font-medium">Audit Reports</h3>
            <p className="text-xs text-muted-foreground">24 Files</p>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4 flex items-center gap-4 hover:border-emerald-500 cursor-pointer transition-colors border border-border">
          <div className="p-3 bg-gray-100 text-gray-600 rounded-lg"><Folder className="w-6 h-6" /></div>
          <div>
            <h3 className="font-medium">Archives</h3>
            <p className="text-xs text-muted-foreground">156 Files</p>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-xl overflow-hidden border border-border mt-6">
        <div className="p-4 border-b border-border bg-muted/20 flex justify-between items-center">
          <h3 className="font-semibold text-lg flex items-center">Recent Uploads</h3>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>
              <th className="p-4 font-medium">Document Name</th>
              <th className="p-4 font-medium">Category</th>
              <th className="p-4 font-medium">Uploaded By</th>
              <th className="p-4 font-medium">Date</th>
              <th className="p-4 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            <tr>
              <td className="p-4 font-medium flex items-center"><FileText className="w-4 h-4 mr-2 text-blue-500" /> Environmental Policy 2023.pdf</td>
              <td className="p-4"><span className="px-2 py-1 bg-muted rounded text-xs">Policies</span></td>
              <td className="p-4 text-muted-foreground">Admin User</td>
              <td className="p-4 text-muted-foreground">Oct 12, 2023</td>
              <td className="p-4 text-right">
                <button className="text-emerald-600 hover:text-emerald-700 p-1"><Download className="w-4 h-4" /></button>
              </td>
            </tr>
            <tr>
              <td className="p-4 font-medium flex items-center"><FileText className="w-4 h-4 mr-2 text-yellow-500" /> ISO 14001 Certificate.pdf</td>
              <td className="p-4"><span className="px-2 py-1 bg-muted rounded text-xs">Certificates</span></td>
              <td className="p-4 text-muted-foreground">Manager</td>
              <td className="p-4 text-muted-foreground">Sep 28, 2023</td>
              <td className="p-4 text-right">
                <button className="text-emerald-600 hover:text-emerald-700 p-1"><Download className="w-4 h-4" /></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Upload Document">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Document Name</label>
            <input type="text" required placeholder="e.g., Q3 Environmental Report" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Category</label>
            <select className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none">
              <option>Policies</option>
              <option>Certificates</option>
              <option>Audit Reports</option>
              <option>General Documents</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Upload File (PDF/Docx)</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-border border-dashed rounded-lg bg-muted/20">
              <div className="space-y-1 text-center">
                <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                <div className="flex text-sm text-muted-foreground">
                  <label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-transparent font-medium text-emerald-600 hover:text-emerald-500">
                    <span>Upload a file</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" required />
                  </label>
                  <p className="pl-1">or drag and drop</p>
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
