import { Employee } from "../types/employee";
import ExcelJS from "exceljs";

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
export const exportEmployeesToExcel = async (employees: Employee[]): Promise<void> => {
  if (employees.length === 0) {
    alert("No employees to export");
    return;
  }

  // Create workbook and worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Employees");

  // Define columns
  worksheet.columns = [
    { header: "No.", key: "no", width: 6 },
    { header: "Name", key: "name", width: 25 },
    { header: "Join Date", key: "joinDate", width: 12 },
    { header: "Service Years", key: "serviceYears", width: 15 },
    { header: "Gender", key: "gender", width: 10 },
    { header: "Date of Birth", key: "dob", width: 12 },
    { header: "Phone Number", key: "phone", width: 15 },
    { header: "Position", key: "position", width: 20 },
  ];

  // Prepare data for Excel
  const excelData = employees.map((employee, index) => ({
    no: index + 1,
    name: employee.name,
    joinDate: employee.joinDate,
    serviceYears: calculateServiceYears(employee.joinDate),
    gender: employee.gender,
    dob: employee.dob,
    phone: employee.phone,
    position: employee.position,
  }));

  // Add data rows
  excelData.forEach((data) => {
    worksheet.addRow(data);
  });

  // Style header row
  const headerRow = worksheet.getRow(1);
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "4472C4" },
    };
    cell.font = {
      bold: true,
      color: { argb: "FFFFFF" },
    };
    cell.alignment = { vertical: "middle", horizontal: "center" };
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  });

  // Style data rows
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // Skip header row

    const isEvenRow = rowNumber % 2 === 0;

    row.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: isEvenRow ? "F2F2F2" : "FFFFFF" },
      };
      cell.alignment = {
        vertical: "middle",
        horizontal: cell.value === rowNumber ? "center" : "left",
      };
      cell.border = {
        top: { style: "thin", color: { argb: "D3D3D3" } },
        left: { style: "thin", color: { argb: "D3D3D3" } },
        bottom: { style: "thin", color: { argb: "D3D3D3" } },
        right: { style: "thin", color: { argb: "D3D3D3" } },
      };
    });
  });

  // Generate filename with timestamp
  const timestamp = new Date().toISOString().split("T")[0];
  const filename = `employees_${timestamp}.xlsx`;

  // Write and download file
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  window.URL.revokeObjectURL(url);
};
