import React, { FC } from 'react';

// Styles
import './Pill.scss';
import { Icon } from '../../../index';

interface IPillProps {
    /**
     * size description
     */
    size?: unknown;
}

/**
 * A Pill component used to display concise information or categorize content. Often used for labels or status indicators, Pill components are visually distinct and can convey different meanings through text and color coding.
 */
const Pill: FC<IPillProps> = ({ size }) => {
    return (
        <div className="pillTestHolder">
            <div className="pill pill_size_medium pill_fill pill_color_informative pill_icon_before">
                <Icon type={'bc-icon-info'} />
                <span className="pill__text">pill</span>
            </div>
            <div className="pill pill_size_medium pill_fill pill_color_informative pill_icon_after">
                <span className="pill__text">pill</span>
                <Icon type={'bc-icon-info'} />
            </div>
            <div className="pill pill_size_medium pill_fill pill_color_informative">
                <span className="pill__text">pill</span>
            </div>
            <div className="pill pill_size_medium pill_fill pill_color_informative pill_icon_only">
                <Icon type={'bc-icon-info'} />
            </div>
            <div className="pill pill_size_medium pill_color_informative">
                <Icon type={'bc-icon-info'} />
                <span className="pill__text">pill</span>
            </div>
            {/*todo color informative END*/}
            <div className="pill pill_size_medium pill_fill pill_color_neutral pill_icon_before">
                <Icon type={'bc-icon-info'} />
                <span className="pill__text">pill</span>
            </div>
            <div className="pill pill_size_medium pill_fill pill_color_neutral pill_icon_after">
                <span className="pill__text">pill</span>
                <Icon type={'bc-icon-info'} />
            </div>
            <div className="pill pill_size_medium pill_fill pill_color_neutral">
                <span className="pill__text">pill</span>
            </div>
            <div className="pill pill_size_medium pill_fill pill_color_neutral pill_icon_only">
                <Icon type={'bc-icon-info'} />
            </div>
            <div className="pill pill_size_medium pill_color_neutral">
                <Icon type={'bc-icon-info'} />
                <span className="pill__text">pill</span>
            </div>
            {/*todo color neutral END*/}
            <div className="pill pill_size_medium pill_fill pill_color_error pill_icon_before">
                <Icon type={'bc-icon-info'} />
                <span className="pill__text">pill</span>
            </div>
            <div className="pill pill_size_medium pill_fill pill_color_error pill_icon_after">
                <span className="pill__text">pill</span>
                <Icon type={'bc-icon-info'} />
            </div>
            <div className="pill pill_size_medium pill_fill pill_color_error">
                <span className="pill__text">pill</span>
            </div>
            <div className="pill pill_size_medium pill_fill pill_color_error pill_icon_only">
                <Icon type={'bc-icon-info'} />
            </div>
            <div className="pill pill_size_medium pill_color_error">
                <Icon type={'bc-icon-info'} />
                <span className="pill__text">pill</span>
            </div>
            {/*todo color error END*/}
            <div className="pill pill_size_medium pill_fill pill_color_success pill_icon_before">
                <Icon type={'bc-icon-info'} />
                <span className="pill__text">pill</span>
            </div>
            <div className="pill pill_size_medium pill_fill pill_color_success pill_icon_after">
                <span className="pill__text">pill</span>
                <Icon type={'bc-icon-info'} />
            </div>
            <div className="pill pill_size_medium pill_fill pill_color_success">
                <span className="pill__text">pill</span>
            </div>
            <div className="pill pill_size_medium pill_fill pill_color_success pill_icon_only">
                <Icon type={'bc-icon-info'} />
            </div>
            <div className="pill pill_size_medium pill_color_success">
                <Icon type={'bc-icon-info'} />
                <span className="pill__text">pill</span>
            </div>
            {/*todo color success END*/}
            <div className="pill pill_size_medium pill_fill pill_color_warning pill_icon_before">
                <Icon type={'bc-icon-info'} />
                <span className="pill__text">pill</span>
            </div>
            <div className="pill pill_size_medium pill_fill pill_color_warning pill_icon_after">
                <span className="pill__text">pill</span>
                <Icon type={'bc-icon-info'} />
            </div>
            <div className="pill pill_size_medium pill_fill pill_color_warning">
                <span className="pill__text">pill</span>
            </div>
            <div className="pill pill_size_medium pill_fill pill_color_warning pill_icon_only">
                <Icon type={'bc-icon-info'} />
            </div>
            <div className="pill pill_size_medium pill_color_warning">
                <Icon type={'bc-icon-info'} />
                <span className="pill__text">pill</span>
            </div>
            {/*todo color warning END*/}
            <div className="pill pill_size_medium pill_fill pill_color_purple pill_icon_before">
                <Icon type={'bc-icon-info'} />
                <span className="pill__text">pill</span>
            </div>
            <div className="pill pill_size_medium pill_fill pill_color_purple pill_icon_after">
                <span className="pill__text">pill</span>
                <Icon type={'bc-icon-info'} />
            </div>
            <div className="pill pill_size_medium pill_fill pill_color_purple">
                <span className="pill__text">pill</span>
            </div>
            <div className="pill pill_size_medium pill_fill pill_color_purple pill_icon_only">
                <Icon type={'bc-icon-info'} />
            </div>
            <div className="pill pill_size_medium pill_color_purple">
                <Icon type={'bc-icon-info'} />
                <span className="pill__text">pill</span>
            </div>
            {/*todo color purple END*/}
            <div className="pill pill_size_medium pill_fill pill_color_lagoon pill_icon_before">
                <Icon type={'bc-icon-info'} />
                <span className="pill__text">pill</span>
            </div>
            <div className="pill pill_size_medium pill_fill pill_color_lagoon pill_icon_after">
                <span className="pill__text">pill</span>
                <Icon type={'bc-icon-info'} />
            </div>
            <div className="pill pill_size_medium pill_fill pill_color_lagoon">
                <span className="pill__text">pill</span>
            </div>
            <div className="pill pill_size_medium pill_fill pill_color_lagoon pill_icon_only">
                <Icon type={'bc-icon-info'} />
            </div>
            <div className="pill pill_size_medium pill_color_lagoon">
                <Icon type={'bc-icon-info'} />
                <span className="pill__text">pill</span>
            </div>
            {/*todo color lagoon END*/}
            <div className="pill pill_size_medium pill_fill pill_color_magenta pill_icon_before">
                <Icon type={'bc-icon-info'} />
                <span className="pill__text">pill</span>
            </div>
            <div className="pill pill_size_medium pill_fill pill_color_magenta pill_icon_after">
                <span className="pill__text">pill</span>
                <Icon type={'bc-icon-info'} />
            </div>
            <div className="pill pill_size_medium pill_fill pill_color_magenta">
                <span className="pill__text">pill</span>
            </div>
            <div className="pill pill_size_medium pill_fill pill_color_magenta pill_icon_only">
                <Icon type={'bc-icon-info'} />
            </div>
            <div className="pill pill_size_medium pill_color_magenta">
                <Icon type={'bc-icon-info'} />
                <span className="pill__text">pill</span>
            </div>
            {/*todo color magenta END*/}
            <div className="pill pill_size_medium pill_fill pill_color_slate pill_icon_before">
                <Icon type={'bc-icon-info'} />
                <span className="pill__text">pill</span>
            </div>
            <div className="pill pill_size_medium pill_fill pill_color_slate pill_icon_after">
                <span className="pill__text">pill</span>
                <Icon type={'bc-icon-info'} />
            </div>
            <div className="pill pill_size_medium pill_fill pill_color_slate">
                <span className="pill__text">pill</span>
            </div>
            <div className="pill pill_size_medium pill_fill pill_color_slate pill_icon_only">
                <Icon type={'bc-icon-info'} />
            </div>
            <div className="pill pill_size_medium pill_color_slate">
                <Icon type={'bc-icon-info'} />
                <span className="pill__text">pill</span>
            </div>
            {/*todo color slate END*/}
            <div className="pill pill_size_medium pill_fill pill_color_inverse pill_icon_before">
                <Icon type={'bc-icon-info'} />
                <span className="pill__text">pill</span>
            </div>
            <div className="pill pill_size_medium pill_fill pill_color_inverse pill_icon_after">
                <span className="pill__text">pill</span>
                <Icon type={'bc-icon-info'} />
            </div>
            <div className="pill pill_size_medium pill_fill pill_color_inverse">
                <span className="pill__text">pill</span>
            </div>
            <div className="pill pill_size_medium pill_fill pill_color_inverse pill_icon_only">
                <Icon type={'bc-icon-info'} />
            </div>
            <div className="pill pill_size_medium pill_color_inverse">
                <Icon type={'bc-icon-info'} />
                <span className="pill__text">pill</span>
            </div>
            {/*todo color inverse END*/}
            <div className="pill pill_size_medium pill_fill pill_color_inverse pill_icon_before">
                <Icon type={'bc-icon-info'} />
                <span className="pill__text">pill</span>
            </div>
            <div className="pill pill_size_medium pill_fill pill_color_inverse pill_icon_after">
                <span className="pill__text">pill</span>
                <Icon type={'bc-icon-info'} />
            </div>
            <div className="pill pill_size_medium pill_fill pill_color_inverse">
                <span className="pill__text">pill</span>
            </div>
            <div className="pill pill_size_medium pill_fill pill_color_inverse pill_icon_only">
                <Icon type={'bc-icon-info'} />
            </div>
            <div className="pill pill_size_medium pill_color_inverse">
                <Icon type={'bc-icon-info'} />
                <span className="pill__text">pill</span>
            </div>

            {/*todo small_nudge START*/}
            <div className="pill pill_size_small_nudge pill_fill pill_color_informative pill_icon_before">
                <Icon type={'bc-icon-info'} />
                <span className="pill__text">pill</span>
            </div>
            <div className="pill pill_size_small_nudge pill_fill pill_color_informative pill_icon_after">
                <span className="pill__text">pill</span>
                <Icon type={'bc-icon-info'} />
            </div>
            <div className="pill pill_size_small_nudge pill_fill pill_color_informative">
                <span className="pill__text">pill</span>
            </div>
            <div className="pill pill_size_small_nudge pill_fill pill_color_informative pill_icon_only">
                <Icon type={'bc-icon-info'} />
            </div>
            <div className="pill pill_size_small_nudge pill_color_informative">
                <Icon type={'bc-icon-info'} />
                <span className="pill__text">pill</span>
            </div>
            {/*todo small_nudge END*/}
        </div>
    );
};

export { IPillProps, Pill as default };
