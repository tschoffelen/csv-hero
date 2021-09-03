import Papa from 'papaparse';
import { v4 as uuid } from 'uuid';

const supportedExtensions = ['csv', 'tsv', 'json'];

export const readFile = (file) => new Promise((resolve) => {
	const extParts = file.name.split('.');
	const ext = extParts[extParts.length - 1].toLowerCase().trim();
	if (!supportedExtensions.includes(ext)) {
		alert(`Sorry, we don't support the file type "${ext}" currently.`);
		return;
	}

	let reader = new FileReader();
	reader.onload = () => {
		const result = reader.result.toString();
		switch (ext) {
		case 'csv':
		case 'tsv':
			const csvData = Papa.parse(result, {
				error: (e) => alert(`Error parsing CSV: ${e.toString()}`),
				header: true,
				dynamicTyping: true,
				skipEmptyLines: true,
				encoding: 'UTF-8',
			});
			resolve(csvData.data);
			break;
		default:
			try {
				resolve(JSON.parse(result));
			} catch (e) {
				alert(`Error parsing JSON: ${e.toString()}`);
			}
			break;
		}
	};

	reader.readAsText(file, 'UTF-8');
});

export const processData = (data) => {
	// Check if array of objects, otherwise throw error
	if (!data || !Array.isArray(data) || !data[0] || typeof data[0] !== 'object') {
		alert('Invalid file: needs to evaluate to an array of objects in order to transform.');
		return;
	}

	// Get all possible keys
	const defaultFields = {};
	data.forEach((row) => {
		Object.keys(row)
			.map((key) => `${key}`.trim())
			.filter(Boolean)
			.forEach((key) => defaultFields[key] = '');
	});

	// Add IDs and normalize column headings
	data = data.map((row) => {
		const newRow = {
			...defaultFields,
			__internal_id: uuid()
		};
		Object.entries(row).forEach(([key, value]) => {
			if(key in defaultFields) {
				newRow[key] = typeof value === 'object' ? JSON.stringify(value) : value;
			}
		});

		return newRow;
	});

	return data;
};
