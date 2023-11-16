import { useCallback } from 'react';

const useImgDownload = () =>
    useCallback((url, name, customHeaders = {}) => {
        fetch(url, { headers: { ...customHeaders } })
            .then((response) => response.blob())
            .then((blob) => {
                const blobURL = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = blobURL;
                a.download = name && name.length ? name : 'download';
                a.click();
            })
            .catch((error) => console.log(error));
    }, []);

export default useImgDownload;
