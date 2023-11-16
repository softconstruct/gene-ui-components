import React from 'react';

import Button from '../../../atoms/Button';
import Tooltip from '../../../molecules/Tooltip';

function TransferListButtons({ onTransmit, send, receive, readOnly }) {
    const handleReceive = () => onTransmit(send.id, receive.id);
    const handleSend = () => onTransmit(receive.id, send.id);

    return (
        <div className="bc-tl-buttons">
            <Tooltip text={send.title}>
                <Button
                    onClick={handleSend}
                    disabled={readOnly || send.disabled}
                    icon="bc-icon-arrow-right"
                    appearance="clean"
                />
            </Tooltip>
            <Tooltip text={receive.title}>
                <Button
                    onClick={handleReceive}
                    disabled={readOnly || receive.disabled}
                    icon="bc-icon-arrow-left"
                    appearance="clean"
                />
            </Tooltip>
        </div>
    );
}

export default TransferListButtons;
