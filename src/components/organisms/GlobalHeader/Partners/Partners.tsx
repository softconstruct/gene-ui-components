import React, { FC, useEffect, useRef, useState } from "react";

import { CaretDownFilled } from "@geneui/icons";

import Button from "@components/atoms/Button";
import { IPopoverRef, Popover, PopoverBody } from "@components/atoms/Popover";
import Scrollbar from "@components/atoms/Scrollbar";
import PartnerItem, { IPartnerItemProps } from "@components/organisms/GlobalHeader/Partners/PartnerItem";

import useClickOutside from "@hooks/useClickOutside";

import "./Partners.scss";

export type IPartnerItemData = Omit<IPartnerItemProps, "onChange">;

interface IPartnersProps {
    onPartnerSelect?: (partner: IPartnerItemData) => void;
    partners?: IPartnerItemData[];
}

const Partners: FC<IPartnersProps> = ({ onPartnerSelect, partners }) => {
    const [propsForProductsPopover, setPropsForProductsPopover] = useState<Record<string, unknown>>({});
    const [mappedPartners, setMappedPartners] = useState<IPartnerItemData[]>([]);
    const [selectedPartner, setSelectedPartner] = useState<IPartnerItemData | null>(null);
    const selectedPartnerRef = useRef<HTMLButtonElement | null>(null);
    const [isProductsOpen, setIsProductsOpen] = useState(false);
    const popoverRef = useRef<IPopoverRef>({
        floatingElement: { current: null },
        referenceElement: { current: null }
    });

    useEffect(() => {
        setMappedPartners(partners || []);
    }, [isProductsOpen]);

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
        if (isProductsOpen && currentRef) {
            currentRef.scrollIntoView({ behavior: "smooth" });
        }
    }, [selectedPartner, isProductsOpen, selectedPartnerRef.current, assignSelectedRef]);

    useClickOutside(() => {
        setIsProductsOpen(false);
    }, [popoverRef.current.floatingElement, popoverRef.current.referenceElement]);

    const onProductsToggle = () => {
        setIsProductsOpen((prevState) => !prevState);
    };

    const onPartnerItemSelect = (partner: IPartnerItemData) => {
        onPartnerSelect?.(partner);
        onProductsToggle();
    };

    const searchHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toLowerCase();
        const partnersSnapshot = partners?.length ? partners : [];
        setMappedPartners(() => {
            return partnersSnapshot.filter(
                (partner) => partner.name.toLowerCase().includes(value) || partner.id.toString().includes(value)
            );
        });
    };

    return (
        <div className="partners">
            <Button
                onClick={onProductsToggle}
                appearance="inverse"
                displayType="text"
                size="medium"
                Icon={CaretDownFilled}
                iconAfter
                {...propsForProductsPopover}
            >
                {selectedPartner?.name || "Partner"}
            </Button>
            <Popover
                setProps={setPropsForProductsPopover}
                position="bottom-right"
                size="medium"
                withArrow
                open={isProductsOpen}
                ref={popoverRef}
            >
                <PopoverBody withPadding={false} className="partners__popoverBody">
                    <input type="search" onChange={searchHandler} />
                    <Scrollbar className="partners__scrollbar">
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
                    </Scrollbar>
                </PopoverBody>
            </Popover>
        </div>
    );
};

export { IPartnersProps, Partners as default };
