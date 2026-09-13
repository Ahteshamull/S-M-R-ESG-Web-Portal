"use client";

import { useState, useMemo } from "react";
import { 
  FlaskConical, Search, Trash2, ArrowLeft, Loader2, Download, 
  Plus, Eye, Pencil, ShieldAlert, CheckCircle2, AlertTriangle, 
  Building2, Factory, ShieldCheck, Flame, HeartPulse, 
  Boxes, UserCheck, FileText, ChevronRight, ChevronLeft,
  Sparkles, Layers, Calendar, RotateCcw, Filter
} from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import { Modal } from "@/components/ui/modal";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { 
  useGetChemicalsQuery, 
  useCreateChemicalMutation, 
  useUpdateChemicalMutation, 
  useDeleteChemicalMutation 
} from "@/lib/redux/slices/chemicalsApi";
import { exportChemicalsToExcel, ChemicalItem } from "@/lib/exportChemicalsExcel";

export interface CustomFieldItem {
  fieldName: string;
  fieldValue: string;
  fieldType: "text" | "number" | "date" | "boolean";
}

interface ChemicalFormData {
  _id?: string;
  productionUnit: string;
  processName: string;
  date?: string;
  chemicalName: string;
  chemicalType: string;
  dateOfPurchase: string;
  expiryDate: string;
  batchNo: string;
  quantityPurchased: string;
  quantity: string;
  originalMsds: string;
  simplifiedMsds: string;
  labelAvailable: string;
  supplierName: string;
  manufacturerName: string;
  activeIngredients: string;
  casNo: string;
  mrslRslCompliance: string;
  zdhcLevel: string;
  certificateName: string;
  healthHazard: string;
  healthHazardType: string;
  physicalHazard: string;
  physicalHazardType: string;
  environmentalHazard: string;
  environmentalHazardType: string;
  functionOfChemical: string;
  useArea: string;
  ppeRecommended: string;
  storageCondition: string;
  monthlyConsumption: string;
  storageLocation: string;
  emergencyContact: string;
  checkedBy: string;
  checkedOn: string;
  remarks: string;
  customFields: CustomFieldItem[];
}

const initialFormState: ChemicalFormData = {
  productionUnit: "MG Shirtex Limited",
  processName: "Cut to Pack",
  date: new Date().toISOString().slice(0, 10),
  chemicalName: "",
  chemicalType: "",
  dateOfPurchase: new Date().toISOString().slice(0, 10),
  expiryDate: "",
  batchNo: "",
  quantityPurchased: "",
  quantity: "",
  originalMsds: "Y",
  simplifiedMsds: "Y",
  labelAvailable: "Y",
  supplierName: "",
  manufacturerName: "",
  activeIngredients: "",
  casNo: "",
  mrslRslCompliance: "Y",
  zdhcLevel: "None",
  certificateName: "",
  healthHazard: "No",
  healthHazardType: "",
  physicalHazard: "No",
  physicalHazardType: "",
  environmentalHazard: "No",
  environmentalHazardType: "",
  functionOfChemical: "",
  useArea: "",
  ppeRecommended: "",
  storageCondition: "",
  monthlyConsumption: "",
  storageLocation: "",
  emergencyContact: "",
  checkedBy: "",
  checkedOn: new Date().toISOString().slice(0, 10),
  remarks: "",
  customFields: []
};

type FormTab = "purchase" | "supplier" | "msds" | "zdhc" | "hazard" | "storage" | "custom";

const MONTH_OPTIONS = [
  { value: "ALL", label: "All Months" },
  { value: "1", label: "January (01)" },
  { value: "2", label: "February (02)" },
  { value: "3", label: "March (03)" },
  { value: "4", label: "April (04)" },
  { value: "5", label: "May (05)" },
  { value: "6", label: "June (06)" },
  { value: "7", label: "July (07)" },
  { value: "8", label: "August (08)" },
  { value: "9", label: "September (09)" },
  { value: "10", label: "October (10)" },
  { value: "11", label: "November (11)" },
  { value: "12", label: "December (12)" },
];

function parseChemicalDate(dateStr?: string, fallbackCreatedAt?: string): { month: number; year: number } | null {
  const target = dateStr || fallbackCreatedAt;
  if (!target || typeof target !== "string" || target.trim() === "") return null;

  const clean = target.trim();

  // Format: YYYY-MM-DD or YYYY-MM... (ISO String / Date)
  if (/^\d{4}[-/.]\d{1,2}/.test(clean)) {
    const parts = clean.split(/[-/.]/);
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    if (!isNaN(y) && !isNaN(m)) {
      return { year: y, month: m };
    }
  }

  // Format: DD.MM.YYYY or DD/MM/YYYY
  const parts = clean.split(/[./-]/);
  if (parts.length === 3) {
    if (parts[2].length === 4) {
      const y = parseInt(parts[2], 10);
      const m = parseInt(parts[1], 10);
      if (!isNaN(y) && !isNaN(m)) {
        return { year: y, month: m };
      }
    }
    if (parts[0].length === 4) {
      const y = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10);
      if (!isNaN(y) && !isNaN(m)) {
        return { year: y, month: m };
      }
    }
  }

  const parsed = new Date(clean);
  if (!isNaN(parsed.getTime())) {
    return {
      year: parsed.getFullYear(),
      month: parsed.getMonth() + 1,
    };
  }

  return null;
}

export default function ChemicalInventoryPage() {
  const { data: chemicals = [], isLoading } = useGetChemicalsQuery();
  const [createChemical, { isLoading: isCreating }] = useCreateChemicalMutation();
  const [updateChemical, { isLoading: isUpdating }] = useUpdateChemicalMutation();
  const [deleteChemical] = useDeleteChemicalMutation();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("ALL");
  const [selectedYear, setSelectedYear] = useState("ALL");
  const [selectedZdhcFilter, setSelectedZdhcFilter] = useState("ALL");
  const [selectedHazardFilter, setSelectedHazardFilter] = useState("ALL");

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [currentTab, setCurrentTab] = useState<FormTab>("purchase");
  const [formData, setFormData] = useState<ChemicalFormData>(initialFormState);

  // Extra Modal: Add Custom Field
  const [isAddFieldModalOpen, setIsAddFieldModalOpen] = useState(false);
  const [newCustomFieldName, setNewCustomFieldName] = useState("");
  const [newCustomFieldType, setNewCustomFieldType] = useState<"text" | "number" | "date" | "boolean">("text");
  const [newCustomFieldValue, setNewCustomFieldValue] = useState("");

  // View Details Modal
  const [viewingChemical, setViewingChemical] = useState<ChemicalItem | null>(null);

  // Delete Confirmation
  const [chemicalToDelete, setChemicalToDelete] = useState<string | null>(null);

  // Available Years dynamically gathered from all record dates + defaults
  const availableYears = useMemo(() => {
    const yearsSet = new Set<string>();
    chemicals.forEach((chem: any) => {
      [chem.date, chem.createdAt, chem.dateOfPurchase, chem.checkedOn].forEach((dStr) => {
        const d = parseChemicalDate(dStr);
        if (d?.year && d.year >= 1990 && d.year <= 2100) {
          yearsSet.add(String(d.year));
        }
      });
    });
    yearsSet.add("2030");
    yearsSet.add("2029");
    yearsSet.add("2028");
    yearsSet.add("2027");
    yearsSet.add("2026");
    yearsSet.add("2025");
    yearsSet.add("2024");
    yearsSet.add("2023");
    return Array.from(yearsSet).sort((a, b) => Number(b) - Number(a));
  }, [chemicals]);

  // Filtered List with Multi-Date Monthly & Yearly Matching
  const filteredChemicals = useMemo(() => {
    return chemicals.filter((chem: any) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        !q ||
        (chem.chemicalName && chem.chemicalName.toLowerCase().includes(q)) ||
        (chem.supplierName && chem.supplierName.toLowerCase().includes(q)) ||
        (chem.manufacturerName && chem.manufacturerName.toLowerCase().includes(q)) ||
        (chem.casNo && chem.casNo.toLowerCase().includes(q)) ||
        (chem.functionOfChemical && chem.functionOfChemical.toLowerCase().includes(q)) ||
        (chem.batchNo && chem.batchNo.toLowerCase().includes(q));

      const matchesZdhc = 
        selectedZdhcFilter === "ALL" || 
        chem.zdhcLevel === selectedZdhcFilter;

      const matchesHazard = 
        selectedHazardFilter === "ALL" ||
        (selectedHazardFilter === "HEALTH" && chem.healthHazard === "Yes") ||
        (selectedHazardFilter === "PHYSICAL" && chem.physicalHazard === "Yes") ||
        (selectedHazardFilter === "ENV" && chem.environmentalHazard === "Yes");

      // Monthly & Yearly Multi-Date Check
      let matchesMonth = true;
      let matchesYear = true;

      if (selectedMonth !== "ALL" || selectedYear !== "ALL") {
        const datesToCheck = [
          parseChemicalDate(chem.date),
          parseChemicalDate(chem.createdAt),
          parseChemicalDate(chem.dateOfPurchase),
          parseChemicalDate(chem.checkedOn)
        ].filter((d): d is { month: number; year: number } => d !== null);

        if (datesToCheck.length === 0) {
          matchesMonth = false;
          matchesYear = false;
        } else {
          const reqMonth = selectedMonth !== "ALL" ? parseInt(selectedMonth, 10) : null;
          const reqYear = selectedYear !== "ALL" ? parseInt(selectedYear, 10) : null;

          if (reqMonth !== null && reqYear !== null) {
            // Both month and year selected -> at least one date should match both
            const exactMatch = datesToCheck.some((d) => d.month === reqMonth && d.year === reqYear);
            matchesMonth = exactMatch;
            matchesYear = exactMatch;
          } else if (reqMonth !== null) {
            // Only month selected -> matches if any date has this month
            matchesMonth = datesToCheck.some((d) => d.month === reqMonth);
          } else if (reqYear !== null) {
            // Only year selected -> matches if any date has this year
            matchesYear = datesToCheck.some((d) => d.year === reqYear);
          }
        }
      }

      return matchesSearch && matchesZdhc && matchesHazard && matchesMonth && matchesYear;
    });
  }, [chemicals, searchQuery, selectedZdhcFilter, selectedHazardFilter, selectedMonth, selectedYear]);

  // KPI calculations reflecting the currently filtered view
  const totalChemicalCount = filteredChemicals.length;
  const zdhcLevel1PlusCount = filteredChemicals.filter((c: any) => ["Level-1", "Level-2", "Level-3"].includes(c.zdhcLevel || "")).length;
  const screenChemicalCount = filteredChemicals.filter((c: any) => c.screenChemical === "Yes" || c.zdhcLevel === "Level-3").length;
  const withoutCertCount = filteredChemicals.filter((c: any) => !c.certificateName || c.certificateName === "-" || c.zdhcLevel === "None").length;

  const isAnyFilterActive = selectedMonth !== "ALL" || selectedYear !== "ALL" || selectedZdhcFilter !== "ALL" || selectedHazardFilter !== "ALL" || searchQuery.trim() !== "";

  const handleResetFilters = () => {
    setSelectedMonth("ALL");
    setSelectedYear("ALL");
    setSelectedZdhcFilter("ALL");
    setSelectedHazardFilter("ALL");
    setSearchQuery("");
  };

  const handleOpenCreate = () => {
    setFormData(initialFormState);
    setModalMode("create");
    setCurrentTab("purchase");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (chem: any) => {
    setFormData({
      _id: chem._id,
      productionUnit: chem.productionUnit || "MG Shirtex Limited",
      processName: chem.processName || "Cut to Pack",
      date: chem.date || (chem.createdAt ? chem.createdAt.slice(0, 10) : new Date().toISOString().slice(0, 10)),
      chemicalName: chem.chemicalName || "",
      chemicalType: chem.chemicalType || "",
      dateOfPurchase: chem.dateOfPurchase || chem.date || "",
      expiryDate: chem.expiryDate || "",
      batchNo: chem.batchNo || "",
      quantityPurchased: chem.quantityPurchased || chem.quantity || "",
      quantity: chem.quantity || chem.quantityPurchased || "",
      originalMsds: chem.originalMsds || "Y",
      simplifiedMsds: chem.simplifiedMsds || "Y",
      labelAvailable: chem.labelAvailable || "Y",
      supplierName: chem.supplierName || "",
      manufacturerName: chem.manufacturerName || "",
      activeIngredients: chem.activeIngredients || "",
      casNo: chem.casNo || "",
      mrslRslCompliance: chem.mrslRslCompliance || "Y",
      zdhcLevel: chem.zdhcLevel || "None",
      certificateName: chem.certificateName || "",
      healthHazard: chem.healthHazard || "No",
      healthHazardType: chem.healthHazardType || "",
      physicalHazard: chem.physicalHazard || "No",
      physicalHazardType: chem.physicalHazardType || "",
      environmentalHazard: chem.environmentalHazard || "No",
      environmentalHazardType: chem.environmentalHazardType || "",
      functionOfChemical: chem.functionOfChemical || "",
      useArea: chem.useArea || "",
      ppeRecommended: chem.ppeRecommended || "",
      storageCondition: chem.storageCondition || "",
      monthlyConsumption: chem.monthlyConsumption || "",
      storageLocation: chem.storageLocation || "",
      emergencyContact: chem.emergencyContact || "",
      checkedBy: chem.checkedBy || "",
      checkedOn: chem.checkedOn || "",
      remarks: chem.remarks || "",
      customFields: Array.isArray(chem.customFields) ? chem.customFields : []
    });
    setModalMode("edit");
    setCurrentTab("purchase");
    setIsModalOpen(true);
  };

  const handleInputChange = (field: keyof ChemicalFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Custom Field Handlers
  const handleAddCustomField = () => {
    const trimmedName = newCustomFieldName.trim();
    if (!trimmedName) {
      toast.error("Please enter a field name.");
      return;
    }

    const exists = formData.customFields.some(
      (cf) => cf.fieldName.toLowerCase() === trimmedName.toLowerCase()
    );
    if (exists) {
      toast.error(`Field "${trimmedName}" already exists.`);
      return;
    }

    setFormData((prev) => ({
      ...prev,
      customFields: [
        ...prev.customFields,
        {
          fieldName: trimmedName,
          fieldValue: newCustomFieldValue,
          fieldType: newCustomFieldType,
        },
      ],
    }));

    setIsAddFieldModalOpen(false);
    setCurrentTab("custom");
    toast.success(`Custom field "${trimmedName}" added!`);
  };

  const handleUpdateCustomFieldName = (index: number, newName: string) => {
    setFormData((prev) => {
      const updated = [...prev.customFields];
      updated[index] = { ...updated[index], fieldName: newName };
      return { ...prev, customFields: updated };
    });
  };

  const handleUpdateCustomFieldType = (index: number, newType: "text" | "number" | "date" | "boolean") => {
    setFormData((prev) => {
      const updated = [...prev.customFields];
      updated[index] = { ...updated[index], fieldType: newType };
      return { ...prev, customFields: updated };
    });
  };

  const handleUpdateCustomFieldValue = (index: number, value: string) => {
    setFormData((prev) => {
      const updated = [...prev.customFields];
      updated[index] = { ...updated[index], fieldValue: value };
      return { ...prev, customFields: updated };
    });
  };

  const handleRemoveCustomField = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      customFields: prev.customFields.filter((_, i) => i !== index),
    }));
    toast.success("Custom field removed");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.chemicalName.trim()) {
      toast.error("Chemical Name is required");
      setCurrentTab("purchase");
      return;
    }

    const payload = {
      ...formData,
      quantity: formData.quantityPurchased || formData.quantity || "0 Kg",
      useArea: formData.useArea || "General Floor",
      incheckStatus: "Submitted"
    };

    try {
      if (modalMode === "create") {
        const res = await createChemical(payload).unwrap();
        toast.success(res.message || "New chemical added to inventory!");
      } else if (modalMode === "edit" && formData._id) {
        const res = await updateChemical({ id: formData._id, data: payload }).unwrap();
        toast.success(res.message || "Chemical record updated successfully!");
      }
      setIsModalOpen(false);
    } catch (err: any) {
      const errorMsg = err?.data?.message || "Failed to save chemical record";
      toast.error(errorMsg);
    }
  };

  const handleDelete = async () => {
    if (!chemicalToDelete) return;
    try {
      await deleteChemical(chemicalToDelete).unwrap();
      toast.success("Chemical removed successfully!");
    } catch (err: any) {
      const errorMsg = err?.data?.message || "Failed to remove chemical";
      toast.error(errorMsg);
    }
    setChemicalToDelete(null);
  };

  const handleExportExcel = async () => {
    if (filteredChemicals.length === 0) {
      toast.error("No chemical records available to export for the selected filter.");
      return;
    }
    try {
      const selectedMonthLabel = selectedMonth !== "ALL" ? MONTH_OPTIONS.find(m => m.value === selectedMonth)?.label : "";
      const dateText = [selectedMonthLabel, selectedYear !== "ALL" ? selectedYear : ""].filter(Boolean).join(" ") || new Date().toLocaleDateString("en-GB");

      toast.loading("Generating Chemical Inventory Excel...", { id: "excel-export" });
      await exportChemicalsToExcel({
        chemicals: filteredChemicals,
        productionUnit: "MG Shirtex Limited",
        processName: "Cut to Pack",
        updatedOn: dateText,
        updatedBy: "Khan Shehabuddin (Jr. Executive, MAC)"
      });
      toast.success("Chemical Inventory Excel downloaded successfully!", { id: "excel-export" });
    } catch (error) {
      toast.error("Failed to generate Excel file", { id: "excel-export" });
    }
  };

  const tabs: { id: FormTab; label: string }[] = [
    { id: "purchase", label: "1. Purchase Info" },
    { id: "supplier", label: "2. Supplier & Maker" },
    { id: "msds", label: "3. MSDS & Ingredients" },
    { id: "zdhc", label: "4. ZDHC & MRSL" },
    { id: "hazard", label: "5. Hazards" },
    { id: "storage", label: "6. Handling & Storage" },
    { id: "custom", label: `7. Custom Fields (${formData.customFields.length})` },
  ];

  const currentTabIdx = tabs.findIndex((t) => t.id === currentTab);
  const selectedChemicalName = chemicals.find((c: any) => c._id === chemicalToDelete)?.chemicalName || "";

  return (
    <div className="space-y-6 pb-12 w-full max-w-full min-w-0">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full min-w-0">
        <div className="flex items-center gap-3 min-w-0">
          <Link 
            href="/dashboard/chemicals" 
            className="p-2.5 hover:bg-muted/80 rounded-xl transition-colors border border-border/50 bg-background/50 shadow-sm shrink-0"
          >
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </Link>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent truncate">
              Chemical Inventory List
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 font-medium truncate">
              ZDHC MRSL conformance, chemical hazards, stock, and safe handling registry.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap sm:flex-nowrap">
          <button 
            onClick={handleExportExcel}
            className="bg-background hover:bg-muted text-foreground border border-border px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all shadow-sm hover:shadow flex items-center gap-2 shrink-0"
          >
            <Download className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Export Excel</span>
          </button>
          <button 
            onClick={handleOpenCreate}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all shadow-md shadow-emerald-600/20 hover:shadow-emerald-600/30 flex items-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span>Add Chemical</span>
          </button>
        </div>
      </div>

      {/* Production Unit & Process Context Bar */}
      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-3 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 backdrop-blur-md w-full min-w-0">
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 text-xs sm:text-sm">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Building2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="text-muted-foreground">Unit:</span>
            <span className="font-semibold text-foreground">MG Shirtex Limited</span>
          </div>
          <span className="hidden sm:inline text-muted-foreground/40">•</span>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Factory className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="text-muted-foreground">Process:</span>
            <span className="font-semibold text-foreground">Cut to Pack</span>
          </div>
          {selectedMonth !== "ALL" && (
            <>
              <span className="hidden sm:inline text-muted-foreground/40">•</span>
              <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 font-semibold bg-emerald-500/15 px-2.5 py-0.5 rounded-md text-xs">
                <Calendar className="w-3.5 h-3.5 shrink-0" />
                <span>Filtered: {MONTH_OPTIONS.find(m => m.value === selectedMonth)?.label} {selectedYear !== "ALL" ? selectedYear : ""}</span>
              </div>
            </>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-background/60 px-3 py-1.5 rounded-lg border border-border/50 shrink-0 self-start md:self-auto">
          <UserCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Updated by: <strong>Khan Shehabuddin (Jr. Executive, MAC)</strong></span>
        </div>
      </div>

      {/* Top 4 Summary Metrics (Dynamically updates with selected month) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full min-w-0">
        {/* Metric 1 */}
        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-border/60 hover:border-emerald-500/30 transition-all shadow-sm min-w-0">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Chemicals</p>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <FlaskConical className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight">{totalChemicalCount}</span>
            <span className="text-xs text-muted-foreground font-medium">
              {selectedMonth !== "ALL" ? "In Selected Month" : "Logged Items"}
            </span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-border/60 hover:border-emerald-500/30 transition-all shadow-sm min-w-0">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Screen Chemicals</p>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <Boxes className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight">{screenChemicalCount}</span>
            <span className="text-xs text-muted-foreground font-medium">Verified Screened</span>
          </div>
        </div>

        {/* Metric 3 - Highlighted Yellow in Excel */}
        <div className="glass-card rounded-2xl p-4 sm:p-5 border-2 border-amber-400/60 bg-amber-500/5 hover:border-amber-500 transition-all shadow-sm min-w-0">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-amber-800 dark:text-amber-300 uppercase tracking-wider">ZDHC Level-1 & Above</p>
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-amber-900 dark:text-amber-200">{zdhcLevel1PlusCount}</span>
            <span className="text-xs text-amber-700/80 dark:text-amber-300/80 font-medium">MRSL Conforming</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-border/60 hover:border-emerald-500/30 transition-all shadow-sm min-w-0">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Without Certification</p>
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight">{withoutCertCount}</span>
            <span className="text-xs text-muted-foreground font-medium">Requires Audit</span>
          </div>
        </div>
      </div>

      {/* Advanced Search & Monthly Filter Toolbar */}
      <div className="glass-card rounded-2xl p-3 sm:p-4 border border-border/60 flex flex-col xl:flex-row gap-3 items-stretch xl:items-center justify-between shadow-sm w-full min-w-0">
        {/* Search Bar */}
        <div className="relative w-full xl:w-72 2xl:w-80 min-w-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search by Chemical, CAS No, Lot No, Supplier..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all placeholder:text-muted-foreground"
          />
        </div>

        {/* Filter Controls: Month, Year, ZDHC, Hazard */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 w-full xl:w-auto min-w-0">
          {/* Month Filter */}
          <div className="flex items-center gap-1.5 bg-background border border-border rounded-xl px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm shadow-sm focus-within:ring-2 focus-within:ring-emerald-500/40 shrink-0">
            <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <select 
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent font-medium text-foreground focus:outline-none cursor-pointer text-xs sm:text-sm"
              title="Filter by Month"
            >
              {MONTH_OPTIONS.map((m) => (
                <option key={m.value} value={m.value} className="bg-background text-foreground">
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          {/* Year Filter */}
          <select 
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="bg-background border border-border rounded-xl px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/40 shadow-sm cursor-pointer shrink-0"
            title="Filter by Year"
          >
            <option value="ALL">All Years</option>
            {availableYears.map((y) => (
              <option key={y} value={y} className="bg-background text-foreground">
                {y}
              </option>
            ))}
          </select>

          {/* ZDHC Level Filter */}
          <select 
            value={selectedZdhcFilter}
            onChange={(e) => setSelectedZdhcFilter(e.target.value)}
            className="bg-background border border-border rounded-xl px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/40 shrink-0"
          >
            <option value="ALL">All ZDHC Levels</option>
            <option value="Level-3">Level-3 (Highest)</option>
            <option value="Level-2">Level-2</option>
            <option value="Level-1">Level-1</option>
            <option value="None">None (Uncertified)</option>
          </select>

          {/* Hazard Filter */}
          <select 
            value={selectedHazardFilter}
            onChange={(e) => setSelectedHazardFilter(e.target.value)}
            className="bg-background border border-border rounded-xl px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/40 shrink-0"
          >
            <option value="ALL">All Hazard Statuses</option>
            <option value="HEALTH">Health Hazard</option>
            <option value="PHYSICAL">Physical Hazard</option>
            <option value="ENV">Environmental Hazard</option>
          </select>

          {/* Reset Filters button */}
          {isAnyFilterActive && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="flex items-center gap-1 px-2.5 py-1.5 sm:py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 transition-colors shrink-0"
              title="Reset all filters to default"
            >
              <RotateCcw className="w-3.5 h-3.5 shrink-0" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Chemical Inventory Table */}
      <div className="glass-card rounded-2xl overflow-hidden border border-border/60 shadow-sm w-full max-w-full min-w-0">
        <div className="overflow-x-auto w-full max-w-full scrollbar-thin scrollbar-thumb-muted-foreground/20">
          <table className="w-full text-left text-sm whitespace-nowrap min-w-max">
            <thead className="bg-muted/60 text-muted-foreground font-semibold border-b border-border text-xs uppercase tracking-wider">
              <tr>
                <th className="p-4 w-12 text-center">S.L</th>
                <th className="p-4">Chemical Name / Trade</th>
                <th className="p-4">Supplier & Manufacturer</th>
                <th className="p-4">Batch / Lot No.</th>
                <th className="p-4">Purchased / Stock</th>
                <th className="p-4">ZDHC MRSL Level</th>
                <th className="p-4">CAS / EINECS No.</th>
                <th className="p-4">Hazards</th>
                <th className="p-4">Area of Use</th>
                <th className="p-4">Custom Fields</th>
                <th className="p-4">Expiry Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {isLoading ? (
                <tr>
                  <td colSpan={12} className="p-12 text-center text-muted-foreground">
                    <Loader2 className="w-7 h-7 animate-spin mx-auto text-emerald-600 mb-3" />
                    <p className="font-medium">Loading Chemical Inventory records...</p>
                  </td>
                </tr>
              ) : filteredChemicals.length === 0 ? (
                <tr>
                  <td colSpan={12} className="p-12 text-center text-muted-foreground">
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3 text-muted-foreground">
                      <FlaskConical className="w-6 h-6" />
                    </div>
                    <p className="font-semibold text-foreground text-base">No chemical inventory records found</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {isAnyFilterActive 
                        ? "No records match the selected month or search filters. Try changing or resetting the filter." 
                        : "Click 'Add Chemical' to log a new entry into inventory."}
                    </p>
                    {isAnyFilterActive && (
                      <button
                        onClick={handleResetFilters}
                        className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-muted hover:bg-muted/80 text-foreground transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5" /> Clear Filters
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                filteredChemicals.map((record: any, index: number) => {
                  const isZdhcValid = ["Level-1", "Level-2", "Level-3"].includes(record.zdhcLevel || "");
                  const hasCustom = Array.isArray(record.customFields) && record.customFields.length > 0;
                  return (
                    <tr key={record._id} className="hover:bg-muted/40 transition-colors">
                      <td className="p-4 text-center text-muted-foreground font-medium">{index + 1}</td>
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-foreground text-sm">{record.chemicalName}</span>
                          <span className="text-xs text-muted-foreground">{record.functionOfChemical || record.chemicalType || "General Chemical"}</span>
                          <div className="flex items-center gap-2 mt-1 text-[11px] text-muted-foreground/80 font-mono">
                            <span title="Inventory Log Date">📅 Log: {record.date || record.createdAt?.slice(0, 10) || "—"}</span>
                            {record.dateOfPurchase && (
                              <>
                                <span>•</span>
                                <span title="Date of Purchase">Pur: {record.dateOfPurchase}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col max-w-[200px] truncate">
                          <span className="font-medium text-foreground text-xs">{record.supplierName || "—"}</span>
                          <span className="text-[11px] text-muted-foreground truncate">{record.manufacturerName || "—"}</span>
                        </div>
                      </td>
                      <td className="p-4 font-mono text-xs text-muted-foreground">
                        {record.batchNo || "—"}
                      </td>
                      <td className="p-4 font-semibold text-foreground">
                        {record.quantityPurchased || record.quantity || "—"}
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 ${
                          record.zdhcLevel === "Level-3" 
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300/40" 
                            : record.zdhcLevel === "Level-2"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-300/40"
                            : record.zdhcLevel === "Level-1"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300/40"
                            : "bg-muted text-muted-foreground border border-border"
                        }`}>
                          {isZdhcValid ? <ShieldCheck className="w-3 h-3" /> : null}
                          {record.zdhcLevel || "None"}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-xs text-muted-foreground max-w-[150px] truncate" title={record.casNo}>
                        {record.casNo || "—"}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5">
                          {record.healthHazard === "Yes" && (
                            <span title={`Health: ${record.healthHazardType || "Yes"}`} className="p-1 rounded bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400">
                              <HeartPulse className="w-3.5 h-3.5" />
                            </span>
                          )}
                          {record.physicalHazard === "Yes" && (
                            <span title={`Physical: ${record.physicalHazardType || "Yes"}`} className="p-1 rounded bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
                              <Flame className="w-3.5 h-3.5" />
                            </span>
                          )}
                          {record.environmentalHazard === "Yes" && (
                            <span title={`Environmental: ${record.environmentalHazardType || "Yes"}`} className="p-1 rounded bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                              <ShieldAlert className="w-3.5 h-3.5" />
                            </span>
                          )}
                          {record.healthHazard !== "Yes" && record.physicalHazard !== "Yes" && record.environmentalHazard !== "Yes" && (
                            <span className="text-xs text-muted-foreground/60">None</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-xs text-muted-foreground">{record.areaOfUse || record.useArea || "—"}</td>
                      <td className="p-4">
                        {hasCustom ? (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300/30 text-xs font-medium">
                            +{record.customFields.length} field{record.customFields.length > 1 ? "s" : ""}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground/40">—</span>
                        )}
                      </td>
                      <td className="p-4 text-xs font-mono text-muted-foreground">{record.expiryDate || "—"}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button 
                            onClick={() => setViewingChemical(record)}
                            title="View Full Details"
                            className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-emerald-600 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleOpenEdit(record)}
                            title="Edit Chemical"
                            className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-blue-600 transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => setChemicalToDelete(record._id)}
                            title="Delete Chemical"
                            className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Main Multi-Tab Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === "create" ? "Add New Chemical to Inventory" : `Edit Chemical: ${formData.chemicalName}`}
        maxWidthClass="max-w-4xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Spacious & Clean Tab Bar Header with Dedicated "+ Add New Field" Action */}
          <div className="space-y-3 pb-3 border-b border-border">
            {/* Top Row: Section Indicator + Prominent "Add New Field" Button */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Form Sections</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20">
                  Step {currentTabIdx + 1} of {tabs.length}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setNewCustomFieldName("");
                  setNewCustomFieldType("text");
                  setNewCustomFieldValue("");
                  setIsAddFieldModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 transition-all shadow-sm active:scale-95 shrink-0"
                title="Add a dynamic custom field to this chemical"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New Field</span>
              </button>
            </div>

            {/* Bottom Row: Full-width Smooth Horizontal Scroll Tabs (never truncated) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-muted-foreground/20 w-full">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setCurrentTab(tab.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
                    currentTab === tab.id
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/25 ring-2 ring-emerald-500/30"
                      : "bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* TAB 1: Basic & Purchase Information */}
          {currentTab === "purchase" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                Purchase & Identification
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-medium text-foreground">
                    Chemical Name / Tradename / Commercial Name <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g., Acetone, Reactive Blue 21" 
                    value={formData.chemicalName}
                    onChange={(e) => handleInputChange("chemicalName", e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Inventory / Log Date <span className="text-muted-foreground text-[10px]">(For Monthly Filtering)</span>
                  </label>
                  <input 
                    type="date" 
                    value={formData.date || ""}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Date of Purchase</label>
                  <input 
                    type="date" 
                    value={formData.dateOfPurchase}
                    onChange={(e) => handleInputChange("dateOfPurchase", e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Expiry Date</label>
                  <input 
                    type="date" 
                    value={formData.expiryDate}
                    onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Batch Number / Lot No.</label>
                  <input 
                    type="text" 
                    placeholder="e.g., 45879346822" 
                    value={formData.batchNo}
                    onChange={(e) => handleInputChange("batchNo", e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Quantity Purchased & Current Stock</label>
                  <input 
                    type="text" 
                    placeholder="e.g., Stock-320 Ltr / 400 Ltr" 
                    value={formData.quantityPurchased}
                    onChange={(e) => handleInputChange("quantityPurchased", e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Name of Production Unit</label>
                  <input 
                    type="text" 
                    value={formData.productionUnit}
                    onChange={(e) => handleInputChange("productionUnit", e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Name of Process</label>
                  <input 
                    type="text" 
                    value={formData.processName}
                    onChange={(e) => handleInputChange("processName", e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Supplier & Manufacturer */}
          {currentTab === "supplier" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-600" />
                Supplier & Manufacturer Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-medium text-foreground">Name of Chemical Supplier</label>
                  <input 
                    type="text" 
                    placeholder="e.g., Adory Enterprise" 
                    value={formData.supplierName}
                    onChange={(e) => handleInputChange("supplierName", e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-medium text-foreground">Name of Chemical Manufacturer & Address</label>
                  <textarea 
                    rows={2}
                    placeholder="e.g., ChemStation Asia Pte. Ltd., 19 Tanjong Penjuru, Singapore" 
                    value={formData.manufacturerName}
                    onChange={(e) => handleInputChange("manufacturerName", e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Original Label Received from Supplier Available?</label>
                  <select
                    value={formData.labelAvailable}
                    onChange={(e) => handleInputChange("labelAvailable", e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  >
                    <option value="Y">Y (Yes)</option>
                    <option value="N">N (No)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MSDS & Chemical Constituents */}
          {currentTab === "msds" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                Material Safety Data (MSDS) & Chemical Ingredients
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Original MSDS Available?</label>
                  <select
                    value={formData.originalMsds}
                    onChange={(e) => handleInputChange("originalMsds", e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  >
                    <option value="Y">Y (Yes)</option>
                    <option value="N">N (No)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Simplified / Abstracted MSDS Available?</label>
                  <select
                    value={formData.simplifiedMsds}
                    onChange={(e) => handleInputChange("simplifiedMsds", e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  >
                    <option value="Y">Y (Yes)</option>
                    <option value="N">N (No)</option>
                  </select>
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-medium text-foreground">
                    Active Ingredients with Concentration of Substances (i.e. w/w %) given in MSDS
                  </label>
                  <textarea 
                    rows={2}
                    placeholder="e.g., Workplace Exposure Limits EH40, Acetone >99% w/w" 
                    value={formData.activeIngredients}
                    onChange={(e) => handleInputChange("activeIngredients", e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-medium text-foreground">
                    CAS No. / EINECS No. of Ingredients
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g., EU Index No-606-001-00-8, CAS No-67-64-1" 
                    value={formData.casNo}
                    onChange={(e) => handleInputChange("casNo", e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ZDHC & MRSL Conformance */}
          {currentTab === "zdhc" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                ZDHC MRSL & RSL Compliance
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    MRSL & RSL Compliance documented by Compliance statement (Y/N)?
                  </label>
                  <select
                    value={formData.mrslRslCompliance}
                    onChange={(e) => handleInputChange("mrslRslCompliance", e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  >
                    <option value="Y">Y (Yes)</option>
                    <option value="N">N (No)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">ZDHC MRSL Compliance Level</label>
                  <select
                    value={formData.zdhcLevel}
                    onChange={(e) => handleInputChange("zdhcLevel", e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  >
                    <option value="None">None (No Conformance)</option>
                    <option value="Level-1">Level-1</option>
                    <option value="Level-2">Level-2</option>
                    <option value="Level-3">Level-3 (Full Conformance)</option>
                  </select>
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-medium text-foreground">Name of the Certificate</label>
                  <input 
                    type="text" 
                    placeholder="e.g., OEKO-TEX ECO PASSPORT, GOTS, bluesign®" 
                    value={formData.certificateName}
                    onChange={(e) => handleInputChange("certificateName", e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Hazard Classification */}
          {currentTab === "hazard" && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-emerald-600" />
                GHS Hazard Classification
              </h3>
              
              {/* Health Hazard */}
              <div className="p-3.5 rounded-xl border border-border/80 bg-muted/20 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-2">
                    <HeartPulse className="w-4 h-4 text-rose-500" />
                    Health Hazard (Yes/No)
                  </label>
                  <select
                    value={formData.healthHazard}
                    onChange={(e) => handleInputChange("healthHazard", e.target.value)}
                    className="bg-background border border-border rounded-lg px-2.5 py-1 text-xs"
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>
                {formData.healthHazard === "Yes" && (
                  <input 
                    type="text" 
                    placeholder="Specific Health Hazard Type (e.g., Highly Flammable / Skin Irritant)"
                    value={formData.healthHazardType}
                    onChange={(e) => handleInputChange("healthHazardType", e.target.value)}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                )}
              </div>

              {/* Physical Hazard */}
              <div className="p-3.5 rounded-xl border border-border/80 bg-muted/20 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-2">
                    <Flame className="w-4 h-4 text-amber-500" />
                    Physical Hazard (Yes/No)
                  </label>
                  <select
                    value={formData.physicalHazard}
                    onChange={(e) => handleInputChange("physicalHazard", e.target.value)}
                    className="bg-background border border-border rounded-lg px-2.5 py-1 text-xs"
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>
                {formData.physicalHazard === "Yes" && (
                  <input 
                    type="text" 
                    placeholder="Specific Physical Hazard Type (e.g., Irritating to eyes, vapor explosion)"
                    value={formData.physicalHazardType}
                    onChange={(e) => handleInputChange("physicalHazardType", e.target.value)}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                )}
              </div>

              {/* Environmental Hazard */}
              <div className="p-3.5 rounded-xl border border-border/80 bg-muted/20 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-blue-500" />
                    Environmental Hazard (Yes/No)
                  </label>
                  <select
                    value={formData.environmentalHazard}
                    onChange={(e) => handleInputChange("environmentalHazard", e.target.value)}
                    className="bg-background border border-border rounded-lg px-2.5 py-1 text-xs"
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>
                {formData.environmentalHazard === "Yes" && (
                  <input 
                    type="text" 
                    placeholder="Specific Env Hazard Type (e.g., Do not mix with open water or drain water)"
                    value={formData.environmentalHazardType}
                    onChange={(e) => handleInputChange("environmentalHazardType", e.target.value)}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                )}
              </div>
            </div>
          )}

          {/* TAB 6: Handling, Storage & Sign-Off */}
          {currentTab === "storage" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Boxes className="w-4 h-4 text-emerald-600" />
                Handling, Storage & Verification
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Function of Chemical</label>
                  <input 
                    type="text" 
                    placeholder="e.g., Spot remover, Dyeing agent" 
                    value={formData.functionOfChemical}
                    onChange={(e) => handleInputChange("functionOfChemical", e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Area of Use</label>
                  <input 
                    type="text" 
                    placeholder="e.g., Cleaning garments in sewing floor" 
                    value={formData.useArea}
                    onChange={(e) => handleInputChange("useArea", e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-medium text-foreground">Personal Protective Equipment (PPE) Recommended in MSDS</label>
                  <input 
                    type="text" 
                    placeholder="e.g., Filter Mask; Hand Gloves; Goggles; Apron" 
                    value={formData.ppeRecommended}
                    onChange={(e) => handleInputChange("ppeRecommended", e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Storage Condition Recommended in MSDS</label>
                  <input 
                    type="text" 
                    placeholder="e.g., Adequate Ventilation, store in cool area" 
                    value={formData.storageCondition}
                    onChange={(e) => handleInputChange("storageCondition", e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Location of Storage</label>
                  <input 
                    type="text" 
                    placeholder="e.g., Chemical Store / Rack 04" 
                    value={formData.storageLocation}
                    onChange={(e) => handleInputChange("storageLocation", e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Amount used/consumed in a month (kg/month)</label>
                  <input 
                    type="text" 
                    placeholder="e.g., 320 Ltr / month" 
                    value={formData.monthlyConsumption}
                    onChange={(e) => handleInputChange("monthlyConsumption", e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Emergency Contact Person (Name, Designation & Contact No.)</label>
                  <input 
                    type="text" 
                    placeholder="e.g., Md. Saiful Manager (HR) 01755639073" 
                    value={formData.emergencyContact}
                    onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Checked by (Name & Designation)</label>
                  <input 
                    type="text" 
                    placeholder="e.g., Khan Shehabuddin Jr. Executive, MAC" 
                    value={formData.checkedBy}
                    onChange={(e) => handleInputChange("checkedBy", e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Checked on (Date)</label>
                  <input 
                    type="date" 
                    value={formData.checkedOn}
                    onChange={(e) => handleInputChange("checkedOn", e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-medium text-foreground">Remarks / Observations</label>
                  <textarea 
                    rows={2}
                    placeholder="Any additional notes, audit compliance status, or warnings..."
                    value={formData.remarks}
                    onChange={(e) => handleInputChange("remarks", e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: Dynamic Custom Fields (with full edit for Name and Value) */}
          {currentTab === "custom" && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-border">
                <div>
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    Dynamic Custom Fields ({formData.customFields.length})
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    You can edit both the <strong>Field Name</strong> and <strong>Field Value</strong> directly below.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setNewCustomFieldName("");
                    setNewCustomFieldType("text");
                    setNewCustomFieldValue("");
                    setIsAddFieldModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Another Field</span>
                </button>
              </div>

              {formData.customFields.length === 0 ? (
                <div className="p-8 text-center border-2 border-dashed border-border/80 rounded-2xl bg-muted/10 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                    <Layers className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">No Custom Fields Added Yet</h4>
                    <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
                      You can add custom properties like Country of Origin, Flash Point, UN Number, or specific supplier contact numbers.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setNewCustomFieldName("");
                      setNewCustomFieldType("text");
                      setNewCustomFieldValue("");
                      setIsAddFieldModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-md shadow-emerald-600/20"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create First Custom Field</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formData.customFields.map((cf, idx) => (
                    <div 
                      key={idx}
                      className="p-4 rounded-2xl border border-border/80 bg-card shadow-sm space-y-3 relative group hover:border-emerald-500/50 transition-all"
                    >
                      {/* Top Header of Card */}
                      <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-border/40">
                        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                          Custom Field #{idx + 1}
                        </span>
                        <div className="flex items-center gap-2">
                          <select
                            value={cf.fieldType}
                            onChange={(e) => handleUpdateCustomFieldType(idx, e.target.value as any)}
                            className="text-[11px] font-semibold bg-muted border border-border rounded-lg px-2 py-0.5 text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          >
                            <option value="text">Text</option>
                            <option value="number">Number</option>
                            <option value="date">Date</option>
                            <option value="boolean">Yes/No</option>
                          </select>
                          <button
                            type="button"
                            onClick={() => handleRemoveCustomField(idx)}
                            title="Remove Field"
                            className="p-1 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Field Name Input (Editable) */}
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                          <span>Field Name / Label:</span>
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Editable Name</span>
                        </label>
                        <input
                          type="text"
                          value={cf.fieldName}
                          placeholder="e.g., Flash Point (°C)"
                          onChange={(e) => handleUpdateCustomFieldName(idx, e.target.value)}
                          className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                        />
                      </div>

                      {/* Field Value Input (Editable) */}
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                          <span>Field Value:</span>
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Editable Value</span>
                        </label>
                        {cf.fieldType === "boolean" ? (
                          <select
                            value={cf.fieldValue}
                            onChange={(e) => handleUpdateCustomFieldValue(idx, e.target.value)}
                            className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                          >
                            <option value="">Select Yes/No</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </select>
                        ) : (
                          <input
                            type={cf.fieldType === "number" ? "number" : cf.fieldType === "date" ? "date" : "text"}
                            value={cf.fieldValue}
                            placeholder={`Enter value for ${cf.fieldName || 'field'}...`}
                            onChange={(e) => handleUpdateCustomFieldValue(idx, e.target.value)}
                            className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Modal Footer / Navigation Buttons */}
          <div className="pt-4 border-t border-border flex items-center justify-between gap-3">
            <div>
              {currentTabIdx > 0 && (
                <button
                  type="button"
                  onClick={() => setCurrentTab(tabs[currentTabIdx - 1].id)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-foreground bg-muted hover:bg-muted/80 transition-colors flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>
              )}
            </div>

            <div className="flex items-center gap-2.5">
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)} 
                className="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-xl text-xs font-medium transition-colors"
              >
                Cancel
              </button>

              {currentTabIdx < tabs.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentTab(tabs[currentTabIdx + 1].id)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button 
                  type="submit" 
                  disabled={isCreating || isUpdating}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-2 shadow-md shadow-emerald-600/20"
                >
                  {(isCreating || isUpdating) && <Loader2 className="w-4 h-4 animate-spin" />}
                  {modalMode === "create" ? "Save Chemical Record" : "Update Chemical Record"}
                </button>
              )}
            </div>
          </div>
        </form>
      </Modal>

      {/* EXTRA MODAL: Add Custom Field */}
      <Modal
        isOpen={isAddFieldModalOpen}
        onClose={() => setIsAddFieldModalOpen(false)}
        title="Add New Custom Field"
        maxWidthClass="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-xs text-muted-foreground">
            Create a custom dynamic property for this chemical record. Both the Field Name and Value can be updated at any time.
          </p>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Field Name / Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Country of Origin, Flash Point (°C), UN Number"
              value={newCustomFieldName}
              onChange={(e) => setNewCustomFieldName(e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Data Type</label>
            <select
              value={newCustomFieldType}
              onChange={(e) => setNewCustomFieldType(e.target.value as any)}
              className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            >
              <option value="text">Text (General)</option>
              <option value="number">Number</option>
              <option value="date">Date</option>
              <option value="boolean">Yes / No</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Initial Value (Optional)</label>
            {newCustomFieldType === "boolean" ? (
              <select
                value={newCustomFieldValue}
                onChange={(e) => setNewCustomFieldValue(e.target.value)}
                className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              >
                <option value="">Select...</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            ) : (
              <input
                type={newCustomFieldType === "number" ? "number" : newCustomFieldType === "date" ? "date" : "text"}
                placeholder="Enter value for this chemical..."
                value={newCustomFieldValue}
                onChange={(e) => setNewCustomFieldValue(e.target.value)}
                className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
            )}
          </div>

          <div className="pt-3 border-t border-border flex justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsAddFieldModalOpen(false)}
              className="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-xl text-xs font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAddCustomField}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm shadow-emerald-600/20"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Field to Form</span>
            </button>
          </div>
        </div>
      </Modal>

      {/* View Full Details Modal */}
      <Modal
        isOpen={!!viewingChemical}
        onClose={() => setViewingChemical(null)}
        title={viewingChemical ? `Chemical Details: ${viewingChemical.chemicalName}` : "Chemical Details"}
        maxWidthClass="max-w-4xl"
      >
        {viewingChemical && (
          <div className="space-y-6 text-sm">
            {/* Header info */}
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-lg text-foreground">{viewingChemical.chemicalName}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">{viewingChemical.functionOfChemical || viewingChemical.chemicalType || "Industrial Chemical"}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-3 py-1 rounded-full font-semibold bg-emerald-600 text-white">
                  ZDHC: {viewingChemical.zdhcLevel || "None"}
                </span>
                <span className="text-xs px-3 py-1 rounded-full font-semibold bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                  CAS: {viewingChemical.casNo || "N/A"}
                </span>
              </div>
            </div>

            {/* Detailed Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Purchase Details */}
              <div className="bg-muted/20 border border-border/60 rounded-xl p-4 space-y-2.5">
                <h5 className="font-bold text-xs uppercase tracking-wider text-emerald-600 flex items-center gap-1.5">
                  <FileText className="w-4 h-4" /> Purchase Information
                </h5>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-border/40">
                    <span className="text-muted-foreground">Date of Purchase:</span>
                    <span className="font-medium text-foreground">{viewingChemical.dateOfPurchase || viewingChemical.date || "—"}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/40">
                    <span className="text-muted-foreground">Expiry Date:</span>
                    <span className="font-medium text-foreground">{viewingChemical.expiryDate || "—"}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/40">
                    <span className="text-muted-foreground">Batch / Lot No.:</span>
                    <span className="font-mono font-medium text-foreground">{viewingChemical.batchNo || "—"}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/40">
                    <span className="text-muted-foreground">Quantity Purchased:</span>
                    <span className="font-medium text-foreground">{viewingChemical.quantityPurchased || viewingChemical.quantity || "—"}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-muted-foreground">Monthly Consumption:</span>
                    <span className="font-medium text-foreground">{viewingChemical.monthlyConsumption || "—"}</span>
                  </div>
                </div>
              </div>

              {/* Supplier & Manufacturer */}
              <div className="bg-muted/20 border border-border/60 rounded-xl p-4 space-y-2.5">
                <h5 className="font-bold text-xs uppercase tracking-wider text-emerald-600 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4" /> Supplier & Manufacturer
                </h5>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-border/40">
                    <span className="text-muted-foreground">Supplier Name:</span>
                    <span className="font-medium text-foreground">{viewingChemical.supplierName || "—"}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/40">
                    <span className="text-muted-foreground">Original Label Received:</span>
                    <span className="font-medium text-foreground">{viewingChemical.labelAvailable || "Y"}</span>
                  </div>
                  <div className="py-1">
                    <span className="text-muted-foreground block mb-1">Manufacturer & Address:</span>
                    <span className="font-medium text-foreground">{viewingChemical.manufacturerName || "—"}</span>
                  </div>
                </div>
              </div>

              {/* MSDS & ZDHC */}
              <div className="bg-muted/20 border border-border/60 rounded-xl p-4 space-y-2.5">
                <h5 className="font-bold text-xs uppercase tracking-wider text-emerald-600 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" /> MSDS & ZDHC Conformance
                </h5>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-border/40">
                    <span className="text-muted-foreground">Original MSDS:</span>
                    <span className="font-medium text-foreground">{viewingChemical.originalMsds || "Y"}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/40">
                    <span className="text-muted-foreground">Simplified MSDS:</span>
                    <span className="font-medium text-foreground">{viewingChemical.simplifiedMsds || "Y"}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/40">
                    <span className="text-muted-foreground">MRSL Compliance Statement:</span>
                    <span className="font-medium text-foreground">{viewingChemical.mrslRslCompliance || "Y"}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/40">
                    <span className="text-muted-foreground">Certificate Name:</span>
                    <span className="font-medium text-foreground">{viewingChemical.certificateName || "None"}</span>
                  </div>
                  <div className="py-1">
                    <span className="text-muted-foreground block mb-1">Active Ingredients (w/w %):</span>
                    <span className="font-medium text-foreground">{viewingChemical.activeIngredients || "—"}</span>
                  </div>
                </div>
              </div>

              {/* Hazard & Safety */}
              <div className="bg-muted/20 border border-border/60 rounded-xl p-4 space-y-2.5">
                <h5 className="font-bold text-xs uppercase tracking-wider text-emerald-600 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4" /> Hazards & Safe Handling
                </h5>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-border/40">
                    <span className="text-muted-foreground">Health Hazard:</span>
                    <span className="font-medium text-foreground">{viewingChemical.healthHazard === "Yes" ? `Yes (${viewingChemical.healthHazardType})` : "No"}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/40">
                    <span className="text-muted-foreground">Physical Hazard:</span>
                    <span className="font-medium text-foreground">{viewingChemical.physicalHazard === "Yes" ? `Yes (${viewingChemical.physicalHazardType})` : "No"}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/40">
                    <span className="text-muted-foreground">Environmental Hazard:</span>
                    <span className="font-medium text-foreground">{viewingChemical.environmentalHazard === "Yes" ? `Yes (${viewingChemical.environmentalHazardType})` : "No"}</span>
                  </div>
                  <div className="py-1 border-b border-border/40">
                    <span className="text-muted-foreground block mb-1">Recommended PPE:</span>
                    <span className="font-medium text-foreground">{viewingChemical.ppeRecommended || "—"}</span>
                  </div>
                  <div className="py-1">
                    <span className="text-muted-foreground block mb-1">Storage Condition & Location:</span>
                    <span className="font-medium text-foreground">{viewingChemical.storageCondition || "—"} | {viewingChemical.storageLocation || "Store Room"}</span>
                  </div>
                </div>
              </div>

              {/* Custom Fields Section (if any) */}
              {Array.isArray(viewingChemical.customFields) && viewingChemical.customFields.length > 0 && (
                <div className="bg-muted/20 border border-border/60 rounded-xl p-4 space-y-2.5 md:col-span-2">
                  <h5 className="font-bold text-xs uppercase tracking-wider text-emerald-600 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" /> Additional Custom Fields
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1">
                    {viewingChemical.customFields.map((cf, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-background/60 border border-border/50">
                        <span className="text-[11px] text-muted-foreground block">{cf.fieldName}:</span>
                        <span className="font-semibold text-foreground text-xs">{cf.fieldValue || "—"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Audit & Verification Footer */}
            <div className="bg-muted/30 border border-border/60 rounded-xl p-3.5 flex flex-wrap items-center justify-between text-xs text-muted-foreground gap-3">
              <div>
                Emergency Contact: <strong className="text-foreground">{viewingChemical.emergencyContact || "—"}</strong>
              </div>
              <div>
                Checked by: <strong className="text-foreground">{viewingChemical.checkedBy || "—"}</strong> on <strong className="text-foreground">{viewingChemical.checkedOn || "—"}</strong>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setViewingChemical(null)}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold"
              >
                Close Details
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!chemicalToDelete}
        onClose={() => setChemicalToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Chemical from Inventory"
        message={`Are you sure you want to delete ${selectedChemicalName}? All corresponding MSDS and compliance linkages will be removed.`}
        confirmText="Yes, Delete"
        isDestructive={true}
      />
    </div>
  );
}
