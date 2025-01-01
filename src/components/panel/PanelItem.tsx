import { cn } from "@/lib/utils";
import { PropsWithChildren } from "react";

interface PanelProps {
  isFirst?: boolean;
  isLast?: boolean;
  className?: string;
}

export const Panel = ({
  children,
  isFirst = false,
  isLast = false,
  className = "",
}: PropsWithChildren<PanelProps>) => {
  return (
    <div
      className={cn(
        "bg-gray-900 border-2 border-indigo-800 shadow text-white p-2.5 px-3.5 rounded-lg mb-5 relative transition",
        className
      )}
    >
      {children}
      {!isLast && (
        <>
          <div className="absolute top-full left-[50%] -ml-[5px] -mt-[4px] size-[10px] border-2 border-indigo-800 rounded-full bg-gray-900" />
          <div className="absolute -bottom-4 left-[50%] -ml-[1px] w-[2px] h-3 bg-indigo-800" />
        </>
      )}
      {!isFirst && (
        <>
          <div className="absolute top-0 left-[50%] -ml-[5px] -mt-[6px] size-[10px] border-2 border-indigo-800 rounded-full bg-gray-900" />
          <div className="absolute -top-4 left-[50%] -ml-[1px] w-[2px] h-3 bg-indigo-800" />
        </>
      )}
    </div>
  );
};

export const PanelHeader = ({
  icon: Icon = null,
  children,
}: PropsWithChildren<{ icon: any }>) => {
  return (
    <div className="text-xs font-semibold text-gray-100 flex items-center">
      {Icon && <Icon className="size-3 mr-1.5" />}
      {children}
    </div>
  );
};
