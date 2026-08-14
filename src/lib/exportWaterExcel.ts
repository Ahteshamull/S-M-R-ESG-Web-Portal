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

  // Brand Banner Title (Merged A1:K2)
  sheet.mergeCells('A1:K2');
  const titleCell = sheet.getCell('A1');
  titleCell.value = 'WATER BALANCE CALCULATION & REPORT (YTD)';
  titleCell.font = { name: 'Segoe UI', size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
  titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF15803D' } }; // Dark Emerald
  titleCell.alignment = { vertical: 'middle', horizontal: 'center' };

  // Metadata Row
  sheet.mergeCells('A3:K3');
  const metaCell = sheet.getCell('A3');
  metaCell.value = 'Company Name: Apex Apparels Ltd.  |  Responsible Person: Shahnayaz Hossain Joy (Executive-Environment)';
  metaCell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FF14532D' } }; // Dark Green text
  metaCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDCFCE7' } }; // Light Emerald
  metaCell.alignment = { vertical: 'middle', horizontal: 'center' };

  // Table Headers (Row 5)
  const headers = [
    "Type Of Water", "Month", "Value in (m³)", "Input Supply (Y)", 
    "Evaporation, Absob, Irrigation, Leaks", "Boiler Water (m³)", 
    "Input Supply (Z)", "Domestic Waste Water Discharge", "Remarks",
    "ETP Inlet Water (m³)", "ETP Outlet Water (m³)"
  ];
  
  const headerRow = sheet.getRow(5);
  headerRow.values = headers;
  headerRow.height = 40;
  
  for(let i=1; i<=11; i++) {
    const cell = headerRow.getCell(i);
    cell.font = { name: 'Segoe UI', bold: true, size: 11, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF16A34A' } }; // Medium Emerald
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    cell.border = {
      top: { style: 'thin', color: { argb: 'FFCBD5E1' } },
      left: { style: 'thin', color: { argb: 'FFCBD5E1' } },
      bottom: { style: 'thin', color: { argb: 'FFCBD5E1' } },
      right: { style: 'thin', color: { argb: 'FFCBD5E1' } }
    };
  }

  // Data Rows
  let currentRowIndex = 6;
  const startDataRow = 6;
  
  waterLogs.forEach((log) => {
    const row = sheet.getRow(currentRowIndex);
    row.getCell(2).value = log.month;
    row.getCell(3).value = log.totalWithdrawal;
    row.getCell(6).value = log.totalProduction;
    row.getCell(10).value = log.inletWater;
    row.getCell(11).value = log.outletWater;

    // Formatting numbers
    [3,6,10,11].forEach(col => {
      row.getCell(col).numFmt = '#,##0.00';
    });
    
    for(let i=1; i<=11; i++) {
       const cell = row.getCell(i);
       cell.font = { name: 'Segoe UI', size: 10 };
       cell.border = {
         top: { style: 'thin', color: { argb: 'FFCBD5E1' } },
         left: { style: 'thin', color: { argb: 'FFCBD5E1' } },
         bottom: { style: 'thin', color: { argb: 'FFCBD5E1' } },
         right: { style: 'thin', color: { argb: 'FFCBD5E1' } }
       };
       if (i === 1 || i === 2 || i === 9) {
         cell.alignment = { vertical: 'middle', horizontal: 'center' };
       } else {
         cell.alignment = { vertical: 'middle', horizontal: 'right' };
       }
    }
    currentRowIndex++;
  });
  
  const endDataRow = currentRowIndex > startDataRow ? currentRowIndex - 1 : startDataRow;

  if (waterLogs.length > 0) {
    sheet.mergeCells(`A${startDataRow}:A${endDataRow}`);
    const typeCell = sheet.getCell(`A${startDataRow}`);
    typeCell.value = 'Municipal Water';
    typeCell.alignment = { textRotation: 90, vertical: 'middle', horizontal: 'center', wrapText: true };
    typeCell.font = { name: 'Segoe UI', bold: true, size: 11, color: { argb: 'FF14532D' } };
    typeCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDCFCE7' } };

    sheet.mergeCells(`D${startDataRow}:D${endDataRow}`);
    const yCell = sheet.getCell(`D${startDataRow}`);
    yCell.value = 'Water Process Losses';
    yCell.alignment = { textRotation: 90, vertical: 'middle', horizontal: 'center', wrapText: true };
    yCell.font = { name: 'Segoe UI', bold: true, size: 11, color: { argb: 'FF14532D' } };
    yCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDCFCE7' } };

    sheet.mergeCells(`E${startDataRow}:E${endDataRow}`);
    const evalCell = sheet.getCell(`E${startDataRow}`);
    evalCell.value = valY;
    evalCell.numFmt = '#,##0.00';
    evalCell.font = { name: 'Segoe UI', size: 10 };
    evalCell.alignment = { vertical: 'middle', horizontal: 'right' };

    sheet.mergeCells(`G${startDataRow}:G${endDataRow}`);
    const zCell = sheet.getCell(`G${startDataRow}`);
    zCell.value = 'Another Purpose Of Losses';
    zCell.alignment = { textRotation: 90, vertical: 'middle', horizontal: 'center', wrapText: true };
    zCell.font = { name: 'Segoe UI', bold: true, size: 11, color: { argb: 'FF14532D' } };
    zCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDCFCE7' } };

    sheet.mergeCells(`H${startDataRow}:H${endDataRow}`);
    const domCell = sheet.getCell(`H${startDataRow}`);
    domCell.value = valZ;
    domCell.numFmt = '#,##0.00';
    domCell.font = { name: 'Segoe UI', size: 10 };
    domCell.alignment = { vertical: 'middle', horizontal: 'right' };
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
  
  sheet.mergeCells(`A${currentRowIndex}:B${currentRowIndex}`);
  totalRow.getCell(1).alignment = { horizontal: 'right', vertical: 'middle' };
  
  [3,5,6,8].forEach(col => {
    totalRow.getCell(col).numFmt = '#,##0.00';
  });

  totalRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F5F9' } }; // Light Slate Gray

  for(let i=1; i<=11; i++) {
    if (i !== 2) { 
      const cell = totalRow.getCell(i);
      cell.font = { name: 'Segoe UI', bold: true, size: 11 };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFCBD5E1' } },
        left: { style: 'thin', color: { argb: 'FFCBD5E1' } },
        bottom: { style: 'double', color: { argb: 'FFCBD5E1' } },
        right: { style: 'thin', color: { argb: 'FFCBD5E1' } }
      };
      if (i > 2 && i !== 4 && i !== 7 && i !== 9) {
        cell.alignment = { horizontal: 'right', vertical: 'middle' };
      } else if (i > 2) {
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      }
    }
  }

  // Signatures
  const sigRowStart = currentRowIndex + 5;
  sheet.getCell(`A${sigRowStart}`).value = '_______________________';
  sheet.getCell(`A${sigRowStart}`).font = { name: 'Segoe UI', size: 10 };
  sheet.getCell(`A${sigRowStart+1}`).value = 'Prepared by';
  sheet.getCell(`A${sigRowStart+1}`).font = { name: 'Segoe UI', size: 10, bold: true };
  sheet.getCell(`A${sigRowStart+2}`).value = '(Executive - Environment)';
  sheet.getCell(`A${sigRowStart+2}`).font = { name: 'Segoe UI', size: 9, italic: true };
  
  sheet.getCell(`H${sigRowStart}`).value = '_______________________';
  sheet.getCell(`H${sigRowStart}`).font = { name: 'Segoe UI', size: 10 };
  sheet.getCell(`H${sigRowStart+1}`).value = 'Approved by';
  sheet.getCell(`H${sigRowStart+1}`).font = { name: 'Segoe UI', size: 10, bold: true };
  sheet.getCell(`H${sigRowStart+2}`).value = 'AGM';
  sheet.getCell(`H${sigRowStart+2}`).font = { name: 'Segoe UI', size: 9, italic: true };

  // --- ADD RESULTS TABLE & DIAGRAM ---
  let diagRow = sigRowStart + 5;

  sheet.getCell(`A${diagRow}`).value = 'Variable Definition:';
  sheet.getCell(`A${diagRow}`).font = { name: 'Segoe UI', bold: true, size: 11, color: { argb: 'FF14532D' } };
  
  sheet.getCell(`D${diagRow}`).value = 'Results:';
  sheet.getCell(`D${diagRow}`).font = { name: 'Segoe UI', bold: true, size: 11, color: { argb: 'FF14532D' } };
  diagRow++;
  
  // Row 1
  sheet.getCell(`A${diagRow}`).value = 'X = Process/Facility Water Supply';
  sheet.mergeCells(`A${diagRow}:C${diagRow}`);
  sheet.getCell(`A${diagRow}`).font = { name: 'Segoe UI', size: 10 };
  sheet.getCell(`D${diagRow}`).value = 'Water Balance Value';
  sheet.getCell(`D${diagRow}`).font = { name: 'Segoe UI', size: 10 };
  sheet.getCell(`E${diagRow}`).value = waterBalanceValue;
  sheet.getCell(`E${diagRow}`).numFmt = '#,##0.00';
  sheet.getCell(`E${diagRow}`).font = { name: 'Segoe UI', bold: true, size: 10 };
  diagRow++;
  
  // Row 2
  sheet.getCell(`A${diagRow}`).value = 'Y = Process Water Losses';
  sheet.mergeCells(`A${diagRow}:C${diagRow}`);
  sheet.getCell(`A${diagRow}`).font = { name: 'Segoe UI', size: 10 };
  sheet.getCell(`D${diagRow}`).value = 'Margin Of Error';
  sheet.getCell(`D${diagRow}`).font = { name: 'Segoe UI', size: 10 };
  sheet.getCell(`E${diagRow}`).value = marginOfError / 100; // stored as fraction for % formatting
  sheet.getCell(`E${diagRow}`).numFmt = '0.00%';
  sheet.getCell(`E${diagRow}`).font = { name: 'Segoe UI', bold: true, size: 10, color: { argb: 'FF16A34A' } };
  diagRow++;

  // Row 3
  sheet.getCell(`A${diagRow}`).value = 'Z = Waste Water Discharge';
  sheet.mergeCells(`A${diagRow}:C${diagRow}`);
  sheet.getCell(`A${diagRow}`).font = { name: 'Segoe UI', size: 10 };
  sheet.getCell(`D${diagRow}`).value = 'Percent Closure Result';
  sheet.getCell(`D${diagRow}`).font = { name: 'Segoe UI', size: 10 };
  sheet.getCell(`E${diagRow}`).value = percentClosureResult / 100;
  sheet.getCell(`E${diagRow}`).numFmt = '0.00%';
  sheet.getCell(`E${diagRow}`).font = { name: 'Segoe UI', bold: true, size: 10, color: { argb: 'FF2563EB' } };
  
  // Borders for results
  for(let r = diagRow-2; r <= diagRow; r++) {
    ['A','B','C','D','E'].forEach(c => {
      const cell = sheet.getCell(`${c}${r}`);
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFCBD5E1' } },
        left: { style: 'thin', color: { argb: 'FFCBD5E1' } },
        bottom: { style: 'thin', color: { argb: 'FFCBD5E1' } },
        right: { style: 'thin', color: { argb: 'FFCBD5E1' } }
      };
      if (c === 'E') {
        cell.alignment = { horizontal: 'right', vertical: 'middle' };
      } else {
        cell.alignment = { horizontal: 'left', vertical: 'middle' };
      }
    });
  }

  diagRow += 4;
  
  // DIAGRAM TITLE
  sheet.getCell(`B${diagRow}`).value = 'Water Balance Flow Diagram - Example';
  sheet.getCell(`B${diagRow}`).font = { name: 'Segoe UI', bold: true, size: 12, color: { argb: 'FFFFFFFF' } };
  sheet.getCell(`B${diagRow}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF15803D' } };
  sheet.getCell(`B${diagRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
  sheet.mergeCells(`B${diagRow}:H${diagRow}`);
  
  diagRow += 3;
  const facilityStartRow = diagRow;
  const facilityEndRow = diagRow + 4;
  
  // Center Box: Facility
  sheet.mergeCells(`D${facilityStartRow}:F${facilityEndRow}`);
  const facilityCell = sheet.getCell(`D${facilityStartRow}`);
  facilityCell.value = 'Facility';
  facilityCell.font = { name: 'Segoe UI', bold: true, size: 12, color: { argb: 'FFFFFFFF' } };
  facilityCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF16A34A' } }; // Medium Emerald
  facilityCell.alignment = { horizontal: 'center', vertical: 'middle' };
  
  // Set borders for Facility box
  for(let r = facilityStartRow; r <= facilityEndRow; r++) {
    for(let c = 4; c <= 6; c++) {
      const colChar = String.fromCharCode(64 + c);
      sheet.getCell(`${colChar}${r}`).border = {
        top: { style: 'medium', color: { argb: 'FF15803D' } },
        left: { style: 'medium', color: { argb: 'FF15803D' } },
        bottom: { style: 'medium', color: { argb: 'FF15803D' } },
        right: { style: 'medium', color: { argb: 'FF15803D' } }
      };
    }
  }

  // Left side: Water Supply (valX)
  sheet.getCell(`B${facilityStartRow + 1}`).value = 'Water Supply';
  sheet.getCell(`B${facilityStartRow + 1}`).font = { name: 'Segoe UI', size: 10, bold: true };
  sheet.getCell(`B${facilityStartRow + 1}`).alignment = { horizontal: 'center' };
  
  sheet.getCell(`B${facilityStartRow + 2}`).value = valX;
  sheet.getCell(`B${facilityStartRow + 2}`).numFmt = '#,##0.00';
  sheet.getCell(`B${facilityStartRow + 2}`).font = { name: 'Segoe UI', color: { argb: 'FF15803D' }, bold: true, size: 11 };
  sheet.getCell(`B${facilityStartRow + 2}`).alignment = { horizontal: 'center' };
  
  sheet.getCell(`C${facilityStartRow + 2}`).value = '→';
  sheet.getCell(`C${facilityStartRow + 2}`).font = { name: 'Segoe UI', bold: true, size: 20, color: { argb: 'FF16A34A' } };
  sheet.getCell(`C${facilityStartRow + 2}`).alignment = { horizontal: 'center', vertical: 'middle' };

  // Right side: Product Water (valBoiler)
  sheet.getCell(`G${facilityStartRow + 2}`).value = '→';
  sheet.getCell(`G${facilityStartRow + 2}`).font = { name: 'Segoe UI', bold: true, size: 20, color: { argb: 'FF16A34A' } };
  sheet.getCell(`G${facilityStartRow + 2}`).alignment = { horizontal: 'center', vertical: 'middle' };
  
  sheet.getCell(`H${facilityStartRow + 1}`).value = 'Product Water';
  sheet.getCell(`H${facilityStartRow + 1}`).font = { name: 'Segoe UI', size: 10, bold: true };
  sheet.getCell(`H${facilityStartRow + 1}`).alignment = { horizontal: 'center' };
  
  sheet.getCell(`H${facilityStartRow + 2}`).value = valBoiler;
  sheet.getCell(`H${facilityStartRow + 2}`).numFmt = '#,##0.00';
  sheet.getCell(`H${facilityStartRow + 2}`).font = { name: 'Segoe UI', color: { argb: 'FF15803D' }, bold: true, size: 11 };
  sheet.getCell(`H${facilityStartRow + 2}`).alignment = { horizontal: 'center' };

  // Bottom side: Water Losses & Waste Water
  const downArrowRow = facilityEndRow + 1;
  const labelRow = facilityEndRow + 2;
  const valueRow = facilityEndRow + 3;

  // Process Losses (valY)
  sheet.getCell(`D${downArrowRow}`).value = '↓';
  sheet.getCell(`D${downArrowRow}`).font = { name: 'Segoe UI', bold: true, size: 16, color: { argb: 'FF16A34A' } };
  sheet.getCell(`D${downArrowRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
  
  sheet.getCell(`D${labelRow}`).value = 'Process Losses';
  sheet.getCell(`D${labelRow}`).font = { name: 'Segoe UI', size: 9, bold: true };
  sheet.getCell(`D${labelRow}`).alignment = { horizontal: 'center', wrapText: true };
  
  sheet.getCell(`D${valueRow}`).value = valY;
  sheet.getCell(`D${valueRow}`).numFmt = '#,##0.00';
  sheet.getCell(`D${valueRow}`).font = { name: 'Segoe UI', color: { argb: 'FF15803D' }, bold: true, size: 11 };
  sheet.getCell(`D${valueRow}`).alignment = { horizontal: 'center' };

  // Waste Water (valZ)
  sheet.getCell(`F${downArrowRow}`).value = '↓';
  sheet.getCell(`F${downArrowRow}`).font = { name: 'Segoe UI', bold: true, size: 16, color: { argb: 'FF16A34A' } };
  sheet.getCell(`F${downArrowRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
  
  sheet.getCell(`F${labelRow}`).value = 'Waste Water';
  sheet.getCell(`F${labelRow}`).font = { name: 'Segoe UI', size: 9, bold: true };
  sheet.getCell(`F${labelRow}`).alignment = { horizontal: 'center', wrapText: true };
  
  sheet.getCell(`F${valueRow}`).value = valZ;
  sheet.getCell(`F${valueRow}`).numFmt = '#,##0.00';
  sheet.getCell(`F${valueRow}`).font = { name: 'Segoe UI', color: { argb: 'FF15803D' }, bold: true, size: 11 };
  sheet.getCell(`F${valueRow}`).alignment = { horizontal: 'center' };

  // Formula at the bottom
  const formulaRow = valueRow + 3;
  
  // Formula Labels
  sheet.getCell(`C${formulaRow}`).value = '[Waste Water]';
  sheet.getCell(`C${formulaRow}`).font = { name: 'Segoe UI', size: 10, bold: true };
  sheet.getCell(`C${formulaRow}`).border = {
    top:{style:'thin', color:{argb:'FFCBD5E1'}},
    bottom:{style:'thin', color:{argb:'FFCBD5E1'}},
    left:{style:'thin', color:{argb:'FFCBD5E1'}},
    right:{style:'thin', color:{argb:'FFCBD5E1'}}
  };
  sheet.getCell(`C${formulaRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
  
  sheet.getCell(`D${formulaRow}`).value = '=';
  sheet.getCell(`D${formulaRow}`).font = { name: 'Segoe UI', bold: true };
  sheet.getCell(`D${formulaRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
  
  sheet.getCell(`E${formulaRow}`).value = '[Water Supply]';
  sheet.getCell(`E${formulaRow}`).font = { name: 'Segoe UI', size: 10, bold: true };
  sheet.getCell(`E${formulaRow}`).border = {
    top:{style:'thin', color:{argb:'FFCBD5E1'}},
    bottom:{style:'thin', color:{argb:'FFCBD5E1'}},
    left:{style:'thin', color:{argb:'FFCBD5E1'}},
    right:{style:'thin', color:{argb:'FFCBD5E1'}}
  };
  sheet.getCell(`E${formulaRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
  
  sheet.getCell(`F${formulaRow}`).value = '-';
  sheet.getCell(`F${formulaRow}`).font = { name: 'Segoe UI', bold: true };
  sheet.getCell(`F${formulaRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
  
  sheet.getCell(`G${formulaRow}`).value = '[Product Water]';
  sheet.getCell(`G${formulaRow}`).font = { name: 'Segoe UI', size: 10, bold: true };
  sheet.getCell(`G${formulaRow}`).border = {
    top:{style:'thin', color:{argb:'FFCBD5E1'}},
    bottom:{style:'thin', color:{argb:'FFCBD5E1'}},
    left:{style:'thin', color:{argb:'FFCBD5E1'}},
    right:{style:'thin', color:{argb:'FFCBD5E1'}}
  };
  sheet.getCell(`G${formulaRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
  
  sheet.getCell(`H${formulaRow}`).value = '-';
  sheet.getCell(`H${formulaRow}`).font = { name: 'Segoe UI', bold: true };
  sheet.getCell(`H${formulaRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
  
  sheet.getCell(`I${formulaRow}`).value = '[Process Losses]';
  sheet.getCell(`I${formulaRow}`).font = { name: 'Segoe UI', size: 10, bold: true };
  sheet.getCell(`I${formulaRow}`).border = {
    top:{style:'thin', color:{argb:'FFCBD5E1'}},
    bottom:{style:'thin', color:{argb:'FFCBD5E1'}},
    left:{style:'thin', color:{argb:'FFCBD5E1'}},
    right:{style:'thin', color:{argb:'FFCBD5E1'}}
  };
  sheet.getCell(`I${formulaRow}`).alignment = { horizontal: 'center', vertical: 'middle' };

  // Formula Values
  const fValueRow = formulaRow + 2;
  sheet.getCell(`C${fValueRow}`).value = valZ;
  sheet.getCell(`C${fValueRow}`).numFmt = '#,##0.00';
  sheet.getCell(`C${fValueRow}`).font = { name: 'Segoe UI', bold: true, color: { argb: 'FF15803D' } };
  sheet.getCell(`C${fValueRow}`).alignment = { horizontal: 'center' };
  
  sheet.getCell(`D${fValueRow}`).value = '=';
  sheet.getCell(`D${fValueRow}`).font = { name: 'Segoe UI', bold: true };
  sheet.getCell(`D${fValueRow}`).alignment = { horizontal: 'center' };
  
  sheet.getCell(`E${fValueRow}`).value = valX;
  sheet.getCell(`E${fValueRow}`).numFmt = '#,##0.00';
  sheet.getCell(`E${fValueRow}`).font = { name: 'Segoe UI', bold: true, color: { argb: 'FF15803D' } };
  sheet.getCell(`E${fValueRow}`).alignment = { horizontal: 'center' };
  
  sheet.getCell(`F${fValueRow}`).value = '-';
  sheet.getCell(`F${fValueRow}`).font = { name: 'Segoe UI', bold: true };
  sheet.getCell(`F${fValueRow}`).alignment = { horizontal: 'center' };
  
  sheet.getCell(`G${fValueRow}`).value = valBoiler;
  sheet.getCell(`G${fValueRow}`).numFmt = '#,##0.00';
  sheet.getCell(`G${fValueRow}`).font = { name: 'Segoe UI', bold: true, color: { argb: 'FF15803D' } };
  sheet.getCell(`G${fValueRow}`).alignment = { horizontal: 'center' };
  
  sheet.getCell(`H${fValueRow}`).value = '-';
  sheet.getCell(`H${fValueRow}`).font = { name: 'Segoe UI', bold: true };
  sheet.getCell(`H${fValueRow}`).alignment = { horizontal: 'center' };
  
  sheet.getCell(`I${fValueRow}`).value = valY;
  sheet.getCell(`I${fValueRow}`).numFmt = '#,##0.00';
  sheet.getCell(`I${fValueRow}`).font = { name: 'Segoe UI', bold: true, color: { argb: 'FF15803D' } };
  sheet.getCell(`I${fValueRow}`).alignment = { horizontal: 'center' };


  // Export
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, 'Water_Balance_Calculation_2024.xlsx');
}
