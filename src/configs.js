// update mechanism for this section is under consideration

export const clientConfigs = {};

export const updateConfig = (configs) => {
    for (const key in configs) {
        clientConfigs[key] = configs[key];
    }
};

export const breakPoints = {
    // screens
    xs: 576,
    md: 768,
    lg: 1024,
    xl: 1200,
    xxl: 1600
};

export const mobileScreenSize = Number(process.env.REACT_APP_MOBILE_SIZE) || breakPoints.lg;

export const screenTypes = ['desktop', 'mobile'];

export const colors = ['primary', 'confirm', 'danger'];

export const sizes = ['small', 'medium', 'big'];

export const positions = ['top', 'right', 'bottom', 'left'];

export const radius = ['default-radius', 'full-radius'];

export const inputConfig = {
    type: ['text', 'color', 'number', 'password', 'textarea', 'date', 'time', 'datetime-local'],
    appearance: ['outline', 'minimal', 'light'],
    size: ['small', 'default', 'big'],
    flexibility: ['full-width', 'content-size'],
    itemsDirection: ['start', 'end'],
    cornerRadius: ['full-radius', 'smooth-radius'],
    labelAppearance: ['none', 'title', 'swap']
};

export const titleConfig = {
    color: ['base', 'hero']
};

export const checkboxRadioSwitcherConfig = {
    size: ['small', 'big'],
    labelPosition: ['right', 'left', 'top', 'bottom'],
    labelAlignment: ['start', 'center', 'end']
};

export const tagConfig = {
    appearance: ['simple', 'minimal', 'outline', 'clean', 'light', 'colored'],
    size: ['small', 'medium', 'big'],
    flexibility: ['content-size', 'compact', 'full-width'],
    cornerRadius: ['full-radius', 'smooth-radius']
};

export const stepsConfig = {
    size: ['small', 'big'],
    direction: ['horizontal', 'vertical'],
    appearance: ['steps', 'dots'],
    status: ['initial', 'current', 'success', 'fail', 'activated']
};

export const popoverConfig = {
    align: ['start', 'end', 'center'],
    position: ['bottom', 'top', 'left', 'right'],
    cornerRadius: ['full-radius', 'smooth-radius'],
    behave: ['toggle', 'open']
};

export const popoverV2Config = {
    onOpenClassName: 'has-popover-opened',
    align: ['start', 'end', 'center'],
    position: ['bottom', 'top', 'left', 'right'],
    cornerRadius: ['full-radius', 'smooth-radius'],
    behave: ['toggle', 'open']
};

export const uploaderConfig = {
    uploaderAppearance: ['button', 'input', 'cloud', 'box'],
    uploadedItemsAppearance: ['light', 'minimal', 'detailed', 'box'],
    uploadedFilessAppearance: ['light', 'minimal'],
    gridColumnSize: {
        xs: 1,
        md: 2,
        lg: 4,
        xl: 5,
        xxl: 6
    }
};

export const moduleTitleConfig = {
    cornerRadius: ['position-radius', 'no-radius', 'full-radius'],
    position: ['top', 'bottom'],
    size: ['small', 'medium', 'big', 'extra-big']
};

export const widgetConfig = {
    type: ['default', 'compact', 'minimal', 'colorful'],
    size: ['small', 'medium', 'big'],
    comparisonStatus: ['initial', 'up', 'down']
};

export const customScrollbarConfig = {
    size: ['medium', 'small']
};

export const noDataConfig = ['data', 'image', 'search'];

export const timePickerConfig = {
    appearance: ['multipleInputs', 'singleInput']
};

export const optionConfig = {
    color: ['default', 'hero'],
    border: ['none', 'top', 'bottom'],
    sticky: ['none', 'top', 'bottom'],
    titlePosition: {
        start: 'start',
        center: 'center',
        end: 'end'
    }
};

export const advancedSearchConfig = {
    positions: {
        right: 'right',
        left: 'left'
    }
};

export const badgeConfig = {
    color: ['danger', 'primary'],
    size: ['default', 'medium', 'big', 'huge']
};
