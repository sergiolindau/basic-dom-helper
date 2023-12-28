/**
 * Basic DOM Helper
 *
 * Functions to manipulate DOM objects programatticaly.
 */

/**
 * Fetch function type (for definition of compatibleFetch).
 */
export type Tfetch = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

/**
 * Script load options.
 * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLScriptElement)
 */
export interface LoadScriptOptions {
    src?: string;
    text?: string;
    async?: boolean;
    crossOrigin?: string | null;
    defer?: boolean;
    integrity?: string;
    noModule?: boolean;
    referrerPolicy?: string;
    type?: string;
}

/**
 * Link load options.
 * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLLinkElement)
 */
export interface LoadLinkOptions {
    href?: string;
    as?: string;
    crossOrigin?: string | null;
    disabled?: boolean;
    hreflang?: string;
    imageSizes?: string;
    imageSrcset?: string;
    integrity?: string;
    media?: string;
    referrerPolicy?: string;
    rel?: string;
    type?: string;
}

/**
 * Basic DOM Helper abstract class
 *
 * This class provides static methods to manipulate DOM objects programatticaly.
 */
export default abstract class BasicDOMHelper {
    /**
     * Get element by id.
     * @param elementId element id
     * @returns element
     */
    public static i(elementId: string): HTMLElement | null {
        return document.getElementById(elementId);
    }
    /**
     * Get elements by name.
     * @param elementName elements name
     * @returns elements node list
     */
    public static n(elementName: string): NodeListOf<HTMLElement> | null {
        return document.getElementsByName(elementName);
    }
    /**
     * Get elements by class.
     * @param classNames class name
     * @returns elements collection
     */
    public static c(classNames: string): HTMLCollectionOf<Element> | null {
        return document.getElementsByClassName(classNames);
    }
    /**
     * Get elements by tag.
     * @param qualifiedName name
     * @returns elements collection
     */
    public static t(qualifiedName: string): HTMLCollectionOf<Element> | null {
        return document.getElementsByTagName(qualifiedName);
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
        if (arguments.length == 1) {
            return document.createElement(tag);
        } else {
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
    /**
     *
     * @param element HTMLElement or element id.
     * @returns HTMLElement with innerHTML cleaned.
     */
    public static cleanHTML(element: HTMLElement | string): HTMLElement | null {
        const result: any = typeof element == 'string' ? document.getElementById(element as string) : element;
        result.innerHTML = '';
        return result;
    }
    /**
     * Compatible fetch function that uses XMLHttpRequest if fetch unavailable.
     * It provides only a subset of Response object if using XMLHttpRequest.
     * @param input
     * @param init
     * @returns
     */
    public static fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
        if ((window as any).fetch) {
            return fetch(input, init);
        } else {
            return new Promise((resolve: (value: Response | PromiseLike<Response>) => void) => {
                const xhttp = new XMLHttpRequest();
                /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
                xhttp.onload = function (this: XMLHttpRequest, ev: ProgressEvent<EventTarget>) {
                    resolve({
                        ok: true,
                        json: (): Promise<any> => Promise.resolve(JSON.parse(this.responseText)),
                        text: (): Promise<string> => Promise.resolve(this.responseText),
                    } as Response);
                };
                /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
                xhttp.onerror = function (this: XMLHttpRequest, ev: ProgressEvent<EventTarget>) {
                    resolve({
                        ok: false,
                    } as Response);
                };
                xhttp.open('GET', input.toString(), true);
                xhttp.send();
            });
        }
    }

    public static createStyle(innerHTML?: string): HTMLStyleElement {
        const newStyle: HTMLStyleElement = document.createElement('style');
        document.head.appendChild(newStyle);
        if (innerHTML) newStyle.innerHTML = innerHTML;
        return newStyle;
    }

    public static prefixScript(url: string, onloadFunction?: ((this: GlobalEventHandlers, ev: Event) => any) | null): HTMLScriptElement {
        const newScript: HTMLScriptElement = document.createElement('script');
        newScript.onerror = BasicDOMHelper.loadURIError;
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
        newScript.onerror = BasicDOMHelper.loadURIError;
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
        newLink.onerror = BasicDOMHelper.loadURIError;
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
     * const event = loadScript("myscript.js")
     * .then(() => { console.log("loaded"); })
     * .catch(() => { console.log("error"); });
     *
     * OR
     *
     * try{
     * await loadScript("myscript.js");
     * console.log("loaded");
     * } catch {
     * console.log("error");
     * }
     *
     */
    public static loadScript(scriptUrl: string) {
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

    /* Selected load script and stylesheet methods */

    private static loadURIError(event: Event | string, source?: string, lineno?: number, colno?: number, error?: Error): void {
        if (typeof event !== 'string') {
            throw new URIError(`The file ${event.target} didn't load correctly${error ? ` ${error.message}.` : '.'}`);
        } else {
            throw new URIError(event);
        }
    }

    /**
     * Set options to script element.
     * @param script
     * @param options
     */
    private static setScriptOptions(script: HTMLScriptElement, options: LoadScriptOptions): void {
        if (options.type !== undefined) {
            script.type = options.type;
        } else {
            script.type = 'text/javascript';
        }
        if (options.src) {
            script.src = options.src;
        }
        if (options.text) {
            script.text = options.text;
        }
        if (options.async !== undefined) {
            if (options.async) {
                script.async = true;
                /**
                 * The defer attribute may be specified with the async
                 * attribute, so legacy browsers that only support defer (and
                 * not async) fall back to the defer behavior instead of the
                 * default blocking behavior.
                 */
                script.defer = true;
            } else {
                script.async = false;
            }
        }
        if (options.defer !== undefined) {
            script.defer = options.defer;
        }
        if (options.crossOrigin !== undefined) {
            script.crossOrigin = options.crossOrigin;
        }
        if (options.integrity !== undefined) {
            script.integrity = options.integrity;
        }
        if (options.noModule !== undefined) {
            script.noModule = options.noModule;
        }
        if (options.referrerPolicy !== undefined) {
            script.referrerPolicy = options.referrerPolicy;
        }
    }

    /**
     * Set options to link element.
     * @param link
     * @param options
     */
    private static setLinkOptions(link: HTMLLinkElement, options: LoadLinkOptions): void {
        if (options.type !== undefined) {
            link.type = options.type;
        } else {
            link.type = 'text/css';
        }
        if (options.href) {
            link.href = options.href;
        }
        if (options.as !== undefined) {
            link.as = options.as;
        }
        if (options.crossOrigin !== undefined) {
            link.crossOrigin = options.crossOrigin;
        }
        if (options.disabled !== undefined) {
            link.disabled = options.disabled;
        }
        if (options.hreflang !== undefined) {
            link.hreflang = options.hreflang;
        }
        if (options.imageSizes !== undefined) {
            link.imageSizes = options.imageSizes;
        }
        if (options.imageSrcset !== undefined) {
            link.imageSrcset = options.imageSrcset;
        }
        if (options.integrity !== undefined) {
            link.integrity = options.integrity;
        }
        if (options.media !== undefined) {
            link.media = options.media;
        } else {
            link.media = 'all';
        }
        if (options.referrerPolicy !== undefined) {
            link.referrerPolicy = options.referrerPolicy;
        }
        if (options.rel !== undefined) {
            link.rel = options.rel;
        } else {
            link.rel = 'stylesheet';
        }
    }

    /**
     * Append script to head (optionally).
     * The defer and async attributes must not be specified if the src attribute is absent, the this method can't be called before set src.
     * ### References
     * * https://developer.mozilla.org/en-US/docs/Web/API/HTMLScriptElement
     * * https://www.educative.io/answers/how-to-dynamically-load-a-js-file-in-javascript
     * * https://web.dev/efficiently-load-third-party-javascript/
     *
     * @param src Script source
     * @param onload OnLoad handler
     * @param onerror OnError handler
     * @param options Load options
     * @param append If true then append (default true)
     * @returns
     */
    public static appendScriptToHeadSync(
        options: LoadScriptOptions | string,
        onload?: ((this: GlobalEventHandlers, ev: Event) => any) | null,
        onerror?: OnErrorEventHandler,
        append = true,
    ): HTMLScriptElement {
        const script: HTMLScriptElement = document.createElement('script');
        if (onload) {
            script.onload = onload;
        }
        script.onerror = onerror ? onerror : BasicDOMHelper.loadURIError;
        if (typeof options !== 'string') {
            BasicDOMHelper.setScriptOptions(script, options);
        } else {
            BasicDOMHelper.setScriptOptions(script, { src: options });
        }
        if (append) {
            document.head.appendChild(script);
        }
        return script;
    }

    public static appendScriptToHead(options: LoadScriptOptions | string, append = true): Promise<HTMLScriptElement> {
        return new Promise((resolve, reject) => {
            try {
                const script: HTMLScriptElement = document.createElement('script');
                if (typeof options !== 'string') {
                    BasicDOMHelper.setScriptOptions(script, options);
                } else {
                    BasicDOMHelper.setScriptOptions(script, { src: options });
                }
                /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
                script.addEventListener('load', (ev) => {
                    resolve(script);
                });
                /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
                script.addEventListener('error', (ev) => {
                    reject(new Error(`appendScriptToHead: cannot load ${script.src}`));
                });
                if (append) {
                    document.head.appendChild(script);
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    public static appendLinkToHeadSync(
        options: LoadLinkOptions | string,
        onload?: ((this: GlobalEventHandlers, ev: Event) => any) | null,
        onerror?: OnErrorEventHandler,
        append = true,
    ): HTMLLinkElement {
        const link: HTMLLinkElement = document.createElement('link');
        if (onload) {
            link.onload = onload;
        }
        link.onerror = onerror ? onerror : BasicDOMHelper.loadURIError;
        if (typeof options !== 'string') {
            BasicDOMHelper.setLinkOptions(link, options);
        } else {
            BasicDOMHelper.setLinkOptions(link, { href: options });
        }
        if (append) {
            document.head.appendChild(link);
        }
        return link;
    }

    public static select = {
        addOptions: function (sel: HTMLSelectElement | string, opt: Array<string>): void {
            if (typeof sel === 'string') sel = document.getElementById(sel) as HTMLSelectElement;
            let option;
            for (let i = 0; i < opt.length; i++) {
                option = document.createElement('option');
                option.text = opt[i];
                sel.add(option);
            }
        },
    };
}
