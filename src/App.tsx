import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Loader } from "react-feather";
import { Toaster } from "react-hot-toast";
import { FileIcon } from "lucide-react";
import axios from "axios";

import DragAndDrop from "./components/DragAndDrop";
import Export from "./components/Export";
import Transformers from "./components/Transformers";
import Placeholder from "./components/Placeholder";
import { DataTable } from "@/components/renderer/DataTable";
import { Panel, PanelHeader } from "@/components/panel/PanelItem";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";

import { copyDataAs, downloadDataAs } from "./utils/download";
import { processData, readFile, tryParseData } from "./utils/readFile";
import { uploadData } from "./utils/cloud";
import { Layer } from "./lib/layers/Layer";
import useLayers from "./lib/layers/layersReducer";

function App() {
  const { id: urlId } = useParams();
  const [loading, setLoading] = useState(false);

  const [baseLayer, setBaseLayer] = useState<Layer | null>(null);
  const [transforms, setTransforms] = useState([]);
  const layers = useLayers(baseLayer, transforms);

  // derivative state
  const lastLayer: Layer | undefined = layers[layers.length - 1];
  const processedData = lastLayer?.data;

  const handleFile = async (file: any) => {
    const content = await readFile(file);
    const rows = processData(content);
    if (!rows) {
      return;
    }

    setBaseLayer(new Layer(rows, { name: file.name }));
  };

  useEffect(() => {
    if (!urlId) {
      return;
    }
    (async () => {
      setLoading(true);
      const { data } = await axios.get(`https://schof.link/${urlId}`);
      setTransforms(data.transforms);
      setBaseLayer(new Layer(data.data, { name: data.name }));
      setLoading(false);
    })();
  }, [urlId]);

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
        {baseLayer ? (
          <div className="bg-gray-900 h-screen flex w-full">
            <ResizablePanelGroup direction="horizontal">
              <ResizablePanel
                defaultSize={20}
                minSize={Math.floor((300 / document.body.clientWidth) * 100)}
                className="flex flex-col"
              >
                <section className="p-5 flex-1 text-sm overflow-y-auto">
                  <h3 className="text-xs font-semibold text-gray-300 uppercase mb-3 flex justify-between items-center">
                    Pipeline
                  </h3>
                  <Panel isFirst>
                    <PanelHeader icon={FileIcon}>Data source</PanelHeader>
                    <p
                      className="font-mono text-xs truncate mt-1"
                      title={baseLayer.attributes.name}
                    >
                      {baseLayer.attributes.name}
                    </p>
                  </Panel>
                  <Transformers
                    transforms={transforms}
                    setTransforms={setTransforms}
                    layers={layers}
                  />
                </section>
                <Export
                  rowsCount={lastLayer?.data.length}
                  onUpload={async () =>
                    await uploadData(
                      lastLayer?.data,
                      baseLayer.attributes.name,
                      transforms
                    )
                  }
                  onCopy={(exportFormat: string) =>
                    copyDataAs(lastLayer?.data, exportFormat)
                  }
                  onExport={(exportFormat: string) =>
                    downloadDataAs(lastLayer?.data, exportFormat)
                  }
                />
              </ResizablePanel>
              <ResizableHandle />
              <ResizablePanel className="rounded-l-md shadow bg-white text-sm my-5">
                {processedData && lastLayer.columns?.size > 0 ? (
                  <DataTable layer={lastLayer} />
                ) : (
                  <span />
                )}
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        ) : (
          <Placeholder
            tabIndex={1}
            autoFocus
            onPaste={(e) => {
              if (e.clipboardData.items[0].kind === "file") {
                return handleFile(e.clipboardData.items[0].getAsFile());
              }
              e.clipboardData.items[0].getAsString((content: string) => {
                content = tryParseData(content);
                const rows = content && processData(content);
                if (!rows) return;
                setBaseLayer(new Layer(rows, { name: "Clipboard" }));
              });
            }}
          />
        )}
      </DragAndDrop>
    </>
  );
}

export default App;
