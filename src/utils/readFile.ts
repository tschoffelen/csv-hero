import Papa from "papaparse";
import { v4 as uuid } from "uuid";
import * as XLSX from "xlsx";
import { XMLParser } from "fast-xml-parser";

import { INTERNAL_ID_FIELD } from "@/lib/constants";

const supportedExtensions = ["csv", "tsv", "json", "xlsx", "xls", "xml"];

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

const tryParseXML = (data: string) => {
  try {
    // Options for XML parsing
    const options = {
      ignoreAttributes: false,
      attributeNamePrefix: "_",
      isArray: (name, jpath, isLeafNode, isAttribute) => {
        // Make items that appear multiple times into arrays
        // This is common in RSS feeds and other XML formats
        return jpath.endsWith('.item') || jpath.endsWith('.entry');
      }
    };
    
    const parser = new XMLParser(options);
    const result = parser.parse(data);
    
    // Handle common XML document types
    let items = [];
    
    // Try to extract items from RSS feed
    if (result.rss?.channel?.item) {
      items = result.rss.channel.item;
    }
    // Try to extract entries from Atom feed
    else if (result.feed?.entry) {
      items = result.feed.entry;
    }
    // For other XML types, find the first array in the result
    else {
      // Look for any array in the parsed data
      const findFirstArray = (obj) => {
        if (!obj || typeof obj !== 'object') return null;
        
        for (const key in obj) {
          const value = obj[key];
          if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
            return value;
          }
          const nestedArray = findFirstArray(value);
          if (nestedArray) return nestedArray;
        }
        return null;
      };
      
      items = findFirstArray(result);
      
      // If no suitable array found, wrap the whole result in an array
      if (!items) {
        // Create an array with one element containing all the data
        items = [result];
      }
    }
    
    return items;
  } catch (e: any) {
    alert(`Error parsing XML: ${e.toString()}`);
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
    case "xml":
      return tryParseXML(data as string);
    default:
      if (typeof data === "string") {
        // Try to detect XML by its typical starting pattern
        if (data.trim().startsWith("<?xml") || data.trim().startsWith("<")) {
          return tryParseXML(data as string);
        }
        // JSON detection
        else if (data.startsWith("[") || data.startsWith("{")) {
          return tryParseJSON(data);
        }
        // Fall back to CSV parsing
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
