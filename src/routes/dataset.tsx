import axios from "axios";
import { useEffect, useState } from "react";
import { Loader } from "react-feather";
import { useParams } from "react-router";
import Markdown from "react-markdown";
import { DownloadDropdown } from "@/components/dataset/download-dropdown";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/renderer/DataTable";

export const Dataset = () => {
  const { id } = useParams();
  const [metadata, setMetadata] = useState<any>(null);
  const [preview, setPreview] = useState<any>(null);

  useEffect(() => {
    if (!id) return;

    (async () => {
      const { data } = await axios.get(`https://mirri.link/${id}`);
      setMetadata(data);
      const { data: preview } = await axios.get(
        `${data.links.baseUrl}${data.links.preview}`
      );
      setPreview(preview);
    })();
  }, [id]);

  if (!metadata) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <Loader className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  console.log(metadata.schema.map(({ name }) => name));

  return (
    <>
      <div className="max-w-4xl p-5 md:py-12 lg:py-20 mx-auto">
        <div className="font-bold uppercase text-xs text-zinc-500">
          Data set
        </div>
        <h1 className="font-bold text-2xl md:text-4xl text-zinc-900 flex-1">
          {metadata.title}
        </h1>
        <div className="flex flex-wrap items-center gap-6 md:gap-9 mt-6 mb-10 bg-neutral-100 p-5 rounded-lg">
          <div>
            <h3 className="text-xs font-medium text-zinc-500">Rows</h3>
            <p className="text-lg font-medium text-zinc-900">
              {metadata.statistics.rows}
            </p>
          </div>
          <div>
            <h3 className="text-xs font-medium text-zinc-500">Columns</h3>
            <p className="text-lg font-medium text-zinc-900">
              {metadata.statistics.columns}
            </p>
          </div>
          <div>
            <h3 className="text-xs font-medium text-zinc-500">Uploaded</h3>
            <p className="text-lg font-medium text-zinc-900">
              {new Date(
                metadata.statistics.createdAt || ""
              ).toLocaleDateString()}
            </p>
          </div>
          <DownloadDropdown links={metadata.links} />
        </div>
        <div className="prose mb-12">
          <Markdown>{metadata.description}</Markdown>
        </div>
        <Tabs defaultValue="preview">
          <TabsList className="mb-5">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="structure">Data structure</TabsTrigger>
          </TabsList>
          <TabsContent value="preview">
            <div className="border border-zinc-200 overflow-hidden rounded-md bg-white h-[640px] text-sm">
              {preview ? (
                <DataTable
                  layer={{
                    columns: metadata.schema.reduce((acc, { name, type }) => {
                      acc.set(name, type);
                      return acc;
                    }, new Map()),
                    data: preview,
                  }}
                />
              ) : (
                <p>Loading...</p>
              )}
            </div>
          </TabsContent>
          <TabsContent value="structure">
            <table className="w-full border-t border-gray-100 text-sm">
              {metadata.schema.map(({ name, type, description }) => (
                <tr key={name} className="border-b border-gray-100">
                  <td className="text-left align-top pr-3 py-3">
                    <div className="font-mono">{name}</div>
                    <div className="text-gray-500 text-xs mt-0.5">{type}</div>
                  </td>
                  <td className="w-full p-3 pr-0 prose prose-sm">
                    <Markdown>{description}</Markdown>
                  </td>
                </tr>
              ))}
            </table>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};
