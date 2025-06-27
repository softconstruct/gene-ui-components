import React, { FC, useEffect, useRef, useState } from "react";

import { CaretDownFilled } from "@geneui/icons";

// Components
import Button from "@components/atoms/Button";
import Loader from "@components/atoms/Loader";
import { IPopoverRef, Popover, PopoverBody } from "@components/atoms/Popover";
import Scrollbar from "@components/atoms/Scrollbar";
import Text from "@components/atoms/Text";
import PartnerItem, { IPartnerItemProps } from "@components/organisms/GlobalHeader/Partners/PartnerItem";

// Hooks
import useClickOutside from "@hooks/useClickOutside";

import "./Partners.scss";

export type IPartnerItemData = Omit<IPartnerItemProps, "onChange">;

interface IPartnersProps {
    onPartnerSelect?: (partner: IPartnerItemData) => void;
    partners?: IPartnerItemData[];
    loading?: boolean;
    loadingText?: string;
    searchPlaceholder?: string;
    disabled?: boolean;
    title?: string;
    idName?: string;
}

const Partners: FC<IPartnersProps> = ({
    onPartnerSelect,
    partners,
    loading,
    searchPlaceholder,
    loadingText = "Loading",
    disabled = false,
    title = "Partner",
    idName = "ID"
}) => {
    const [propsForProductsPopover, setPropsForProductsPopover] = useState<Record<string, unknown>>({});
    const [mappedPartners, setMappedPartners] = useState<IPartnerItemData[]>([]);
    const [selectedPartner, setSelectedPartner] = useState<IPartnerItemData | null>(null);
    const [hasScrolled, setHasScrolled] = useState(false);
    const selectedPartnerRef = useRef<HTMLButtonElement | null>(null);
    const [isProductsOpen, setIsProductsOpen] = useState(false);
    const popoverRef = useRef<IPopoverRef>({
        floatingElement: { current: null },
        referenceElement: { current: null }
    });

    useEffect(() => {
        setMappedPartners(partners || []);
    }, [partners]);

    useEffect(() => {
        if (!partners || partners.length === 0) return;
        const selected = partners.find((p) => p.selected) || null;
        setSelectedPartner(selected);
    }, [partners]);

    const assignSelectedRef = (el: HTMLButtonElement | null, id: string | number) => {
        if (selectedPartner?.id === id) {
            selectedPartnerRef.current = el;
        }
    };

    useEffect(() => {
        const currentRef = selectedPartnerRef.current;
        if (isProductsOpen && currentRef && !hasScrolled) {
            currentRef.scrollIntoView();
        }
    }, [selectedPartner, isProductsOpen, selectedPartnerRef.current, assignSelectedRef]);

    useClickOutside(() => {
        setIsProductsOpen(false);
    }, [popoverRef.current.floatingElement, popoverRef.current.referenceElement]);

    const onProductsToggle = () => {
        setHasScrolled(false);
        setIsProductsOpen((prevState) => !prevState);
    };

    const onPartnerItemSelect = (partner: IPartnerItemData) => {
        onPartnerSelect?.(partner);
        onProductsToggle();
    };

    const searchHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toLowerCase();
        const partnersSnapshot = partners?.length ? partners : [];
        setHasScrolled(true);
        setMappedPartners(() => {
            return partnersSnapshot.filter(
                (partner) => partner.title.toLowerCase().includes(value) || partner.id.toString().includes(value)
            );
        });
    };

    return (
        <div className="partners">
            <Button
                disabled={disabled}
                onClick={onProductsToggle}
                appearance="inverse"
                layout="text"
                size="medium"
                Icon={CaretDownFilled}
                iconPosition="after"
                {...propsForProductsPopover}
            >
                {selectedPartner?.title || "Partner"}
            </Button>
            <Popover
                setProps={setPropsForProductsPopover}
                position="bottom-right"
                size="medium"
                withArrow={false}
                open={isProductsOpen}
                ref={popoverRef}
            >
                <PopoverBody
                    withScrollbar={false}
                    withPadding={false}
                    className="partners__popoverBody popover_size_small"
                >
                    {loading ? (
                        <Loader className="partners__loader" text={loadingText} textPosition="below" />
                    ) : (
                        <div className="partners__popoverContent">
                            <div className="partners__header">
                                {/* todo: implement "Search Field" component */}
                                <input
                                    type="search"
                                    onChange={searchHandler}
                                    placeholder={searchPlaceholder}
                                    aria-label="Search partners"
                                    role="searchbox"
                                />
                                <div className="partners__title">
                                    <Text as="span" className="partners__titleName">
                                        {title}
                                    </Text>
                                    <Text as="span" className="partners__titleID">
                                        {idName}
                                    </Text>
                                </div>
                            </div>
                            <Scrollbar className="partners__scrollbar">
                                <div className="partners__content">
                                    {mappedPartners?.map((partner) => {
                                        return (
                                            <PartnerItem
                                                key={partner.id}
                                                {...partner}
                                                onChange={() => {
                                                    onPartnerItemSelect(partner);
                                                }}
                                                ref={(el) => {
                                                    return assignSelectedRef(el, partner.id);
                                                }}
                                            />
                                        );
                                    })}
                                </div>
                            </Scrollbar>
                        </div>
                    )}
                </PopoverBody>
            </Popover>
        </div>
    );
};

export { IPartnersProps, Partners as default };
