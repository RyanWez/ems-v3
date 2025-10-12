import { Employee } from "../types/employee";
import * as XLSX from "xlsx";

/**
 * Calculate service years from join date
 */
const calculateServiceYears = (joinDate: string): string => {
  const join = new Date(joinDate);
  const now = new Date();
  const years = now.getFullYear() - join.getFullYear();
  const months = now.getMonth() - join.getMonth();
  const days = now.getDate() - join.getDate();

  let totalYears = years;
  let totalMonths = months;

  if (days < 0) {
    totalMonths -= 1;
  }

  if (totalMonths < 0) {
    totalYears -= 1;
    totalMonths += 12;
  }

  const yearText = totalYears > 0 ? `${totalYears} Y` : "";
  const monthText = totalMonths > 0 ? `${totalMonths} M` : "";
  const dayText = days > 0 ? `${days} D` : "";

  return [yearText, monthText, dayText].filter(Boolean).join(", ");
};

/**
 * Convert employees data to CSV format
 */
export const convertToCSV = (employees: Employee[]): string => {
  // Define CSV headers
  const headers = [
    "NAME",
    "JOIN DATE",
    "SERVICE YEARS",
    "GENDER",
    "DOB",
    "PHONE NO.",
    "POSITION",
  ];

  // Create CSV rows
  const rows = employees.map((employee) => {
    const serviceYears = calculateServiceYears(employee.joinDate);

    return [
      employee.name,
      employee.joinDate,
      serviceYears,
      employee.gender,
      employee.dob,
      employee.phone,
      employee.position,
    ]
      .map((field) => {
        // Escape fields that contain commas, quotes, or newlines
        const fieldStr = String(field);
        if (
          fieldStr.includes(",") ||
          fieldStr.includes('"') ||
          fieldStr.includes("\n")
        ) {
          return `"${fieldStr.replace(/"/g, '""')}"`;
        }
        return fieldStr;
      })
      .join(",");
  });

  // Combine headers and rows
  return [headers.join(","), ...rows].join("\n");
};

/**
 * Download CSV file
 */
export const downloadCSV = (
  csvContent: string,
  filename: string = "employees.csv"
): void => {
  // Create a Blob from the CSV content
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  // Create a temporary download link
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";

  // Append to body, click, and remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up the URL object
  URL.revokeObjectURL(url);
};

/**
 * Export employees to CSV file
 */
export const exportEmployeesToCSV = (employees: Employee[]): void => {
  if (employees.length === 0) {
    alert("No employees to export");
    return;
  }

  const csvContent = convertToCSV(employees);
  const timestamp = new Date().toISOString().split("T")[0];
  const filename = `employees_${timestamp}.csv`;

  downloadCSV(csvContent, filename);
};

/**
 * Export employees to Excel file with formatting
 */
export const exportEmployeesToExcel = (employees: Employee[]): void => {
  if (employees.length === 0) {
    alert("No employees to export");
    return;
  }

  // Prepare data for Excel
  const excelData = employees.map((employee, index) => ({
    "No.": index + 1,
    Name: employee.name,
    "Join Date": employee.joinDate,
    "Service Years": calculateServiceYears(employee.joinDate),
    Gender: employee.gender,
    "Date of Birth": employee.dob,
    "Phone Number": employee.phone,
    Position: employee.position,
  }));

  // Create workbook and worksheet
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(excelData);

  // Set column widths
  const colWidths = [
    { wch: 6 }, // No.
    { wch: 25 }, // Name
    { wch: 12 }, // Join Date
    { wch: 15 }, // Service Years
    { wch: 10 }, // Gender
    { wch: 12 }, // Date of Birth
    { wch: 15 }, // Phone Number
    { wch: 20 }, // Position
  ];
  ws["!cols"] = colWidths;

  // Apply header styling
  const range = XLSX.utils.decode_range(ws["!ref"] || "A1");

  // Style header row (row 0)
  for (let col = range.s.c; col <= range.e.c; col++) {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
    if (!ws[cellAddress]) continue;

    ws[cellAddress].s = {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "4472C4" } },
      alignment: { horizontal: "center", vertical: "center" },
      border: {
        top: { style: "thin", color: { rgb: "000000" } },
        bottom: { style: "thin", color: { rgb: "000000" } },
        left: { style: "thin", color: { rgb: "000000" } },
        right: { style: "thin", color: { rgb: "000000" } },
      },
    };
  }

  // Apply alternating row colors and borders to data rows
  for (let row = range.s.r + 1; row <= range.e.r; row++) {
    const isEvenRow = row % 2 === 0;

    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
      if (!ws[cellAddress]) continue;

      ws[cellAddress].s = {
        fill: { fgColor: { rgb: isEvenRow ? "F2F2F2" : "FFFFFF" } },
        alignment: {
          horizontal: col === 0 ? "center" : "left",
          vertical: "center",
        },
        border: {
          top: { style: "thin", color: { rgb: "D3D3D3" } },
          bottom: { style: "thin", color: { rgb: "D3D3D3" } },
          left: { style: "thin", color: { rgb: "D3D3D3" } },
          right: { style: "thin", color: { rgb: "D3D3D3" } },
        },
      };
    }
  }

  // Freeze header row
  ws["!freeze"] = { xSplit: 0, ySplit: 1 };

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, "Employees");

  // Generate filename with timestamp
  const timestamp = new Date().toISOString().split("T")[0];
  const filename = `employees_${timestamp}.xlsx`;

  // Write and download file
  XLSX.writeFile(wb, filename);
};
