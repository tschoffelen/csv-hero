import { FilterColumnsTransform, FilterValuesTransform } from './filter';
import { ArrayReverseTransform, ArrayShuffleTransform } from './array';
import { JavascriptTransform } from './javascript';

export const transformDefinitions = [
	FilterColumnsTransform,
	FilterValuesTransform,
	ArrayReverseTransform,
	ArrayShuffleTransform,
	JavascriptTransform
];
