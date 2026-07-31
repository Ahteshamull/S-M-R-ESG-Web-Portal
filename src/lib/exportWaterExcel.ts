import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export interface WaterExcelData {
  waterLogs: any[];
  valX: number;
  valY: number;
  valBoiler: number;
  valZ: number;
  waterBalanceValue: number;
  marginOfError: number;
  percentClosureResult: number;
}

export async function exportWaterBalanceToExcel(data: WaterExcelData) {
  const { waterLogs, valX, valY, valBoiler, valZ, waterBalanceValue, marginOfError, percentClosureResult } = data;

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Water Balance Calculation');

  // Columns Width
  sheet.columns = [
    { width: 15 }, // A
    { width: 15 }, // B
    { width: 15 }, // C
    { width: 25 }, // D
    { width: 35 }, // E
    { width: 18 }, // F
    { width: 25 }, // G
    { width: 30 }, // H
    { width: 15 }, // I
    { width: 20 }, // J
    { width: 20 }  // K
  ];

  // Header rows
  const cellA1 = sheet.getCell('A1');
  cellA1.value = 'MG';
  cellA1.font = { bold: true, size: 14 };
  
  const cellC1 = sheet.getCell('C1');
  cellC1.value = 'MG Shirtex Limited';
  cellC1.font = { bold: true, size: 14 };
  sheet.mergeCells('C1:D1');

  sheet.mergeCells('C2:E2');
  sheet.getCell('C2').value = '32, Laxmipura, Chandana, Joydebpur, Gazipur';
  
  sheet.mergeCells('C3:F3');
  const cellC3 = sheet.getCell('C3');
  cellC3.value = 'Water Balance Calculation-2024';
  cellC3.font = { bold: true, size: 12 };

  // Table Headers (Row 5)
  const headers = [
    "Type Of Water", "Month", "Value in (m3)", "Input Supply (Y)", 
    "Evaporation, Absob, Irrigation, Leaks", "Boiler Water (m3)", 
    "Input Supply (Z)", "Domestic Waste Water Discharge", "Remarks",
    "ETP Inlet Water (m3)", "ETP Outlet Water (m3)"
  ];
  
  const headerRow = sheet.getRow(5);
  headerRow.values = headers;
  headerRow.font = { bold: true };
  headerRow.height = 40;
  headerRow.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
  
  for(let i=1; i<=11; i++) {
    const cell = headerRow.getCell(i);
    cell.border = {
      top: { style: 'thin' }, left: { style: 'thin' },
      bottom: { style: 'thin' }, right: { style: 'thin' }
    };
  }

  // Data
  let currentRowIndex = 6;
  const startDataRow = 6;
  
  waterLogs.forEach((log) => {
    const row = sheet.getRow(currentRowIndex);
    row.getCell(2).value = log.month;
    row.getCell(3).value = log.totalWithdrawal;
    row.getCell(6).value = log.totalProduction;
    row.getCell(10).value = log.inletWater;
    row.getCell(11).value = log.outletWater;
    
    for(let i=1; i<=11; i++) {
       const cell = row.getCell(i);
       cell.border = {
         top: { style: 'thin' }, left: { style: 'thin' },
         bottom: { style: 'thin' }, right: { style: 'thin' }
       };
       cell.alignment = { vertical: 'middle', horizontal: 'center' };
    }
    currentRowIndex++;
  });
  
  const endDataRow = currentRowIndex > startDataRow ? currentRowIndex - 1 : startDataRow;

  if (waterLogs.length > 0) {
    sheet.mergeCells(`A${startDataRow}:A${endDataRow}`);
    const typeCell = sheet.getCell(`A${startDataRow}`);
    typeCell.value = 'Municipal W';
    typeCell.alignment = { textRotation: 90, vertical: 'middle', horizontal: 'center', wrapText: true };
    typeCell.font = { bold: true };

    sheet.mergeCells(`D${startDataRow}:D${endDataRow}`);
    const yCell = sheet.getCell(`D${startDataRow}`);
    yCell.value = 'Water Process Losses';
    yCell.alignment = { textRotation: 90, vertical: 'middle', horizontal: 'center', wrapText: true };
    yCell.font = { bold: true };

    sheet.mergeCells(`E${startDataRow}:E${endDataRow}`);
    const evalCell = sheet.getCell(`E${startDataRow}`);
    evalCell.value = valY;
    evalCell.alignment = { vertical: 'middle', horizontal: 'center' };

    sheet.mergeCells(`G${startDataRow}:G${endDataRow}`);
    const zCell = sheet.getCell(`G${startDataRow}`);
    zCell.value = 'Another Purpose Of Losses';
    zCell.alignment = { textRotation: 90, vertical: 'middle', horizontal: 'center', wrapText: true };
    zCell.font = { bold: true };

    sheet.mergeCells(`H${startDataRow}:H${endDataRow}`);
    const domCell = sheet.getCell(`H${startDataRow}`);
    domCell.value = valZ;
    domCell.alignment = { vertical: 'middle', horizontal: 'center' };
  }

  // Totals Row
  const totalRow = sheet.getRow(currentRowIndex);
  totalRow.getCell(1).value = 'Total Supply Input (X)';
  totalRow.getCell(3).value = valX;
  totalRow.getCell(4).value = 'Total';
  totalRow.getCell(5).value = valY;
  totalRow.getCell(6).value = valBoiler;
  totalRow.getCell(7).value = 'Total';
  totalRow.getCell(8).value = valZ;
  
  totalRow.font = { bold: true };
  sheet.mergeCells(`A${currentRowIndex}:B${currentRowIndex}`);
  totalRow.getCell(1).alignment = { horizontal: 'right', vertical: 'middle' };
  
  for(let i=1; i<=11; i++) {
    if (i !== 2) { 
      const cell = totalRow.getCell(i);
      cell.border = {
        top: { style: 'thin' }, left: { style: 'thin' },
        bottom: { style: 'thin' }, right: { style: 'thin' }
      };
      if (i > 2) cell.alignment = { horizontal: 'center', vertical: 'middle' };
    }
  }

  // Signatures
  const sigRowStart = currentRowIndex + 5;
  sheet.getCell(`A${sigRowStart}`).value = '_______________________';
  sheet.getCell(`A${sigRowStart+1}`).value = 'Prepared by';
  sheet.getCell(`A${sigRowStart+2}`).value = '(Executive - Environment)';
  
  sheet.getCell(`H${sigRowStart}`).value = '_______________________';
  sheet.getCell(`H${sigRowStart+1}`).value = 'Approved by';
  sheet.getCell(`H${sigRowStart+2}`).value = 'AGM';

  // --- ADD RESULTS TABLE & DIAGRAM ---
  let diagRow = sigRowStart + 5;

  sheet.getCell(`A${diagRow}`).value = 'Variable Definition:';
  sheet.getCell(`A${diagRow}`).font = { bold: true };
  
  sheet.getCell(`D${diagRow}`).value = 'Results:';
  sheet.getCell(`D${diagRow}`).font = { bold: true };
  diagRow++;
  
  // Row 1
  sheet.getCell(`A${diagRow}`).value = 'X = Process/Facility Water Supply';
  sheet.mergeCells(`A${diagRow}:C${diagRow}`);
  sheet.getCell(`D${diagRow}`).value = 'Water Balance Value';
  sheet.getCell(`E${diagRow}`).value = waterBalanceValue.toFixed(2);
  sheet.getCell(`E${diagRow}`).font = { bold: true };
  diagRow++;
  
  // Row 2
  sheet.getCell(`A${diagRow}`).value = 'Y = Process Water Losses';
  sheet.mergeCells(`A${diagRow}:C${diagRow}`);
  sheet.getCell(`D${diagRow}`).value = 'Margin Of Error';
  sheet.getCell(`E${diagRow}`).value = `${marginOfError.toFixed(2)}%`;
  sheet.getCell(`E${diagRow}`).font = { bold: true, color: { argb: 'FF00B050' } };
  diagRow++;

  // Row 3
  sheet.getCell(`A${diagRow}`).value = 'Z = Waste Water Discharge';
  sheet.mergeCells(`A${diagRow}:C${diagRow}`);
  sheet.getCell(`D${diagRow}`).value = 'Percent Closure Result';
  sheet.getCell(`E${diagRow}`).value = `${percentClosureResult.toFixed(2)}%`;
  sheet.getCell(`E${diagRow}`).font = { bold: true, color: { argb: 'FF0070C0' } };
  
  // Borders for results
  for(let r = diagRow-2; r <= diagRow; r++) {
    ['A','B','C','D','E'].forEach(c => {
      sheet.getCell(`${c}${r}`).border = { top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'} };
    });
  }

  diagRow += 4;
  
  // DIAGRAM
  sheet.getCell(`B${diagRow}`).value = 'Water Balance Flow Diagram - Example';
  sheet.getCell(`B${diagRow}`).font = { bold: true, size: 14, color: { argb: 'FFFFFFFF' } };
  sheet.getCell(`B${diagRow}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF004B87' } };
  sheet.mergeCells(`B${diagRow}:H${diagRow}`);
  
  diagRow += 3;
  const facilityStartRow = diagRow;
  const facilityEndRow = diagRow + 4;
  
  // Center Box: Facility
  sheet.mergeCells(`D${facilityStartRow}:F${facilityEndRow}`);
  const facilityCell = sheet.getCell(`D${facilityStartRow}`);
  facilityCell.value = 'Facility';
  facilityCell.font = { bold: true, size: 12 };
  facilityCell.alignment = { horizontal: 'center', vertical: 'middle' };
  facilityCell.border = {
    top: { style: 'medium' }, left: { style: 'medium' },
    bottom: { style: 'medium' }, right: { style: 'medium' }
  };

  // Left side: Water Supply (valX)
  sheet.getCell(`B${facilityStartRow + 1}`).value = 'Water Supply';
  sheet.getCell(`B${facilityStartRow + 1}`).alignment = { horizontal: 'center' };
  
  sheet.getCell(`B${facilityStartRow + 2}`).value = `${valX} m³`;
  sheet.getCell(`B${facilityStartRow + 2}`).font = { color: { argb: 'FF0070C0' }, bold: true };
  sheet.getCell(`B${facilityStartRow + 2}`).alignment = { horizontal: 'center' };
  
  sheet.getCell(`C${facilityStartRow + 2}`).value = '→';
  sheet.getCell(`C${facilityStartRow + 2}`).font = { bold: true, size: 20 };
  sheet.getCell(`C${facilityStartRow + 2}`).alignment = { horizontal: 'center', vertical: 'middle' };

  // Right side: Product Water (valBoiler)
  sheet.getCell(`G${facilityStartRow + 2}`).value = '→';
  sheet.getCell(`G${facilityStartRow + 2}`).font = { bold: true, size: 20 };
  sheet.getCell(`G${facilityStartRow + 2}`).alignment = { horizontal: 'center', vertical: 'middle' };
  
  sheet.getCell(`H${facilityStartRow + 1}`).value = 'Product Water';
  sheet.getCell(`H${facilityStartRow + 1}`).alignment = { horizontal: 'center' };
  
  sheet.getCell(`H${facilityStartRow + 2}`).value = `${valBoiler} m³`;
  sheet.getCell(`H${facilityStartRow + 2}`).font = { color: { argb: 'FF0070C0' }, bold: true };
  sheet.getCell(`H${facilityStartRow + 2}`).alignment = { horizontal: 'center' };

  // Bottom side: Water Losses & Waste Water
  const downArrowRow = facilityEndRow + 1;
  const labelRow = facilityEndRow + 2;
  const valueRow = facilityEndRow + 3;

  // Process Losses (valY)
  sheet.getCell(`D${downArrowRow}`).value = '↓';
  sheet.getCell(`D${downArrowRow}`).font = { bold: true, size: 16 };
  sheet.getCell(`D${downArrowRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
  
  sheet.getCell(`D${labelRow}`).value = 'Process Losses';
  sheet.getCell(`D${labelRow}`).alignment = { horizontal: 'center', wrapText: true };
  
  sheet.getCell(`D${valueRow}`).value = `${valY} m³`;
  sheet.getCell(`D${valueRow}`).font = { color: { argb: 'FF0070C0' }, bold: true };
  sheet.getCell(`D${valueRow}`).alignment = { horizontal: 'center' };

  // Waste Water (valZ)
  sheet.getCell(`F${downArrowRow}`).value = '↓';
  sheet.getCell(`F${downArrowRow}`).font = { bold: true, size: 16 };
  sheet.getCell(`F${downArrowRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
  
  sheet.getCell(`F${labelRow}`).value = 'Waste Water';
  sheet.getCell(`F${labelRow}`).alignment = { horizontal: 'center', wrapText: true };
  
  sheet.getCell(`F${valueRow}`).value = `${valZ.toFixed(2)} m³`;
  sheet.getCell(`F${valueRow}`).font = { color: { argb: 'FF0070C0' }, bold: true };
  sheet.getCell(`F${valueRow}`).alignment = { horizontal: 'center' };

  // Formula at the bottom
  const formulaRow = valueRow + 3;
  
  // Formula Labels
  sheet.getCell(`C${formulaRow}`).value = '[Waste Water]';
  sheet.getCell(`C${formulaRow}`).border = { top:{style:'thin'}, bottom:{style:'thin'}, left:{style:'thin'}, right:{style:'thin'} };
  sheet.getCell(`C${formulaRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
  
  sheet.getCell(`D${formulaRow}`).value = '=';
  sheet.getCell(`D${formulaRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
  
  sheet.getCell(`E${formulaRow}`).value = '[Water Supply]';
  sheet.getCell(`E${formulaRow}`).border = { top:{style:'thin'}, bottom:{style:'thin'}, left:{style:'thin'}, right:{style:'thin'} };
  sheet.getCell(`E${formulaRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
  
  sheet.getCell(`F${formulaRow}`).value = '-';
  sheet.getCell(`F${formulaRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
  
  sheet.getCell(`G${formulaRow}`).value = '[Product Water]';
  sheet.getCell(`G${formulaRow}`).border = { top:{style:'thin'}, bottom:{style:'thin'}, left:{style:'thin'}, right:{style:'thin'} };
  sheet.getCell(`G${formulaRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
  
  sheet.getCell(`H${formulaRow}`).value = '-';
  sheet.getCell(`H${formulaRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
  
  sheet.getCell(`I${formulaRow}`).value = '[Process Losses]';
  sheet.getCell(`I${formulaRow}`).border = { top:{style:'thin'}, bottom:{style:'thin'}, left:{style:'thin'}, right:{style:'thin'} };
  sheet.getCell(`I${formulaRow}`).alignment = { horizontal: 'center', vertical: 'middle' };

  // Formula Values
  const fValueRow = formulaRow + 2;
  sheet.getCell(`C${fValueRow}`).value = valZ.toFixed(2);
  sheet.getCell(`C${fValueRow}`).alignment = { horizontal: 'center' };
  
  sheet.getCell(`D${fValueRow}`).value = '=';
  sheet.getCell(`D${fValueRow}`).alignment = { horizontal: 'center' };
  
  sheet.getCell(`E${fValueRow}`).value = valX;
  sheet.getCell(`E${fValueRow}`).alignment = { horizontal: 'center' };
  
  sheet.getCell(`F${fValueRow}`).value = '-';
  sheet.getCell(`F${fValueRow}`).alignment = { horizontal: 'center' };
  
  sheet.getCell(`G${fValueRow}`).value = valBoiler;
  sheet.getCell(`G${fValueRow}`).alignment = { horizontal: 'center' };
  
  sheet.getCell(`H${fValueRow}`).value = '-';
  sheet.getCell(`H${fValueRow}`).alignment = { horizontal: 'center' };
  
  sheet.getCell(`I${fValueRow}`).value = valY;
  sheet.getCell(`I${fValueRow}`).alignment = { horizontal: 'center' };


  // Export
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, 'Water_Balance_Calculation_2024.xlsx');
}
