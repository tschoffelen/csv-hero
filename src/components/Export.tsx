import React, { useState } from "react";
import { Copy } from "react-feather";

import UploadButton from "./cloud/UploadButton";

const Export = ({ rowsCount, onExport, onUpload, onCopy }) => {
  const [exportFormat, setExportFormat] = useState("csv");

  return (
    <section className="p-5">
      <h3 className="text-xs font-semibold text-gray-300 uppercase mb-3 flex justify-between items-center">
        <span>
          File format
          <select
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value)}
            className="ml-2 text-white bg-transparent"
            data-testid="export-format-select"
          >
            <option value="csv">CSV</option>
            <option value="tsv">TSV</option>
            <option value="json">JSON</option>
            <option value="xlsx">Excel</option>
            <option value="xml">XML</option>
          </select>
        </span>
        {rowsCount && (
          <span className="text-gray-400 lowercase font-normal">
            {rowsCount.toLocaleString()} rows
          </span>
        )}
      </h3>
      <div className="flex">
        <button
          className="mr-4 flex-1 px-4 py-2 text-sm font-medium text-white bg-indigo-700 hover:bg-indigo-800 transition rounded-md"
          onClick={() => onExport(exportFormat)}
          data-testid="export-button"
        >
          Export
        </button>
        <button
          className="px-3 mr-1.5 py-2 text-sm font-medium text-white bg-indigo-700 hover:bg-indigo-800 transition rounded-md"
          onClick={() => onCopy(exportFormat)}
          data-testid="copy-button"
        >
          <Copy className="w-4 h-4" />
        </button>
        <UploadButton onUpload={onUpload} />
      </div>
    </section>
  );
};

export default Export;
