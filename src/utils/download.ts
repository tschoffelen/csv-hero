import Papa from "papaparse";
import toast from "react-hot-toast";

const getResult = (data, format) => {
  // First trim out internal keys
  data = data.map((row) =>
    Object.fromEntries(
      Object.entries(row).filter(([key]) => !key.startsWith("__"))
    )
  );
  let content;
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
    default:
      throw new Error(`Invalid format: ${format}`);
  }

  return content;
};

export const downloadDataAs = (data, format) => {
  // TODO: see if we can be smarter with generating filenames
  const baseName = "data";

  let content = getResult(data, format);
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
    default:
      throw new Error(`Invalid format: ${format}`);
  }

  return downloadBlob(content, mimeType, filename);
};

export const copyDataAs = async (data, format) => {
  let content = getResult(data, format);

  try {
    await navigator.clipboard.writeText(content);
    toast.success('Copied to clipboard');
  } catch (err) {
    console.error("Failed to copy: ", err);
  }
};

const downloadBlob = (content, mimeType, filename) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const anchorElement = document.createElement("a");
  anchorElement.setAttribute("href", url);
  anchorElement.setAttribute("download", filename);
  anchorElement.click();
};
