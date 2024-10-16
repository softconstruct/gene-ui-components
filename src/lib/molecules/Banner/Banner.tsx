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
    return (
        <div className="banner banner_state_informative">
            {/* there are following states banner_state_informative // banner_state_warning // banner_state_error */}
            <div className="banner__content">
                <div className="banner__icon">i</div>
                <p className="banner__text">Description text goes here.</p>
            </div>
            <div className="banner__actions"></div>
        </div>
    );
};

export { IBannerProps, Banner as default };
