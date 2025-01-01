import { Columns, Search } from "react-feather";

import Select from "@/components/form/Select";
import Input from "@/components/form/Input";

export const FilterColumnsTransform = {
  id: "filter-columns",
  title: "Select columns",
  group: "Columns",
  icon: Columns,
  defaultOptions: {
    columns: "",
  },
  map: (row, options) => {
    const cols = options.columns
      .split(",")
      .map((col) => col.trim())
      .filter(Boolean);
    if (!cols.length) {
      return row;
    }
    return Object.fromEntries(
      Object.entries(row).filter(
        ([key]) => cols.includes(key) || key.startsWith("__")
      )
    );
  },
  controls: ({ options, setOptions }) => (
    <>
      <Input
        type="text"
        value={options.columns}
        autoFocus
        onChange={(e) => setOptions({ columns: e.target.value })}
        placeholder="column1, column2"
        className="w-full"
      />
    </>
  ),
};

export const FilterValuesTransform = {
  id: "filter-values",
  title: "Filter data",
  group: "Search",
  icon: Search,
  defaultOptions: {
    column: "*",
    search: "",
    searchType: "contains",
    columnType: "string",
  },
  transform: (rows, { column, search, searchType }) => {
    if (!search && !searchType.includes("empty")) {
      return rows;
    }
    return rows.filter((row) => {
      const value = Object.entries(row)
        .filter(
          ([key]) => !key.startsWith("__") && (column === "*" || key === column)
        )
        .map(([, val]) => val)
        .join("||||")
        .toLowerCase();

      if (searchType === "contains") {
        return value.includes(search);
      }
      if (searchType === "equals") {
        return value.toString() == search;
      }
      if (searchType === "not-equals") {
        return value.toString() != search;
      }
      if (searchType === "not-contains") {
        return !value.includes(search);
      }
      if (searchType === "not-empty") {
        return !["null", ""].includes(`${value}`);
      }
      if (searchType === "empty") {
        return ["null", ""].includes(`${value}`);
      }
      if (searchType === "number-greater-than") {
        return value > Number(search);
      }
      if (searchType === "number-smaller-than") {
        return value < Number(search);
      }
      return false;
    });
  },
  controls: ({ options, setOptions, columns }) => (
    <>
      <Select
        value={`${options.column}|${options.columnType}`}
        onChange={(e) => {
          const [column, columnType] = e.target.value.split("|");
          setOptions({ column, columnType });
          if (
            options.searchType.includes("number-") &&
            columnType !== "number"
          ) {
            setOptions({ searchType: "contains" });
          }
        }}
        className="mb-2"
      >
        <option value="*|string">All columns</option>
        {Array.from(columns.entries()).map(([option, type]) => (
          <option key={option} value={`${option}|${type}`}>
            {option}
          </option>
        ))}
      </Select>
      <Select
        value={options.searchType}
        onChange={(e) => setOptions({ searchType: e.target.value })}
        className="mb-2"
      >
        <option value="contains">contains</option>
        <option value="not-contains">does not contain</option>
        <option value="equals">equals</option>
        <option value="not-equals">does not equal</option>
        <option value="empty">is empty</option>
        <option value="not-empty">not empty</option>
        {options.columnType === "number" && (
          <>
            <option value="number-greater-than">greater than</option>
            <option value="number-smaller-than">smaller than</option>
          </>
        )}
      </Select>
      {options.searchType !== "empty" && options.searchType !== "not-empty" && (
        <Input
          type={options.searchType.includes("number-") ? "number" : "text"}
          value={options.search}
          autoFocus
          onChange={(e) => setOptions({ search: e.target.value.toLowerCase() })}
          placeholder="search term"
          className="w-full"
        />
      )}
    </>
  ),
};
