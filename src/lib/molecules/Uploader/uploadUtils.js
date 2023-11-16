import { getImageDimensions } from 'utils';

export const typeListReplacer = 'TYPE_LIST';
export const maxFileSizeReplacer = 'MAX_FILE_SIZE';

export const getFileByUrl = async (url, file, isImageUpload, customHeaders) => {
    const res = await fetch(url, { headers: { ...customHeaders } });
    const blob = await res.blob();
    const blobFile = {
        blob,
        ...file
    };

    if (isImageUpload) {
        blobFile.dimensions = await getImageDimensions(blob);
    }

    return blobFile;
};

export const addDragEventListener = (element, handleDragIn, handleDragOut, handleDrop) => {
    element.addEventListener('dragenter', handleDragIn);
    element.addEventListener('dragover', handleDragIn);
    element.addEventListener('dragleave', handleDragOut);
    element.addEventListener('dragend', handleDragOut);
    element.addEventListener('drop', handleDrop);
};

export const removeDragEventListener = (element, handleDragIn, handleDragOut, handleDrop) => {
    element.removeEventListener('dragenter', handleDragIn);
    element.removeEventListener('dragover', handleDragIn);
    element.removeEventListener('dragleave', handleDragOut);
    element.removeEventListener('dragend', handleDragOut);
    element.removeEventListener('drop', handleDrop);
};

export const toBlobFile = async (file, isImageUpload) => {
    const blob = new Blob([file], { type: file.type });
    const blobFile = {
        name: file.name,
        blob,
        path: URL.createObjectURL(blob)
    };

    if (isImageUpload) {
        const dimensions = await getImageDimensions(blob);

        blobFile.dimensions = dimensions;
    }

    return blobFile;
};

/**
 * Checking the file for the size and type of rules
 * and return each one of them.
 */
export const isValidFile = ({ allTypesAccepted, isImageUpload, maxFileSize, typesList, file }) => {
    const fileType = file && file.name && file.name.split('.').pop()?.toLowerCase();

    return {
        isValidSize: file.size <= maxFileSize,
        isValidType: typesList.length ? typesList.includes(fileType) : allTypesAccepted
    };
};

export const generateFilesByPage = (files) => {
    if (files && files.length) {
        const data = files.map((path) => {
            const binary = new ArrayBuffer(path.length);
            const blob = new Blob([binary], { type: 'image/jpeg' });

            return {
                blob,
                path,
                name: path.split('/').pop()
            };
        });

        return data;
    }
    return [];
};

export const getLastMod = (url, cb) => {
    fetch(url).then((response) => {
        const headersObj = Object.fromEntries([...response.headers]);
        return cb(headersObj['last-modified']);
    });
};
