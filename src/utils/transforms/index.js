import { FilterColumnsTransform, FilterValuesTransform } from './filter';
import { ArrayReverseTransform, ArrayShuffleTransform } from './array';
import { CoalesceTransform } from './coalesce';
import { MergeTransform } from './merge';
import { JavascriptTransform } from './javascript';
import { SortTransform } from './sort';

export const transformDefinitions = [
	FilterColumnsTransform,
	FilterValuesTransform,
	ArrayReverseTransform,
	ArrayShuffleTransform,
	CoalesceTransform,
	SortTransform,
	MergeTransform,
	JavascriptTransform
];
