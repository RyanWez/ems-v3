import { Employee } from '../types/employee';

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

    const yearText = totalYears > 0 ? `${totalYears} Y` : '';
    const monthText = totalMonths > 0 ? `${totalMonths} M` : '';
    const dayText = days > 0 ? `${days} D` : '';

    return [yearText, monthText, dayText].filter(Boolean).join(', ');
};

/**
 * Convert employees data to CSV format
 */
export const convertToCSV = (employees: Employee[]): string => {
    // Define CSV headers
    const headers = [
        'NAME',
        'JOIN DATE',
        'SERVICE YEARS',
        'GENDER',
        'DOB',
        'PHONE NO.',
        'POSITION'
    ];

    // Create CSV rows
    const rows = employees.map(employee => {
        const serviceYears = calculateServiceYears(employee.joinDate);

        return [
            employee.name,
            employee.joinDate,
            serviceYears,
            employee.gender,
            employee.dob,
            employee.phone,
            employee.position
        ].map(field => {
            // Escape fields that contain commas, quotes, or newlines
            const fieldStr = String(field);
            if (fieldStr.includes(',') || fieldStr.includes('"') || fieldStr.includes('\n')) {
                return `"${fieldStr.replace(/"/g, '""')}"`;
            }
            return fieldStr;
        }).join(',');
    });

    // Combine headers and rows
    return [headers.join(','), ...rows].join('\n');
};

/**
 * Download CSV file
 */
export const downloadCSV = (csvContent: string, filename: string = 'employees.csv'): void => {
    // Create a Blob from the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    // Create a temporary download link
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';

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
        alert('No employees to export');
        return;
    }

    const csvContent = convertToCSV(employees);
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `employees_${timestamp}.csv`;

    downloadCSV(csvContent, filename);
};
