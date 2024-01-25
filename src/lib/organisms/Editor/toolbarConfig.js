// Statics
import emojis from './emojis';

export const fullToolbarOptions = (isMobile) => {
    if (isMobile) {
        return ['inline', 'fontSize', 'blockType', 'fontFamily', 'list', 'textAlign', 'remove', 'history'];
    }

    return [
        'inline',
        'blockType',
        'fontSize',
        'fontFamily',
        'list',
        'textAlign',
        'colorPicker',
        'link',
        'emoji',
        'image',
        'remove',
        'history'
    ];
};

export const defaultToolbarConfig = (isMobile) => ({
    options: fullToolbarOptions(isMobile),
    inline: {
        options: ['bold', 'italic', 'underline', 'strikethrough', 'monospace', 'superscript', 'subscript']
    },
    blockType: {
        inDropdown: true,
        options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'Blockquote', 'Code']
    },
    fontSize: {
        options: [8, 10, 12, 14, 16, 18, 24, 30, 36, 48]
    },
    fontFamily: {
        options: ['Arial', 'Georgia', 'Impact', 'Tahoma', 'Times New Roman', 'Verdana']
    },
    textAlign: {
        options: ['left', 'center', 'right', 'justify']
    },
    colorPicker: {
        colors: ['#000000', '#ffffff', '#FFC000', '#007FFF', '#0000FF', '#0000FF', '#800020', '#FFFF00']
    },
    link: {
        showOpenOptionOnHover: true,
        defaultTargetOption: '_self',
        options: ['link', 'unlink']
    },
    emoji: {
        emojis
    },
    image: {
        urlEnabled: true,
        uploadEnabled: true,
        alignmentEnabled: true,
        previewImage: true,
        inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg',
        alt: {
            present: false,
            mandatory: false
        },
        defaultSize: {
            height: 'auto',
            width: 'auto'
        }
    },
    remove: {
        title: 'Clean formatting'
    },
    history: {
        options: ['undo', 'redo']
    }
});
