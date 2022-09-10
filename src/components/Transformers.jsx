import React, { useState } from 'react';
import { Settings, Trash } from 'react-feather';
import { v4 as uuid } from 'uuid';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import AddTransformButton from './AddTransformButton';
import { transformDefinitions } from '../utils/transforms';

const Transformers = ({ transforms, setTransforms, availableColumns, allColumns }) => {
	const [openPanel, setOpenPanel] = useState(null);

	const addTransform = (transform) => {
		const id = uuid();
		setTransforms((transforms) => ([...transforms, {
			id,
			type: transform.id,
			options: { ...(transform.defaultOptions || {}) }
		}]));
		setOpenPanel(id);
	};

	const setTransformOptions = (transformId) => {
		return (newOptions) => {
			setTransforms((transforms) => transforms.map((transform) => transform.id === transformId ? {
				...transform,
				options: { ...transform.options, ...newOptions }
			} : transform));
		};
	};

	const removeTransform = (transformId) => {
		setTransforms((transforms) => transforms.filter((transform) => transform.id !== transformId));
	};

	const onDragEnd = (result) => {
		if (!result.destination) {
			return; // dropped outside the list
		}

		const res = Array.from(transforms);
		const [removed] = res.splice(result.source.index, 1);
		res.splice(result.destination.index, 0, removed);

		setTransforms(res);
	};

	return (
		<section className="p-5 border-b border-gray-200 flex-1">
			<h3 className="text-xs font-bold text-gray-600 uppercase mb-3">Transform</h3>
			{/*<Folder className="section-button" size={16} color="#fff"/>*/}

			<DragDropContext onDragEnd={onDragEnd}>
				<Droppable droppableId="droppable">
					{(provided) => (
						<div
							{...provided.droppableProps}
							ref={provided.innerRef}
						>
							{transforms.map((transformConfig, index) => {
								// TODO: this lookup is not ideal
								const transform = transformDefinitions.find(({ id }) => id === transformConfig.type);
								const Icon = transform.icon;
								const open = transform.controls && openPanel === transformConfig.id;
								return (
									<Draggable key={transformConfig.id} draggableId={transformConfig.id} index={index}>
										{(provided) => (
											<div
												ref={provided.innerRef}
												{...provided.draggableProps}
												className={`border border-gray-300 rounded-md mb-3 pb-1 ${open ? 'bg-white' : 'bg-gray-100'}`}
												style={provided.draggableProps.style}>
												<div
													{...provided.dragHandleProps}
													className={`p-3 pb-2 flex justify-between items-center cursor-move`}>
													<h3
														className="flex flex-1 text-sm font-medium items-center"
														onClick={() => transform.controls && setOpenPanel((panel) => panel === transformConfig.id ? null : transformConfig.id)}>
														<Icon className="w-4 h-4 mr-2"/>
														{transform.title}
													</h3>
													{transform.controls && (
														<Settings
															onClick={() => setOpenPanel((panel) => panel === transformConfig.id ? null : transformConfig.id)}
															className={`w-4 h-4 ml-3 cursor-pointer ${open ? 'text-indigo-800' : 'text-gray-500 hover:text-gray-800'}`}/>
													)}
													<Trash
														onClick={() => removeTransform(transformConfig.id)}
														className="w-4 h-4 cursor-pointer text-gray-500 hover:text-gray-800 ml-3"/>
												</div>
												{open && transform.controls && (
													<div className="p-3 pt-1 pb-2 overflow-hidden relative text-sm">
														{transform.controls({
															options: transformConfig.options,
															setOptions: setTransformOptions(transformConfig.id),
															availableColumns,
															allColumns
														})}
													</div>
												)}
											</div>
										)}
									</Draggable>
								);
							})}
							{provided.placeholder}
						</div>
					)}
				</Droppable>
			</DragDropContext>

			<AddTransformButton
				onClick={(transform) => addTransform(transform)}
			/>

		</section>
	);
};

export default Transformers;
