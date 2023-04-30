import type { BootstrapSelectOptions } from "../types/options";
import { DefaultOptions } from "./options";
import { DATA_ATTR } from "./constants";
import type { BootstrapSelect } from "../bootstrap-select";

export function inArray(needle: unknown, haystack: unknown[]) {
    const length = haystack.length;
    for (let i = 0; i < length; i++) {
        if (haystack[i] == needle) return true;
    }
    return false;
}

// shallow array comparison
export function isEqual(array1: [], array2: []) {
    return (
        array1.length === array2.length &&
        array1.every(function (element, index) {
            return element === array2[index];
        })
    );
}

export function toKebabCase(str: string) {
    return str.replace(/[A-Z]+(?![a-z])|[A-Z]/g, function ($, ofs) {
        return (ofs ? "-" : "") + $.toLowerCase();
    });
}

export function toCamelCase(str: string): string {
    return str
        .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
            return index === 0 ? word.toLowerCase() : word.toUpperCase();
        })
        .replace(/\s+/g, "");
}

export function createElementFromString<T>(htmlString: string): T {
    const div = document.createElement("div");
    div.innerHTML = htmlString.trim();

    // Change this to div.childNodes to support multiple top-level nodes.
    return div.firstChild as T;
}

export function toInteger(value: string) {
    return parseInt(value, 10) || 0;
}

/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isObject(item: any): boolean {
    return item && typeof item === "object" && !Array.isArray(item);
}

/**
 * Deep merge two objects.
 */
export function mergeDeep<T extends object>(target: T, ...sources: T[]): T {
    if (!sources.length) return target;
    const source = sources.shift();

    if (source && isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key as keyof T])) {
                if (!target[key as keyof T]) Object.assign(target, { [key]: {} });
                mergeDeep(target[key as keyof object], source[key as keyof object]);
            } else {
                Object.assign(target, { [key]: source[key as keyof T] });
            }
        }
    }

    return mergeDeep(target, ...sources);
}

// export function addOption(_$opt: HTMLOptionElement) {}

// export function addGroup(_$optGroup: HTMLOptGroupElement) {}

export function readDataAttr($el: HTMLSelectElement): BootstrapSelectOptions {
    const data = $el.dataset;
    const options: any = {};

    for (const key in data) {
        if (key.startsWith(DATA_ATTR) && key !== DATA_ATTR) {
            const validKey = toCamelCase(key.replace(DATA_ATTR, "")) as keyof BootstrapSelectOptions;

            options[validKey] = data[key];
        }
    }

    return options as BootstrapSelectOptions;
}

export function getTextContent($el: HTMLSelectElement, instanceSelect: BootstrapSelect): string {
    if (!$el.options) {
        return DefaultOptions.noneSelectedText;
    }

    const selected = $el.querySelectorAll("option:checked") as NodeListOf<HTMLOptionElement>;
    const first = $el.options[0];

    const text: string[] = [];

    if (selected.length) {
        if ($el.multiple) {
            if (instanceSelect.options.selectedTextFormat.indexOf("count") !== -1) {
                const content = instanceSelect.options.countSelectedText(selected.length, selected.length);
                text.push(content);

                return text.join(DefaultOptions.multipleSeparator);
            } else if (instanceSelect.options.doneButton) {
                selected.forEach(opt => {
                    text.push(instanceSelect.options.template.item(opt));
                });

                return text.join("");
            } else {
                // classic display values with separator
                selected.forEach(opt => {
                    text.push(opt?.textContent || DefaultOptions.noneValue);
                });

                return text.join(DefaultOptions.multipleSeparator);
            }
        } else {
            selected.forEach(opt => {
                text.push(opt?.textContent || DefaultOptions.noneValue);
            });

            return text.join(DefaultOptions.multipleSeparator);
        }
    } else {
        if ($el.multiple) {
            text.push(DefaultOptions.noneSelectedText);
        } else {
            text.push(first.textContent || DefaultOptions.noneSelectedText);
        }

        return text.join(DefaultOptions.multipleSeparator);
    }
}

/**
 * Add class to element if not already present
 *
 * @param className Class name
 * @param element Element to add class
 */
export function addClass(className: string | string[], element: HTMLElement): void {
    if (className instanceof Array) {
        className.forEach(name => {
            if (!element.classList.contains(name)) {
                element.classList.add(name);
            }
        });
    } else {
        if (!element.classList.contains(className)) {
            element.classList.add(className);
        }
    }
}

export function removeClass(className: string | string[], element: HTMLElement): void {
    if (className instanceof Array) {
        className.forEach(name => {
            if (element.classList.contains(name)) {
                element.classList.remove(name);
            }
        });
    } else {
        if (element.classList.contains(className)) {
            element.classList.remove(className);
        }
    }
}
