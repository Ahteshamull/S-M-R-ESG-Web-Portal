"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Modal } from "@/components/ui/modal";
import { MONTHS, YEARS } from "../types";
import { useCreateWaterLogMutation } from "@/lib/redux/slices/waterApi";

interface WaterLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialYear: number;
  initialMonth: string;
  onSuccess: (savedYear: number, savedMonth: string) => void;
}

export const WaterLogModal: React.FC<WaterLogModalProps> = ({
  isOpen,
  onClose,
  initialYear,
  initialMonth,
  onSuccess,
}) => {
  const [createWaterLog, { isLoading: isCreating }] = useCreateWaterLogMutation();

  // Section 1: Period & Production Parameters
  const [formMonth, setFormMonth] = useState<string>("January");
  const [formYear, setFormYear] = useState<number>(2026);
  const [formGoodsType, setFormGoodsType] = useState<"denim" | "fabric_washing" | "garment">("denim");
  const [formProductionKg, setFormProductionKg] = useState<number | "">("");
  const [formLiquorRatio, setFormLiquorRatio] = useState<string>("1:7");

  // Section 3: Water Sourcing & Withdrawal Inputs (m³)
  const [formGroundwater, setFormGroundwater] = useState<number | "">("");
  const [formWarpoDwasa, setFormWarpoDwasa] = useState<number | "">("");
  const [formRainWater, setFormRainWater] = useState<number | "">("");
  const [formRecycleWater, setFormRecycleWater] = useState<number | "">("");
  const [formSurfaceWater, setFormSurfaceWater] = useState<number | "">("");

  // Section 4: Department-Wise Water Consumption Inputs (m³)
  const [formProcessDyeing, setFormProcessDyeing] = useState<number | "">("");
  const [formProcessWashing, setFormProcessWashing] = useState<number | "">("");
  const [formProcessPrinting, setFormProcessPrinting] = useState<number | "">("");
  const [formBoilerSteam, setFormBoilerSteam] = useState<number | "">("");
  const [formCooling, setFormCooling] = useState<number | "">("");
  const [formGarmentsSteamBoiler, setFormGarmentsSteamBoiler] = useState<number | "">("");
  const [formDomesticDrinking, setFormDomesticDrinking] = useState<number | "">("");
  const [formDomesticWashrooms, setFormDomesticWashrooms] = useState<number | "">("");
  const [formDomesticCanteen, setFormDomesticCanteen] = useState<number | "">("");

  // Section 5: Circularity & Savings Initiatives Inputs
  const [formRoRecycled, setFormRoRecycled] = useState<number | "">("");
  const [formRainHarvested, setFormRainHarvested] = useState<number | "">("");
  const [formLowLiquorSavings, setFormLowLiquorSavings] = useState<number | "">("");

  // Section 6: Regulatory Compliance Matrix Inputs
  const [formSubmeteringCoverage, setFormSubmeteringCoverage] = useState<number | "">("");
  const [formHiggScore, setFormHiggScore] = useState<number | "">("");
  const [formGroundwaterLicenseStatus, setFormGroundwaterLicenseStatus] = useState<"Active" | "Pending" | "Expired">("Active");

  // Section 7: ETP Water Mass Balance & Efficiency (m³)
  const [formInletWater, setFormInletWater] = useState<number | "">("");
  const [formOutletWater, setFormOutletWater] = useState<number | "">("");
  const [formProcessLossesY, setFormProcessLossesY] = useState<number | "">("");

  // Pre-fill on open with active filters
  useEffect(() => {
    if (isOpen) {
      if (initialYear && YEARS.includes(initialYear)) setFormYear(initialYear);
      if (initialMonth && MONTHS.includes(initialMonth)) setFormMonth(initialMonth);
    }
  }, [isOpen, initialYear, initialMonth]);

  const handleSaveWaterLog = async (e: React.FormEvent) => {
    e.preventDefault();

    const gw = Number(formGroundwater) || 0;
    const warpo = Number(formWarpoDwasa) || 0;
    const rain = Number(formRainWater) || 0;
    const recycle = Number(formRecycleWater) || 0;
    const surface = Number(formSurfaceWater) || 0;
    const totalWith = gw + warpo + rain + recycle + surface;

    const dyeing = Number(formProcessDyeing) || 0;
    const washing = Number(formProcessWashing) || 0;
    const printing = Number(formProcessPrinting) || 0;
    const boiler = Number(formBoilerSteam) || 0;
    const cooling = Number(formCooling) || 0;
    const garmentsSteam = Number(formGarmentsSteamBoiler) || 0;
    const drinking = Number(formDomesticDrinking) || 0;
    const washrooms = Number(formDomesticWashrooms) || 0;
    const canteen = Number(formDomesticCanteen) || 0;

    const totalProd = dyeing + washing + printing + boiler + cooling + garmentsSteam;
    const totalDomestic = drinking + washrooms + canteen;

    const prodKg = Number(formProductionKg) || 0;
    const calculatedIntensity = prodKg > 0 ? Number(((totalWith * 1000) / prodKg).toFixed(2)) : 0;
    const calculatedGwRatio = totalWith > 0 ? Number(((gw / totalWith) * 100).toFixed(2)) : 0;
    const calculatedAltRatio = totalWith > 0 ? Number((((rain + recycle) / totalWith) * 100).toFixed(2)) : 0;
    const inletW = Number(formInletWater) || 0;
    const outletW = Number(formOutletWater) || 0;
    const calculatedLosses = formProcessLossesY !== "" ? Number(formProcessLossesY) : Math.max(0, Number((totalWith - inletW).toFixed(2)));

    const payload = {
      month: formMonth,
      year: Number(formYear),
      totalWithdrawal: totalWith,
      totalProduction: totalProd,
      domestic: totalDomestic,
      inletWater: inletW,
      outletWater: outletW,
      processLossesY: calculatedLosses,
      productionKg: prodKg,
      goodsType: formGoodsType,
      liquorRatio: formLiquorRatio,
      waterIntensity: calculatedIntensity,
      groundwaterRatio: calculatedGwRatio,
      alternativeRatio: calculatedAltRatio,
      sources: {
        groundwater: gw,
        warpoDwasa: warpo,
        rainWater: rain,
        recycleWater: recycle,
        surfaceWater: surface,
      },
      departments: {
        processDyeing: dyeing,
        processWashing: washing,
        processPrinting: printing,
        utilityBoilerSteam: boiler,
        utilityCooling: cooling,
        garmentsSteamBoiler: garmentsSteam,
        domesticDrinking: drinking,
        domesticWashrooms: washrooms,
        domesticCanteen: canteen,
        domesticToiletCanteen: washrooms + canteen,
        domesticDiningDrinking: drinking,
      },
      circularity: {
        roRecycledVolume: Number(formRoRecycled) || 0,
        rainwaterHarvested: Number(formRainHarvested) || 0,
        lowLiquorSavings: Number(formLowLiquorSavings) || 0,
        lowLiquorReductionPercent: Number(formLowLiquorSavings) ? 18 : 0,
      },
      regulatory: {
        groundwaterLicenseStatus: formGroundwaterLicenseStatus,
        digitalSubmeteringCoverage: Number(formSubmeteringCoverage) || 0,
        higgFemScore: Number(formHiggScore) || 0,
        isDataLoggedVerified: true,
      },
      flowmeters: [
        { meterName: "Flowmeter 01 - Deep Tubewell", previous: 0, present: gw, difference: gw },
        { meterName: "Flowmeter 02 - Process Inlet", previous: 0, present: totalProd, difference: totalProd },
        { meterName: "Flowmeter 03 - RO Recovery Line", previous: 0, present: recycle, difference: recycle },
      ],
      withdrawals: [{ previous: 0, present: totalWith, difference: totalWith }],
      boilers: [{ previous: 0, present: boiler, difference: boiler }]
    };

    const res = await createWaterLog(payload);
    if (!res.error) {
      toast.success(`Water log for ${formMonth} ${formYear} recorded successfully!`);
      onSuccess(Number(formYear), formMonth);
      onClose();
    } else {
      const err = (res.error as any)?.data?.message || "Failed to log water consumption";
      toast.error(err);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Log Water Consumption — Portal" maxWidthClass="max-w-5xl">
      <form onSubmit={handleSaveWaterLog} className="space-y-6 max-h-[78vh] overflow-y-auto pr-2">
        {/* Section 1: Period & Production Parameters */}
        <div className="bg-muted/30 p-5 rounded-2xl border border-border/60 space-y-4">
          <div className="flex items-center justify-between border-b border-border/40 pb-2.5">
            <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px] font-black">1</span>
              Period &amp; Production Parameters
            </h4>
            <span className="text-[11px] font-semibold text-muted-foreground">General Production Info</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div>
              <label className="text-[11px] font-bold text-foreground block mb-1">Select Month</label>
              <select
                value={formMonth}
                onChange={(e) => setFormMonth(e.target.value)}
                className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-teal-500/50"
                style={{ colorScheme: "dark" }}
              >
                {MONTHS.map(m => <option key={m} value={m} className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">{m}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-bold text-foreground block mb-1">Select Year</label>
              <select
                value={formYear}
                onChange={(e) => setFormYear(Number(e.target.value))}
                className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-teal-500/50"
                style={{ colorScheme: "dark" }}
              >
                {YEARS.map(y => <option key={y} value={y} className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">{y}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-bold text-foreground block mb-1">Goods Type</label>
              <select
                value={formGoodsType}
                onChange={(e) => setFormGoodsType(e.target.value as any)}
                className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-teal-500/50"
                style={{ colorScheme: "dark" }}
              >
                <option value="denim" className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">Denim (Target: &le; 35 L/kg)</option>
                <option value="fabric_washing" className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">Fabric Washing (&le; 41 L/kg)</option>
                <option value="garment" className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">Garment (&le; 46 L/kg)</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-bold text-foreground block mb-1">Production (Kg)</label>
              <input
                type="number"
                min="0"
                placeholder="e.g. 50000"
                value={formProductionKg}
                onChange={(e) => setFormProductionKg(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-bold"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-foreground block mb-1">Liquor Ratio</label>
              <input
                type="text"
                placeholder="e.g. 1:7"
                value={formLiquorRatio}
                onChange={(e) => setFormLiquorRatio(e.target.value)}
                className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-bold"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Water Sourcing & Withdrawal Inputs */}
        <div className="bg-blue-500/5 p-5 rounded-2xl border border-blue-500/20 space-y-4">
          <div className="flex items-center justify-between border-b border-blue-500/20 pb-2.5">
            <h4 className="font-bold text-sm text-blue-800 dark:text-blue-300 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-black">3</span>
              Water Sourcing &amp; Withdrawal Inputs (m³)
            </h4>
            <div className="text-xs font-bold bg-blue-500/10 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-lg">
              Total: {(Number(formGroundwater) || 0) + (Number(formWarpoDwasa) || 0) + (Number(formRainWater) || 0) + (Number(formRecycleWater) || 0) + (Number(formSurfaceWater) || 0)} m³
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div>
              <label className="text-[11px] font-bold text-muted-foreground block mb-1">Groundwater (m³)</label>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={formGroundwater}
                onChange={(e) => setFormGroundwater(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-bold"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-muted-foreground block mb-1">WARPO / DWASA (m³)</label>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={formWarpoDwasa}
                onChange={(e) => setFormWarpoDwasa(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-bold"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-muted-foreground block mb-1">Rain Water (m³)</label>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={formRainWater}
                onChange={(e) => setFormRainWater(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-bold"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-muted-foreground block mb-1">Recycle Water (m³)</label>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={formRecycleWater}
                onChange={(e) => setFormRecycleWater(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-bold"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-muted-foreground block mb-1">Surface Water (m³)</label>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={formSurfaceWater}
                onChange={(e) => setFormSurfaceWater(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-bold"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Department-Wise Water Consumption Inputs */}
        <div className="bg-teal-500/5 p-5 rounded-2xl border border-teal-500/20 space-y-4">
          <div className="flex items-center justify-between border-b border-teal-500/20 pb-2.5">
            <h4 className="font-bold text-sm text-teal-800 dark:text-teal-300 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px] font-black">4</span>
              Facility-Wise Water Consumption (m³)
            </h4>
            <span className="text-[11px] font-semibold text-muted-foreground">Detailed In-Plant Sub-metering</span>
          </div>

          {/* Sub-processes: Processing & Utility */}
          <div className="space-y-3">
            <span className="text-xs font-black text-foreground uppercase tracking-wide block">
              4.1 Washing Plants
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div>
                <label className="text-[11px] font-bold text-muted-foreground block mb-1">Dyeing Process (m³)</label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formProcessDyeing}
                  onChange={(e) => setFormProcessDyeing(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-muted-foreground block mb-1">Washing Process (m³)</label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formProcessWashing}
                  onChange={(e) => setFormProcessWashing(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-muted-foreground block mb-1">Printing Process (m³)</label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formProcessPrinting}
                  onChange={(e) => setFormProcessPrinting(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-muted-foreground block mb-1">Boiler Steam (m³)</label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formBoilerSteam}
                  onChange={(e) => setFormBoilerSteam(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-muted-foreground block mb-1">Cooling Purpose (m³)</label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formCooling}
                  onChange={(e) => setFormCooling(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-bold"
                />
              </div>
            </div>
          </div>

          {/* Sub-processes: Garments (Cut to Pack) Breakdown */}
          <div className="space-y-3 pt-2 border-t border-teal-500/10">
            <span className="text-xs font-black text-purple-700 dark:text-purple-300 uppercase tracking-wide block">
              4.2 Garments (Cut to Pack): Production, Finishing &amp; Domestic Sanitation
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-purple-500/5 p-3.5 rounded-xl border border-purple-500/20">
              <div>
                <label className="text-[11px] font-bold text-purple-800 dark:text-purple-300 block mb-1">
                  Finishing Steam Boiler (m³)
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formGarmentsSteamBoiler}
                  onChange={(e) => setFormGarmentsSteamBoiler(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-blue-800 dark:text-blue-300 block mb-1">
                  Workers' Drinking RO (m³)
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formDomesticDrinking}
                  onChange={(e) => setFormDomesticDrinking(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 block mb-1">
                  Washroom Sanitation (m³)
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formDomesticWashrooms}
                  onChange={(e) => setFormDomesticWashrooms(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-amber-800 dark:text-amber-300 block mb-1">
                  Canteen Services (m³)
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formDomesticCanteen}
                  onChange={(e) => setFormDomesticCanteen(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-bold"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 5: Circularity & Water Savings Initiatives Inputs */}
        <div className="bg-emerald-500/5 p-5 rounded-2xl border border-emerald-500/20 space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2.5">
            <h4 className="font-bold text-sm text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-black">5</span>
              Circularity &amp; Savings Initiatives
            </h4>
            <span className="text-[11px] font-semibold text-muted-foreground">Recycling &amp; Conservation</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-bold text-muted-foreground block mb-1">RO Recycling (m³/mo to Dyeing)</label>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={formRoRecycled}
                onChange={(e) => setFormRoRecycled(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-bold"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-muted-foreground block mb-1">Rainwater Harvested (m³/mo)</label>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={formRainHarvested}
                onChange={(e) => setFormRainHarvested(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-bold"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-muted-foreground block mb-1">Low Liquor Savings (L/Kg saved)</label>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={formLowLiquorSavings}
                onChange={(e) => setFormLowLiquorSavings(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-bold"
              />
            </div>
          </div>
        </div>

        {/* Section 6 & 7: Regulatory Compliance & ETP Mass Balance */}
        <div className="bg-muted/20 p-5 rounded-2xl border border-border/60 space-y-4">
          <div className="flex items-center justify-between border-b border-border/40 pb-2.5">
            <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-700 text-white flex items-center justify-center text-[10px] font-black">6 &amp; 7</span>
              Regulatory Compliance &amp; ETP Water Balance
            </h4>
            <span className="text-[11px] font-semibold text-muted-foreground">Governance &amp; Wastewater</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div>
              <label className="text-[11px] font-bold text-muted-foreground block mb-1">Sub-metering (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                placeholder="0"
                value={formSubmeteringCoverage}
                onChange={(e) => setFormSubmeteringCoverage(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-bold"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-muted-foreground block mb-1">Higg FEM Score</label>
              <input
                type="number"
                min="0"
                max="100"
                placeholder="0"
                value={formHiggScore}
                onChange={(e) => setFormHiggScore(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-bold"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-muted-foreground block mb-1">GW License Status</label>
              <select
                value={formGroundwaterLicenseStatus}
                onChange={(e) => setFormGroundwaterLicenseStatus(e.target.value as any)}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-teal-500/50"
                style={{ colorScheme: "dark" }}
              >
                <option value="Active" className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">Active</option>
                <option value="Pending" className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">Pending</option>
                <option value="Expired" className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">Expired</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-bold text-muted-foreground block mb-1">ETP Inlet (m³)</label>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={formInletWater}
                onChange={(e) => setFormInletWater(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-bold"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-muted-foreground block mb-1">ETP Outlet (m³)</label>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={formOutletWater}
                onChange={(e) => setFormOutletWater(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-bold"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-muted-foreground block mb-1">Losses Y (m³)</label>
              <input
                type="number"
                min="0"
                placeholder="Auto"
                value={formProcessLossesY}
                onChange={(e) => setFormProcessLossesY(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-bold"
              />
            </div>
          </div>
        </div>

        <div className="pt-3 flex justify-end gap-3 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-muted hover:bg-muted/80 text-foreground rounded-xl text-xs font-bold"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isCreating}
            className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-teal-500/20 active:scale-95 disabled:opacity-50"
          >
            {isCreating ? "Saving..." : "Save Water Log"}
          </button>
        </div>
      </form>
    </Modal>
  );
};
