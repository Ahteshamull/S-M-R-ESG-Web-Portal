import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export interface EnergyExcelData {
  energyLogs: any[];
  totalGas: number;
  totalDiesel: number;
  totalElectricity: number;
  totalShipped: number;
}

export async function exportEnergyToExcel(data: EnergyExcelData) {
  const { energyLogs, totalGas, totalDiesel, totalElectricity, totalShipped } = data;

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Energy Consumption');

  // Columns Width
  sheet.columns = [
    { width: 12 }, // A - Month
    { width: 15 }, // B - Gas Cons
    { width: 15 }, // C - Gas Shipped
    { width: 12 }, // D - Gas KPI
    { width: 15 }, // E - Diesel Cons
    { width: 15 }, // F - Diesel Shipped
    { width: 12 }, // G - Diesel KPI
    { width: 18 }, // H - Elec Cons
    { width: 15 }, // I - Elec Shipped
    { width: 12 }, // J - Elec KPI
  ];

  // Title
  sheet.mergeCells('A1:J2');
  const titleCell = sheet.getCell('A1');
  titleCell.value = 'ENERGY CONSUMPTION & KPI REPORT (YTD)';
  titleCell.font = { name: 'Arial', size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
  titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF004B87' } };
  titleCell.alignment = { vertical: 'middle', horizontal: 'center' };

  // Headers (Group Level)
  sheet.mergeCells('A4:A5');
  sheet.getCell('A4').value = 'Month';
  
  sheet.mergeCells('B4:D4');
  sheet.getCell('B4').value = 'Natural Gas';
  sheet.getCell('B4').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFE6CC' } }; // Light Orange
  sheet.getCell('B4').font = { color: { argb: 'FFD97706' }, bold: true };
  
  sheet.mergeCells('E4:G4');
  sheet.getCell('E4').value = 'Diesel (Generators)';
  sheet.getCell('E4').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF3F4F6' } }; // Light Gray
  sheet.getCell('E4').font = { color: { argb: 'FF4B5563' }, bold: true };
  
  sheet.mergeCells('H4:J4');
  sheet.getCell('H4').value = 'Purchased Electricity';
  sheet.getCell('H4').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD1FAE5' } }; // Light Emerald
  sheet.getCell('H4').font = { color: { argb: 'FF059669' }, bold: true };

  // Sub-Headers
  const subHeaders = [
    'Cons. (m³)', 'Shipped (Pcs)', 'KPI',
    'Cons. (Ltr)', 'Shipped (Pcs)', 'KPI',
    'Cons. (kWh)', 'Shipped (Pcs)', 'KPI'
  ];

  subHeaders.forEach((header, index) => {
    const col = String.fromCharCode(66 + index); // Starts at B (66)
    sheet.getCell(`${col}5`).value = header;
  });

  // Style Headers
  for (let r = 4; r <= 5; r++) {
    for (let c = 1; c <= 10; c++) {
      const cell = sheet.getCell(r, c);
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      if (!cell.font) cell.font = { bold: true };
      cell.border = {
        top: { style: 'thin' }, left: { style: 'thin' },
        bottom: { style: 'thin' }, right: { style: 'thin' }
      };
    }
  }

  // Add Data Rows
  let currentRow = 6;
  energyLogs.forEach(log => {
    const row = sheet.getRow(currentRow);
    row.getCell(1).value = log.month;
    row.getCell(1).alignment = { horizontal: 'center' };
    
    // Gas
    row.getCell(2).value = log.gas;
    row.getCell(3).value = log.shipped;
    row.getCell(4).value = log.shipped > 0 ? (log.gas / log.shipped) : 0;
    
    // Diesel
    row.getCell(5).value = log.diesel;
    row.getCell(6).value = log.shipped;
    row.getCell(7).value = log.shipped > 0 ? (log.diesel / log.shipped) : 0;
    
    // Electricity
    row.getCell(8).value = log.electricity;
    row.getCell(9).value = log.shipped;
    row.getCell(10).value = log.shipped > 0 ? (log.electricity / log.shipped) : 0;

    // Number formatting
    [2,3,5,6,8,9].forEach(col => {
      row.getCell(col).numFmt = '#,##0.00';
    });
    [4,7,10].forEach(col => {
      row.getCell(col).numFmt = '0.00000'; // 5 decimal places for KPI
    });

    for (let c = 1; c <= 10; c++) {
      row.getCell(c).border = {
        top: { style: 'thin' }, left: { style: 'thin' },
        bottom: { style: 'thin' }, right: { style: 'thin' }
      };
    }
    
    currentRow++;
  });

  // Total Row
  const totalRow = sheet.getRow(currentRow);
  totalRow.getCell(1).value = 'TOTAL YTD';
  totalRow.getCell(1).font = { bold: true };
  totalRow.getCell(1).alignment = { horizontal: 'center' };

  totalRow.getCell(2).value = totalGas;
  totalRow.getCell(3).value = totalShipped;
  totalRow.getCell(4).value = totalShipped > 0 ? (totalGas / totalShipped) : 0;
  
  totalRow.getCell(5).value = totalDiesel;
  totalRow.getCell(6).value = totalShipped;
  totalRow.getCell(7).value = totalShipped > 0 ? (totalDiesel / totalShipped) : 0;
  
  totalRow.getCell(8).value = totalElectricity;
  totalRow.getCell(9).value = totalShipped;
  totalRow.getCell(10).value = totalShipped > 0 ? (totalElectricity / totalShipped) : 0;

  totalRow.font = { bold: true };
  totalRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF3F4F6' } };

  [2,3,5,6,8,9].forEach(col => totalRow.getCell(col).numFmt = '#,##0.00');
  [4,7,10].forEach(col => totalRow.getCell(col).numFmt = '0.00000');

  for (let c = 1; c <= 10; c++) {
    totalRow.getCell(c).border = {
      top: { style: 'medium' }, left: { style: 'thin' },
      bottom: { style: 'medium' }, right: { style: 'thin' }
    };
  }

  // Export
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, 'Energy_Consumption_Report_YTD.xlsx');
}
