/*!
 * ZeroClipboard
 * The ZeroClipboard library provides an easy way to copy text to the clipboard using an invisible Adobe Flash movie and a JavaScript interface
 * Copyright (c) 2009-2016 Jon Rohan, James M. Greene
 * Licensed MIT
 * http://zeroclipboard.org/
 * v2.4.0-beta.1
 */
(function(window, undefined) {
    //"use strict";
    /**
   * Store references to critically important global functions that may be
   * overridden on certain web pages.
   */
    var _window = window, _document = _window.document, _navigator = _window.navigator, _setTimeout = _window.setTimeout, _clearTimeout = _window.clearTimeout, _setInterval = _window.setInterval, _clearInterval = _window.clearInterval, _getComputedStyle = _window.getComputedStyle, _encodeURIComponent = _window.encodeURIComponent, _ActiveXObject = _window.ActiveXObject, _Error = _window.Error, _parseInt = _window.Number.parseInt || _window.parseInt, _parseFloat = _window.Number.parseFloat || _window.parseFloat, _isNaN = _window.Number.isNaN || _window.isNaN, _now = _window.Date.now, _keys = _window.Object.keys, _hasOwn = _window.Object.prototype.hasOwnProperty, _slice = _window.Array.prototype.slice, _unwrap = function() {
      var unwrapper = function(el) {
        return el;
      };
      if (typeof _window.wrap === "function" && typeof _window.unwrap === "function") {
        try {
          var div = _document.createElement("div");
          var unwrappedDiv = _window.unwrap(div);
          if (div.nodeType === 1 && unwrappedDiv && unwrappedDiv.nodeType === 1) {
            unwrapper = _window.unwrap;
          }
        } catch (e) {}
      }
      return unwrapper;
    }();
    /**
   * Convert an `arguments` object into an Array.
   *
   * @returns The arguments as an Array
   * @private
   */
    var _args = function(argumentsObj) {
      return _slice.call(argumentsObj, 0);
    };
    /**
   * Shallow-copy the owned, enumerable properties of one object over to another, similar to jQuery's `$.extend`.
   *
   * @returns The target object, augmented
   * @private
   */
    var _extend = function() {
      var i, len, arg, prop, src, copy, args = _args(arguments), target = args[0] || {};
      for (i = 1, len = args.length; i < len; i++) {
        if ((arg = args[i]) != null) {
          for (prop in arg) {
            if (_hasOwn.call(arg, prop)) {
              src = target[prop];
              copy = arg[prop];
              if (target !== copy && copy !== undefined) {
                target[prop] = copy;
              }
            }
          }
        }
      }
      return target;
    };
    /**
   * Return a deep copy of the source object or array.
   *
   * @returns Object or Array
   * @private
   */
    var _deepCopy = function(source) {
      var copy, i, len, prop;
      if (typeof source !== "object" || source == null || typeof source.nodeType === "number") {
        copy = source;
      } else if (typeof source.length === "number") {
        copy = [];
        for (i = 0, len = source.length; i < len; i++) {
          if (_hasOwn.call(source, i)) {
            copy[i] = _deepCopy(source[i]);
          }
        }
      } else {
        copy = {};
        for (prop in source) {
          if (_hasOwn.call(source, prop)) {
            copy[prop] = _deepCopy(source[prop]);
          }
        }
      }
      return copy;
    };
    /**
   * Makes a shallow copy of `obj` (like `_extend`) but filters its properties based on a list of `keys` to keep.
   * The inverse of `_omit`, mostly. The big difference is that these properties do NOT need to be enumerable to
   * be kept.
   *
   * @returns A new filtered object.
   * @private
   */
    var _pick = function(obj, keys) {
      var newObj = {};
      for (var i = 0, len = keys.length; i < len; i++) {
        if (keys[i] in obj) {
          newObj[keys[i]] = obj[keys[i]];
        }
      }
      return newObj;
    };
    /**
   * Makes a shallow copy of `obj` (like `_extend`) but filters its properties based on a list of `keys` to omit.
   * The inverse of `_pick`.
   *
   * @returns A new filtered object.
   * @private
   */
    var _omit = function(obj, keys) {
      var newObj = {};
      for (var prop in obj) {
        if (keys.indexOf(prop) === -1) {
          newObj[prop] = obj[prop];
        }
      }
      return newObj;
    };
    /**
   * Remove all owned, enumerable properties from an object.
   *
   * @returns The original object without its owned, enumerable properties.
   * @private
   */
    var _deleteOwnProperties = function(obj) {
      if (obj) {
        for (var prop in obj) {
          if (_hasOwn.call(obj, prop)) {
            delete obj[prop];
          }
        }
      }
      return obj;
    };
    /**
   * Determine if an element is contained within another element.
   *
   * @returns Boolean
   * @private
   */
    var _containedBy = function(el, ancestorEl) {
      if (el && el.nodeType === 1 && el.ownerDocument && ancestorEl && (ancestorEl.nodeType === 1 && ancestorEl.ownerDocument && ancestorEl.ownerDocument === el.ownerDocument || ancestorEl.nodeType === 9 && !ancestorEl.ownerDocument && ancestorEl === el.ownerDocument)) {
        do {
          if (el === ancestorEl) {
            return true;
          }
          el = el.parentNode;
        } while (el);
      }
      return false;
    };
    /**
   * Get the URL path's parent directory.
   *
   * @returns String or `undefined`
   * @private
   */
    var _getDirPathOfUrl = function(url) {
      var dir;
      if (typeof url === "string" && url) {
        dir = url.split("#")[0].split("?")[0];
        dir = url.slice(0, url.lastIndexOf("/") + 1);
      }
      return dir;
    };
    /**
   * Get the current script's URL by throwing an `Error` and analyzing it.
   *
   * @returns String or `undefined`
   * @private
   */
    var _getCurrentScriptUrlFromErrorStack = function(stack) {
      var url, matches;
      if (typeof stack === "string" && stack) {
        matches = stack.match(/^(?:|[^:@]*@|.+\)@(?=http[s]?|file)|.+?\s+(?: at |@)(?:[^:\(]+ )*[\(]?)((?:http[s]?|file):\/\/[\/]?.+?\/[^:\)]*?)(?::\d+)(?::\d+)?/);
        if (matches && matches[1]) {
          url = matches[1];
        } else {
          matches = stack.match(/\)@((?:http[s]?|file):\/\/[\/]?.+?\/[^:\)]*?)(?::\d+)(?::\d+)?/);
          if (matches && matches[1]) {
            url = matches[1];
          }
        }
      }
      return url;
    };
    /**
   * Get the current script's URL by throwing an `Error` and analyzing it.
   *
   * @returns String or `undefined`
   * @private
   */
    var _getCurrentScriptUrlFromError = function() {
      var url, err;
      try {
        throw new _Error();
      } catch (e) {
        err = e;
      }
      if (err) {
        url = err.sourceURL || err.fileName || _getCurrentScriptUrlFromErrorStack(err.stack);
      }
      return url;
    };
    /**
   * Get the current script's URL.
   *
   * @returns String or `undefined`
   * @private
   */
    var _getCurrentScriptUrl = function() {
      var jsPath, scripts, i;
      if (_document.currentScript && (jsPath = _document.currentScript.src)) {
        return jsPath;
      }
      scripts = _document.getElementsByTagName("script");
      if (scripts.length === 1) {
        return scripts[0].src || undefined;
      }
      if ("readyState" in (scripts[0] || document.createElement("script"))) {
        for (i = scripts.length; i--; ) {
          if (scripts[i].readyState === "interactive" && (jsPath = scripts[i].src)) {
            return jsPath;
          }
        }
      }
      if (_document.readyState === "loading" && (jsPath = scripts[scripts.length - 1].src)) {
        return jsPath;
      }
      if (jsPath = _getCurrentScriptUrlFromError()) {
        return jsPath;
      }
      return undefined;
    };
    /**
   * Get the unanimous parent directory of ALL script tags.
   * If any script tags are either (a) inline or (b) from differing parent
   * directories, this method must return `undefined`.
   *
   * @returns String or `undefined`
   * @private
   */
    var _getUnanimousScriptParentDir = function() {
      var i, jsDir, jsPath, scripts = _document.getElementsByTagName("script");
      for (i = scripts.length; i--; ) {
        if (!(jsPath = scripts[i].src)) {
          jsDir = null;
          break;
        }
        jsPath = _getDirPathOfUrl(jsPath);
        if (jsDir == null) {
          jsDir = jsPath;
        } else if (jsDir !== jsPath) {
          jsDir = null;
          break;
        }
      }
      return jsDir || undefined;
    };
    /**
   * Get the presumed location of the "ZeroClipboard.swf" file, based on the location
   * of the executing JavaScript file (e.g. "ZeroClipboard.js", etc.).
   *
   * @returns String
   * @private
   */
    var _getDefaultSwfPath = function() {
      var jsDir = _getDirPathOfUrl(_getCurrentScriptUrl()) || _getUnanimousScriptParentDir() || "";
      return jsDir + "ZeroClipboard.swf";
    };
    /**
   * Is the client's operating system some version of Windows?
   *
   * @returns Boolean
   * @private
   */
    var _isWindows = function() {
      var isWindowsRegex = /win(dows|[\s]?(nt|me|ce|xp|vista|[\d]+))/i;
      return !!_navigator && (isWindowsRegex.test(_navigator.appVersion || "") || isWindowsRegex.test(_navigator.platform || "") || (_navigator.userAgent || "").indexOf("Windows") !== -1);
    };
    /**
   * Keep track of if the page is framed (in an `iframe`). This can never change.
   * @private
   */
    var _pageIsFramed = function() {
      return _window.opener == null && (!!_window.top && _window != _window.top || !!_window.parent && _window != _window.parent);
    }();
    /**
   * Keep track of if the page is XHTML (vs. HTML), which requires that everything
   * be rendering in XML mode.
   * @private
   */
    var _pageIsXhtml = _document.documentElement.nodeName === "html";
    /**
   * Keep track of the state of the Flash object.
   * @private
   */
    var _flashState = {
      bridge: null,
      version: "0.0.0",
      pluginType: "unknown",
      sandboxed: null,
      disabled: null,
      outdated: null,
      insecure: null,
      unavailable: null,
      degraded: null,
      deactivated: null,
      overdue: null,
      ready: null
    };
    /**
   * The minimum Flash Player version required to use ZeroClipboard completely.
   * @readonly
   * @private
   */
    var _minimumFlashVersion = "11.0.0";
    /**
   * The ZeroClipboard library version number, as reported by Flash, at the time the SWF was compiled.
   */
    var _zcSwfVersion;
    /**
   * Keep track of all event listener registrations.
   * @private
   */
    var _handlers = {};
    /**
   * Keep track of the currently activated element.
   * @private
   */
    var _currentElement;
    /**
   * Keep track of the element that was activated when a `copy` process started.
   * @private
   */
    var _copyTarget;
    /**
   * Keep track of data for the pending clipboard transaction.
   * @private
   */
    var _clipData = {};
    /**
   * Keep track of data formats for the pending clipboard transaction.
   * @private
   */
    var _clipDataFormatMap = null;
    /**
   * Keep track of the Flash availability check timeout.
   * @private
   */
    var _flashCheckTimeout = 0;
    /**
   * Keep track of SWF network errors interval polling.
   * @private
   */
    var _swfFallbackCheckInterval = 0;
    /**
   * The `message` store for events
   * @private
   */
    var _eventMessages = {
      ready: "Flash communication is established",
      error: {
        "flash-sandboxed": "Attempting to run Flash in a sandboxed iframe, which is impossible",
        "flash-disabled": "Flash is disabled or not installed. May also be attempting to run Flash in a sandboxed iframe, which is impossible.",
        "flash-outdated": "Flash is too outdated to support ZeroClipboard",
        "flash-insecure": "Flash will be unable to communicate due to a protocol mismatch between your `swfPath` configuration and the page",
        "flash-unavailable": "Flash is unable to communicate bidirectionally with JavaScript",
        "flash-degraded": "Flash is unable to preserve data fidelity when communicating with JavaScript",
        "flash-deactivated": "Flash is too outdated for your browser and/or is configured as click-to-activate.\nThis may also mean that the ZeroClipboard SWF object could not be loaded, so please check your `swfPath` configuration and/or network connectivity.\nMay also be attempting to run Flash in a sandboxed iframe, which is impossible.",
        "flash-overdue": "Flash communication was established but NOT within the acceptable time limit",
        "version-mismatch": "ZeroClipboard JS version number does not match ZeroClipboard SWF version number",
        "clipboard-error": "At least one error was thrown while ZeroClipboard was attempting to inject your data into the clipboard",
        "config-mismatch": "ZeroClipboard configuration does not match Flash's reality",
        "swf-not-found": "The ZeroClipboard SWF object could not be loaded, so please check your `swfPath` configuration and/or network connectivity",
        "browser-unsupported": "The browser does not support the required HTML DOM and JavaScript features"
      }
    };
    /**
   * The `name`s of `error` events that can only occur is Flash has at least
   * been able to load the SWF successfully.
   * @private
   */
    var _errorsThatOnlyOccurAfterFlashLoads = [ "flash-unavailable", "flash-degraded", "flash-overdue", "version-mismatch", "config-mismatch", "clipboard-error" ];
    /**
   * The `name`s of `error` events that should likely result in the `_flashState`
   * variable's property values being updated.
   * @private
   */
    var _flashStateErrorNames = [ "flash-sandboxed", "flash-disabled", "flash-outdated", "flash-insecure", "flash-unavailable", "flash-degraded", "flash-deactivated", "flash-overdue" ];
    /**
   * A RegExp to match the `name` property of `error` events related to Flash.
   * @private
   */
    var _flashStateErrorNameMatchingRegex = new RegExp("^flash-(" + _flashStateErrorNames.map(function(errorName) {
      return errorName.replace(/^flash-/, "");
    }).join("|") + ")$");
    /**
   * A RegExp to match the `name` property of `error` events related to Flash,
   * which is enabled.
   * @private
   */
    var _flashStateEnabledErrorNameMatchingRegex = new RegExp("^flash-(" + _flashStateErrorNames.filter(function(errorName) {
      return errorName !== "flash-disabled";
    }).map(function(errorName) {
      return errorName.replace(/^flash-/, "");
    }).join("|") + ")$");
    /**
   * ZeroClipboard configuration defaults for the Core module.
   * @private
   */
    var _globalConfig = {
      swfPath: _getDefaultSwfPath(),
      trustedDomains: _window.location.host ? [ _window.location.host ] : [],
      cacheBust: true,
      forceEnhancedClipboard: false,
      flashLoadTimeout: 3e4,
      autoActivate: true,
      bubbleEvents: true,
      fixLineEndings: true,
      containerId: "global-zeroclipboard-html-bridge",
      containerClass: "global-zeroclipboard-container",
      swfObjectId: "global-zeroclipboard-flash-bridge",
      hoverClass: false,
      activeClass: false,
      forceHandCursor: false,
      title: null,
      zIndex: 999999999
    };
    /**
   * The underlying implementation of `ZeroClipboard.config`.
   * @private
   */
    var _config = function(options) {
      if (typeof options === "object" && options && !("length" in options)) {
        _keys(options).forEach(function(prop) {
          if (/^(?:forceHandCursor|title|zIndex|bubbleEvents|fixLineEndings)$/.test(prop)) {
            _globalConfig[prop] = options[prop];
          } else if (_flashState.bridge == null) {
            if (prop === "containerId" || prop === "swfObjectId") {
              if (_isValidHtml4Id(options[prop])) {
                _globalConfig[prop] = options[prop];
              } else {
                throw new Error("The specified `" + prop + "` value is not valid as an HTML4 Element ID");
              }
            } else {
              _globalConfig[prop] = options[prop];
            }
          }
        });
      }
      if (typeof options === "string" && options) {
        if (_hasOwn.call(_globalConfig, options)) {
          return _globalConfig[options];
        }
        return;
      }
      return _deepCopy(_globalConfig);
    };
    /**
   * The underlying implementation of `ZeroClipboard.state`.
   * @private
   */
    var _state = function() {
      _detectSandbox();
      return {
        browser: _extend(_pick(_navigator, [ "userAgent", "platform", "appName", "appVersion" ]), {
          isSupported: _isBrowserSupported()
        }),
        flash: _omit(_flashState, [ "bridge" ]),
        zeroclipboard: {
          version: ZeroClipboard.version,
          config: ZeroClipboard.config()
        }
      };
    };
    /**
   * Does this browser support all of the necessary DOM and JS features necessary?
   * @private
   */
    var _isBrowserSupported = function() {
      return !!(_document.addEventListener && _window.Object.keys && _window.Array.prototype.map);
    };
    /**
   * The underlying implementation of `ZeroClipboard.isFlashUnusable`.
   * @private
   */
    var _isFlashUnusable = function() {
      return !!(_flashState.sandboxed || _flashState.disabled || _flashState.outdated || _flashState.unavailable || _flashState.degraded || _flashState.deactivated);
    };
    /**
   * The underlying implementation of `ZeroClipboard.on`.
   * @private
   */
    var _on = function(eventType, listener) {
      var i, len, events, added = {};
      if (typeof eventType === "string" && eventType) {
        events = eventType.toLowerCase().split(/\s+/);
      } else if (typeof eventType === "object" && eventType && !("length" in eventType) && typeof listener === "undefined") {
        _keys(eventType).forEach(function(key) {
          var listener = eventType[key];
          if (typeof listener === "function") {
            ZeroClipboard.on(key, listener);
          }
        });
      }
      if (events && events.length && listener) {
        for (i = 0, len = events.length; i < len; i++) {
          eventType = events[i].replace(/^on/, "");
          added[eventType] = true;
          if (!_handlers[eventType]) {
            _handlers[eventType] = [];
          }
          _handlers[eventType].push(listener);
        }
        if (added.ready && _flashState.ready) {
          ZeroClipboard.emit({
            type: "ready"
          });
        }
        if (added.error) {
          if (!_isBrowserSupported()) {
            ZeroClipboard.emit({
              type: "error",
              name: "browser-unsupported"
            });
          }
          for (i = 0, len = _flashStateErrorNames.length; i < len; i++) {
            if (_flashState[_flashStateErrorNames[i].replace(/^flash-/, "")] === true) {
              ZeroClipboard.emit({
                type: "error",
                name: _flashStateErrorNames[i]
              });
              break;
            }
          }
          if (_zcSwfVersion !== undefined && ZeroClipboard.version !== _zcSwfVersion) {
            ZeroClipboard.emit({
              type: "error",
              name: "version-mismatch",
              jsVersion: ZeroClipboard.version,
              swfVersion: _zcSwfVersion
            });
          }
        }
      }
      return ZeroClipboard;
    };
    /**
   * The underlying implementation of `ZeroClipboard.off`.
   * @private
   */
    var _off = function(eventType, listener) {
      var i, len, foundIndex, events, perEventHandlers;
      if (arguments.length === 0) {
        events = _keys(_handlers);
      } else if (typeof eventType === "string" && eventType) {
        events = eventType.toLowerCase().split(/\s+/);
      } else if (typeof eventType === "object" && eventType && !("length" in eventType) && typeof listener === "undefined") {
        _keys(eventType).forEach(function(key) {
          var listener = eventType[key];
          if (typeof listener === "function") {
            ZeroClipboard.off(key, listener);
          }
        });
      }
      if (events && events.length) {
        for (i = 0, len = events.length; i < len; i++) {
          eventType = events[i].replace(/^on/, "");
          perEventHandlers = _handlers[eventType];
          if (perEventHandlers && perEventHandlers.length) {
            if (listener) {
              foundIndex = perEventHandlers.indexOf(listener);
              while (foundIndex !== -1) {
                perEventHandlers.splice(foundIndex, 1);
                foundIndex = perEventHandlers.indexOf(listener, foundIndex);
              }
            } else {
              perEventHandlers.length = 0;
            }
          }
        }
      }
      return ZeroClipboard;
    };
    /**
   * The underlying implementation of `ZeroClipboard.handlers`.
   * @private
   */
    var _listeners = function(eventType) {
      var copy;
      if (typeof eventType === "string" && eventType) {
        copy = _deepCopy(_handlers[eventType]) || null;
      } else {
        copy = _deepCopy(_handlers);
      }
      return copy;
    };
    /**
   * The underlying implementation of `ZeroClipboard.emit`.
   * @private
   */
    var _emit = function(event) {
      var eventCopy, returnVal, tmp;
      event = _createEvent(event);
      if (!event) {
        return;
      }
      if (_preprocessEvent(event)) {
        return;
      }
      if (event.type === "ready" && _flashState.overdue === true) {
        return ZeroClipboard.emit({
          type: "error",
          name: "flash-overdue"
        });
      }
      eventCopy = _extend({}, event);
      _dispatchCallbacks.call(this, eventCopy);
      if (event.type === "copy") {
        tmp = _mapClipDataToFlash(_clipData);
        returnVal = tmp.data;
        _clipDataFormatMap = tmp.formatMap;
      }
      return returnVal;
    };
    /**
   * Get the protocol of the configured SWF path.
   * @private
   */
    var _getSwfPathProtocol = function() {
      var swfPath = _globalConfig.swfPath || "", swfPathFirstTwoChars = swfPath.slice(0, 2), swfProtocol = swfPath.slice(0, swfPath.indexOf("://") + 1);
      return swfPathFirstTwoChars === "\\\\" ? "file:" : swfPathFirstTwoChars === "//" || swfProtocol === "" ? _window.location.protocol : swfProtocol;
    };
    /**
   * The underlying implementation of `ZeroClipboard.create`.
   * @private
   */
    var _create = function() {
      var maxWait, swfProtocol, previousState = _flashState.sandboxed;
      if (!_isBrowserSupported()) {
        _flashState.ready = false;
        ZeroClipboard.emit({
          type: "error",
          name: "browser-unsupported"
        });
        return;
      }
      _detectSandbox();
      if (typeof _flashState.ready !== "boolean") {
        _flashState.ready = false;
      }
      if (_flashState.sandboxed !== previousState && _flashState.sandboxed === true) {
        _flashState.ready = false;
        ZeroClipboard.emit({
          type: "error",
          name: "flash-sandboxed"
        });
      } else if (!ZeroClipboard.isFlashUnusable() && _flashState.bridge === null) {
        swfProtocol = _getSwfPathProtocol();
        if (swfProtocol && swfProtocol !== _window.location.protocol) {
          ZeroClipboard.emit({
            type: "error",
            name: "flash-insecure"
          });
        } else {
          maxWait = _globalConfig.flashLoadTimeout;
          if (typeof maxWait === "number" && maxWait >= 0) {
            _flashCheckTimeout = _setTimeout(function() {
              if (typeof _flashState.deactivated !== "boolean") {
                _flashState.deactivated = true;
              }
              if (_flashState.deactivated === true) {
                ZeroClipboard.emit({
                  type: "error",
                  name: "flash-deactivated"
                });
              }
            }, maxWait);
          }
          _flashState.overdue = false;
          _embedSwf();
        }
      }
    };
    /**
   * The underlying implementation of `ZeroClipboard.destroy`.
   * @private
   */
    var _destroy = function() {
      ZeroClipboard.clearData();
      ZeroClipboard.blur();
      ZeroClipboard.emit("destroy");
      _unembedSwf();
      ZeroClipboard.off();
    };
    /**
   * The underlying implementation of `ZeroClipboard.setData`.
   * @private
   */
    var _setData = function(format, data) {
      var dataObj;
      if (typeof format === "object" && format && typeof data === "undefined") {
        dataObj = format;
        ZeroClipboard.clearData();
      } else if (typeof format === "string" && format) {
        dataObj = {};
        dataObj[format] = data;
      } else {
        return;
      }
      for (var dataFormat in dataObj) {
        if (typeof dataFormat === "string" && dataFormat && _hasOwn.call(dataObj, dataFormat) && typeof dataObj[dataFormat] === "string" && dataObj[dataFormat]) {
          _clipData[dataFormat] = _fixLineEndings(dataObj[dataFormat]);
        }
      }
    };
    /**
   * The underlying implementation of `ZeroClipboard.clearData`.
   * @private
   */
    var _clearData = function(format) {
      if (typeof format === "undefined") {
        _deleteOwnProperties(_clipData);
        _clipDataFormatMap = null;
      } else if (typeof format === "string" && _hasOwn.call(_clipData, format)) {
        delete _clipData[format];
      }
    };
    /**
   * The underlying implementation of `ZeroClipboard.getData`.
   * @private
   */
    var _getData = function(format) {
      if (typeof format === "undefined") {
        return _deepCopy(_clipData);
      } else if (typeof format === "string" && _hasOwn.call(_clipData, format)) {
        return _clipData[format];
      }
    };
    /**
   * The underlying implementation of `ZeroClipboard.focus`/`ZeroClipboard.activate`.
   * @private
   */
    var _focus = function(element) {
      if (!(element && element.nodeType === 1)) {
        return;
      }
      if (_currentElement) {
        _removeClass(_currentElement, _globalConfig.activeClass);
        if (_currentElement !== element) {
          _removeClass(_currentElement, _globalConfig.hoverClass);
        }
      }
      _currentElement = element;
      _addClass(element, _globalConfig.hoverClass);
      var newTitle = element.getAttribute("title") || _globalConfig.title;
      if (typeof newTitle === "string" && newTitle) {
        var htmlBridge = _getHtmlBridge(_flashState.bridge);
        if (htmlBridge) {
          htmlBridge.setAttribute("title", newTitle);
        }
      }
      var useHandCursor = _globalConfig.forceHandCursor === true || _getStyle(element, "cursor") === "pointer";
      _setHandCursor(useHandCursor);
      _reposition();
    };
    /**
   * The underlying implementation of `ZeroClipboard.blur`/`ZeroClipboard.deactivate`.
   * @private
   */
    var _blur = function() {
      var htmlBridge = _getHtmlBridge(_flashState.bridge);
      if (htmlBridge) {
        htmlBridge.removeAttribute("title");
        htmlBridge.style.left = "0px";
        htmlBridge.style.top = "-9999px";
        htmlBridge.style.width = "1px";
        htmlBridge.style.height = "1px";
      }
      if (_currentElement) {
        _removeClass(_currentElement, _globalConfig.hoverClass);
        _removeClass(_currentElement, _globalConfig.activeClass);
        _currentElement = null;
      }
    };
    /**
   * The underlying implementation of `ZeroClipboard.activeElement`.
   * @private
   */
    var _activeElement = function() {
      return _currentElement || null;
    };
    /**
   * Check if a value is a valid HTML4 `ID` or `Name` token.
   * @private
   */
    var _isValidHtml4Id = function(id) {
      return typeof id === "string" && id && /^[A-Za-z][A-Za-z0-9_:\-\.]*$/.test(id);
    };
    /**
   * Create or update an `event` object, based on the `eventType`.
   * @private
   */
    var _createEvent = function(event) {
      var eventType;
      if (typeof event === "string" && event) {
        eventType = event;
        event = {};
      } else if (typeof event === "object" && event && typeof event.type === "string" && event.type) {
        eventType = event.type;
      }
      if (!eventType) {
        return;
      }
      eventType = eventType.toLowerCase();
      if (!event.target && (/^(copy|aftercopy|_click)$/.test(eventType) || eventType === "error" && event.name === "clipboard-error")) {
        event.target = _copyTarget;
      }
      _extend(event, {
        type: eventType,
        target: event.target || _currentElement || null,
        relatedTarget: event.relatedTarget || null,
        currentTarget: _flashState && _flashState.bridge || null,
        timeStamp: event.timeStamp || _now() || null
      });
      var msg = _eventMessages[event.type];
      if (event.type === "error" && event.name && msg) {
        msg = msg[event.name];
      }
      if (msg) {
        event.message = msg;
      }
      if (event.type === "ready") {
        _extend(event, {
          target: null,
          version: _flashState.version
        });
      }
      if (event.type === "error") {
        if (_flashStateErrorNameMatchingRegex.test(event.name)) {
          _extend(event, {
            target: null,
            minimumVersion: _minimumFlashVersion
          });
        }
        if (_flashStateEnabledErrorNameMatchingRegex.test(event.name)) {
          _extend(event, {
            version: _flashState.version
          });
        }
        if (event.name === "flash-insecure") {
          _extend(event, {
            pageProtocol: _window.location.protocol,
            swfProtocol: _getSwfPathProtocol()
          });
        }
      }
      if (event.type === "copy") {
        event.clipboardData = {
          setData: ZeroClipboard.setData,
          clearData: ZeroClipboard.clearData
        };
      }
      if (event.type === "aftercopy") {
        event = _mapClipResultsFromFlash(event, _clipDataFormatMap);
      }
      if (event.target && !event.relatedTarget) {
        event.relatedTarget = _getRelatedTarget(event.target);
      }
      return _addMouseData(event);
    };
    /**
   * Get a relatedTarget from the target's `data-clipboard-target` attribute
   * @private
   */
    var _getRelatedTarget = function(targetEl) {
      var relatedTargetId = targetEl && targetEl.getAttribute && targetEl.getAttribute("data-clipboard-target");
      return relatedTargetId ? _document.getElementById(relatedTargetId) : null;
    };
    /**
   * Add element and position data to `MouseEvent` instances
   * @private
   */
    var _addMouseData = function(event) {
      if (event && /^_(?:click|mouse(?:over|out|down|up|move))$/.test(event.type)) {
        var srcElement = event.target;
        var fromElement = event.type === "_mouseover" && event.relatedTarget ? event.relatedTarget : undefined;
        var toElement = event.type === "_mouseout" && event.relatedTarget ? event.relatedTarget : undefined;
        var pos = _getElementPosition(srcElement);
        var screenLeft = _window.screenLeft || _window.screenX || 0;
        var screenTop = _window.screenTop || _window.screenY || 0;
        var scrollLeft = _document.body.scrollLeft + _document.documentElement.scrollLeft;
        var scrollTop = _document.body.scrollTop + _document.documentElement.scrollTop;
        var pageX = pos.left + (typeof event._stageX === "number" ? event._stageX : 0);
        var pageY = pos.top + (typeof event._stageY === "number" ? event._stageY : 0);
        var clientX = pageX - scrollLeft;
        var clientY = pageY - scrollTop;
        var screenX = screenLeft + clientX;
        var screenY = screenTop + clientY;
        var moveX = typeof event.movementX === "number" ? event.movementX : 0;
        var moveY = typeof event.movementY === "number" ? event.movementY : 0;
        delete event._stageX;
        delete event._stageY;
        _extend(event, {
          srcElement: srcElement,
          fromElement: fromElement,
          toElement: toElement,
          screenX: screenX,
          screenY: screenY,
          pageX: pageX,
          pageY: pageY,
          clientX: clientX,
          clientY: clientY,
          x: clientX,
          y: clientY,
          movementX: moveX,
          movementY: moveY,
          offsetX: 0,
          offsetY: 0,
          layerX: 0,
          layerY: 0
        });
      }
      return event;
    };
    /**
   * Determine if an event's registered handlers should be execute synchronously or asynchronously.
   *
   * @returns {boolean}
   * @private
   */
    var _shouldPerformAsync = function(event) {
      var eventType = event && typeof event.type === "string" && event.type || "";
      return !/^(?:(?:before)?copy|destroy)$/.test(eventType);
    };
    /**
   * Control if a callback should be executed asynchronously or not.
   *
   * @returns `undefined`
   * @private
   */
    var _dispatchCallback = function(func, context, args, async) {
      if (async) {
        _setTimeout(function() {
          func.apply(context, args);
        }, 0);
      } else {
        func.apply(context, args);
      }
    };
    /**
   * Handle the actual dispatching of events to client instances.
   *
   * @returns `undefined`
   * @private
   */
    var _dispatchCallbacks = function(event) {
      if (!(typeof event === "object" && event && event.type)) {
        return;
      }
      var async = _shouldPerformAsync(event);
      var wildcardTypeHandlers = _handlers["*"] || [];
      var specificTypeHandlers = _handlers[event.type] || [];
      var handlers = wildcardTypeHandlers.concat(specificTypeHandlers);
      if (handlers && handlers.length) {
        var i, len, func, context, eventCopy, originalContext = this;
        for (i = 0, len = handlers.length; i < len; i++) {
          func = handlers[i];
          context = originalContext;
          if (typeof func === "string" && typeof _window[func] === "function") {
            func = _window[func];
          }
          if (typeof func === "object" && func && typeof func.handleEvent === "function") {
            context = func;
            func = func.handleEvent;
          }
          if (typeof func === "function") {
            eventCopy = _extend({}, event);
            _dispatchCallback(func, context, [ eventCopy ], async);
          }
        }
      }
      return this;
    };
    /**
   * Check an `error` event's `name` property to see if Flash has
   * already loaded, which rules out possible `iframe` sandboxing.
   * @private
   */
    var _getSandboxStatusFromErrorEvent = function(event) {
      var isSandboxed = null;
      if (_pageIsFramed === false || event && event.type === "error" && event.name && _errorsThatOnlyOccurAfterFlashLoads.indexOf(event.name) !== -1) {
        isSandboxed = false;
      }
      return isSandboxed;
    };
    /**
   * Preprocess any special behaviors, reactions, or state changes after receiving this event.
   * Executes only once per event emitted, NOT once per client.
   * @private
   */
    var _preprocessEvent = function(event) {
      var element = event.target || _currentElement || null;
      var sourceIsSwf = event._source === "swf";
      delete event._source;
      switch (event.type) {
       case "error":
        var isSandboxed = event.name === "flash-sandboxed" || _getSandboxStatusFromErrorEvent(event);
        if (typeof isSandboxed === "boolean") {
          _flashState.sandboxed = isSandboxed;
        }
        if (event.name === "browser-unsupported") {
          _extend(_flashState, {
            disabled: false,
            outdated: false,
            unavailable: false,
            degraded: false,
            deactivated: false,
            overdue: false,
            ready: false
          });
        } else if (_flashStateErrorNames.indexOf(event.name) !== -1) {
          _extend(_flashState, {
            disabled: event.name === "flash-disabled",
            outdated: event.name === "flash-outdated",
            insecure: event.name === "flash-insecure",
            unavailable: event.name === "flash-unavailable",
            degraded: event.name === "flash-degraded",
            deactivated: event.name === "flash-deactivated",
            overdue: event.name === "flash-overdue",
            ready: false
          });
        } else if (event.name === "version-mismatch") {
          _zcSwfVersion = event.swfVersion;
          _extend(_flashState, {
            disabled: false,
            outdated: false,
            insecure: false,
            unavailable: false,
            degraded: false,
            deactivated: false,
            overdue: false,
            ready: false
          });
        }
        _clearTimeoutsAndPolling();
        break;
  
       case "ready":
        _zcSwfVersion = event.swfVersion;
        var wasDeactivated = _flashState.deactivated === true;
        _extend(_flashState, {
          sandboxed: false,
          disabled: false,
          outdated: false,
          insecure: false,
          unavailable: false,
          degraded: false,
          deactivated: false,
          overdue: wasDeactivated,
          ready: !wasDeactivated
        });
        _clearTimeoutsAndPolling();
        break;
  
       case "beforecopy":
        _copyTarget = element;
        break;
  
       case "copy":
        var textContent, htmlContent, targetEl = event.relatedTarget;
        if (!(_clipData["text/html"] || _clipData["text/plain"]) && targetEl && (htmlContent = targetEl.value || targetEl.outerHTML || targetEl.innerHTML) && (textContent = targetEl.value || targetEl.textContent || targetEl.innerText)) {
          event.clipboardData.clearData();
          event.clipboardData.setData("text/plain", textContent);
          if (htmlContent !== textContent) {
            event.clipboardData.setData("text/html", htmlContent);
          }
        } else if (!_clipData["text/plain"] && event.target && (textContent = event.target.getAttribute("data-clipboard-text"))) {
          event.clipboardData.clearData();
          event.clipboardData.setData("text/plain", textContent);
        }
        break;
  
       case "aftercopy":
        _queueEmitClipboardErrors(event);
        ZeroClipboard.clearData();
        if (element && element !== _safeActiveElement() && element.focus) {
          element.focus();
        }
        break;
  
       case "_mouseover":
        ZeroClipboard.focus(element);
        if (_globalConfig.bubbleEvents === true && sourceIsSwf) {
          if (element && element !== event.relatedTarget && !_containedBy(event.relatedTarget, element)) {
            _fireMouseEvent(_extend({}, event, {
              type: "mouseenter",
              bubbles: false,
              cancelable: false
            }));
          }
          _fireMouseEvent(_extend({}, event, {
            type: "mouseover"
          }));
        }
        break;
  
       case "_mouseout":
        ZeroClipboard.blur();
        if (_globalConfig.bubbleEvents === true && sourceIsSwf) {
          if (element && element !== event.relatedTarget && !_containedBy(event.relatedTarget, element)) {
            _fireMouseEvent(_extend({}, event, {
              type: "mouseleave",
              bubbles: false,
              cancelable: false
            }));
          }
          _fireMouseEvent(_extend({}, event, {
            type: "mouseout"
          }));
        }
        break;
  
       case "_mousedown":
        _addClass(element, _globalConfig.activeClass);
        if (_globalConfig.bubbleEvents === true && sourceIsSwf) {
          _fireMouseEvent(_extend({}, event, {
            type: event.type.slice(1)
          }));
        }
        break;
  
       case "_mouseup":
        _removeClass(element, _globalConfig.activeClass);
        if (_globalConfig.bubbleEvents === true && sourceIsSwf) {
          _fireMouseEvent(_extend({}, event, {
            type: event.type.slice(1)
          }));
        }
        break;
  
       case "_click":
        _copyTarget = null;
        if (_globalConfig.bubbleEvents === true && sourceIsSwf) {
          _fireMouseEvent(_extend({}, event, {
            type: event.type.slice(1)
          }));
        }
        break;
  
       case "_mousemove":
        if (_globalConfig.bubbleEvents === true && sourceIsSwf) {
          _fireMouseEvent(_extend({}, event, {
            type: event.type.slice(1)
          }));
        }
        break;
      }
      if (/^_(?:click|mouse(?:over|out|down|up|move))$/.test(event.type)) {
        return true;
      }
    };
    /**
   * Check an "aftercopy" event for clipboard errors and emit a corresponding "error" event.
   * @private
   */
    var _queueEmitClipboardErrors = function(aftercopyEvent) {
      if (aftercopyEvent.errors && aftercopyEvent.errors.length > 0) {
        var errorEvent = _deepCopy(aftercopyEvent);
        _extend(errorEvent, {
          type: "error",
          name: "clipboard-error"
        });
        delete errorEvent.success;
        _setTimeout(function() {
          ZeroClipboard.emit(errorEvent);
        }, 0);
      }
    };
    /**
   * Dispatch a synthetic MouseEvent.
   *
   * @returns `undefined`
   * @private
   */
    var _fireMouseEvent = function(event) {
      if (!(event && typeof event.type === "string" && event)) {
        return;
      }
      var e, target = event.target || null, doc = target && target.ownerDocument || _document, defaults = {
        view: doc.defaultView || _window,
        canBubble: true,
        cancelable: true,
        detail: event.type === "click" ? 1 : 0,
        button: typeof event.which === "number" ? event.which - 1 : typeof event.button === "number" ? event.button : doc.createEvent ? 0 : 1
      }, args = _extend(defaults, event);
      if (!target) {
        return;
      }
      if (doc.createEvent && target.dispatchEvent) {
        args = [ args.type, args.canBubble, args.cancelable, args.view, args.detail, args.screenX, args.screenY, args.clientX, args.clientY, args.ctrlKey, args.altKey, args.shiftKey, args.metaKey, args.button, args.relatedTarget ];
        e = doc.createEvent("MouseEvents");
        if (e.initMouseEvent) {
          e.initMouseEvent.apply(e, args);
          e._source = "js";
          target.dispatchEvent(e);
        }
      }
    };
    /**
   * Continuously poll the DOM until either:
   *  (a) the fallback content becomes visible, or
   *  (b) we receive an event from SWF (handled elsewhere)
   *
   * IMPORTANT:
   * This is NOT a necessary check but it can result in significantly faster
   * detection of bad `swfPath` configuration and/or network/server issues [in
   * supported browsers] than waiting for the entire `flashLoadTimeout` duration
   * to elapse before detecting that the SWF cannot be loaded. The detection
   * duration can be anywhere from 10-30 times faster [in supported browsers] by
   * using this approach.
   *
   * @returns `undefined`
   * @private
   */
    var _watchForSwfFallbackContent = function() {
      var maxWait = _globalConfig.flashLoadTimeout;
      if (typeof maxWait === "number" && maxWait >= 0) {
        var pollWait = Math.min(1e3, maxWait / 10);
        var fallbackContentId = _globalConfig.swfObjectId + "_fallbackContent";
        _swfFallbackCheckInterval = _setInterval(function() {
          var el = _document.getElementById(fallbackContentId);
          if (_isElementVisible(el)) {
            _clearTimeoutsAndPolling();
            _flashState.deactivated = null;
            ZeroClipboard.emit({
              type: "error",
              name: "swf-not-found"
            });
          }
        }, pollWait);
      }
    };
    /**
   * Create the HTML bridge element to embed the Flash object into.
   * @private
   */
    var _createHtmlBridge = function() {
      var container = _document.createElement("div");
      container.id = _globalConfig.containerId;
      container.className = _globalConfig.containerClass;
      container.style.position = "absolute";
      container.style.left = "0px";
      container.style.top = "-9999px";
      container.style.width = "1px";
      container.style.height = "1px";
      container.style.zIndex = "" + _getSafeZIndex(_globalConfig.zIndex);
      return container;
    };
    /**
   * Get the HTML element container that wraps the Flash bridge object/element.
   * @private
   */
    var _getHtmlBridge = function(flashBridge) {
      var htmlBridge = flashBridge && flashBridge.parentNode;
      while (htmlBridge && htmlBridge.nodeName === "OBJECT" && htmlBridge.parentNode) {
        htmlBridge = htmlBridge.parentNode;
      }
      return htmlBridge || null;
    };
    /**
   *
   * @private
   */
    var _escapeXmlValue = function(val) {
      if (typeof val !== "string" || !val) {
        return val;
      }
      return val.replace(/["&'<>]/g, function(chr) {
        switch (chr) {
         case '"':
          return "&quot;";
  
         case "&":
          return "&amp;";
  
         case "'":
          return "&apos;";
  
         case "<":
          return "&lt;";
  
         case ">":
          return "&gt;";
  
         default:
          return chr;
        }
      });
    };
    /**
   * Create the SWF object.
   *
   * @returns The SWF object reference.
   * @private
   */
    var _embedSwf = function() {
      var len, flashBridge = _flashState.bridge, container = _getHtmlBridge(flashBridge);
      if (!flashBridge) {
        var allowScriptAccess = _determineScriptAccess(_window.location.host, _globalConfig);
        var allowNetworking = allowScriptAccess === "never" ? "none" : "all";
        var flashvars = _vars(_extend({
          jsVersion: ZeroClipboard.version
        }, _globalConfig));
        var swfUrl = _globalConfig.swfPath + _cacheBust(_globalConfig.swfPath, _globalConfig);
        if (_pageIsXhtml) {
          swfUrl = _escapeXmlValue(swfUrl);
        }
        container = _createHtmlBridge();
        var divToBeReplaced = _document.createElement("div");
        container.appendChild(divToBeReplaced);
        _document.body.appendChild(container);
        var tmpDiv = _document.createElement("div");
        var usingActiveX = _flashState.pluginType === "activex";
        tmpDiv.innerHTML = '<object id="' + _globalConfig.swfObjectId + '" name="' + _globalConfig.swfObjectId + '" ' + 'width="100%" height="100%" ' + (usingActiveX ? 'classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"' : 'type="application/x-shockwave-flash" data="' + swfUrl + '"') + ">" + (usingActiveX ? '<param name="movie" value="' + swfUrl + '"/>' : "") + '<param name="allowScriptAccess" value="' + allowScriptAccess + '"/>' + '<param name="allowNetworking" value="' + allowNetworking + '"/>' + '<param name="menu" value="false"/>' + '<param name="wmode" value="transparent"/>' + '<param name="flashvars" value="' + flashvars + '"/>' + '<div id="' + _globalConfig.swfObjectId + '_fallbackContent">&nbsp;</div>' + "</object>";
        flashBridge = tmpDiv.firstChild;
        tmpDiv = null;
        _unwrap(flashBridge).ZeroClipboard = ZeroClipboard;
        container.replaceChild(flashBridge, divToBeReplaced);
        _watchForSwfFallbackContent();
      }
      if (!flashBridge) {
        flashBridge = _document[_globalConfig.swfObjectId];
        if (flashBridge && (len = flashBridge.length)) {
          flashBridge = flashBridge[len - 1];
        }
        if (!flashBridge && container) {
          flashBridge = container.firstChild;
        }
      }
      _flashState.bridge = flashBridge || null;
      return flashBridge;
    };
    /**
   * Destroy the SWF object.
   * @private
   */
    var _unembedSwf = function() {
      var flashBridge = _flashState.bridge;
      if (flashBridge) {
        var htmlBridge = _getHtmlBridge(flashBridge);
        if (htmlBridge) {
          if (_flashState.pluginType === "activex" && "readyState" in flashBridge) {
            flashBridge.style.display = "none";
            (function removeSwfFromIE() {
              if (flashBridge.readyState === 4) {
                for (var prop in flashBridge) {
                  if (typeof flashBridge[prop] === "function") {
                    flashBridge[prop] = null;
                  }
                }
                if (flashBridge.parentNode) {
                  flashBridge.parentNode.removeChild(flashBridge);
                }
                if (htmlBridge.parentNode) {
                  htmlBridge.parentNode.removeChild(htmlBridge);
                }
              } else {
                _setTimeout(removeSwfFromIE, 10);
              }
            })();
          } else {
            if (flashBridge.parentNode) {
              flashBridge.parentNode.removeChild(flashBridge);
            }
            if (htmlBridge.parentNode) {
              htmlBridge.parentNode.removeChild(htmlBridge);
            }
          }
        }
        _clearTimeoutsAndPolling();
        _flashState.ready = null;
        _flashState.bridge = null;
        _flashState.deactivated = null;
        _flashState.insecure = null;
        _zcSwfVersion = undefined;
      }
    };
    /**
   * Map the data format names of the "clipData" to Flash-friendly names.
   *
   * @returns A new transformed object.
   * @private
   */
    var _mapClipDataToFlash = function(clipData) {
      var newClipData = {}, formatMap = {};
      if (!(typeof clipData === "object" && clipData)) {
        return;
      }
      for (var dataFormat in clipData) {
        if (dataFormat && _hasOwn.call(clipData, dataFormat) && typeof clipData[dataFormat] === "string" && clipData[dataFormat]) {
          switch (dataFormat.toLowerCase()) {
           case "text/plain":
           case "text":
           case "air:text":
           case "flash:text":
            newClipData.text = clipData[dataFormat];
            formatMap.text = dataFormat;
            break;
  
           case "text/html":
           case "html":
           case "air:html":
           case "flash:html":
            newClipData.html = clipData[dataFormat];
            formatMap.html = dataFormat;
            break;
  
           case "application/rtf":
           case "text/rtf":
           case "rtf":
           case "richtext":
           case "air:rtf":
           case "flash:rtf":
            newClipData.rtf = clipData[dataFormat];
            formatMap.rtf = dataFormat;
            break;
  
           default:
            break;
          }
        }
      }
      return {
        data: newClipData,
        formatMap: formatMap
      };
    };
    /**
   * Map the data format names from Flash-friendly names back to their original "clipData" names (via a format mapping).
   *
   * @returns A new transformed object.
   * @private
   */
    var _mapClipResultsFromFlash = function(clipResults, formatMap) {
      if (!(typeof clipResults === "object" && clipResults && typeof formatMap === "object" && formatMap)) {
        return clipResults;
      }
      var newResults = {};
      for (var prop in clipResults) {
        if (_hasOwn.call(clipResults, prop)) {
          if (prop === "errors") {
            newResults[prop] = clipResults[prop] ? clipResults[prop].slice() : [];
            for (var i = 0, len = newResults[prop].length; i < len; i++) {
              newResults[prop][i].format = formatMap[newResults[prop][i].format];
            }
          } else if (prop !== "success" && prop !== "data") {
            newResults[prop] = clipResults[prop];
          } else {
            newResults[prop] = {};
            var tmpHash = clipResults[prop];
            for (var dataFormat in tmpHash) {
              if (dataFormat && _hasOwn.call(tmpHash, dataFormat) && _hasOwn.call(formatMap, dataFormat)) {
                newResults[prop][formatMap[dataFormat]] = tmpHash[dataFormat];
              }
            }
          }
        }
      }
      return newResults;
    };
    /**
   * Will look at a path, and will create a "?noCache={time}" or "&noCache={time}"
   * query param string to return. Does NOT append that string to the original path.
   * This is useful because ExternalInterface often breaks when a Flash SWF is cached.
   *
   * @returns The `noCache` query param with necessary "?"/"&" prefix.
   * @private
   */
    var _cacheBust = function(path, options) {
      var cacheBust = options == null || options && options.cacheBust === true;
      if (cacheBust) {
        return (path.indexOf("?") === -1 ? "?" : "&") + "noCache=" + _now();
      } else {
        return "";
      }
    };
    /**
   * Creates a query string for the FlashVars param.
   * Does NOT include the cache-busting query param.
   *
   * @returns FlashVars query string
   * @private
   */
    var _vars = function(options) {
      var i, len, domain, domains, str = "", trustedOriginsExpanded = [];
      if (options.trustedDomains) {
        if (typeof options.trustedDomains === "string") {
          domains = [ options.trustedDomains ];
        } else if (typeof options.trustedDomains === "object" && "length" in options.trustedDomains) {
          domains = options.trustedDomains;
        }
      }
      if (domains && domains.length) {
        for (i = 0, len = domains.length; i < len; i++) {
          if (_hasOwn.call(domains, i) && domains[i] && typeof domains[i] === "string") {
            domain = _extractDomain(domains[i]);
            if (!domain) {
              continue;
            }
            if (domain === "*") {
              trustedOriginsExpanded.length = 0;
              trustedOriginsExpanded.push(domain);
              break;
            }
            trustedOriginsExpanded.push.apply(trustedOriginsExpanded, [ domain, "//" + domain, _window.location.protocol + "//" + domain ]);
          }
        }
      }
      if (trustedOriginsExpanded.length) {
        str += "trustedOrigins=" + _encodeURIComponent(trustedOriginsExpanded.join(","));
      }
      if (options.forceEnhancedClipboard === true) {
        str += (str ? "&" : "") + "forceEnhancedClipboard=true";
      }
      if (typeof options.swfObjectId === "string" && options.swfObjectId) {
        str += (str ? "&" : "") + "swfObjectId=" + _encodeURIComponent(options.swfObjectId);
      }
      if (typeof options.jsVersion === "string" && options.jsVersion) {
        str += (str ? "&" : "") + "jsVersion=" + _encodeURIComponent(options.jsVersion);
      }
      return str;
    };
    /**
   * Extract the domain (e.g. "github.com") from an origin (e.g. "https://github.com") or
   * URL (e.g. "https://github.com/zeroclipboard/zeroclipboard/").
   *
   * @returns the domain
   * @private
   */
    var _extractDomain = function(originOrUrl) {
      if (originOrUrl == null || originOrUrl === "") {
        return null;
      }
      originOrUrl = originOrUrl.replace(/^\s+|\s+$/g, "");
      if (originOrUrl === "") {
        return null;
      }
      var protocolIndex = originOrUrl.indexOf("//");
      originOrUrl = protocolIndex === -1 ? originOrUrl : originOrUrl.slice(protocolIndex + 2);
      var pathIndex = originOrUrl.indexOf("/");
      originOrUrl = pathIndex === -1 ? originOrUrl : protocolIndex === -1 || pathIndex === 0 ? null : originOrUrl.slice(0, pathIndex);
      if (originOrUrl && originOrUrl.slice(-4).toLowerCase() === ".swf") {
        return null;
      }
      return originOrUrl || null;
    };
    /**
   * Set `allowScriptAccess` based on `trustedDomains` and `window.location.host` vs. `swfPath`.
   *
   * @returns The appropriate script access level.
   * @private
   */
    var _determineScriptAccess = function() {
      var _extractAllDomains = function(origins) {
        var i, len, tmp, resultsArray = [];
        if (typeof origins === "string") {
          origins = [ origins ];
        }
        if (!(typeof origins === "object" && origins && typeof origins.length === "number")) {
          return resultsArray;
        }
        for (i = 0, len = origins.length; i < len; i++) {
          if (_hasOwn.call(origins, i) && (tmp = _extractDomain(origins[i]))) {
            if (tmp === "*") {
              resultsArray.length = 0;
              resultsArray.push("*");
              break;
            }
            if (resultsArray.indexOf(tmp) === -1) {
              resultsArray.push(tmp);
            }
          }
        }
        return resultsArray;
      };
      return function(currentDomain, configOptions) {
        var swfDomain = _extractDomain(configOptions.swfPath);
        if (swfDomain === null) {
          swfDomain = currentDomain;
        }
        var trustedDomains = _extractAllDomains(configOptions.trustedDomains);
        var len = trustedDomains.length;
        if (len > 0) {
          if (len === 1 && trustedDomains[0] === "*") {
            return "always";
          }
          if (trustedDomains.indexOf(currentDomain) !== -1) {
            if (len === 1 && currentDomain === swfDomain) {
              return "sameDomain";
            }
            return "always";
          }
        }
        return "never";
      };
    }();
    /**
   * Get the currently active/focused DOM element.
   *
   * @returns the currently active/focused element, or `null`
   * @private
   */
    var _safeActiveElement = function() {
      try {
        return _document.activeElement;
      } catch (err) {
        return null;
      }
    };
    /**
   * Add a class to an element, if it doesn't already have it.
   *
   * @returns The element, with its new class added.
   * @private
   */
    var _addClass = function(element, value) {
      var c, cl, className, classNames = [];
      if (typeof value === "string" && value) {
        classNames = value.split(/\s+/);
      }
      if (element && element.nodeType === 1 && classNames.length > 0) {
        className = (" " + (element.className || "") + " ").replace(/[\t\r\n\f]/g, " ");
        for (c = 0, cl = classNames.length; c < cl; c++) {
          if (className.indexOf(" " + classNames[c] + " ") === -1) {
            className += classNames[c] + " ";
          }
        }
        className = className.replace(/^\s+|\s+$/g, "");
        if (className !== element.className) {
          element.className = className;
        }
      }
      return element;
    };
    /**
   * Remove a class from an element, if it has it.
   *
   * @returns The element, with its class removed.
   * @private
   */
    var _removeClass = function(element, value) {
      var c, cl, className, classNames = [];
      if (typeof value === "string" && value) {
        classNames = value.split(/\s+/);
      }
      if (element && element.nodeType === 1 && classNames.length > 0) {
        if (element.className) {
          className = (" " + element.className + " ").replace(/[\t\r\n\f]/g, " ");
          for (c = 0, cl = classNames.length; c < cl; c++) {
            className = className.replace(" " + classNames[c] + " ", " ");
          }
          className = className.replace(/^\s+|\s+$/g, "");
          if (className !== element.className) {
            element.className = className;
          }
        }
      }
      return element;
    };
    /**
   * Attempt to interpret the element's CSS styling. If `prop` is `"cursor"`,
   * then we assume that it should be a hand ("pointer") cursor if the element
   * is an anchor element ("a" tag).
   *
   * @returns The computed style property.
   * @private
   */
    var _getStyle = function(el, prop) {
      var value = _getComputedStyle(el, null).getPropertyValue(prop);
      if (prop === "cursor") {
        if (!value || value === "auto") {
          if (el.nodeName === "A") {
            return "pointer";
          }
        }
      }
      return value;
    };
    /**
   * Get the absolutely positioned coordinates of a DOM element.
   *
   * @returns Object containing the element's position, width, and height.
   * @private
   */
    var _getElementPosition = function(el) {
      var pos = {
        left: 0,
        top: 0,
        width: 0,
        height: 0
      };
      if (el.getBoundingClientRect) {
        var elRect = el.getBoundingClientRect();
        var pageXOffset = _window.pageXOffset;
        var pageYOffset = _window.pageYOffset;
        var leftBorderWidth = _document.documentElement.clientLeft || 0;
        var topBorderWidth = _document.documentElement.clientTop || 0;
        var leftBodyOffset = 0;
        var topBodyOffset = 0;
        if (_getStyle(_document.body, "position") === "relative") {
          var bodyRect = _document.body.getBoundingClientRect();
          var htmlRect = _document.documentElement.getBoundingClientRect();
          leftBodyOffset = bodyRect.left - htmlRect.left || 0;
          topBodyOffset = bodyRect.top - htmlRect.top || 0;
        }
        pos.left = elRect.left + pageXOffset - leftBorderWidth - leftBodyOffset;
        pos.top = elRect.top + pageYOffset - topBorderWidth - topBodyOffset;
        pos.width = "width" in elRect ? elRect.width : elRect.right - elRect.left;
        pos.height = "height" in elRect ? elRect.height : elRect.bottom - elRect.top;
      }
      return pos;
    };
    /**
   * Determine is an element is visible somewhere within the document (page).
   *
   * @returns Boolean
   * @private
   */
    var _isElementVisible = function(el) {
      if (!el) {
        return false;
      }
      var styles = _getComputedStyle(el, null);
      if (!styles) {
        return false;
      }
      var hasCssHeight = _parseFloat(styles.height) > 0;
      var hasCssWidth = _parseFloat(styles.width) > 0;
      var hasCssTop = _parseFloat(styles.top) >= 0;
      var hasCssLeft = _parseFloat(styles.left) >= 0;
      var cssKnows = hasCssHeight && hasCssWidth && hasCssTop && hasCssLeft;
      var rect = cssKnows ? null : _getElementPosition(el);
      var isVisible = styles.display !== "none" && styles.visibility !== "collapse" && (cssKnows || !!rect && (hasCssHeight || rect.height > 0) && (hasCssWidth || rect.width > 0) && (hasCssTop || rect.top >= 0) && (hasCssLeft || rect.left >= 0));
      return isVisible;
    };
    /**
   * Clear all existing timeouts and interval polling delegates.
   *
   * @returns `undefined`
   * @private
   */
    var _clearTimeoutsAndPolling = function() {
      _clearTimeout(_flashCheckTimeout);
      _flashCheckTimeout = 0;
      _clearInterval(_swfFallbackCheckInterval);
      _swfFallbackCheckInterval = 0;
    };
    /**
   * Reposition the Flash object to cover the currently activated element.
   *
   * @returns `undefined`
   * @private
   */
    var _reposition = function() {
      var htmlBridge;
      if (_currentElement && (htmlBridge = _getHtmlBridge(_flashState.bridge))) {
        var pos = _getElementPosition(_currentElement);
        _extend(htmlBridge.style, {
          width: pos.width + "px",
          height: pos.height + "px",
          top: pos.top + "px",
          left: pos.left + "px",
          zIndex: "" + _getSafeZIndex(_globalConfig.zIndex)
        });
      }
    };
    /**
   * Sends a signal to the Flash object to display the hand cursor if `true`.
   *
   * @returns `undefined`
   * @private
   */
    var _setHandCursor = function(enabled) {
      if (_flashState.ready === true) {
        if (_flashState.bridge && typeof _flashState.bridge.setHandCursor === "function") {
          _flashState.bridge.setHandCursor(enabled);
        } else {
          _flashState.ready = false;
        }
      }
    };
    /**
   * Get a safe value for `zIndex`
   *
   * @returns an integer, or "auto"
   * @private
   */
    var _getSafeZIndex = function(val) {
      if (/^(?:auto|inherit)$/.test(val)) {
        return val;
      }
      var zIndex;
      if (typeof val === "number" && !_isNaN(val)) {
        zIndex = val;
      } else if (typeof val === "string") {
        zIndex = _getSafeZIndex(_parseInt(val, 10));
      }
      return typeof zIndex === "number" ? zIndex : "auto";
    };
    /**
   * Ensure OS-compliant line endings, i.e. "\r\n" on Windows, "\n" elsewhere
   *
   * @returns string
   * @private
   */
    var _fixLineEndings = function(content) {
      var replaceRegex = /(\r\n|\r|\n)/g;
      if (typeof content === "string" && _globalConfig.fixLineEndings === true) {
        if (_isWindows()) {
          if (/((^|[^\r])\n|\r([^\n]|$))/.test(content)) {
            content = content.replace(replaceRegex, "\r\n");
          }
        } else if (/\r/.test(content)) {
          content = content.replace(replaceRegex, "\n");
        }
      }
      return content;
    };
    /**
   * Attempt to detect if ZeroClipboard is executing inside of a sandboxed iframe.
   * If it is, Flash Player cannot be used, so ZeroClipboard is dead in the water.
   *
   * @see {@link http://lists.w3.org/Archives/Public/public-whatwg-archive/2014Dec/0002.html}
   * @see {@link https://github.com/zeroclipboard/zeroclipboard/issues/511}
   * @see {@link http://zeroclipboard.org/test-iframes.html}
   *
   * @returns `true` (is sandboxed), `false` (is not sandboxed), or `null` (uncertain)
   * @private
   */
    var _detectSandbox = function(doNotReassessFlashSupport) {
      var effectiveScriptOrigin, frame, frameError, previousState = _flashState.sandboxed, isSandboxed = null;
      doNotReassessFlashSupport = doNotReassessFlashSupport === true;
      if (_pageIsFramed === false) {
        isSandboxed = false;
      } else {
        try {
          frame = window.frameElement || null;
        } catch (e) {
          frameError = {
            name: e.name,
            message: e.message
          };
        }
        if (frame && frame.nodeType === 1 && frame.nodeName === "IFRAME") {
          try {
            isSandboxed = frame.hasAttribute("sandbox");
          } catch (e) {
            isSandboxed = null;
          }
        } else {
          try {
            effectiveScriptOrigin = document.domain || null;
          } catch (e) {
            effectiveScriptOrigin = null;
          }
          if (effectiveScriptOrigin === null || frameError && frameError.name === "SecurityError" && /(^|[\s\(\[@])sandbox(es|ed|ing|[\s\.,!\)\]@]|$)/.test(frameError.message.toLowerCase())) {
            isSandboxed = true;
          }
        }
      }
      _flashState.sandboxed = isSandboxed;
      if (previousState !== isSandboxed && !doNotReassessFlashSupport) {
        _detectFlashSupport(_ActiveXObject);
      }
      return isSandboxed;
    };
    /**
   * Detect the Flash Player status, version, and plugin type.
   *
   * @see {@link https://code.google.com/p/doctype-mirror/wiki/ArticleDetectFlash#The_code}
   * @see {@link http://stackoverflow.com/questions/12866060/detecting-pepper-ppapi-flash-with-javascript}
   *
   * @returns `undefined`
   * @private
   */
    var _detectFlashSupport = function(ActiveXObject) {
      var plugin, ax, mimeType, hasFlash = false, isActiveX = false, isPPAPI = false, flashVersion = "";
      /**
     * Derived from Apple's suggested sniffer.
     * @param {String} desc e.g. "Shockwave Flash 7.0 r61"
     * @returns {String} "7.0.61"
     * @private
     */
      function parseFlashVersion(desc) {
        var matches = desc.match(/[\d]+/g);
        matches.length = 3;
        return matches.join(".");
      }
      function isPepperFlash(flashPlayerFileName) {
        return !!flashPlayerFileName && (flashPlayerFileName = flashPlayerFileName.toLowerCase()) && (/^(pepflashplayer\.dll|libpepflashplayer\.so|pepperflashplayer\.plugin)$/.test(flashPlayerFileName) || flashPlayerFileName.slice(-13) === "chrome.plugin");
      }
      function inspectPlugin(plugin) {
        if (plugin) {
          hasFlash = true;
          if (plugin.version) {
            flashVersion = parseFlashVersion(plugin.version);
          }
          if (!flashVersion && plugin.description) {
            flashVersion = parseFlashVersion(plugin.description);
          }
          if (plugin.filename) {
            isPPAPI = isPepperFlash(plugin.filename);
          }
        }
      }
      if (_navigator.plugins && _navigator.plugins.length) {
        plugin = _navigator.plugins["Shockwave Flash"];
        inspectPlugin(plugin);
        if (_navigator.plugins["Shockwave Flash 2.0"]) {
          hasFlash = true;
          flashVersion = "2.0.0.11";
        }
      } else if (_navigator.mimeTypes && _navigator.mimeTypes.length) {
        mimeType = _navigator.mimeTypes["application/x-shockwave-flash"];
        plugin = mimeType && mimeType.enabledPlugin;
        inspectPlugin(plugin);
      } else if (typeof ActiveXObject !== "undefined") {
        isActiveX = true;
        try {
          ax = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7");
          hasFlash = true;
          flashVersion = parseFlashVersion(ax.GetVariable("$version"));
        } catch (e1) {
          try {
            ax = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");
            hasFlash = true;
            flashVersion = "6.0.21";
          } catch (e2) {
            try {
              ax = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
              hasFlash = true;
              flashVersion = parseFlashVersion(ax.GetVariable("$version"));
            } catch (e3) {
              isActiveX = false;
            }
          }
        }
      }
      _flashState.disabled = hasFlash !== true;
      _flashState.outdated = flashVersion && _parseFloat(flashVersion) < _parseFloat(_minimumFlashVersion);
      _flashState.version = flashVersion || "0.0.0";
      _flashState.pluginType = isPPAPI ? "pepper" : isActiveX ? "activex" : hasFlash ? "netscape" : "unknown";
    };
    /**
   * Invoke the Flash detection algorithms immediately upon inclusion so we're not waiting later.
   */
    _detectFlashSupport(_ActiveXObject);
    /**
   * Always assess the `sandboxed` state of the page at important Flash-related moments.
   */
    _detectSandbox(true);
    /**
   * A shell constructor for `ZeroClipboard` client instances.
   *
   * @constructor
   */
    var ZeroClipboard = function() {
      if (!(this instanceof ZeroClipboard)) {
        return new ZeroClipboard();
      }
      if (typeof ZeroClipboard._createClient === "function") {
        ZeroClipboard._createClient.apply(this, _args(arguments));
      }
    };
    /**
   * The ZeroClipboard library's version number.
   *
   * @static
   * @readonly
   * @property {string}
   */
    ZeroClipboard.version = "2.4.0-beta.1";
    /**
   * Update or get a copy of the ZeroClipboard global configuration.
   * Returns a copy of the current/updated configuration.
   *
   * @returns Object
   * @static
   */
    ZeroClipboard.config = function() {
      return _config.apply(this, _args(arguments));
    };
    /**
   * Diagnostic method that describes the state of the browser, Flash Player, and ZeroClipboard.
   *
   * @returns Object
   * @static
   */
    ZeroClipboard.state = function() {
      return _state.apply(this, _args(arguments));
    };
    /**
   * Check if Flash is unusable for any reason: disabled, outdated, deactivated, etc.
   *
   * @returns Boolean
   * @static
   */
    ZeroClipboard.isFlashUnusable = function() {
      return _isFlashUnusable.apply(this, _args(arguments));
    };
    /**
   * Register an event listener.
   *
   * @returns `ZeroClipboard`
   * @static
   */
    ZeroClipboard.on = function() {
      return _on.apply(this, _args(arguments));
    };
    /**
   * Unregister an event listener.
   * If no `listener` function/object is provided, it will unregister all listeners for the provided `eventType`.
   * If no `eventType` is provided, it will unregister all listeners for every event type.
   *
   * @returns `ZeroClipboard`
   * @static
   */
    ZeroClipboard.off = function() {
      return _off.apply(this, _args(arguments));
    };
    /**
   * Retrieve event listeners for an `eventType`.
   * If no `eventType` is provided, it will retrieve all listeners for every event type.
   *
   * @returns array of listeners for the `eventType`; if no `eventType`, then a map/hash object of listeners for all event types; or `null`
   */
    ZeroClipboard.handlers = function() {
      return _listeners.apply(this, _args(arguments));
    };
    /**
   * Event emission receiver from the Flash object, forwarding to any registered JavaScript event listeners.
   *
   * @returns For the "copy" event, returns the Flash-friendly "clipData" object; otherwise `undefined`.
   * @static
   */
    ZeroClipboard.emit = function() {
      return _emit.apply(this, _args(arguments));
    };
    /**
   * Create and embed the Flash object.
   *
   * @returns The Flash object
   * @static
   */
    ZeroClipboard.create = function() {
      return _create.apply(this, _args(arguments));
    };
    /**
   * Self-destruct and clean up everything, including the embedded Flash object.
   *
   * @returns `undefined`
   * @static
   */
    ZeroClipboard.destroy = function() {
      return _destroy.apply(this, _args(arguments));
    };
    /**
   * Set the pending data for clipboard injection.
   *
   * @returns `undefined`
   * @static
   */
    ZeroClipboard.setData = function() {
      return _setData.apply(this, _args(arguments));
    };
    /**
   * Clear the pending data for clipboard injection.
   * If no `format` is provided, all pending data formats will be cleared.
   *
   * @returns `undefined`
   * @static
   */
    ZeroClipboard.clearData = function() {
      return _clearData.apply(this, _args(arguments));
    };
    /**
   * Get a copy of the pending data for clipboard injection.
   * If no `format` is provided, a copy of ALL pending data formats will be returned.
   *
   * @returns `String` or `Object`
   * @static
   */
    ZeroClipboard.getData = function() {
      return _getData.apply(this, _args(arguments));
    };
    /**
   * Sets the current HTML object that the Flash object should overlay. This will put the global
   * Flash object on top of the current element; depending on the setup, this may also set the
   * pending clipboard text data as well as the Flash object's wrapping element's title attribute
   * based on the underlying HTML element and ZeroClipboard configuration.
   *
   * @returns `undefined`
   * @static
   */
    ZeroClipboard.focus = ZeroClipboard.activate = function() {
      return _focus.apply(this, _args(arguments));
    };
    /**
   * Un-overlays the Flash object. This will put the global Flash object off-screen; depending on
   * the setup, this may also unset the Flash object's wrapping element's title attribute based on
   * the underlying HTML element and ZeroClipboard configuration.
   *
   * @returns `undefined`
   * @static
   */
    ZeroClipboard.blur = ZeroClipboard.deactivate = function() {
      return _blur.apply(this, _args(arguments));
    };
    /**
   * Returns the currently focused/"activated" HTML element that the Flash object is wrapping.
   *
   * @returns `HTMLElement` or `null`
   * @static
   */
    ZeroClipboard.activeElement = function() {
      return _activeElement.apply(this, _args(arguments));
    };
    /**
   * Keep track of the ZeroClipboard client instance counter.
   */
    var _clientIdCounter = 0;
    /**
   * Keep track of the state of the client instances.
   *
   * Entry structure:
   *   _clientMeta[client.id] = {
   *     instance: client,
   *     elements: [],
   *     handlers: {},
   *     coreWildcardHandler: function(event) { return client.emit(event); }
   *   };
   */
    var _clientMeta = {};
    /**
   * Keep track of the ZeroClipboard clipped elements counter.
   */
    var _elementIdCounter = 0;
    /**
   * Keep track of the state of the clipped element relationships to clients.
   *
   * Entry structure:
   *   _elementMeta[element.zcClippingId] = [client1.id, client2.id];
   */
    var _elementMeta = {};
    /**
   * Keep track of the state of the mouse event handlers for clipped elements.
   *
   * Entry structure:
   *   _mouseHandlers[element.zcClippingId] = {
   *     mouseover:  function(event) {},
   *     mouseout:   function(event) {},
   *     mouseenter: function(event) {},
   *     mouseleave: function(event) {},
   *     mousemove:  function(event) {}
   *   };
   */
    var _mouseHandlers = {};
    /**
   * Extending the ZeroClipboard configuration defaults for the Client module.
   */
    _extend(_globalConfig, {
      autoActivate: true
    });
    /**
   * The real constructor for `ZeroClipboard` client instances.
   * @private
   */
    var _clientConstructor = function(elements) {
      var meta, client = this;
      client.id = "" + _clientIdCounter++;
      meta = {
        instance: client,
        elements: [],
        handlers: {},
        coreWildcardHandler: function(event) {
          return client.emit(event);
        }
      };
      _clientMeta[client.id] = meta;
      if (elements) {
        client.clip(elements);
      }
      ZeroClipboard.on("*", meta.coreWildcardHandler);
      ZeroClipboard.on("destroy", function() {
        client.destroy();
      });
      ZeroClipboard.create();
    };
    /**
   * The underlying implementation of `ZeroClipboard.Client.prototype.on`.
   * @private
   */
    var _clientOn = function(eventType, listener) {
      var i, len, events, added = {}, client = this, meta = _clientMeta[client.id], handlers = meta && meta.handlers;
      if (!meta) {
        throw new Error("Attempted to add new listener(s) to a destroyed ZeroClipboard client instance");
      }
      if (typeof eventType === "string" && eventType) {
        events = eventType.toLowerCase().split(/\s+/);
      } else if (typeof eventType === "object" && eventType && !("length" in eventType) && typeof listener === "undefined") {
        _keys(eventType).forEach(function(key) {
          var listener = eventType[key];
          if (typeof listener === "function") {
            client.on(key, listener);
          }
        });
      }
      if (events && events.length && listener) {
        for (i = 0, len = events.length; i < len; i++) {
          eventType = events[i].replace(/^on/, "");
          added[eventType] = true;
          if (!handlers[eventType]) {
            handlers[eventType] = [];
          }
          handlers[eventType].push(listener);
        }
        if (added.ready && _flashState.ready) {
          this.emit({
            type: "ready",
            client: this
          });
        }
        if (added.error) {
          for (i = 0, len = _flashStateErrorNames.length; i < len; i++) {
            if (_flashState[_flashStateErrorNames[i].replace(/^flash-/, "")]) {
              this.emit({
                type: "error",
                name: _flashStateErrorNames[i],
                client: this
              });
              break;
            }
          }
          if (_zcSwfVersion !== undefined && ZeroClipboard.version !== _zcSwfVersion) {
            this.emit({
              type: "error",
              name: "version-mismatch",
              jsVersion: ZeroClipboard.version,
              swfVersion: _zcSwfVersion
            });
          }
        }
      }
      return client;
    };
    /**
   * The underlying implementation of `ZeroClipboard.Client.prototype.off`.
   * @private
   */
    var _clientOff = function(eventType, listener) {
      var i, len, foundIndex, events, perEventHandlers, client = this, meta = _clientMeta[client.id], handlers = meta && meta.handlers;
      if (!handlers) {
        return client;
      }
      if (arguments.length === 0) {
        events = _keys(handlers);
      } else if (typeof eventType === "string" && eventType) {
        events = eventType.split(/\s+/);
      } else if (typeof eventType === "object" && eventType && !("length" in eventType) && typeof listener === "undefined") {
        _keys(eventType).forEach(function(key) {
          var listener = eventType[key];
          if (typeof listener === "function") {
            client.off(key, listener);
          }
        });
      }
      if (events && events.length) {
        for (i = 0, len = events.length; i < len; i++) {
          eventType = events[i].toLowerCase().replace(/^on/, "");
          perEventHandlers = handlers[eventType];
          if (perEventHandlers && perEventHandlers.length) {
            if (listener) {
              foundIndex = perEventHandlers.indexOf(listener);
              while (foundIndex !== -1) {
                perEventHandlers.splice(foundIndex, 1);
                foundIndex = perEventHandlers.indexOf(listener, foundIndex);
              }
            } else {
              perEventHandlers.length = 0;
            }
          }
        }
      }
      return client;
    };
    /**
   * The underlying implementation of `ZeroClipboard.Client.prototype.handlers`.
   * @private
   */
    var _clientListeners = function(eventType) {
      var copy = null, handlers = _clientMeta[this.id] && _clientMeta[this.id].handlers;
      if (handlers) {
        if (typeof eventType === "string" && eventType) {
          copy = handlers[eventType] ? handlers[eventType].slice(0) : [];
        } else {
          copy = _deepCopy(handlers);
        }
      }
      return copy;
    };
    /**
   * The underlying implementation of `ZeroClipboard.Client.prototype.emit`.
   * @private
   */
    var _clientEmit = function(event) {
      var eventCopy, client = this;
      if (_clientShouldEmit.call(client, event)) {
        if (typeof event === "object" && event && typeof event.type === "string" && event.type) {
          event = _extend({}, event);
        }
        eventCopy = _extend({}, _createEvent(event), {
          client: client
        });
        _clientDispatchCallbacks.call(client, eventCopy);
      }
      return client;
    };
    /**
   * The underlying implementation of `ZeroClipboard.Client.prototype.clip`.
   * @private
   */
    var _clientClip = function(elements) {
      if (!_clientMeta[this.id]) {
        throw new Error("Attempted to clip element(s) to a destroyed ZeroClipboard client instance");
      }
      elements = _prepClip(elements);
      for (var i = 0; i < elements.length; i++) {
        if (_hasOwn.call(elements, i) && elements[i] && elements[i].nodeType === 1) {
          if (!elements[i].zcClippingId) {
            elements[i].zcClippingId = "zcClippingId_" + _elementIdCounter++;
            _elementMeta[elements[i].zcClippingId] = [ this.id ];
            if (_globalConfig.autoActivate === true) {
              _addMouseHandlers(elements[i]);
            }
          } else if (_elementMeta[elements[i].zcClippingId].indexOf(this.id) === -1) {
            _elementMeta[elements[i].zcClippingId].push(this.id);
          }
          var clippedElements = _clientMeta[this.id] && _clientMeta[this.id].elements;
          if (clippedElements.indexOf(elements[i]) === -1) {
            clippedElements.push(elements[i]);
          }
        }
      }
      return this;
    };
    /**
   * The underlying implementation of `ZeroClipboard.Client.prototype.unclip`.
   * @private
   */
    var _clientUnclip = function(elements) {
      var meta = _clientMeta[this.id];
      if (!meta) {
        return this;
      }
      var clippedElements = meta.elements;
      var arrayIndex;
      if (typeof elements === "undefined") {
        elements = clippedElements.slice(0);
      } else {
        elements = _prepClip(elements);
      }
      for (var i = elements.length; i--; ) {
        if (_hasOwn.call(elements, i) && elements[i] && elements[i].nodeType === 1) {
          arrayIndex = 0;
          while ((arrayIndex = clippedElements.indexOf(elements[i], arrayIndex)) !== -1) {
            clippedElements.splice(arrayIndex, 1);
          }
          var clientIds = _elementMeta[elements[i].zcClippingId];
          if (clientIds) {
            arrayIndex = 0;
            while ((arrayIndex = clientIds.indexOf(this.id, arrayIndex)) !== -1) {
              clientIds.splice(arrayIndex, 1);
            }
            if (clientIds.length === 0) {
              if (_globalConfig.autoActivate === true) {
                _removeMouseHandlers(elements[i]);
              }
              delete elements[i].zcClippingId;
            }
          }
        }
      }
      return this;
    };
    /**
   * The underlying implementation of `ZeroClipboard.Client.prototype.elements`.
   * @private
   */
    var _clientElements = function() {
      var meta = _clientMeta[this.id];
      return meta && meta.elements ? meta.elements.slice(0) : [];
    };
    /**
   * The underlying implementation of `ZeroClipboard.Client.prototype.destroy`.
   * @private
   */
    var _clientDestroy = function() {
      var meta = _clientMeta[this.id];
      if (!meta) {
        return;
      }
      this.unclip();
      this.off();
      ZeroClipboard.off("*", meta.coreWildcardHandler);
      delete _clientMeta[this.id];
    };
    /**
   * Inspect an Event to see if the Client (`this`) should honor it for emission.
   * @private
   */
    var _clientShouldEmit = function(event) {
      if (!(event && event.type)) {
        return false;
      }
      if (event.client && event.client !== this) {
        return false;
      }
      var meta = _clientMeta[this.id];
      var clippedEls = meta && meta.elements;
      var hasClippedEls = !!clippedEls && clippedEls.length > 0;
      var goodTarget = !event.target || hasClippedEls && clippedEls.indexOf(event.target) !== -1;
      var goodRelTarget = event.relatedTarget && hasClippedEls && clippedEls.indexOf(event.relatedTarget) !== -1;
      var goodClient = event.client && event.client === this;
      if (!meta || !(goodTarget || goodRelTarget || goodClient)) {
        return false;
      }
      return true;
    };
    /**
   * Handle the actual dispatching of events to a client instance.
   *
   * @returns `undefined`
   * @private
   */
    var _clientDispatchCallbacks = function(event) {
      var meta = _clientMeta[this.id];
      if (!(typeof event === "object" && event && event.type && meta)) {
        return;
      }
      var async = _shouldPerformAsync(event);
      var wildcardTypeHandlers = meta && meta.handlers["*"] || [];
      var specificTypeHandlers = meta && meta.handlers[event.type] || [];
      var handlers = wildcardTypeHandlers.concat(specificTypeHandlers);
      if (handlers && handlers.length) {
        var i, len, func, context, eventCopy, originalContext = this;
        for (i = 0, len = handlers.length; i < len; i++) {
          func = handlers[i];
          context = originalContext;
          if (typeof func === "string" && typeof _window[func] === "function") {
            func = _window[func];
          }
          if (typeof func === "object" && func && typeof func.handleEvent === "function") {
            context = func;
            func = func.handleEvent;
          }
          if (typeof func === "function") {
            eventCopy = _extend({}, event);
            _dispatchCallback(func, context, [ eventCopy ], async);
          }
        }
      }
    };
    /**
   * Prepares the elements for clipping/unclipping.
   *
   * @returns An Array of elements.
   * @private
   */
    var _prepClip = function(elements) {
      if (typeof elements === "string") {
        elements = [];
      }
      return typeof elements.length !== "number" ? [ elements ] : elements;
    };
    /**
   * Add a `mouseover` handler function for a clipped element.
   *
   * @returns `undefined`
   * @private
   */
    var _addMouseHandlers = function(element) {
      if (!(element && element.nodeType === 1)) {
        return;
      }
      var _suppressMouseEvents = function(event) {
        if (!(event || (event = _window.event))) {
          return;
        }
        if (event._source !== "js") {
          event.stopImmediatePropagation();
          event.preventDefault();
        }
        delete event._source;
      };
      var _elementMouseOver = function(event) {
        if (!(event || (event = _window.event))) {
          return;
        }
        _suppressMouseEvents(event);
        ZeroClipboard.focus(element);
      };
      element.addEventListener("mouseover", _elementMouseOver, false);
      element.addEventListener("mouseout", _suppressMouseEvents, false);
      element.addEventListener("mouseenter", _suppressMouseEvents, false);
      element.addEventListener("mouseleave", _suppressMouseEvents, false);
      element.addEventListener("mousemove", _suppressMouseEvents, false);
      _mouseHandlers[element.zcClippingId] = {
        mouseover: _elementMouseOver,
        mouseout: _suppressMouseEvents,
        mouseenter: _suppressMouseEvents,
        mouseleave: _suppressMouseEvents,
        mousemove: _suppressMouseEvents
      };
    };
    /**
   * Remove a `mouseover` handler function for a clipped element.
   *
   * @returns `undefined`
   * @private
   */
    var _removeMouseHandlers = function(element) {
      if (!(element && element.nodeType === 1)) {
        return;
      }
      var mouseHandlers = _mouseHandlers[element.zcClippingId];
      if (!(typeof mouseHandlers === "object" && mouseHandlers)) {
        return;
      }
      var key, val, mouseEvents = [ "move", "leave", "enter", "out", "over" ];
      for (var i = 0, len = mouseEvents.length; i < len; i++) {
        key = "mouse" + mouseEvents[i];
        val = mouseHandlers[key];
        if (typeof val === "function") {
          element.removeEventListener(key, val, false);
        }
      }
      delete _mouseHandlers[element.zcClippingId];
    };
    /**
   * Creates a new ZeroClipboard client instance.
   * Optionally, auto-`clip` an element or collection of elements.
   *
   * @constructor
   */
    ZeroClipboard._createClient = function() {
      _clientConstructor.apply(this, _args(arguments));
    };
    /**
   * Register an event listener to the client.
   *
   * @returns `this`
   */
    ZeroClipboard.prototype.on = function() {
      return _clientOn.apply(this, _args(arguments));
    };
    /**
   * Unregister an event handler from the client.
   * If no `listener` function/object is provided, it will unregister all handlers for the provided `eventType`.
   * If no `eventType` is provided, it will unregister all handlers for every event type.
   *
   * @returns `this`
   */
    ZeroClipboard.prototype.off = function() {
      return _clientOff.apply(this, _args(arguments));
    };
    /**
   * Retrieve event listeners for an `eventType` from the client.
   * If no `eventType` is provided, it will retrieve all listeners for every event type.
   *
   * @returns array of listeners for the `eventType`; if no `eventType`, then a map/hash object of listeners for all event types; or `null`
   */
    ZeroClipboard.prototype.handlers = function() {
      return _clientListeners.apply(this, _args(arguments));
    };
    /**
   * Event emission receiver from the Flash object for this client's registered JavaScript event listeners.
   *
   * @returns For the "copy" event, returns the Flash-friendly "clipData" object; otherwise `undefined`.
   */
    ZeroClipboard.prototype.emit = function() {
      return _clientEmit.apply(this, _args(arguments));
    };
    /**
   * Register clipboard actions for new element(s) to the client.
   *
   * @returns `this`
   */
    ZeroClipboard.prototype.clip = function() {
      return _clientClip.apply(this, _args(arguments));
    };
    /**
   * Unregister the clipboard actions of previously registered element(s) on the page.
   * If no elements are provided, ALL registered elements will be unregistered.
   *
   * @returns `this`
   */
    ZeroClipboard.prototype.unclip = function() {
      return _clientUnclip.apply(this, _args(arguments));
    };
    /**
   * Get all of the elements to which this client is clipped.
   *
   * @returns array of clipped elements
   */
    ZeroClipboard.prototype.elements = function() {
      return _clientElements.apply(this, _args(arguments));
    };
    /**
   * Self-destruct and clean up everything for a single client.
   * This will NOT destroy the embedded Flash object.
   *
   * @returns `undefined`
   */
    ZeroClipboard.prototype.destroy = function() {
      return _clientDestroy.apply(this, _args(arguments));
    };
    /**
   * Stores the pending plain text to inject into the clipboard.
   *
   * @returns `this`
   */
    ZeroClipboard.prototype.setText = function(text) {
      if (!_clientMeta[this.id]) {
        throw new Error("Attempted to set pending clipboard data from a destroyed ZeroClipboard client instance");
      }
      ZeroClipboard.setData("text/plain", text);
      return this;
    };
    /**
   * Stores the pending HTML text to inject into the clipboard.
   *
   * @returns `this`
   */
    ZeroClipboard.prototype.setHtml = function(html) {
      if (!_clientMeta[this.id]) {
        throw new Error("Attempted to set pending clipboard data from a destroyed ZeroClipboard client instance");
      }
      ZeroClipboard.setData("text/html", html);
      return this;
    };
    /**
   * Stores the pending rich text (RTF) to inject into the clipboard.
   *
   * @returns `this`
   */
    ZeroClipboard.prototype.setRichText = function(richText) {
      if (!_clientMeta[this.id]) {
        throw new Error("Attempted to set pending clipboard data from a destroyed ZeroClipboard client instance");
      }
      ZeroClipboard.setData("application/rtf", richText);
      return this;
    };
    /**
   * Stores the pending data to inject into the clipboard.
   *
   * @returns `this`
   */
    ZeroClipboard.prototype.setData = function() {
      if (!_clientMeta[this.id]) {
        throw new Error("Attempted to set pending clipboard data from a destroyed ZeroClipboard client instance");
      }
      ZeroClipboard.setData.apply(this, _args(arguments));
      return this;
    };
    /**
   * Clears the pending data to inject into the clipboard.
   * If no `format` is provided, all pending data formats will be cleared.
   *
   * @returns `this`
   */
    ZeroClipboard.prototype.clearData = function() {
      if (!_clientMeta[this.id]) {
        throw new Error("Attempted to clear pending clipboard data from a destroyed ZeroClipboard client instance");
      }
      ZeroClipboard.clearData.apply(this, _args(arguments));
      return this;
    };
    /**
   * Gets a copy of the pending data to inject into the clipboard.
   * If no `format` is provided, a copy of ALL pending data formats will be returned.
   *
   * @returns `String` or `Object`
   */
    ZeroClipboard.prototype.getData = function() {
      if (!_clientMeta[this.id]) {
        throw new Error("Attempted to get pending clipboard data from a destroyed ZeroClipboard client instance");
      }
      return ZeroClipboard.getData.apply(this, _args(arguments));
    };
    if (typeof define === "function" && define.amd) {
      define(function() {
        return ZeroClipboard;
      });
    } else if (typeof module === "object" && module && typeof module.exports === "object" && module.exports) {
      module.exports = ZeroClipboard;
    } else {
      window.ZeroClipboard = ZeroClipboard;
    }
  })(function() {
    return this || window;
  }());
  
  /*!
   * clipboard.js v1.6.1
   * https://zenorocha.github.io/clipboard.js
   *
   * Licensed MIT © Zeno Rocha
   */
  (function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Clipboard = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
  var DOCUMENT_NODE_TYPE = 9;
  
  /**
   * A polyfill for Element.matches()
   */
  if (typeof Element !== 'undefined' && !Element.prototype.matches) {
      var proto = Element.prototype;
  
      proto.matches = proto.matchesSelector ||
                      proto.mozMatchesSelector ||
                      proto.msMatchesSelector ||
                      proto.oMatchesSelector ||
                      proto.webkitMatchesSelector;
  }
  
  /**
   * Finds the closest parent that matches a selector.
   *
   * @param {Element} element
   * @param {String} selector
   * @return {Function}
   */
  function closest (element, selector) {
      while (element && element.nodeType !== DOCUMENT_NODE_TYPE) {
          if (element.matches(selector)) return element;
          element = element.parentNode;
      }
  }
  
  module.exports = closest;
  
  },{}],2:[function(require,module,exports){
  var closest = require('./closest');
  
  /**
   * Delegates event to a selector.
   *
   * @param {Element} element
   * @param {String} selector
   * @param {String} type
   * @param {Function} callback
   * @param {Boolean} useCapture
   * @return {Object}
   */
  function delegate(element, selector, type, callback, useCapture) {
      var listenerFn = listener.apply(this, arguments);
  
      element.addEventListener(type, listenerFn, useCapture);
  
      return {
          destroy: function() {
              element.removeEventListener(type, listenerFn, useCapture);
          }
      }
  }
  
  /**
   * Finds closest match and invokes callback.
   *
   * @param {Element} element
   * @param {String} selector
   * @param {String} type
   * @param {Function} callback
   * @return {Function}
   */
  function listener(element, selector, type, callback) {
      return function(e) {
          e.delegateTarget = closest(e.target, selector);
  
          if (e.delegateTarget) {
              callback.call(element, e);
          }
      }
  }
  
  module.exports = delegate;
  
  },{"./closest":1}],3:[function(require,module,exports){
  /**
   * Check if argument is a HTML element.
   *
   * @param {Object} value
   * @return {Boolean}
   */
  exports.node = function(value) {
      return value !== undefined
          && value instanceof HTMLElement
          && value.nodeType === 1;
  };
  
  /**
   * Check if argument is a list of HTML elements.
   *
   * @param {Object} value
   * @return {Boolean}
   */
  exports.nodeList = function(value) {
      var type = Object.prototype.toString.call(value);
  
      return value !== undefined
          && (type === '[object NodeList]' || type === '[object HTMLCollection]')
          && ('length' in value)
          && (value.length === 0 || exports.node(value[0]));
  };
  
  /**
   * Check if argument is a string.
   *
   * @param {Object} value
   * @return {Boolean}
   */
  exports.string = function(value) {
      return typeof value === 'string'
          || value instanceof String;
  };
  
  /**
   * Check if argument is a function.
   *
   * @param {Object} value
   * @return {Boolean}
   */
  exports.fn = function(value) {
      var type = Object.prototype.toString.call(value);
  
      return type === '[object Function]';
  };
  
  },{}],4:[function(require,module,exports){
  var is = require('./is');
  var delegate = require('delegate');
  
  /**
   * Validates all params and calls the right
   * listener function based on its target type.
   *
   * @param {String|HTMLElement|HTMLCollection|NodeList} target
   * @param {String} type
   * @param {Function} callback
   * @return {Object}
   */
  function listen(target, type, callback) {
      if (!target && !type && !callback) {
          throw new Error('Missing required arguments');
      }
  
      if (!is.string(type)) {
          throw new TypeError('Second argument must be a String');
      }
  
      if (!is.fn(callback)) {
          throw new TypeError('Third argument must be a Function');
      }
  
      if (is.node(target)) {
          return listenNode(target, type, callback);
      }
      else if (is.nodeList(target)) {
          return listenNodeList(target, type, callback);
      }
      else if (is.string(target)) {
          return listenSelector(target, type, callback);
      }
      else {
          throw new TypeError('First argument must be a String, HTMLElement, HTMLCollection, or NodeList');
      }
  }
  
  /**
   * Adds an event listener to a HTML element
   * and returns a remove listener function.
   *
   * @param {HTMLElement} node
   * @param {String} type
   * @param {Function} callback
   * @return {Object}
   */
  function listenNode(node, type, callback) {
      node.addEventListener(type, callback);
  
      return {
          destroy: function() {
              node.removeEventListener(type, callback);
          }
      }
  }
  
  /**
   * Add an event listener to a list of HTML elements
   * and returns a remove listener function.
   *
   * @param {NodeList|HTMLCollection} nodeList
   * @param {String} type
   * @param {Function} callback
   * @return {Object}
   */
  function listenNodeList(nodeList, type, callback) {
      Array.prototype.forEach.call(nodeList, function(node) {
          node.addEventListener(type, callback);
      });
  
      return {
          destroy: function() {
              Array.prototype.forEach.call(nodeList, function(node) {
                  node.removeEventListener(type, callback);
              });
          }
      }
  }
  
  /**
   * Add an event listener to a selector
   * and returns a remove listener function.
   *
   * @param {String} selector
   * @param {String} type
   * @param {Function} callback
   * @return {Object}
   */
  function listenSelector(selector, type, callback) {
      return delegate(document.body, selector, type, callback);
  }
  
  module.exports = listen;
  
  },{"./is":3,"delegate":2}],5:[function(require,module,exports){
  function select(element) {
      var selectedText;
  
      if (element.nodeName === 'SELECT') {
          element.focus();
  
          selectedText = element.value;
      }
      else if (element.nodeName === 'INPUT' || element.nodeName === 'TEXTAREA') {
          var isReadOnly = element.hasAttribute('readonly');
  
          if (!isReadOnly) {
              element.setAttribute('readonly', '');
          }
  
          element.select();
          element.setSelectionRange(0, element.value.length);
  
          if (!isReadOnly) {
              element.removeAttribute('readonly');
          }
  
          selectedText = element.value;
      }
      else {
          if (element.hasAttribute('contenteditable')) {
              element.focus();
          }
  
          var selection = window.getSelection();
          var range = document.createRange();
  
          range.selectNodeContents(element);
          selection.removeAllRanges();
          selection.addRange(range);
  
          selectedText = selection.toString();
      }
  
      return selectedText;
  }
  
  module.exports = select;
  
  },{}],6:[function(require,module,exports){
  function E () {
    // Keep this empty so it's easier to inherit from
    // (via https://github.com/lipsmack from https://github.com/scottcorgan/tiny-emitter/issues/3)
  }
  
  E.prototype = {
    on: function (name, callback, ctx) {
      var e = this.e || (this.e = {});
  
      (e[name] || (e[name] = [])).push({
        fn: callback,
        ctx: ctx
      });
  
      return this;
    },
  
    once: function (name, callback, ctx) {
      var self = this;
      function listener () {
        self.off(name, listener);
        callback.apply(ctx, arguments);
      };
  
      listener._ = callback
      return this.on(name, listener, ctx);
    },
  
    emit: function (name) {
      var data = [].slice.call(arguments, 1);
      var evtArr = ((this.e || (this.e = {}))[name] || []).slice();
      var i = 0;
      var len = evtArr.length;
  
      for (i; i < len; i++) {
        evtArr[i].fn.apply(evtArr[i].ctx, data);
      }
  
      return this;
    },
  
    off: function (name, callback) {
      var e = this.e || (this.e = {});
      var evts = e[name];
      var liveEvents = [];
  
      if (evts && callback) {
        for (var i = 0, len = evts.length; i < len; i++) {
          if (evts[i].fn !== callback && evts[i].fn._ !== callback)
            liveEvents.push(evts[i]);
        }
      }
  
      // Remove event from queue to prevent memory leak
      // Suggested by https://github.com/lazd
      // Ref: https://github.com/scottcorgan/tiny-emitter/commit/c6ebfaa9bc973b33d110a84a307742b7cf94c953#commitcomment-5024910
  
      (liveEvents.length)
        ? e[name] = liveEvents
        : delete e[name];
  
      return this;
    }
  };
  
  module.exports = E;
  
  },{}],7:[function(require,module,exports){
  (function (global, factory) {
      if (typeof define === "function" && define.amd) {
          define(['module', 'select'], factory);
      } else if (typeof exports !== "undefined") {
          factory(module, require('select'));
      } else {
          var mod = {
              exports: {}
          };
          factory(mod, global.select);
          global.clipboardAction = mod.exports;
      }
  })(this, function (module, _select) {
      //'use strict';
  
      var _select2 = _interopRequireDefault(_select);
  
      function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : {
              default: obj
          };
      }
  
      var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
          return typeof obj;
      } : function (obj) {
          return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
  
      function _classCallCheck(instance, Constructor) {
          if (!(instance instanceof Constructor)) {
              throw new TypeError("Cannot call a class as a function");
          }
      }
  
      var _createClass = function () {
          function defineProperties(target, props) {
              for (var i = 0; i < props.length; i++) {
                  var descriptor = props[i];
                  descriptor.enumerable = descriptor.enumerable || false;
                  descriptor.configurable = true;
                  if ("value" in descriptor) descriptor.writable = true;
                  Object.defineProperty(target, descriptor.key, descriptor);
              }
          }
  
          return function (Constructor, protoProps, staticProps) {
              if (protoProps) defineProperties(Constructor.prototype, protoProps);
              if (staticProps) defineProperties(Constructor, staticProps);
              return Constructor;
          };
      }();
  
      var ClipboardAction = function () {
          /**
           * @param {Object} options
           */
          function ClipboardAction(options) {
              _classCallCheck(this, ClipboardAction);
  
              this.resolveOptions(options);
              this.initSelection();
          }
  
          /**
           * Defines base properties passed from constructor.
           * @param {Object} options
           */
  
  
          _createClass(ClipboardAction, [{
              key: 'resolveOptions',
              value: function resolveOptions() {
                  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  
                  this.action = options.action;
                  this.emitter = options.emitter;
                  this.target = options.target;
                  this.text = options.text;
                  this.trigger = options.trigger;
  
                  this.selectedText = '';
              }
          }, {
              key: 'initSelection',
              value: function initSelection() {
                  if (this.text) {
                      this.selectFake();
                  } else if (this.target) {
                      this.selectTarget();
                  }
              }
          }, {
              key: 'selectFake',
              value: function selectFake() {
                  var _this = this;
  
                  var isRTL = document.documentElement.getAttribute('dir') == 'rtl';
  
                  this.removeFake();
  
                  this.fakeHandlerCallback = function () {
                      return _this.removeFake();
                  };
                  this.fakeHandler = document.body.addEventListener('click', this.fakeHandlerCallback) || true;
  
                  this.fakeElem = document.createElement('textarea');
                  // Prevent zooming on iOS
                  this.fakeElem.style.fontSize = '12pt';
                  // Reset box model
                  this.fakeElem.style.border = '0';
                  this.fakeElem.style.padding = '0';
                  this.fakeElem.style.margin = '0';
                  // Move element out of screen horizontally
                  this.fakeElem.style.position = 'absolute';
                  this.fakeElem.style[isRTL ? 'right' : 'left'] = '-9999px';
                  // Move element to the same position vertically
                  var yPosition = window.pageYOffset || document.documentElement.scrollTop;
                  this.fakeElem.style.top = yPosition + 'px';
  
                  this.fakeElem.setAttribute('readonly', '');
                  this.fakeElem.value = this.text;
  
                  document.body.appendChild(this.fakeElem);
  
                  this.selectedText = (0, _select2.default)(this.fakeElem);
                  this.copyText();
              }
          }, {
              key: 'removeFake',
              value: function removeFake() {
                  if (this.fakeHandler) {
                      document.body.removeEventListener('click', this.fakeHandlerCallback);
                      this.fakeHandler = null;
                      this.fakeHandlerCallback = null;
                  }
  
                  if (this.fakeElem) {
                      document.body.removeChild(this.fakeElem);
                      this.fakeElem = null;
                  }
              }
          }, {
              key: 'selectTarget',
              value: function selectTarget() {
                  this.selectedText = (0, _select2.default)(this.target);
                  this.copyText();
              }
          }, {
              key: 'copyText',
              value: function copyText() {
                  var succeeded = void 0;
  
                  try {
                      succeeded = document.execCommand(this.action);
                  } catch (err) {
                      succeeded = false;
                  }
  
                  this.handleResult(succeeded);
              }
          }, {
              key: 'handleResult',
              value: function handleResult(succeeded) {
                  this.emitter.emit(succeeded ? 'success' : 'error', {
                      action: this.action,
                      text: this.selectedText,
                      trigger: this.trigger,
                      clearSelection: this.clearSelection.bind(this)
                  });
              }
          }, {
              key: 'clearSelection',
              value: function clearSelection() {
                  if (this.target) {
                      this.target.blur();
                  }
  
                  window.getSelection().removeAllRanges();
              }
          }, {
              key: 'destroy',
              value: function destroy() {
                  this.removeFake();
              }
          }, {
              key: 'action',
              set: function set() {
                  var action = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'copy';
  
                  this._action = action;
  
                  if (this._action !== 'copy' && this._action !== 'cut') {
                      throw new Error('Invalid "action" value, use either "copy" or "cut"');
                  }
              },
              get: function get() {
                  return this._action;
              }
          }, {
              key: 'target',
              set: function set(target) {
                  if (target !== undefined) {
                      if (target && (typeof target === 'undefined' ? 'undefined' : _typeof(target)) === 'object' && target.nodeType === 1) {
                          if (this.action === 'copy' && target.hasAttribute('disabled')) {
                              throw new Error('Invalid "target" attribute. Please use "readonly" instead of "disabled" attribute');
                          }
  
                          if (this.action === 'cut' && (target.hasAttribute('readonly') || target.hasAttribute('disabled'))) {
                              throw new Error('Invalid "target" attribute. You can\'t cut text from elements with "readonly" or "disabled" attributes');
                          }
  
                          this._target = target;
                      } else {
                          throw new Error('Invalid "target" value, use a valid Element');
                      }
                  }
              },
              get: function get() {
                  return this._target;
              }
          }]);
  
          return ClipboardAction;
      }();
  
      module.exports = ClipboardAction;
  });
  
  },{"select":5}],8:[function(require,module,exports){
  (function (global, factory) {
      if (typeof define === "function" && define.amd) {
          define(['module', './clipboard-action', 'tiny-emitter', 'good-listener'], factory);
      } else if (typeof exports !== "undefined") {
          factory(module, require('./clipboard-action'), require('tiny-emitter'), require('good-listener'));
      } else {
          var mod = {
              exports: {}
          };
          factory(mod, global.clipboardAction, global.tinyEmitter, global.goodListener);
          global.clipboard = mod.exports;
      }
  })(this, function (module, _clipboardAction, _tinyEmitter, _goodListener) {
      //'use strict';
  
      var _clipboardAction2 = _interopRequireDefault(_clipboardAction);
  
      var _tinyEmitter2 = _interopRequireDefault(_tinyEmitter);
  
      var _goodListener2 = _interopRequireDefault(_goodListener);
  
      function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : {
              default: obj
          };
      }
  
      function _classCallCheck(instance, Constructor) {
          if (!(instance instanceof Constructor)) {
              throw new TypeError("Cannot call a class as a function");
          }
      }
  
      var _createClass = function () {
          function defineProperties(target, props) {
              for (var i = 0; i < props.length; i++) {
                  var descriptor = props[i];
                  descriptor.enumerable = descriptor.enumerable || false;
                  descriptor.configurable = true;
                  if ("value" in descriptor) descriptor.writable = true;
                  Object.defineProperty(target, descriptor.key, descriptor);
              }
          }
  
          return function (Constructor, protoProps, staticProps) {
              if (protoProps) defineProperties(Constructor.prototype, protoProps);
              if (staticProps) defineProperties(Constructor, staticProps);
              return Constructor;
          };
      }();
  
      function _possibleConstructorReturn(self, call) {
          if (!self) {
              throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
          }
  
          return call && (typeof call === "object" || typeof call === "function") ? call : self;
      }
  
      function _inherits(subClass, superClass) {
          if (typeof superClass !== "function" && superClass !== null) {
              throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
          }
  
          subClass.prototype = Object.create(superClass && superClass.prototype, {
              constructor: {
                  value: subClass,
                  enumerable: false,
                  writable: true,
                  configurable: true
              }
          });
          if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
      }
  
      var Clipboard = function (_Emitter) {
          _inherits(Clipboard, _Emitter);
  
          /**
           * @param {String|HTMLElement|HTMLCollection|NodeList} trigger
           * @param {Object} options
           */
          function Clipboard(trigger, options) {
              _classCallCheck(this, Clipboard);
  
              var _this = _possibleConstructorReturn(this, (Clipboard.__proto__ || Object.getPrototypeOf(Clipboard)).call(this));
  
              _this.resolveOptions(options);
              _this.listenClick(trigger);
              return _this;
          }
  
          /**
           * Defines if attributes would be resolved using internal setter functions
           * or custom functions that were passed in the constructor.
           * @param {Object} options
           */
  
  
          _createClass(Clipboard, [{
              key: 'resolveOptions',
              value: function resolveOptions() {
                  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  
                  this.action = typeof options.action === 'function' ? options.action : this.defaultAction;
                  this.target = typeof options.target === 'function' ? options.target : this.defaultTarget;
                  this.text = typeof options.text === 'function' ? options.text : this.defaultText;
              }
          }, {
              key: 'listenClick',
              value: function listenClick(trigger) {
                  var _this2 = this;
  
                  this.listener = (0, _goodListener2.default)(trigger, 'click', function (e) {
                      return _this2.onClick(e);
                  });
              }
          }, {
              key: 'onClick',
              value: function onClick(e) {
                  var trigger = e.delegateTarget || e.currentTarget;
  
                  if (this.clipboardAction) {
                      this.clipboardAction = null;
                  }
  
                  this.clipboardAction = new _clipboardAction2.default({
                      action: this.action(trigger),
                      target: this.target(trigger),
                      text: this.text(trigger),
                      trigger: trigger,
                      emitter: this
                  });
              }
          }, {
              key: 'defaultAction',
              value: function defaultAction(trigger) {
                  return getAttributeValue('action', trigger);
              }
          }, {
              key: 'defaultTarget',
              value: function defaultTarget(trigger) {
                  var selector = getAttributeValue('target', trigger);
  
                  if (selector) {
                      return document.querySelector(selector);
                  }
              }
          }, {
              key: 'defaultText',
              value: function defaultText(trigger) {
                  return getAttributeValue('text', trigger);
              }
          }, {
              key: 'destroy',
              value: function destroy() {
                  this.listener.destroy();
  
                  if (this.clipboardAction) {
                      this.clipboardAction.destroy();
                      this.clipboardAction = null;
                  }
              }
          }], [{
              key: 'isSupported',
              value: function isSupported() {
                  var action = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ['copy', 'cut'];
  
                  var actions = typeof action === 'string' ? [action] : action;
                  var support = !!document.queryCommandSupported;
  
                  actions.forEach(function (action) {
                      support = support && !!document.queryCommandSupported(action);
                  });
  
                  return support;
              }
          }]);
  
          return Clipboard;
      }(_tinyEmitter2.default);
  
      /**
       * Helper function to retrieve attribute value.
       * @param {String} suffix
       * @param {Element} element
       */
      function getAttributeValue(suffix, element) {
          var attribute = 'data-clipboard-' + suffix;
  
          if (!element.hasAttribute(attribute)) {
              return;
          }
  
          return element.getAttribute(attribute);
      }
  
      module.exports = Clipboard;
  });
  
  },{"./clipboard-action":7,"good-listener":4,"tiny-emitter":6}]},{},[8])(8)
  });
var Article = {
	TopBinder: [],
	Init: function() { 

		Article.SetScreen();

		var articleText = $("#articleText"),
			articleTextP = articleText.offset(),
			articleMenuW = $(".articleMenu").width(),
			p = $(".articleSection",articleText);

		$(".ModalTables").on("shown.bs.modal",function() {
			var modalBody = $(".modal-body",this),
				table = $("table",modalBody),
				modalBodyWidth = modalBody.outerWidth(),
				tableWidth = table.outerWidth();

			if(!modalBody.is("cached")) {
				table.addClass("table");

				if(tableWidth > modalBodyWidth) {
					table.addClass("autoWidth");
				} else {
					table.removeClass("autoWidth");
				}
			}

			modalBody.addClass("cached");
		});

		
		/*
		Este trecho foi modificado para exibir os tooltips em modo leitura.
		Ainda em fase de testes.

		Update: Foi comentado para voltar ao modo padrão e tentar uma nova abordagem sem gerar listas de referencias duplicadas
		*/
		var RefToolTip = {

            open: function(t) {

                var s = $(".xref",t),
                    d = s.next("span:eq(0)")
                    p = t.position(),
                    supHeight = s.outerHeight(),
                    supPositionLeft = p.left,
                    li = t.closest("li"),
                    refTxt = s.parent().find("a").data("ref");
                    s.parent().append("<span class='refCtt closed'><span>" + refTxt + "</span></span>");

                    console.log('cliquei');

                if(li.length > 0)
                    li.addClass("zindexFix");
                    s.parent().find(".refCtt").removeClass("closed").addClass("opened").css({
                    "left": (supPositionLeft > 300) ? (-supPositionLeft/3) : 0
                }).fadeIn("fast");

            },
            close: function(t) {

                var s = $(".xref",t),
                    d = s.next("span:eq(0)"),
                    li = t.closest("li");

                if(li.length > 0)
                    li.removeClass("zindexFix");
                    s.parent().find(".refCtt").removeClass("opened").addClass("closed");
                    s.parent().find(".refCtt").remove();
            }
        };
	  
		$(".ref").on("mouseenter mouseleave",function(e) {
            
            var t = $(this);

            e.preventDefault();

            if(e.type === "mouseenter") {
               RefToolTip.open(t);
            } else {
               RefToolTip.close(t);
            }
            
        });
		
		// Tablet or Mobile
		/*
		if(Article.IsTablet || Article.IsMobile) {

			var isTooltipOpen = false;
			var actualOpened = null;

			$('html').on('touchstart', function(e) {

				$(".ref").each(function() {

					var t = $(this);
					RefToolTip.close(t);

					isTooltipOpen = false;
				});

			});

			$(".ref").on('touchstart',function(e) {
			    e.stopPropagation();

			  	var t = $(this);

			  	if(actualOpened !== null && t.get(0) === actualOpened.get(0)) {

			  		if(!isTooltipOpen) {

						actualOpened = t;

						RefToolTip.open(t);
		  			    isTooltipOpen = true;

					}

			  	} else {

			  		if(actualOpened !== null) RefToolTip.close(actualOpened);

					actualOpened = t;

					RefToolTip.open(t);
		  			isTooltipOpen = true;
			  	}

			});

		    $("ul.floatingMenuMobile").on('click', function() {

		    	$(this).find('.fm-button-child').each(function() {
		    		$(this).addClass('tooltip-mobile-on');
		    	});

		    });



		// Desktop
		} else {

			$(".ref").on("mouseenter mouseleave",function(e) {
				e.preventDefault();

				var t = $(this);

				if(e.type === "mouseenter") {

					RefToolTip.open(t);

				} else {

					RefToolTip.close(t);
				}
			});
		}
		*/


		$(".thumb").on("mouseenter mouseleave",function(e) {
			var p = $(this).parent().parent().find(".preview");
			if(e.type == "mouseenter") {
				p.fadeIn("fast");
			} else if(e.type == "mouseleave") {
				p.fadeOut("fast");
			}
		});

		$(".ModalTables").on("shown.bs.modal",function() {
			var check = $("table td[colspan], table td[rowspan]",this).length;
			if(check == 0)
				$("table",this).addClass("table-hover");
		});

		$(".collapseTitle").on("click",function() {
			var ctt = $(this).next(),
				ico = $(this).find(".collapseIcon");

			if(ctt.is(":visible")) {
				ctt.slideUp("fast");
				ico.removeClass("opened");
			} else {
				ctt.slideDown("fast");
				ico.addClass("opened");
			}
		});

		$(".expandReduceText").on("click",function(e) {
			e.preventDefault();
			var ref = $("#articleText .ref"),
				txt = $("#articleText .text"),
				s = $(this).data("expandreducetext"),
				tw = $(this).data("defaultwidth");

			if(typeof tw == "undefined")
				$(this).data("defaultwidth",txt.outerWidth());

			if(s == true) {
				ref.hide();
				txt.outerWidth("100%");

				$(this).data("expandreducetext",false);
			} else {
				txt.width("");
				ref.show();

				$(this).data("expandreducetext",true);
			}

			var t = $(window).scrollTop();
			setTimeout(function() {
				Article.ArticleStructureBuilder();
				Article.ArticleStructureSelect(t);
			},100);


		});

		$(".articleTxt .xref:not(.big)").on("click",function() {
			var c = $(this).text(),
				d = $(".ref-list");

			if(c.indexOf(",") == -1) {
				parseInt(c);
				c--;
			} else {
				c = c.split(",");
				c = c[0];

				parseInt(c);
				c--;
			}
		});


		Article.ArticleStructureBuilder();

		articleTextP.top = articleTextP.top - 25;
		var articleTextH = articleText.outerHeight(),
			articleMenuH = $(".articleMenu").height();

			hbodyText = $(".articleTxt").height();
			vbodyText = hbodyText + 100  + "px";
			vbodyTextMobile = hbodyText + 150  + "px";

		window.setTimeout(function() {
			articleMenuH = $(".articleMenu").height();
		},200);

		if(hbodyText < 750){
			$(".floatingMenu, .floatingMenuItem, .floatingMenuMobile").css({
				"bottom": "auto",
				"top": Article.IsTablet ? vbodyTextMobile : vbodyText
			});
		}
		window.setTimeout(function() {
			$(".floatingMenu, .floatingMenuItem, .floatingMenuMobile").css({
				"opacity": "1"
			});
		},200);

		$(window).scroll(function() {
			var t = $(window).scrollTop();

			/*
			Componente menu flutuante
			
			if(Article.isScrolledIntoView('.floatingMenuCtt')){

				$('.floatingMenuItem').css({position: 'absolute'});
				$('.floatingMenu').css({position: 'absolute'});

			}else{

				$('.floatingMenuItem').css({position: 'fixed'});
				$('.floatingMenu').css({position: 'fixed'});
			}
			*/

			if(t > articleTextP.top) {

				$(".articleMenu").addClass("fixed").width(articleMenuW);

				if(t > (articleTextH + articleTextP.top - articleMenuH - 46)) {
					$(".articleMenu").addClass("fixedBottom");

				} else {
					$(".articleMenu").removeClass("fixedBottom");
				}
			} else
				$(".articleMenu").removeClass("fixed");

			Article.ArticleStructureSelect(t);

			$(".alternativeHeader").stop(false,false);
		});

		


		if(window.location.hash != "") {
			var hash = window.location.hash,
				scrollY = window.scrollY;

			$(hash).modal("toggle").on("hidden.bs.modal",function() {
    			window.location.hash = '';

    			$("body,html").scrollTop(scrollY);
			});
		}

		$("[data-toggle='modal']").on("click",function() {
			var t = $(this),
				target = t.data("target"),
				scrollY = window.scrollY;

			if(target != "undefined" || target != "")
				window.location.hash = target;

			$(target).on("hidden.bs.modal",function () {
        		window.location.hash = '';

        		$("body,html").scrollTop(scrollY);
    		});
		});

		var downloadOpt = $(".downloadOptions li.group"),
			downloadOptW = 100/downloadOpt.length;

		downloadOpt.css("width",downloadOptW+"%");

		Article.fechaAutores();

		// Global variable shared on mouseenter event and clipboard
		var hasEncodedTheURL = false;

		$('.short-link').mouseenter(function(event) {

			// Verify if the ajax request has already been made
			if(!hasEncodedTheURL) {

				
				var urlAtual = "http://www.scielo.br";

				if(urlAtual.indexOf('localhost') !== -1) { // Localhost
					var urlAtual = "http://www.scielo.br";
				}

	        	$.ajax({
		            type: "GET",
		            async: false,
		            url: 'http://ref.scielo.org/api/v1/shorten',
		            data: 'url=' + encodeURI(urlAtual),
		            dataType: "jsonp",
		            success: function(data) {
		            	result = data;
		            	hasEncodedTheURL = true;
	            	}
	            	//error:
	        	});
			}

	    });

		var clipboard = new Clipboard('.short-link', {
        text: function(trigger) {
            	return result;
            }
        });

	    clipboard.on('success', function(e) {

	        console.log('Sucess: ' + e);

        	//var t = $(e.trigger);
			var t = document.querySelector('a.copyLink');
			t.addClass("copyFeedback");

			setTimeout(function() {
				t.removeClass("copyFeedback");
			},2000);
	    });

	    clipboard.on('error', function(e) {
	    	console.log('Error: ' + e);

	    	var t = $(e.trigger);
			t.addClass("copyFeedbackError");

			setTimeout(function() {
				t.removeClass("copyFeedbackError");
			},2000);
	    });

		this.CopyLink();

	    $("ul.floatingMenuMobile").on('click', function() {

	    	$(this).find('.fm-button-child').each(function() {
	    		$(this).addClass('tooltip-mobile-on');
	    	});
	    });

	    var isFloatingMenuMobileClosed = true;

	    $("ul.floatingMenuMobile").on('focusout click', function(e) {

	    	if(isFloatingMenuMobileClosed) { // Open menu

	    		if(e.type === 'focusout') {
	    			return;
	    		}

	    		isFloatingMenuMobileClosed = false;
	    		$(this).find('.fm-list').children('li').removeAttr('style');
	    		$(this).find('.fm-button-main').addClass('fm-button-main-mobile-open');

	    	} else {

	    		isFloatingMenuMobileClosed = true; // Close menu
	    		
	    		$(this).find('.fm-list').children('li').css({'opacity': 0});
	    		$(this).find('.fm-button-main').removeClass('fm-button-main-mobile-open');

	    	}
	    });
	},

	isScrolledIntoView: function(elem){
	    var docViewTop = $(window).scrollTop();
	    var docViewBottom = docViewTop + $(window).height();
	    var elemTop = $(elem).offset().top;
	    var elemBottom = elemTop + $(elem).height();
	    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
	},

	ArticleStructureBuilder: function() {
		var structure = $(".articleMenu"),
			content = $("#articleText .articleSection"),
			idx = 0,
			ctt = '';

		Article.TopBinder = [];

		content.each(function() {
			var t = $(this).data("anchor"),
				h = $(this).find(".articleSectionTitle"),
				offset = $(this).offset();

			if($(this).find("a[name='articleSection"+idx+"']").length == 0) {
				$(this).prepend("<a name='articleSection"+idx+"'></a>");
			}

			if(idx == 0)
				Article.TopBinder.push(0);
			else
				Article.TopBinder.push(offset.top);

			if(typeof t == "undefined") return true;

			ctt += '<li '+(idx == 0 ? 'class="selected"' : '')+'>';
			ctt += '	<a href="#articleSection'+idx+'">'+t+'</a>';

			if(h.length > 1) {
				var iidx = 0;
				ctt += '<ul>';
				h.each(function() {
					var ooffset = $(this).offset();
					Article.TopBinder.push(ooffset.top);

					if($(this).prev("a[name='as"+idx+"-heading"+iidx+"']").length == 0) {
						$(this).before("<a name='as"+idx+"-heading"+iidx+"'></a>");
					}

					ctt += '<li>';
					ctt += '	<a href="#as'+idx+'-heading'+iidx+'">'+$(this).text()+'</a>';
					ctt += '</li>';

					iidx++;
				});
				ctt += '</ul>';
			}
			ctt += '</li>';

			idx++;
		});

		// ctt+='<li class="floatingMenuCtt">colocar botao aqui</li>';

		structure.html(ctt);

		$("a",structure).on("click",function(e) {
			e.preventDefault();

			var d = $(this).attr("href");
			d = d.replace("#","");

			var p = $("a[name="+d+"]").offset();

			$("html,body").animate({
				scrollTop: (p.top-60)
			},500);
		});
	},
	ArticleStructureSelect: function(pos) {
		var structure = $(".articleMenu"),
			idx = 0;
		for(var i=0,l=Article.TopBinder.length;i<l;i++) {
			if(i == l-1 && pos >= Article.TopBinder[i]-100) {
				structure.find("li").removeClass("selected");
				structure.find("li:eq("+i+")").addClass("selected");
				break;
			} else {
				if(pos <= (Article.TopBinder[i]-100)) {
					structure.find("li").removeClass("selected");
					structure.find("li:eq("+(i-1)+")").addClass("selected");
					break;
				}
			}
		}
	},
	Bindings: function(ctn) {
		if(typeof ctn == "undefined") ctn = ".article";
	},
	fechaAutores: function() {

		var autoresGrupo = $(".contribGroup");
		var autores = $(".contribGroup .dropdown");
		var qtdAutores = autores.length;

		if(qtdAutores >= 10) {

			var AuthorsQTDTooltip = null;

			var btnSobre = $(".outlineFadeLink");
			var primeiro = autores[0];
			var ultimo = autores[qtdAutores -1];

			// Code added to control authors quantity tooltip
			var authorsQTDToShowInsideBracktes = qtdAutores - 2;

			var linkToggleOn = $('<a data-toggle="tooltip" data-placement="top" title="+'+authorsQTDToShowInsideBracktes+'"></a>');

			linkToggleOn.text("[...]");
			//style
			linkToggleOn.css({ padding : "10px" , cursor : "pointer" });

			var boxToggleOff = $('<div></div>');
			var linkToggleOff = $('<a></a>');

			linkToggleOff.addClass("btn-fechar");

			var spanOff = $('<span></span>');
			spanOff.addClass("sci-ico-floatingMenuClose");

			linkToggleOff.append(spanOff);
			boxToggleOff.append(linkToggleOff);

			var autoresResumo = $('<div></div>');
			autoresResumo.append(primeiro);
			autoresResumo.append(linkToggleOn);
			autoresResumo.append(ultimo);
			autoresResumo.append(btnSobre);

			//substitui o conteudo pelo resumo
			autoresGrupo.text("");
			autoresGrupo.append(autoresResumo);

			linkToggleOn.on("click",function() {
				AuthorsQTDTooltip.tooltip('disable')

				autoresGrupo.textContent = "";
				for (var i = 0; i < qtdAutores; i++){
					autoresGrupo.append(autores[i]);
				}

				autoresGrupo.append(btnSobre);
				autoresGrupo.append(boxToggleOff);
			});

			linkToggleOff.on("click",function() {
				AuthorsQTDTooltip.tooltip('enable');

				Article.fechaAutores();
			});

			// Initialize tooltip
			AuthorsQTDTooltip = $('[data-toggle="tooltip"]').tooltip();
		}
		autoresGrupo.css("opacity","1");

	},
	IsMobile: false,
	IsTablet: false,
	IsTabletPortrait: false,
	IsDesktop: false,
	IsHD: false,
	isOldIE: false,
	DetectMobile: function(userAgent) {
		var mobile = {};

		// valores do http://detectmobilebrowsers.com/
	    mobile.detectMobileBrowsers = {
	        fullPattern: /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i,
	        shortPattern: /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i
	    };

	    return mobile.detectMobileBrowsers.fullPattern.test(userAgent) ||
        	mobile.detectMobileBrowsers.shortPattern.test(userAgent.substr(0,4));
	},
	DetectTablet: function(userAgent) {
		var tablets = {};

		// valores do http://detectmobilebrowsers.com/
	    tablets.detectMobileBrowsers = {
	        tabletPattern: /android|ipad|playbook|silk/i
	    };

		return tablets.detectMobileBrowsers.tabletPattern.test(userAgent);
	},
	SetScreen: function() {
		var w = $(window).innerWidth(),
			orientation = window.matchMedia("(orientation: portrait)").matches;

		if(w > 990) Article.IsDesktop = true;
		if(w > 1206) Article.IsHD = true;

		if(Article.DetectMobile(navigator.userAgent))
			Article.IsMobile = true;

		if(Article.DetectTablet(navigator.userAgent)) {
			Article.IsTablet = true;

			if(orientation)
				Article.IsTabletPortrait = true;
			else
				Article.IsTabletPortrait = false;

			window.addEventListener("orientationchange", function() {
			    if(screen.orientation.angle == 0)
			    	Article.IsTabletPortrait = true;
			    else
			    	Article.IsTabletPortrait = false;
			});
		}

		if(navigator.appVersion.indexOf("MSIE 8") > -1) {
			Article.IsMobile = false;
			Article.IsTablet = false;
			Article.IsDesktop = true;
			Article.IsOldIE = true;
			Article.IsHD = false;
		}
	},
	CopyLink: function() {
		/*
		Comportamento com foco em link com a classe copylink
		- prever elementos diferente de botoes na hora de criar o js genérico
		*/
		var linkTrigger = document.querySelector('a.copyLink');

		linkTrigger.addEventListener('click', function () {
			this.classList.add('copyFeedback');

			setTimeout(function() {
				linkTrigger.classList.remove('copyFeedback');
			},2000);
		});
	},
};


document.addEventListener("DOMContentLoaded", function() {

    if($("body.article").length) { 
        Article.Init();
    } 
		 

});    
//# sourceMappingURL=scielo-ds.js.map