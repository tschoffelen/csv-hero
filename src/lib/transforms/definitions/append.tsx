import { GitPullRequest } from "react-feather";
import { processData, readFile } from "@/utils/readFile";

export const AppendTransform = {
  id: "append",
  title: "Append",
  group: "Combine",
  icon: GitPullRequest,
  defaultOptions: {
    data: null,
  },
  transform: (rows, options) => {
    if (!options.data) {
      return rows;
    }

    rows = processData([...rows, ...options.data]);

    return rows;
  },
  controls: ({ setOptions }) => (
    <>
      <input
        type="file"
        onChange={async (e) => {
          if (e.target.files.length) {
            const content = await readFile(e.target.files[0]);
            const newRows = processData(content);
            setOptions({ data: newRows });
          }
        }}
      />
    </>
  ),
};
