import { PlusCircle } from "react-feather";

export const AddColumnTransform = {
	id: 'add-column',
	title: 'Add column',
	icon: PlusCircle,
	defaultOptions: {
		column: '',
		value: ''
	},
	map: (row, options) => {
		if (!options.column || !options.value) {
			return row;
		}

		const newRow = {...row};
		newRow[options.column] = options.value;

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
				placeholder="Column name"/>
			<input
				type="text"
				value={options.value}
				autoFocus
				onChange={(e) => setOptions({ value: e.target.value })}
				className="rounded-md w-full text-sm bg-white outline-none h-9 px-2 border border-gray-200"
				placeholder="Value"/>
		</>
	)
};
