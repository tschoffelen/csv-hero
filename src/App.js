import React, { useState } from "react";
import GridTable from '@nadavshaar/react-grid-table';
import DragAndDrop from "./components/DragAndDrop";
import { ArrowUp, Folder, PlusCircle } from "react-feather";
import Papa from 'papaparse';
import { v4 as uuid } from 'uuid';

const supportedExtensions = ['csv', 'tsv', 'json'];

function App() {
  const [file, setFile] = useState(null);
  const [data, setDataReal] = useState(null);
  const [id, setId] = useState(() => uuid());
  console.log(file);

  const readFile = (file) => {
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
        setData(csvData.data);
        break;
      default:
        try {
          setData(JSON.parse(result));
        } catch (e) {
          alert(`Error parsing JSON: ${e.toString()}`);
        }
        break;
      }
      setFile(file);
      setId(uuid());
    };

    reader.readAsText(file, 'UTF-8');
  };

  const setData = (data) => {
    // Check if array of objects, otherwise throw error
    if (!data || !Array.isArray(data) || !data[0] || typeof data[0] !== 'object') {
      alert('Invalid file: needs to evaluate to an array of objects in order to transform.');
      return;
    }

    // Get all possible keys
    const defaultFields = {};
    data.forEach((row) => {
      Object.keys(row).forEach((key) => defaultFields[key] = null);
    });

    // Add IDs and normalize column headings
    data = data.map((row) => {
      const newRow = {
        ...defaultFields,
        __internal_id: uuid()
      };
      Object.entries(row).forEach(([key, value]) => {
        newRow[key] = typeof value === 'object' ? JSON.stringify(value) : value;
      });

      return newRow;
    });

    setDataReal(data);
  };

  console.log(data);

  return (
    <DragAndDrop handleDrop={readFile}>
      <aside>
        <section>
          <h3>Source</h3>
          {file ? (
            <div className="drag-and-drop current">
              {file.name}
            </div>
          ) : (
            <div className='drag-and-drop'>
              Drop a CSV or JSON file
            </div>
          )}
        </section>
        <section className="transform">
          <PlusCircle className="section-button" size={16} color='#fff'/>
          <Folder className="section-button" size={16} color='#fff'/>
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
        <section>
          <h3>Export</h3>
          <div className="flex">
            <select className="input flex-flex">
              <option>JSON</option>
              <option>CSV</option>
            </select>
            <button>Export</button>
          </div>
        </section>
      </aside>
      <main>
        {data ? (
          <GridTable
            key={id}
            rowIdField='__internal_id'
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
