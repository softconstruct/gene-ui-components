import React from 'react';

import { Avatar, Divider } from 'components';

import './index.scss';

function ProfileModule({ username, email, avatarProps }) {
    return (
        <>
            <ul className="profile-module">
                <li>
                    <Avatar size="big" {...avatarProps} />
                </li>
                <li>
                    <div className="ellipsis-text">{username}</div>
                    <div className="profile-module-sub-title ellipsis-text">{email}</div>
                </li>
            </ul>
            <Divider type="horizontal" size="100%" />
        </>
    );
}

export default ProfileModule;
