import { HTMLAttributes } from 'react';

export interface IHTMLDivElementAttributes extends Omit<HTMLAttributes<HTMLDivElement>, 'onKeyDown'> {}
