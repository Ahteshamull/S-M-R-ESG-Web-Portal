"use client";

import { useState, useEffect } from "react";
import { Building2, MapPin, Users, Award, Briefcase, Plus, Trash2, Loader2, Calendar } from "lucide-react";
import toast from "react-hot-toast";
import { Modal } from "@/components/ui/modal";
import { 
  useGetFactoryProfileQuery, 
  useUpdateFactoryProfileMutation, 
  useAddFactoryCertificationMutation, 
  useDeleteFactoryCertificationMutation 
} from "@/lib/redux/slices/factoryApi";

export default function FactoryProfilePage() {
  const { data: profile, isLoading } = useGetFactoryProfileQuery();
  const [updateFactoryProfile] = useUpdateFactoryProfileMutation();
  const [addFactoryCertification] = useAddFactoryCertificationMutation();
  const [deleteFactoryCertification] = useDeleteFactoryCertificationMutation();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);

  // Factory Form State
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [productionType, setProductionType] = useState<"Knitwear" | "Woven" | "Dyeing & Printing" | "Accessories">("Knitwear");
  const [establishmentYear, setEstablishmentYear] = useState<number | "">("");
  const [totalAreaSqft, setTotalAreaSqft] = useState<number | "">("");
  const [totalEmployees, setTotalEmployees] = useState<number | "">("");
  const [infrastructureLayout, setInfrastructureLayout] = useState("");
  const [machineryEquipment, setMachineryEquipment] = useState("");
  const [capacityWorkforce, setCapacityWorkforce] = useState("");
  const [vision, setVision] = useState("");

  // Certification Form State
  const [certName, setCertName] = useState("");
  const [certValidTill, setCertValidTill] = useState("");
  const [certStatus, setCertStatus] = useState<"Active" | "Expired">("Active");

  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setAddress(profile.address || "");
      setProductionType(profile.productionType || "Knitwear");
      setEstablishmentYear(profile.establishmentYear || "");
      setTotalAreaSqft(profile.totalAreaSqft || "");
      setTotalEmployees(profile.totalEmployees || "");
      setInfrastructureLayout(profile.infrastructureLayout || "");
      setMachineryEquipment(profile.machineryEquipment || "");
      setCapacityWorkforce(profile.capacityWorkforce || "");
      setVision(profile.vision || "");
    }
  }, [profile]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name,
      address,
      productionType,
      establishmentYear: Number(establishmentYear) || 2000,
      totalAreaSqft: Number(totalAreaSqft) || 0,
      totalEmployees: Number(totalEmployees) || 0,
      infrastructureLayout,
      machineryEquipment,
      capacityWorkforce,
      vision,
    };

    const res = await updateFactoryProfile(payload);
    setIsEditModalOpen(false);

    if (!res.error) {
      toast.success("Factory profile updated successfully!");
    } else {
      const errorMsg = (res.error as any).data?.message || "Failed to update profile";
      toast.error(errorMsg);
    }
  };

  const handleAddCert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certName || !certValidTill) return;

    const payload = {
      name: certName,
      validTill: new Date(certValidTill).toISOString(),
      status: certStatus,
    };

    const res = await addFactoryCertification(payload);
    setIsCertModalOpen(false);

    if (!res.error) {
      toast.success("Certification added successfully!");
      setCertName(""); setCertValidTill(""); setCertStatus("Active");
    } else {
      const errorMsg = (res.error as any).data?.message || "Failed to add certification";
      toast.error(errorMsg);
    }
  };

  const handleDeleteCert = async (index: number) => {
    const res = await deleteFactoryCertification(index);
    if (!res.error) {
      toast.success("Certification removed successfully!");
    } else {
      const errorMsg = (res.error as any).data?.message || "Failed to remove certification";
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

  const buyers = profile?.keyBuyers || ["H&M", "ZARA", "M&S"];
  const certifications = profile?.certifications || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Factory Profile</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage factory details, buyers, and certifications.</p>
        </div>
        <button 
          onClick={() => setIsEditModalOpen(true)}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center"
        >
          Edit Profile
        </button>
      </div>

      {!profile ? (
        <div className="glass-card rounded-xl p-8 text-center border border-border">
          <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold">No Profile Created Yet</h3>
          <p className="text-sm text-muted-foreground mt-1">Click the edit button above to set up your factory details.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card rounded-xl p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-8 h-8 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{profile.name}</h2>
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <MapPin className="w-4 h-4 mr-1 text-muted-foreground" /> {profile.address}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="p-4 bg-muted/35 rounded-lg border border-border">
                  <p className="text-xs text-muted-foreground mb-1">Employees</p>
                  <p className="text-lg font-bold flex items-center"><Users className="w-4 h-4 mr-2 text-emerald-600"/> {profile.totalEmployees?.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-muted/35 rounded-lg border border-border">
                  <p className="text-xs text-muted-foreground mb-1">Total Area</p>
                  <p className="text-lg font-bold">{profile.totalAreaSqft?.toLocaleString()} sqft</p>
                </div>
                <div className="p-4 bg-muted/35 rounded-lg border border-border">
                  <p className="text-xs text-muted-foreground mb-1">Est. Year</p>
                  <p className="text-lg font-bold">{profile.establishmentYear}</p>
                </div>
                <div className="p-4 bg-muted/35 rounded-lg border border-border">
                  <p className="text-xs text-muted-foreground mb-1">Production Type</p>
                  <p className="text-lg font-bold">{profile.productionType}</p>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Facility Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Our Vision</h4>
                  <p className="text-sm text-foreground bg-muted/20 p-3 rounded-lg border border-border min-h-[80px]">{profile.vision || "Not specified."}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Infrastructure & Layout</h4>
                  <p className="text-sm text-foreground bg-muted/20 p-3 rounded-lg border border-border min-h-[80px]">{profile.infrastructureLayout || "Not specified."}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Machinery & Equipment</h4>
                  <p className="text-sm text-foreground bg-muted/20 p-3 rounded-lg border border-border min-h-[80px]">{profile.machineryEquipment || "Not specified."}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Capacity & Workforce</h4>
                  <p className="text-sm text-foreground bg-muted/20 p-3 rounded-lg border border-border min-h-[80px]">{profile.capacityWorkforce || "Not specified."}</p>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center"><Briefcase className="w-5 h-5 mr-2 text-emerald-600" /> Key Buyers</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {buyers.map((buyer: string, idx: number) => (
                  <div key={idx} className="h-20 bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-200/50 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-300 rounded-lg flex items-center justify-center font-bold">
                    {buyer}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-card rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold flex items-center"><Award className="w-5 h-5 mr-2 text-yellow-500" /> Certifications</h3>
                <button 
                  onClick={() => setIsCertModalOpen(true)}
                  className="text-xs text-emerald-600 hover:text-emerald-800 font-semibold flex items-center"
                >
                  <Plus className="w-3 h-3 mr-1" /> Add
                </button>
              </div>
              <div className="space-y-4">
                {certifications.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No certifications added.</p>
                ) : (
                  certifications.map((cert: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/10 transition-colors group">
                      <div>
                        <p className="font-semibold text-sm">{cert.name}</p>
                        <p className="text-xs text-muted-foreground flex items-center mt-0.5">
                          <Calendar className="w-3.5 h-3.5 mr-1" />
                          Till {new Date(cert.validTill).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          cert.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {cert.status}
                        </span>
                        <button 
                          onClick={() => handleDeleteCert(index)}
                          className="text-red-500 hover:text-red-700 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Delete certification"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit factory info Modal */}
      <Modal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        title="Edit Factory Profile"
        maxWidthClass="max-w-3xl"
      >
        <form onSubmit={handleSaveProfile} className="space-y-4 max-h-[70vh] overflow-y-auto px-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Factory Name</label>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Factory Address</label>
              <input 
                type="text" 
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Production Type</label>
              <select 
                value={productionType}
                onChange={(e) => setProductionType(e.target.value as any)}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              >
                <option value="Knitwear">Knitwear</option>
                <option value="Woven">Woven</option>
                <option value="Dyeing & Printing">Dyeing & Printing</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Establishment Year</label>
              <input 
                type="number" 
                value={establishmentYear}
                onChange={(e) => setEstablishmentYear(e.target.value !== "" ? Number(e.target.value) : "")}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Total Area (sqft)</label>
              <input 
                type="number" 
                value={totalAreaSqft}
                onChange={(e) => setTotalAreaSqft(e.target.value !== "" ? Number(e.target.value) : "")}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Total Employees</label>
              <input 
                type="number" 
                value={totalEmployees}
                onChange={(e) => setTotalEmployees(e.target.value !== "" ? Number(e.target.value) : "")}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" 
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Infrastructure & Layout</label>
            <textarea 
              rows={3} 
              value={infrastructureLayout}
              onChange={(e) => setInfrastructureLayout(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            ></textarea>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Machinery & Equipment</label>
            <textarea 
              rows={3} 
              value={machineryEquipment}
              onChange={(e) => setMachineryEquipment(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            ></textarea>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Capacity & Workforce</label>
            <textarea 
              rows={3} 
              value={capacityWorkforce}
              onChange={(e) => setCapacityWorkforce(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            ></textarea>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Our Vision</label>
            <textarea 
              rows={3} 
              value={vision}
              onChange={(e) => setVision(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            ></textarea>
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

      {/* Add Certification Modal */}
      <Modal 
        isOpen={isCertModalOpen} 
        onClose={() => setIsCertModalOpen(false)} 
        title="Add Certification"
      >
        <form onSubmit={handleAddCert} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Certification Name</label>
            <input 
              type="text" 
              required 
              value={certName}
              onChange={(e) => setCertName(e.target.value)}
              placeholder="e.g., LEED Gold, ISO 14001" 
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none" 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Valid Till</label>
              <input 
                type="date" 
                required 
                value={certValidTill}
                onChange={(e) => setCertValidTill(e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Status</label>
              <select 
                value={certStatus}
                onChange={(e) => setCertStatus(e.target.value as any)}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none"
              >
                <option value="Active">Active</option>
                <option value="Expired">Expired</option>
              </select>
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3 mt-6">
            <button type="button" onClick={() => setIsCertModalOpen(false)} className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg text-sm font-medium">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium">Add</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

