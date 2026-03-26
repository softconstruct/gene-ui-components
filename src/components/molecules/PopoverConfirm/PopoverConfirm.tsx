import React, { Dispatch, FC, MutableRefObject, ReactNode, SetStateAction, useEffect, useRef, useState } from "react";
import { ReferenceType } from "@floating-ui/react";
import classNames from "classnames";

import { ErrorFilled, IconProps, TriangleAlert } from "@geneui/icons";

// Components
import {
    IPopoverFooterActionProps,
    IPopoverProps,
    IPopoverRef,
    Popover,
    PopoverBody,
    PopoverFooter
} from "@components/atoms/Popover";

// Hooks
import useClickOutside from "@hooks/useClickOutside";

// Styles
import "./PopoverConfirm.scss";

const appearanceByStatus = { error: "danger", warning: "primary" } as const;
const iconByStatus = { error: ErrorFilled, warning: TriangleAlert } as const;
const MARGIN = 12;

interface IPopoverConfirmProps {
    /**
     * Title displayed in the popover header. Required for PopoverConfirm.
     */
    title: string;
    /**
     * The content displayed inside the popover.
     */
    children: ReactNode;
    /**
     * Callback fired when the open state changes (e.g. outside click).
     */
    onOpenChange?: (isOpen: boolean) => void;
    /**
     * Visual status of the confirm dialog. Changes the header icon and the primary button appearance.<br/>
     * Possible values: `error | warning`
     * @default "warning"
     */
    status?: "error" | "warning";
    /**
     * Whether the popover is open initially. Defaults value is `false`.
     */
    defaultOpen?: boolean;
    /**
     * Define width and height of the popover.<br>
     * Possible values: `medium | small`
     * @default "medium"
     */
    size?: "medium" | "small";
    /**
     * Position of the popover, relative to the reference (trigger, anchor) element.<br><br>
     * Possible values: `bottom-center | bottom-left | bottom-right | left-bottom | left-center` <br> `left-top | right-bottom | right-center | right-top | top-center | top-left | top-right | auto`
     * @default "bottom-center"
     */
    position?: IPopoverProps["position"];
    /**
     * Function to update popover props dynamically.
     */
    setProps: Dispatch<SetStateAction<Record<string, unknown>>>;
    /**
     * If `true`, disables automatic repositioning of the popover when it would otherwise
     * overflow or collide with a window boundary. By default, the popover will attempt
     * to reposition itself (e.g., flip to another side) to remain visible.
     *
     * When `disableReposition` is enabled, the popover will instead remain in its
     * original placement, even if that causes it to overflow the viewport.
     * This can be useful when you want to handle overflow behavior manually or
     * maintain consistent placement.
     *
     * Note: Even with repositioning disabled, the component still provides
     * `nudgedLeft` and `nudgedTop` values, which can be used to handle content overflow.
     */
    disableReposition?: boolean;
    /**
     * Controls the open state of the popover externally.
     *
     * If `open` is provided, the component becomes a controlled component,
     * and its visibility will be dictated by the parent.
     * If `open` is not provided, the component manages its own open/close
     * state internally via user interaction (e.g., clicks).
     *
     * This allows the component to be used both in controlled and uncontrolled modes.
     */
    open?: boolean;
    /**
     * Action buttons displayed in the footer.
     * `primary` button is always required. `secondary` is optional.
     * Button appearances are derived internally:
     * - `primary`: based on `status` (`warning` -> `primary`, `error` -> `danger`)
     * - `secondary`: always `secondary`
     * @example
     * actions={{
     *   secondary: { text: "Cancel", onClick: handleCancel },
     *   primary: { text: "Delete", onClick: handleDelete }
     * }}
     */
    actions?: {
        primary: Omit<IPopoverFooterActionProps, "appearance">;
        secondary?: Omit<IPopoverFooterActionProps, "appearance">;
    };
}

/**
 * PopoverConfirm is designed to request and capture user confirmation for actions
 * in a visually prominent yet non-intrusive manner. It overlays the primary content
 * to present a confirmation dialog that includes clear options for users to confirm
 * or cancel the action.
 */
const PopoverConfirm: FC<IPopoverConfirmProps> = ({
    children,
    title,
    onOpenChange,
    open: controlledOpen,
    defaultOpen = false,
    status = "warning",
    size = "medium",
    position = "bottom-center",
    setProps,
    disableReposition = false,
    actions
}) => {
    const [isOpenState, setIsOpenState] = useState(defaultOpen);

    const popoverRef = useRef<IPopoverRef>({
        floatingElement: { current: null } as MutableRefObject<ReferenceType | null>,
        referenceElement: { current: null } as MutableRefObject<ReferenceType | null>
    });

    useEffect(() => {
        if (controlledOpen !== undefined) {
            setIsOpenState(controlledOpen);
        }
    }, [controlledOpen]);

    useClickOutside(
        (e) => {
            const onReferenceClick =
                e.target instanceof Node &&
                popoverRef.current.referenceElement?.current instanceof Node &&
                popoverRef.current.referenceElement.current.contains(e.target as Node);

            if (!onReferenceClick && isOpenState) {
                setIsOpenState(false);
                onOpenChange?.(false);
            }
        },
        [popoverRef.current.floatingElement]
    );

    const primaryButtonAppearance = appearanceByStatus[status];
    const IconComponent = iconByStatus[status];
    const headerIcon: FC<IconProps> = ({ className, ...props }: IconProps) => (
        <IconComponent {...props} className={classNames(className, `popoverConfirm__titleIcon_${status}`)} size={20} />
    );

    const footerActions = React.useMemo((): IPopoverFooterActionProps[] => {
        const currentActions = actions || {
            primary: { text: "Confirm" },
            secondary: { text: "Cancel" }
        };

        const resolvedActions: IPopoverFooterActionProps[] = [];

        if (currentActions.secondary) {
            resolvedActions.push({
                ...currentActions.secondary,
                appearance: "secondary"
            });
        }

        resolvedActions.push({
            ...currentActions.primary,
            appearance: primaryButtonAppearance
        });

        return resolvedActions;
    }, [actions, primaryButtonAppearance]);

    return (
        <div className="popoverConfirm">
            <Popover
                ref={popoverRef}
                open={isOpenState}
                defaultOpen={defaultOpen}
                size={size}
                position={position}
                margin={MARGIN}
                setProps={setProps}
                title={title}
                withArrow
                disableReposition={disableReposition}
                hasCloseButton={false}
                Icon={headerIcon}
                mobileHeightMode="fit"
            >
                <PopoverBody>
                    <div className={classNames("popoverConfirm__content", `popoverConfirm__content_size_${size}`)}>
                        {children}
                    </div>
                </PopoverBody>
                <PopoverFooter actions={footerActions} />
            </Popover>
        </div>
    );
};

export { IPopoverConfirmProps, PopoverConfirm as default };
