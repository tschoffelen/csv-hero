import { FilterColumnsTransform, FilterValuesTransform } from "./filter";
import { ArrayReverseTransform } from "./reverse";
import { ArrayShuffleTransform } from "./shuffle";
import { CoalesceTransform } from "./coalesce";
import { MergeTransform } from "./merge";
import { JavascriptTransform } from "./javascript";
import { SortTransform } from "./sort";
import { RenameTransform } from "./rename";
import { AddColumnTransform } from "./add-column";
import { AppendTransform } from "./append";
import { OpenAITransform } from "./openai";
import { SqlTransform } from "./sql";

export const transformDefinitions = [
  FilterValuesTransform,
  SortTransform,
  ArrayReverseTransform,
  ArrayShuffleTransform,
  RenameTransform,
  FilterColumnsTransform,
  MergeTransform,
  AddColumnTransform,
  AppendTransform,
  CoalesceTransform,
  OpenAITransform,
  JavascriptTransform,
  SqlTransform,
];

export const getTransformById = (id: string): any =>
  transformDefinitions.find((transform) => transform.id === id);
