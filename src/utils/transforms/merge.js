import { GitMerge } from 'react-feather';

import Select from '../../components/form/Select';

export const MergeTransform = {
	id: 'merge',
	title: 'Merge',
	icon: GitMerge,
	defaultOptions: {
		column: '',
		choose: 'first'
	},
	transform: (rows, options) => {
		if (!options.column) {
			return rows;
		}

		const newRows = {};
		rows.forEach((row) => {
			if (options.choose === 'first') {
				newRows[row[options.column]] = { ...row, ...(newRows[row[options.column]] || {}) };
			} else {
				newRows[row[options.column]] = { ...(newRows[row[options.column]] || {}), ...row };
			}
		});

		return Object.values(newRows);
	},
	controls: ({ options, setOptions, availableColumns }) => (
		<div className="flex">
			<Select
				value={options.column}
				onChange={(e) => setOptions({ column: e.target.value })}
				className="mr-2 flex-1"
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
		</div>
	)
};
