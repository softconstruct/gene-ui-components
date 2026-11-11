import React, { ChangeEvent } from "react";
import { InputMask } from "@react-input/mask";
import { mount, ReactWrapper } from "enzyme";
import { act } from "react-dom/test-utils";

// Components
import GeneUIProvider from "@components/providers/GeneUIProvider";

import { INPUT_CHANGE_DEBOUNCE_MS } from "@internal/components/Picker";

// Helpers
import {
    addDays,
    addMonths,
    createBounds,
    createDateMaskTrack,
    formatDate,
    formatDay,
    formatFullDate,
    formatMonthYear,
    formatYear,
    fromISO,
    getCalendarKeyTarget,
    getDateMask,
    getMonthDistance,
    getMonthWeeks,
    getNearestAvailableDate,
    getPanelPageBounds,
    getRangeBand,
    getWeekdayNames,
    getYearPageStart,
    getYearPageYears,
    isCalendarPageOutOfBounds,
    isFormattedDate,
    isSameCalendarPage,
    isSameDate,
    isSupportedDate,
    isValidDateFormat,
    orderPanelDates,
    parseDate,
    resolveDateFormat,
    resolveLocalization,
    resolvePresetDay,
    resolveRangePreset,
    resolveSinglePreset,
    toISO
} from "./helpers";
// Components
import DatePicker, { IRangeDatePickerProps, ISingleDatePickerProps } from "./index";
// Types
import { CalendarDate, DatePickerFormat, DatePickerPreset, DatePickerRangePreset } from "./types";

jest.useFakeTimers();
// Monday, 9 November 2026
jest.setSystemTime(new Date(2026, 10, 9, 12));

const date = (iso: string) => fromISO(iso)!;

// ---------------------------------------------------------
// Calendar references, written without the helpers under test
// ---------------------------------------------------------

const referenceIsLeapYear = (year: number) => (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

const referenceDaysInMonth = (year: number, month: number) =>
    [31, referenceIsLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];

/**
 * Sakamoto's weekday formula; `0` is Sunday, as in `Date.getDay()`.
 */
const referenceWeekday = ({ year, month, day }: CalendarDate) => {
    const monthOffsets = [0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4];
    const y = month < 3 ? year - 1 : year;

    return (y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) + monthOffsets[month - 1] + day) % 7;
};

const referenceNextDay = ({ year, month, day }: CalendarDate): CalendarDate => {
    if (day < referenceDaysInMonth(year, month)) return { year, month, day: day + 1 };

    return month < 12 ? { year, month: month + 1, day: 1 } : { year: year + 1, month: 1, day: 1 };
};

const FORMATS: DatePickerFormat[] = [
    "DD/MM/YYYY",
    "MM/DD/YYYY",
    "YYYY-MM-DD",
    "DD.MM.YYYY",
    "YYYY年MM月DD日",
    "MMDDYYYY"
];

const monthBefore = (today: string) => toISO(addMonths(fromISO(today)!, -1));

// The presets of the design, configured the way a consumer does.
const SINGLE_PRESETS: DatePickerPreset[] = [
    { label: "Today", value: 0 },
    { label: "Yesterday", value: -1 },
    { label: "7 days ago", value: -7 },
    { label: "14 days ago", value: -14 },
    { label: "1 month ago", value: monthBefore }
];

const RANGE_PRESETS: DatePickerRangePreset[] = [
    { label: "Today", value: { start: 0, end: 0 } },
    { label: "Yesterday", value: { start: -1, end: -1 } },
    { label: "Last 7 days", value: { start: -6, end: 0 } },
    { label: "Last 14 days", value: { start: -13, end: 0 } },
    { label: "Last 30 days", value: { start: -29, end: 0 } },
    { label: "1 month ago", value: (today) => ({ start: monthBefore(today), end: today }) }
];

const changeEvent = (value: string) => ({ target: { value } }) as unknown as ChangeEvent<HTMLInputElement>;

const typeWithoutPause = (setup: ReactWrapper, value: string, index = 0) => {
    act(() => {
        setup.find(InputMask).at(index).prop("onChange")?.(changeEvent(value));
    });
    setup.update();
};

const typeInto = (setup: ReactWrapper, value: string, index = 0) => {
    typeWithoutPause(setup, value, index);

    act(() => {
        jest.advanceTimersByTime(INPUT_CHANGE_DEBOUNCE_MS);
    });
    setup.update();
};

const inputs = (setup: ReactWrapper) => setup.find("input.pickerMaskedInput");

const openPopover = (setup: ReactWrapper, index = 0) => {
    inputs(setup).at(index).simulate("click");
    setup.update();
};

const blurInput = (setup: ReactWrapper, index = 0) => {
    inputs(setup).at(index).simulate("blur", { relatedTarget: null });
    setup.update();
};

const button = (setup: ReactWrapper, label: string) => setup.find(`button[aria-label="${label}"]`);

/**
 * Clicks the button with the label, in the panel at `index` where each panel of a range has one.
 */
const click = (setup: ReactWrapper, label: string, index = 0) => {
    button(setup, label).at(index).simulate("click");
    setup.update();
};

/**
 * The page the calendar shows, as its grid names it: `March 2026`, `2026` or `2020-2029`.
 */
const heading = (setup: ReactWrapper) => setup.find('[role="grid"]').prop("aria-label");

/**
 * The pages of the panels of a range calendar, from the first one.
 */
const headings = (setup: ReactWrapper) => setup.find('[role="grid"]').map((grid) => grid.prop("aria-label"));

const panel = (setup: ReactWrapper, index: number) => setup.find(".datePicker__picker").at(index);

const headerItems = (setup: ReactWrapper) => setup.find(".datePicker__headerItem").map((item) => item.text());

const presetList = (setup: ReactWrapper) => setup.find('div[role="listbox"]');

const presetItems = (setup: ReactWrapper) => presetList(setup).find('button[role="option"]');

const preset = (setup: ReactWrapper, text: string) => presetItems(setup).filterWhere((item) => item.text() === text);

const presetTabStop = (setup: ReactWrapper) => presetItems(setup).filterWhere((item) => item.prop("tabIndex") === 0);

const pickPreset = (setup: ReactWrapper, text: string) => {
    preset(setup, text).simulate("click");
    setup.update();
};

const tabStop = (setup: ReactWrapper) =>
    setup.find('button[role="gridcell"]').filterWhere((cell) => cell.prop("tabIndex") === 0);

const tabStops = (setup: ReactWrapper) => tabStop(setup).map((cell) => cell.prop("aria-label"));

const pressInGrid = (setup: ReactWrapper, key: string, shiftKey = false, index = 0) => {
    setup.find('[role="grid"]').at(index).simulate("keydown", { key, shiftKey });
    setup.update();
};

/**
 * The ISO dates reported through `onChange`, read from `event.target.value` the way a consumer does.
 */
const changedValues = (onChange: jest.Mock): string[] =>
    onChange.mock.calls.map(([event]: [ChangeEvent<HTMLInputElement>]) => event.target.value);

const mountSingle = (props: ISingleDatePickerProps = {}) =>
    mount(<DatePicker {...props} />, { wrappingComponent: GeneUIProvider });
const mountRange = (props: IRangeDatePickerProps = {}) =>
    mount(<DatePicker.Range {...props} />, { wrappingComponent: GeneUIProvider });

describe("DatePicker helpers", () => {
    describe("parseDate and formatDate", () => {
        it.each([
            ["DD/MM/YYYY", "09/11/2026"],
            ["MM/DD/YYYY", "11/09/2026"],
            ["YYYY-MM-DD", "2026-11-09"],
            ["DD.MM.YYYY", "09.11.2026"]
        ] as const)("reads and writes the %s format", (format, text) => {
            expect(parseDate(text, format)).toEqual({ year: 2026, month: 11, day: 9 });
            expect(formatDate({ year: 2026, month: 11, day: 9 }, format)).toBe(text);
        });

        it("returns null for incomplete input", () => {
            expect(parseDate("09/11/20", "DD/MM/YYYY")).toBeNull();
            expect(parseDate("", "DD/MM/YYYY")).toBeNull();
        });

        it("clamps out of range parts", () => {
            expect(parseDate("31/04/2026", "DD/MM/YYYY")).toEqual({ year: 2026, month: 4, day: 30 });
            expect(parseDate("15/19/2026", "DD/MM/YYYY")).toEqual({ year: 2026, month: 12, day: 15 });
            expect(parseDate("00/00/0000", "DD/MM/YYYY")).toEqual({ year: 1, month: 1, day: 1 });
        });

        it("knows the leap years", () => {
            expect(parseDate("29/02/2027", "DD/MM/YYYY")).toEqual({ year: 2027, month: 2, day: 28 });
            expect(parseDate("29/02/2028", "DD/MM/YYYY")).toEqual({ year: 2028, month: 2, day: 29 });
            expect(parseDate("29/02/2100", "DD/MM/YYYY")).toEqual({ year: 2100, month: 2, day: 28 });
        });
    });

    describe("ISO values", () => {
        it("reads and writes ISO dates", () => {
            expect(fromISO("2026-03-05")).toEqual({ year: 2026, month: 3, day: 5 });
            expect(toISO({ year: 2026, month: 3, day: 5 })).toBe("2026-03-05");
        });

        it("clamps out of range parts and rejects anything else", () => {
            expect(fromISO("2026-02-30")).toEqual({ year: 2026, month: 2, day: 28 });
            expect(fromISO("05/03/2026")).toBeNull();
            expect(fromISO("2026-3-5")).toBeNull();
            expect(fromISO(null)).toBeNull();
        });
    });

    describe("input mask", () => {
        const insert = (data: string, value: string, selectionStart = value.length) =>
            ({ inputType: "insert", data, value, selectionStart, selectionEnd: selectionStart }) as const;

        it("builds the mask from the format", () => {
            expect(getDateMask("DD/MM/YYYY")).toBe("__/__/____");
            expect(getDateMask("YYYY-MM-DD")).toBe("____-__-__");
        });

        it("only accepts the digits a day and a month can start with", () => {
            const track = createDateMaskTrack("DD/MM/YYYY");

            expect(track(insert("4", ""))).toBe(false);
            expect(track(insert("3", ""))).toBe("3");
            expect(track(insert("2", "15/"))).toBe(false);
            expect(track(insert("1", "15/"))).toBe("1");
            expect(track(insert("9", "15/03/"))).toBe("9");
        });

        it("follows the order of the format", () => {
            const track = createDateMaskTrack("YYYY-MM-DD");

            expect(track(insert("9", ""))).toBe("9");
            expect(track(insert("2", "2026-"))).toBe(false);
            expect(track(insert("4", "2026-11-"))).toBe(false);
        });

        it("builds the mask and the slots of a custom format", () => {
            const track = createDateMaskTrack("MMDDYYYY");

            expect(getDateMask("YYYY年MM月DD日")).toBe("____年__月__日");
            expect(getDateMask("DD de MM de YYYY")).toBe("__ de __ de ____");
            expect(track(insert("2", ""))).toBe(false);
            expect(track(insert("4", "11"))).toBe(false);
            expect(track(insert("3", "11"))).toBe("3");
        });
    });

    describe("custom formats", () => {
        const day = date("2026-11-09");

        it.each([
            "DD/MM/YYYY",
            "YYYY.MM.DD",
            "MM-DD-YYYY",
            "DDMMYYYY",
            "YYYY年MM月DD日",
            "DD de MM de YYYY",
            "(DD) MM YYYY"
        ])("accepts %s", (format) => {
            expect(isValidDateFormat(format)).toBe(true);
            expect(resolveDateFormat(format)).toBe(format);
        });

        it.each(["D/M/YYYY", "DD/MM/YY", "MMM DD, YYYY", "DD/MM", "DD/DD/YYYY", "DD_MM_YYYY", "dd/mm/yyyy", ""])(
            "falls back to DD/MM/YYYY for %p",
            (format) => {
                expect(isValidDateFormat(format)).toBe(false);
                expect(resolveDateFormat(format)).toBe("DD/MM/YYYY");
            }
        );

        it("writes and reads the parts in any order, with any text around them", () => {
            expect(formatDate(day, "YYYY年MM月DD日")).toBe("2026年11月09日");
            expect(formatDate(day, "MMDDYYYY")).toBe("11092026");
            expect(formatDate(day, "DD de MM de YYYY")).toBe("09 de 11 de 2026");
            expect(parseDate("2026年11月09日", "YYYY年MM月DD日")).toEqual(day);
            expect(parseDate("11092026", "MMDDYYYY")).toEqual(day);
            expect(parseDate("09 de 11 de 2026", "DD de MM de YYYY")).toEqual(day);
        });

        it("reads the text of a format literally", () => {
            expect(parseDate("09x11x2026", "DD.MM.YYYY")).toBeNull();
            expect(parseDate("(09) 11 2026", "(DD) MM YYYY")).toEqual(day);
            expect(parseDate("09+11+2026", "DD+MM+YYYY")).toEqual(day);
            expect(parseDate("091111112026", "DD+MM+YYYY")).toBeNull();
        });

        it("reads a typed date without the text after its last part, which the mask leaves out", () => {
            expect(parseDate("2026年11月09", "YYYY年MM月DD日")).toEqual(day);
            expect(parseDate("(09) 11 2026", "(DD) MM YYYY)")).toEqual(day);
            expect(isFormattedDate("2026年11月09", day, "YYYY年MM月DD日")).toBe(true);
            expect(isFormattedDate("2026年11月09日", day, "YYYY年MM月DD日")).toBe(true);
            expect(isFormattedDate("2026年11月31", date("2026-11-30"), "YYYY年MM月DD日")).toBe(false);
            expect(isFormattedDate("09/11/2026", day, "DD/MM/YYYY")).toBe(true);
        });
    });

    describe("month grid", () => {
        it("shows six weeks from Monday", () => {
            const weeks = getMonthWeeks(2026, 11);

            expect(weeks).toHaveLength(6);
            expect(weeks.every((week) => week.length === 7)).toBe(true);
            expect(weeks[0][0]).toEqual({ year: 2026, month: 10, day: 26 });
            expect(weeks[5][6]).toEqual({ year: 2026, month: 12, day: 6 });
        });

        it("keeps the day of the month when moving by months where it can", () => {
            expect(addMonths(date("2026-01-31"), 1)).toEqual({ year: 2026, month: 2, day: 28 });
            expect(addMonths(date("2026-11-15"), -12)).toEqual({ year: 2025, month: 11, day: 15 });
        });

        it("names the days, months and years of the Gregorian calendar in every locale", () => {
            const day = date("2026-11-09");

            expect(formatDay(day, "fa-IR")).toBe("۹");
            expect(formatMonthYear(2026, 11, "fa-IR")).toBe("نوامبر ۲۰۲۶");
            expect(formatYear(2026, "th-TH")).toBe("2026");
            expect(formatFullDate(day, "en-US")).toBe("Monday, November 9, 2026");
        });

        it("pages the years by decade, with the year before and the year after it", () => {
            expect(getYearPageStart(2026)).toBe(2020);
            expect(getYearPageStart(2020)).toBe(2020);
            expect(getYearPageStart(2019)).toBe(2010);
            expect(getYearPageYears(2026)).toEqual([
                2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030
            ]);
            expect(getYearPageYears(1).slice(0, 3)).toEqual([-1, 0, 1]);
        });

        it("tells the supported dates", () => {
            expect(isSupportedDate({ year: 1, month: 1, day: 1 })).toBe(true);
            expect(isSupportedDate({ year: 9999, month: 12, day: 31 })).toBe(true);
            expect(isSupportedDate({ year: 0, month: 12, day: 31 })).toBe(false);
            expect(isSupportedDate({ year: 10000, month: 1, day: 1 })).toBe(false);
        });

        it("names the weekday columns from Monday", () => {
            expect(getWeekdayNames("en-US").map((name) => name.long)).toEqual([
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday"
            ]);
        });
    });

    /**
     * The Gregorian calendar repeats itself every 400 years — the same 97 leap years and the same
     * weekdays — so the months from 2000 to 2399 cover every layout a month can have. Each one is
     * checked against the references above.
     */
    describe("a full 400-year cycle", () => {
        const months = Array.from({ length: 400 * 12 }, (_, index) => ({
            year: 2000 + Math.floor(index / 12),
            month: (index % 12) + 1
        }));

        it("checks the references against known dates", () => {
            expect(referenceWeekday({ year: 1970, month: 1, day: 1 })).toBe(4);
            expect(referenceWeekday({ year: 2000, month: 1, day: 1 })).toBe(6);
            expect(referenceWeekday({ year: 2026, month: 11, day: 9 })).toBe(1);
            expect(
                months.filter(({ year, month }) => month === 2 && referenceDaysInMonth(year, month) === 29)
            ).toHaveLength(97);
        });

        it("shows every day of every month once, in order, in the column of its weekday", () => {
            const problems: string[] = [];

            [...months, { year: 1, month: 1 }, { year: 9999, month: 12 }].forEach(({ year, month }) => {
                const days = getMonthWeeks(year, month).flat();
                const daysOfMonth = days
                    .filter((day) => day.year === year && day.month === month)
                    .map((day) => day.day);
                const expectedDays = Array.from({ length: referenceDaysInMonth(year, month) }, (_, index) => index + 1);

                if (days.length !== 42) problems.push(`${year}-${month}: ${days.length} cells`);
                if (daysOfMonth.join() !== expectedDays.join())
                    problems.push(`${year}-${month}: ${daysOfMonth.join()}`);
                if (daysOfMonth.length && days.findIndex((day) => day.day === 1 && day.month === month) > 6) {
                    problems.push(`${year}-${month}: the 1st is not in the first week`);
                }

                days.forEach((day, index) => {
                    // The first column is Monday (1), the last one Sunday (0).
                    if (referenceWeekday(day) !== (index + 1) % 7)
                        problems.push(`${toISO(day)} is in column ${index % 7}`);
                    if (index > 0 && !isSameDate(day, referenceNextDay(days[index - 1]))) {
                        problems.push(`${toISO(day)} follows ${toISO(days[index - 1])}`);
                    }
                });
            });

            expect(problems).toEqual([]);
        });

        it("corrects a day past the end of every month and keeps the day when moving a month on", () => {
            const problems: string[] = [];
            const pad = (value: number) => String(value).padStart(2, "0");

            months.forEach(({ year, month }) => {
                const lastDay = referenceDaysInMonth(year, month);
                const next = month < 12 ? { year, month: month + 1 } : { year: year + 1, month: 1 };

                if (
                    !isSameDate(parseDate(`${pad(lastDay + 1)}/${pad(month)}/${year}`, "DD/MM/YYYY"), {
                        year,
                        month,
                        day: lastDay
                    })
                ) {
                    problems.push(`day ${lastDay + 1} of ${year}-${month}`);
                }

                const expected = { ...next, day: Math.min(31, referenceDaysInMonth(next.year, next.month)) };

                if (!isSameDate(addMonths({ year, month, day: 31 }, 1), expected)) {
                    problems.push(`a month after ${year}-${month}-31`);
                }
            });

            expect(problems).toEqual([]);
        });

        it("writes and reads back every day of the cycle in every format", () => {
            const problems: string[] = [];
            let day: CalendarDate = { year: 2000, month: 1, day: 1 };

            // 146,097 days make exactly 400 years.
            for (let count = 0; count < 146097; count++) {
                const current = day;

                FORMATS.forEach((format) => {
                    const text = formatDate(current, format);

                    if (!isSameDate(parseDate(text, format), current)) problems.push(`${text} (${format})`);
                });

                if (!isSameDate(fromISO(toISO(current)), current)) problems.push(toISO(current));

                day = referenceNextDay(current);
            }

            expect(problems).toEqual([]);
            expect(day).toEqual({ year: 2400, month: 1, day: 1 });
        });
    });

    describe("bounds", () => {
        const bounds = createBounds([date("2026-03-10")], [date("2026-05-20")]);

        it("keeps the tightest limit of each side", () => {
            expect(createBounds([date("2026-03-10"), date("2026-04-01")], [null]).min).toEqual(date("2026-04-01"));
            expect(createBounds([], []).min).toEqual({ year: 1, month: 1, day: 1 });
        });

        it("moves a date to the bound it went past", () => {
            expect(getNearestAvailableDate(date("2026-01-01"), bounds)).toEqual(date("2026-03-10"));
            expect(getNearestAvailableDate(date("2026-04-01"), bounds)).toEqual(date("2026-04-01"));
            expect(getNearestAvailableDate(date("2026-09-01"), bounds)).toEqual(date("2026-05-20"));
        });

        it("tells which calendar pages have nothing to select", () => {
            expect(isCalendarPageOutOfBounds("days", date("2026-02-28"), bounds)).toBe(true);
            expect(isCalendarPageOutOfBounds("days", date("2026-03-01"), bounds)).toBe(false);
            expect(isCalendarPageOutOfBounds("months", date("2027-01-01"), bounds)).toBe(true);
            expect(isCalendarPageOutOfBounds("years", date("2019-01-01"), bounds)).toBe(true);
            expect(isCalendarPageOutOfBounds("years", date("2020-01-01"), bounds)).toBe(false);
            expect(isCalendarPageOutOfBounds("years", date("2030-01-01"), bounds)).toBe(true);
        });
    });

    describe("presets", () => {
        const today = date("2026-11-09");

        it("reads a day as an ISO date or as whole days from today", () => {
            expect(resolvePresetDay(0, today)).toEqual(today);
            expect(resolvePresetDay(-10, today)).toEqual(date("2026-10-30"));
            expect(resolvePresetDay("2024-02-29", today)).toEqual(date("2024-02-29"));
            expect(resolvePresetDay("2026-02-30", today)).toEqual(date("2026-02-28"));
            expect(resolvePresetDay(0.5, today)).toBeNull();
            expect(resolvePresetDay("09/11/2026", today)).toBeNull();
            expect(resolvePresetDay(-800000, today)).toBeNull();
        });

        it("calls a function with today's ISO date and orders the days of a range", () => {
            const value = jest.fn(() => ({ start: 0, end: -6 }));

            expect(resolveRangePreset({ label: "", value }, today)).toEqual({ start: date("2026-11-03"), end: today });
            expect(value).toHaveBeenCalledWith("2026-11-09");
            expect(resolveRangePreset({ label: "", value: { start: "soon", end: 0 } }, today)).toBeNull();
            expect(resolveSinglePreset({ label: "", value: () => -1 }, today)).toEqual(date("2026-11-08"));
        });
    });

    describe("range panels", () => {
        it("counts the months between two dates", () => {
            expect(getMonthDistance(date("2026-11-30"), date("2027-02-01"))).toBe(3);
            expect(getMonthDistance(date("2027-02-01"), date("2026-11-30"))).toBe(-3);
            expect(getMonthDistance(date("2026-11-01"), date("2026-11-30"))).toBe(0);
        });

        it("tells whether two dates are on one page of a view", () => {
            expect(isSameCalendarPage("days", date("2026-11-01"), date("2026-11-30"))).toBe(true);
            expect(isSameCalendarPage("days", date("2026-11-30"), date("2026-12-01"))).toBe(false);
            expect(isSameCalendarPage("months", date("2026-01-01"), date("2026-12-31"))).toBe(true);
            expect(isSameCalendarPage("years", date("2020-01-01"), date("2029-12-31"))).toBe(true);
            expect(isSameCalendarPage("years", date("2029-12-31"), date("2030-01-01"))).toBe(false);
        });

        it("leaves each of two panels room for the other inside the bounds", () => {
            const bounds = createBounds([date("2026-01-15")], [date("2026-03-10")]);

            expect(getPanelPageBounds(bounds, 0, 1)).toEqual({ min: date("2026-01-01"), max: date("2026-03-31") });
            expect(getPanelPageBounds(bounds, 0, 2)).toEqual({ min: date("2026-01-01"), max: date("2026-02-28") });
            expect(getPanelPageBounds(bounds, 1, 2)).toEqual({ min: date("2026-02-01"), max: date("2026-03-31") });
        });

        it("moves the panels a panel would meet, keeping their days", () => {
            const order = (dates: string[], index: number) =>
                orderPanelDates(dates.map(date), index).map((day) => toISO(day));

            expect(order(["2024-09-23", "2024-10-06"], 0)).toEqual(["2024-09-23", "2024-10-06"]);
            expect(order(["2024-10-15", "2024-10-06"], 0)).toEqual(["2024-10-15", "2024-11-06"]);
            expect(order(["2025-01-31", "2024-10-06"], 0)).toEqual(["2025-01-31", "2025-02-06"]);
            expect(order(["2024-09-23", "2024-09-03"], 1)).toEqual(["2024-08-23", "2024-09-03"]);
            expect(order(["2024-03-31", "2024-03-03"], 1)).toEqual(["2024-02-29", "2024-03-03"]);
        });

        it("finds the days of a week row that a range covers", () => {
            const range = { start: date("2024-09-23"), end: date("2024-10-06") };
            const week = (first: string, empty = 0) =>
                Array.from({ length: 7 }, (_, index) => (index < empty ? null : addDays(date(first), index)));

            expect(getRangeBand(week("2024-09-23"), range)).toEqual({ from: 0, to: 6, isStart: true, isEnd: false });
            expect(getRangeBand(week("2024-09-30", 1), range)).toEqual({ from: 1, to: 6, isStart: false, isEnd: true });
            expect(getRangeBand(week("2024-09-16"), range)).toBeNull();
            expect(getRangeBand(week("2024-09-30").slice(0, 1).concat(Array(6).fill(null)), range)).toEqual({
                from: 0,
                to: 0,
                isStart: false,
                isEnd: false
            });
        });
    });

    describe("getCalendarKeyTarget", () => {
        const day = date("2026-11-11");

        it.each([
            ["ArrowRight", "2026-11-12"],
            ["ArrowLeft", "2026-11-10"],
            ["ArrowDown", "2026-11-18"],
            ["ArrowUp", "2026-11-04"],
            ["Home", "2026-11-09"],
            ["End", "2026-11-15"],
            ["PageDown", "2026-12-11"],
            ["PageUp", "2026-10-11"]
        ])("moves the day with %s", (key, expected) => {
            expect(toISO(getCalendarKeyTarget("days", day, key)!)).toBe(expected);
        });

        it("moves by a year with Shift+PageUp and leaves other keys alone", () => {
            expect(toISO(getCalendarKeyTarget("days", day, "PageUp", { shiftKey: true })!)).toBe("2025-11-11");
            expect(getCalendarKeyTarget("days", day, "a")).toBeNull();
        });

        it("follows the layout in RTL", () => {
            expect(toISO(getCalendarKeyTarget("days", day, "ArrowRight", { isRTL: true })!)).toBe("2026-11-10");
        });

        it("moves by cells, rows and pages in the month and year views", () => {
            expect(getCalendarKeyTarget("months", day, "ArrowDown")).toMatchObject({ year: 2027, month: 2 });
            expect(getCalendarKeyTarget("months", day, "Home")).toMatchObject({ year: 2026, month: 1 });
            expect(getCalendarKeyTarget("months", day, "End")).toMatchObject({ year: 2026, month: 12 });
            expect(getCalendarKeyTarget("years", day, "ArrowUp")).toMatchObject({ year: 2023 });
            expect(getCalendarKeyTarget("years", day, "Home")).toMatchObject({ year: 2020 });
            expect(getCalendarKeyTarget("years", day, "End")).toMatchObject({ year: 2029 });
            expect(getCalendarKeyTarget("years", day, "PageDown")).toMatchObject({ year: 2036 });
        });
    });

    describe("resolveLocalization", () => {
        it("falls back to the defaults for missing entries", () => {
            expect(resolveLocalization({ nextMonth: "Հաջորդ ամիս", clear: "" })).toMatchObject({
                nextMonth: "Հաջորդ ամիս",
                clear: "Clear date selection"
            });
        });
    });
});

describe("DatePicker", () => {
    let setup: ReactWrapper<ISingleDatePickerProps>;

    beforeEach(() => {
        setup = mount(<DatePicker />, { wrappingComponent: GeneUIProvider });
    });

    afterEach(() => {
        setup.unmount();
        jest.clearAllMocks();
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    it("renders className prop correctly", () => {
        setup.setProps({ className: "test-class" });

        expect(setup.find(".datePicker").hasClass("test-class")).toBeTruthy();
    });

    it("renders label and required indicator correctly", () => {
        setup.setProps({ label: "Select date", required: true });

        expect(setup.find("Label").prop("text")).toBe("Select date");
        expect(setup.find("Label").prop("required")).toBe(true);
    });

    it("renders placeholder prop correctly", () => {
        setup.setProps({ placeholder: "DD/MM/YYYY" });

        expect(inputs(setup).prop("placeholder")).toBe("DD/MM/YYYY");
    });

    it.each(["small", "medium", "large"] as const)("should have %s size", (size) => {
        setup.setProps({ size });

        expect(setup.find(".pickerShell").hasClass(`pickerShell_size_${size}`)).toBeTruthy();
    });

    it("ties the label to the input with a generated unique id", () => {
        const twoPickers = mount(
            <div>
                <DatePicker label="first" />
                <DatePicker label="second" />
            </div>
        );
        const firstId = inputs(twoPickers).at(0).prop("id");

        expect(firstId).toBeTruthy();
        expect(firstId).not.toBe(inputs(twoPickers).at(1).prop("id"));
        expect(twoPickers.find("label").at(0).prop("htmlFor")).toBe(firstId);

        twoPickers.unmount();
    });

    it("exposes the combobox accessibility contract on the input", () => {
        setup.setProps({ id: "birthday", required: true, status: "error", helperText: "Invalid" });

        const input = inputs(setup);

        expect(input.prop("role")).toBe("combobox");
        expect(input.prop("aria-expanded")).toBe(false);
        expect(input.prop("aria-haspopup")).toBe("dialog");
        expect(input.prop("aria-invalid")).toBe(true);
        expect(input.prop("aria-controls")).toBe("birthday-popover");
        expect(setup.find("#birthday-helper-text").exists()).toBeTruthy();
    });

    it("uses the numeric keyboard and sizes the input for the format", () => {
        expect(inputs(setup).prop("inputMode")).toBe("numeric");
        expect(inputs(setup).prop("size")).toBe(11);
    });

    describe("loading", () => {
        it("shows bars in place of the label, the field and the helper text", () => {
            setup.setProps({ loading: true, label: "Birthday", helperText: "Working days only", size: "large" });

            const skeleton = setup.find("div.datePicker");

            expect(skeleton.hasClass("datePicker_loading")).toBeTruthy();
            expect(skeleton.hasClass("datePicker_size_large")).toBeTruthy();
            expect(skeleton.prop("aria-busy")).toBe(true);
            expect(setup.find(".datePicker__skeleton").map((bar) => bar.prop("className"))).toEqual([
                "datePicker__skeleton datePicker__skeleton_label",
                "datePicker__skeleton datePicker__skeleton_field",
                "datePicker__skeleton datePicker__skeleton_helperText"
            ]);
            expect(inputs(setup).exists()).toBeFalsy();
            expect(setup.find("Label").exists()).toBeFalsy();
        });

        it("leaves out the bars of a missing label and helper text, and keeps the class name", () => {
            setup.setProps({ loading: true, className: "test-class" });

            expect(setup.find(".datePicker__skeleton")).toHaveLength(1);
            expect(setup.find("div.datePicker").hasClass("test-class")).toBeTruthy();
        });

        it("keeps the value for when the loading ends", () => {
            const picker = mountSingle({ defaultValue: "2026-03-05", loading: true });

            picker.setProps({ loading: false });
            picker.update();

            expect(inputs(picker).prop("value")).toBe("05/03/2026");

            picker.unmount();
        });
    });

    describe("interaction states", () => {
        it("does not open the popover when disabled or readOnly", () => {
            setup.setProps({ disabled: true });
            openPopover(setup);
            expect(setup.find(".datePicker__calendar").exists()).toBeFalsy();

            setup.setProps({ disabled: false, readOnly: true });
            openPopover(setup);
            expect(setup.find(".datePicker__calendar").exists()).toBeFalsy();
        });

        it("shows the value of a disabled field as a placeholder", () => {
            setup.setProps({ value: "2026-03-05", disabled: true });

            expect(inputs(setup).prop("value")).toBe("");
            expect(inputs(setup).prop("placeholder")).toBe("05/03/2026");
        });
    });

    describe("popover", () => {
        it("opens on input click and reports it", () => {
            const onOpenChange = jest.fn();

            setup.setProps({ onOpenChange });
            openPopover(setup);

            expect(setup.find(".datePicker__calendar").exists()).toBeTruthy();
            expect(inputs(setup).prop("aria-expanded")).toBe(true);
            expect(onOpenChange).toHaveBeenCalledWith(true);
        });

        it("opens on ArrowDown with the focus moving into the calendar", () => {
            inputs(setup).simulate("keydown", { key: "ArrowDown" });
            setup.update();

            expect(setup.find("Calendar").prop("focusOnOpen")).toBe(true);
        });

        it("closes on Enter, so a closed picker leaves Enter to the form", () => {
            openPopover(setup);
            inputs(setup).simulate("keydown", { key: "Enter" });
            setup.update();

            expect(setup.find(".datePicker__calendar").exists()).toBeFalsy();
        });

        it("closes when the popover reports a close", () => {
            openPopover(setup);

            act(() => {
                (setup.find("PickerPopover").prop("onClose") as (event: unknown, reason: string) => void)(
                    {},
                    "escape-key"
                );
            });
            setup.update();

            expect(setup.find(".datePicker__calendar").exists()).toBeFalsy();
        });

        it("goes back to the field on Tab from the grid and on Shift+Tab from the first header button", () => {
            openPopover(setup);
            pressInGrid(setup, "Tab");
            expect(setup.find(".datePicker__calendar").exists()).toBeFalsy();

            openPopover(setup);
            button(setup, "Previous month").simulate("keydown", { key: "Tab", shiftKey: true });
            setup.update();
            expect(setup.find(".datePicker__calendar").exists()).toBeTruthy();

            button(setup, "Previous year").simulate("keydown", { key: "Tab", shiftKey: true });
            setup.update();
            expect(setup.find(".datePicker__calendar").exists()).toBeFalsy();
        });

        it("starts the tab sequence on the header month while the arrows back are disabled", () => {
            setup.setProps({ min: "2026-11-01" });
            openPopover(setup);
            button(setup, "November, choose month").simulate("keydown", { key: "Tab", shiftKey: true });
            setup.update();

            expect(setup.find(".datePicker__calendar").exists()).toBeFalsy();
        });

        it("leaves the focus on a header arrow that pages a calendar opened from the keyboard", () => {
            const container = document.createElement("div");

            document.body.appendChild(container);

            const picker = mount(<DatePicker />, { wrappingComponent: GeneUIProvider, attachTo: container });

            inputs(picker).simulate("keydown", { key: "ArrowDown" });
            picker.update();
            expect(document.activeElement?.getAttribute("aria-label")).toBe("Monday, November 9, 2026");

            button(picker, "Next month").getDOMNode<HTMLButtonElement>().focus();
            click(picker, "Next month");

            expect(heading(picker)).toBe("December 2026");
            expect(document.activeElement).toBe(button(picker, "Next month").getDOMNode());

            picker.unmount();
            container.remove();
        });

        it("keeps Tab inside the calendar between the header and the grid", () => {
            openPopover(setup);
            button(setup, "Next month").simulate("keydown", { key: "Tab" });
            pressInGrid(setup, "Tab", true);

            expect(setup.find(".datePicker__calendar").exists()).toBeTruthy();
        });
    });

    describe("calendar", () => {
        it("opens on the month of the value with the weeks starting on Monday", () => {
            setup.setProps({ value: "2026-03-05" });
            openPopover(setup);

            expect(heading(setup)).toBe("March 2026");
            expect(headerItems(setup)).toEqual(["Mar", "2026"]);
            expect(setup.find('[role="columnheader"]').first().prop("aria-label")).toBe("Monday");
            expect(setup.find('[role="columnheader"]').map((header) => header.text())).toEqual([
                "M",
                "T",
                "W",
                "T",
                "F",
                "S",
                "S"
            ]);
            expect(setup.find('button[role="gridcell"]')).toHaveLength(42);
            expect(button(setup, "Thursday, March 5, 2026").prop("aria-selected")).toBe(true);
            expect(tabStop(setup).prop("aria-label")).toBe("Thursday, March 5, 2026");
        });

        it("opens on today's month without a value and marks today", () => {
            openPopover(setup);

            const today = button(setup, "Monday, November 9, 2026");

            expect(heading(setup)).toBe("November 2026");
            expect(today.prop("aria-current")).toBe("date");
            expect(today.hasClass("datePicker__cell_today")).toBeTruthy();
            expect(button(setup, "Monday, October 26, 2026").hasClass("datePicker__cell_outside")).toBeTruthy();
        });

        it("names the months and the weekdays in the locale", () => {
            setup.setProps({ value: "2026-03-05", locale: "de-DE" });
            openPopover(setup);

            expect(heading(setup)).toBe("März 2026");
            expect(headerItems(setup)).toEqual(["Mär", "2026"]);
            expect(setup.find('[role="columnheader"]').first().prop("aria-label")).toBe("Montag");
        });

        it("pages through the months and the years with the header arrows", () => {
            openPopover(setup);
            click(setup, "Next month");
            expect(heading(setup)).toBe("December 2026");

            click(setup, "Previous month");
            click(setup, "Previous month");
            expect(heading(setup)).toBe("October 2026");

            click(setup, "Next year");
            expect(heading(setup)).toBe("October 2027");

            click(setup, "Previous year");
            click(setup, "Previous year");
            expect(heading(setup)).toBe("October 2025");
        });

        it("moves the tab stop with the keyboard and follows it to the next month", () => {
            openPopover(setup);
            pressInGrid(setup, "ArrowRight");
            expect(tabStop(setup).prop("aria-label")).toBe("Tuesday, November 10, 2026");

            pressInGrid(setup, "End");
            expect(tabStop(setup).prop("aria-label")).toBe("Sunday, November 15, 2026");

            pressInGrid(setup, "PageDown");
            expect(heading(setup)).toBe("December 2026");
            expect(tabStop(setup).prop("aria-label")).toBe("Tuesday, December 15, 2026");
        });

        it("switches to the month view and back with a picked month", () => {
            openPopover(setup);
            click(setup, "November, choose month");

            expect(setup.find(".datePicker__grid").hasClass("datePicker__grid_view_months")).toBeTruthy();
            expect(setup.find('button[role="gridcell"]')).toHaveLength(12);
            expect(headerItems(setup)).toEqual(["2026"]);
            expect(button(setup, "Previous month").exists()).toBeFalsy();

            click(setup, "Next year");
            expect(heading(setup)).toBe("2027");

            click(setup, "March 2027");
            expect(heading(setup)).toBe("March 2027");
            expect(setup.find(".datePicker__grid").hasClass("datePicker__grid_view_days")).toBeTruthy();
        });

        it("switches to the year view from the header year, a decade with a year around it", () => {
            openPopover(setup);
            click(setup, "2026, choose year");

            const years = setup.find('button[role="gridcell"]');

            expect(heading(setup)).toBe("2020-2029");
            expect(headerItems(setup)).toEqual(["2020-2029"]);
            expect(years.map((cell) => cell.text())).toEqual([
                "2019",
                "2020",
                "2021",
                "2022",
                "2023",
                "2024",
                "2025",
                "2026",
                "2027",
                "2028",
                "2029",
                "2030"
            ]);
            expect(years.first().hasClass("datePicker__cell_outside")).toBeTruthy();
            expect(years.last().hasClass("datePicker__cell_outside")).toBeTruthy();
            expect(button(setup, "2026").hasClass("datePicker__cell_today")).toBeTruthy();

            click(setup, "Next decade");
            expect(heading(setup)).toBe("2030-2039");

            click(setup, "2029");
            expect(heading(setup)).toBe("2029");
            expect(setup.find(".datePicker__grid").hasClass("datePicker__grid_view_months")).toBeTruthy();
        });

        it("leaves the years before 0001 and after 9999 empty", () => {
            setup.setProps({ value: "0003-05-01" });
            openPopover(setup);
            click(setup, "3, choose year");

            expect(heading(setup)).toBe("1-9");
            expect(setup.find(".datePicker__cell_empty")).toHaveLength(2);
            expect(setup.find('button[role="gridcell"]').first().text()).toBe("1");
            expect(button(setup, "Previous decade").prop("disabled")).toBe(true);
        });

        it("leaves the days after 9999-12-31 empty", () => {
            setup.setProps({ value: "9999-12-31" });
            openPopover(setup);

            expect(setup.find(".datePicker__cell_empty")).toHaveLength(9);
            expect(setup.find('button[role="gridcell"]').last().prop("aria-label")).toBe("Friday, December 31, 9999");
            expect(button(setup, "Next month").prop("disabled")).toBe(true);
            expect(button(setup, "Next year").prop("disabled")).toBe(true);
        });

        it("applies custom localization to the header buttons", () => {
            setup.setProps({ localization: { previousMonth: "Նախորդ ամիս" } });
            openPopover(setup);

            expect(button(setup, "Նախորդ ամիս").exists()).toBeTruthy();
            expect(button(setup, "Next month").exists()).toBeTruthy();
        });

        it.each([
            ["2024-02-10", 29, "Monday, January 29, 2024", "Thursday, February 29, 2024"],
            ["2026-02-10", 28, "Monday, January 26, 2026", "Saturday, February 28, 2026"],
            ["1900-02-10", 28, "Monday, January 29, 1900", "Wednesday, February 28, 1900"],
            ["2000-02-10", 29, "Monday, January 31, 2000", "Tuesday, February 29, 2000"],
            ["2100-02-10", 28, "Monday, February 1, 2100", "Sunday, February 28, 2100"],
            ["2026-04-10", 30, "Monday, March 30, 2026", "Thursday, April 30, 2026"],
            ["2026-06-10", 30, "Monday, June 1, 2026", "Tuesday, June 30, 2026"],
            ["2026-03-10", 31, "Monday, February 23, 2026", "Tuesday, March 31, 2026"]
        ])("shows the month of %s with its %i days", (value, length, firstCell, lastDay) => {
            setup.setProps({ value });
            openPopover(setup);

            const cells = setup.find('button[role="gridcell"]');
            const daysOfMonth = cells.filterWhere((cell) => !cell.hasClass("datePicker__cell_outside"));

            expect(cells.first().prop("aria-label")).toBe(firstCell);
            expect(daysOfMonth).toHaveLength(length);
            expect(daysOfMonth.last().prop("aria-label")).toBe(lastDay);
            expect(daysOfMonth.map((cell) => cell.text())).toEqual(
                Array.from({ length }, (_, index) => String(index + 1))
            );
        });
    });

    describe("value handling", () => {
        it("reports a picked day as an ISO date and keeps the popover open", () => {
            const onChange = jest.fn();

            setup.setProps({ onChange });
            openPopover(setup);
            click(setup, "Friday, November 20, 2026");

            expect(changedValues(onChange)).toEqual(["2026-11-20"]);
            expect(inputs(setup).prop("value")).toBe("20/11/2026");
            expect(setup.find(".datePicker__calendar").exists()).toBeTruthy();
        });

        it("does not report a pick of the current value", () => {
            const onChange = jest.fn();

            setup.setProps({ value: "2026-11-20", onChange });
            openPopover(setup);
            click(setup, "Friday, November 20, 2026");

            expect(onChange).not.toHaveBeenCalled();
        });

        it("reports a typed date once it is complete, after a pause", () => {
            const onChange = jest.fn();

            setup.setProps({ onChange });
            typeInto(setup, "15/03/20");
            expect(onChange).not.toHaveBeenCalled();

            typeWithoutPause(setup, "15/03/2026");
            expect(onChange).not.toHaveBeenCalled();

            act(() => {
                jest.advanceTimersByTime(INPUT_CHANGE_DEBOUNCE_MS);
            });
            expect(changedValues(onChange)).toEqual(["2026-03-15"]);
        });

        it("reports an emptied field", () => {
            const onChange = jest.fn();
            const picker = mountSingle({ defaultValue: "2026-03-15", onChange });

            typeInto(picker, "");

            expect(changedValues(onChange)).toEqual([""]);

            picker.unmount();
        });

        it("moves the calendar to a date typed while it is open", () => {
            openPopover(setup);
            typeInto(setup, "15/03/2026");

            expect(heading(setup)).toBe("March 2026");
            expect(button(setup, "Sunday, March 15, 2026").prop("aria-selected")).toBe(true);
        });

        it("corrects a date that does not exist when the field is left", () => {
            const onChange = jest.fn();
            const onBlur = jest.fn();

            setup.setProps({ onChange, onBlur });
            typeInto(setup, "31/04/2026");
            expect(onChange).not.toHaveBeenCalled();
            expect(inputs(setup).prop("value")).toBe("31/04/2026");

            blurInput(setup);
            expect(changedValues(onChange)).toEqual(["2026-04-30"]);
            expect(onBlur.mock.calls[0][0]).toBe("2026-04-30");
            expect(inputs(setup).prop("value")).toBe("30/04/2026");
        });

        it("restores the last date when the field is left with incomplete text", () => {
            const onChange = jest.fn();
            const onBlur = jest.fn();
            const picker = mountSingle({ defaultValue: "2026-03-15", onChange, onBlur });

            typeInto(picker, "15/03/20");
            blurInput(picker);

            expect(onChange).not.toHaveBeenCalled();
            expect(onBlur.mock.calls[0][0]).toBe("2026-03-15");
            expect(inputs(picker).prop("value")).toBe("15/03/2026");

            picker.unmount();
        });

        it("reports pending typed text at once when the field is left", () => {
            const onChange = jest.fn();

            setup.setProps({ onChange });
            typeWithoutPause(setup, "15/03/2026");
            blurInput(setup);

            expect(changedValues(onChange)).toEqual(["2026-03-15"]);
        });

        it("renders a controlled value in the format and keeps the value when the format changes", () => {
            const onChange = jest.fn();

            setup.setProps({ value: "2026-03-05", onChange });
            expect(inputs(setup).prop("value")).toBe("05/03/2026");

            setup.setProps({ format: "MM/DD/YYYY" });
            expect(inputs(setup).prop("value")).toBe("03/05/2026");

            setup.setProps({ format: "YYYY-MM-DD" });
            expect(inputs(setup).prop("value")).toBe("2026-03-05");
            expect(onChange).not.toHaveBeenCalled();
        });

        it("reads a custom format and shows its text after the date once the field is left", () => {
            const onChange = jest.fn();
            const picker = mountSingle({ format: "YYYY年MM月DD日", onChange });

            expect(inputs(picker).prop("size")).toBe(12);

            // The mask leaves out the text after the last typed digit.
            typeInto(picker, "2026年03月15");
            expect(changedValues(onChange)).toEqual(["2026-03-15"]);

            blurInput(picker);
            expect(inputs(picker).prop("value")).toBe("2026年03月15日");

            typeInto(picker, "2026年04月31");
            expect(changedValues(onChange)).toEqual(["2026-03-15"]);

            blurInput(picker);
            expect(changedValues(onChange)).toEqual(["2026-03-15", "2026-04-30"]);
            expect(inputs(picker).prop("value")).toBe("2026年04月30日");

            picker.unmount();
        });

        it("falls back to DD/MM/YYYY for a format it cannot read", () => {
            setup.setProps({ value: "2026-03-05", format: "D/M/YY" });

            expect(inputs(setup).prop("value")).toBe("05/03/2026");
            expect(inputs(setup).prop("size")).toBe(11);
        });

        it("displays an out of range value corrected without reporting it", () => {
            const onChange = jest.fn();
            const onBlur = jest.fn();

            setup.setProps({ value: "2026-02-30", onChange, onBlur });
            expect(inputs(setup).prop("value")).toBe("28/02/2026");

            inputs(setup).simulate("focus");
            blurInput(setup);
            expect(onChange).not.toHaveBeenCalled();
            expect(onBlur.mock.calls[0][0]).toBe("2026-02-30");
        });

        it("clears the value and reports it through onClear and onChange", () => {
            const onChange = jest.fn();
            const onClear = jest.fn();
            const picker = mountSingle({ defaultValue: "2026-03-15", clearable: true, onChange, onClear });

            button(picker, "Clear date selection").simulate("click");
            picker.update();

            expect(onClear).toHaveBeenCalledTimes(1);
            expect(changedValues(onChange)).toEqual([""]);
            expect(inputs(picker).prop("value")).toBe("");

            picker.unmount();
        });
    });

    describe("min and max", () => {
        it("disables the days outside the bounds and the header buttons that lead outside", () => {
            setup.setProps({ min: "2026-11-05", max: "2026-12-10" });
            openPopover(setup);

            expect(button(setup, "Wednesday, November 4, 2026").prop("disabled")).toBe(true);
            expect(button(setup, "Thursday, November 5, 2026").prop("disabled")).toBe(false);
            expect(button(setup, "Previous month").prop("disabled")).toBe(true);
            expect(button(setup, "Previous year").prop("disabled")).toBe(true);

            click(setup, "Next month");
            expect(button(setup, "Friday, December 11, 2026").prop("disabled")).toBe(true);
            expect(button(setup, "Next month").prop("disabled")).toBe(true);
            expect(button(setup, "Next year").prop("disabled")).toBe(true);
        });

        it("moves a year arrow only as far as the bounds allow", () => {
            setup.setProps({ value: "2026-11-20", min: "2026-03-10" });
            openPopover(setup);
            click(setup, "Previous year");

            expect(heading(setup)).toBe("March 2026");
            expect(tabStop(setup).prop("aria-label")).toBe("Tuesday, March 10, 2026");
        });

        it("does not report a typed date outside the bounds and moves it to the bound on blur", () => {
            const onChange = jest.fn();

            setup.setProps({ min: "2026-11-05", onChange });
            typeInto(setup, "01/11/2026");
            expect(onChange).not.toHaveBeenCalled();

            blurInput(setup);
            expect(changedValues(onChange)).toEqual(["2026-11-05"]);
        });

        it("keeps the keyboard focus inside the bounds", () => {
            setup.setProps({ min: "2026-11-05" });
            openPopover(setup);
            pressInGrid(setup, "PageUp");

            expect(heading(setup)).toBe("November 2026");
            expect(tabStop(setup).prop("aria-label")).toBe("Thursday, November 5, 2026");
        });

        it("disables the months and years outside the bounds", () => {
            setup.setProps({ min: "2026-03-01", max: "2027-02-01" });
            openPopover(setup);
            click(setup, "November, choose month");

            expect(button(setup, "February 2026").prop("disabled")).toBe(true);
            expect(button(setup, "March 2026").prop("disabled")).toBe(false);

            click(setup, "2026, choose year");
            expect(button(setup, "2025").prop("disabled")).toBe(true);
            expect(button(setup, "2027").prop("disabled")).toBe(false);
        });
    });

    describe("presets", () => {
        it("shows no presets unless asked for", () => {
            openPopover(setup);
            expect(presetList(setup).exists()).toBeFalsy();

            setup.setProps({ presets: [] });
            expect(presetList(setup).exists()).toBeFalsy();
        });

        it("lists the presets of a single date beside the calendar", () => {
            setup.setProps({ presets: SINGLE_PRESETS });
            openPopover(setup);

            expect(presetList(setup).prop("aria-label")).toBe("Presets");
            expect(presetList(setup).prop("aria-orientation")).toBe("vertical");
            expect(presetItems(setup).map((item) => item.text())).toEqual([
                "Today",
                "Yesterday",
                "7 days ago",
                "14 days ago",
                "1 month ago"
            ]);
            expect(setup.find(".datePicker__calendar").getDOMNode().firstElementChild).toBe(
                presetList(setup).getDOMNode()
            );
        });

        it("picks the day of a preset, counted back from today, and keeps the popover open", () => {
            const onChange = jest.fn();

            setup.setProps({ presets: SINGLE_PRESETS, onChange });
            openPopover(setup);
            ["Today", "Yesterday", "7 days ago", "14 days ago", "1 month ago"].forEach((text) =>
                pickPreset(setup, text)
            );

            expect(changedValues(onChange)).toEqual([
                "2026-11-09",
                "2026-11-08",
                "2026-11-02",
                "2026-10-26",
                "2026-10-09"
            ]);
            expect(inputs(setup).prop("value")).toBe("09/10/2026");
            expect(preset(setup, "1 month ago").prop("aria-selected")).toBe(true);
            expect(preset(setup, "Today").prop("aria-selected")).toBe(false);
            expect(heading(setup)).toBe("October 2026");
            expect(setup.find(".datePicker__calendar").exists()).toBeTruthy();
        });

        it("picks a fixed ISO date, a day counted from today, and the day a function of today returns", () => {
            const onChange = jest.fn();
            const firstOfMonth = jest.fn((today: string) => `${today.slice(0, 8)}01`);

            setup.setProps({
                presets: [
                    { label: "Release", value: "2026-01-15" },
                    { label: "In 3 days", value: 3 },
                    { label: "First of the month", value: firstOfMonth }
                ],
                onChange
            });
            openPopover(setup);
            ["Release", "In 3 days", "First of the month"].forEach((text) => pickPreset(setup, text));

            expect(changedValues(onChange)).toEqual(["2026-01-15", "2026-11-12", "2026-11-01"]);
            expect(firstOfMonth).toHaveBeenCalledWith("2026-11-09");
        });

        it("disables a preset whose value is not a date", () => {
            setup.setProps({
                presets: [
                    { label: "Not ISO", value: "15/01/2026" },
                    { label: "Half a day", value: 0.5 },
                    { label: "Not a number", value: Number.NaN },
                    { label: "Past 9999", value: 3000000 },
                    { label: "Broken function", value: () => "soon" },
                    { label: "Today", value: 0 }
                ]
            });
            openPopover(setup);

            expect(presetItems(setup).map((item) => item.prop("disabled"))).toEqual([
                true,
                true,
                true,
                true,
                true,
                false
            ]);
            expect(presetTabStop(setup).text()).toBe("Today");
        });

        it("shows the preset of a typed date selected", () => {
            setup.setProps({ presets: SINGLE_PRESETS });
            openPopover(setup);
            typeInto(setup, "02/11/2026");

            expect(preset(setup, "7 days ago").prop("aria-selected")).toBe(true);
        });

        it("disables the presets outside min and max", () => {
            setup.setProps({ presets: SINGLE_PRESETS, min: "2026-11-01", max: "2026-11-08" });
            openPopover(setup);

            expect(preset(setup, "Today").prop("disabled")).toBe(true);
            expect(preset(setup, "Yesterday").prop("disabled")).toBe(false);
            expect(preset(setup, "7 days ago").prop("disabled")).toBe(false);
            expect(preset(setup, "14 days ago").prop("disabled")).toBe(true);
        });

        it("takes the texts of the presets from the presets and the name of the list from localization", () => {
            setup.setProps({
                presets: [{ label: "Այսօր", value: 0 }],
                localization: { presets: "Արագ ընտրություն" }
            });
            openPopover(setup);

            expect(presetList(setup).prop("aria-label")).toBe("Արագ ընտրություն");
            expect(presetItems(setup).map((item) => item.text())).toEqual(["Այսօր"]);
        });

        it("keeps one tab stop, on the selected preset, and moves it with the arrow keys", () => {
            setup.setProps({ presets: SINGLE_PRESETS, value: "2026-11-08", min: "2026-10-20" });
            openPopover(setup);
            expect(presetTabStop(setup).text()).toBe("Yesterday");

            const press = (key: string) => {
                presetList(setup).simulate("keydown", { key });
                setup.update();
            };

            press("ArrowDown");
            expect(presetTabStop(setup).text()).toBe("7 days ago");

            press("ArrowDown");
            expect(presetTabStop(setup).text()).toBe("14 days ago");

            // The disabled "1 month ago" is skipped.
            press("End");
            expect(presetTabStop(setup).text()).toBe("14 days ago");

            press("Home");
            expect(presetTabStop(setup).text()).toBe("Today");

            press("ArrowUp");
            expect(presetTabStop(setup).text()).toBe("Today");
        });

        it("starts the tab sequence on the presets", () => {
            setup.setProps({ presets: SINGLE_PRESETS });
            openPopover(setup);

            button(setup, "Previous year").simulate("keydown", { key: "Tab", shiftKey: true });
            setup.update();
            expect(setup.find(".datePicker__calendar").exists()).toBeTruthy();

            preset(setup, "Today").simulate("keydown", { key: "Tab", shiftKey: true });
            setup.update();
            expect(setup.find(".datePicker__calendar").exists()).toBeFalsy();
        });
    });

    describe("on a phone", () => {
        const initialInnerWidth = window.innerWidth;

        const setWindowWidth = (value: number) => {
            Object.defineProperty(window, "innerWidth", { writable: true, configurable: true, value });
            window.dispatchEvent(new Event("resize"));
        };

        afterEach(() => setWindowWidth(initialInnerWidth));

        it("shows the large calendar, paged from the header month and year instead of arrows", () => {
            window.scrollTo = jest.fn();
            setWindowWidth(500);

            const picker = mountSingle({ size: "small" });

            openPopover(picker);

            const calendar = picker.find(".datePicker__calendar");

            expect(calendar.hasClass("datePicker__calendar_mobile")).toBeTruthy();
            expect(calendar.hasClass("datePicker__calendar_size_large")).toBeTruthy();
            expect(button(picker, "Previous month").exists()).toBeFalsy();
            expect(button(picker, "Next year").exists()).toBeFalsy();
            expect(headerItems(picker)).toEqual(["Nov", "2026"]);

            picker.unmount();
        });

        it("puts the presets in a row under the calendar, last in the tab sequence", () => {
            window.scrollTo = jest.fn();
            setWindowWidth(500);

            const picker = mountSingle({ presets: SINGLE_PRESETS });

            openPopover(picker);

            const calendar = picker.find(".datePicker__calendar").getDOMNode();

            expect(presetList(picker).prop("aria-orientation")).toBe("horizontal");
            expect(calendar.lastElementChild?.contains(presetList(picker).getDOMNode())).toBeTruthy();

            pressInGrid(picker, "Tab");
            expect(picker.find(".datePicker__calendar").exists()).toBeTruthy();

            preset(picker, "Today").simulate("keydown", { key: "Tab" });
            picker.update();
            expect(picker.find(".datePicker__calendar").exists()).toBeFalsy();

            picker.unmount();
        });
    });
});

describe("Date range picker", () => {
    let setup: ReactWrapper<IRangeDatePickerProps>;

    beforeEach(() => {
        setup = mountRange();
    });

    afterEach(() => {
        setup.unmount();
        jest.clearAllMocks();
    });

    it("renders without crashing", () => {
        expect(setup.exists()).toBeTruthy();
    });

    it("gives both inputs an accessible name, a unique id and a name", () => {
        setup.setProps({ name: "stay", id: "stay" });

        expect(inputs(setup).at(0).prop("aria-label")).toBe("Start date");
        expect(inputs(setup).at(1).prop("aria-label")).toBe("End date");
        expect(inputs(setup).at(0).prop("id")).toBe("stay-start");
        expect(inputs(setup).at(1).prop("name")).toBe("stay-end");
    });

    it("handles range values correctly", () => {
        setup.setProps({ value: { start: "2026-03-05", end: "2026-03-12" } });

        expect(inputs(setup).at(0).prop("value")).toBe("05/03/2026");
        expect(inputs(setup).at(1).prop("value")).toBe("12/03/2026");
    });

    it("shows both values in a custom format", () => {
        setup.setProps({ format: "YYYY.MM.DD", value: { start: "2026-03-05", end: "2026-03-12" } });

        expect(inputs(setup).at(0).prop("value")).toBe("2026.03.05");
        expect(inputs(setup).at(1).prop("value")).toBe("2026.03.12");
    });

    it("shows a skeleton while loading", () => {
        setup.setProps({ loading: true, label: "Stay" });

        expect(setup.find("div.datePicker").hasClass("datePicker_loading")).toBeTruthy();
        expect(setup.find(".datePicker__skeleton")).toHaveLength(2);
        expect(inputs(setup).exists()).toBeFalsy();
    });

    it("shows one month on a phone, without the days of the months around it", () => {
        const initialInnerWidth = window.innerWidth;
        const setWindowWidth = (value: number) => {
            Object.defineProperty(window, "innerWidth", { writable: true, configurable: true, value });
            window.dispatchEvent(new Event("resize"));
        };

        window.scrollTo = jest.fn();
        setWindowWidth(500);

        const range = mountRange({ defaultValue: { start: "2026-11-10", end: "2026-12-03" } });

        openPopover(range, 1);
        expect(headings(range)).toEqual(["December 2026"]);
        expect(range.find(".datePicker__cell_empty")).toHaveLength(11);
        expect(range.find(".datePicker__band")).toHaveLength(1);

        range.unmount();
        setWindowWidth(initialInnerWidth);
    });

    it("moves on to the end after a picked start and reports both values", () => {
        const onChange = jest.fn();

        setup.setProps({ onChange });
        openPopover(setup, 0);
        click(setup, "Tuesday, November 10, 2026");

        expect(onChange.mock.calls[0][1]).toEqual({ start: "2026-11-10", end: "" });
        expect(onChange.mock.calls[0][2]).toBe("start");
        expect(setup.find("Calendar").prop("activeField")).toBe("end");
        expect(button(setup, "Monday, November 9, 2026").prop("disabled")).toBe(true);

        click(setup, "Friday, November 13, 2026");
        expect(onChange.mock.calls[1][1]).toEqual({ start: "2026-11-10", end: "2026-11-13" });
        expect(onChange.mock.calls[1][2]).toBe("end");
        expect(setup.find(".datePicker__calendar").exists()).toBeTruthy();
    });

    it("highlights the days between start and end", () => {
        const range = mountRange({ defaultValue: { start: "2026-11-10", end: "2026-11-13" } });

        openPopover(range, 0);

        expect(button(range, "Wednesday, November 11, 2026").hasClass("datePicker__cell_inRange")).toBeTruthy();
        expect(button(range, "Friday, November 13, 2026").prop("aria-selected")).toBe(true);
        expect(button(range, "Saturday, November 14, 2026").hasClass("datePicker__cell_inRange")).toBeFalsy();

        range.unmount();
    });

    it("previews the range under the pointer while the end is edited", () => {
        const range = mountRange({ defaultValue: { start: "2026-11-10", end: null } });

        openPopover(range, 1);
        button(range, "Monday, November 16, 2026").simulate("mouseenter");
        range.update();

        expect(button(range, "Thursday, November 12, 2026").hasClass("datePicker__cell_inRange")).toBeTruthy();
        expect(button(range, "Sunday, November 15, 2026").hasClass("datePicker__cell_inRange")).toBeTruthy();
        expect(button(range, "Monday, November 16, 2026").hasClass("datePicker__cell_inRange")).toBeFalsy();
        expect(range.find(".datePicker__band_end").exists()).toBeTruthy();

        range.find('[role="grid"]').first().simulate("mouseleave");
        range.update();
        expect(button(range, "Thursday, November 12, 2026").hasClass("datePicker__cell_inRange")).toBeFalsy();
        expect(range.find(".datePicker__band").exists()).toBeFalsy();

        range.unmount();
    });

    describe("two months side by side", () => {
        it("shows this month and the next, each with its own header arrows", () => {
            openPopover(setup, 0);

            expect(setup.find(".datePicker__picker")).toHaveLength(2);
            expect(headings(setup)).toEqual(["November 2026", "December 2026"]);
            expect(button(setup, "Previous year")).toHaveLength(2);
            expect(button(setup, "Next month")).toHaveLength(2);
            expect(tabStops(setup)).toEqual(["Monday, November 9, 2026", "Wednesday, December 9, 2026"]);
        });

        it("leaves the days of the months around each page empty", () => {
            openPopover(setup, 0);

            const days = (index: number) => panel(setup, index).find('button[role="gridcell"]');

            expect(days(0)).toHaveLength(30);
            expect(days(0).first().prop("aria-label")).toBe("Sunday, November 1, 2026");
            expect(days(1)).toHaveLength(31);
            expect(panel(setup, 0).find(".datePicker__cell_empty")).toHaveLength(12);
            expect(panel(setup, 1).find(".datePicker__cell_empty")).toHaveLength(11);
            expect(setup.find(".datePicker__cell_outside").exists()).toBeFalsy();
        });

        it.each([
            [
                "the months of the start and the end",
                { start: "2024-09-23", end: "2024-10-06" },
                "September 2024",
                "October 2024"
            ],
            [
                "the month of the start and the next",
                { start: "2024-09-23", end: "2024-09-28" },
                "September 2024",
                "October 2024"
            ],
            [
                "the months of a start and an end far apart",
                { start: "2026-01-05", end: "2026-03-20" },
                "January 2026",
                "March 2026"
            ],
            ["the month before the end and the end", { start: null, end: "2026-03-20" }, "February 2026", "March 2026"],
            ["the first months of the calendar", { start: null, end: "0001-01-20" }, "January 1", "February 1"],
            ["the last months of the calendar", { start: "9999-12-20", end: null }, "November 9999", "December 9999"]
        ])("opens on %s", (_, defaultValue, first, second) => {
            const range = mountRange({ defaultValue });

            openPopover(range, 0);
            expect(headings(range)).toEqual([first, second]);

            range.unmount();
        });

        it("opens on the month before today's when the next one has nothing to pick", () => {
            setup.setProps({ max: "2026-11-09" });
            openPopover(setup, 0);

            expect(headings(setup)).toEqual(["October 2026", "November 2026"]);
        });

        it("pages each month on its own, moving the other one where they would meet", () => {
            openPopover(setup, 0);

            click(setup, "Next month", 1);
            expect(headings(setup)).toEqual(["November 2026", "January 2027"]);

            click(setup, "Next month", 0);
            expect(headings(setup)).toEqual(["December 2026", "January 2027"]);

            click(setup, "Next month", 0);
            expect(headings(setup)).toEqual(["January 2027", "February 2027"]);

            click(setup, "Previous year", 1);
            expect(headings(setup)).toEqual(["January 2026", "February 2026"]);
        });

        it("disables the arrows that would move a month past the bounds", () => {
            setup.setProps({ min: "2026-11-01", max: "2027-01-31" });
            openPopover(setup, 0);

            expect(button(setup, "Previous month").map((arrow) => arrow.prop("disabled"))).toEqual([true, true]);
            expect(button(setup, "Next month").map((arrow) => arrow.prop("disabled"))).toEqual([false, false]);

            click(setup, "Next year", 0);
            expect(headings(setup)).toEqual(["December 2026", "January 2027"]);
            expect(button(setup, "Next month").map((arrow) => arrow.prop("disabled"))).toEqual([true, true]);
            expect(button(setup, "Previous month").map((arrow) => arrow.prop("disabled"))).toEqual([false, false]);
        });

        it("switches each month to its own month and year view", () => {
            openPopover(setup, 0);
            click(setup, "2026, choose year", 0);

            expect(headings(setup)).toEqual(["2020-2029", "December 2026"]);
            expect(panel(setup, 0).find('button[role="gridcell"]')).toHaveLength(10);
            expect(panel(setup, 0).find(".datePicker__cell_empty")).toHaveLength(2);

            click(setup, "2027", 0);
            expect(headings(setup)).toEqual(["2027", "December 2026"]);

            click(setup, "January 2027", 0);
            expect(headings(setup)).toEqual(["January 2027", "February 2027"]);
        });

        it("moves the keyboard focus on to the month that shows the day, or pages the month it is in", () => {
            const container = document.createElement("div");

            document.body.appendChild(container);

            const range = mount(<DatePicker.Range />, { wrappingComponent: GeneUIProvider, attachTo: container });
            const focused = () => document.activeElement?.getAttribute("aria-label");

            inputs(range).at(0).simulate("keydown", { key: "ArrowDown" });
            range.update();
            expect(focused()).toBe("Monday, November 9, 2026");

            pressInGrid(range, "PageDown", false, 0);
            expect(headings(range)).toEqual(["November 2026", "December 2026"]);
            expect(focused()).toBe("Wednesday, December 9, 2026");

            pressInGrid(range, "PageDown", false, 1);
            expect(headings(range)).toEqual(["November 2026", "January 2027"]);
            expect(focused()).toBe("Saturday, January 9, 2027");

            pressInGrid(range, "ArrowUp", false, 0);
            pressInGrid(range, "ArrowLeft", false, 0);
            pressInGrid(range, "ArrowLeft", false, 0);
            expect(headings(range)).toEqual(["October 2026", "January 2027"]);
            expect(focused()).toBe("Saturday, October 31, 2026");

            range.unmount();
            container.remove();
        });

        it("picks the start in one month and the end in the other", () => {
            const onChange = jest.fn();

            setup.setProps({ onChange });
            openPopover(setup, 0);
            click(setup, "Tuesday, November 10, 2026");
            click(setup, "Thursday, December 3, 2026");

            expect(onChange.mock.calls[1][1]).toEqual({ start: "2026-11-10", end: "2026-12-03" });
            expect(headings(setup)).toEqual(["November 2026", "December 2026"]);
        });

        it("follows a typed date to the month of its field", () => {
            openPopover(setup, 0);
            typeInto(setup, "15/03/2027", 0);
            expect(headings(setup)).toEqual(["March 2027", "April 2027"]);

            inputs(setup).at(1).simulate("focus");
            typeInto(setup, "20/05/2027", 1);
            expect(headings(setup)).toEqual(["March 2027", "May 2027"]);

            inputs(setup).at(0).simulate("focus");
            typeInto(setup, "02/05/2027", 0);
            expect(headings(setup)).toEqual(["March 2027", "May 2027"]);
        });

        it("draws the range as one band per row, rounded where it starts and ends", () => {
            const range = mountRange({ defaultValue: { start: "2026-11-10", end: "2026-12-03" } });

            openPopover(range, 0);

            const bands = (index: number) =>
                panel(range, index)
                    .find(".datePicker__band")
                    .map((band) => ({
                        ...(band.prop("style") as Record<string, number>),
                        start: band.hasClass("datePicker__band_start"),
                        end: band.hasClass("datePicker__band_end")
                    }));
            const band = (from: number, to: number, start = false, end = false) => ({
                "--date-picker-band-from": from,
                "--date-picker-band-days": to - from + 1,
                start,
                end
            });

            expect(bands(0)).toEqual([band(1, 6, true), band(0, 6), band(0, 6), band(0, 0)]);
            expect(bands(1)).toEqual([band(1, 3, false, true)]);
            expect(range.find(".datePicker__band").everyWhere((item) => item.prop("aria-hidden") === true)).toBe(true);

            range.unmount();
        });

        it("goes back to the field on Tab from the last grid and on Shift+Tab from the first header button", () => {
            openPopover(setup, 0);
            pressInGrid(setup, "Tab", false, 0);
            expect(setup.find(".datePicker__calendar").exists()).toBeTruthy();

            button(setup, "Previous year").at(1).simulate("keydown", { key: "Tab", shiftKey: true });
            setup.update();
            expect(setup.find(".datePicker__calendar").exists()).toBeTruthy();

            pressInGrid(setup, "Tab", false, 1);
            expect(setup.find(".datePicker__calendar").exists()).toBeFalsy();

            openPopover(setup, 0);
            button(setup, "Previous year").at(0).simulate("keydown", { key: "Tab", shiftKey: true });
            setup.update();
            expect(setup.find(".datePicker__calendar").exists()).toBeFalsy();
        });
    });

    it("keeps a typed end after the start", () => {
        const onChange = jest.fn();
        const range = mountRange({ defaultValue: { start: "2026-11-10", end: null }, onChange });

        inputs(range).at(1).simulate("focus");
        typeInto(range, "01/11/2026", 1);
        expect(onChange).not.toHaveBeenCalled();

        blurInput(range, 1);
        expect(onChange.mock.calls.slice(-1)[0][1]).toEqual({ start: "2026-11-10", end: "2026-11-10" });

        range.unmount();
    });

    it("clears both fields", () => {
        const onChange = jest.fn();
        const range = mountRange({
            defaultValue: { start: "2026-11-10", end: "2026-11-13" },
            clearable: true,
            onChange
        });

        button(range, "Clear date selection").simulate("click");
        range.update();

        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange.mock.calls[0][1]).toEqual({ start: "", end: "" });
        expect(inputs(range).at(0).prop("value")).toBe("");
        expect(inputs(range).at(1).prop("value")).toBe("");

        range.unmount();
    });

    describe("presets", () => {
        it("lists the presets of a range beside the calendar", () => {
            setup.setProps({ presets: RANGE_PRESETS });
            openPopover(setup, 0);

            expect(presetItems(setup).map((item) => item.text())).toEqual([
                "Today",
                "Yesterday",
                "Last 7 days",
                "Last 14 days",
                "Last 30 days",
                "1 month ago"
            ]);
        });

        it("fills both fields with a preset, reported once for the start", () => {
            const onChange = jest.fn();

            setup.setProps({ presets: RANGE_PRESETS, onChange });
            openPopover(setup, 0);
            pickPreset(setup, "Last 7 days");

            expect(onChange).toHaveBeenCalledTimes(1);
            expect(onChange.mock.calls[0][0].target.value).toBe("2026-11-03");
            expect(onChange.mock.calls[0][1]).toEqual({ start: "2026-11-03", end: "2026-11-09" });
            expect(onChange.mock.calls[0][2]).toBe("start");
            expect(inputs(setup).at(0).prop("value")).toBe("03/11/2026");
            expect(inputs(setup).at(1).prop("value")).toBe("09/11/2026");
            expect(preset(setup, "Last 7 days").prop("aria-selected")).toBe(true);
            expect(button(setup, "Thursday, November 5, 2026").hasClass("datePicker__cell_inRange")).toBeTruthy();
        });

        it.each([
            ["Today", "2026-11-09", "2026-11-09"],
            ["Yesterday", "2026-11-08", "2026-11-08"],
            ["Last 14 days", "2026-10-27", "2026-11-09"],
            ["Last 30 days", "2026-10-11", "2026-11-09"],
            ["1 month ago", "2026-10-09", "2026-11-09"]
        ])("picks %s as %s to %s", (text, start, end) => {
            const onChange = jest.fn();

            setup.setProps({ presets: RANGE_PRESETS, onChange });
            openPopover(setup, 0);
            pickPreset(setup, text);

            expect(onChange.mock.calls[0][1]).toEqual({ start, end });
        });

        it("reports a preset of a controlled range without changing the fields", () => {
            const onChange = jest.fn();
            const range = mountRange({ presets: RANGE_PRESETS, value: { start: null, end: null }, onChange });

            openPopover(range, 0);
            pickPreset(range, "Yesterday");

            expect(onChange.mock.calls[0][1]).toEqual({ start: "2026-11-08", end: "2026-11-08" });
            expect(inputs(range).at(0).prop("value")).toBe("");

            range.unmount();
        });

        it("disables a preset that reaches past min or max", () => {
            setup.setProps({ presets: RANGE_PRESETS, min: "2026-10-20", max: "2026-11-08" });
            openPopover(setup, 0);

            expect(preset(setup, "Today").prop("disabled")).toBe(true);
            expect(preset(setup, "Yesterday").prop("disabled")).toBe(false);
            expect(preset(setup, "Last 7 days").prop("disabled")).toBe(true);
        });

        it("picks ranges of days from today, of fixed ISO dates and from a function of today, in any order", () => {
            const onChange = jest.fn();

            setup.setProps({
                presets: [
                    { label: "Last 11 days", value: { start: -10, end: 0 } },
                    { label: "Next 3 days", value: { start: 3, end: 1 } },
                    { label: "Q1 2026", value: { start: "2026-01-01", end: "2026-03-31" } },
                    { label: "This month", value: (today) => ({ start: `${today.slice(0, 8)}01`, end: today }) },
                    { label: "Since the release", value: { start: "2026-09-01", end: 0 } }
                ],
                onChange
            });
            openPopover(setup, 0);
            ["Last 11 days", "Next 3 days", "Q1 2026", "This month", "Since the release"].forEach((text) =>
                pickPreset(setup, text)
            );

            expect(onChange.mock.calls.map((call) => call[1])).toEqual([
                { start: "2026-10-30", end: "2026-11-09" },
                { start: "2026-11-10", end: "2026-11-12" },
                { start: "2026-01-01", end: "2026-03-31" },
                { start: "2026-11-01", end: "2026-11-09" },
                { start: "2026-09-01", end: "2026-11-09" }
            ]);
            expect(preset(setup, "Since the release").prop("aria-selected")).toBe(true);
        });

        it("shows a picked preset from the month of its start, with the month of its end beside it", () => {
            setup.setProps({
                presets: [...RANGE_PRESETS, { label: "Q1 2026", value: { start: "2026-01-01", end: "2026-03-31" } }]
            });
            openPopover(setup, 0);
            expect(headings(setup)).toEqual(["November 2026", "December 2026"]);

            pickPreset(setup, "Last 30 days");
            expect(headings(setup)).toEqual(["October 2026", "November 2026"]);

            pickPreset(setup, "Q1 2026");
            expect(headings(setup)).toEqual(["January 2026", "March 2026"]);

            pickPreset(setup, "Today");
            expect(headings(setup)).toEqual(["November 2026", "December 2026"]);
        });

        it("disables a range preset with a day that is not a date", () => {
            setup.setProps({
                presets: [
                    { label: "Broken start", value: { start: "soon", end: 0 } },
                    { label: "Broken function", value: () => ({ start: 0, end: 1.5 }) },
                    { label: "Last 7 days", value: { start: -6, end: 0 } }
                ]
            });
            openPopover(setup, 0);

            expect(presetItems(setup).map((item) => item.prop("disabled"))).toEqual([true, true, false]);
        });
    });
});
