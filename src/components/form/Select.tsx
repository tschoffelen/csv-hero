import { ChevronDown } from "react-feather";
import { cn } from "@/lib/utils";

const Select = ({
  value,
  children,
  onChange,
  className = "",
  selectClassName = "",
  ...props
}) => {
  return (
    <div className={`relative flex max-w-full ${className}`}>
      <select
        value={value}
        onChange={onChange}
        className={cn(
          "rounded-md flex-1 text-xs bg-transparent border-gray-700 max-w-full focus:ring-0 focus:outline-0 focus:shadow-0 appearance-none h-8 px-2.5 pr-6 border",
          selectClassName
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="w-4 h-4 opacity-50 absolute right-2 top-2 pointer-events-none" />
    </div>
  );
};

export default Select;
