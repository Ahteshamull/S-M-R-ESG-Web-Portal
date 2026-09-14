"use client";

import React from "react";
import { Modal } from "@/components/ui/modal";

interface WaterDetailsModalProps {
  detailsRecord: any | null;
  onClose: () => void;
}

export const WaterDetailsModal: React.FC<WaterDetailsModalProps> = ({
  detailsRecord,
  onClose,
}) => {
  if (!detailsRecord) return null;

  return (
    <Modal
      isOpen={Boolean(detailsRecord)}
      onClose={onClose}
      title={`Water Record Details — ${detailsRecord.month} ${detailsRecord.year || 2026}`}
    >
      <div className="space-y-4 text-xs font-medium">
        <div className="grid grid-cols-2 gap-3 p-4 bg-muted/30 rounded-2xl">
          <div>
            <span className="text-muted-foreground">Total Withdrawal:</span>
            <p className="text-base font-extrabold text-blue-600">
              {Number(detailsRecord.totalWithdrawal) || 0} m³
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">Water Intensity:</span>
            <p className="text-base font-extrabold text-teal-600">
              {detailsRecord.waterIntensity ?? 0} L/Kg
            </p>
          </div>
        </div>

        <div className="p-4 bg-background border border-border rounded-2xl space-y-2">
          <h5 className="font-bold text-foreground">Sourcing Breakdown:</h5>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <p>
              Groundwater:{" "}
              <span className="font-bold">
                {detailsRecord.sources?.groundwater ?? 0} m³
              </span>
            </p>
            <p>
              Municipal/WASA:{" "}
              <span className="font-bold">
                {detailsRecord.sources?.warpoDwasa ?? 0} m³
              </span>
            </p>
            <p>
              Rain Water:{" "}
              <span className="font-bold">
                {detailsRecord.sources?.rainWater ?? 0} m³
              </span>
            </p>
            <p>
              Recycle Water:{" "}
              <span className="font-bold">
                {detailsRecord.sources?.recycleWater ?? 0} m³
              </span>
            </p>
            <p>
              Surface Water:{" "}
              <span className="font-bold">
                {detailsRecord.sources?.surfaceWater ?? 0} m³
              </span>
            </p>
          </div>
        </div>

        <div className="p-4 bg-background border border-border rounded-2xl space-y-2">
          <h5 className="font-bold text-foreground">Department-Wise Consumption:</h5>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <p>
              Dyeing:{" "}
              <span className="font-bold">
                {detailsRecord.departments?.processDyeing ?? 0} m³
              </span>
            </p>
            <p>
              Washing:{" "}
              <span className="font-bold">
                {detailsRecord.departments?.processWashing ?? 0} m³
              </span>
            </p>
            <p>
              Printing:{" "}
              <span className="font-bold">
                {detailsRecord.departments?.processPrinting ?? 0} m³
              </span>
            </p>
            <p>
              Boiler Steam:{" "}
              <span className="font-bold">
                {detailsRecord.departments?.utilityBoilerSteam ?? 0} m³
              </span>
            </p>
            <p>
              Cooling:{" "}
              <span className="font-bold">
                {detailsRecord.departments?.utilityCooling ?? 0} m³
              </span>
            </p>
            <p>
              Finishing Boiler:{" "}
              <span className="font-bold text-purple-600">
                {detailsRecord.departments?.garmentsSteamBoiler ?? 0} m³
              </span>
            </p>
            <p>
              Drinking RO:{" "}
              <span className="font-bold text-blue-600">
                {detailsRecord.departments?.domesticDrinking ?? 0} m³
              </span>
            </p>
            <p>
              Washrooms:{" "}
              <span className="font-bold text-emerald-600">
                {detailsRecord.departments?.domesticWashrooms ?? 0} m³
              </span>
            </p>
            <p>
              Canteen:{" "}
              <span className="font-bold text-amber-600">
                {detailsRecord.departments?.domesticCanteen ?? 0} m³
              </span>
            </p>
          </div>
        </div>

        <div className="p-4 bg-background border border-border rounded-2xl space-y-2">
          <h5 className="font-bold text-foreground">Circularity Initiatives:</h5>
          <p>
            RO Recycle Reused:{" "}
            <span className="font-bold text-emerald-600">
              {detailsRecord.circularity?.roRecycledVolume ?? 0} m³/mo (passes back to dyeing)
            </span>
          </p>
          <p>
            Rainwater Harvested:{" "}
            <span className="font-bold text-cyan-600">
              {detailsRecord.circularity?.rainwaterHarvested ?? 0} m³/mo (toilet &amp; gardening)
            </span>
          </p>
          <p>
            Low Liquor Savings:{" "}
            <span className="font-bold text-blue-600">
              {detailsRecord.circularity?.lowLiquorSavings ?? 0} L/kg
            </span>
          </p>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-colors"
          >
            Close Details
          </button>
        </div>
      </div>
    </Modal>
  );
};
