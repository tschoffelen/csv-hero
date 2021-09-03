import { Copy } from 'react-feather';

export const CoalesceTransform = {
	id: 'coalesce',
	title: 'Coalesce',
	icon: Copy,
	defaultOptions: {
		column: '',
		type: 'Integer'
	},
	map: (row, options) => {
		if (!options.column || !(options.column in row)) {
			return row;
		}

		let val = row[options.column];
		switch (options.type) {
		case 'Integer':
			val = parseInt(val);
			break;
		case 'Float':
			val = parseFloat(val);
			break;
		case 'Boolean':
			val = Boolean(val);
			break;
		default:
			val = `${val}`;
			break;
		}

		return {
			...row,
			[options.column]: val
		};
	},
	controls: ({ options, setOptions, availableColumns }) => (
		<div className="flex">
			<select
				value={options.column}
				onChange={(e) => setOptions({ column: e.target.value })}
				className="mr-3"
			>
				<option value="">Select a column</option>
				{availableColumns.map((option) => (
					<option key={option}>{option}</option>
				))}
			</select>
			<select
				value={options.type}
				onChange={(e) => setOptions({ type: e.target.value })}
			>
				<option>Integer</option>
				<option>Float</option>
				<option>String</option>
				<option>Boolean</option>
			</select>
		</div>
	)
};
