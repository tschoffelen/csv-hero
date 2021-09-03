import Papa from 'papaparse';

export const downloadDataAs = (data, format) => {
	// First trim out internal keys
	data = data.map((row) => Object.fromEntries(Object.entries(row).filter(([key]) => !key.startsWith('__'))));

	// TODO: see if we can be smarter with generating filenames
	const baseName = 'data';

	let content, mimeType, filename;
	switch (format) {
	case 'json':
		content = JSON.stringify(data);
		mimeType = 'text/json';
		filename = `${baseName}.json`;
		break;
	case 'csv':
		content = Papa.unparse(data);
		mimeType = 'text/csv';
		filename = `${baseName}.csv`;
		break;
	case 'tsv':
		content = Papa.unparse(data, {delimiter: "\t"});
		mimeType = 'text/tsv';
		filename = `${baseName}.tsv`;
		break;
	default:
		throw new Error(`Invalid format: ${format}`);
	}

	return downloadBlob(content, mimeType, filename);
};

const downloadBlob = (content, mimeType, filename) => {
	const blob = new Blob([content], { type: mimeType });
	const url = URL.createObjectURL(blob);

	const anchorElement = document.createElement('a');
	anchorElement.setAttribute('href', url);
	anchorElement.setAttribute('download', filename);
	anchorElement.click();
};
