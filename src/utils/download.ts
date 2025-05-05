import Papa from "papaparse";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";

const escapeXML = (str: any) => {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
};

export const getResult = (data: any[], format: string) => {
  // First trim out internal keys
  data = data.map((row) =>
    Object.fromEntries(
      Object.entries(row).filter(([key]) => !key.startsWith("__"))
    )
  );
  let content;
  let isBlob = false;

  switch (format) {
    case "json":
      content = JSON.stringify(data);
      break;
    case "csv":
      content = Papa.unparse(data);
      break;
    case "tsv":
      content = Papa.unparse(data, { delimiter: "\t" });
      break;
    case "xml":
      content =
        `<?xml version="1.0" encoding="UTF-8"?>\n` +
        `<root>\n` +
        `${data
          .map(
            (row) =>
              `  <row>\n` +
              `${Object.entries(row)
                .map(([key, value]) => {
                  key = key.replace(/\s+/g, "_");
                  return `    <${key}>${escapeXML(value)}</${key}>`;
                })
                .join("\n")}` +
              `  </row>`
          )
          .join("\n")}` +
        `\n</root>`;
      break;
    case "xlsx":
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      content = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      isBlob = true;
      break;
    default:
      throw new Error(`Invalid format: ${format}`);
  }

  return { content, isBlob };
};

export const downloadDataAs = (data: any, format: string) => {
  // TODO: see if we can be smarter with generating filenames
  const baseName = "data";

  let { content, isBlob } = getResult(data, format);
  let mimeType, filename;
  switch (format) {
    case "json":
      mimeType = "text/json";
      filename = `${baseName}.json`;
      break;
    case "csv":
      mimeType = "text/csv";
      filename = `${baseName}.csv`;
      break;
    case "tsv":
      mimeType = "text/tsv";
      filename = `${baseName}.tsv`;
      break;
    case "xml":
      mimeType = "application/xml";
      filename = `${baseName}.xml`;
      break;
    case "xlsx":
      mimeType =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      filename = `${baseName}.xlsx`;
      break;
    default:
      throw new Error(`Invalid format: ${format}`);
  }

  return downloadBlob(content, mimeType, filename, isBlob);
};

export const copyDataAs = async (data: any, format: string) => {
  // Excel data can't be copied to clipboard directly
  if (format === "xlsx") {
    toast.error(
      "Cannot copy Excel format to clipboard. Please use Export instead."
    );
    return;
  }

  let { content } = getResult(data, format);

  try {
    await navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard");
  } catch (err) {
    console.error("Failed to copy: ", err);
  }
};

const downloadBlob = (
  content: any,
  mimeType: string,
  filename: string,
  isBlob = false
) => {
  const blob = isBlob
    ? new Blob([content], { type: mimeType })
    : new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const anchorElement = document.createElement("a");
  anchorElement.setAttribute("href", url);
  anchorElement.setAttribute("download", filename);
  anchorElement.click();

  // Clean up by revoking the Object URL
  setTimeout(() => URL.revokeObjectURL(url), 100);
};
