import { SaveIcon, Share2Icon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export const DownloadDropdown = ({ links }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button>
          <Share2Icon />
          Export data
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Download</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <a href={`${links.baseUrl}${links.json}`} download target="_blank">
            JSON
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href={`${links.baseUrl}${links.xlsx}`} download target="_blank">
            Excel
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href={`${links.baseUrl}${links.csv}`} download target="_blank">
            CSV
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href={`${links.baseUrl}${links.tsv}`} download target="_blank">
            TSV
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href={`${links.baseUrl}${links.xml}`} download target="_blank">
            XML
          </a>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Tools</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <a
            href={`https://lite.datasette.io/?csv=${links.baseUrl}${links.csv}#/data`}
            target="_blank"
          >
            Open in Datasette...
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
