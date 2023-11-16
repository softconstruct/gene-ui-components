import React, { useRef, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import JoditEditor from 'jodit-react';
// Import helpers
import { noop } from 'utils';
// Import configs
import { buttons, controls } from './config';
// Import styles
import './index.scss';

function RichEditor({
    id,
    name,
    value,
    onBlur,
    config,
    error,
    success,
    disabled,
    readOnly,
    onChange,
    tabIndex,
    placeholder,
    wrapperClassName,
    informationMessage,
    toolbarTextButtons,
    toolbarButtons,
    ...props
}) {
    const editorRef = useRef();

    const customButtons = useMemo(() => {
        let editorButtons = [...toolbarButtons];

        if (toolbarTextButtons && toolbarTextButtons.length) {
            editorButtons = [
                ...editorButtons,
                '|',
                ...toolbarTextButtons.map(({ label, value }) => ({
                    name: label,
                    tooltip: label,
                    exec: (editor) => editor.s.insertHTML(value)
                }))
            ];
        }

        return editorButtons;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [toolbarTextButtons]);

    const editorConfigs = useMemo(
        () => ({
            placeholder,
            buttons: customButtons,
            buttonsMD: customButtons,
            buttonsSM: customButtons,
            buttonsXS: customButtons,
            style: {
                width: '100%'
            },
            uploader: {
                insertImageAsBase64URI: true
            },
            controls,
            ...config
        }),
        [config, readOnly, placeholder, customButtons]
    );

    const handleBlur = useCallback(
        (event) => {
            onBlur(editorRef.current.value, event);
        },
        [editorRef, onBlur]
    );

    return (
        <div
            className={classnames('rich-editor-wrapper', wrapperClassName, {
                error,
                success,
                disabled,
                readonly: readOnly
            })}
        >
            {readOnly ? (
                <div className="jodit jodit-container">
                    <div className="jodit-workplace">
                        <div className="jodit-wysiwyg" dangerouslySetInnerHTML={{ __html: value }} />
                    </div>
                </div>
            ) : (
                <JoditEditor
                    id={id}
                    name={name}
                    ref={editorRef}
                    tabIndex={tabIndex}
                    onBlur={handleBlur}
                    onChange={onChange}
                    config={editorConfigs}
                    value={value}
                />
            )}
            {!!informationMessage && <div className="information-message">{informationMessage}</div>}
        </div>
    );
}

RichEditor.defaultProps = {
    value: '',
    zIndex: 1,
    onBlur: noop,
    onChange: noop,
    placeholder: '',
    toolbarButtons: [...buttons]
};

RichEditor.propTypes = {
    /**
     * Customize editor configs
     * More detail about the configs, read on the official web site
     * https://xdsoft.net/jodit/doc/
     */
    config: PropTypes.object,
    /**
     * id for editor container
     */
    id: PropTypes.string,
    /**
     * Name for editor container
     */
    name: PropTypes.string,
    /**
     * Fires an event when lose focus
     */
    onBlur: PropTypes.func,
    /**
     * Fires an event when content changes
     * onChange((value: string, event: Event) => void)
     */
    onChange: PropTypes.func,
    /**
     * Since the editor has its own modal windows, there may be a problem with
     * the zIndex so you can change it using this prop
     */
    tabIndex: PropTypes.number,
    /**
     * Will make Editor readonly when set to "true"
     */
    readOnly: PropTypes.bool,
    /**
     * Editor control value HTML string
     */
    value: PropTypes.string,
    /**
     * Editor content placeholder
     */
    placeholder: PropTypes.string,
    /**
     * Custom text buttons that display the text that you sent as value of button
     */
    toolbarTextButtons: PropTypes.arrayOf(PropTypes.object),
    /**
     * Editor wrapper className
     */
    wrapperClassName: PropTypes.string,
    /**
     * Control Editor error state with this prop
     */
    error: PropTypes.bool,
    /**
     * Control Editor success state with this prop
     */
    success: PropTypes.bool,
    /**
     * Control Editor disabled state with this prop
     */
    disabled: PropTypes.bool,
    /**
     * To customize editor toolbar buttons
     */
    toolbarButtons: PropTypes.arrayOf(PropTypes.string)
};

export default RichEditor;
