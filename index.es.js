import React, { useContext, useEffect, useMemo } from 'react';
import { action, observable, extendObservable } from 'mobx';
import { Redirect, Route, Switch } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

class NotFoundTemplate {
  constructor() {
    this.template = () => React.createElement("div", null, "Not found!!");
  }

  get() {
    return this.template;
  }

  set(template) {
    this.template = template;
  }

}
const NotFound = new NotFoundTemplate();

function _initializerDefineProperty(target, property, descriptor, context) {
  if (!descriptor) return;
  Object.defineProperty(target, property, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
  });
}

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object.keys(descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object.defineProperty(target, property, desc);
    desc = null;
  }

  return desc;
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function isAbsolute(pathname) {
  return pathname.charAt(0) === '/';
}

// About 1.5x faster than the two-arg version of Array#splice()
function spliceOne(list, index) {
  for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1) {
    list[i] = list[k];
  }

  list.pop();
}

// This implementation is based heavily on node's url.parse
function resolvePathname(to, from) {
  if (from === undefined) from = '';

  var toParts = (to && to.split('/')) || [];
  var fromParts = (from && from.split('/')) || [];

  var isToAbs = to && isAbsolute(to);
  var isFromAbs = from && isAbsolute(from);
  var mustEndAbs = isToAbs || isFromAbs;

  if (to && isAbsolute(to)) {
    // to is absolute
    fromParts = toParts;
  } else if (toParts.length) {
    // to is relative, drop the filename
    fromParts.pop();
    fromParts = fromParts.concat(toParts);
  }

  if (!fromParts.length) return '/';

  var hasTrailingSlash;
  if (fromParts.length) {
    var last = fromParts[fromParts.length - 1];
    hasTrailingSlash = last === '.' || last === '..' || last === '';
  } else {
    hasTrailingSlash = false;
  }

  var up = 0;
  for (var i = fromParts.length; i >= 0; i--) {
    var part = fromParts[i];

    if (part === '.') {
      spliceOne(fromParts, i);
    } else if (part === '..') {
      spliceOne(fromParts, i);
      up++;
    } else if (up) {
      spliceOne(fromParts, i);
      up--;
    }
  }

  if (!mustEndAbs) for (; up--; up) fromParts.unshift('..');

  if (
    mustEndAbs &&
    fromParts[0] !== '' &&
    (!fromParts[0] || !isAbsolute(fromParts[0]))
  )
    fromParts.unshift('');

  var result = fromParts.join('/');

  if (hasTrailingSlash && result.substr(-1) !== '/') result += '/';

  return result;
}

var isProduction = process.env.NODE_ENV === 'production';
function warning(condition, message) {
  if (!isProduction) {
    if (condition) {
      return;
    }

    var text = "Warning: " + message;

    if (typeof console !== 'undefined') {
      console.warn(text);
    }

    try {
      throw Error(text);
    } catch (x) {}
  }
}

var isProduction$1 = process.env.NODE_ENV === 'production';
var prefix = 'Invariant failed';
function invariant(condition, message) {
  if (condition) {
    return;
  }

  if (isProduction$1) {
    throw new Error(prefix);
  } else {
    throw new Error(prefix + ": " + (message || ''));
  }
}

function addLeadingSlash(path) {
  return path.charAt(0) === '/' ? path : '/' + path;
}
function hasBasename(path, prefix) {
  return path.toLowerCase().indexOf(prefix.toLowerCase()) === 0 && '/?#'.indexOf(path.charAt(prefix.length)) !== -1;
}
function stripBasename(path, prefix) {
  return hasBasename(path, prefix) ? path.substr(prefix.length) : path;
}
function stripTrailingSlash(path) {
  return path.charAt(path.length - 1) === '/' ? path.slice(0, -1) : path;
}
function parsePath(path) {
  var pathname = path || '/';
  var search = '';
  var hash = '';
  var hashIndex = pathname.indexOf('#');

  if (hashIndex !== -1) {
    hash = pathname.substr(hashIndex);
    pathname = pathname.substr(0, hashIndex);
  }

  var searchIndex = pathname.indexOf('?');

  if (searchIndex !== -1) {
    search = pathname.substr(searchIndex);
    pathname = pathname.substr(0, searchIndex);
  }

  return {
    pathname: pathname,
    search: search === '?' ? '' : search,
    hash: hash === '#' ? '' : hash
  };
}
function createPath(location) {
  var pathname = location.pathname,
      search = location.search,
      hash = location.hash;
  var path = pathname || '/';
  if (search && search !== '?') path += search.charAt(0) === '?' ? search : "?" + search;
  if (hash && hash !== '#') path += hash.charAt(0) === '#' ? hash : "#" + hash;
  return path;
}

function createLocation(path, state, key, currentLocation) {
  var location;

  if (typeof path === 'string') {
    // Two-arg form: push(path, state)
    location = parsePath(path);
    location.state = state;
  } else {
    // One-arg form: push(location)
    location = _extends({}, path);
    if (location.pathname === undefined) location.pathname = '';

    if (location.search) {
      if (location.search.charAt(0) !== '?') location.search = '?' + location.search;
    } else {
      location.search = '';
    }

    if (location.hash) {
      if (location.hash.charAt(0) !== '#') location.hash = '#' + location.hash;
    } else {
      location.hash = '';
    }

    if (state !== undefined && location.state === undefined) location.state = state;
  }

  try {
    location.pathname = decodeURI(location.pathname);
  } catch (e) {
    if (e instanceof URIError) {
      throw new URIError('Pathname "' + location.pathname + '" could not be decoded. ' + 'This is likely caused by an invalid percent-encoding.');
    } else {
      throw e;
    }
  }

  if (key) location.key = key;

  if (currentLocation) {
    // Resolve incomplete/relative pathname relative to current location.
    if (!location.pathname) {
      location.pathname = currentLocation.pathname;
    } else if (location.pathname.charAt(0) !== '/') {
      location.pathname = resolvePathname(location.pathname, currentLocation.pathname);
    }
  } else {
    // When there is no prior location and pathname is empty, set it to /
    if (!location.pathname) {
      location.pathname = '/';
    }
  }

  return location;
}

function createTransitionManager() {
  var prompt = null;

  function setPrompt(nextPrompt) {
    process.env.NODE_ENV !== "production" ? warning(prompt == null, 'A history supports only one prompt at a time') : void 0;
    prompt = nextPrompt;
    return function () {
      if (prompt === nextPrompt) prompt = null;
    };
  }

  function confirmTransitionTo(location, action, getUserConfirmation, callback) {
    // TODO: If another transition starts while we're still confirming
    // the previous one, we may end up in a weird state. Figure out the
    // best way to handle this.
    if (prompt != null) {
      var result = typeof prompt === 'function' ? prompt(location, action) : prompt;

      if (typeof result === 'string') {
        if (typeof getUserConfirmation === 'function') {
          getUserConfirmation(result, callback);
        } else {
          process.env.NODE_ENV !== "production" ? warning(false, 'A history needs a getUserConfirmation function in order to use a prompt message') : void 0;
          callback(true);
        }
      } else {
        // Return false from a transition hook to cancel the transition.
        callback(result !== false);
      }
    } else {
      callback(true);
    }
  }

  var listeners = [];

  function appendListener(fn) {
    var isActive = true;

    function listener() {
      if (isActive) fn.apply(void 0, arguments);
    }

    listeners.push(listener);
    return function () {
      isActive = false;
      listeners = listeners.filter(function (item) {
        return item !== listener;
      });
    };
  }

  function notifyListeners() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    listeners.forEach(function (listener) {
      return listener.apply(void 0, args);
    });
  }

  return {
    setPrompt: setPrompt,
    confirmTransitionTo: confirmTransitionTo,
    appendListener: appendListener,
    notifyListeners: notifyListeners
  };
}

var canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);
function getConfirmation(message, callback) {
  callback(window.confirm(message)); // eslint-disable-line no-alert
}
/**
 * Returns true if the HTML5 history API is supported. Taken from Modernizr.
 *
 * https://github.com/Modernizr/Modernizr/blob/master/LICENSE
 * https://github.com/Modernizr/Modernizr/blob/master/feature-detects/history.js
 * changed to avoid false negatives for Windows Phones: https://github.com/reactjs/react-router/issues/586
 */

function supportsHistory() {
  var ua = window.navigator.userAgent;
  if ((ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) && ua.indexOf('Mobile Safari') !== -1 && ua.indexOf('Chrome') === -1 && ua.indexOf('Windows Phone') === -1) return false;
  return window.history && 'pushState' in window.history;
}
/**
 * Returns true if browser fires popstate on hash change.
 * IE10 and IE11 do not.
 */

function supportsPopStateOnHashChange() {
  return window.navigator.userAgent.indexOf('Trident') === -1;
}
/**
 * Returns true if a given popstate event is an extraneous WebKit event.
 * Accounts for the fact that Chrome on iOS fires real popstate events
 * containing undefined state when pressing the back button.
 */

function isExtraneousPopstateEvent(event) {
  return event.state === undefined && navigator.userAgent.indexOf('CriOS') === -1;
}

var PopStateEvent = 'popstate';
var HashChangeEvent = 'hashchange';

function getHistoryState() {
  try {
    return window.history.state || {};
  } catch (e) {
    // IE 11 sometimes throws when accessing window.history.state
    // See https://github.com/ReactTraining/history/pull/289
    return {};
  }
}
/**
 * Creates a history object that uses the HTML5 history API including
 * pushState, replaceState, and the popstate event.
 */


function createBrowserHistory(props) {
  if (props === void 0) {
    props = {};
  }

  !canUseDOM ? process.env.NODE_ENV !== "production" ? invariant(false, 'Browser history needs a DOM') : invariant(false) : void 0;
  var globalHistory = window.history;
  var canUseHistory = supportsHistory();
  var needsHashChangeListener = !supportsPopStateOnHashChange();
  var _props = props,
      _props$forceRefresh = _props.forceRefresh,
      forceRefresh = _props$forceRefresh === void 0 ? false : _props$forceRefresh,
      _props$getUserConfirm = _props.getUserConfirmation,
      getUserConfirmation = _props$getUserConfirm === void 0 ? getConfirmation : _props$getUserConfirm,
      _props$keyLength = _props.keyLength,
      keyLength = _props$keyLength === void 0 ? 6 : _props$keyLength;
  var basename = props.basename ? stripTrailingSlash(addLeadingSlash(props.basename)) : '';

  function getDOMLocation(historyState) {
    var _ref = historyState || {},
        key = _ref.key,
        state = _ref.state;

    var _window$location = window.location,
        pathname = _window$location.pathname,
        search = _window$location.search,
        hash = _window$location.hash;
    var path = pathname + search + hash;
    process.env.NODE_ENV !== "production" ? warning(!basename || hasBasename(path, basename), 'You are attempting to use a basename on a page whose URL path does not begin ' + 'with the basename. Expected path "' + path + '" to begin with "' + basename + '".') : void 0;
    if (basename) path = stripBasename(path, basename);
    return createLocation(path, state, key);
  }

  function createKey() {
    return Math.random().toString(36).substr(2, keyLength);
  }

  var transitionManager = createTransitionManager();

  function setState(nextState) {
    _extends(history, nextState);

    history.length = globalHistory.length;
    transitionManager.notifyListeners(history.location, history.action);
  }

  function handlePopState(event) {
    // Ignore extraneous popstate events in WebKit.
    if (isExtraneousPopstateEvent(event)) return;
    handlePop(getDOMLocation(event.state));
  }

  function handleHashChange() {
    handlePop(getDOMLocation(getHistoryState()));
  }

  var forceNextPop = false;

  function handlePop(location) {
    if (forceNextPop) {
      forceNextPop = false;
      setState();
    } else {
      var action = 'POP';
      transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
        if (ok) {
          setState({
            action: action,
            location: location
          });
        } else {
          revertPop(location);
        }
      });
    }
  }

  function revertPop(fromLocation) {
    var toLocation = history.location; // TODO: We could probably make this more reliable by
    // keeping a list of keys we've seen in sessionStorage.
    // Instead, we just default to 0 for keys we don't know.

    var toIndex = allKeys.indexOf(toLocation.key);
    if (toIndex === -1) toIndex = 0;
    var fromIndex = allKeys.indexOf(fromLocation.key);
    if (fromIndex === -1) fromIndex = 0;
    var delta = toIndex - fromIndex;

    if (delta) {
      forceNextPop = true;
      go(delta);
    }
  }

  var initialLocation = getDOMLocation(getHistoryState());
  var allKeys = [initialLocation.key]; // Public interface

  function createHref(location) {
    return basename + createPath(location);
  }

  function push(path, state) {
    process.env.NODE_ENV !== "production" ? warning(!(typeof path === 'object' && path.state !== undefined && state !== undefined), 'You should avoid providing a 2nd state argument to push when the 1st ' + 'argument is a location-like object that already has state; it is ignored') : void 0;
    var action = 'PUSH';
    var location = createLocation(path, state, createKey(), history.location);
    transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
      if (!ok) return;
      var href = createHref(location);
      var key = location.key,
          state = location.state;

      if (canUseHistory) {
        globalHistory.pushState({
          key: key,
          state: state
        }, null, href);

        if (forceRefresh) {
          window.location.href = href;
        } else {
          var prevIndex = allKeys.indexOf(history.location.key);
          var nextKeys = allKeys.slice(0, prevIndex + 1);
          nextKeys.push(location.key);
          allKeys = nextKeys;
          setState({
            action: action,
            location: location
          });
        }
      } else {
        process.env.NODE_ENV !== "production" ? warning(state === undefined, 'Browser history cannot push state in browsers that do not support HTML5 history') : void 0;
        window.location.href = href;
      }
    });
  }

  function replace(path, state) {
    process.env.NODE_ENV !== "production" ? warning(!(typeof path === 'object' && path.state !== undefined && state !== undefined), 'You should avoid providing a 2nd state argument to replace when the 1st ' + 'argument is a location-like object that already has state; it is ignored') : void 0;
    var action = 'REPLACE';
    var location = createLocation(path, state, createKey(), history.location);
    transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
      if (!ok) return;
      var href = createHref(location);
      var key = location.key,
          state = location.state;

      if (canUseHistory) {
        globalHistory.replaceState({
          key: key,
          state: state
        }, null, href);

        if (forceRefresh) {
          window.location.replace(href);
        } else {
          var prevIndex = allKeys.indexOf(history.location.key);
          if (prevIndex !== -1) allKeys[prevIndex] = location.key;
          setState({
            action: action,
            location: location
          });
        }
      } else {
        process.env.NODE_ENV !== "production" ? warning(state === undefined, 'Browser history cannot replace state in browsers that do not support HTML5 history') : void 0;
        window.location.replace(href);
      }
    });
  }

  function go(n) {
    globalHistory.go(n);
  }

  function goBack() {
    go(-1);
  }

  function goForward() {
    go(1);
  }

  var listenerCount = 0;

  function checkDOMListeners(delta) {
    listenerCount += delta;

    if (listenerCount === 1 && delta === 1) {
      window.addEventListener(PopStateEvent, handlePopState);
      if (needsHashChangeListener) window.addEventListener(HashChangeEvent, handleHashChange);
    } else if (listenerCount === 0) {
      window.removeEventListener(PopStateEvent, handlePopState);
      if (needsHashChangeListener) window.removeEventListener(HashChangeEvent, handleHashChange);
    }
  }

  var isBlocked = false;

  function block(prompt) {
    if (prompt === void 0) {
      prompt = false;
    }

    var unblock = transitionManager.setPrompt(prompt);

    if (!isBlocked) {
      checkDOMListeners(1);
      isBlocked = true;
    }

    return function () {
      if (isBlocked) {
        isBlocked = false;
        checkDOMListeners(-1);
      }

      return unblock();
    };
  }

  function listen(listener) {
    var unlisten = transitionManager.appendListener(listener);
    checkDOMListeners(1);
    return function () {
      checkDOMListeners(-1);
      unlisten();
    };
  }

  var history = {
    length: globalHistory.length,
    action: 'POP',
    location: initialLocation,
    createHref: createHref,
    push: push,
    replace: replace,
    go: go,
    goBack: goBack,
    goForward: goForward,
    block: block,
    listen: listen
  };
  return history;
}

var _class, _descriptor, _descriptor2, _temp;
let Navigator = (_class = (_temp = class Navigator {
  constructor() {
    _initializerDefineProperty(this, "location", _descriptor, this);

    _initializerDefineProperty(this, "match", _descriptor2, this);

    this.history = createBrowserHistory({});
    this.push = this.history.push;
  }

  setRoute(location, match, history) {
    this.location = location;
    this.match = match;
    this.history = history;
  }

}, _temp), (_descriptor = _applyDecoratedDescriptor(_class.prototype, "location", [observable], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return {};
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, "match", [observable], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return {};
  }
}), _applyDecoratedDescriptor(_class.prototype, "setRoute", [action], Object.getOwnPropertyDescriptor(_class.prototype, "setRoute"), _class.prototype)), _class);
var navigator$1 = new Navigator();

function initController(Controller, appConfig) {
  const newController = new Controller(appConfig);
  const extendData = {};

  if (!newController.hasOwnProperty('ready')) {
    extendData.ready = false;
  }

  if (!newController.hasOwnProperty('error')) {
    extendData.error = undefined;
  }

  extendObservable(newController, extendData);

  (async () => {
    try {
      if (newController.init) await newController.init();
      newController.ready = true;
    } catch (e) {
      newController.error = e;
      throw e;
    }
  })();

  return newController;
}

class ServiceStore {
  constructor(appConfig) {
    this.store = {};

    this.create = Service => {
      this.store[Service._id] = initController(Service, this.appConfig);
      return this.store[Service._id];
    };

    this.get = Service => {
      if (this.store[Service._id]) {
        return this.store[Service._id];
      } else return this.create(Service);
    };

    this.destroy = Service => {
      if (this.store[Service._id]) {
        delete this.store[Service._id];
      }
    };

    this.appConfig = appConfig || {
      parent: '/'
    };
    this.appConfig.store = this;
  }

}
const instance = new ServiceStore();

let id = 0;
function ServiceDecorator(config) {
  return function (Target) {
    class Result extends Target {
      constructor(appConfig) {
        super(appConfig);
        this.models = {};

        for (let i in this) {
          this.models[i] = e => {
            this[i] = e.target.value;
          };
        }

        if (this.__servicesToInject) {
          this.__servicesToInject.forEach(({
            service,
            key
          }) => {
            this[key] = appConfig.store.get(service);
          });
        }

        if (this.__injectAppConfig) {
          this.__injectAppConfig.forEach(({
            key
          }) => {
            this[key] = appConfig;
          });
        }

        if (this.__injectController) {
          this.__injectController.forEach(({
            key
          }) => {
            this[key] = appConfig.controller;
          });
        }

        if (this.__injectNavigator) {
          this.__injectNavigator.forEach(({
            service,
            key
          }) => {
            this[key] = {
              nav: navigator$1,
              push: path => {
                navigator$1.push(appConfig.parentRoute + path);
              }
            };
          });
        }
      }

    }

    Result._id = id;
    id++;
    return Result;
  };
}
function ControllerDecorator(config) {
  return function (Target) {
    var _temp;

    return _temp = class Result extends Target {
      constructor(config) {
        super(config);
        this.models = {};
        this.ready = false;
        this.error = false;

        for (let i in this) {
          this.models[i] = e => {
            this[i] = e.target.value;
          };
        }
      }

    }, _temp;
  };
}
function injectDecorator(Service, config = {}) {
  return function (target, key, descriptor) {
    if (!target.__servicesToInject) {
      target.__servicesToInject = [{
        service: Service,
        key
      }];
    } else target.__servicesToInject.push({
      service: Service,
      key
    }); //target[key] = instance.get(Service);


    return descriptor;
  };
}
function injectNavigatorDecorator(Service, config = {}) {
  return function (target, key, descriptor) {
    if (!target.__injectNavigator) {
      target.__injectNavigator = [{
        key
      }];
    } else target.__injectNavigator.push({
      key
    });

    return descriptor;
  };
}
function injectAppConfigDecorator(Service, config = {}) {
  return function (target, key, descriptor) {
    if (!target.__injectAppConfig) {
      target.__injectAppConfig = [{
        key
      }];
    } else target.__injectAppConfig.push({
      key
    }); //target[key] = instance.get(Service);


    return descriptor;
  };
}
function injectControllerDecorator(Service, config = {}) {
  return function (target, key, descriptor) {
    if (!target.__injectController) {
      target.__injectController = [{
        key
      }];
    } else target.__injectController.push({
      key
    }); //target[key] = instance.get(Service);


    return descriptor;
  };
} // TODO inject controller decorator y terminar de exportar y resolver tipado para los controladores y appConfig (especialmente en hooks e inyecciones)

var _class$1, _descriptor$1, _temp$1;
let LayoutService = (_class$1 = (_temp$1 = class LayoutService {
  constructor() {
    _initializerDefineProperty(this, "show", _descriptor$1, this);
  }

  switch() {
    this.show = !this.show;
  }

  enable() {
    this.show = true;
  }

  disable() {
    this.show = false;
  }

}, _temp$1), (_descriptor$1 = _applyDecoratedDescriptor(_class$1.prototype, "show", [observable], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _applyDecoratedDescriptor(_class$1.prototype, "switch", [action], Object.getOwnPropertyDescriptor(_class$1.prototype, "switch"), _class$1.prototype), _applyDecoratedDescriptor(_class$1.prototype, "enable", [action], Object.getOwnPropertyDescriptor(_class$1.prototype, "enable"), _class$1.prototype), _applyDecoratedDescriptor(_class$1.prototype, "disable", [action], Object.getOwnPropertyDescriptor(_class$1.prototype, "disable"), _class$1.prototype)), _class$1);

const RouterCtx = React.createContext({
  parent: ''
});
const AppConfigCtx = React.createContext({
  appId: '',
  controller: undefined,
  parentRoute: '',
  params: {},
  store: {},
  parentApp: undefined
});

const useServiceHook = (Service, opt = {}) => {
  const {
    store
  } = useContext(AppConfigCtx);
  useEffect(() => {
    return () => {
      if (opt.attach) {
        store.destroy(Service);
      }
    };
  }, []);
  return useMemo(() => store.get(Service), [Service]);
};
const useControllerHook = Controller => {
  const {
    controller
  } = useContext(AppConfigCtx);
  return controller;
};
const useAppConfigHook = () => {
  const appConfig = useContext(AppConfigCtx);
  return appConfig;
};
const useRouterHook = () => {
  const {
    parent
  } = useContext(RouterCtx);
};
const useNavigatorHook = () => {
  const {
    parent
  } = useContext(RouterCtx);
  return {
    nav: navigator$2,
    push: path => navigator$2.push(parent + path)
  };
};

const defaultConfig = {
  notFound: {
    default: () => React.createElement("div", null, "Not found"),
    templates: {}
  },
  waitFor: {
    default: () => React.createElement("div", null, "Loading"),
    templates: {}
  },
  wip: {
    default: () => React.createElement("div", null, "WIP"),
    templates: {}
  }
};

class Defaults {
  constructor(defaults) {
    this.setAll = data => {
      this.data = data;
    };

    this.set = (value, key) => {
      this.data[key] = value;
    };

    this.get = key => this.data[key];

    this.data = defaults;
  }

}
const defaultsInstance = new Defaults(defaultConfig);
function setDefaults(defaults) {
  defaultsInstance.setAll(defaults);
}

function component(Target, config = {}) {
  if (config.wait) {
    const wait = config.wait;
    const waitForDefault = defaultsInstance.get('waitFor');
    const Template = wait.component || (wait.template ? waitForDefault.templates[wait.template] : waitForDefault.default);
    const ObserverTarget = observer(Target);
    return observer(props => {
      const isResolved = config.wait.for(props);
      if (!isResolved) return React.createElement(Template, props);else return React.createElement(ObserverTarget, props);
    });
  }

  return observer(Target);
}

const ServiceStore$1 = ServiceStore;
const serviceStore = instance; // Deprecated

const injectService = serviceStore.get;
const LayoutService$1 = LayoutService; // Hooks

const useService = useServiceHook;
const useController = useControllerHook;
const useNavigator = useNavigatorHook;
const useRouter = useRouterHook;
const useAppConfig = useAppConfigHook; // Decorators

const service = ServiceDecorator;
const controller = ControllerDecorator;
const inject = injectDecorator;
const injectNavigator = injectNavigatorDecorator;
const injectAppConfig = injectAppConfigDecorator;
const injectController = injectControllerDecorator;

function runOnEnter(onEnter, params) {
  if (onEnter) {
    if (onEnter.length) for (let i in onEnter) onEnter[i](params);else onEnter(params);
  }
}

function runOnOut(onOut, params) {
  if (onOut) {
    if (onOut.length) for (let i in onOut) onOut[i](params);else onOut(params);
  }
}

function runProtect(protect, params) {
  if (protect) {
    if (protect.length) for (let i in protect) {
      const protectRes = protect[i](params);

      if (protectRes) {
        return protectRes;
      }
    } else {
      const protectRes = protect(params);

      if (protectRes) {
        return protectRes;
      }
    }
  }
}

function createRouteComponent(opt) {
  const Component = opt.component;
  let services = [];
  if (opt.disableLayout) services = !opt.disableLayout.length ? [injectService(opt.disableLayout)] : opt.disableLayout.map(item => {
    return injectService(item);
  });

  const RoutedComponent = props => {
    navigator$1.setRoute(props.location, props.match, props.history); // Crate optional params for onEnter, onOut and guards

    const appConfig = useContext(AppConfigCtx);
    const {
      store,
      controller
    } = appConfig;

    const useService = service => {
      return store.get(Service);
    };

    const useController = () => {
      return controller;
    };

    const useAppConfig = () => {
      return appConfig;
    };

    const params = {
      useController,
      useService,
      useAppConfig
    };
    useEffect(() => {
      runOnEnter(opt.onEnter, params);
      return () => {
        runOnOut(opt.onOut, params);
      };
    }, []);

    if (opt.wait) {
      const isLoading = opt.wait.for();
      return;
    }

    const isProtected = runProtect(opt.guard, params);

    if (isProtected) {
      return React.createElement(Redirect, {
        to: isProtected
      });
    }

    return React.createElement(Component, {
      location: props.location,
      match: props.match,
      history: props.history
    });
  };

  const appConfig = opt.appConfig;
  const FinalComponent = !appConfig ? RoutedComponent : props => {
    const controller = useService(appConfig.controller, {
      attach: !appConfig.keepController
    });
    return React.createElement(RouterCtx.Consumer, null, ({
      parent
    }) => React.createElement(AppConfigCtx.Consumer, null, parentAppConfig => React.createElement(AppConfigCtx.Provider, {
      value: {
        parentApp: parentAppConfig,
        ...appConfig,
        controller,
        store: new ServiceStore({
          parentApp: parentAppConfig,
          ...appConfig,
          controller,
          parentRoute: parent
        }),
        parentRoute: parent
      }
    }, React.createElement(RoutedComponent, props))));
  };
  return React.memo(component(FinalComponent), (prev, next) => prev.location.pathname == next.location.pathname);
}

/**
 * Expose `pathToRegexp`.
 */
var pathToRegexp_1 = pathToRegexp;
var parse_1 = parse;
var compile_1 = compile;
var tokensToFunction_1 = tokensToFunction;
var tokensToRegExp_1 = tokensToRegExp;

/**
 * Default configs.
 */
var DEFAULT_DELIMITER = '/';

/**
 * The main path matching regexp utility.
 *
 * @type {RegExp}
 */
var PATH_REGEXP = new RegExp([
  // Match escaped characters that would otherwise appear in future matches.
  // This allows the user to escape special characters that won't transform.
  '(\\\\.)',
  // Match Express-style parameters and un-named parameters with a prefix
  // and optional suffixes. Matches appear as:
  //
  // ":test(\\d+)?" => ["test", "\d+", undefined, "?"]
  // "(\\d+)"  => [undefined, undefined, "\d+", undefined]
  '(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?'
].join('|'), 'g');

/**
 * Parse a string for the raw tokens.
 *
 * @param  {string}  str
 * @param  {Object=} options
 * @return {!Array}
 */
function parse (str, options) {
  var tokens = [];
  var key = 0;
  var index = 0;
  var path = '';
  var defaultDelimiter = (options && options.delimiter) || DEFAULT_DELIMITER;
  var whitelist = (options && options.whitelist) || undefined;
  var pathEscaped = false;
  var res;

  while ((res = PATH_REGEXP.exec(str)) !== null) {
    var m = res[0];
    var escaped = res[1];
    var offset = res.index;
    path += str.slice(index, offset);
    index = offset + m.length;

    // Ignore already escaped sequences.
    if (escaped) {
      path += escaped[1];
      pathEscaped = true;
      continue
    }

    var prev = '';
    var name = res[2];
    var capture = res[3];
    var group = res[4];
    var modifier = res[5];

    if (!pathEscaped && path.length) {
      var k = path.length - 1;
      var c = path[k];
      var matches = whitelist ? whitelist.indexOf(c) > -1 : true;

      if (matches) {
        prev = c;
        path = path.slice(0, k);
      }
    }

    // Push the current path onto the tokens.
    if (path) {
      tokens.push(path);
      path = '';
      pathEscaped = false;
    }

    var repeat = modifier === '+' || modifier === '*';
    var optional = modifier === '?' || modifier === '*';
    var pattern = capture || group;
    var delimiter = prev || defaultDelimiter;

    tokens.push({
      name: name || key++,
      prefix: prev,
      delimiter: delimiter,
      optional: optional,
      repeat: repeat,
      pattern: pattern
        ? escapeGroup(pattern)
        : '[^' + escapeString(delimiter === defaultDelimiter ? delimiter : (delimiter + defaultDelimiter)) + ']+?'
    });
  }

  // Push any remaining characters.
  if (path || index < str.length) {
    tokens.push(path + str.substr(index));
  }

  return tokens
}

/**
 * Compile a string to a template function for the path.
 *
 * @param  {string}             str
 * @param  {Object=}            options
 * @return {!function(Object=, Object=)}
 */
function compile (str, options) {
  return tokensToFunction(parse(str, options), options)
}

/**
 * Expose a method for transforming tokens into the path function.
 */
function tokensToFunction (tokens, options) {
  // Compile all the tokens into regexps.
  var matches = new Array(tokens.length);

  // Compile all the patterns before compilation.
  for (var i = 0; i < tokens.length; i++) {
    if (typeof tokens[i] === 'object') {
      matches[i] = new RegExp('^(?:' + tokens[i].pattern + ')$', flags(options));
    }
  }

  return function (data, options) {
    var path = '';
    var encode = (options && options.encode) || encodeURIComponent;
    var validate = options ? options.validate !== false : true;

    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];

      if (typeof token === 'string') {
        path += token;
        continue
      }

      var value = data ? data[token.name] : undefined;
      var segment;

      if (Array.isArray(value)) {
        if (!token.repeat) {
          throw new TypeError('Expected "' + token.name + '" to not repeat, but got array')
        }

        if (value.length === 0) {
          if (token.optional) continue

          throw new TypeError('Expected "' + token.name + '" to not be empty')
        }

        for (var j = 0; j < value.length; j++) {
          segment = encode(value[j], token);

          if (validate && !matches[i].test(segment)) {
            throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '"')
          }

          path += (j === 0 ? token.prefix : token.delimiter) + segment;
        }

        continue
      }

      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        segment = encode(String(value), token);

        if (validate && !matches[i].test(segment)) {
          throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but got "' + segment + '"')
        }

        path += token.prefix + segment;
        continue
      }

      if (token.optional) continue

      throw new TypeError('Expected "' + token.name + '" to be ' + (token.repeat ? 'an array' : 'a string'))
    }

    return path
  }
}

/**
 * Escape a regular expression string.
 *
 * @param  {string} str
 * @return {string}
 */
function escapeString (str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, '\\$1')
}

/**
 * Escape the capturing group by escaping special characters and meaning.
 *
 * @param  {string} group
 * @return {string}
 */
function escapeGroup (group) {
  return group.replace(/([=!:$/()])/g, '\\$1')
}

/**
 * Get the flags for a regexp from the options.
 *
 * @param  {Object} options
 * @return {string}
 */
function flags (options) {
  return options && options.sensitive ? '' : 'i'
}

/**
 * Pull out keys from a regexp.
 *
 * @param  {!RegExp} path
 * @param  {Array=}  keys
 * @return {!RegExp}
 */
function regexpToRegexp (path, keys) {
  if (!keys) return path

  // Use a negative lookahead to match only capturing groups.
  var groups = path.source.match(/\((?!\?)/g);

  if (groups) {
    for (var i = 0; i < groups.length; i++) {
      keys.push({
        name: i,
        prefix: null,
        delimiter: null,
        optional: false,
        repeat: false,
        pattern: null
      });
    }
  }

  return path
}

/**
 * Transform an array into a regexp.
 *
 * @param  {!Array}  path
 * @param  {Array=}  keys
 * @param  {Object=} options
 * @return {!RegExp}
 */
function arrayToRegexp (path, keys, options) {
  var parts = [];

  for (var i = 0; i < path.length; i++) {
    parts.push(pathToRegexp(path[i], keys, options).source);
  }

  return new RegExp('(?:' + parts.join('|') + ')', flags(options))
}

/**
 * Create a path regexp from string input.
 *
 * @param  {string}  path
 * @param  {Array=}  keys
 * @param  {Object=} options
 * @return {!RegExp}
 */
function stringToRegexp (path, keys, options) {
  return tokensToRegExp(parse(path, options), keys, options)
}

/**
 * Expose a function for taking tokens and returning a RegExp.
 *
 * @param  {!Array}  tokens
 * @param  {Array=}  keys
 * @param  {Object=} options
 * @return {!RegExp}
 */
function tokensToRegExp (tokens, keys, options) {
  options = options || {};

  var strict = options.strict;
  var start = options.start !== false;
  var end = options.end !== false;
  var delimiter = options.delimiter || DEFAULT_DELIMITER;
  var endsWith = [].concat(options.endsWith || []).map(escapeString).concat('$').join('|');
  var route = start ? '^' : '';

  // Iterate over the tokens and create our regexp string.
  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i];

    if (typeof token === 'string') {
      route += escapeString(token);
    } else {
      var capture = token.repeat
        ? '(?:' + token.pattern + ')(?:' + escapeString(token.delimiter) + '(?:' + token.pattern + '))*'
        : token.pattern;

      if (keys) keys.push(token);

      if (token.optional) {
        if (!token.prefix) {
          route += '(' + capture + ')?';
        } else {
          route += '(?:' + escapeString(token.prefix) + '(' + capture + '))?';
        }
      } else {
        route += escapeString(token.prefix) + '(' + capture + ')';
      }
    }
  }

  if (end) {
    if (!strict) route += '(?:' + escapeString(delimiter) + ')?';

    route += endsWith === '$' ? '$' : '(?=' + endsWith + ')';
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === 'string'
      ? endToken[endToken.length - 1] === delimiter
      : endToken === undefined;

    if (!strict) route += '(?:' + escapeString(delimiter) + '(?=' + endsWith + '))?';
    if (!isEndDelimited) route += '(?=' + escapeString(delimiter) + '|' + endsWith + ')';
  }

  return new RegExp(route, flags(options))
}

/**
 * Normalize the given path string, returning a regular expression.
 *
 * An empty array can be passed in for the keys, which will hold the
 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
 *
 * @param  {(string|RegExp|Array)} path
 * @param  {Array=}                keys
 * @param  {Object=}               options
 * @return {!RegExp}
 */
function pathToRegexp (path, keys, options) {
  if (path instanceof RegExp) {
    return regexpToRegexp(path, keys)
  }

  if (Array.isArray(path)) {
    return arrayToRegexp(/** @type {!Array} */ (path), keys, options)
  }

  return stringToRegexp(/** @type {string} */ (path), keys, options)
}
pathToRegexp_1.parse = parse_1;
pathToRegexp_1.compile = compile_1;
pathToRegexp_1.tokensToFunction = tokensToFunction_1;
pathToRegexp_1.tokensToRegExp = tokensToRegExp_1;

function makeRoute(item, index) {
  // if wip is true display 'wip' template
  if (item.wip) {
    const WipComponent = defaultsInstance.get('wip').default;
    return React.createElement(Route, {
      exact: item.exact,
      key: index,
      path: item.path,
      component: WipComponent
    });
  } // if "redirect" is a path, change the route by the redirect string otherwise it doesn't anything


  if (item.redirect) {
    console.log(pathToRegexp_1.compile(item.redirect)(navigator$1.match.params));

    item.component = () => React.createElement(Redirect, {
      to: pathToRegexp_1.compile(item.redirect)(navigator$1.match.params)
    });
  }

  return React.createElement(RouterCtx.Consumer, null, ({
    parent
  }) => React.createElement(RouterCtx.Provider, {
    value: {
      parent: parent + item.path
    }
  }, React.createElement(Route, {
    exact: item.exact,
    key: index,
    path: parent + item.path,
    component: createRouteComponent(item)
  })));
}

function sortRoutes(routes) {
  const nested = routes.map(route => {
    return { ...route,
      ...{
        _nested: route.path.split('/').filter(ch => ch != '').length
      }
    };
  });
  return nested.sort(({
    _nested: r1
  }, {
    _nested: r2
  }) => r1 > r2 ? -1 : 1);
}

function createRouter(router, config = {}) {
  const sortedRouter = sortRoutes(router);
  const routesComponent = sortedRouter.map(makeRoute);

  const ResultComponent = ({
    routerConfig
  }) => {
    const notFoundTemplate = config.notFoundTemplate;
    const notFoundComponent = config.notFoundComponent;
    const notFoundDefault = defaultsInstance.get('notFound');
    return React.createElement(Switch, null, routesComponent, config.default ? makeRoute({ ...config.default,
      ...{
        path: '*'
      }
    }, 'default') : React.createElement(Route, {
      path: "*",
      component: notFoundComponent || (notFoundTemplate ? notFoundDefault.templates[notFoundTemplate] : notFoundDefault.default)
    }));
  };

  return ResultComponent;
}

const navigator$2 = navigator$1;
const Navigator$1 = Navigator;

export { AppConfigCtx, LayoutService$1 as LayoutService, Navigator$1 as Navigator, NotFound, RouterCtx, ServiceStore$1 as ServiceStore, component, controller, createRouter, inject, injectAppConfig, injectController, injectNavigator, injectService, navigator$2 as navigator, service, serviceStore, setDefaults, useAppConfig, useController, useNavigator, useRouter, useService };
//# sourceMappingURL=index.es.js.map
