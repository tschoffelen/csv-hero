import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { transformDefinitions } from "@/lib/transforms/definitions";

const options = Object.entries(
  transformDefinitions.reduce((acc, transform) => {
    acc[transform.group] = acc[transform.group] || [];
    acc[transform.group].push(transform);
    return acc;
  }, {})
);

const AddTransformButton = ({ onClick }) => {
  return (
    <div className="relative mt-6 flex items-center">
      <div className="absolute -top-3 left-[50%] -ml-[1px] w-[2px] h-5 bg-gradient-to-b from-indigo-800 to-gray-800" />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="link" className="text-sm mx-auto">
            Add transform
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          {options.map(([group, transforms]) => (
            <div key={group}>
              <DropdownMenuLabel>{group}</DropdownMenuLabel>
              {transforms.map((transform) => {
                const Icon = transform.icon;

                return (
                  <DropdownMenuItem onClick={() => onClick(transform)}>
                    <Icon />
                    <span>{transform.title}</span>
                  </DropdownMenuItem>
                );
              })}
            </div>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default AddTransformButton;
