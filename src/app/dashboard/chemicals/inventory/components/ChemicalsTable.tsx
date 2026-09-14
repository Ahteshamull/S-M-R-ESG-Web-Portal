"use client";

import React from "react";
import {
  Search,
  Eye,
  Pencil,
  Trash2,
  FlaskConical,
  Flame,
  HeartPulse,
  AlertTriangle,
  Plus,
  Loader2,
} from "lucide-react";

interface ChemicalsTableProps {
  filteredChemicals: any[];
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  isLoading: boolean;
  onViewDetails: (chem: any) => void;
  onEdit: (chem: any) => void;
  onDelete: (id: string) => void;
  onOpenCreate: () => void;
}

export const ChemicalsTable: React.FC<ChemicalsTableProps> = ({
  filteredChemicals,
  searchQuery,
  setSearchQuery,
  isLoading,
  onViewDetails,
  onEdit,
  onDelete,
  onOpenCreate,
}) => {
  return (
    <div className="bg-card/60 backdrop-blur-xl border border-border/70 rounded-2xl shadow-sm overflow-hidden flex flex-col">
      {/* Search Header */}
      <div className="p-4 sm:p-5 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-muted/20">
        <div className="flex items-center gap-2">
          <FlaskConical className="w-5 h-5 text-teal-600" />
          <h3 className="font-bold text-sm sm:text-base text-foreground">
            Registered Chemical Substances ({filteredChemicals.length})
          </h3>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search chemical, CAS, supplier..."
            className="pl-9 pr-3.5 py-2 bg-background border border-border rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 w-full sm:w-64"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="p-16 text-center text-muted-foreground flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-teal-600" />
            Loading chemicals inventory...
          </div>
        ) : filteredChemicals.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground space-y-3">
            <FlaskConical className="w-10 h-10 mx-auto text-muted-foreground/30" />
            <p className="text-sm font-semibold text-foreground">No chemical records found</p>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              No chemicals match the selected month, year, or search criteria. Click &ldquo;Log Chemical&rdquo; to add a new entry.
            </p>
            <button
              onClick={onOpenCreate}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold hover:bg-teal-700 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add First Chemical
            </button>
          </div>
        ) : (
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead className="bg-muted/40 text-muted-foreground font-semibold">
              <tr>
                <th className="p-3.5 border-b border-border">Chemical &amp; CAS</th>
                <th className="p-3.5 border-b border-border">Function / Area</th>
                <th className="p-3.5 border-b border-border">Purchase &amp; Expiry</th>
                <th className="p-3.5 border-b border-border">ZDHC Level</th>
                <th className="p-3.5 border-b border-border">GHS Hazards</th>
                <th className="p-3.5 border-b border-border">Supplier</th>
                <th className="p-3.5 border-b border-border">Stock / Location</th>
                <th className="p-3.5 border-b border-border text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 font-medium">
              {filteredChemicals.map((chem: any) => {
                const isHealth = chem.healthHazard === "Yes";
                const isPhysical = chem.physicalHazard === "Yes";
                const isEnv = chem.environmentalHazard === "Yes";
                const hasAnyHazard = isHealth || isPhysical || isEnv;

                return (
                  <tr key={chem._id} className="hover:bg-muted/30 transition-colors">
                    {/* Name & CAS */}
                    <td className="p-3.5">
                      <div className="font-bold text-foreground hover:text-teal-600 transition-colors cursor-pointer" onClick={() => onViewDetails(chem)}>
                        {chem.chemicalName}
                      </div>
                      <div className="text-[11px] font-mono text-muted-foreground mt-0.5">
                        CAS: {chem.casNo || "N/A"}
                      </div>
                    </td>

                    {/* Function / Area */}
                    <td className="p-3.5">
                      <div className="font-semibold text-foreground">{chem.functionOfChemical || chem.chemicalType || "—"}</div>
                      <div className="text-[11px] text-muted-foreground">{chem.useArea || chem.processName || "Factory Floor"}</div>
                    </td>

                    {/* Purchase & Expiry */}
                    <td className="p-3.5">
                      <div className="text-xs font-semibold text-foreground">
                        {chem.dateOfPurchase || chem.date || "—"}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        Exp: {chem.expiryDate || "N/A"}
                      </div>
                    </td>

                    {/* ZDHC Level */}
                    <td className="p-3.5">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                          chem.zdhcLevel === "Level-3"
                            ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30"
                            : chem.zdhcLevel === "Level-2"
                            ? "bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30"
                            : chem.zdhcLevel === "Level-1"
                            ? "bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30"
                            : "bg-muted text-muted-foreground border border-border"
                        }`}
                      >
                        {chem.zdhcLevel || "None"}
                      </span>
                    </td>

                    {/* Hazards */}
                    <td className="p-3.5">
                      {hasAnyHazard ? (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {isHealth && (
                            <span className="p-1 bg-rose-500/10 text-rose-600 rounded-md" title={`Health: ${chem.healthHazardType || 'Hazardous'}`}>
                              <HeartPulse className="w-3.5 h-3.5" />
                            </span>
                          )}
                          {isPhysical && (
                            <span className="p-1 bg-amber-500/10 text-amber-600 rounded-md" title={`Physical: ${chem.physicalHazardType || 'Flammable/Reactive'}`}>
                              <Flame className="w-3.5 h-3.5" />
                            </span>
                          )}
                          {isEnv && (
                            <span className="p-1 bg-purple-500/10 text-purple-600 rounded-md" title={`Environmental: ${chem.environmentalHazardType || 'Toxic to Aquatic'}`}>
                              <AlertTriangle className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-[11px] text-emerald-600 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md">
                          Safe / Zero
                        </span>
                      )}
                    </td>

                    {/* Supplier */}
                    <td className="p-3.5">
                      <div className="font-semibold text-foreground truncate max-w-[140px]">{chem.supplierName || "—"}</div>
                      <div className="text-[11px] text-muted-foreground truncate max-w-[140px]">{chem.manufacturerName || ""}</div>
                    </td>

                    {/* Stock & Location */}
                    <td className="p-3.5">
                      <div className="font-bold text-foreground">{chem.quantityPurchased || chem.quantity || "0"}</div>
                      <div className="text-[11px] text-muted-foreground truncate max-w-[120px]">{chem.storageLocation || "Central Store"}</div>
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onViewDetails(chem)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onEdit(chem)}
                          className="p-1.5 text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-950/40 rounded-lg transition-colors"
                          title="Edit Record"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(chem._id)}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
