## Full Screen Helper

### Browser support

Tested in:

- IE8+ (using `ActiveX`)
- IE11 (without `ActiveX`)
- Firefox
- Google Chrome

> **Note:** for security reasons maybe `WScript.shell` (`ActiveX`) may be blocked.

### Usage

For use an video in fullscreen:

```html
<video id="myVideo" src="video.webm"></video>

<button onclick="FullScreenHelper.request(document.getElementById('myVideo'));">Fullscreen</button>
```

Entire page in fullscreen:

```html
<button onclick="FullScreenHelper.request(document.body);">Fullscreen</button>
```


### API

Method | Description
--- | ---
`FullScreenHelper.supported()` | Return `true` if browser support fullscreen, otherwise return `false`
`FullScreenHelper.viewport(true or false)` | If define `true` use fullviewport as fallback to browsers without support to fullscreen. Default is `true`
`FullScreenHelper.request(element)` | Show element in fullscreen, if there is not another one on fullscreen
`FullScreenHelper.toggle(element)` | Put the element in fullscreen or restore
`FullScreenHelper.exit()` | Exit fullscreen mode
`FullScreenHelper.current()` | Get current element in fullscreen, otherwise returns `null`

# jQuery fullscreen API

Method | Equivalent
--- | ---
`$(':fullscreen')` | `FullScreenHelper.current()`
`$('...').fullScreenHelper('request');` | `FullScreenHelper.request(element)`
`$('...').fullScreenHelper('toggle');` | `FullScreenHelper.toggle(element)`
`$.fullScreenHelper('supported');` | `FullScreenHelper.supported()`
`$.fullScreenHelper('exit');` | `FullScreenHelper.exit()`


### Fullscreen in Internet Explorer

For support in older MSIE browser is needed `WScript.Shell` activex, but in IE8+ security has been increased, which can cause the script to not work.

For MSIE11 is used `msRequestFullscreen` and `msExitFullscreen`

### CSS selector

Use combined CSS selectors with prefix don't work, because when there is an invalid selector the whole rule dropped, if grouped (details: https://www.w3.org/TR/selectors4/#logical-combination):

```css
:fullscreen,
:full-screen,
:-webkit-full-screen,
:-moz-full-screen,
:-ms-fullscreen {
    /* your custom css */
}
```

When the selectors are not grouped, only invalids (depends on the browser) rules are dropped, example:

```css
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

```css
.full-screen-helper {
    /* your custom css */
}
```

### CSS box-sizing

The script has not been tested on older browsers such as IE7, but is likely to work depending on `ActiveX` support, however `box-sizing` may not work or you may be using a modern browser and you have changed the control of `box-sizing` to something like:


```css
.my-element {
    box-sizing: content-box !important;
    padding: 10px !important;
    border: 1px #ccc solid !important;
}
```

In both cases you can suffer side effects maybe use `padding` or `border`.
