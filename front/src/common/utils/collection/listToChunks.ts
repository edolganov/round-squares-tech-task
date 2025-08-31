// from https://stackoverflow.com/a/37826698
export function listToChunks<T>(list: T[], perChunk: number): T[][] {
  return list.reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / perChunk);

    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = []; // start a new chunk
    }

    resultArray[chunkIndex].push(item);

    return resultArray;
  }, [] as T[][]);
}
