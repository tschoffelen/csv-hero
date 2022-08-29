import { FilterColumnsTransform, FilterValuesTransform } from './filter';
import { ArrayReverseTransform, ArrayShuffleTransform } from './array';
import { CoalesceTransform } from './coalesce';
import { MergeTransform } from './merge';
import { JavascriptTransform } from './javascript';
import { SortTransform } from './sort';
import { RenameTransform } from './rename';

export const transformDefinitions = [
	FilterValuesTransform,
	FilterColumnsTransform,
	ArrayReverseTransform,
	ArrayShuffleTransform,
	CoalesceTransform,
	RenameTransform,
	SortTransform,
	MergeTransform,
	JavascriptTransform,
];
