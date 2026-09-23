/**
 * Quill ships as ESM and drives a real `contenteditable`, relying on selection ranges and
 * mutation observers that jsdom only partly provides. Component tests cover this library's own
 * contract rather than the editor engine, so it is stubbed here; the real integration is
 * exercised in Storybook.
 *
 * `root` is a real detached element so attribute and dataset writes behave as they do in the
 * browser. `Quill.lastInstance` and `emit` give tests a way to reach the editor the component
 * created and to drive its events.
 *
 * Only the surface `Editor` uses is implemented - extend it as the component grows.
 */
class Quill {
    constructor(container, options = {}) {
        Quill.lastInstance = this;

        this.container = container;
        this.options = options;
        this.enabled = !options.readOnly;
        this.handlers = {};

        this.root = document.createElement("div");
        this.root.dataset.placeholder = options.placeholder ?? "";

        if (container) {
            container.appendChild(this.root);
        }

        this.clipboard = {
            dangerouslyPasteHTML: (html) => {
                this.root.innerHTML = html;
            }
        };
    }

    on(event, handler) {
        this.handlers[event] = handler;
    }

    off(event) {
        delete this.handlers[event];
    }

    enable(enabled = true) {
        this.enabled = enabled;
    }

    getSemanticHTML() {
        return this.root.innerHTML;
    }

    /**
     * Test-only helper: invokes a registered handler the way Quill would.
     */
    emit(event, ...args) {
        this.handlers[event]?.(...args);
    }
}

export default Quill;
