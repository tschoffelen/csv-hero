import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { Plus } from 'react-feather';

import { transformDefinitions } from '../utils/transforms';

const AddTransformButton = ({ onClick }) => (
	<Menu as="div" className="relative">
		<div>
			<Menu.Button
				className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-indigo-600 border border-indigo-600 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
				<Plus
					className="w-4 h-4 mr-1"
					aria-hidden="true"
				/>
				Add transform
			</Menu.Button>
		</div>
		<Transition
			as={Fragment}
			enter="transition ease-out duration-100"
			enterFrom="transform opacity-0 scale-95"
			enterTo="transform opacity-100 scale-100"
			leave="transition ease-in duration-75"
			leaveFrom="transform opacity-100 scale-100"
			leaveTo="transform opacity-0 scale-95"
		>
			<Menu.Items
				className="absolute left-0 right-0 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
				<div className="px-1 py-1">
					{transformDefinitions.map((transform) => {
							const Icon = transform.icon;
							return (
								<Menu.Item>
									{({ active }) => (
										<button
											onClick={() => onClick(transform)}
											className={`${
												active ? 'bg-indigo-500 text-white' : 'text-gray-900'
											} group flex rounded-md items-center w-full px-2 py-2 text-sm`}
										>
											<Icon
												className="w-4 h-4 mr-2"
												aria-hidden="true"
											/>
											{transform.title}
										</button>
									)}
								</Menu.Item>
							);
						}
					)}
				</div>
			</Menu.Items>
		</Transition>
	</Menu>
);

export default AddTransformButton;
