## Full Screen Helper

### Setup

Include lib

``` html
<script src="full-screen-helper.min.js"></script>
``` 

Or use CDN:

``` html
<script src="https://cdn.jsdelivr.net/npm/full-screen-helper@1.0/full-screen-helper.min.js"></script>
``` 

Import:

``` javascript
const FullScreenHelper = require('full-screen-helper');
``` 

Import ES6 (eg.: "libs" like Angular/Vue-cli):

``` javascript
import FullScreenHelper from 'full-screen-helper'
``` 

RequireJS:

``` javascript
requirejs(['folder/foo/bar/full-screen-helper'], function (FullScreenHelper) {
    ...
});
``` 

### Browser support

Tested in:

- IE8+ (using `ActiveX`)
- IE11 (without `ActiveX`)
- Firefox
- Google Chrome

> **Note¹:** for security reasons maybe `WScript.shell` (`ActiveX`) may be blocked.
> 
> **Note²:** Mobile browsers using fallback (full-viewport)

### Usage

For use an video in fullscreen:

``` html
<video id="myVideo" src="video.webm"></video>

<button onclick="$('#myVideo').fullScreenHelper('request');">Fullscreen</button>
``` 

For use an video in fullscreen (Vanilla.js :P):

``` html
<video id="myVideo" src="video.webm"></video>

<button onclick="FullScreenHelper.request('#myVideo');">Fullscreen</button>
``` 

or

``` javascript
var element = document.getElementById('myVideo');

...

FullScreenHelper.request(element);
``` 

---

Entire page in fullscreen:

``` html
<button onclick="FullScreenHelper.request();">Fullscreen</button>
``` 

``` html
<button onclick="$('body').fullScreenHelper('request');">Fullscreen</button>
``` 

### API

Method | Description
--- | ---
`FullScreenHelper.supported()` | Return `true` if browser support fullscreen, otherwise return `false`
`FullScreenHelper.state()` | Return `true` if in fullscreen, otherwise return `false`
`FullScreenHelper.viewport(boolean)` | If define `true` use fullviewport as fallback to browsers without support to fullscreen. Default is `true`
`FullScreenHelper.request(element\|selector)` | Show element in fullscreen, if there is not another one on fullscreen
`FullScreenHelper.toggle(element\|selector)` | Put the element in fullscreen or restore
`FullScreenHelper.exit()` | Exit fullscreen mode
`FullScreenHelper.current()` | Get current element in fullscreen, otherwise returns `null`
`FullScreenHelper.on(function () {})` | Add event
`FullScreenHelper.off(function () {})` | Remove event

### jQuery fullscreen API

Method | Equivalent
--- | ---
`$(':fullscreen')` | `FullScreenHelper.current()`
`$('...').fullScreenHelper('request')` | `FullScreenHelper.request(element\|selector)`
`$('...').fullScreenHelper('toggle')` | `FullScreenHelper.toggle(element\|selector)`
`$('body').fullScreenHelper('request')` | `FullScreenHelper.request()`
`$('body').fullScreenHelper('toggle')` | `FullScreenHelper.toggle()`
`$(document).bind('fullscreenchange', function () {})` | `FullScreenHelper.on(function () {})`
`$(document).unbind('fullscreenchange', function () {})` | `FullScreenHelper.off(function () {})`
`$.fullScreenHelper('supported')` | `FullScreenHelper.supported()`
`$.fullScreenHelper('state')` | `FullScreenHelper.state()`
`$.fullScreenHelper('exit')` | `FullScreenHelper.exit()`

> **Note ¹:** `'request'` is optional in `$('...').fullScreenHelper('request')`, you can use `$('...').fullScreenHelper()`
> 
> **Note ²:** You can use `$('body')` or `$(document)` in `.fullScreenHelper('toggle')` and `.fullScreenHelper('request')`

### Fullscreen in Internet Explorer

For support in older MSIE browser is needed `WScript.Shell` activex, but in IE8+ security has been increased, which can cause the script to not work.

For MSIE11 is used `msRequestFullscreen` and `msExitFullscreen`

> **Note:** It is recommended that you use:
> 
> ``` html
> <meta http-equiv="X-UA-Compatible" content="IE=edge">
> ``` 

### CSS selector

Use combined CSS selectors with prefix don't work, because when there is an invalid selector the whole rule dropped, if grouped (details: https://www.w3.org/TR/selectors4/#logical-combination):

``` css
:fullscreen,
:full-screen,
:-webkit-full-screen,
:-moz-full-screen,
:-ms-fullscreen {
    /* your custom css */
}
``` 

When the selectors are not grouped, only invalids (depends on the browser) rules are dropped, example:

``` css
/* dropped in older browsers */
:fullscreen {
    /* your custom css */
}

/* dropped in new browsers */
:full-screen {
    /* your custom css */
}

/* dropped in all browsers except Safari, Chrome and others with webkit */
:-webkit-full-screen {
    /* your custom css */
}

/* dropped in all browsers except Mozilla Firefox */
:-moz-full-screen {
    /* your custom css */
}

/* dropped in all browsers except Internet Explorer 11 */
:-ms-fullscreen {
    /* your custom css */
}
``` 

However having a rule for each thing can make the code much more difficult to maintain, so you can use the selector:

``` css
.full-screen-helper {
    /* your custom css */
}
``` 

### CSS box-sizing

The script has not been tested on older browsers such as IE7, but is likely to work depending on `ActiveX` support, however `box-sizing` may not work or you may be using a modern browser and you have changed the control of `box-sizing` to something like:


``` css
.my-element {
    box-sizing: content-box !important;
    padding: 10px !important;
    border: 1px #ccc solid !important;
}
``` 

In both cases you can suffer side effects maybe use `padding` or `border`.
