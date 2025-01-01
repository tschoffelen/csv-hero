import { Rewind } from "react-feather";

export const ArrayReverseTransform = {
  id: "reverse",
  title: "Reverse",
  group: "Sorting",
  icon: Rewind,
  transform: (rows) => {
    return rows.reverse();
  },
};
