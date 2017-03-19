## Full Screen Helper

### Usage

Method | Description
--- | ---
`FullScreenHelper.current()` | Get current element in fullscreen if in fullscreen, otherwise returns null
`FullScreenHelper.request(element)` | Show element in fullscreen, if there is not another one on fullscreen
`FullScreenHelper.toggle(element)` | Switches the element, checking whether it is already in fullscreen or not
`FullScreenHelper.exit()` | exit fullscreen mode

### Old Internet Explorer

For support in older MSIE browser is needed `WScript.Shell` activex, but in IE8+ security has been increased, which can cause the script to not work.

For MSIE11 is used `msRequestFullscreen` and `msExitFullscreen`
