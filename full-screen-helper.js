/*
 * full-screen-helper.js 1.0.0-rc2
 *
 * Copyright (c) 2017 Guilherme Nascimento (brcontainer@yahoo.com.br)
 *
 * Released under the MIT license
 */

(function (d, w, $, u) {
    "use strict";

    var html, body, current, timer,

    wsso = null, wssoc = false, escEvt = false,
    useviewport = false, allowviewport = true,

    sc = !!d.exitFullscreen,
    mozc = !!d.mozCancelFullScreen,
    wkc = !!(d.webkitExitFullscreen || d.webkitCancelFullScreen),
    wkco = !!d.webkitCancelFullScreen,
    wkcn = !!d.webkitExitFullscreen,
    msc = !!d.msExitFullscree,
    reRoot = /(^|\s+)fsh-infullscreen($|\s+)/i,
    reElement = /(^|\s+)full-screen-helper($|\s+)/i,
    changeEvents = [],
    events = [
        "webkitfullscreenchange", "mozfullscreenchange",
        "fullscreenchange", "MSFullscreenChange"
    ];

    var realsupport = sc || mozc || wkc || msc;

    function isHTMLElement(obj) {
        if (w.HTMLElement) {
            return obj instanceof w.HTMLElement;
        }

        return obj && obj.nodeType === 1 && obj.ownerDocument;
    }

    function addEvt(obj, type, callback) {
        obj.addEventListener ?
            obj.addEventListener(type, callback) :
            obj.attachEvent("on" + type, callback);
    }

    function isFS1() {
        getElements();
        return (w.outerWidth || w.innerWidth || d.width || html.clientWidth) == w.screen.width;
    }

    function isFS2() {
        return !!(d.fullscreenElement || d.mozFullScreenElement ||
                  d.webkitFullscreenElement || d.msFullscreenElement);
    }

    function getWSSO() {
        if (wsso !== null) {
            return wssoc;
        }

        if (wsso === false || typeof w.ActiveXObject === "undefined") {
            wsso = false;
        } else if (wsso === null) {
            try {
                wsso = new w.ActiveXObject("WScript.Shell");
                wssoc = true;

                addEvt(w, "resize", resizeObserver);
            } catch (ee) {
                wsso = false;
            }
        }

        return wssoc;
    }

    function escObserver(e) {
        e = e || w.event;

        if ((e.wich || e.keyCode) == 27) {
            exit();
        }
    }

    function toggleClass() {
        var act;

        if (wssoc) {
            act = isFS1();
        } else {
            act = isFS2();
        }

        active(act);
    }

    function resizeObserver(e) {
        clearTimeout(timer);
        timer = setTimeout(toggleClass, wssoc ? 100 : 10);
    }

    function getElements() {
        if (html) { return true; }

        body = d.body;
        html = d.documentElement || (body && body.parentNode);

        return !!html;
    }

    function fallbackRequest(element) {
        if (!escEvt) {
            escEvt = true;

            addEvt(d, "keydown", escObserver);
        }

        if (getWSSO()) {
            if (!isFS1()) {
                current = element;

                active(true);
                wsso.SendKeys("{F11}");
            }

            return;
        }

        useviewport = allowviewport;

        if (useviewport) {
            request(element);
        }
    }

    function active(enable) {
        if (!current) {
            return;
        }

        if (!getElements()) {
            current = null;
            return;
        }

        if (enable) {
            if (!reRoot.test(html.className)) {
                html.className += " fsh-infullscreen";
            }

            if (!reElement.test(current.className)) {
                current.className += " full-screen-helper";
            }
        } else {
            html.className = html.className.replace(reRoot, " ");
            current.className = current.className.replace(reElement, " ");
            current = null;
        }
    }

    function supported() {
        return realsupport || wssoc;
    }

    function request(element) {
        if ((!isHTMLElement(element) && element !== u) || current) {
            return;
        }

        if (element === u) {
            element = body || d.body;
        }

        if (sc) {
            element.requestFullscreen();
        } else if (mozc) {
            element.mozRequestFullScreen();
        } else if (wkc) {
            element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        } else if (msc) {
            element.msRequestFullscreen();
        } else if (!useviewport) {
            fallbackRequest(element);
            return;
        }

        current = element;

        active(true);
    }

    function exit() {
        if (sc) {
            d.exitFullscreen();
        } else if (mozc) {
            d.mozCancelFullScreen();
        } else if (wkcn) {
            d.webkitExitFullscreen();
        } else if (wkco) {
            d.webkitCancelFullScreen();
        } else if (msc) {
            d.msExitFullscreen();
        } else if (!useviewport) {
            if (isFS1() && wssoc) {
                active(false);
                wsso.SendKeys("{F11}");
            }
            return;
        }

        active(false);
    }

    function toggle(element) {
        if (current === element) {
            exit();
        } else {
            request(element);
        }
    }

    if (realsupport && d.addEventListener) {
        for (var i = events.length - 1; i >= 0; i--) {
            d.addEventListener(events[i], resizeObserver);
        }

        w.addEventListener("resize", resizeObserver);
    }

    w.FullScreenHelper = {
        "supported": supported,
        "request": request,
        "toggle": toggle,
        "exit": exit,
        "current": function () {
            return current;
        },
        "viewport": function (enable) {
            allowviewport = !!enable;
        }
    };

    if ($ && $.extend && $.expr) {
        var JZ = function (action, element) {
            switch (action) {
                case "toggle":
                    element && toggle(element);
                break;
                case "request":
                case u:
                    element && request(element);
                break;
                case "exit":
                    !element && exit();
                break;
                case "supported":
                    return !element && supported();
            }
        };

        $.fn.fullScreenHelper = function (action) {
            var element = this[0];

            if (!element) {
                return;
            }

            JZ(action, element);
        };

        $.fullScreenHelper = JZ;

        $.expr[":"].fullscreen = function (element) {
            return reElement.test(element.className);
        };
    }
})(document, window, window.jQuery);
