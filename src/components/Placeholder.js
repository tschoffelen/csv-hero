import React from 'react';
import { transformDefinitions } from '../utils/transforms';

const Placeholder = () => {
	return (
		<div className="bg-gray-100 h-screen flex w-full flex flex-col items-center justify-center">
			<div className="bg-white rounded-full h-48 w-48 aspect-square flex mb-10 items-center justify-center">
				<svg viewBox="0 0 20 20" className="h-24 text-green-600" xmlns="http://www.w3.org/2000/svg">
					<path
						fill="currentColor"
						fillRule="evenodd"
						d="M16 1H4c-.56 0-1 .44-1 1v16c0 .55.44 1 1 1h12c.55 0 1-.45 1-1V2c0-.552-.45-1-1-1Zm-1 7H9v9H8V8H5V7h3V3h1v4h6v1Z"/>
				</svg>
			</div>
			<p className="text-gray-600">
				Drop a CSV or JSON file to start formatting data
			</p>
			<div className="flex gap-4 mt-6">
				{transformDefinitions.map(({ id, icon: Icon }) => (
					<div key={id}>
						<Icon className="h-4 w-4 text-gray-400"/>
					</div>
				))}
			</div>
		</div>
	);
};

export default Placeholder;
