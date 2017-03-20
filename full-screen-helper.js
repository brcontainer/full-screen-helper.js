/*
 * full-screen-helper.js 0.2.0
 *
 * Copyright (c) 2017 Guilherme Nascimento (brcontainer@yahoo.com.br)
 *
 * Released under the MIT license
 */

(function (d, w) {
    "use strict";

    var sy = 0,
        sx = 0,
        wso,
        html,
        body,
        target,
        timer = 0,
        currentElement,
        detectOnMS = false,
        clsRE = /(^|\s+)full-screen-helper($|\s+)/i,
        clsNSRE = /(^|\s+)fsh-infullscreen($|\s+)/i,
        eventsFS = [
            "webkitfullscreenchange",
            "mozfullscreenchange",
            "fullscreenchange",
            "MSFullscreenChange"
        ];

    function isHTMLElement(obj) {
        if (w.HTMLElement) {
            return obj instanceof w.HTMLElement;
        }

        return obj && obj.nodeType === 1 && obj.ownerDocument;
    }

    function msDetectEscTrigger(e) {
        if (currentElement && wso) {
            e = e || w.event;

            if (e && e.keyCode == 27) {
                wso.SendKeys("{F11}");
            }
        }
    }

    function msFS() {
        if (detectOnMS) {
            var iw = w.outerWidth || w.innerWidth || d.width;

            if (!html) {
                return false;
            }

            if (!clsNSRE.test(html.className)) {
                html.className += " fsh-infullscreen";
            }

            return (iw || html.clientWidth) == w.screen.width;
        }

        return !!(
            d.fullscreenElement ||
            d.mozFullScreenElement ||
            d.webkitFullscreenElement ||
            d.msFullscreenElement ||
            false
        );
    }

    function detectFSChange(e) {
        if (currentElement) {
            clearTimeout(timer);
            timer = setTimeout(toggleFSClass, detectOnMS ? 100 : 10);
        }
    }

    function getMainElements() {
        if (!html) {
            body = d.body;
            html = d.documentElement || (body && body.parentNode);
        }
    }

    function getScrollPosition() {
        getMainElements();

        if (target) {
            sx = target.scrollLeft;
            sy = target.scrollTop;
        } else {
            sx = w.pageXOffset || w.scrollX || html.scrollLeft || body.scrollLeft || 0;
            sy = w.pageYOffset || w.scrollY || html.scrollTop || body.scrollTop || 0;
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

            getMainElements();

            if (html) {
                html.className = html.className.replace(clsNSRE, " ");

                if (target && (sy || sx)) {
                    target.scrollLeft = sx;
                    target.scrollTop = sy;
                } else {
                    w.scrollTo(sx, sy);
                }
            }
        }
    }

    function getWSO() {
        if (typeof w.ActiveXObject === "undefined") {
            wso = null;
        }

        if (typeof wso === "undefined") {
            try {
                wso = new w.ActiveXObject("WScript.Shell");
                d.attachEvent("onkeydown", msDetectEscTrigger);

                detectOnMS = true;

                w.attachEvent("onresize", detectFSChange);
            } catch (ee) {
                wso = null;
            }
        }
    }

    function msToggleFS(element) {
        getWSO();

        if (wso !== null) {
            currentElement = element;

            getScrollPosition();

            wso.SendKeys("{F11}");
        }
    }

    function isSupported() {
        return !!(
            detectOnMS ||
            d.exitFullscreen ||
            d.mozCancelFullScreen ||
            d.webkitExitFullscreen ||
            d.webkitCancelFullScreen ||
            d.msExitFullscreen
        );
    }

    function getElementInFS() {
        return d.fullscreenElement ||
               d.mozFullScreenElement ||
               d.webkitFullscreenElement ||
               d.msFullscreenElement ||
               currentElement ||
               null;
    }

    function requestFS(element) {
        if (!isHTMLElement(element) || getElementInFS() !== null) {
            return;
        }

        currentElement = element;

        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        } else {
            currentElement = null;
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
        } else if (d.webkitCancelFullScreen) {
            d.webkitCancelFullScreen();
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

    if (!d.attachEvent && d.addEventListener) {
        for (var i = eventsFS.length - 1; i >= 0; i--) {
            d.addEventListener(eventsFS[i], detectFSChange);
        }

        w.addEventListener("resize", detectFSChange);
    }

    w.FullScreenHelper = {
        "supported": isSupported,
        "current": getElementInFS,
        "request": requestFS,
        "toggle": toggleFS,
        "exit": exitFS,
        "root": function (element) {
            if (isHTMLElement(element)) {
                target = element;
            }
        }
    };
})(document, window);
