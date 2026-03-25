import { FC } from "react";

import { Document, IconProps, Image, NoteMusical, PlaySquare } from "@geneui/icons";

import { FileType } from "@components/molecules/FileUploadList/FileUploadItem/types";

export const icons: Record<FileType, FC<IconProps>> = {
    image: Image,
    video: PlaySquare,
    audio: NoteMusical,
    file: Document
};
