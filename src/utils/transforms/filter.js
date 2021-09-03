import { Columns, Search } from 'react-feather';

export const FilterColumnsTransform = {
	id: 'filter-columns',
	title: 'Filter columns',
	icon: Columns,
	defaultOptions: {
		columns: ''
	},
	map: (row, options) => {
		const cols = options.columns.split(',').map((col) => col.trim()).filter(Boolean);
		if (!cols.length) {
			return row;
		}
		return Object.fromEntries(Object.entries(row).filter(([key]) => cols.includes(key) || key.startsWith('__')));
	},
	controls: ({ options, setOptions }) => (
		<>
			<input
				type="text"
				value={options.columns}
				autoFocus
				onChange={(e) => setOptions({ columns: e.target.value })}
				className="rounded-md w-full text-sm bg-white outline-none h-9 px-2 border border-gray-200"
				placeholder="column1, column2"/>
		</>
	)
};

export const FilterValuesTransform = {
	id: 'filter-values',
	title: 'Filter values',
	icon: Search,
	defaultOptions: {
		search: ''
	},
	transform: (rows, options) => {
		if (!options.search) {
			return rows;
		}
		return rows.filter((row) => Object.entries(row)
			.filter(([key]) => !key.startsWith('__'))
			.map(([, val]) => val).join('||||')
			.includes(options.search));
	},
	controls: ({ options, setOptions }) => (
		<>
			<input
				type="text"
				value={options.search}
				autoFocus
				onChange={(e) => setOptions({ search: e.target.value })}
				className="rounded-md w-full text-sm bg-white outline-none h-9 px-2 border border-gray-200"
				placeholder="search term"/>
		</>
	)
};
