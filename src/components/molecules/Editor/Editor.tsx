import React, { FC, useState } from "react";
import classNames from "classnames";
import { EditorState, Modifier, RichUtils } from "draft-js";
import { Editor as EditorComponent } from "react-draft-wysiwyg";

import {
    ArrowUp,
    DocumentPen,
    Download,
    Fingerprint,
    Letter,
    Lock,
    LockOpen,
    Microphone,
    RecycleBin
} from "@geneui/icons";

// Components
import Button from "@components/atoms/Button";

// Styles
import "./Editor.scss";

interface IEditorProps {
    className?: string;
    placeholder?: string;
    // onSave?: (content: any) => void;
}

const FontFamilyControl = (props: any) => {
    const { editorState, onChange } = props;

    const onFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const fontValue = e.target.value;

        const selection = editorState.getSelection();
        const currentContent = editorState.getCurrentContent();
        const fonts = ["FONT_FAMILY_ARIAL", "FONT_FAMILY_TAHOMA", "FONT_FAMILY_ROBOTO"];

        let nextContentState = currentContent;
        fonts.forEach((font) => {
            nextContentState = Modifier.removeInlineStyle(nextContentState, selection, font);
        });

        let nextEditorState = EditorState.push(editorState, nextContentState, "change-inline-style");

        if (fontValue !== "default") {
            const styleName = `FONT_FAMILY_${fontValue.toUpperCase()}`;
            nextEditorState = RichUtils.toggleInlineStyle(nextEditorState, styleName);
        }

        onChange(nextEditorState);
    };

    return (
        <div tabIndex={0} role="button" onMouseDown={(e) => e.stopPropagation()} className="custom-font-wrapper">
            <select
                className="rdw-dropdown-selectedtext"
                onChange={onFontChange}
                defaultValue="default"
                style={{ width: "120px", padding: "5px", height: "30px" }}
            >
                <option value="default">Normal Text</option>
                <option value="arial">Arial</option>
                <option value="tahoma">Tahoma</option>
                <option value="roboto">Roboto</option>
            </select>
        </div>
    );
};

const customStyleMap = {
    FONT_FAMILY_ARIAL: { fontFamily: "Arial, sans-serif" },
    FONT_FAMILY_TAHOMA: { fontFamily: "Tahoma, sans-serif" },
    FONT_FAMILY_ROBOTO: { fontFamily: "Roboto, sans-serif" }
};

const CustomBoldButton = ({ onChange, editorState }: any) => {
    const handleClick = () => {
        onChange(RichUtils.toggleInlineStyle(editorState, "BOLD"));
    };

    const currentStyle = editorState.getCurrentInlineStyle();
    const isActive = currentStyle.has("BOLD");

    return (
        <div
            className={classNames("rdw-option-wrapper", { "rdw-option-active": isActive })}
            onClick={handleClick}
            title="Bold"
            onKeyDown={handleClick}
            role="button"
            tabIndex={0}
        >
            <Fingerprint />
        </div>
    );
};

const Editor: FC<IEditorProps> = ({ className, placeholder = "Placeholder" }) => {
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [isLocked, setIsLocked] = useState(false);

    const toggleLock = () => setIsLocked(!isLocked);

    return (
        <div className={classNames("editor-container", className)}>
            <div className="editor-main-wrapper">
                <EditorComponent
                    editorState={editorState}
                    onEditorStateChange={setEditorState}
                    readOnly={isLocked}
                    placeholder={placeholder}
                    toolbarClassName="editor-toolbar"
                    wrapperClassName="editor-wrapper"
                    editorClassName="editor-content"
                    customStyleMap={customStyleMap}
                    editorStyle={{ textAlign: "right", direction: "rtl" }}
                    toolbar={{
                        options: [
                            "history",
                            "blockType",
                            "fontFamily",
                            "inline",
                            "colorPicker",
                            "textAlign",
                            "list",
                            "link",
                            "embedded",
                            "image"
                        ],
                        history: { inDropdown: false, options: ["undo", "redo"] },
                        blockType: { inDropdown: true, options: ["Normal", "H1", "H2", "H3", "H4", "H5", "H6"] },
                        fontFamily: {
                            component: FontFamilyControl
                        },
                        inline: { inDropdown: false, options: ["italic", "underline", "strikethrough"] },
                        colorPicker: { inDropdown: true },
                        textAlign: { inDropdown: true },
                        list: { inDropdown: false, options: ["unordered", "ordered"] },
                        link: { inDropdown: false, showOpenOptionOnHover: true, defaultTargetOption: "_blank" },
                        embedded: { className: "embedded-icon" },
                        image: { className: "image-icon" }
                    }}
                    toolbarCustomButtons={[<CustomBoldButton />]}
                />
            </div>

            <div className="editor-footer">
                <div className="footer-actions left">
                    <Button className="icon-btn" Icon={Microphone} />
                    <Button className="icon-btn" Icon={Download} />
                    <Button className="icon-btn" Icon={ArrowUp} />
                    <Button className="icon-btn" Icon={Letter} />
                    <Button className="icon-btn" Icon={RecycleBin} />
                    <Button
                        className={classNames("icon-btn", { active: isLocked })}
                        Icon={isLocked ? Lock : LockOpen}
                        onClick={toggleLock}
                    />
                    <Button className="icon-btn" Icon={DocumentPen} />
                </div>
            </div>
        </div>
    );
};

export default Editor;
