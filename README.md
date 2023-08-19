# Basic DOM helper

>Basic DOM helper - A lightweight DOM helper.

This package provides methods to manipulate programatically DOM objects.

## Installation

Install the `basic-dom-helper` package:

```bash
npm i basic-dom-helper
```

For typescript usage install `@types/basic-dom-helper` package as development dependency:

```bash
npm i --save @type/basic-dom-helper
```

## Usage

The API is an abstract class with static methods for DOM manipulation. The
methods uses multiple arguments merging common javascript commands for DOM
manipulation.

For javascript usage:

```javascript
const $ = require('basic-dom-helper');
```

For typescript usage:

```typescript
import $ from 'basic-dom-helper';
```

## Examples

The example above show how to create a div element appending as child of
`content` with id `'div-id'`:

```typescript
const div = $.create('div', content, 'div-id');
```

The `create` method as shown in the previous example is equivalent to running
the following three javascript commands:

```javascript
const div = document.createElement('div');
content.append(div);
div.setAttribute('id', 'div-id');
```

If the `create` method is used in its complete call, it can assign the created
tag to a parent referred to by id, also assigning the class and name.

```typescript
const div = $.create('div', 'content-id', 'div-id', 'div-style-class', 'div-name');
```

Being equivalent to:

```javascript
const div = document.createElement('div');
document.getElementById('content-id').append(div);
div.setAttribute('id', 'div-id');
div.setAttribute('class', 'div-style-class');
div.setAttribute('name', 'div-name');
```


# License

>MIT License
>
>Copyright &copy; 2016-2023 Sergio Lindau
>
>Permission is hereby granted, free of charge, to any person obtaining a copy
>of this software and associated documentation files (the "Software"), to deal
>in the Software without restriction, including without limitation the rights
>to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
>copies of the Software, and to permit persons to whom the Software is
>furnished to do so, subject to the following conditions:
>
>The above copyright notice and this permission notice shall be included in all
>copies or substantial portions of the Software.
>
>THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
>IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
>FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
>AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
>LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
>OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
>SOFTWARE.