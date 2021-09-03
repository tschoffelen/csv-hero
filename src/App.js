import React, { useEffect, useState } from 'react';
import GridTable from '@nadavshaar/react-grid-table';
import DragAndDrop from './components/DragAndDrop';
import { v4 as uuid } from 'uuid';

import { downloadDataAs } from './utils/download';
import { processData, readFile } from './utils/readFile';
import Export from './components/Export';
import { transformDefinitions } from './utils/transforms';
import Transformers from './components/Transformers';

function App() {
	const [file, setFile] = useState(null);
	const [data, setData] = useState(null);
	const [processedData, setProcessedData] = useState(null);
	const [id, setId] = useState(() => uuid());
	const [transforms, setTransforms] = useState([]);
	const [availableColumns, setAvailableColumns] = useState([]);

	const setTransformOptions = (transformId) => {
		return (newOptions) => {
			setTransforms((transforms) => transforms.map((transform) => transform.id === transformId ? {
				...transform,
				options: { ...transform.options, ...newOptions }
			} : transform));
		};
	};

	useEffect(() => {
		if (!data) {
			return;
		}

		// TODO: should we add a debounce here?

		let sourceData = [...data.map((row) => ({ ...row }))];
		const finalData = transforms.reduce((data, transformConfig) => {
			// TODO: this lookup is not ideal
			const setOptions = setTransformOptions(transformConfig.id);
			const transform = transformDefinitions.find(({ id }) => id === transformConfig.type);
			if (transform.map) {
				sourceData = sourceData.map((row) => transform.map(row, transformConfig.options, setOptions));
			}
			if (transform.transform) {
				sourceData = [...transform.transform(sourceData, transformConfig.options, setOptions)];
			}
			return sourceData;
		}, data);

		setProcessedData(finalData);
		setAvailableColumns(finalData[0] && typeof finalData[0] === 'object'
			? Object
				.keys(finalData[0])
				.filter((field) => field !== '__internal_id')
				.map((field) => field)
			: []);

		setId(uuid());
	}, [data, transforms]);

	return (
		<DragAndDrop handleDrop={async(file) => {
			const data = await readFile(file);
			const actualData = processData(data);
			if (!actualData) {
				return;
			}
			setData(actualData);
			setFile(file);
			setId(uuid());
		}}>
			<div className="bg-white h-screen flex w-full">
				<aside className="bg-gray-100 border-r border-gray-200 h-screen w-80 flex-0 flex flex-col">
					<section className="p-5 border-b border-gray-200 flex items-center justify-between">
						<h3 className="text-xs font-bold text-gray-600 uppercase">Source</h3>
						<p className="text-sm">
							{file ? file.name : 'Drop a CSV or JSON file to start'}
						</p>
					</section>
					{data && (
						<>
							<Transformers
								transforms={transforms}
								setTransforms={setTransforms}
								availableColumns={availableColumns}/>
							<Export
								rowsCount={processedData && processedData.length}
								onExport={(exportFormat) => downloadDataAs(processedData, exportFormat)}/>
						</>
					)}
				</aside>
				<main className="flex-1 h-screen text-sm" style={{ maxWidth: (window.innerWidth - 320) }}>
					{processedData ? (
						<GridTable
							key={id}
							rowIdField="__internal_id"
							enableColumnsReorder={false}
							showRowsInformation={false}
							showSearch={false}
							showColumnVisibilityManager={false}
							columns={
								processedData[0] && typeof processedData[0] === 'object'
									? Object
										.keys(processedData[0])
										.filter((field) => field !== '__internal_id')
										.map((field, id) => ({
											id,
											field,
											label: `${field} (${typeof processedData[0][field]})`
										}))
									: []
							}
							rows={processedData}
						/>
					) : (
						<span/>
					)}
				</main>
			</div>
		</DragAndDrop>
	);
}

export default App;
