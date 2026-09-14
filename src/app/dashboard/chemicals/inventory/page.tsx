"use client";

import { useState, useMemo } from "react";
import toast from "react-hot-toast";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import {
  useGetChemicalsQuery,
  useCreateChemicalMutation,
  useUpdateChemicalMutation,
  useDeleteChemicalMutation,
} from "@/lib/redux/slices/chemicalsApi";
import { exportChemicalsToExcel, ChemicalItem } from "@/lib/exportChemicalsExcel";

import {
  ChemicalFormData,
  initialFormState,
  parseChemicalDate,
  MONTH_OPTIONS,
} from "./types";
import { ChemicalsHeader } from "./components/ChemicalsHeader";
import { ChemicalsKpis } from "./components/ChemicalsKpis";
import { ChemicalsTable } from "./components/ChemicalsTable";
import { ChemicalFormModal } from "./components/ChemicalFormModal";
import { ChemicalDetailsModal } from "./components/ChemicalDetailsModal";

export default function ChemicalInventoryPage() {
  // Redux API Queries & Mutations
  const { data: chemicals = [], isLoading, refetch: refetchChemicals } = useGetChemicalsQuery();
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
  const [formData, setFormData] = useState<ChemicalFormData>(initialFormState);

  // View Details Modal
  const [viewingChemical, setViewingChemical] = useState<ChemicalItem | null>(null);

  // Delete Confirmation
  const [chemicalToDelete, setChemicalToDelete] = useState<string | null>(null);

  // Available Years dynamically gathered
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
        (selectedZdhcFilter === "None"
          ? !chem.zdhcLevel || chem.zdhcLevel === "None"
          : chem.zdhcLevel === selectedZdhcFilter);

      const isHealth = chem.healthHazard === "Yes";
      const isPhysical = chem.physicalHazard === "Yes";
      const isEnv = chem.environmentalHazard === "Yes";
      const hasAnyHazard = isHealth || isPhysical || isEnv;

      const matchesHazard =
        selectedHazardFilter === "ALL"
          ? true
          : selectedHazardFilter === "Health"
          ? isHealth
          : selectedHazardFilter === "Physical"
          ? isPhysical
          : selectedHazardFilter === "Environmental"
          ? isEnv
          : selectedHazardFilter === "Any"
          ? hasAnyHazard
          : selectedHazardFilter === "Safe"
          ? !hasAnyHazard
          : true;

      let matchesMonth = true;
      let matchesYear = true;

      if (selectedMonth !== "ALL" || selectedYear !== "ALL") {
        const reqMonth = selectedMonth !== "ALL" ? parseInt(selectedMonth, 10) : null;
        const reqYear = selectedYear !== "ALL" ? parseInt(selectedYear, 10) : null;

        const datesToCheck = [chem.date, chem.createdAt, chem.dateOfPurchase, chem.checkedOn]
          .map((dStr) => parseChemicalDate(dStr))
          .filter((d): d is { month: number; year: number } => d !== null);

        if (datesToCheck.length === 0) {
          matchesMonth = false;
          matchesYear = false;
        } else {
          if (reqMonth !== null && reqYear !== null) {
            const exactMatch = datesToCheck.some((d) => d.month === reqMonth && d.year === reqYear);
            matchesMonth = exactMatch;
            matchesYear = exactMatch;
          } else if (reqMonth !== null) {
            matchesMonth = datesToCheck.some((d) => d.month === reqMonth);
          } else if (reqYear !== null) {
            matchesYear = datesToCheck.some((d) => d.year === reqYear);
          }
        }
      }

      return matchesSearch && matchesZdhc && matchesHazard && matchesMonth && matchesYear;
    });
  }, [chemicals, searchQuery, selectedZdhcFilter, selectedHazardFilter, selectedMonth, selectedYear]);

  // KPI calculations
  const totalChemicalCount = filteredChemicals.length;
  const zdhcLevel1PlusCount = filteredChemicals.filter((c: any) =>
    ["Level-1", "Level-2", "Level-3"].includes(c.zdhcLevel || "")
  ).length;
  const screenChemicalCount = filteredChemicals.filter(
    (c: any) => c.screenChemical === "Yes" || c.zdhcLevel === "Level-3"
  ).length;
  const withoutCertCount = filteredChemicals.filter(
    (c: any) => !c.certificateName || c.certificateName === "-" || c.zdhcLevel === "None"
  ).length;

  const isAnyFilterActive =
    selectedMonth !== "ALL" ||
    selectedYear !== "ALL" ||
    selectedZdhcFilter !== "ALL" ||
    selectedHazardFilter !== "ALL" ||
    searchQuery.trim() !== "";

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
      customFields: Array.isArray(chem.customFields) ? chem.customFields : [],
    });
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.chemicalName.trim()) {
      toast.error("Chemical Name is required");
      return;
    }

    const payload = {
      ...formData,
      quantity: formData.quantityPurchased || formData.quantity || "0 Kg",
      useArea: formData.useArea || "General Floor",
      incheckStatus: "Submitted",
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
      refetchChemicals();
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
      refetchChemicals();
    } catch (err: any) {
      const errorMsg = err?.data?.message || "Failed to remove chemical";
      toast.error(errorMsg);
    } finally {
      setChemicalToDelete(null);
    }
  };

  const handleExportExcel = async () => {
    if (filteredChemicals.length === 0) {
      toast.error("No chemical records available to export for the selected filter.");
      return;
    }
    try {
      const selectedMonthLabel =
        selectedMonth !== "ALL" ? MONTH_OPTIONS.find((m) => m.value === selectedMonth)?.label : "";
      const dateText =
        [selectedMonthLabel, selectedYear !== "ALL" ? selectedYear : ""].filter(Boolean).join(" ") ||
        new Date().toLocaleDateString("en-GB");

      exportChemicalsToExcel({
        chemicals: filteredChemicals as ChemicalItem[],
        productionUnit: "MG Shirtex Limited",
        processName: "Cut to Pack",
        updatedOn: dateText,
      });
      toast.success("Chemical Inventory Sheet exported to Excel!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to export Excel document");
    }
  };

  return (
    <div className="space-y-6 pb-12 w-full min-w-0 flex-1">
      {/* 1. Header & Quick Filters */}
      <ChemicalsHeader
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        selectedZdhcFilter={selectedZdhcFilter}
        setSelectedZdhcFilter={setSelectedZdhcFilter}
        selectedHazardFilter={selectedHazardFilter}
        setSelectedHazardFilter={setSelectedHazardFilter}
        availableYears={availableYears}
        isAnyFilterActive={isAnyFilterActive}
        onResetFilters={handleResetFilters}
        onOpenCreate={handleOpenCreate}
        onExportExcel={handleExportExcel}
      />

      {/* 2. Top KPI Cards */}
      <ChemicalsKpis
        totalCount={totalChemicalCount}
        zdhcCount={zdhcLevel1PlusCount}
        screenCount={screenChemicalCount}
        withoutCertCount={withoutCertCount}
      />

      {/* 3. Main Chemical Substances Table */}
      <ChemicalsTable
        filteredChemicals={filteredChemicals}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isLoading={isLoading}
        onViewDetails={(chem) => setViewingChemical(chem)}
        onEdit={handleOpenEdit}
        onDelete={(id) => setChemicalToDelete(id)}
        onOpenCreate={handleOpenCreate}
      />

      {/* 4. Chemical Form Modal (Tabbed) */}
      <ChemicalFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        modalMode={modalMode}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        isSaving={isCreating || isUpdating}
      />

      {/* 5. View Details Dossier Modal */}
      <ChemicalDetailsModal
        viewingChemical={viewingChemical}
        onClose={() => setViewingChemical(null)}
      />

      {/* 6. Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(chemicalToDelete)}
        onClose={() => setChemicalToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Chemical Substance"
        message="Are you sure you want to delete this chemical from the inventory? This will permanently remove its safety, MSDS, and ZDHC audit records."
        confirmText="Delete Chemical"
        isDestructive={true}
      />
    </div>
  );
}
