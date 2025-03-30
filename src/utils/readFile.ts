import Papa from "papaparse";
import { v4 as uuid } from "uuid";
import * as XLSX from "xlsx";

import { INTERNAL_ID_FIELD } from "@/lib/constants";

const supportedExtensions = ["csv", "tsv", "json", "xlsx", "xls"];

const tryParseJSON = (data: string) => {
  try {
    return JSON.parse(data);
  } catch (e: any) {
    alert(`Error parsing JSON: ${e.toString()}`);
  }

  return null;
};

const tryParseCSV = (data: string) => {
  const csvData = Papa.parse(data, {
    error: (e: any) => alert(`Error parsing CSV: ${e.toString()}`),
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    encoding: "UTF-8",
  });
  return csvData.data || null;
};

const tryParseXLSX = (data: ArrayBuffer) => {
  try {
    const workbook = XLSX.read(data, { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    return XLSX.utils.sheet_to_json(worksheet, { defval: null });
  } catch (e: any) {
    alert(`Error parsing Excel file: ${e.toString()}`);
    return null;
  }
};

export const tryParseData = (data: string | ArrayBuffer, ext = "") => {
  switch (ext) {
    case "csv":
    case "tsv":
      return tryParseCSV(data as string);
    case "json":
      return tryParseJSON(data as string);
    case "xlsx":
    case "xls":
      return tryParseXLSX(data as ArrayBuffer);
    default:
      if (typeof data === "string") {
        if (data.startsWith("[") || data.startsWith("{")) {
          return tryParseJSON(data);
        }
        return tryParseCSV(data);
      }
      return null;
  }
};

export const readFile = (file: File) =>
  new Promise((resolve) => {
    const extParts = file.name.split(".");
    const ext = extParts[extParts.length - 1].toLowerCase().trim();
    if (!supportedExtensions.includes(ext)) {
      alert(`Sorry, we don't support the file type "${ext}" currently.`);
      return;
    }

    let reader = new FileReader();
    reader.onload = () => {
      if (ext === "xlsx" || ext === "xls") {
        const data = tryParseData(reader.result as ArrayBuffer, ext);
        if (data) {
          resolve(data);
        }
      } else {
        const result = reader.result.toString();
        const data = tryParseData(result, ext);
        if (data) {
          resolve(data);
        }
      }
    };

    if (ext === "xlsx" || ext === "xls") {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsText(file, "UTF-8");
    }
  });

export const processData = (data) => {
  // Data is in the format of {"data": [ ... ]}
  if (
    data &&
    !Array.isArray(data) &&
    typeof data === "object" &&
    Object.keys(data).length === 1 &&
    Array.isArray(data[Object.keys(data)[0]])
  ) {
    data = data[Object.keys(data)[0]];
  }

  // Check if array of objects, otherwise throw error
  if (
    !data ||
    !Array.isArray(data) ||
    !data[0] ||
    typeof data[0] !== "object"
  ) {
    alert(
      "Invalid file: needs to evaluate to an array of objects in order to transform."
    );
    return;
  }

  // Get all possible keys
  const defaultFields = {};
  data.forEach((row) => {
    Object.keys(row)
      .map((key) => `${key}`.trim())
      .filter(Boolean)
      .forEach((key) => (defaultFields[key] = ""));
  });

  // Add IDs and normalize column headings
  data = data.map((row) => {
    const newRow = {
      ...defaultFields,
      [INTERNAL_ID_FIELD]: uuid(),
    };
    Object.entries(row).forEach(([key, value]) => {
      if (key in defaultFields) {
        newRow[key] = typeof value === "object" ? JSON.stringify(value) : value;
      }
    });

    return newRow;
  });

  return data;
};
