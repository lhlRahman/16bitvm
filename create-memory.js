const createMemory = (sizeInBytes) => {
    const arrayBuffer = new ArrayBuffer(sizeInBytes);
    const dataView = new DataView(arrayBuffer);
    return dataView;
} 

module.export = createMemory;