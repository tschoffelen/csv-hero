import CodeMirror from "@uiw/react-codemirror";
import "codemirror/keymap/sublime";
import "codemirror/mode/sql/sql";
import "codemirror/theme/night.css";
import { InfoIcon } from "lucide-react";
import { AlertTriangle, Database } from "react-feather";
import initSqlJs from "sql.js";

const debounce = function (func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
};

// Function to execute SQL query on the data
const transformWithSql = (rows, options, setAttributes) => {
  try {
    if (!rows || rows.length === 0) {
      return rows;
    }

    // Initialize SQL.js
    return initSqlJs({
      locateFile: (file) => `https://sql.js.org/dist/${file}`,
    })
      .then((SQL) => {
        const db = new SQL.Database();
        const timeStart = Date.now();

        // Create a table with the data
        const columnNames = Object.keys(rows[0]);
        const createTableSql = `CREATE TABLE data (${columnNames
          .map((name) => `[${name}]`)
          .join(", ")})`;
        db.run(createTableSql);

        // Insert all rows
        rows.forEach((row) => {
          const values = columnNames.map((col) => {
            const val = row[col];
            if (val === null || val === undefined) return "NULL";
            if (typeof val === "string") return `'${val.replace(/'/g, "''")}'`;
            return val;
          });
          const insertSql = `INSERT INTO data VALUES (${values.join(", ")})`;
          db.run(insertSql);
        });

        // Execute the user's query
        let result;
        try {
          result = db.exec(options.query);
          setAttributes({ error: null });
        } catch (e) {
          console.log(e);
          setAttributes({ error: e.message });
          db.close();
          return rows;
        }

        db.close();

        console.log(result);
        const timeEnd = Date.now();
        const msElapsed = timeEnd - timeStart;

        const count = result?.[0]?.values?.length || 0;
        setAttributes({
          result: `Found ${count} row${count !== 1 ? "s" : ""} in ${msElapsed}ms`,
        });

        // Process the result
        if (
          !result ||
          result.length === 0 ||
          !result[0].values ||
          result[0].values.length === 0
        ) {
          return [];
        }

        // Convert result back to objects
        const resultColumns = result[0].columns;
        const resultRows = result[0].values.map((row) => {
          const obj = {};
          resultColumns.forEach((colName, i) => {
            obj[colName] = row[i];
          });
          return obj;
        });

        return resultRows;
      })
      .catch((e) => {
        console.error("SQL.js initialization failed:", e);
        setAttributes({ error: e.message });
        return rows;
      });
  } catch (e) {
    console.error(`Failed executing SQL query: `, e);
    setAttributes({ error: e.message });
    return rows;
  }
};

const SqlTransformControl = ({ options, setOptions, attributes }) => (
  <div className="-m-1 mx-0">
    <CodeMirror
      value={options.query}
      lazyLoadMode={false}
      options={{
        theme: "night",
        keyMap: "sublime",
        mode: "text/x-sql",
        lineNumbers: false,
        autofocus: true,
        tabSize: 2,
      }}
      onChange={debounce((editor) => {
        setOptions({ query: editor.getValue() });
      })}
    />
    {attributes.error ? (
      <div className="p-1 py-2 px-4 justify-center text-yellow-700 text-xs flex items-center">
        <AlertTriangle className="flex-0 w-3 h-3 inline-block mr-2" />
        <div>{attributes.error}</div>
      </div>
    ) : attributes.result ? (
      <div className="p-1 py-2 px-4 justify-center text-gray-500 text-xs flex items-center">
        <InfoIcon className="flex-0 w-3 h-3 inline-block mr-2" />
        <div>{attributes.result}</div>
      </div>
    ) : null}
  </div>
);

export const SqlTransform = {
  id: "sql",
  title: "SQL Query",
  icon: Database,
  group: "Advanced",
  defaultOptions: {
    query: "SELECT * FROM data",
    error: null,
  },
  transform: transformWithSql,
  controls: ({ options, setOptions, attributes }) => (
    <SqlTransformControl
      options={options}
      setOptions={setOptions}
      attributes={attributes}
    />
  ),
};
