import { PlusCircle } from "react-feather";
import Input from "@/components/form/Input";

export const AddColumnTransform = {
  id: "add-column",
  title: "Add column",
  group: "Columns",
  icon: PlusCircle,
  defaultOptions: {
    column: "",
    value: "",
  },
  map: (row, options) => {
    if (!options.column || !options.value) {
      return row;
    }

    const newRow = { ...row };
    newRow[options.column] = options.value;

    return newRow;
  },
  controls: ({ options, setOptions }) => (
    <>
      <Input
        type="text"
        value={options.column}
        autoFocus
        onChange={(e) => setOptions({ column: e.target.value })}
        className="w-full mb-2"
        placeholder="Column name"
      />
      <Input
        type="text"
        value={options.value}
        autoFocus
        onChange={(e) => setOptions({ value: e.target.value })}
        className="w-full"
        placeholder="Value"
      />
    </>
  ),
};
