import { INTERNAL_ID_FIELD } from "@/lib/constants";
import { v4 as uuid } from "uuid";

export type LayerAttributes = Record<string, any>;
export type LayerColumns = Map<string, string>;

export class Layer {
  private _data: Array<Record<string, any>>;
  columns: LayerColumns = new Map();
  attributes: LayerAttributes = {};
  id: string;

  constructor(data: Array<Record<string, any>>, attributes?: LayerAttributes) {
    this._data = [...data.map((row) => ({ ...row }))];
    this.attributes = attributes || {};
    this.id = uuid();

    this.recalculateColumns();
  }

  public setAttributes(attributes: LayerAttributes) {
    this.attributes = { ...this.attributes, ...attributes };
  }

  public set data(data: Array<Record<string, any>>) {
    this._data = [...data.map((row) => ({ ...row }))];
    this.recalculateColumns();
  }

  public get data() {
    return this._data;
  }

  public getColumnNames() {
    return Array.from(this.columns.keys());
  }

  public recalculateColumns() {
    this.columns = new Map();
    for (let i = 0; i < Math.min(this._data.length, 100); i++) {
      const row = this._data[i];
      if (row && typeof row === "object") {
        for (const key in row) {
          if(key === INTERNAL_ID_FIELD) continue;
          if (!this.columns.has(key)) {
            this.columns.set(key, typeof row[key]);
          } else if (this.columns.get(key) !== typeof row[key] && !!row[key]) {
            this.columns.set(key, "mixed");
          }
        }
      }
    }
  }
}
