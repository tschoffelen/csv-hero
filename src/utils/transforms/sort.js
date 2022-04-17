import { Triangle } from 'react-feather';

import Select from '../../components/form/Select';

export const SortTransform = {
	id: 'sort',
	title: 'Sort',
	icon: Triangle,
	defaultOptions: {
		column: '',
		direction: 'Asc',
		type: 'Numeric'
	},
	transform: (rows, options) => {
		if (options.column && options.type === 'Numeric') {
			return rows.sort((a, b) => {
				if (a[options.column] < b[options.column]) {
					return options.direction === 'Asc' ? -1 : 1;
				}
				if (a[options.column] > b[options.column]) {
					return options.direction === 'Asc' ? 1 : -1;
				}
				return 0;
			});
		}
		if (options.column && options.type === 'Alpha') {
			return rows.sort((a, b) => {
				const stra = `${a[options.column]}`;
				const strb = `${b[options.column]}`;
				const res = stra.localeCompare(strb);
				if (res === -1) {
					return options.direction === 'Asc' ? -1 : 1;
				}
				if (res === 1) {
					return options.direction === 'Asc' ? 1 : -1;
				}
				return 0;
			});
		}

		return rows;
	},
	controls: ({ options, setOptions, availableColumns }) => (
		<>
			<Select
				value={options.column}
				onChange={(e) => setOptions({ column: e.target.value })}
				className="w-full mb-2"
			>
				<option value="">Select a column</option>
				{availableColumns.map((option) => (
					<option key={option}>{option}</option>
				))}
			</Select>
			<div className="flex">
				<Select
					value={options.direction}
					onChange={(e) => setOptions({ direction: e.target.value })}
					className="mr-2 flex-1"
				>
					<option>Asc</option>
					<option>Desc</option>
				</Select>
				<Select
					value={options.type}
					onChange={(e) => setOptions({ type: e.target.value })}
				>
					<option>Numeric</option>
					<option>Alpha</option>
				</Select>
			</div>
		</>
	)
};
