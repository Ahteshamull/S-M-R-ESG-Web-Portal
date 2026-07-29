/**
 * GHG Protocol Standard Carbon Calculator Utility
 * 
 * This utility helps in calculating Metric Tons of CO2 equivalent (tCO2e)
 * for Scope 1, Scope 2, and Scope 3 emissions.
 */

// Standard Emission Factors (Can be fetched from Database in a real backend)
export const EMISSION_FACTORS = {
  // SCOPE 1: Direct Emissions
  SCOPE_1: {
    DIESEL_LITER: 0.00268,     // tCO2e per Liter of Diesel
    NATURAL_GAS_M3: 0.00202,   // tCO2e per cubic meter of Natural Gas
    PETROL_LITER: 0.00231,     // tCO2e per Liter of Petrol/Gasoline
    COAL_KG: 0.00242,          // tCO2e per kg of Coal
  },
  
  // SCOPE 2: Indirect Emissions (Purchased Energy)
  SCOPE_2: {
    GRID_ELECTRICITY_KWH: 0.0005, // tCO2e per kWh (Varies by country grid)
    PURCHASED_STEAM_KG: 0.00017,  // tCO2e per kg of steam
  },

  // SCOPE 3: Value Chain Emissions
  SCOPE_3: {
    BUSINESS_TRAVEL_AIR_KM: 0.00015, // tCO2e per km flown
    WASTE_LANDFILL_KG: 0.0005,       // tCO2e per kg of solid waste
    WATER_SUPPLY_M3: 0.00034,        // tCO2e per cubic meter of water
  }
};

/**
 * Calculates Scope 1 Emissions (Direct)
 * @param dieselLiters Amount of diesel used in liters (e.g., for generators)
 * @param gasM3 Amount of natural gas used in cubic meters (e.g., for boilers)
 * @returns Total Scope 1 tCO2e
 */
export function calculateScope1(dieselLiters: number = 0, gasM3: number = 0): number {
  const dieselEmissions = dieselLiters * EMISSION_FACTORS.SCOPE_1.DIESEL_LITER;
  const gasEmissions = gasM3 * EMISSION_FACTORS.SCOPE_1.NATURAL_GAS_M3;
  
  return Number((dieselEmissions + gasEmissions).toFixed(4));
}

/**
 * Calculates Scope 2 Emissions (Indirect)
 * @param electricityKwh Total Grid Electricity consumed in kWh
 * @returns Total Scope 2 tCO2e
 */
export function calculateScope2(electricityKwh: number = 0): number {
  const electricityEmissions = electricityKwh * EMISSION_FACTORS.SCOPE_2.GRID_ELECTRICITY_KWH;
  
  return Number(electricityEmissions.toFixed(4));
}

/**
 * Calculates Scope 3 Emissions (Value Chain - Example: Waste)
 * @param wasteKg Total solid waste sent to landfill in kg
 * @returns Total Scope 3 tCO2e
 */
export function calculateScope3(wasteKg: number = 0): number {
  const wasteEmissions = wasteKg * EMISSION_FACTORS.SCOPE_3.WASTE_LANDFILL_KG;
  
  return Number(wasteEmissions.toFixed(4));
}

/**
 * Calculates Total Carbon Footprint
 */
export function calculateTotalCarbonFootprint(
  dieselLiters: number,
  gasM3: number,
  electricityKwh: number,
  wasteKg: number
) {
  const scope1 = calculateScope1(dieselLiters, gasM3);
  const scope2 = calculateScope2(electricityKwh);
  const scope3 = calculateScope3(wasteKg);

  return {
    scope1,
    scope2,
    scope3,
    totalEmissions: Number((scope1 + scope2 + scope3).toFixed(4))
  };
}
