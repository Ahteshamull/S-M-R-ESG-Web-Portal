import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { IChemicalItem } from './redux/slices/chemicalsApi';

export type ChemicalItem = IChemicalItem;

export interface ChemicalExportOptions {
  chemicals: ChemicalItem[];
  productionUnit?: string;
  processName?: string;
  updatedOn?: string;
  updatedBy?: string;
}

export async function exportChemicalsToExcel(options: ChemicalExportOptions) {
  const {
    chemicals,
    productionUnit = 'MG Shirtex Limited',
    processName = 'Cut to Pack',
    updatedOn = new Date().toLocaleDateString('en-GB'),
    updatedBy = 'Khan Shehabuddin (Jr. Executive, MAC)',
  } = options;

  const totalChemicals = chemicals.length;
  const screenChemicals = chemicals.filter(c => c.screenChemical === 'Yes').length;
  const zdhcAboveLevel1 = chemicals.filter(c => ['Level-1', 'Level-2', 'Level-3'].includes(c.zdhcLevel || '')).length;
  const withoutCert = chemicals.filter(c => !c.certificateName || c.certificateName === '-' || c.zdhcLevel === 'None').length;

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Chemical Inventory');

  // Title Row
  sheet.mergeCells('A2:AF3');
  const titleCell = sheet.getCell('A2');
  titleCell.value = 'Chemical Inventory List';
  titleCell.font = { name: 'Calibri', size: 18, bold: true };
  titleCell.alignment = { vertical: 'middle', horizontal: 'center' };

  // Summary Information Block (Left)
  sheet.getCell('A5').value = 'Name of Production Unit:';
  sheet.getCell('B5').value = productionUnit;
  sheet.getCell('A5').font = { bold: true, size: 10 };
  sheet.getCell('B5').font = { bold: true, size: 10 };

  sheet.getCell('A6').value = 'Name of Process:';
  sheet.getCell('B6').value = processName;
  sheet.getCell('A6').font = { bold: true, size: 10 };

  sheet.getCell('A7').value = 'Updated on:';
  sheet.getCell('B7').value = updatedOn;
  sheet.getCell('A7').font = { size: 9 };

  sheet.getCell('A8').value = 'Updated by:';
  sheet.getCell('B8').value = updatedBy;
  sheet.getCell('A8').font = { size: 9 };

  // Summary Metrics Block (Right)
  sheet.getCell('H5').value = 'No. of Total Chemical';
  sheet.getCell('I5').value = totalChemicals;
  sheet.getCell('H5').font = { bold: true, size: 9 };
  sheet.getCell('I5').font = { bold: true, size: 10 };
  sheet.getCell('I5').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF00' } }; // Yellow highlight
  sheet.getCell('I5').alignment = { horizontal: 'center' };

  sheet.getCell('H6').value = 'No. of Screen Chemical';
  sheet.getCell('I6').value = screenChemicals;
  sheet.getCell('H6').font = { size: 9 };
  sheet.getCell('I6').alignment = { horizontal: 'center' };

  sheet.getCell('H7').value = 'No. of ZDHC Level-1 or Above Chemical';
  sheet.getCell('I7').value = zdhcAboveLevel1;
  sheet.getCell('H7').font = { size: 9 };
  sheet.getCell('I7').alignment = { horizontal: 'center' };

  sheet.getCell('H8').value = 'No of chemical without any certification';
  sheet.getCell('I8').value = withoutCert;
  sheet.getCell('H8').font = { size: 9 };
  sheet.getCell('I8').alignment = { horizontal: 'center' };

  // Borders for Summary Blocks
  ['A5:D5', 'A6:D6', 'A7:D7', 'A8:D8', 'H5:I5', 'H6:I6', 'H7:I7', 'H8:I8'].forEach(range => {
    const [start, end] = range.split(':');
    const startRow = parseInt(start.substring(1));
    const startCol = start.charCodeAt(0) - 64;
    const endCol = end.charCodeAt(0) - 64;
    for (let c = startCol; c <= endCol; c++) {
      const cell = sheet.getRow(startRow).getCell(c);
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    }
  });

  // Table Headers (Row 11 & 12)
  const headers = [
    { col: 1, label: 'S.L NO', width: 8 },
    { col: 2, label: 'Chemical Name / Tradename / Commercial Name', width: 24 },
    { col: 3, label: 'Date of Purchase', width: 14, group: 'Purchase information' },
    { col: 4, label: 'Expiry Date', width: 14, group: 'Purchase information' },
    { col: 5, label: 'Batch number / Lot No.', width: 16, group: 'Purchase information' },
    { col: 6, label: 'Quantity of chemical purchased (Kg or Litre)', width: 18, group: 'Purchase information' },
    { col: 7, label: 'Original MSDS', width: 12, group: 'Material safety data' },
    { col: 8, label: 'Simplified / Abstracted MSDS', width: 14, group: 'Material safety data' },
    { col: 9, label: 'Original label of chemical received from Supplier available', width: 18 },
    { col: 10, label: 'Name of Chemical Supplier', width: 18 },
    { col: 11, label: 'Name of Chemical Manufacturer', width: 26 },
    { col: 12, label: 'Active Ingredients with Concentration of substances (i.e. w/w %) given in MSDS', width: 28 },
    { col: 13, label: 'CAS No. / EINECS No. of Ingredients', width: 22 },
    { col: 14, label: 'MRSL & RSL Compliance documented by Compliance statement (Y/N) ?', width: 18 },
    { col: 15, label: 'ZDHC MRSL Compliance Level', width: 16 },
    { col: 16, label: 'Name of the Certificate', width: 18 },
    { col: 17, label: 'Health Hazard', width: 12, group: 'Hazard classification' },
    { col: 18, label: 'If Yes, please mention specific hazard type', width: 22, group: 'Hazard classification' },
    { col: 19, label: 'Physical Hazard', width: 12, group: 'Hazard classification' },
    { col: 20, label: 'If Yes, please mention specific hazard type', width: 24, group: 'Hazard classification' },
    { col: 21, label: 'Environmental Hazard', width: 14, group: 'Hazard classification' },
    { col: 22, label: 'If Yes, please mention specific hazard type', width: 24, group: 'Hazard classification' },
    { col: 23, label: 'Function of chemical', width: 16 },
    { col: 24, label: 'Area of Use', width: 18 },
    { col: 25, label: 'Personal Protective Equipment (PPE) recommended in the MSDS', width: 24 },
    { col: 26, label: 'Storage Condition recommended in MSDS', width: 24 },
    { col: 27, label: 'Amount used/consumed in a month (kg/month)', width: 18 },
    { col: 28, label: 'Location of Storage', width: 16 },
    { col: 29, label: 'Emergency Contact Person (name, Designation & Contact No.)', width: 26 },
    { col: 30, label: 'Checked by (Name & Designation)', width: 22 },
    { col: 31, label: 'Checked on (date - format DD/MM/YYYY)', width: 16 },
    { col: 32, label: 'Remarks', width: 16 },
  ];

  // Set Column Widths
  headers.forEach((h) => {
    sheet.getColumn(h.col).width = h.width;
  });

  // Group Headers
  sheet.mergeCells('C11:F11');
  const purHeader = sheet.getCell('C11');
  purHeader.value = 'Purchase information';
  purHeader.alignment = { horizontal: 'center', vertical: 'middle' };
  purHeader.font = { bold: true, size: 9 };

  sheet.mergeCells('G11:H11');
  const msdsHeader = sheet.getCell('G11');
  msdsHeader.value = 'Material safety data';
  msdsHeader.alignment = { horizontal: 'center', vertical: 'middle' };
  msdsHeader.font = { bold: true, size: 9 };

  sheet.mergeCells('Q11:V11');
  const hazHeader = sheet.getCell('Q11');
  hazHeader.value = 'Hazard classification';
  hazHeader.alignment = { horizontal: 'center', vertical: 'middle' };
  hazHeader.font = { bold: true, size: 9 };

  // Set Subheaders / Individual Column Headers
  headers.forEach((h) => {
    const cell = sheet.getRow(12).getCell(h.col);
    cell.value = h.label;
    cell.font = { name: 'Calibri', size: 9, bold: true };
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFF2F2F2' },
    };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
  });

  sheet.getRow(11).height = 24;
  sheet.getRow(12).height = 48;

  // Populate Data Rows
  chemicals.forEach((chem, idx) => {
    const rowIdx = 13 + idx;
    const row = sheet.getRow(rowIdx);
    row.height = 36;

    row.getCell(1).value = idx + 1;
    row.getCell(2).value = chem.chemicalName || '';
    row.getCell(3).value = chem.dateOfPurchase || chem.date || '';
    row.getCell(4).value = chem.expiryDate || '';
    row.getCell(5).value = chem.batchNo || '';
    row.getCell(6).value = chem.quantityPurchased || chem.quantity || '';
    row.getCell(7).value = chem.originalMsds || 'Y';
    row.getCell(8).value = chem.simplifiedMsds || 'Y';
    row.getCell(9).value = chem.labelAvailable || 'Y';
    row.getCell(10).value = chem.supplierName || '';
    row.getCell(11).value = chem.manufacturerName || '';
    row.getCell(12).value = chem.activeIngredients || '';
    row.getCell(13).value = chem.casNo || '';
    row.getCell(14).value = chem.mrslRslCompliance || 'Y';
    row.getCell(15).value = chem.zdhcLevel || 'None';
    row.getCell(16).value = chem.certificateName || '';
    row.getCell(17).value = chem.healthHazard || 'No';
    row.getCell(18).value = chem.healthHazardType || '';
    row.getCell(19).value = chem.physicalHazard || 'No';
    row.getCell(20).value = chem.physicalHazardType || '';
    row.getCell(21).value = chem.environmentalHazard || 'No';
    row.getCell(22).value = chem.environmentalHazardType || '';
    row.getCell(23).value = String(chem.functionOfChemical || chem.chemicalType || '');
    row.getCell(24).value = String(chem.areaOfUse || chem.useArea || '');
    row.getCell(25).value = chem.ppeRecommended || '';
    row.getCell(26).value = chem.storageCondition || '';
    row.getCell(27).value = chem.monthlyConsumption || '';
    row.getCell(28).value = chem.storageLocation || '';
    row.getCell(29).value = chem.emergencyContact || '';
    row.getCell(30).value = chem.checkedBy || '';
    row.getCell(31).value = chem.checkedOn || '';
    row.getCell(32).value = chem.remarks || '';

    // Apply Borders and Alignments to row cells
    for (let c = 1; c <= 32; c++) {
      const cell = row.getCell(c);
      cell.font = { name: 'Calibri', size: 9 };
      cell.alignment = {
        vertical: 'middle',
        horizontal: [1, 7, 8, 9, 14, 15, 17, 19, 21].includes(c) ? 'center' : 'left',
        wrapText: true,
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    }
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `Chemical_Inventory_List_${new Date().toISOString().slice(0, 10)}.xlsx`);
}
