import React from 'react';
import { ChevronDown } from 'react-feather';

const Select = ({ value, children, onChange, className = '', ...props }) => {
	return (
		<div className={`relative flex ${className}`}>
			<select
				value={value}
				onChange={onChange}
				className="rounded-md flex-1 text-sm bg-white appearance-none h-9 px-2 pr-6 border border-gray-200"
				{...props}>
				{children}
			</select>
			<ChevronDown className="w-4 h-4 text-gray-400 absolute right-2 top-2.5 pointer-events-none"/>
		</div>
	);
};

export default Select;
