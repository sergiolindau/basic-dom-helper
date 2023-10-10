/**
 * Basic DOM Helper abstract class
 *
 * This class provides static methods to manipulate DOM objects programatticaly.
 */

export type Tfetch = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

export interface ScriptLoadOptions {
  async: boolean;
  crossOrigin: string | null;
  defer: boolean;
  integrity: string;
  noModule: boolean;
  referrerPolicy: string;
}

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
  public static cleanHTML(element: HTMLElement | string): HTMLElement | null {
    const result: any = typeof element == 'string' ? document.getElementById(element as string) : element;
    result.innerHTML = '';
    return result;
  }
  public static fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    if (!(window as any).fetch) {
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
  /**
   * ### References
   * * https://www.ietf.org/rfc/rfc4122.txt
   * @returns
   */
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
   * const event = loadScript("myscript.js")
   * .then(() => { console.log("loaded"); })
   * .catch(() => { console.log("error"); });
   *
   * OR
   *
   * try{
   * await loadScript("myscript.js")
   * console.log("loaded");
   * }catch{
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

  private static setScriptOptions(script: HTMLScriptElement, options?: ScriptLoadOptions): void {
    if (options) {
      if (options.async !== undefined) {
        if (options.async) {
          script.async = true;
          /* The defer attribute may be specified with the async
                    attribute, so  legacy browsers that only support defer (and
                    not async) fall back to the defer behavior instead of the
                    default blocking behavior. */
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
  }

  /**
   * ### References
   * * https://developer.mozilla.org/en-US/docs/Web/API/HTMLscriptment
   * * https://www.educative.io/answers/how-to-dynamically-load-a-js-file-in-javascript
   * * https://web.dev/efficiently-load-third-party-javascript/
   * @param src
   * @param onload
   */
  public static appendScriptToHeadSync(
    src: string,
    onload?: ((this: GlobalEventHandlers, ev: Event) => any) | null,
    onerror?: OnErrorEventHandler,
    options?: ScriptLoadOptions,
    append = true,
  ): HTMLScriptElement {
    const script: HTMLScriptElement = document.createElement('script');
    script.type = 'text/javascript';
    if (onload) {
      script.onload = onload;
    }
    if (onerror) {
      script.onerror = onerror;
    }
    script.src = src;
    this.setScriptOptions(script, options);
    if (append) {
      document.head.appendChild(script);
    }
    return script;
  }

  public static appendScriptToHead(src: string, options?: ScriptLoadOptions, append = true): Promise<HTMLScriptElement> {
    return new Promise((resolve, reject) => {
      try {
        const script: HTMLScriptElement = document.createElement('script');
        script.type = 'text/javascript';
        script.src = src;
        this.setScriptOptions(script, options);
        /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
        script.addEventListener('load', (ev) => {
          resolve(script);
        });
        /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
        script.addEventListener('error', (ev) => {
          reject(new Error(`appendScriptToHead: cannot load ${src}`));
        });

        if (append) {
          document.head.appendChild(script);
        }
      } catch (error) {
        reject(error);
      }
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
