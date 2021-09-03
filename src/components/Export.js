import React, { useState } from 'react';

import Select from './form/Select';

const Export = ({ rowsCount, onExport }) => {
	const [exportFormat, setExportFormat] = useState('csv');

	return (
		<section className="p-5 border-b border-gray-200">
			<h3 className="text-xs font-bold text-gray-600 uppercase mb-3 flex justify-between items-center">
				<span>Export</span>
				{rowsCount && <span className="text-gray-500 lowercase font-normal">{rowsCount} rows</span>}
			</h3>
			<div className="flex">
				<Select
					value={exportFormat}
					onChange={(e) => setExportFormat(e.target.value)}
					className="mr-3 flex-1">
					<option value="csv">CSV</option>
					<option value="tsv">TSV</option>
					<option value="json">JSON</option>
				</Select>
				<button
					className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md"
					onClick={() => onExport(exportFormat)}>Export
				</button>
			</div>
		</section>
	);
};

export default Export;
