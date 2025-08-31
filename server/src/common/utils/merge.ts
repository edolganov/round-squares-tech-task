interface Props {
  removeKeyOnSourceUndefined?: boolean;
}

export function mergeDeep(target: any, source: any, props?: Props) {
  const output: any = { ...target };

  if (isObjectForMerge(target) && isObjectForMerge(source)) {
    Object.keys(source).forEach((key) => {
      if (isObjectForMerge(source[key])) {
        if (!(key in target)) output[key] = source[key];
        else output[key] = mergeDeep(target[key], source[key], props);
      } else {
        output[key] = source[key];

        if (source[key] === undefined && props?.removeKeyOnSourceUndefined) {
          delete output[key];
        }
      }
    });
  }
  return output;
}

function isObjectForMerge(item: any) {
  return item && typeof item === 'object' && !Array.isArray(item);
}
