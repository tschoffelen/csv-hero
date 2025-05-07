import { DownloadIcon } from "lucide-react";

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
      <DropdownMenuTrigger asChild>
        <Button className="ml-auto">
          Access data
          <DownloadIcon />
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
          <a href={`${links.baseUrl}${links.csv}`} download target="_blank">
            CSV
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
        {links.csvhero && (
          <DropdownMenuItem asChild>
            <a href={`https://csvhero.app/${links.csvhero}`} target="_blank">
              Open in CSV Hero...
            </a>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
