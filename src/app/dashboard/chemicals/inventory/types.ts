export interface CustomFieldItem {
  fieldName: string;
  fieldValue: string;
  fieldType: "text" | "number" | "date" | "boolean";
}

export interface ChemicalFormData {
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

export const initialFormState: ChemicalFormData = {
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
  customFields: [],
};

export type FormTab = "purchase" | "supplier" | "msds" | "zdhc" | "hazard" | "storage" | "custom";

export const MONTH_OPTIONS = [
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

export function parseChemicalDate(
  dateStr?: string,
  fallbackCreatedAt?: string
): { month: number; year: number } | null {
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
