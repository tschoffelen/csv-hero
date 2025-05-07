import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { uploadPart } from "@/utils/cloud";
import { getResult } from "@/utils/download";
import { BoxIcon } from "lucide-react";

import { Layer } from "@/lib/layers/Layer";

export const DatasetPublisher = ({ layers }: { layers: Layer[] }) => {
  const [loading, setLoading] = useState(false);

  if (!layers?.length) return null;
  const defaultName = (layers[0].attributes?.name || "Dataset")
    .replace(/[-_]/g, " ")
    .split(".")[0];

  const submit = async (e: SubmitEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.target as HTMLFormElement);

      // Build schema
      const schema: any[] = [];
      layers[layers.length - 1].columns
        .entries()
        .forEach(([name, type]: [string, string]) =>
          schema.push({
            name,
            type,
            description: formData.get(`schema-column-description__${name}`),
          })
        );

      // Upload data in various formats
      const data = layers[layers.length - 1].data;
      const links = {
        baseUrl: "https://mirri.link/",
        json: await uploadPart(
          getResult(data, "json").content,
          "data.json",
          "application/json"
        ),
        csvhero: await uploadPart(
          JSON.stringify({
            data,
            name: formData.get("title"),
            transforms: [],
          }),
          "csvhero.json",
          "application/json"
        ),
        csv: await uploadPart(
          getResult(data, "csv").content,
          "data.csv",
          "text/csv"
        ),
        xml: await uploadPart(
          getResult(data, "xml").content,
          "data.xml",
          "application/xml"
        ),
        preview: await uploadPart(
          getResult(data.slice(0, 20), "json").content,
          "data-preview.json",
          "application/json"
        ),
      };

      const metadata = {
        $schema: "https://csvhero.app/dataset-metadata-schema.json",
        title: formData.get("title"),
        description: formData.get("description"),
        schema,
        links,
        statistics: {
          rows: data.length,
          columns: layers[layers.length - 1].columns.size,
          createdAt: new Date().toISOString(),
        },
      };

      const key = await uploadPart(
        JSON.stringify(metadata),
        `${defaultName}.json`,
        "application/json"
      );

      const url = `https://csvhero.app/dataset/${key}`;
      console.log(`Dataset published: ${url}`);

      window.open(url, "_blank");
    } catch (e) {
      console.error("Failed to publish dataset: ", e);
      alert("Failed to publish dataset. Please try again. " + e.message);
    }
    setLoading(false);
  };

  return (
    <Dialog>
      <DialogTrigger>
        <button className="px-3 py-3 ml-1.5 text-sm font-medium text-white bg-indigo-700 hover:bg-indigo-800 transition rounded-md">
          <BoxIcon className="w-4 h-4" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[calc(100vh-6rem)] overflow-auto">
        <DialogHeader>
          <DialogTitle>Publish dataset</DialogTitle>
          <DialogDescription>
            Publish a dataset to the cloud. This is perfect for sharing
            specifications on what data is available and how to use it.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit}>
          <Label className="mt-3">Dataset title</Label>
          <Input name="title" defaultValue={defaultName} />
          <Label className="mt-3">Description</Label>
          <Textarea name="description" />
          <Label className="mt-3">Schema columns</Label>
          <table className="w-full border-t border-gray-100 text-sm">
            {layers[layers.length - 1].columns
              .entries()
              .map((column: [string, string]) => (
                <tr key={column[0]} className="border-b border-gray-100">
                  <td className="text-left align-top pr-3 pt-3">
                    <div className="font-mono">{column[0]}</div>
                    <div className="text-gray-500 text-xs mt-0.5">
                      {column[1]}
                    </div>
                  </td>
                  <td className="w-full p-3 pr-0">
                    <Textarea
                      name={`schema-column-description__${column[0]}`}
                      placeholder="Description"
                      className="text-sm"
                    />
                  </td>
                </tr>
              ))}
          </table>
          <Button type="submit" disabled={loading} className="mt-5">
            {loading ? "Publishing..." : "Publish dataset"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
