
import * as XLSX from 'xlsx';
import { Employee, PersonnelData } from '../types';

/**
 * Validates if a string is a Roman Numeral
 */
const isRoman = (val: string | number): boolean => {
  if (typeof val !== 'string') return false;
  return /^(?=[MDCLXVI])M*(C[MD]|D?C{0,3})(X[CL]|L?X{0,3})(I[XV]|V?I{0,3})$/i.test(val.trim());
};

/**
 * Validates if a value is a serial number (Cardinal)
 */
const isCardinal = (val: any): boolean => {
  if (val === undefined || val === null) return false;
  const str = String(val).trim();
  return !isNaN(Number(str)) && str.length > 0;
};

export const parsePersonnelExcel = async (file: File): Promise<PersonnelData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to array of arrays: [ [A1, B1, C1], [A2, B2, C2], ... ]
        const rows: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        const employees: Employee[] = [];
        const units: string[] = [];
        let currentUnit = "Chưa phân loại";

        rows.forEach((row) => {
          const colA = row[0]; // Roman or Serial
          const colB = row[1]; // Unit Name or Full Name
          const colC = row[2]; // Job Title

          if (!colA || !colB) return;

          const strA = String(colA).trim();
          const strB = String(colB).trim();
          const strC = colC ? String(colC).trim() : "";

          if (isRoman(strA)) {
            // New Unit detected
            currentUnit = strB;
            if (!units.includes(currentUnit)) {
              units.push(currentUnit);
            }
          } else if (isCardinal(strA)) {
            // New Employee detected
            employees.push({
              unit: currentUnit,
              serial: strA,
              fullName: strB,
              jobTitle: strC
            });
          }
        });

        resolve({ units, employees });
      } catch (err) {
        reject(new Error("Không thể xử lý tệp Excel. Vui lòng kiểm tra định dạng."));
      }
    };

    reader.onerror = () => reject(new Error("Lỗi khi đọc tệp."));
    reader.readAsArrayBuffer(file);
  });
};
