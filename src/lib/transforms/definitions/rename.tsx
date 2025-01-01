import Input from '@/components/form/Input';
import { Type } from 'react-feather';

export const RenameTransform = {
	id: 'rename',
	title: 'Rename column',
	group: 'Columns',
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
			<Input
				type="text"
				value={options.column}
				autoFocus
				onChange={(e) => setOptions({ column: e.target.value })}
				className="w-full mb-2"
				placeholder="old name"/>
			<Input
				type="text"
				value={options.newName}
				autoFocus
				onChange={(e) => setOptions({ newName: e.target.value })}
				className="w-full"
				placeholder="new name"/>
		</>
	)
};
