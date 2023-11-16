import React, { useMemo, useEffect, useState } from 'react';
import experimental from '../../assets/experimental.svg';
import deprecated from '../../assets/deprecated.svg';
import './index.css';

import libVersions from '../../lib-versions';

const cmpStages = {
    '-e': {
        src: experimental,
        alt: 'The component is experimental'
    },
    '-d': {
        src: deprecated,
        alt: 'The component is deprecated'
    }
};

const { versions } = libVersions;

const getVersionDropdown = (currentVersion) =>
    `<div class="versions">
    <label for="versions__select" class="versions__label">Versions</label>
            <select name="cars" id="versions__select" class="versions__select">
            ${versions.map((option) => {
                return `<option 
                                    value=${option} 
                                    ${option === currentVersion ? 'selected' : ''} 
                                    class="versions__option"
                                    >
                                    ${option}
                                  </option>`;
            })}
            </select>
         </div>`;

let renderOnce = true;

const SidebarLabelWrapper = ({ item }) => {
    const stage = useMemo(() => (item.id[item.id.length - 2] === '-' ? item.name.slice(-2) : null), []);
    const name = useMemo(() => (stage ? item.name.replace(stage, '') : item.name), []);

    useEffect(() => {
        if (renderOnce || !document.querySelector('#versions__select')) {
            renderOnce = false;
            const sidebar = document.querySelector('.os-content');
            const currentVersionRegex = /v\d\.\d\.\d/;
            const currentVersion =
                window.location.href.match(currentVersionRegex) && window.location.href.match(currentVersionRegex)[0];
            const versions__select = getVersionDropdown(currentVersion);
            sidebar.insertAdjacentHTML('beforeend', versions__select);
            const select = document.querySelector('#versions__select');
            select.addEventListener('change', () => {
                if (currentVersion) {
                    window.location.href = window.location.href.replace(currentVersion, select.value);
                }
            });
        }
    }, []);

    return (
        <div className="sidebarLabel">
            <span className="sidebarLabel__name">{name}</span>
            {stage && (
                <img
                    className="sidebarLabel__icon"
                    src={cmpStages[stage].src}
                    alt={cmpStages[stage].alt}
                    title={cmpStages[stage].alt}
                />
            )}
        </div>
    );
};

export default SidebarLabelWrapper;
