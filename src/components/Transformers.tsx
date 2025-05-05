import { useState } from "react";
import { Settings, Trash } from "react-feather";
import { v4 as uuid } from "uuid";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import AddTransformButton from "./AddTransformButton";
import { Panel, PanelHeader } from "@/components/panel/PanelItem";
import { getTransformById } from "@/lib/transforms/definitions";
import { TransformConfig } from "@/lib/transforms/Transform";
import { Layer } from "@/lib/layers/Layer";

type TransformersProps = {
  transforms: TransformConfig[];
  setTransforms: any;
  layers: Layer[];
};

const Transformers = ({
  transforms,
  setTransforms,
  layers,
}: TransformersProps) => {
  const [openPanel, setOpenPanel] = useState<string | null>(null);

  const addTransform = (transform: any) => {
    const id = uuid();
    setTransforms((transforms) => [
      ...transforms,
      {
        id,
        type: transform.id,
        options: { ...(transform.defaultOptions || {}) },
      },
    ]);
    setOpenPanel(id);
  };

  const setTransformOptions = (transformId: string) => {
    return (newOptions: Record<string, any>) => {
      setTransforms((transforms: TransformConfig[]) =>
        transforms.map((transform) =>
          transform.id === transformId
            ? {
                ...transform,
                options: { ...transform.options, ...newOptions },
              }
            : transform
        )
      );
    };
  };

  const removeTransform = (transformId: string) => {
    setTransforms((transforms: TransformConfig[]) =>
      transforms.filter((transform) => transform.id !== transformId)
    );
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return; // dropped outside the list
    }

    const res = Array.from(transforms);
    const [removed] = res.splice(result.source.index, 1);
    res.splice(result.destination.index, 0, removed);

    setTransforms(res);
  };

  return (
    <section>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided: any) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {transforms.map((transformConfig, index) => {
                const transform = getTransformById(transformConfig.type);
                const layer = layers[index];
                const nextLayer = layers[index + 1];
                const open =
                  transform.controls && openPanel === transformConfig.id;
                return (
                  <Draggable
                    key={transformConfig.id}
                    draggableId={transformConfig.id}
                    index={index}
                  >
                    {(provided: any) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        style={provided.draggableProps.style}
                      >
                        <Panel className={open ? "bg-black" : ""}>
                          <div
                            {...provided.dragHandleProps}
                            className="cursor-move"
                          >
                            <PanelHeader icon={transform.icon}>
                              <div className="flex flex-1 items-center justify-between">
                                {transform.title}

                                <div className="flex items-center gap-3 ml-3">
                                  {transform.controls && (
                                    <button
                                      className="-m-2 p-2"
                                      onClick={() =>
                                        setOpenPanel((panel: string) =>
                                          panel === transformConfig.id
                                            ? null
                                            : transformConfig.id
                                        )
                                      }
                                    >
                                      <Settings
                                        className={`size-3 cursor-pointer ${
                                          open
                                            ? "text-white"
                                            : "text-gray-400 hover:text-gray-300"
                                        }`}
                                      />
                                    </button>
                                  )}
                                  <button
                                    className="-m-2 p-2"
                                    onClick={() =>
                                      removeTransform(transformConfig.id)
                                    }
                                  >
                                    <Trash className="size-3 cursor-pointer text-gray-400 hover:text-gray-300" />
                                  </button>
                                </div>
                              </div>
                            </PanelHeader>
                          </div>
                          {open && transform.controls && (
                            <div className="pt-3 pb-1 text-white overflow-hidden relative text-xs">
                              {transform.controls({
                                options: transformConfig.options,
                                setOptions: setTransformOptions(
                                  transformConfig.id
                                ),
                                attributes: nextLayer?.attributes || {},
                                columns: layer?.columns || layers[0].columns,
                                exampleRow: layer?.data[0] || layers[0].data[0],
                              })}
                            </div>
                          )}
                        </Panel>
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

      <AddTransformButton onClick={(transform) => addTransform(transform)} />
    </section>
  );
};

export default Transformers;
