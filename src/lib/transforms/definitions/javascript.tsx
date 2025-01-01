import CodeMirror from '@uiw/react-codemirror';
import 'codemirror/keymap/sublime';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/theme/night.css';
import { AlertTriangle, Tool } from 'react-feather';

const debounce = function(func, timeout = 300) {
	let timer;
	return (...args) => {
		clearTimeout(timer);
		timer = setTimeout(() => { func.apply(this, args); }, timeout);
	};
};

export const JavascriptTransform = {
	id: 'eval',
	title: 'Javascript',
	icon: Tool,
	group: "Advanced",
	defaultOptions: {
		script: 'rows.map((row) => {\n   row.random = Math.random();\n   return row;\n});',
		error: null
	},
	transform: (rows, options, setAttributes) => {
		try {
			// eslint-disable-next-line no-eval
			const value = eval(options.script);
			if (typeof value !== 'object' || !Array.isArray(value)) {
				// noinspection ExceptionCaughtLocallyJS
				throw new Error('Return value must be an array');
			}
			if (options.error) {
				setAttributes({ error: null });
			}
			return value;
		} catch (e) {
			if (options.error !== e.message) {
				setAttributes({ error: e.message });
			}
			console.log(`Failed executing script: `, e);
		}
		return rows;
	},
	controls: ({ options, setOptions }) => (
		<div className="-m-1 mx-0">
			<CodeMirror
				value={options.script}
				lazyLoadMode={false}
				options={{
					theme: 'night',
					keyMap: 'sublime',
					mode: 'js',
					lineNumbers: false,
					autofocus: true,
					tabSize: 3
				}}
				onChange={debounce((editor) => {
					setOptions({ script: editor.getValue() });
				})}
			/>
			{options.error && (
				<div className="p-1 py-2 px-4 justify-center text-yellow-700 text-xs flex items-center">
					<AlertTriangle className="flex-0 w-3 h-3 inline-block mr-2"/>
					<div>
						{options.error}
					</div>
				</div>
			)}
		</div>
	)
};
