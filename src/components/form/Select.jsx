import React from 'react';
import { ChevronDown } from 'react-feather';

const Select = ({ value, children, onChange, className = '', ...props }) => {
	return (
		<div className={`relative flex max-w-full ${className}`}>
			<select
				value={value}
				onChange={onChange}
				className="rounded-md flex-1 text-sm bg-white max-w-full focus:ring-0 focus:outline-0 focus:shadow-0 appearance-none h-10 px-3 pr-6 border border-gray-300"
				{...props}>
				{children}
			</select>
			<ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none"/>
		</div>
	);
};

export default Select;
