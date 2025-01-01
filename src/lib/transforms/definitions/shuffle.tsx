import { Shuffle } from "react-feather";

export const ArrayShuffleTransform = {
  id: "shuffle",
  title: "Shuffle",
  group: "Sorting",
  icon: Shuffle,
  transform: (rows) => {
    for (let i = rows.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [rows[i], rows[j]] = [rows[j], rows[i]];
    }
    return rows;
  },
};
