"use client";

import { useState } from "react";
import { Building2, MapPin, Users, Award, Briefcase, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { Modal } from "@/components/ui/modal";

export default function FactoryProfilePage() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddFactoryModalOpen, setIsAddFactoryModalOpen] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditModalOpen(false);
    toast.success("Factory profile updated successfully!");
  };

  const handleAddFactory = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddFactoryModalOpen(false);
    toast.success("New factory added successfully!");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Factory Profiles</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage factory details, buyers, and certifications.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="bg-emerald-50 text-emerald-700 border border-border px-4 py-2 rounded-lg text-sm font-medium hover:bg-muted transition-colors"
          >
            Edit Current Profile
          </button>
          <button 
            onClick={() => setIsAddFactoryModalOpen(true)}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-1" /> Add Factory
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 bg-muted rounded-xl flex items-center justify-center flex-shrink-0">
                <Building2 className="w-8 h-8 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Apex Apparels Ltd.</h2>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <MapPin className="w-4 h-4 mr-1" /> Gazipur, Dhaka, Bangladesh
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="p-4 bg-muted/30 rounded-lg border border-border">
                <p className="text-xs text-muted-foreground mb-1">Total number of employees</p>
                <p className="text-lg font-bold flex items-center"><Users className="w-4 h-4 mr-2 text-blue-500"/> 2,450</p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg border border-border">
                <p className="text-xs text-muted-foreground mb-1">Total Area</p>
                <p className="text-lg font-bold">120,000 sqft</p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg border border-border">
                <p className="text-xs text-muted-foreground mb-1">Establishment year</p>
                <p className="text-lg font-bold">2005</p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg border border-border">
                <p className="text-xs text-muted-foreground mb-1">Production Type</p>
                <p className="text-lg font-bold">Knitwear</p>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Facility Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Our Vision</h4>
                <p className="text-sm text-foreground bg-muted/30 p-3 rounded-lg border border-border">To be the leading sustainable apparel manufacturer globally, prioritizing ESG compliance and worker well-being.</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Infrastructure & Layout</h4>
                <p className="text-sm text-foreground bg-muted/30 p-3 rounded-lg border border-border">Modern vertical layout with optimized material flow, natural lighting, and energy-efficient cooling systems.</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Machinery & Equipment</h4>
                <p className="text-sm text-foreground bg-muted/30 p-3 rounded-lg border border-border">State-of-the-art automatic cutting machines, IoT-enabled sewing lines, and waterless dyeing technology.</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Capacity & Workforce</h4>
                <p className="text-sm text-foreground bg-muted/30 p-3 rounded-lg border border-border">Monthly capacity of 1.2M pieces with a highly skilled workforce of 2,450 employees running in 2 shifts.</p>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center"><Briefcase className="w-5 h-5 mr-2 text-emerald-600" /> Key Buyers</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="h-20 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg flex items-center justify-center font-bold">H&M</div>
              <div className="h-20 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg flex items-center justify-center font-bold">ZARA</div>
              <div className="h-20 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg flex items-center justify-center font-bold">M&S</div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center"><Award className="w-5 h-5 mr-2 text-yellow-500" /> Certifications</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div>
                  <p className="font-medium">LEED Gold</p>
                  <p className="text-xs text-muted-foreground">Valid till Dec 2027</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-md font-medium">Active</span>
              </div>
              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div>
                  <p className="font-medium">RMG Sustainability</p>
                  <p className="text-xs text-muted-foreground">Valid till Aug 2026</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-md font-medium">Active</span>
              </div>
              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div>
                  <p className="font-medium">ISO 14001</p>
                  <p className="text-xs text-red-500">Expired last month</p>
                </div>
                <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-md font-medium">Expired</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        title="Edit Factory Profile"
        maxWidthClass="max-w-3xl"
      >
        <form onSubmit={handleSave} className="space-y-4 max-h-[70vh] overflow-y-auto px-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Factory Name</label>
              <input type="text" defaultValue="Apex Apparels Ltd." className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Factory Address</label>
              <input type="text" defaultValue="Gazipur, Dhaka, Bangladesh" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Production Type</label>
              <select defaultValue="Knitwear" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50">
                <option>Knitwear</option>
                <option>Woven</option>
                <option>Dyeing & Printing</option>
                <option>Accessories</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Establishment year</label>
              <input type="number" defaultValue="2005" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Total Area (sqft)</label>
              <input type="number" defaultValue="120000" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Total number of employees</label>
              <input type="number" defaultValue="2450" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Infrastructure & Layout</label>
            <textarea rows={3} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"></textarea>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Machinery & Equipment</label>
            <textarea rows={3} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"></textarea>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Capacity & Workforce</label>
            <textarea rows={3} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"></textarea>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Our Vision</label>
            <textarea rows={3} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"></textarea>
          </div>
          <div className="pt-4 border-t border-border flex justify-end gap-3 mt-6">
            <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg text-sm font-medium transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors">
              Save Changes
            </button>
          </div>
        </form>
      </Modal>

      {/* Add New Factory Modal */}
      <Modal 
        isOpen={isAddFactoryModalOpen} 
        onClose={() => setIsAddFactoryModalOpen(false)} 
        title="Add New Factory"
        maxWidthClass="max-w-3xl"
      >
        <form onSubmit={handleAddFactory} className="space-y-4 max-h-[70vh] overflow-y-auto px-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Factory Name</label>
              <input type="text" placeholder="e.g., Apex Apparels Unit-2" required className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Factory Address</label>
              <input type="text" placeholder="e.g., Narayanganj, Bangladesh" required className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Production Type</label>
              <select className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50">
                <option>Knitwear</option>
                <option>Woven</option>
                <option>Dyeing & Printing</option>
                <option>Accessories</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Establishment year</label>
              <input type="number" placeholder="YYYY" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Total Area (sqft)</label>
              <input type="number" placeholder="0" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Total number of employees</label>
              <input type="number" placeholder="0" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Infrastructure & Layout</label>
            <textarea rows={3} placeholder="Describe infrastructure and layout..." className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"></textarea>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Machinery & Equipment</label>
            <textarea rows={3} placeholder="List machinery and equipment..." className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"></textarea>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Capacity & Workforce</label>
            <textarea rows={3} placeholder="Details about capacity and workforce..." className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"></textarea>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Our Vision</label>
            <textarea rows={3} placeholder="State factory vision..." className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"></textarea>
          </div>
          <div className="pt-4 border-t border-border flex justify-end gap-3 mt-6">
            <button type="button" onClick={() => setIsAddFactoryModalOpen(false)} className="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg text-sm font-medium transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors">
              Add Factory
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
