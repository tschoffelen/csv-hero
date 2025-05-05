import { useDeferredValue, useEffect, useState } from "react";
import { Layer } from "./Layer";
import { getTransformById } from "@/lib/transforms/definitions";
import { TransformConfig } from "@/lib/transforms/Transform";

const useLayers = (baseLayer: Layer | null, transforms: TransformConfig[]) => {
  const [layers, setLayers] = useState<Layer[]>(baseLayer ? [baseLayer] : []);

  useEffect(() => {
    if (!baseLayer) {
      return;
    }

    (async () => {
      // TODO: re-use non-changed layers

      const newLayers = [baseLayer];
      for (const transformConfig of transforms) {
        const transform = getTransformById(transformConfig.type);
        if (!transform) continue;

        const lastLayer = newLayers[newLayers.length - 1];

        const newLayer = new Layer(lastLayer.data, {
          transform: transformConfig,
        });

        const setAttributes = newLayer.setAttributes.bind(newLayer);

        if (transform.map) {
          newLayer.data = newLayer.data.map((row) =>
            transform.map(row, transformConfig.options, setAttributes)
          );
        }

        if (transform.transform) {
          newLayer.data = [
            ...(await transform.transform(
              newLayer.data,
              transformConfig.options,
              setAttributes
            )),
          ];
        }

        newLayers.push(newLayer);
      }

      setLayers(newLayers);
    })();
  }, [baseLayer, transforms]);

  return useDeferredValue(layers);
};

export default useLayers;
