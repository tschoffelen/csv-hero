import { FilterColumnsTransform, FilterValuesTransform } from './filter';
import { ArrayReverseTransform, ArrayShuffleTransform } from './array';
import { CoalesceTransform } from './coalesce';
import { JavascriptTransform } from './javascript';

export const transformDefinitions = [
	FilterColumnsTransform,
	FilterValuesTransform,
	ArrayReverseTransform,
	ArrayShuffleTransform,
	CoalesceTransform,
	JavascriptTransform
];
