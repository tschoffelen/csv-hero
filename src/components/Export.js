import React, { useState } from 'react';

const Export = ({ onExport }) => {
	const [exportFormat, setExportFormat] = useState('csv');

	return (
		<section>
			<h3>Export</h3>
			<div className="flex">
				<select value={exportFormat} onChange={(e) => setExportFormat(e.target.value)} className="input flex-flex">
					<option value="csv">CSV</option>
					<option value="tsv">TSV</option>
					<option value="json">JSON</option>
				</select>
				<button onClick={() => onExport(exportFormat)}>Export</button>
			</div>
		</section>
	);
};

export default Export;
