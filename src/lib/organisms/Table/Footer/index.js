import React from 'react';
import classnames from 'classnames';
import FooterItem from './item';
import ActionBar from '../Row/actionBar';

import './index.scss';

function Footer({ values, orders, withRightCorner, withLeftCorners, stickyLeftExist, ...rest }) {
    return (
        <div className="ta-row border-top">
            {withLeftCorners.map(
                (item, index) =>
                    item && (
                        <div
                            key={index}
                            className={classnames('ta-cell a-square', {
                                'sticky sticky-left now-sticky': stickyLeftExist
                            })}
                        />
                    )
            )}
            {orders.map(({ id }, index) => (
                <FooterItem id={id} key={index} index={index} text={values[id]} {...rest} />
            ))}
            {withRightCorner && <ActionBar />}
        </div>
    );
}

Footer.defaultProps = {
    values: {},
    withLeftCorners: []
};

export default Footer;
