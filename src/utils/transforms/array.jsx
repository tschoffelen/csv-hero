import { Rewind, Shuffle } from 'react-feather';

export const ArrayReverseTransform = {
	id: 'reverse',
	title: 'Reverse',
	icon: Rewind,
	transform: (rows) => {
		return rows.reverse();
	}
};

export const ArrayShuffleTransform = {
	id: 'shuffle',
	title: 'Shuffle',
	icon: Shuffle,
	transform: (rows) => {
		for (let i = rows.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[rows[i], rows[j]] = [rows[j], rows[i]];
		}
		return rows;
	}
};
