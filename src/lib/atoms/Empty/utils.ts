import { IEmptyProps } from './index';
// @ts-ignore
import dataGreyscale from 'src/assets/media/empty-state/greyscale/data.svg';
// @ts-ignore
import imageGreyscale from 'src/assets/media/empty-state/greyscale/image.svg';
// @ts-ignore
import searchGreyscale from 'src/assets/media/empty-state/greyscale/search.svg';
// @ts-ignore
import dataTransparent from 'src/assets/media/empty-state/transparent/data.svg';
// @ts-ignore
import dataWithCircles from 'src/assets/media/empty-state/with-circles/data.svg';
// @ts-ignore
import messageGreyscale from 'src/assets/media/empty-state/greyscale/message.svg';
// @ts-ignore
import imageTransparent from 'src/assets/media/empty-state/transparent/image.svg';
// @ts-ignore
import imageWithCircles from 'src/assets/media/empty-state/with-circles/image.svg';
// @ts-ignore
import searchTransparent from 'src/assets/media/empty-state/transparent/search.svg';
// @ts-ignore
import searchWithCircles from 'src/assets/media/empty-state/with-circles/search.svg';
// @ts-ignore
import messageTransparent from 'src/assets/media/empty-state/transparent/message.svg';
// @ts-ignore
import dataWithoutCircles from 'src/assets/media/empty-state/without-circles/data.svg';
// @ts-ignore
import imageWithoutCircles from 'src/assets/media/empty-state/without-circles/image.svg';
// @ts-ignore
import searchWithoutCircles from 'src/assets/media/empty-state/without-circles/search.svg';
// @ts-ignore
import messageWithoutCircles from 'src/assets/media/empty-state/without-circles/message.svg';

type ImageTypes = { [key in NonNullable<IEmptyProps['type']>]: string };

type ImagesTypes = { [key in NonNullable<IEmptyProps['appearance']>]: ImageTypes };

export const images: ImagesTypes = {
    'with-circles': {
        data: dataWithCircles,
        image: imageWithCircles,
        search: searchWithCircles,
        message: messageWithoutCircles
    },
    'without-circles': {
        data: dataWithoutCircles,
        image: imageWithoutCircles,
        search: searchWithoutCircles,
        message: messageWithoutCircles
    },
    greyscale: {
        data: dataGreyscale,
        image: imageGreyscale,
        search: searchGreyscale,
        message: messageGreyscale
    },
    transparent: {
        data: dataTransparent,
        image: imageTransparent,
        search: searchTransparent,
        message: messageTransparent
    }
};
