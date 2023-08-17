/**
 * Basic DOM Helper abstract class
 * 
 * This class provides static methods to manipulate DOM objects programatticaly.
 */
export default abstract class {
    /**
     * Get element by id.
     * @param id element id
     * @returns element
     */
    public static i(id: string): HTMLElement | null {
        return document.getElementById(id);
    }
    /**
     * Get elements by name.
     * @param name elements name
     * @returns elements node list
     */
    public static n(name: string): NodeListOf<HTMLElement> | null {
        return document.getElementsByName(name);
    }
    /**
     * Get elements by class.
     * @param cls class name
     * @returns elements collection
     */
    public static c(cls: string): HTMLCollectionOf<Element> | null {
        return document.getElementsByClassName(cls);
    }
    /**
     * Get elements by tag.
     * @param cls tag
     * @returns elements collection
     */
    public static t(tag: string): HTMLCollectionOf<Element> | null {
        return document.getElementsByTagName(tag);
    }
    /**
     * 
     * @param ns 
     * @param element 
     * @param tag 
     * @returns 
     */
    public static tn(ns: string, element: any, tag: string): HTMLCollectionOf<Element> | null {
        element = typeof element == 'string' ? document.getElementById(element) : element;
        return element.getElementsByTagNameNS(ns, tag);
    }
    /**
     * Creates a DOM object and optionally appends to a parent element, assign
     * id, class and name.
     * @param tag element tag
     * @param parent parent element
     * @param i id
     * @param c class
     * @param n name
     * @returns 
     */
    public static create<K extends keyof HTMLElementTagNameMap>(
        tag: K,
        parent?: string | HTMLElement | null,
        i?: string | null,
        c?: string | null,
        n?: string | null,
    ): HTMLElementTagNameMap[K] {
        if (arguments.length == 1) return document.createElement(tag);
        else {
            const result = document.createElement(tag);
            if (parent) {
                if (typeof parent == 'string') {
                    document.getElementById(parent)?.append(result);
                } else {
                    parent.append(result);
                }
            }
            if (arguments.length > 2 && i) result.setAttribute('id', i);
            if (arguments.length > 3 && c) result.setAttribute('class', c);
            if (arguments.length > 4 && n) result.setAttribute('name', n);
            return result;
        }
    }
    /**
     * Add event listener to an element.
     * @param element element
     * @param event event
     * @param handler handler
     * @param useCapture useCapture
     * @returns element
     */
    public static addEventListener(element: HTMLElement | string, event: string, handler: Function, useCapture?: boolean): HTMLElement {
        const result: any = typeof element == 'string' ? document.getElementById(element as string) : element;
        useCapture = arguments.length > 3 ? useCapture : false;
        result.addEventListener(event, handler, useCapture);
        return result;
    }
    public static querySelector(selectors: string): HTMLElement | null {
        return document.querySelector(selectors);
    }
    public static cleanHTML(element: HTMLElement | string): HTMLElement | null {
        const result: any = typeof element == 'string' ? document.getElementById(element as string) : element;
        result.innerHTML = '';
        return result;
    }
    public static uid(): string {
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    }
    public static createStyle(innerHTML?: string): HTMLStyleElement {
        const newStyle: HTMLStyleElement = document.createElement('style');
        document.head.appendChild(newStyle);
        if (innerHTML) newStyle.innerHTML = innerHTML;
        return newStyle;
    }
    public static loadURIError(oError: any): void {
        throw new URIError('The file ' + oError.target.src + " didn't load correctly.");
    }
    public static prefixScript(url: string, onloadFunction?: ((this: GlobalEventHandlers, ev: Event) => any) | null): HTMLScriptElement {
        const newScript: HTMLScriptElement = document.createElement('script');
        newScript.onerror = this.loadURIError;
        if (onloadFunction) {
            newScript.onload = onloadFunction;
        }
        document.currentScript?.parentNode?.insertBefore(newScript, document.currentScript);
        newScript.type = 'text/javascript';
        newScript.src = url;
        return newScript;
    }
    public static affixScriptToHead(url: string, onloadFunction?: ((this: GlobalEventHandlers, ev: Event) => any) | null): HTMLScriptElement {
        const newScript: HTMLScriptElement = document.createElement('script');
        newScript.onerror = this.loadURIError;
        if (onloadFunction) {
            newScript.onload = onloadFunction;
        }
        document.head.appendChild(newScript);
        newScript.type = 'text/javascript';
        newScript.src = url;
        return newScript;
    }
    public static affixStylesheetToHead(url: string, onloadFunction?: ((this: GlobalEventHandlers, ev: Event) => any) | null): HTMLLinkElement {
        const newLink: HTMLLinkElement = document.createElement('link');
        newLink.onerror = this.loadURIError;
        if (onloadFunction) {
            newLink.onload = onloadFunction;
        }
        document.head.appendChild(newLink);
        newLink.rel = 'stylesheet';
        newLink.type = 'text/css';
        newLink.media = 'all';
        newLink.href = url;
        return newLink;
    }
    /**
     * This function loads a script file with promise
     * @param scriptUrl
     * @returns
     * Usage:
     * const event = loaderScript("myscript.js")
     * .then(() => { console.log("loaded"); })
     * .catch(() => { console.log("error"); });
     *
     * OR
     *
     * try{
     * await loaderScript("myscript.js")
     * console.log("loaded");
     * }catch{
     * console.log("error");
     * }
     *
     */
    public static loaderScript(scriptUrl: string) {
        return new Promise(function (res, rej) {
            const script = document.createElement('script');
            script.src = scriptUrl;
            script.type = 'text/javascript';
            script.async = true;
            script.onerror = rej;
            script.onload = res;
            script.addEventListener('error', rej);
            script.addEventListener('load', res);
            document.head.appendChild(script);
        });
    }
    public static select = {
        addOptions: function (sel: any, opt: Array<string>): void {
            if (typeof sel == 'string') sel = document.getElementById(sel);
            let option;
            for (let i = 0; i < opt.length; i++) {
                option = document.createElement('option');
                option.text = opt[i];
                sel.add(option);
            }
        },
    };
}
