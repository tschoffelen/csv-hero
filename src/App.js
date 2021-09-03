import React, { useState } from 'react';
import GridTable from '@nadavshaar/react-grid-table';
import DragAndDrop from './components/DragAndDrop';
import { ArrowUp, Folder, PlusCircle } from 'react-feather';
import { v4 as uuid } from 'uuid';

import { downloadDataAs } from './utils/download';
import { processData, readFile } from './utils/readFile';
import Export from './components/Export';

function App() {
	const [file, setFile] = useState(null);
	const [data, setData] = useState(null);
	const [id, setId] = useState(() => uuid());

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
			<aside>
				<section>
					<h3>Source</h3>
					{file ? (
						<div className="drag-and-drop current">
							{file.name}
						</div>
					) : (
						<div className="drag-and-drop">
							Drop a CSV or JSON file
						</div>
					)}
				</section>
				{data && (
					<>
						<section className="transform">
							<PlusCircle className="section-button" size={16} color="#fff"/>
							<Folder className="section-button" size={16} color="#fff"/>
							<h3>Transform</h3>

							<div className="item open">
								<ArrowUp className="item-toggle"/>
								<h4>Merge rows</h4>
								<p className="label">Deduplicate based on field</p>
								<div className="flex">
									<select className="input flex-flex">
										<option>gender</option>
										<option>last visited</option>
									</select>
									<select className="input">
										<option>use first row</option>
										<option>use last row</option>
									</select>
								</div>
							</div>

							<div className="item open">
								<ArrowUp className="item-toggle"/>
								<h4>Filter rows</h4>
								<p className="label">Column filter condition</p>
								<div className="flex">
									<select className="input">
										<option disabled>Field</option>
										<option>gender</option>
										<option>last visited</option>
									</select>
									<select className="input">
										<option>=</option>
										<option>!=</option>
										<option>&gt;</option>
										<option>&lt;</option>
										<option>&gt;=</option>
										<option>&lt;=</option>
									</select>
									<input className="input flex-flex" placeholder="value"/>
								</div>
							</div>

							<div className="item open">
								<ArrowUp className="item-toggle"/>
								<h4>Filter columns</h4>
								<p className="label">Column names</p>
								<div className="flex">
									<input className="input flex-flex" placeholder="column1,column2"/>
								</div>
							</div>

							<div className="item open">
								<ArrowUp className="item-toggle"/>
								<h4>Sort by</h4>
								<p className="label">Field sorting</p>
								<div className="flex">
									<select className="input flex-flex">
										<option disabled>Field</option>
										<option>gender</option>
										<option>last visited</option>
									</select>
									<select className="input">
										<option>ASC numeric</option>
										<option>DESC numeric</option>
										<option>ASC string</option>
										<option>DESC string</option>
									</select>
								</div>
							</div>

						</section>
						<Export onExport={(exportFormat) => downloadDataAs(data, exportFormat)}/>
					</>
				)}
			</aside>
			<main>
				{data ? (
					<GridTable
						key={id}
						rowIdField="__internal_id"
						columns={
							Object
								.keys(data[0])
								.filter((field) => field !== '__internal_id')
								.map((field, id) => ({
									id,
									field,
									label: `${field} (${typeof data[0][field]})`
								}))
						}
						rows={data}
					/>
				) : (
					<span/>
				)}
			</main>
		</DragAndDrop>
	);
}

export default App;
