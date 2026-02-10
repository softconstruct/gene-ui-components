import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

// Ensure @floating-ui/react keeps the requested placement in tests
jest.mock("@floating-ui/react", () => {
    const actual = jest.requireActual("@floating-ui/react");

    return {
        __esModule: true,
        ...actual,
        useFloating: (options: any) => {
            const result = actual.useFloating(options);
            return {
                ...result,
                // Force placement to stay as initially requested,
                // avoiding flips that can make tests flaky.
                placement: options?.placement ?? result.placement
            };
        }
    };
});

// Mock ResizeObserver for tests
// @ts-ignore
global.ResizeObserver = class ResizeObserver {
    observe() { }
    unobserve() { }
    disconnect() { }
};

// Mock scrollTo for jsdom (used by Scrollbar component)
Object.defineProperty(HTMLElement.prototype, "scrollTo", {
    value: jest.fn(),
    writable: true
});
