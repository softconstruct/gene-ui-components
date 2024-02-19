import React, { useMemo, useEffect, useState } from 'react';
import experimental from '../../assets/experimental.svg';
import deprecated from '../../assets/deprecated.svg';
import './index.css';

import libVersions from '../../lib-versions.json';

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
const [lastVersion] = [...versions].reverse();

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
            const sidebar = document.querySelector('.css-194spiq');
            const currentVersionRegex = /v\d+\.\d+\.\d+/;
            const [versionInURL] = window.location.href.match(currentVersionRegex) || [];
            const currentVersion = versionInURL || lastVersion;
            const versions__select = getVersionDropdown(currentVersion);
            sidebar.insertAdjacentHTML('beforeend', versions__select);
            const select = document.querySelector('#versions__select');

            select.addEventListener('change', () => {
                const modifiedURL = versionInURL
                    ? window.location.href.replace(currentVersion, select.value)
                    : window.location.href.replace(/(\.com\/)(\?path=)/, `$1${currentVersion}$2`);

                window.location.href = modifiedURL;
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
