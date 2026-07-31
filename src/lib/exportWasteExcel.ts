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

const applyHeaderStyle = (row: ExcelJS.Row, color: string = 'FF10B981') => {
  row.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  row.alignment = { vertical: 'middle', horizontal: 'center' };
  row.eachCell((cell) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: color }
    };
    cell.border = {
      top: { style: 'thin' }, left: { style: 'thin' },
      bottom: { style: 'thin' }, right: { style: 'thin' }
    };
  });
};

const applyDataStyle = (row: ExcelJS.Row) => {
  row.alignment = { vertical: 'middle', horizontal: 'left' };
  row.eachCell((cell) => {
    cell.border = {
      top: { style: 'thin' }, left: { style: 'thin' },
      bottom: { style: 'thin' }, right: { style: 'thin' }
    };
  });
};

export const exportWasteGenerationExcel = async (records: WasteGenerationRecord[], nonHazCols: string[], hazCols: string[]) => {
  const workbook = new ExcelJS.Workbook();
  const sheet1 = workbook.addWorksheet('Waste generation details');
  
  // Sheet 1: Generation Details
  sheet1.mergeCells(1, 1, 1, 3 + nonHazCols.length + 2 - 1);
  const title1 = sheet1.getCell('A1');
  title1.value = `Waste generation details- ${new Date().getFullYear()}`;
  title1.font = { bold: true, size: 14 };
  title1.alignment = { horizontal: 'center', vertical: 'middle' };

  // Non-Hazardous Block
  sheet1.mergeCells(2, 1, 2, 3 + nonHazCols.length + 2 - 1);
  const nonHazTitle = sheet1.getCell('A2');
  nonHazTitle.value = 'Non-Hazardous Waste';
  nonHazTitle.font = { bold: true, size: 12 };
  nonHazTitle.alignment = { horizontal: 'center', vertical: 'middle' };
  nonHazTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFC4D79B' } }; // Green
  
  sheet1.mergeCells('A3:A5');
  sheet1.getCell('A3').value = 'Month';
  
  sheet1.mergeCells(3, 2, 3, 2 + nonHazCols.length - 1);
  sheet1.getCell(3, 2).value = 'Item Name';
  
  sheet1.mergeCells(3, 2 + nonHazCols.length, 5, 2 + nonHazCols.length);
  sheet1.getCell(3, 2 + nonHazCols.length).value = 'Total Quantity';
  
  sheet1.mergeCells(3, 2 + nonHazCols.length + 1, 5, 2 + nonHazCols.length + 1);
  sheet1.getCell(3, 2 + nonHazCols.length + 1).value = 'Method was used to track this waste source';
  
  nonHazCols.forEach((col, i) => {
    sheet1.getCell(4, i+2).value = i+1;
    sheet1.getCell(5, i+2).value = col;
  });

  // Borders & Alignment for Header
  for(let r=3; r<=5; r++) {
    for(let c=1; c<=1 + nonHazCols.length + 2; c++) {
      const cell = sheet1.getCell(r, c);
      cell.border = { top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'} };
      cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    }
  }

  // Data rows
  let rIdx = 6;
  const nonHazTotals = new Array(nonHazCols.length).fill(0);
  let totalNonHazAll = 0;

  records.forEach(rec => {
    const row = sheet1.getRow(rIdx);
    row.getCell(1).value = rec.month;
    
    let monthTotal = 0;
    
    nonHazCols.forEach((col, i) => {
      const v = rec.nonHaz[col] || 0;
      row.getCell(i+2).value = v;
      nonHazTotals[i] += v;
      monthTotal += v;
    });
    
    row.getCell(1 + nonHazCols.length + 1).value = monthTotal;
    totalNonHazAll += monthTotal;
    row.getCell(1 + nonHazCols.length + 2).value = 'Weighed';
    
    for(let c=1; c<=1 + nonHazCols.length + 2; c++) {
      const cell = row.getCell(c);
      cell.border = { top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'} };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    }
    rIdx++;
  });

  // Totals Row
  const totalRow = sheet1.getRow(rIdx);
  totalRow.getCell(1).value = 'Total';
  totalRow.getCell(1).font = { bold: true };
  nonHazTotals.forEach((v, i) => {
    totalRow.getCell(i+2).value = v;
    totalRow.getCell(i+2).font = { bold: true };
  });
  totalRow.getCell(1 + nonHazCols.length + 1).value = totalNonHazAll;
  totalRow.getCell(1 + nonHazCols.length + 1).font = { bold: true };
  totalRow.getCell(1 + nonHazCols.length + 2).value = 'Weighed';
  for(let c=1; c<=1 + nonHazCols.length + 2; c++) {
    totalRow.getCell(c).border = { top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'} };
    totalRow.getCell(c).alignment = { horizontal: 'center', vertical: 'middle' };
  }
  
  // Hazardous Block
  rIdx += 3;
  sheet1.mergeCells(rIdx, 4, rIdx, 4 + hazCols.length - 1 + 2);
  const hazTitle = sheet1.getCell(rIdx, 4);
  hazTitle.value = 'Hazardous Waste';
  hazTitle.font = { bold: true, size: 12 };
  hazTitle.alignment = { horizontal: 'center', vertical: 'middle' };
  hazTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDA9694' } }; // Red
  
  const hR = rIdx + 1;
  sheet1.mergeCells(hR, 3, hR + 2, 3);
  sheet1.getCell(hR, 3).value = 'Month';
  
  sheet1.mergeCells(hR, 4, hR, 4 + hazCols.length - 1);
  sheet1.getCell(hR, 4).value = 'Item Name';
  
  sheet1.mergeCells(hR, 4 + hazCols.length, hR + 2, 4 + hazCols.length);
  sheet1.getCell(hR, 4 + hazCols.length).value = 'Total Quantity';
  
  sheet1.mergeCells(hR, 4 + hazCols.length + 1, hR + 2, 4 + hazCols.length + 1);
  sheet1.getCell(hR, 4 + hazCols.length + 1).value = 'Method was used to track this waste source';
  
  hazCols.forEach((col, i) => {
    sheet1.getCell(hR+1, i+4).value = i+1;
    sheet1.getCell(hR+2, i+4).value = col;
  });

  for(let r=hR; r<=hR+2; r++) {
    for(let c=3; c<=4 + hazCols.length + 1; c++) {
      const cell = sheet1.getCell(r, c);
      cell.border = { top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'} };
      cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    }
  }
  
  rIdx = hR+3;
  const hazTotals = new Array(hazCols.length).fill(0);
  let totalHazAll = 0;

  records.forEach((rec, idx) => {
    const row = sheet1.getRow(rIdx);
    row.getCell(3).value = rec.month;
    
    let monthTotal = 0;
    
    hazCols.forEach((col, i) => {
      const v = rec.haz[col] || 0;
      row.getCell(i+4).value = v;
      hazTotals[i] += v;
      monthTotal += v;
    });
    
    row.getCell(4 + hazCols.length).value = monthTotal;
    totalHazAll += monthTotal;
    row.getCell(4 + hazCols.length + 1).value = 'Weighed';
    
    for(let c=3; c<=4 + hazCols.length + 1; c++) {
      const cell = row.getCell(c);
      cell.border = { top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'} };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    }
    rIdx++;
  });
  
  const totalRowH = sheet1.getRow(rIdx);
  totalRowH.getCell(3).value = 'Total';
  totalRowH.getCell(3).font = { bold: true };
  hazTotals.forEach((v, i) => {
    totalRowH.getCell(i+4).value = v;
    totalRowH.getCell(i+4).font = { bold: true };
  });
  totalRowH.getCell(4 + hazCols.length).value = totalHazAll;
  totalRowH.getCell(4 + hazCols.length).font = { bold: true };
  totalRowH.getCell(4 + hazCols.length + 1).value = 'Weighed';
  for(let c=3; c<=4 + hazCols.length + 1; c++) {
    totalRowH.getCell(c).border = { top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'} };
    totalRowH.getCell(c).alignment = { horizontal: 'center', vertical: 'middle' };
  }
  // --- SHEET 2: WASTE SUMMARY ---
  const sheet2 = workbook.addWorksheet('Waste summary');
  
  sheet2.mergeCells('A1:M1');
  const s2Title1 = sheet2.getCell('A1');
  s2Title1.value = `Waste summary-${new Date().getFullYear()}`;
  s2Title1.font = { bold: true, size: 14 };
  s2Title1.alignment = { horizontal: 'center', vertical: 'middle' };

  sheet2.mergeCells('A2:M2');
  const s2Title2 = sheet2.getCell('A2');
  s2Title2.value = 'Non-Hazardous Waste Sources';
  s2Title2.font = { bold: true, size: 12 };
  s2Title2.alignment = { horizontal: 'center', vertical: 'middle' };
  s2Title2.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFC4D79B' } }; // Green

  sheet2.mergeCells('A3:A5'); sheet2.getCell('A3').value = 'SL';
  sheet2.mergeCells('B3:B5'); sheet2.getCell('B3').value = 'Month';
  sheet2.mergeCells('C3:J3'); sheet2.getCell('C3').value = 'Item Name';
  sheet2.mergeCells('K3:K5'); sheet2.getCell('K3').value = 'Total Quantity';
  sheet2.mergeCells('L3:L5'); sheet2.getCell('L3').value = 'Method was used to track this waste source';
  sheet2.mergeCells('M3:M5'); sheet2.getCell('M3').value = 'Remarks';

  // Row 4
  const colNames = ['Textile waste', 'Metal', 'Plastic', 'Paper', 'Food', 'Cartons', 'Glass', 'Others'];
  colNames.forEach((n, i) => sheet2.getCell(4, i+3).value = n);

  // Row 5 mappings dynamically
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
    sheet2.getCell(5, i+3).value = t;
  });

  // Formatting Headers
  for(let r=3; r<=5; r++) {
    for(let c=1; c<=13; c++) {
      const cell = sheet2.getCell(r, c);
      cell.border = { top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'} };
      cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      if (r === 3 || r === 4) cell.font = { bold: true };
    }
  }
  
  sheet2.getColumn(2).width = 15;
  for(let i=3; i<=10; i++) sheet2.getColumn(i).width = 12;
  sheet2.getColumn(11).width = 15;
  sheet2.getColumn(12).width = 25;
  sheet2.getColumn(13).width = 20;

  // Data Rows
  let s2RIdx = 6;
  const summaryTotals = new Array(8).fill(0);
  let summaryAllTotal = 0;

  records.forEach((rec, idx) => {
    const row = sheet2.getRow(s2RIdx);
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
       summaryTotals[i] += v;
       rowTotal += v;
    });

    row.getCell(11).value = rowTotal;
    summaryAllTotal += rowTotal;
    row.getCell(12).value = 'Weighed';
    row.getCell(13).value = ''; // Remarks

    for(let c=1; c<=13; c++) {
      const cell = row.getCell(c);
      cell.border = { top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'} };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    }
    s2RIdx++;
  });

  const s2TotalRow = sheet2.getRow(s2RIdx);
  s2TotalRow.getCell(2).value = 'Total';
  s2TotalRow.getCell(2).font = { bold: true };
  summaryTotals.forEach((v, i) => {
    s2TotalRow.getCell(i+3).value = v;
    s2TotalRow.getCell(i+3).font = { bold: true };
  });
  s2TotalRow.getCell(11).value = summaryAllTotal;
  s2TotalRow.getCell(11).font = { bold: true };
  
  for(let c=1; c<=13; c++) {
    const cell = s2TotalRow.getCell(c);
    cell.border = { top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'} };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
  }

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), `Waste_Generation_Details_${new Date().getFullYear()}.xlsx`);
};

export const exportInventoryExcel = async (records: InventoryRecord[]) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Waste Inventory');

  // Title
  sheet.mergeCells('A1:F1');
  const titleCell = sheet.getCell('A1');
  titleCell.value = 'Current Waste Inventory Report';
  titleCell.font = { bold: true, size: 16, color: { argb: 'FF10B981' } }; // Emerald tint
  titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
  
  sheet.getRow(1).height = 30;
  sheet.getRow(2).height = 15; // spacer

  // Headers
  sheet.columns = [
    { header: 'Date Logged', key: 'date', width: 15 },
    { header: 'Type of Waste', key: 'wasteType', width: 25 },
    { header: 'Quantity', key: 'quantity', width: 15 },
    { header: 'Unit', key: 'unit', width: 10 },
    { header: 'Storage Area', key: 'storageArea', width: 25 },
    { header: 'Notes', key: 'notes', width: 35 },
  ];

  const headerRow = sheet.getRow(3);
  headerRow.values = ['Date Logged', 'Type of Waste', 'Quantity', 'Unit', 'Storage Area', 'Notes'];
  applyHeaderStyle(headerRow, 'FF10B981'); // Emerald Header

  // Data
  records.forEach((record) => {
    const row = sheet.addRow({
      date: record.date,
      wasteType: record.wasteType,
      quantity: record.quantity,
      unit: record.unit,
      storageArea: record.storageArea,
      notes: record.notes,
    });
    applyDataStyle(row);
  });

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), `Waste_Inventory_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
};

export const exportRecycleExcel = async (records: RecycleRecord[]) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Recycled Waste');

  // Title
  sheet.mergeCells('A1:E1');
  const titleCell = sheet.getCell('A1');
  titleCell.value = 'Recycled Waste & Revenue Report';
  titleCell.font = { bold: true, size: 16, color: { argb: 'FFF97316' } }; // Orange tint
  titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
  
  sheet.getRow(1).height = 30;
  sheet.getRow(2).height = 15; // spacer

  // Headers
  sheet.columns = [
    { header: 'Date', key: 'date', width: 15 },
    { header: 'Material Type', key: 'materialType', width: 25 },
    { header: 'Quantity (kg)', key: 'quantity', width: 20 },
    { header: 'Recycling Vendor', key: 'vendor', width: 30 },
    { header: 'Revenue ($)', key: 'revenue', width: 20 },
  ];

  const headerRow = sheet.getRow(3);
  headerRow.values = ['Date', 'Material Type', 'Quantity (kg)', 'Recycling Vendor', 'Revenue ($)'];
  applyHeaderStyle(headerRow, 'FFF97316'); // Orange Header

  // Data
  records.forEach((record) => {
    const row = sheet.addRow({
      date: record.date,
      materialType: record.materialType,
      quantity: record.quantity,
      vendor: record.vendor,
      revenue: record.revenue,
    });
    applyDataStyle(row);
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
  totalRow.font = { bold: true };
  applyDataStyle(totalRow);

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), `Recycled_Waste_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
};
