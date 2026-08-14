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
  // Title
  sheet.mergeCells('A1:J2');
  const titleCell = sheet.getCell('A1');
  titleCell.value = 'ENERGY CONSUMPTION & KPI REPORT (YTD)';
  titleCell.font = { name: 'Segoe UI', size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
  titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF15803D' } }; // Dark Emerald
  titleCell.alignment = { vertical: 'middle', horizontal: 'center' };

  // Metadata Row
  sheet.mergeCells('A3:J3');
  const metaCell = sheet.getCell('A3');
  metaCell.value = 'Company Name: Apex Apparels Ltd.  |  Responsible Person: John Smith (Sustainability Manager)';
  metaCell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FF14532D' } }; // Dark Green text
  metaCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDCFCE7' } }; // Light Emerald
  metaCell.alignment = { vertical: 'middle', horizontal: 'center' };

  // Headers (Group Level)
  sheet.mergeCells('A4:A5');
  const monthHeader = sheet.getCell('A4');
  monthHeader.value = 'Month';
  monthHeader.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF15803D' } };
  monthHeader.font = { name: 'Segoe UI', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
  
  sheet.mergeCells('B4:D4');
  const gasHeader = sheet.getCell('B4');
  gasHeader.value = 'Natural Gas';
  gasHeader.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDCFCE7' } };
  gasHeader.font = { name: 'Segoe UI', color: { argb: 'FF14532D' }, bold: true, size: 11 };
  
  sheet.mergeCells('E4:G4');
  const dieselHeader = sheet.getCell('E4');
  dieselHeader.value = 'Diesel (Generators)';
  dieselHeader.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDCFCE7' } };
  dieselHeader.font = { name: 'Segoe UI', color: { argb: 'FF14532D' }, bold: true, size: 11 };
  
  sheet.mergeCells('H4:J4');
  const elecHeader = sheet.getCell('H4');
  elecHeader.value = 'Purchased Electricity';
  elecHeader.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDCFCE7' } };
  elecHeader.font = { name: 'Segoe UI', color: { argb: 'FF14532D' }, bold: true, size: 11 };

  // Sub-Headers
  const subHeaders = [
    'Cons. (m³)', 'Shipped (Pcs)', 'KPI',
    'Cons. (Ltr)', 'Shipped (Pcs)', 'KPI',
    'Cons. (kWh)', 'Shipped (Pcs)', 'KPI'
  ];

  subHeaders.forEach((header, index) => {
    const col = String.fromCharCode(66 + index); // Starts at B (66)
    const cell = sheet.getCell(`${col}5`);
    cell.value = header;
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF16A34A' } }; // Medium Emerald
    cell.font = { name: 'Segoe UI', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
  });

  // Style Headers Borders & Alignment
  for (let r = 4; r <= 5; r++) {
    for (let c = 1; c <= 10; c++) {
      const cell = sheet.getCell(r, c);
      cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFCBD5E1' } },
        left: { style: 'thin', color: { argb: 'FFCBD5E1' } },
        bottom: { style: 'thin', color: { argb: 'FFCBD5E1' } },
        right: { style: 'thin', color: { argb: 'FFCBD5E1' } }
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
      const cell = row.getCell(c);
      cell.font = { name: 'Segoe UI', size: 10 };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFCBD5E1' } },
        left: { style: 'thin', color: { argb: 'FFCBD5E1' } },
        bottom: { style: 'thin', color: { argb: 'FFCBD5E1' } },
        right: { style: 'thin', color: { argb: 'FFCBD5E1' } }
      };
      if (c > 1) {
        cell.alignment = { horizontal: 'right', vertical: 'middle' };
      } else {
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      }
    }
    
    currentRow++;
  });

  // Total Row
  const totalRow = sheet.getRow(currentRow);
  totalRow.getCell(1).value = 'TOTAL YTD';
  totalRow.getCell(1).font = { name: 'Segoe UI', size: 11, bold: true };
  totalRow.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };

  totalRow.getCell(2).value = totalGas;
  totalRow.getCell(3).value = totalShipped;
  totalRow.getCell(4).value = totalShipped > 0 ? (totalGas / totalShipped) : 0;
  
  totalRow.getCell(5).value = totalDiesel;
  totalRow.getCell(6).value = totalShipped;
  totalRow.getCell(7).value = totalShipped > 0 ? (totalDiesel / totalShipped) : 0;
  
  totalRow.getCell(8).value = totalElectricity;
  totalRow.getCell(9).value = totalShipped;
  totalRow.getCell(10).value = totalShipped > 0 ? (totalElectricity / totalShipped) : 0;

  totalRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F5F9' } }; // Light Gray Totals

  [2,3,5,6,8,9].forEach(col => totalRow.getCell(col).numFmt = '#,##0.00');
  [4,7,10].forEach(col => totalRow.getCell(col).numFmt = '0.00000');

  for (let c = 1; c <= 10; c++) {
    const cell = totalRow.getCell(c);
    cell.font = { name: 'Segoe UI', size: 11, bold: true };
    cell.border = {
      top: { style: 'thin', color: { argb: 'FFCBD5E1' } },
      left: { style: 'thin', color: { argb: 'FFCBD5E1' } },
      bottom: { style: 'double', color: { argb: 'FFCBD5E1' } },
      right: { style: 'thin', color: { argb: 'FFCBD5E1' } }
    };
    if (c > 1) {
      cell.alignment = { horizontal: 'right', vertical: 'middle' };
    }
  }

  // Export
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, 'Energy_Consumption_Report_YTD.xlsx');
}
