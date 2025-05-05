import axios from "axios";
import { useEffect, useState } from "react";
import { Loader } from "react-feather";
import { useParams } from "react-router";
import Markdown from "react-markdown";
import { DownloadDropdown } from "@/components/dataset/download-dropdown";
import { Button } from "@/components/ui/button";
import { BookOpenIcon } from "lucide-react";

export const Dataset = () => {
  const { id } = useParams();
  const [metadata, setMetadata] = useState<any>(null);

  useEffect(() => {
    if (!id) return;

    (async () => {
      const { data } = await axios.get(`https://mirri.link/${id}`);
      setMetadata(data);
    })();
  }, [id]);

  if (!metadata) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <Loader className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="max-w-4xl p-5 md:py-12 lg:py-20 mx-auto">
        <div className="font-bold uppercase text-xs text-zinc-500">
          Data set preview
        </div>
        <div className="flex items-center gap-3 mb-6 pb-6 border-b">
          <h1 className="font-bold text-2xl md:text-4xl text-zinc-900 flex-1">
            {metadata.title}
          </h1>
          <DownloadDropdown links={metadata.links} />
        </div>
        <div className="prose mb-10">
          <Markdown>{metadata.description}</Markdown>
        </div>
      </div>
    </>
  );
};
