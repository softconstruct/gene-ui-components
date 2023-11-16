const meridiemValues = ['am', 'pm'];

export const checkTimeValidation = ({ hour, minute, second, meridiem }) => {
    const isHourValid = !hour.format || (meridiem ? hour.value < 12 : hour.value < 24);

    const isMinuteValid = !minute.format || (minute.value >= 0 && minute.value < 60);

    const isSecondValid = !second.format || (second.value >= 0 && second.value < 60);

    const isMeridiemValid =
        !meridiem || !meridiem.format || !meridiem.value || meridiemValues.includes(meridiem.value.toLowerCase());

    return isHourValid && isMinuteValid && isSecondValid && isMeridiemValid;
};
