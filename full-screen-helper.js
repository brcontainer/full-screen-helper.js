/*
 * full-screen-helper.js
 * Copyright (c) 2017 Guilherme Nascimento (brcontainer@yahoo.com.br)
 *
 * Released under the MIT license
 */

(function (d, w) {
    "use strict";

    var wso,
        timer = 0,
        clsRE = /(^|\s)full-screen-helper($|\s)/i,
        currentElement;

    function msDetectEscTrigger(e) {
        if (currentElement && wso) {
            e = e || window.event;

            if (e && e.keyCode == 27) {
                wso.SendKeys("{F11}");
            }
        }
    }

    function msFS() {
        var html, iw = w.innerWidth;

        if (!iw) {
            html = d.documentElement || (d.body && d.body.parentNode);
            iw = html.clientWidth;
        }

        return iw == w.screen.width;
    }

    function detectResize() {
        if (currentElement) {
            clearTimeout(timer);
            timer = setTimeout(toggleFSClass, 100);
        }
    }

    function toggleFSClass() {
        if (!currentElement) {
            return;
        }

        if (msFS()) {
            if (!clsRE.test(currentElement.className)) {
                currentElement.className += " full-screen-helper";
            }
        } else {
            currentElement.className = currentElement.className.replace(clsRE, " ");
            currentElement = null;
        }
    }

    function msToggleFS(element) {
        if (typeof w.ActiveXObject === "undefined") {
            wso = null;
        }

        if (typeof wso === "undefined") {
            try {
                wso = new w.ActiveXObject("WScript.Shell");
                d.attachEvent("onkeydown", msDetectEscTrigger);
                w.attachEvent("onresize", detectResize);
            } catch (ee) {
                wso = null;
            }
        }

        if (wso !== null) {
            currentElement = element;
            wso.SendKeys("{F11}");
        }
    }

    function getElementInFS() {
        return d.fullscreenElement ||
               d.mozFullScreenElement ||
               d.webkitFullscreenElement ||
               currentElement ||
               null;
    }

    function requestFS(element) {
        if (!element || getElementInFS() !== null) {
            return;
        }

        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        } else {
            return msToggleFS(element);
        }
    }

    function exitFS() {
        if (d.exitFullscreen) {
            d.exitFullscreen();
        } else if (d.mozCancelFullScreen) {
            d.mozCancelFullScreen();
        } else if (d.webkitExitFullscreen) {
            d.webkitExitFullscreen();
        } else if (d.msExitFullscreen) {
            d.msExitFullscreen();
        } else if (wso && currentElement) {
            wso.SendKeys("{F11}");
        }
    }

    function toggleFS(element) {
        if (getElementInFS() === null) {
            requestFS(element);
        } else {
            exitFS();
        }
    }

    window.FullScreenHelper = {
        "current": getElementInFS,
        "request": requestFS,
        "toggle": toggleFS,
        "exit": exitFS
    };
})(document, window);
