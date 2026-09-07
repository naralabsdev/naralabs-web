(function () {
  if (window.__naralabsNavigationProgress) return;
  window.__naralabsNavigationProgress = true;

  var BRAND = "#054fbf";
  var progress = 0;
  var bar = null;
  var trickleTimer = null;
  var finishTimer = null;

  function ensureBar() {
    if (bar) return;

    var root = document.createElement("div");
    root.id = "naralabs-nav-progress";
    root.style.pointerEvents = "none";
    root.style.position = "fixed";
    root.style.zIndex = "1600";
    root.style.top = "0";
    root.style.left = "0";
    root.style.width = "100%";
    root.style.height = "3px";

    bar = document.createElement("div");
    bar.style.background = BRAND;
    bar.style.position = "fixed";
    bar.style.zIndex = "1600";
    bar.style.top = "0";
    bar.style.left = "0";
    bar.style.height = "3px";
    bar.style.width = "0%";
    bar.style.transition = "width 200ms ease";

    var peg = document.createElement("div");
    peg.style.display = "block";
    peg.style.position = "absolute";
    peg.style.right = "0";
    peg.style.width = "100px";
    peg.style.height = "100%";
    peg.style.boxShadow = "0 0 10px " + BRAND + ", 0 0 5px " + BRAND;
    peg.style.opacity = "1";
    peg.style.transform = "rotate(3deg) translate(0px, -4px)";

    bar.appendChild(peg);
    root.appendChild(bar);
    document.documentElement.appendChild(root);
  }

  function setProgress(value) {
    progress = Math.max(0, Math.min(1, value));
    ensureBar();
    bar.style.width = String(progress * 100) + "%";
  }

  function clearTimers() {
    if (trickleTimer) {
      clearInterval(trickleTimer);
      trickleTimer = null;
    }
    if (finishTimer) {
      clearTimeout(finishTimer);
      finishTimer = null;
    }
  }

  function finish() {
    clearTimers();
    setProgress(1);
    window.setTimeout(function () {
      if (bar) bar.style.width = "0%";
      progress = 0;
    }, 200);
  }

  function start() {
    clearTimers();
    setProgress(0.08);
    trickleTimer = window.setInterval(function () {
      setProgress(progress + (1 - progress) * 0.02);
    }, 200);
    finishTimer = window.setTimeout(finish, 10000);
  }

  function findAnchor(target) {
    var node = target instanceof Element ? target : null;
    while (node && node.tagName.toLowerCase() !== "a") {
      node = node.parentElement;
    }
    return node instanceof HTMLAnchorElement ? node : null;
  }

  function shouldStart(event, anchor) {
    var href = anchor.href;
    if (!href) return false;

    var current = window.location.href;
    var sameDocument =
      anchor.pathname === window.location.pathname &&
      anchor.search === window.location.search;

    if (sameDocument && anchor.hash && anchor.hash !== window.location.hash) {
      return false;
    }

    if (anchor.target === "_blank") return false;
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return false;

    var blocked = ["tel:", "mailto:", "sms:", "blob:", "download:"];
    for (var i = 0; i < blocked.length; i += 1) {
      if (href.indexOf(blocked[i]) === 0) return false;
    }

    try {
      var url = new URL(href);
      if (url.origin !== window.location.origin) return false;
    } catch (_error) {
      return false;
    }

    return href !== current;
  }

  function onClick(event) {
    var anchor = findAnchor(event.target);
    if (!anchor || !shouldStart(event, anchor)) return;
    start();
  }

  function patchHistory(method) {
    var original = history[method].bind(history);
    history[method] = function () {
      original.apply(history, arguments);
      queueMicrotask(finish);
    };
    return original;
  }

  var originalPushState = patchHistory("pushState");
  var originalReplaceState = patchHistory("replaceState");

  document.addEventListener("click", onClick, true);
  window.addEventListener("popstate", finish);
  window.addEventListener("pagehide", finish);

  window.__naralabsNavigationProgressCleanup = function () {
    document.removeEventListener("click", onClick, true);
    window.removeEventListener("popstate", finish);
    window.removeEventListener("pagehide", finish);
    history.pushState = originalPushState;
    history.replaceState = originalReplaceState;
    clearTimers();
    finish();
  };
})();
