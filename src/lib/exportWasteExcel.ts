import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

// Define Interfaces matching the pages
export interface WasteGenerationRecord {
  id: string;
  month: string;
  nonHaz: Record<string, number>;
  haz: Record<string, number>;
}

export interface InventoryRecord {
  id: string;
  date: string;
  wasteType: string;
  quantity: number;
  unit: string;
  storageArea: string;
  notes: string;
}

export interface RecycleRecord {
  id: string;
  date: string;
  materialType: string;
  quantity: number;
  vendor: string;
  revenue: number;
}

// Styling helper for headers
const applyHeaderStyle = (row: ExcelJS.Row, color: string = 'FF16A34A') => {
  row.font = { name: 'Segoe UI', bold: true, size: 11, color: { argb: 'FFFFFFFF' } };
  row.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
  row.eachCell((cell) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: color }
    };
    cell.border = {
      top: { style: 'thin', color: { argb: 'FFCBD5E1' } },
      left: { style: 'thin', color: { argb: 'FFCBD5E1' } },
      bottom: { style: 'thin', color: { argb: 'FFCBD5E1' } },
      right: { style: 'thin', color: { argb: 'FFCBD5E1' } }
    };
  });
};

// Styling helper for data rows
const applyDataStyle = (row: ExcelJS.Row) => {
  row.eachCell((cell) => {
    cell.font = { name: 'Segoe UI', size: 10 };
    cell.border = {
      top: { style: 'thin', color: { argb: 'FFCBD5E1' } },
      left: { style: 'thin', color: { argb: 'FFCBD5E1' } },
      bottom: { style: 'thin', color: { argb: 'FFCBD5E1' } },
      right: { style: 'thin', color: { argb: 'FFCBD5E1' } }
    };
  });
};

// 1. Export Waste Generation Details
export const exportWasteGenerationExcel = async (records: WasteGenerationRecord[], nonHazCols: string[], hazCols: string[]) => {
  const workbook = new ExcelJS.Workbook();
  
  // ==================== SHEET 1: WASTE GENERATION DETAILS ====================
  const sheet1 = workbook.addWorksheet('Waste generation details');
  
  const lastColNonHaz = 1 + nonHazCols.length + 2; // Month + columns + Total + Method
  
  // Brand Banner Title (Merged A1:LastCol)
  sheet1.mergeCells(1, 1, 2, lastColNonHaz);
  const title1 = sheet1.getCell('A1');
  title1.value = `WASTE GENERATION DETAILS REPORT - ${new Date().getFullYear()}`;
  title1.font = { name: 'Segoe UI', bold: true, size: 16, color: { argb: 'FFFFFFFF' } };
  title1.alignment = { horizontal: 'center', vertical: 'middle' };
  title1.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF15803D' } }; // Dark Emerald
  sheet1.getRow(1).height = 20;
  sheet1.getRow(2).height = 20;

  // Metadata Row
  sheet1.mergeCells(3, 1, 3, lastColNonHaz);
  const meta1 = sheet1.getCell('A3');
  meta1.value = 'Company Name: Apex Apparels Ltd.  |  Responsible Person: Shahnayaz Hossain Joy (Executive-Environment)';
  meta1.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FF14532D' } }; // Dark Green text
  meta1.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDCFCE7' } }; // Light Emerald
  meta1.alignment = { vertical: 'middle', horizontal: 'center' };
  sheet1.getRow(3).height = 22;

  // Non-Hazardous Section Title Block
  sheet1.mergeCells(4, 1, 4, lastColNonHaz);
  const nonHazTitle = sheet1.getCell('A4');
  nonHazTitle.value = 'Non-Hazardous Waste Details';
  nonHazTitle.font = { name: 'Segoe UI', bold: true, size: 12, color: { argb: 'FF14532D' } };
  nonHazTitle.alignment = { horizontal: 'center', vertical: 'middle' };
  nonHazTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDCFCE7' } }; // Light Emerald
  sheet1.getRow(4).height = 25;
  
  sheet1.mergeCells('A5:A7');
  sheet1.getCell('A5').value = 'Month';
  
  sheet1.mergeCells(5, 2, 5, 2 + nonHazCols.length - 1);
  sheet1.getCell(5, 2).value = 'Item Name';
  
  sheet1.mergeCells(5, 2 + nonHazCols.length, 7, 2 + nonHazCols.length);
  sheet1.getCell(5, 2 + nonHazCols.length).value = 'Total Quantity\n(kg)';
  
  sheet1.mergeCells(5, 2 + nonHazCols.length + 1, 7, 2 + nonHazCols.length + 1);
  sheet1.getCell(5, 2 + nonHazCols.length + 1).value = 'Method used to track this waste';
  
  nonHazCols.forEach((col, i) => {
    sheet1.getCell(6, i+2).value = i+1;
    sheet1.getCell(7, i+2).value = col;
  });

  // Borders & Alignment for Header
  for(let r=5; r<=7; r++) {
    const row = sheet1.getRow(r);
    row.height = r === 7 ? 35 : 22;
    for(let c=1; c<=lastColNonHaz; c++) {
      const cell = sheet1.getCell(r, c);
      cell.font = { name: 'Segoe UI', bold: true, size: 10, color: { argb: 'FFFFFFFF' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF16A34A' } }; // Medium Emerald
      cell.border = {
        top: {style:'thin', color: {argb:'FFCBD5E1'}},
        left: {style:'thin', color: {argb:'FFCBD5E1'}},
        bottom: {style:'thin', color: {argb:'FFCBD5E1'}},
        right: {style:'thin', color: {argb:'FFCBD5E1'}}
      };
      cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    }
  }

  // Data rows
  let rIdx = 8;
  const nonHazTotals = new Array(nonHazCols.length).fill(0);
  let totalNonHazAll = 0;

  records.forEach(rec => {
    const row = sheet1.getRow(rIdx);
    row.height = 20;
    row.getCell(1).value = rec.month;
    
    let monthTotal = 0;
    
    nonHazCols.forEach((col, i) => {
      const v = rec.nonHaz[col] || 0;
      row.getCell(i+2).value = v;
      row.getCell(i+2).numFmt = '#,##0.00';
      nonHazTotals[i] += v;
      monthTotal += v;
    });
    
    row.getCell(1 + nonHazCols.length + 1).value = monthTotal;
    row.getCell(1 + nonHazCols.length + 1).numFmt = '#,##0.00';
    totalNonHazAll += monthTotal;
    row.getCell(1 + nonHazCols.length + 2).value = 'Weighed';
    
    for(let c=1; c<=lastColNonHaz; c++) {
      const cell = row.getCell(c);
      cell.font = { name: 'Segoe UI', size: 10 };
      cell.border = {
        top: {style:'thin', color: {argb:'FFCBD5E1'}},
        left: {style:'thin', color: {argb:'FFCBD5E1'}},
        bottom: {style:'thin', color: {argb:'FFCBD5E1'}},
        right: {style:'thin', color: {argb:'FFCBD5E1'}}
      };
      if (c === 1 || c === lastColNonHaz) {
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      } else {
        cell.alignment = { horizontal: 'right', vertical: 'middle' };
      }
    }
    rIdx++;
  });

  // Totals Row
  const totalRow = sheet1.getRow(rIdx);
  totalRow.height = 22;
  totalRow.getCell(1).value = 'Total';
  totalRow.getCell(1).font = { name: 'Segoe UI', bold: true, size: 11 };
  
  nonHazTotals.forEach((v, i) => {
    totalRow.getCell(i+2).value = v;
    totalRow.getCell(i+2).numFmt = '#,##0.00';
  });
  
  totalRow.getCell(1 + nonHazCols.length + 1).value = totalNonHazAll;
  totalRow.getCell(1 + nonHazCols.length + 1).numFmt = '#,##0.00';
  totalRow.getCell(1 + nonHazCols.length + 2).value = 'Weighed';
  
  totalRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F5F9' } }; // Light Slate Gray

  for(let c=1; c<=lastColNonHaz; c++) {
    const cell = totalRow.getCell(c);
    cell.font = { name: 'Segoe UI', bold: true, size: 11 };
    cell.border = {
      top: {style:'thin', color: {argb:'FFCBD5E1'}},
      left: {style:'thin', color: {argb:'FFCBD5E1'}},
      bottom: {style:'double', color: {argb:'FFCBD5E1'}},
      right: {style:'thin', color: {argb:'FFCBD5E1'}}
    };
    if (c === 1 || c === lastColNonHaz) {
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    } else {
      cell.alignment = { horizontal: 'right', vertical: 'middle' };
    }
  }
  
  // Hazardous Section Divider Space
  rIdx += 3;
  
  const lastColHaz = 3 + hazCols.length + 2; // Margin col 3 + Month + columns + Total + Method
  
  // Hazardous Section Title Block (Using premium red tint)
  sheet1.mergeCells(rIdx, 3, rIdx, lastColHaz);
  const hazTitle = sheet1.getCell(rIdx, 3);
  hazTitle.value = 'Hazardous Waste Details';
  hazTitle.font = { name: 'Segoe UI', bold: true, size: 12, color: { argb: 'FF991B1B' } }; // Dark Red
  hazTitle.alignment = { horizontal: 'center', vertical: 'middle' };
  hazTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFECACA' } }; // Light Rose
  sheet1.getRow(rIdx).height = 25;
  
  const hR = rIdx + 1;
  sheet1.mergeCells(hR, 3, hR + 2, 3);
  sheet1.getCell(hR, 3).value = 'Month';
  
  sheet1.mergeCells(hR, 4, hR, 4 + hazCols.length - 1);
  sheet1.getCell(hR, 4).value = 'Item Name';
  
  sheet1.mergeCells(hR, 4 + hazCols.length, hR + 2, 4 + hazCols.length);
  sheet1.getCell(hR, 4 + hazCols.length).value = 'Total Quantity\n(kg)';
  
  sheet1.mergeCells(hR, 4 + hazCols.length + 1, hR + 2, 4 + hazCols.length + 1);
  sheet1.getCell(hR, 4 + hazCols.length + 1).value = 'Method used to track this waste';
  
  hazCols.forEach((col, i) => {
    sheet1.getCell(hR+1, i+4).value = i+1;
    sheet1.getCell(hR+2, i+4).value = col;
  });

  // Borders & Alignment for Hazardous Header
  for(let r=hR; r<=hR+2; r++) {
    const row = sheet1.getRow(r);
    row.height = r === hR + 2 ? 35 : 22;
    for(let c=3; c<=lastColHaz; c++) {
      const cell = sheet1.getCell(r, c);
      cell.font = { name: 'Segoe UI', bold: true, size: 10, color: { argb: 'FFFFFFFF' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEF4444' } }; // Red Header
      cell.border = {
        top: {style:'thin', color: {argb:'FFCBD5E1'}},
        left: {style:'thin', color: {argb:'FFCBD5E1'}},
        bottom: {style:'thin', color: {argb:'FFCBD5E1'}},
        right: {style:'thin', color: {argb:'FFCBD5E1'}}
      };
      cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    }
  }
  
  rIdx = hR+3;
  const hazTotals = new Array(hazCols.length).fill(0);
  let totalHazAll = 0;

  records.forEach(rec => {
    const row = sheet1.getRow(rIdx);
    row.height = 20;
    row.getCell(3).value = rec.month;
    
    let monthTotal = 0;
    
    hazCols.forEach((col, i) => {
      const v = rec.haz[col] || 0;
      row.getCell(i+4).value = v;
      row.getCell(i+4).numFmt = '#,##0.00';
      hazTotals[i] += v;
      monthTotal += v;
    });
    
    row.getCell(4 + hazCols.length).value = monthTotal;
    row.getCell(4 + hazCols.length).numFmt = '#,##0.00';
    totalHazAll += monthTotal;
    row.getCell(4 + hazCols.length + 1).value = 'Weighed';
    
    for(let c=3; c<=lastColHaz; c++) {
      const cell = row.getCell(c);
      cell.font = { name: 'Segoe UI', size: 10 };
      cell.border = {
        top: {style:'thin', color: {argb:'FFCBD5E1'}},
        left: {style:'thin', color: {argb:'FFCBD5E1'}},
        bottom: {style:'thin', color: {argb:'FFCBD5E1'}},
        right: {style:'thin', color: {argb:'FFCBD5E1'}}
      };
      if (c === 3 || c === lastColHaz) {
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      } else {
        cell.alignment = { horizontal: 'right', vertical: 'middle' };
      }
    }
    rIdx++;
  });
  
  // Hazardous Totals Row
  const totalRowH = sheet1.getRow(rIdx);
  totalRowH.height = 22;
  totalRowH.getCell(3).value = 'Total';
  totalRowH.getCell(3).font = { name: 'Segoe UI', bold: true, size: 11 };
  
  hazTotals.forEach((v, i) => {
    totalRowH.getCell(i+4).value = v;
    totalRowH.getCell(i+4).numFmt = '#,##0.00';
  });
  
  totalRowH.getCell(4 + hazCols.length).value = totalHazAll;
  totalRowH.getCell(4 + hazCols.length).numFmt = '#,##0.00';
  totalRowH.getCell(4 + hazCols.length + 1).value = 'Weighed';
  
  totalRowH.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F5F9' } }; // Light Slate Gray

  for(let c=3; c<=lastColHaz; c++) {
    const cell = totalRowH.getCell(c);
    cell.font = { name: 'Segoe UI', bold: true, size: 11 };
    cell.border = {
      top: {style:'thin', color: {argb:'FFCBD5E1'}},
      left: {style:'thin', color: {argb:'FFCBD5E1'}},
      bottom: {style:'double', color: {argb:'FFCBD5E1'}},
      right: {style:'thin', color: {argb:'FFCBD5E1'}}
    };
    if (c === 3 || c === lastColHaz) {
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    } else {
      cell.alignment = { horizontal: 'right', vertical: 'middle' };
    }
  }

  // ==================== SHEET 2: WASTE SUMMARY ====================
  const sheet2 = workbook.addWorksheet('Waste summary');
  
  // Brand Banner Title (Merged A1:M2)
  sheet2.mergeCells('A1:M2');
  const s2Title1 = sheet2.getCell('A1');
  s2Title1.value = `WASTE SUMMARY REPORT - ${new Date().getFullYear()}`;
  s2Title1.font = { name: 'Segoe UI', bold: true, size: 16, color: { argb: 'FFFFFFFF' } };
  s2Title1.alignment = { horizontal: 'center', vertical: 'middle' };
  s2Title1.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF15803D' } }; // Dark Emerald
  sheet2.getRow(1).height = 20;
  sheet2.getRow(2).height = 20;

  // Metadata Row
  sheet2.mergeCells('A3:M3');
  const s2Meta = sheet2.getCell('A3');
  s2Meta.value = 'Company Name: Apex Apparels Ltd.  |  Responsible Person: Shahnayaz Hossain Joy (Executive-Environment)';
  s2Meta.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FF14532D' } }; // Dark Green text
  s2Meta.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDCFCE7' } }; // Light Emerald
  s2Meta.alignment = { vertical: 'middle', horizontal: 'center' };
  sheet2.getRow(3).height = 22;

  // Non-Hazardous Waste Sources Section Header
  sheet2.mergeCells('A4:M4');
  const s2Title2 = sheet2.getCell('A4');
  s2Title2.value = 'Non-Hazardous Waste Sources Summary';
  s2Title2.font = { name: 'Segoe UI', bold: true, size: 12, color: { argb: 'FF14532D' } };
  s2Title2.alignment = { horizontal: 'center', vertical: 'middle' };
  s2Title2.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDCFCE7' } }; // Light Emerald
  sheet2.getRow(4).height = 25;

  sheet2.mergeCells('A5:A7'); sheet2.getCell('A5').value = 'SL';
  sheet2.mergeCells('B5:B7'); sheet2.getCell('B5').value = 'Month';
  sheet2.mergeCells('C5:J5'); sheet2.getCell('C5').value = 'Item Name';
  sheet2.mergeCells('K5:K7'); sheet2.getCell('K5').value = 'Total Quantity\n(kg)';
  sheet2.mergeCells('L5:L7'); sheet2.getCell('L5').value = 'Method used to track waste';
  sheet2.mergeCells('M5:M7'); sheet2.getCell('M5').value = 'Remarks';

  // Row 6
  const colNames = ['Textile waste', 'Metal', 'Plastic', 'Paper', 'Food', 'Cartons', 'Glass', 'Others'];
  colNames.forEach((n, i) => sheet2.getCell(6, i+3).value = n);

  // Row 7 mappings dynamically
  let othersMapping = 'Come from (10';
  if (nonHazCols.length > 18) {
      for(let i = 19; i <= nonHazCols.length; i++) {
          othersMapping += `+${i}`;
      }
  }
  othersMapping += ')';
  
  const colMappingsText = [
    'Come from (1+5+6+8)',
    'Come from (14+15+16)',
    'Come from (4+7+9+11+12)',
    'Come from (3+13)',
    'Come from (17)',
    'Come from (2)',
    'Come from (18)',
    othersMapping
  ];
  colMappingsText.forEach((t, i) => {
    sheet2.getCell(7, i+3).value = t;
  });

  // Formatting Headers for Sheet 2
  for(let r=5; r<=7; r++) {
    sheet2.getRow(r).height = r === 7 ? 28 : 22;
    for(let c=1; c<=13; c++) {
      const cell = sheet2.getCell(r, c);
      cell.border = {
        top: {style:'thin', color: {argb:'FFCBD5E1'}},
        left: {style:'thin', color: {argb:'FFCBD5E1'}},
        bottom: {style:'thin', color: {argb:'FFCBD5E1'}},
        right: {style:'thin', color: {argb:'FFCBD5E1'}}
      };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF16A34A' } }; // Medium Emerald
      cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      cell.font = { name: 'Segoe UI', bold: true, size: 10, color: { argb: 'FFFFFFFF' } };
    }
  }
  
  sheet2.getColumn(1).width = 6;
  sheet2.getColumn(2).width = 15;
  for(let i=3; i<=10; i++) sheet2.getColumn(i).width = 15;
  sheet2.getColumn(11).width = 18;
  sheet2.getColumn(12).width = 25;
  sheet2.getColumn(13).width = 20;

  // Data Rows Sheet 2
  let s2RIdx = 8;
  const summaryTotals = new Array(8).fill(0);
  let summaryAllTotal = 0;

  records.forEach((rec, idx) => {
    const row = sheet2.getRow(s2RIdx);
    row.height = 20;
    row.getCell(1).value = idx + 1;
    row.getCell(2).value = rec.month;

    const getVal = (indices: number[]) => {
      let sum = 0;
      indices.forEach(i => {
        const colName = nonHazCols[i - 1]; // 1-based to 0-based
        if (colName) sum += (rec.nonHaz[colName] || 0);
      });
      return sum;
    }

    const textile = getVal([1, 5, 6, 8]);
    const metal = getVal([14, 15, 16]);
    const plastic = getVal([4, 7, 9, 11, 12]);
    const paper = getVal([3, 13]);
    const food = getVal([17]);
    const cartons = getVal([2]);
    const glass = getVal([18]);
    
    let others = getVal([10]);
    if (nonHazCols.length > 18) {
       for(let i = 19; i <= nonHazCols.length; i++) {
           others += getVal([i]);
       }
    }

    const vals = [textile, metal, plastic, paper, food, cartons, glass, others];
    let rowTotal = 0;
    
    vals.forEach((v, i) => {
       row.getCell(i+3).value = v;
       row.getCell(i+3).numFmt = '#,##0.00';
       summaryTotals[i] += v;
       rowTotal += v;
    });

    row.getCell(11).value = rowTotal;
    row.getCell(11).numFmt = '#,##0.00';
    summaryAllTotal += rowTotal;
    row.getCell(12).value = 'Weighed';
    row.getCell(13).value = ''; // Remarks

    for(let c=1; c<=13; c++) {
      const cell = row.getCell(c);
      cell.font = { name: 'Segoe UI', size: 10 };
      cell.border = {
        top: {style:'thin', color: {argb:'FFCBD5E1'}},
        left: {style:'thin', color: {argb:'FFCBD5E1'}},
        bottom: {style:'thin', color: {argb:'FFCBD5E1'}},
        right: {style:'thin', color: {argb:'FFCBD5E1'}}
      };
      if (c === 1 || c === 2 || c === 12 || c === 13) {
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      } else {
        cell.alignment = { horizontal: 'right', vertical: 'middle' };
      }
    }
    s2RIdx++;
  });

  // Totals Row Sheet 2
  const s2TotalRow = sheet2.getRow(s2RIdx);
  s2TotalRow.height = 22;
  s2TotalRow.getCell(2).value = 'Total';
  
  summaryTotals.forEach((v, i) => {
    s2TotalRow.getCell(i+3).value = v;
    s2TotalRow.getCell(i+3).numFmt = '#,##0.00';
  });
  s2TotalRow.getCell(11).value = summaryAllTotal;
  s2TotalRow.getCell(11).numFmt = '#,##0.00';
  s2TotalRow.getCell(12).value = 'Weighed';
  
  s2TotalRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F5F9' } }; // Light Slate Gray

  for(let c=1; c<=13; c++) {
    const cell = s2TotalRow.getCell(c);
    cell.font = { name: 'Segoe UI', bold: true, size: 11 };
    cell.border = {
      top: {style:'thin', color: {argb:'FFCBD5E1'}},
      left: {style:'thin', color: {argb:'FFCBD5E1'}},
      bottom: {style:'double', color: {argb:'FFCBD5E1'}},
      right: {style:'thin', color: {argb:'FFCBD5E1'}}
    };
    if (c === 1 || c === 2 || c === 12 || c === 13) {
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    } else {
      cell.alignment = { horizontal: 'right', vertical: 'middle' };
    }
  }

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), `Waste_Generation_Details_${new Date().getFullYear()}.xlsx`);
};

export const exportInventoryExcel = async (records: any[]) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Waste Inventory');

  // Brand Banner Title (Merged A1:V2)
  sheet.mergeCells('A1:V2');
  const titleCell = sheet.getCell('A1');
  titleCell.value = 'WASTE INVENTORY MATRIX';
  titleCell.font = { name: 'Segoe UI', size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
  titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF15803D' } }; // Dark Emerald
  titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
  sheet.getRow(1).height = 20;
  sheet.getRow(2).height = 20;

  // Metadata Row (Merged A3:V3)
  sheet.mergeCells('A3:V3');
  const metaCell = sheet.getCell('A3');
  metaCell.value = 'Name of Company: Apex Apparels Ltd.  |  Responsible Person: Shahnayaz Hossain Joy (Executive-Environment)  |  Updated: 31/08/2024';
  metaCell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FF14532D' } }; // Dark Green text
  metaCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDCFCE7' } }; // Light Emerald
  metaCell.alignment = { vertical: 'middle', horizontal: 'center' };
  sheet.getRow(3).height = 22;

  // Section Header (Merged A4:V4)
  sheet.mergeCells('A4:V4');
  const secHeader = sheet.getCell('A4');
  secHeader.value = 'Active Waste Inventory List';
  secHeader.font = { name: 'Segoe UI', bold: true, size: 12, color: { argb: 'FF14532D' } };
  secHeader.alignment = { horizontal: 'center', vertical: 'middle' };
  secHeader.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDCFCE7' } }; // Light Emerald
  sheet.getRow(4).height = 25;

  // Columns Configuration
  const columns = [
    { header: 'Sl.No', key: 'sl', width: 6 },
    { header: 'WASTE NAME', key: 'wasteName', width: 22 },
    { header: 'SOURCE OF WASTE', key: 'sourceOfWaste', width: 22 },
    { header: 'WASTE CLASSIFICATION (Non-Hazardous/Hazardous)', key: 'classification', width: 32 },
    { header: 'Monthly WASTE QUANTITY', key: 'quantity', width: 22 },
    { header: 'UNIT', key: 'unit', width: 8 },
    { header: 'Labeling', key: 'labeling', width: 12 },
    { header: 'Identification', key: 'identification', width: 15 },
    { header: 'PPE', key: 'ppe', width: 10 },
    { header: 'WASTE STORAGE REQUIREMENT', key: 'storageReq', width: 28 },
    { header: 'LOCATION OF STORAGE', key: 'location', width: 22 },
    { header: 'WASTE DISPOSAL ROUTE', key: 'disposalRoute', width: 28 },
    { header: 'APPLICABLE LEGAL PERMIT/REQUIREMENT', key: 'permit', width: 28 },
    { header: 'ON-SITE TREATMENT METHOD', key: 'treatment', width: 28 },
    { header: 'QUANTITY OF RECYCLED WASTE', key: 'recycled', width: 28 },
    { header: 'APPROVED WASTE CONTRACTOR (Name, Company, Registration)', key: 'contractor', width: 38 },
    { header: 'DATE OF LAST WASTE HANDOVER', key: 'handoverDate', width: 18 },
    { header: 'CHALLAN NO', key: 'challan', width: 15 },
    { header: 'EMERGENCY CONTACT PERSON', key: 'emergency', width: 38 },
    { header: 'CHECKED BY (NAME & DESIGNATION)', key: 'checkedBy', width: 30 },
    { header: 'CHECKED ON (DATE - FORMAT DD/MM/YYYY)', key: 'checkedOn', width: 20 },
    { header: 'REMARKS', key: 'remarks', width: 20 },
  ];
  sheet.columns = columns;

  // Insert Row 5 and 6 for Grouped Headers
  const topHeaderRow = sheet.getRow(5);
  topHeaderRow.height = 25;
  
  sheet.mergeCells('G5:I5');
  const whrCell = topHeaderRow.getCell(7);
  whrCell.value = 'WASTE HANDLING REQUIREMENT';
  whrCell.font = { name: 'Segoe UI', bold: true, size: 11, color: { argb: 'FF14532D' } };
  whrCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDCFCE7' } }; // Light Emerald
  whrCell.alignment = { horizontal: 'center', vertical: 'middle' };
  
  // Format top row borders
  for(let i=1; i<=22; i++) {
     const cell = topHeaderRow.getCell(i);
     cell.border = {
       top: {style:'thin', color: {argb:'FFCBD5E1'}},
       left: {style:'thin', color: {argb:'FFCBD5E1'}},
       bottom: {style:'thin', color: {argb:'FFCBD5E1'}},
       right: {style:'thin', color: {argb:'FFCBD5E1'}}
     };
     if(i < 7 || i > 9) {
        sheet.mergeCells(5, i, 6, i); // vertical merge for columns without grouping
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF16A34A' } }; // Medium Emerald
        cell.font = { name: 'Segoe UI', bold: true, size: 10, color: { argb: 'FFFFFFFF' } };
        cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
     }
  }

  // Row 6 Subheaders
  const subHeaderRow = sheet.getRow(6);
  subHeaderRow.height = 55; // Tall row for wrapped subheaders
  columns.forEach((col, i) => {
    const cell = subHeaderRow.getCell(i+1);
    if (i+1 >= 7 && i+1 <= 9) {
      cell.value = col.header;
      cell.font = { name: 'Segoe UI', bold: true, size: 10, color: { argb: 'FFFFFFFF' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF16A34A' } }; // Medium Emerald
      cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    }
    cell.border = {
      top: {style:'thin', color: {argb:'FFCBD5E1'}},
      left: {style:'thin', color: {argb:'FFCBD5E1'}},
      bottom: {style:'thin', color: {argb:'FFCBD5E1'}},
      right: {style:'thin', color: {argb:'FFCBD5E1'}}
    };
  });

  // Data rows
  let rIdx = 7;
  records.forEach((record, index) => {
    const row = sheet.getRow(rIdx);
    row.height = 20;
    row.values = [
      index + 1,
      record.wasteName,
      record.sourceOfWaste,
      record.wasteClassification,
      record.quantity,
      record.unit,
      record.labeling,
      record.identification,
      record.ppe,
      record.wasteStorageRequirement,
      record.locationOfStorage,
      record.wasteDisposalRoute,
      record.applicableLegalPermit,
      record.onSiteTreatmentMethod,
      record.quantityOfRecycledWaste,
      record.approvedWasteContractor,
      record.dateOfLastWasteHandover,
      record.challanNo,
      record.emergencyContactPerson,
      record.checkedBy,
      record.checkedOn,
      record.remarks
    ];

    row.getCell(5).numFmt = '#,##0.00';

    for(let i=1; i<=22; i++) {
       const cell = row.getCell(i);
       cell.font = { name: 'Segoe UI', size: 10 };
       cell.border = {
         top: {style:'thin', color: {argb:'FFCBD5E1'}},
         left: {style:'thin', color: {argb:'FFCBD5E1'}},
         bottom: {style:'thin', color: {argb:'FFCBD5E1'}},
         right: {style:'thin', color: {argb:'FFCBD5E1'}}
       };
       if (i === 5) {
         cell.alignment = { horizontal: 'right', vertical: 'middle' };
       } else if (i === 2 || i === 3 || i === 10 || i === 11 || i === 12 || i === 13 || i === 14 || i === 15 || i === 16 || i === 19 || i === 20) {
         cell.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };
       } else {
         cell.alignment = { horizontal: 'center', vertical: 'middle' };
       }
    }
    rIdx++;
  });

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), `Waste_Matrix_Inventory_${new Date().toISOString().split('T')[0]}.xlsx`);
};

// 3. Export Waste Recycle Details
export const exportRecycleExcel = async (records: RecycleRecord[]) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Recycled Waste');

  // Brand Banner Title (Merged A1:E2)
  sheet.mergeCells('A1:E2');
  const titleCell = sheet.getCell('A1');
  titleCell.value = 'RECYCLED WASTE & REVENUE REPORT';
  titleCell.font = { name: 'Segoe UI', size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
  titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF15803D' } }; // Dark Emerald
  titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
  sheet.getRow(1).height = 20;
  sheet.getRow(2).height = 20;

  // Metadata Row (Merged A3:E3)
  sheet.mergeCells('A3:E3');
  const metaCell = sheet.getCell('A3');
  metaCell.value = 'Company Name: Apex Apparels Ltd.  |  Responsible Person: Shahnayaz Hossain Joy (Executive-Environment)';
  metaCell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FF14532D' } }; // Dark Green text
  metaCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDCFCE7' } }; // Light Emerald
  metaCell.alignment = { vertical: 'middle', horizontal: 'center' };
  sheet.getRow(3).height = 22;

  sheet.getRow(4).height = 15; // Spacer row

  // Headers (Row 5)
  sheet.columns = [
    { header: 'Date', key: 'date', width: 15 },
    { header: 'Material Type', key: 'materialType', width: 25 },
    { header: 'Quantity (kg)', key: 'quantity', width: 20 },
    { header: 'Recycling Vendor', key: 'vendor', width: 30 },
    { header: 'Revenue ($)', key: 'revenue', width: 20 },
  ];

  const headerRow = sheet.getRow(5);
  headerRow.height = 30;
  headerRow.values = ['Date', 'Material Type', 'Quantity (kg)', 'Recycling Vendor', 'Revenue ($)'];
  applyHeaderStyle(headerRow, 'FF16A34A'); // Medium Emerald Header

  // Data
  records.forEach((record) => {
    const row = sheet.addRow({
      date: record.date,
      materialType: record.materialType,
      quantity: record.quantity,
      vendor: record.vendor,
      revenue: record.revenue,
    });
    row.height = 20;
    applyDataStyle(row);
    row.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
    row.getCell(2).alignment = { horizontal: 'left', vertical: 'middle' };
    row.getCell(3).alignment = { horizontal: 'right', vertical: 'middle' };
    row.getCell(3).numFmt = '#,##0.00';
    row.getCell(4).alignment = { horizontal: 'left', vertical: 'middle' };
    row.getCell(5).alignment = { horizontal: 'right', vertical: 'middle' };
    row.getCell(5).numFmt = '$#,##0.00';
  });

  // Total Row
  const totalQty = records.reduce((sum, r) => sum + r.quantity, 0);
  const totalRev = records.reduce((sum, r) => sum + r.revenue, 0);
  
  const totalRow = sheet.addRow({
    date: 'TOTAL',
    materialType: '',
    quantity: totalQty,
    vendor: '',
    revenue: totalRev,
  });
  totalRow.height = 22;
  applyDataStyle(totalRow);
  
  totalRow.getCell(1).font = { name: 'Segoe UI', bold: true, size: 11 };
  totalRow.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
  totalRow.getCell(3).font = { name: 'Segoe UI', bold: true, size: 11 };
  totalRow.getCell(3).numFmt = '#,##0.00';
  totalRow.getCell(3).alignment = { horizontal: 'right', vertical: 'middle' };
  totalRow.getCell(5).font = { name: 'Segoe UI', bold: true, size: 11 };
  totalRow.getCell(5).numFmt = '$#,##0.00';
  totalRow.getCell(5).alignment = { horizontal: 'right', vertical: 'middle' };

  totalRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F5F9' } }; // Light Slate Gray

  for(let c=1; c<=5; c++) {
    totalRow.getCell(c).border = {
      top: { style: 'thin', color: { argb: 'FFCBD5E1' } },
      left: { style: 'thin', color: { argb: 'FFCBD5E1' } },
      bottom: { style: 'double', color: { argb: 'FFCBD5E1' } },
      right: { style: 'thin', color: { argb: 'FFCBD5E1' } }
    };
  }

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), `Recycled_Waste_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
};
