/***********************************************
 * vlthemes
 ***********************************************/

"use strict";

/**
 * Initialize main helper object
 */
var vltJS = {
  window: jQuery(window),
  document: jQuery(document),
  html: jQuery("html"),
  body: jQuery("body"),
  is_safari: /^((?!chrome|android).)*safari/i.test(navigator.userAgent),
  is_firefox: navigator.userAgent.toLowerCase().indexOf("firefox") > -1,
  is_chrome:
    /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor),
  is_ie10: navigator.appVersion.indexOf("MSIE 10") !== -1,
  transitionEnd:
    "transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd",
  animIteration:
    "animationiteration webkitAnimationIteration oAnimationIteration MSAnimationIteration",
  animationEnd: "animationend webkitAnimationEnd",
};

/**
 * Detects whether user is viewing site from a mobile device
 */
vltJS.isMobile = {
  Android: function () {
    return navigator.userAgent.match(/Android/i);
  },
  BlackBerry: function () {
    return navigator.userAgent.match(/BlackBerry/i);
  },
  iOS: function () {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  },
  Opera: function () {
    return navigator.userAgent.match(/Opera Mini/i);
  },
  Windows: function () {
    return navigator.userAgent.match(/IEMobile/i);
  },
  any: function () {
    return (
      vltJS.isMobile.Android() ||
      vltJS.isMobile.BlackBerry() ||
      vltJS.isMobile.iOS() ||
      vltJS.isMobile.Opera() ||
      vltJS.isMobile.Windows()
    );
  },
};

/**
 * Debounce resize
 */
var resizeArr = [];
var resizeTimeout;
vltJS.window.on("load resize orientationchange", function (e) {
  if (resizeArr.length) {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function () {
      for (var i = 0; i < resizeArr.length; i++) {
        resizeArr[i](e);
      }
    }, 250);
  }
});

vltJS.debounceResize = function (callback) {
  if (typeof callback === "function") {
    resizeArr.push(callback);
  } else {
    window.dispatchEvent(new Event("resize"));
  }
};

vltJS.addLedingZero = function (number) {
  return ("0" + number).slice(-2);
};

/**
 * Throttle scroll
 */
var throttleArr = [];
var didScroll;
var delta = 5;
var lastScrollTop = 0;

vltJS.window.on("load resize scroll orientationchange", function () {
  if (throttleArr.length) {
    didScroll = true;
  }
});

function hasScrolled() {
  var scrollTop = vltJS.window.scrollTop(),
    windowHeight = vltJS.window.height(),
    documentHeight = vltJS.document.height(),
    scrollState = "";

  // Make sure they scroll more than delta
  if (Math.abs(lastScrollTop - scrollTop) <= delta) {
    return;
  }

  if (scrollTop > lastScrollTop) {
    scrollState = "down";
  } else if (scrollTop < lastScrollTop) {
    scrollState = "up";
  } else {
    scrollState = "none";
  }

  if (scrollTop === 0) {
    scrollState = "start";
  } else if (scrollTop >= documentHeight - windowHeight) {
    scrollState = "end";
  }

  for (var i in throttleArr) {
    if (typeof throttleArr[i] === "function") {
      throttleArr[i](scrollState, scrollTop, lastScrollTop, vltJS.window);
    }
  }

  lastScrollTop = scrollTop;
}

setInterval(function () {
  if (didScroll) {
    didScroll = false;
    window.requestAnimationFrame(hasScrolled);
  }
}, 250);

vltJS.throttleScroll = function (callback) {
  if (typeof callback === "function") {
    throttleArr.push(callback);
  }
};

/**
 * VAR polyfill
 */
if (typeof cssVars !== "undefined") {
  cssVars({
    onlyVars: true,
  });
}
