import * as XLSX from "xlsx";

/**
 * Exports data to an Excel file and triggers a download.
 * @param data Array of objects to export
 * @param fileName Name of the file (without extension)
 * @param sheetName Name of the Excel sheet
 */
export const exportToExcel = (
  data: Record<string, string | number | boolean | null | undefined>[],
  fileName: string,
  sheetName: string = "Sheet1",
) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

export interface TranslationExportRow {
  Namespace: string;
  Key: string;
  Georgian: string;
  English: string;
}

export interface RoleExportRow {
  Name: string;
  Description: string;
  Permissions: string;
}

export interface PermissionExportRow {
  Category: string;
  Name: string;
  Description: string;
  Action: string;
  Subject: string;
}
