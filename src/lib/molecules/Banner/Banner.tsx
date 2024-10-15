import React, { FC } from 'react';

// Styles
import './Banner.scss';

interface IBannerProps {
    // fill Banner component props interface
}

/**
 * Banner component is a prominent, horizontally-oriented message box designed to capture the user's attention and convey important information across the top of a page. It is used for announcements, alerts, promotions, or updates that need to be immediately visible to users.
 */
const Banner: FC<IBannerProps> = (props) => {
    return <div className="banner">Banner</div>;
};

export { IBannerProps, Banner as default };
