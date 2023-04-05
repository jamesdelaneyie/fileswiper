/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./addFolderToDom.js":
/*!***************************!*\
  !*** ./addFolderToDom.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "addFolderToDom": () => (/* binding */ addFolderToDom)
/* harmony export */ });
var addFolderToDom = function addFolderToDom(location) {
  var locationParent = document.getElementById("locations");
  var div = document.createElement("div");
  div.setAttribute("data-folder-location", location);
  div.classList.add("location", "ui-button", "bg-white", "border-3", "border-slate-300", "p-10", "text-sm", "h-40", "w-40", "rounded-full", "text-center", "border", "flex", "items-center", "justify-center", "hover:cursor-pointer");
  div.setAttribute("draggable", true);
  //
  var innerDiv = document.createElement("div");
  innerDiv.setAttribute("class", "text-center pointer-events-none");
  var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 50 50");
  svg.setAttribute("class", "fill-slate-400 w-9 inline");
  var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M 5 4 C 3.3550302 4 2 5.3550302 2 7 L 2 16 L 2 18 L 2 43 C 2 44.64497 3.3550302 46 5 46 L 45 46 C 46.64497 46 48 44.64497 48 43 L 48 19 L 48 16 L 48 11 C 48 9.3550302 46.64497 8 45 8 L 18 8 C 18.08657 8 17.96899 8.000364 17.724609 7.71875 C 17.480227 7.437136 17.179419 6.9699412 16.865234 6.46875 C 16.55105 5.9675588 16.221777 5.4327899 15.806641 4.9628906 C 15.391504 4.4929914 14.818754 4 14 4 L 5 4 z M 5 6 L 14 6 C 13.93925 6 14.06114 6.00701 14.308594 6.2871094 C 14.556051 6.5672101 14.857231 7.0324412 15.169922 7.53125 C 15.482613 8.0300588 15.806429 8.562864 16.212891 9.03125 C 16.619352 9.499636 17.178927 10 18 10 L 45 10 C 45.56503 10 46 10.43497 46 11 L 46 13.1875 C 45.685108 13.07394 45.351843 13 45 13 L 5 13 C 4.6481575 13 4.3148915 13.07394 4 13.1875 L 4 7 C 4 6.4349698 4.4349698 6 5 6 z M 5 15 L 45 15 C 45.56503 15 46 15.43497 46 16 L 46 19 L 46 43 C 46 43.56503 45.56503 44 45 44 L 5 44 C 4.4349698 44 4 43.56503 4 43 L 4 18 L 4 16 C 4 15.43497 4.4349698 15 5 15 z");
  svg.appendChild(path);
  innerDiv.appendChild(svg);
  var locationText = location.split("/").pop();
  var locationTextDiv = document.createElement("span");
  locationTextDiv.innerText = locationText;
  innerDiv.appendChild(locationTextDiv);
  div.appendChild(innerDiv);
  // Add Event Listeners
  // Left click
  div.addEventListener("click", function (e) {
    window.versions.openDialog();
  });
  // Right click
  div.addEventListener("contextmenu", function (e) {
    e.preventDefault();
    e.target.remove();
    var localLocations = JSON.parse(localStorage.getItem("locations"));
    var location = e.target.getAttribute("data-folder-location");
    var newLocations = localLocations.filter(function (item) {
      return item !== location;
    });
    localStorage.setItem("locations", JSON.stringify(newLocations));
  });
  locationParent.appendChild(div);
};

/***/ }),

/***/ "./createCurrentFile.js":
/*!******************************!*\
  !*** ./createCurrentFile.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createCurrentFile": () => (/* binding */ createCurrentFile)
/* harmony export */ });
var createCurrentFile = function createCurrentFile() {
  var currentFile = document.createElement("li");
  currentFile.setAttribute("id", "current-file");
  currentFile.classList.add("ui-button", "bg-white", "border-slate-300", "w-60", "h-80", "z-50", "border-2", "rounded", "relative", "text-center", "hover:cursor-move");
  var currentFilePreviewImage = document.createElement("img");
  currentFilePreviewImage.setAttribute("id", "current-file-preview");
  currentFile.appendChild(currentFilePreviewImage);
  var currentFileTextTitle = document.createElement("span");
  currentFileTextTitle.setAttribute("id", "current-file-name");
  currentFile.appendChild(currentFileTextTitle);
  var files = document.getElementById("files");
  files.appendChild(currentFile);
};

/***/ }),

/***/ "./dragAndDrop.js":
/*!************************!*\
  !*** ./dragAndDrop.js ***!
  \************************/
/***/ (function() {

var _this = this;
var handleDragStart = function handleDragStart(e) {
  _this.style.opacity = "0.1";
  _this.style.boxShadow = "none";
  _this.style.dropShadow = "none";
  _this.style.cursor = "move";
  _this.style.filter = "drop-shadow(0 0 0 #000000)";
};
var handleDragEnd = function handleDragEnd(e, files, rootFolderSave) {
  _this.style.opacity = "1";
  _this.style.boxShadow = "none";
  _this.style.dropShadow = "none";
  _this.style.cursor = "move";
  _this.style.filter = "drop-shadow(0 0 0 #000000)";
  var filename = e.target.innerText;
  var dropTarget = document.elementFromPoint(e.clientX, e.clientY);
  var location = dropTarget.getAttribute("data-folder-location");
  console.log(filename, dropTarget, location);
  if (location === rootFolderSave) {
    console.log('same location');
    return;
  }
  if (location === "skip") {
    files.shift();
    files = updateFileList(files);
  }
  if (location) {
    window.fileswiper.fileDropped({
      filename: filename,
      location: location
    });
    files.shift();
    files = updateFileList(files);
  }
};

/***/ }),

/***/ "./updateFileList.js":
/*!***************************!*\
  !*** ./updateFileList.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "updateFileList": () => (/* binding */ updateFileList)
/* harmony export */ });
/* harmony import */ var _createCurrentFile_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./createCurrentFile.js */ "./createCurrentFile.js");

var updateFileList = function updateFileList(fileList) {
  //console.log(fileList);

  if (fileList.length > 0) {
    var currentFile = fileList[0];
    var currentFileName = document.getElementById("current-file-name");

    // if current file name is undefined then create it
    if (currentFileName === null) {
      (0,_createCurrentFile_js__WEBPACK_IMPORTED_MODULE_0__.createCurrentFile)();
      currentFileName = document.getElementById("current-file-name");
    }
    currentFileName.innerText = currentFile;
    currentFileName.classList.add("absolute", "bottom-0", "w-full", "left-0", "text-xs", "bg-white", "pt-1", "pb-1");

    //let currentFilePreview = document.getElementById("current-file-preview");
    //currentFilePreview.src = currentFile;

    /*let nextItems = document.getElementsByClassName("next-file");
    for (let i = 0; i < nextItems.length; i++) {
        const nextItem = nextItems[i];
        const nextItemSpan = nextItem.getElementsByTagName("span")[0];
        nextItemSpan.innerText = fileList[i + 1];
        //if there is no next file then hide the next item
        if(fileList[i + 1] === undefined) {
            //console.log('no next file')
            nextItem.style.display = "none";
        }
    }*/
  }

  if (fileList.length === 0) {
    // create a div with the congrats emoji
    //remove the current file name
    var _currentFileName = document.getElementById("current-file");
    if (_currentFileName) {
      _currentFileName.remove();
    }
    var congratsDiv = document.getElementsByClassName("congrats")[0];
    if (!congratsDiv) {
      var _congratsDiv = document.createElement("div");
      _congratsDiv.classList.add("congrats");
      var congratsIcon = document.createElement("span");
      congratsIcon.classList.add("congrats-icon");
      congratsIcon.innerText = "🎉";
      _congratsDiv.appendChild(congratsIcon);
      var congratsText = document.createElement("span");
      congratsText.classList.add("congrats-text", "text-slate-600", "mt-5", "block");
      congratsText.innerText = "This folder has no files! Pick another folder below.";
      _congratsDiv.appendChild(congratsText);
      var files = document.getElementById("files");
      files.appendChild(_congratsDiv);
    }
  } else {
    //remove the congrats div
    var _congratsDiv2 = document.getElementsByClassName("congrats")[0];
    if (_congratsDiv2) {
      _congratsDiv2.remove();
    }
  }
  return fileList;

  //console.log(files)

  //let currentFilePreview = document.getElementById("current-file-preview");
  //encode the path to make it work with atom://
  //firstFile = encodeURIComponent(firstFile);
  //let fullPath = 'file://' + locationAndFiles.location + '/' + firstFile;
  //currentFilePreview.src = fullPath
};

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!*********************!*\
  !*** ./renderer.js ***!
  \*********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _addFolderToDom_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./addFolderToDom.js */ "./addFolderToDom.js");
/* harmony import */ var _createCurrentFile_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./createCurrentFile.js */ "./createCurrentFile.js");
/* harmony import */ var _updateFileList_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./updateFileList.js */ "./updateFileList.js");
/* harmony import */ var _dragAndDrop_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./dragAndDrop.js */ "./dragAndDrop.js");
/* harmony import */ var _dragAndDrop_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_dragAndDrop_js__WEBPACK_IMPORTED_MODULE_3__);
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }





var func = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
    var files, listOfFolders, i, quitButton, folderSelect;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          files = []; // Load the last folders used by the user    
          listOfFolders = JSON.parse(localStorage.getItem("locations"));
          if (listOfFolders !== null) {
            for (i = 0; i < listOfFolders.length; i++) {
              // Add the folders used by the user to the DOM
              (0,_addFolderToDom_js__WEBPACK_IMPORTED_MODULE_0__.addFolderToDom)(listOfFolders[i]);
            }
          }

          //
          // Event handlers
          // 

          // Drag events for files
          /*let items = document.querySelectorAll("#files li");
          items.forEach(function (item) {
          	item.addEventListener("dragstart", handleDragStart);
          	item.addEventListener("dragend", handleDragEnd);
          });
              // Undo button
             let undoButton = document.getElementById("undo");
             undoButton.addEventListener("click", () => {
                 window.fileswiper.undo();
             })*/

          // Quit button
          quitButton = document.getElementById("quit");
          quitButton.addEventListener("click", function () {
            window.fileswiper.quit();
          });

          // Add folder button
          /*let addFolder = document.getElementById("add-folder");
          addFolder.addEventListener("click", () => {
              window.fileswiper.openDialog();
          })
           // Skip Button / Skip Area
          let skipArea = document.getElementById("skip");
          skipArea.addEventListener("dragover", (e) => {
              e.preventDefault();
          })*/

          // Select root folder
          folderSelect = document.getElementById("folder-select");
          folderSelect.addEventListener("click", function () {
            window.fileswiper.openRootDialog();
          });

          // Save the config to local storage
          window.fileswiper.sendConfig(function (event, config) {
            localStorage.setItem("config", JSON.stringify(config));
          });

          // Handle the root folder selection
          window.fileswiper.selectRootFolder(function (event, locationAndFiles) {
            //console.log(locationAndFiles)

            if (typeof locationAndFiles.location === "undefined") {
              return;
            }

            //remove the intro screen
            var introScreen = document.getElementById("intro-screen");
            introScreen.style.display = "none";
            var filesList = locationAndFiles.files;

            //console.log(filesList)
            files = (0,_updateFileList_js__WEBPACK_IMPORTED_MODULE_2__.updateFileList)(filesList);
            if (filesList.length > 0) {
              //createCurrentFile()

              var locationText = locationAndFiles.location.split("/");
              locationText = locationText[locationText.length - 1];
              var rootFolder = document.getElementById("current-file");
              //rootFolder.setAttribute('data-content', locationText);
            }

            localStorage.setItem("root-folder", JSON.stringify(locationAndFiles.location));

            //console.log(files)
          });

          window.fileswiper.sendPreviewImage(function (event, image) {
            var currentFilePreview = document.getElementById("current-file-preview");
            currentFilePreview.src = image;
          });
          window.fileswiper.sendDocImage(function (event, image) {
            //console.log(image)
            //create new webview element and set the src to the image
            /*let webview = document.createElement("webview");
            //get the root folder location
            let rootFolderSave = JSON.parse(localStorage.getItem("root-folder"));
            let fullPath = 'file://' + rootFolderSave + '/' + image;
            webview.setAttribute("src", fullPath);
            webview.setAttribute("style", "width: 100%; height: 100%;");
            webview.setAttribute("nodeintegration", "true");
            webview.setAttribute("plugins", "true");
            webview.setAttribute("allowpopups", "true");
            webview.setAttribute("webpreferences", "allowRunningInsecureContent");
            webview.setAttribute("webpreferences", "allowDisplayingInsecureContent");
            //add the webview to the dom
            let preview = document.getElementById("files");
            preview.appendChild(webview);*/
          });

          // Handle the addition of a new folder to the DOM
          // Add it to the local storage for the user
          window.fileswiper.folderLocation(function (event, location) {
            if (typeof location === "undefined") {
              return;
            }
            var locationText = location.split("/");
            locationText = locationText[locationText.length - 1];
            var locations = JSON.parse(localStorage.getItem("locations"));
            if (locations === null) {
              locations = [];
            }
            locations.push(location);
            localStorage.setItem("locations", JSON.stringify(locations));
            (0,_addFolderToDom_js__WEBPACK_IMPORTED_MODULE_0__.addFolderToDom)(location, locationText);
          });
        case 12:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function func() {
    return _ref.apply(this, arguments);
  };
}();
func();
})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map