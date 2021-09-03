import React, { useState } from 'react';
import { ChevronDown } from 'react-feather';

const Export = ({ rowsCount, onExport }) => {
	const [exportFormat, setExportFormat] = useState('csv');

	return (
		<section className="p-5 border-b border-gray-200">
			<h3 className="text-xs font-bold text-gray-600 uppercase mb-3 flex justify-between items-center">
				<span>Export</span>
			{rowsCount && <span className="text-gray-500 lowercase font-normal">{rowsCount} rows</span>}
			</h3>
			<div className="flex">
				<div className="relative block flex-1 flex">
				<select
					value={exportFormat}
					onChange={(e) => setExportFormat(e.target.value)}
					className="flex-1 mr-3 rounded-md text-sm bg-white appearance-none px-3 border border-gray-200">
					<option value="csv">CSV</option>
					<option value="tsv">TSV</option>
					<option value="json">JSON</option>
				</select>
					<ChevronDown className="w-4 h-4 text-gray-400 absolute right-6 top-2.5 pointer-events-none" />
				</div>
				<button
					className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md"
					onClick={() => onExport(exportFormat)}>Export
				</button>
			</div>
		</section>
	);
};

export default Export;
