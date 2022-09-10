import { Type } from 'react-feather';

export const RenameTransform = {
	id: 'rename',
	title: 'Rename',
	icon: Type,
	defaultOptions: {
		column: '',
		newName: ''
	},
	map: (row, options) => {
		if (!options.column || !(options.column in row) || !options.newName) {
			return row;
		}

		const newRow = {...row};
		newRow[options.newName] = row[options.column];
		delete newRow[options.column];

		return newRow;
	},
	controls: ({ options, setOptions }) => (
		<>
			<input
				type="text"
				value={options.column}
				autoFocus
				onChange={(e) => setOptions({ column: e.target.value })}
				className="rounded-md w-full text-sm bg-white outline-none h-9 px-2 border border-gray-200 mb-2"
				placeholder="old name"/>
			<input
				type="text"
				value={options.newName}
				autoFocus
				onChange={(e) => setOptions({ newName: e.target.value })}
				className="rounded-md w-full text-sm bg-white outline-none h-9 px-2 border border-gray-200"
				placeholder="new name"/>
		</>
	)
};
