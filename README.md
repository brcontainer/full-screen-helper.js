## Full Screen Helper

### Usage

Method | Description
--- | ---
`FullScreenHelper.current()` | Get current element in fullscreen if in fullscreen, otherwise returns null
`FullScreenHelper.request(element)` | Show element in fullscreen, if there is not another one on fullscreen
`FullScreenHelper.toggle(element)` | Put the element in fullscreen or restore
`FullScreenHelper.exit()` | exit fullscreen mode

### Fullscreen in Internet Explorer

For support in older MSIE browser is needed `WScript.Shell` activex, but in IE8+ security has been increased, which can cause the script to not work.

For MSIE11 is used `msRequestFullscreen` and `msExitFullscreen`
