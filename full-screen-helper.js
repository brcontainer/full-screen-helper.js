/*
 * full-screen-helper.js 1.0.2
 *
 * Copyright (c) 2017 Guilherme Nascimento (brcontainer@yahoo.com.br)
 *
 * Released under the MIT license
 */

(function (d, w, $, u) {
    "use strict";

    var html, body, current, timer,

    wsso, wssoc = false, escEvt = false,
    useviewport = false, allowviewport = true, state = false,

    sc = !!d.exitFullscreen,
    mozc = !!d.mozCancelFullScreen,
    wkc = !!(d.webkitExitFullscreen || d.webkitCancelFullScreen),
    wkco = !!d.webkitCancelFullScreen,
    wkcn = !!d.webkitExitFullscreen,
    msc = !!d.msExitFullscreen,

    reRoot = /(^|\s+)fsh-infullscreen($|\s+)/i,
    reElement = /(^|\s+)full-screen-helper($|\s+)/i,
    changeEvents = [],
    events = [
        "webkitfullscreenchange", "mozfullscreenchange",
        "fullscreenchange", "MSFullscreenChange"
    ];

    var realsupport = sc || mozc || wkc || msc;

    function change(callback, remove) {
        if (typeof callback !== "function") return;

        if (!remove) {
            changeEvents.push(callback);
            return;
        }

        if (!remove) {
            changeEvents.push(callback);
            return;
        }

        var relist = [];

        for (var i = 0, j = changeEvents.length; i < j; i++) {
            if (changeEvents[i] !== callback) relist.push(callback);
        }

        changeEvents = relist;
        relist = null;
    }

    function isValid(obj) {
        if (obj === u || obj === d) return d.body;

        if (w.HTMLElement) {
            if (!obj || !(obj instanceof w.HTMLElement && obj.ownerDocument === d)) return false;
        }

        if (!obj || obj.nodeType !== 1 || obj.ownerDocument !== d) return false;

        return obj;
    }

    function addEvt(obj, type, callback) {
        if (obj.addEventListener) {
            obj.addEventListener(type, callback);
        } else {
            obj.attachEvent("on" + type, callback);
        }
    }

    function isFS1() {
        return getElements() &&
                (w.outerWidth || w.innerWidth || html.clientWidth) == w.screen.width;
    }

    function isFS2() {
        var element = d.fullscreenElement || d.mozFullScreenElement ||
                        d.webkitFullscreenElement || d.msFullscreenElement;

        if (!element) return false;

        if (element !== current) current = element;

        return true;
    }

    function getWSSO() {
        if (wssoc) return wssoc;

        if (wsso === false || w.ActiveXObject === u) {
            wsso = false;
        } else if (wsso === u) {
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

        if ((e.wich || e.keyCode) == 27) exit();
    }

    function toggleClass() {
        active(wssoc ? isFS1() : isFS2());
    }

    function resizeObserver(e) {
        clearTimeout(timer);
        timer = setTimeout(toggleClass, wssoc ? 100 : 10);
    }

    function getElements() {
        if (html) return true;

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

        if (useviewport) request(element);
    }

    function active(enable) {
        if (state === enable || !current) return;

        if (!getElements()) {
            current = null;
            return;
        }

        if (enable) {
            if (!reRoot.test(html.className)) html.className += " fsh-infullscreen";
            if (!reElement.test(current.className)) current.className += " full-screen-helper";
        } else {
            html.className = html.className.replace(reRoot, " ");
            current.className = current.className.replace(reElement, " ");
            current = null;
        }

        state = enable;
        setTimeout(triggerEvents, 1);
    }

    function triggerEvents() {
        for (var i = 0; i < changeEvents.length; i++) changeEvents[i]();
    }

    function supported() {
        return realsupport || getWSSO();
    }

    function request(element) {
        element = isValid(element);

        if (current || element === false) return;

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

    if (realsupport) {
        for (var i = events.length - 1; i >= 0; i--) addEvt(d, events[i], resizeObserver);

        addEvt(w, "resize", resizeObserver);
    }

    w.FullScreenHelper = {
        "supported": supported,
        "request": request,
        "toggle": toggle,
        "exit": exit,
        "current": function () {
            return current;
        },
        "state": function () {
            return state;
        },
        "viewport": function (enable) {
            allowviewport = !!enable;
        },
        "on": function (callback) {
            change(callback);
        },
        "off": function (callback) {
            change(callback, true);
        }
    };

    if ($ && $.extend && $.expr) {
        $.fn.fullScreenHelper = function (action) {
            var element = this[0];

            if (!element) return;

            switch (action) {
                case "toggle":
                    toggle(element);
                break;
                case "request":
                case u:
                    request(element);
                break;
            }
        };

        $.fullScreenHelper = function (action) {
            switch (action) {
                case "exit":
                    exit();
                break;
                case "supported":
                    return supported();
                break;
                case "state":
                    return state;
            }
        };

        $.expr[":"].fullscreen = function (element) {
            return reElement.test(element.className);
        };

        if (!("onfullscreenchange" in d)) {
            var $d = $(d);

            change(function () {
                $d.trigger("fullscreenchange");
            });
        }
    }
})(document, window, window.jQuery);
