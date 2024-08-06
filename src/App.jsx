import React, { useEffect, useState } from "react";
import GridTable from "@nadavshaar/react-grid-table";
import { v4 as uuid } from "uuid";
import { Loader } from "react-feather";
import axios from "axios";

import DragAndDrop from "./components/DragAndDrop";
import Export from "./components/Export";
import Transformers from "./components/Transformers";
import Placeholder from "./components/Placeholder";

import { copyDataAs, downloadDataAs } from "./utils/download";
import { processData, readFile, tryParseData } from "./utils/readFile";
import { transformDefinitions } from "./utils/transforms";
import { uploadData } from "./utils/cloud";
import { Toaster } from "react-hot-toast";

function App({ id: urlId }) {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [data, setData] = useState(null);
  const [processedData, setProcessedData] = useState(null);
  const [id, setId] = useState(() => uuid());
  const [transforms, setTransforms] = useState([]);
  const [allColumns, setAllColumns] = useState([]);
  const [availableColumns, setAvailableColumns] = useState([]);

  const setTransformOptions = (transformId) => {
    return (newOptions) => {
      setTransforms((transforms) =>
        transforms.map((transform) =>
          transform.id === transformId
            ? {
                ...transform,
                options: { ...transform.options, ...newOptions },
              }
            : transform
        )
      );
    };
  };

  const handleFile = async (file) => {
    const content = await readFile(file);
    const rows = processData(content);
    if (!rows) {
      return;
    }
    setData(rows);
    setFile(file);
    setId(uuid());
    setAllColumns(
      rows[0] && typeof rows[0] === "object"
        ? Object.keys(rows[0])
            .filter((field) => field !== "__internal_id")
            .map((field) => [field, typeof rows[0][field]])
        : []
    );
  };

  useEffect(() => {
    if (!urlId) {
      return;
    }
    (async () => {
      setLoading(true);
      const { data } = await axios.get(`https://schof.link/${urlId}`);
      setData(data.data);
      setFile({ name: data.name });
      setTransforms(data.transforms);
      setLoading(false);
    })();
  }, [urlId]);

  useEffect(() => {
    if (!data) {
      return;
    }

    // TODO: should we add a debounce here?

    let sourceData = [...data.map((row) => ({ ...row }))];
    const finalData = transforms.reduce((data, transformConfig) => {
      // TODO: this lookup is not ideal
      const setOptions = setTransformOptions(transformConfig.id);
      const transform = transformDefinitions.find(
        ({ id }) => id === transformConfig.type
      );
      if (transform.map) {
        data = data.map((row) =>
          transform.map(row, transformConfig.options, setOptions)
        );
      }
      if (transform.transform) {
        data = [
          ...transform.transform(data, transformConfig.options, setOptions, {
            allColumns,
            setAllColumns,
          }),
        ];
      }
      return data;
    }, sourceData);

    setProcessedData(finalData);
    setAvailableColumns(
      finalData[0] && typeof finalData[0] === "object"
        ? Object.keys(finalData[0])
            .filter((field) => field !== "__internal_id")
            .map((field) => field)
        : []
    );

    setId(uuid());
  }, [data, transforms]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-200">
        <Loader className="w-6 h-6 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        }}
      />
      <DragAndDrop handleDrop={handleFile}>
        {file ? (
          <div className="bg-white h-screen flex w-full">
            <aside className="bg-gray-100 border-r border-gray-200 h-screen w-80 flex-0 flex flex-col">
              <section className="p-5 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-xs font-bold text-gray-600 uppercase mr-4">
                  Source
                </h3>
                <p className="text-sm truncate" title={file.name}>
                  {file.name}
                </p>
              </section>
              {data && (
                <>
                  <Transformers
                    transforms={transforms}
                    setTransforms={setTransforms}
                    allColumns={allColumns}
                    availableColumns={availableColumns}
                  />
                  <Export
                    rowsCount={processedData && processedData.length}
                    onUpload={async () =>
                      await uploadData(data, file.name, transforms)
                    }
                    onCopy={(exportFormat) =>
                      copyDataAs(processedData, exportFormat)
                    }
                    onExport={(exportFormat) =>
                      downloadDataAs(processedData, exportFormat)
                    }
                  />
                </>
              )}
            </aside>
            <main
              className="flex-1 h-screen text-sm"
              style={{ maxWidth: window.innerWidth - 320 }}
            >
              {processedData ? (
                <GridTable
                  key={id}
                  rowIdField="__internal_id"
                  enableColumnsReorder={false}
                  showRowsInformation={false}
                  showSearch={false}
                  showColumnVisibilityManager={false}
                  columns={
                    processedData[0] && typeof processedData[0] === "object"
                      ? Object.keys(processedData[0])
                          .filter((field) => field !== "__internal_id")
                          .map((field, id) => ({
                            id,
                            field,
                            label: `${field} (${typeof processedData[0][
                              field
                            ]})`,
                          }))
                      : []
                  }
                  rows={processedData}
                />
              ) : (
                <span />
              )}
            </main>
          </div>
        ) : (
          <Placeholder
            tabIndex={1}
            autoFocus
            onPaste={(e) => {
              if (e.clipboardData.items[0].kind === "file") {
                return handleFile(e.clipboardData.items[0].getAsFile());
              }
              e.clipboardData.items[0].getAsString((content) => {
                content = tryParseData(content);
                const rows = content && processData(content);
                if (!rows) {
                  return;
                }
                setData(rows);
                setFile({ name: "Clipboard" });
                setId(uuid());
                setAllColumns(
                  rows[0] && typeof rows[0] === "object"
                    ? Object.keys(rows[0])
                        .filter((field) => field !== "__internal_id")
                        .map((field) => [field, typeof rows[0][field]])
                    : []
                );
              });
            }}
          />
        )}
      </DragAndDrop>
    </>
  );
}

export default App;
