import * as XLSX from "xlsx";
import type { ExcelRow } from "@/types/translation.types";

export const parseExcelTranslations = (file: File): Promise<ExcelRow[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstream = evt.target?.result;
        if (!bstream) {
          resolve([]);
          return;
        }

        const wb = XLSX.read(bstream as string, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        resolve(data as ExcelRow[]);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsBinaryString(file);
  });
};
