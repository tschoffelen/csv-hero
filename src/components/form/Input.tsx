import { cn } from "@/lib/utils";

const Input = ({ className = "", ...props }) => {
  return (
    <input
      className={cn(
        "rounded-md flex-1 text-xs bg-transparent border-gray-700 max-w-full focus:ring-0 focus:outline-0 focus:shadow-0 appearance-none h-8 px-2.5 pr-6 border",
        className
      )}
      {...props}
    />
  );
};

export default Input;
