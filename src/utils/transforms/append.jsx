import { GitPullRequest } from "react-feather";
import { processData, readFile } from "../readFile";

export const AppendTransform = {
  id: "append",
  title: "Append",
  icon: GitPullRequest,
  defaultOptions: {
    data: null
  },
  transform: (rows, options, setOptions, { setAllColumns }) => {
    if (!options.data) {
      return rows;
    }

    rows = processData([...rows, ...options.data]);

    setAllColumns(rows[0] && typeof rows[0] === "object"
      ? Object
        .keys(rows[0])
        .filter((field) => field !== "__internal_id")
        .map((field) => [field, typeof rows[0][field]])
      : []
    );

    return rows;
  },
  controls: ({ setOptions }) => (
    <>
      <input type="file" onChange={async(e) => {
        if (e.target.files.length) {
          const content = await readFile(e.target.files[0]);
          const newRows = processData(content);
          setOptions({ data: newRows });
        }
      }} />
    </>
  )
};
