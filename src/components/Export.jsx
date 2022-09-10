import React, { useState } from 'react';

import Select from './form/Select';
import UploadButton from "./cloud/UploadButton";

const Export = ({ rowsCount, onExport, onUpload }) => {
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
					className="flex-1">
					<option value="csv">CSV</option>
					<option value="tsv">TSV</option>
					<option value="json">JSON</option>
				</Select>
				<button
					className="ml-3 px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-100 active:bg-indigo-600 active:text-white border border-indigo-600 border-r-0 rounded-l-md"
					onClick={() => onExport(exportFormat)}>Export
				</button>
				<UploadButton onUpload={onUpload}/>
			</div>
		</section>
	);
};

export default Export;
