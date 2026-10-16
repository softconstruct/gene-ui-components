const NO_COLOR = "";

const PRESET_COLOR_COUNT = 20;

const DEFAULT_FONT_FAMILY_LABEL = "Default";

const EDITOR_COLORS = [
    "#000000",
    "#434343",
    "#666666",
    "#999999",
    "#B7B7B7",
    "#CCCCCC",
    "#D9D9D9",
    "#EFEFEF",
    "#FFFFFF",
    "#980000",
    "#FF0000",
    "#FF9900",
    "#FFFF00",
    "#00FF00",
    "#00FFFF",
    "#4A86E8",
    "#0000FF",
    "#9900FF",
    "#FF00FF"
];

const FONT_FAMILIES_BY_NAME: Record<string, { label: string; value: string }> = {
    arial: { label: "Arial", value: "Arial, Helvetica, sans-serif" },
    "book antiqua": { label: "Book Antiqua", value: "'Book Antiqua', Palatino, 'Palatino Linotype', serif" },
    "courier new": { label: "Courier New", value: "'Courier New', Courier, monospace" },
    georgia: { label: "Georgia", value: "Georgia, 'Times New Roman', serif" },
    tahoma: { label: "Tahoma", value: "Tahoma, Verdana, sans-serif" },
    "times new roman": { label: "Times New Roman", value: "'Times New Roman', Times, serif" },
    "trebuchet ms": { label: "Trebuchet MS", value: "'Trebuchet MS', sans-serif" },
    verdana: { label: "Verdana", value: "Verdana, sans-serif" }
};

export { NO_COLOR, PRESET_COLOR_COUNT, DEFAULT_FONT_FAMILY_LABEL, EDITOR_COLORS, FONT_FAMILIES_BY_NAME };
