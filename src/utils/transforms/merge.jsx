import { GitMerge } from 'react-feather';

import Select from '../../components/form/Select';

export const MergeTransform = {
	id: 'merge',
	title: 'Merge',
	icon: GitMerge,
	defaultOptions: {
		column: '',
		choose: 'first',
		addTotalsRow: false
	},
	transform: (rows, options) => {
		if (!options.column) {
			return rows;
		}

		const newRows = {};
		rows.forEach((row) => {
			if (options.choose === 'first') {
				newRows[row[options.column]] = {
					...row, ...(newRows[row[options.column]] || {}),
					...(options.addTotalsRow ? { total: (newRows[row[options.column]]?.total || 0) + 1 } : {})
				};
			} else {
				newRows[row[options.column]] = {
					...(newRows[row[options.column]] || {}), ...row,
					...(options.addTotalsRow ? { total: (newRows[row[options.column]]?.total || 0) + 1 } : {})
				};
			}
		});

		return Object.values(newRows);
	},
	controls: ({ options, setOptions, availableColumns }) => (
		<>
			<Select
				value={options.column}
				onChange={(e) => setOptions({ column: e.target.value })}
				className="mb-2"
			>
				<option value="">Select a column</option>
				{availableColumns.map((option) => (
					<option key={option}>{option}</option>
				))}
			</Select>
			<Select
				value={options.choose}
				onChange={(e) => setOptions({ choose: e.target.value })}
			>
				<option value="first">First match</option>
				<option value="last">Last match</option>
			</Select>
			<label className="flex mt-3 gap-0.5 font-medium text-gray-700 items-center">
				<input
					type="checkbox"
					checked={options.addTotalsRow}
					onChange={(e) => setOptions({ addTotalsRow: e.target.checked })}
				className="w-6 h-6"/>
				Add total row
			</label>
		</>
	)
};
