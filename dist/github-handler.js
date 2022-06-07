var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/web-streams-polyfill/dist/ponyfill.es2018.js
var require_ponyfill_es2018 = __commonJS({
  "node_modules/web-streams-polyfill/dist/ponyfill.es2018.js"(exports, module2) {
    (function(global2, factory) {
      typeof exports === "object" && typeof module2 !== "undefined" ? factory(exports) : typeof define === "function" && define.amd ? define(["exports"], factory) : (global2 = typeof globalThis !== "undefined" ? globalThis : global2 || self, factory(global2.WebStreamsPolyfill = {}));
    })(exports, function(exports2) {
      "use strict";
      const SymbolPolyfill = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? Symbol : (description) => `Symbol(${description})`;
      function noop2() {
        return void 0;
      }
      function getGlobals() {
        if (typeof self !== "undefined") {
          return self;
        } else if (typeof window !== "undefined") {
          return window;
        } else if (typeof global !== "undefined") {
          return global;
        }
        return void 0;
      }
      const globals = getGlobals();
      function typeIsObject(x2) {
        return typeof x2 === "object" && x2 !== null || typeof x2 === "function";
      }
      const rethrowAssertionErrorRejection = noop2;
      const originalPromise = Promise;
      const originalPromiseThen = Promise.prototype.then;
      const originalPromiseResolve = Promise.resolve.bind(originalPromise);
      const originalPromiseReject = Promise.reject.bind(originalPromise);
      function newPromise(executor) {
        return new originalPromise(executor);
      }
      function promiseResolvedWith(value) {
        return originalPromiseResolve(value);
      }
      function promiseRejectedWith(reason) {
        return originalPromiseReject(reason);
      }
      function PerformPromiseThen(promise, onFulfilled, onRejected) {
        return originalPromiseThen.call(promise, onFulfilled, onRejected);
      }
      function uponPromise(promise, onFulfilled, onRejected) {
        PerformPromiseThen(PerformPromiseThen(promise, onFulfilled, onRejected), void 0, rethrowAssertionErrorRejection);
      }
      function uponFulfillment(promise, onFulfilled) {
        uponPromise(promise, onFulfilled);
      }
      function uponRejection(promise, onRejected) {
        uponPromise(promise, void 0, onRejected);
      }
      function transformPromiseWith(promise, fulfillmentHandler, rejectionHandler) {
        return PerformPromiseThen(promise, fulfillmentHandler, rejectionHandler);
      }
      function setPromiseIsHandledToTrue(promise) {
        PerformPromiseThen(promise, void 0, rethrowAssertionErrorRejection);
      }
      const queueMicrotask = (() => {
        const globalQueueMicrotask = globals && globals.queueMicrotask;
        if (typeof globalQueueMicrotask === "function") {
          return globalQueueMicrotask;
        }
        const resolvedPromise = promiseResolvedWith(void 0);
        return (fn) => PerformPromiseThen(resolvedPromise, fn);
      })();
      function reflectCall(F2, V, args) {
        if (typeof F2 !== "function") {
          throw new TypeError("Argument is not a function");
        }
        return Function.prototype.apply.call(F2, V, args);
      }
      function promiseCall(F2, V, args) {
        try {
          return promiseResolvedWith(reflectCall(F2, V, args));
        } catch (value) {
          return promiseRejectedWith(value);
        }
      }
      const QUEUE_MAX_ARRAY_SIZE = 16384;
      class SimpleQueue {
        constructor() {
          this._cursor = 0;
          this._size = 0;
          this._front = {
            _elements: [],
            _next: void 0
          };
          this._back = this._front;
          this._cursor = 0;
          this._size = 0;
        }
        get length() {
          return this._size;
        }
        push(element) {
          const oldBack = this._back;
          let newBack = oldBack;
          if (oldBack._elements.length === QUEUE_MAX_ARRAY_SIZE - 1) {
            newBack = {
              _elements: [],
              _next: void 0
            };
          }
          oldBack._elements.push(element);
          if (newBack !== oldBack) {
            this._back = newBack;
            oldBack._next = newBack;
          }
          ++this._size;
        }
        shift() {
          const oldFront = this._front;
          let newFront = oldFront;
          const oldCursor = this._cursor;
          let newCursor = oldCursor + 1;
          const elements = oldFront._elements;
          const element = elements[oldCursor];
          if (newCursor === QUEUE_MAX_ARRAY_SIZE) {
            newFront = oldFront._next;
            newCursor = 0;
          }
          --this._size;
          this._cursor = newCursor;
          if (oldFront !== newFront) {
            this._front = newFront;
          }
          elements[oldCursor] = void 0;
          return element;
        }
        forEach(callback) {
          let i2 = this._cursor;
          let node = this._front;
          let elements = node._elements;
          while (i2 !== elements.length || node._next !== void 0) {
            if (i2 === elements.length) {
              node = node._next;
              elements = node._elements;
              i2 = 0;
              if (elements.length === 0) {
                break;
              }
            }
            callback(elements[i2]);
            ++i2;
          }
        }
        peek() {
          const front = this._front;
          const cursor = this._cursor;
          return front._elements[cursor];
        }
      }
      function ReadableStreamReaderGenericInitialize(reader, stream) {
        reader._ownerReadableStream = stream;
        stream._reader = reader;
        if (stream._state === "readable") {
          defaultReaderClosedPromiseInitialize(reader);
        } else if (stream._state === "closed") {
          defaultReaderClosedPromiseInitializeAsResolved(reader);
        } else {
          defaultReaderClosedPromiseInitializeAsRejected(reader, stream._storedError);
        }
      }
      function ReadableStreamReaderGenericCancel(reader, reason) {
        const stream = reader._ownerReadableStream;
        return ReadableStreamCancel(stream, reason);
      }
      function ReadableStreamReaderGenericRelease(reader) {
        if (reader._ownerReadableStream._state === "readable") {
          defaultReaderClosedPromiseReject(reader, new TypeError(`Reader was released and can no longer be used to monitor the stream's closedness`));
        } else {
          defaultReaderClosedPromiseResetToRejected(reader, new TypeError(`Reader was released and can no longer be used to monitor the stream's closedness`));
        }
        reader._ownerReadableStream._reader = void 0;
        reader._ownerReadableStream = void 0;
      }
      function readerLockException(name) {
        return new TypeError("Cannot " + name + " a stream using a released reader");
      }
      function defaultReaderClosedPromiseInitialize(reader) {
        reader._closedPromise = newPromise((resolve, reject) => {
          reader._closedPromise_resolve = resolve;
          reader._closedPromise_reject = reject;
        });
      }
      function defaultReaderClosedPromiseInitializeAsRejected(reader, reason) {
        defaultReaderClosedPromiseInitialize(reader);
        defaultReaderClosedPromiseReject(reader, reason);
      }
      function defaultReaderClosedPromiseInitializeAsResolved(reader) {
        defaultReaderClosedPromiseInitialize(reader);
        defaultReaderClosedPromiseResolve(reader);
      }
      function defaultReaderClosedPromiseReject(reader, reason) {
        if (reader._closedPromise_reject === void 0) {
          return;
        }
        setPromiseIsHandledToTrue(reader._closedPromise);
        reader._closedPromise_reject(reason);
        reader._closedPromise_resolve = void 0;
        reader._closedPromise_reject = void 0;
      }
      function defaultReaderClosedPromiseResetToRejected(reader, reason) {
        defaultReaderClosedPromiseInitializeAsRejected(reader, reason);
      }
      function defaultReaderClosedPromiseResolve(reader) {
        if (reader._closedPromise_resolve === void 0) {
          return;
        }
        reader._closedPromise_resolve(void 0);
        reader._closedPromise_resolve = void 0;
        reader._closedPromise_reject = void 0;
      }
      const AbortSteps = SymbolPolyfill("[[AbortSteps]]");
      const ErrorSteps = SymbolPolyfill("[[ErrorSteps]]");
      const CancelSteps = SymbolPolyfill("[[CancelSteps]]");
      const PullSteps = SymbolPolyfill("[[PullSteps]]");
      const NumberIsFinite = Number.isFinite || function(x2) {
        return typeof x2 === "number" && isFinite(x2);
      };
      const MathTrunc = Math.trunc || function(v) {
        return v < 0 ? Math.ceil(v) : Math.floor(v);
      };
      function isDictionary(x2) {
        return typeof x2 === "object" || typeof x2 === "function";
      }
      function assertDictionary(obj, context) {
        if (obj !== void 0 && !isDictionary(obj)) {
          throw new TypeError(`${context} is not an object.`);
        }
      }
      function assertFunction(x2, context) {
        if (typeof x2 !== "function") {
          throw new TypeError(`${context} is not a function.`);
        }
      }
      function isObject(x2) {
        return typeof x2 === "object" && x2 !== null || typeof x2 === "function";
      }
      function assertObject(x2, context) {
        if (!isObject(x2)) {
          throw new TypeError(`${context} is not an object.`);
        }
      }
      function assertRequiredArgument(x2, position, context) {
        if (x2 === void 0) {
          throw new TypeError(`Parameter ${position} is required in '${context}'.`);
        }
      }
      function assertRequiredField(x2, field, context) {
        if (x2 === void 0) {
          throw new TypeError(`${field} is required in '${context}'.`);
        }
      }
      function convertUnrestrictedDouble(value) {
        return Number(value);
      }
      function censorNegativeZero(x2) {
        return x2 === 0 ? 0 : x2;
      }
      function integerPart(x2) {
        return censorNegativeZero(MathTrunc(x2));
      }
      function convertUnsignedLongLongWithEnforceRange(value, context) {
        const lowerBound = 0;
        const upperBound = Number.MAX_SAFE_INTEGER;
        let x2 = Number(value);
        x2 = censorNegativeZero(x2);
        if (!NumberIsFinite(x2)) {
          throw new TypeError(`${context} is not a finite number`);
        }
        x2 = integerPart(x2);
        if (x2 < lowerBound || x2 > upperBound) {
          throw new TypeError(`${context} is outside the accepted range of ${lowerBound} to ${upperBound}, inclusive`);
        }
        if (!NumberIsFinite(x2) || x2 === 0) {
          return 0;
        }
        return x2;
      }
      function assertReadableStream(x2, context) {
        if (!IsReadableStream(x2)) {
          throw new TypeError(`${context} is not a ReadableStream.`);
        }
      }
      function AcquireReadableStreamDefaultReader(stream) {
        return new ReadableStreamDefaultReader(stream);
      }
      function ReadableStreamAddReadRequest(stream, readRequest) {
        stream._reader._readRequests.push(readRequest);
      }
      function ReadableStreamFulfillReadRequest(stream, chunk, done) {
        const reader = stream._reader;
        const readRequest = reader._readRequests.shift();
        if (done) {
          readRequest._closeSteps();
        } else {
          readRequest._chunkSteps(chunk);
        }
      }
      function ReadableStreamGetNumReadRequests(stream) {
        return stream._reader._readRequests.length;
      }
      function ReadableStreamHasDefaultReader(stream) {
        const reader = stream._reader;
        if (reader === void 0) {
          return false;
        }
        if (!IsReadableStreamDefaultReader(reader)) {
          return false;
        }
        return true;
      }
      class ReadableStreamDefaultReader {
        constructor(stream) {
          assertRequiredArgument(stream, 1, "ReadableStreamDefaultReader");
          assertReadableStream(stream, "First parameter");
          if (IsReadableStreamLocked(stream)) {
            throw new TypeError("This stream has already been locked for exclusive reading by another reader");
          }
          ReadableStreamReaderGenericInitialize(this, stream);
          this._readRequests = new SimpleQueue();
        }
        get closed() {
          if (!IsReadableStreamDefaultReader(this)) {
            return promiseRejectedWith(defaultReaderBrandCheckException("closed"));
          }
          return this._closedPromise;
        }
        cancel(reason = void 0) {
          if (!IsReadableStreamDefaultReader(this)) {
            return promiseRejectedWith(defaultReaderBrandCheckException("cancel"));
          }
          if (this._ownerReadableStream === void 0) {
            return promiseRejectedWith(readerLockException("cancel"));
          }
          return ReadableStreamReaderGenericCancel(this, reason);
        }
        read() {
          if (!IsReadableStreamDefaultReader(this)) {
            return promiseRejectedWith(defaultReaderBrandCheckException("read"));
          }
          if (this._ownerReadableStream === void 0) {
            return promiseRejectedWith(readerLockException("read from"));
          }
          let resolvePromise;
          let rejectPromise;
          const promise = newPromise((resolve, reject) => {
            resolvePromise = resolve;
            rejectPromise = reject;
          });
          const readRequest = {
            _chunkSteps: (chunk) => resolvePromise({ value: chunk, done: false }),
            _closeSteps: () => resolvePromise({ value: void 0, done: true }),
            _errorSteps: (e2) => rejectPromise(e2)
          };
          ReadableStreamDefaultReaderRead(this, readRequest);
          return promise;
        }
        releaseLock() {
          if (!IsReadableStreamDefaultReader(this)) {
            throw defaultReaderBrandCheckException("releaseLock");
          }
          if (this._ownerReadableStream === void 0) {
            return;
          }
          if (this._readRequests.length > 0) {
            throw new TypeError("Tried to release a reader lock when that reader has pending read() calls un-settled");
          }
          ReadableStreamReaderGenericRelease(this);
        }
      }
      Object.defineProperties(ReadableStreamDefaultReader.prototype, {
        cancel: { enumerable: true },
        read: { enumerable: true },
        releaseLock: { enumerable: true },
        closed: { enumerable: true }
      });
      if (typeof SymbolPolyfill.toStringTag === "symbol") {
        Object.defineProperty(ReadableStreamDefaultReader.prototype, SymbolPolyfill.toStringTag, {
          value: "ReadableStreamDefaultReader",
          configurable: true
        });
      }
      function IsReadableStreamDefaultReader(x2) {
        if (!typeIsObject(x2)) {
          return false;
        }
        if (!Object.prototype.hasOwnProperty.call(x2, "_readRequests")) {
          return false;
        }
        return x2 instanceof ReadableStreamDefaultReader;
      }
      function ReadableStreamDefaultReaderRead(reader, readRequest) {
        const stream = reader._ownerReadableStream;
        stream._disturbed = true;
        if (stream._state === "closed") {
          readRequest._closeSteps();
        } else if (stream._state === "errored") {
          readRequest._errorSteps(stream._storedError);
        } else {
          stream._readableStreamController[PullSteps](readRequest);
        }
      }
      function defaultReaderBrandCheckException(name) {
        return new TypeError(`ReadableStreamDefaultReader.prototype.${name} can only be used on a ReadableStreamDefaultReader`);
      }
      const AsyncIteratorPrototype = Object.getPrototypeOf(Object.getPrototypeOf(async function* () {
      }).prototype);
      class ReadableStreamAsyncIteratorImpl {
        constructor(reader, preventCancel) {
          this._ongoingPromise = void 0;
          this._isFinished = false;
          this._reader = reader;
          this._preventCancel = preventCancel;
        }
        next() {
          const nextSteps = () => this._nextSteps();
          this._ongoingPromise = this._ongoingPromise ? transformPromiseWith(this._ongoingPromise, nextSteps, nextSteps) : nextSteps();
          return this._ongoingPromise;
        }
        return(value) {
          const returnSteps = () => this._returnSteps(value);
          return this._ongoingPromise ? transformPromiseWith(this._ongoingPromise, returnSteps, returnSteps) : returnSteps();
        }
        _nextSteps() {
          if (this._isFinished) {
            return Promise.resolve({ value: void 0, done: true });
          }
          const reader = this._reader;
          if (reader._ownerReadableStream === void 0) {
            return promiseRejectedWith(readerLockException("iterate"));
          }
          let resolvePromise;
          let rejectPromise;
          const promise = newPromise((resolve, reject) => {
            resolvePromise = resolve;
            rejectPromise = reject;
          });
          const readRequest = {
            _chunkSteps: (chunk) => {
              this._ongoingPromise = void 0;
              queueMicrotask(() => resolvePromise({ value: chunk, done: false }));
            },
            _closeSteps: () => {
              this._ongoingPromise = void 0;
              this._isFinished = true;
              ReadableStreamReaderGenericRelease(reader);
              resolvePromise({ value: void 0, done: true });
            },
            _errorSteps: (reason) => {
              this._ongoingPromise = void 0;
              this._isFinished = true;
              ReadableStreamReaderGenericRelease(reader);
              rejectPromise(reason);
            }
          };
          ReadableStreamDefaultReaderRead(reader, readRequest);
          return promise;
        }
        _returnSteps(value) {
          if (this._isFinished) {
            return Promise.resolve({ value, done: true });
          }
          this._isFinished = true;
          const reader = this._reader;
          if (reader._ownerReadableStream === void 0) {
            return promiseRejectedWith(readerLockException("finish iterating"));
          }
          if (!this._preventCancel) {
            const result = ReadableStreamReaderGenericCancel(reader, value);
            ReadableStreamReaderGenericRelease(reader);
            return transformPromiseWith(result, () => ({ value, done: true }));
          }
          ReadableStreamReaderGenericRelease(reader);
          return promiseResolvedWith({ value, done: true });
        }
      }
      const ReadableStreamAsyncIteratorPrototype = {
        next() {
          if (!IsReadableStreamAsyncIterator(this)) {
            return promiseRejectedWith(streamAsyncIteratorBrandCheckException("next"));
          }
          return this._asyncIteratorImpl.next();
        },
        return(value) {
          if (!IsReadableStreamAsyncIterator(this)) {
            return promiseRejectedWith(streamAsyncIteratorBrandCheckException("return"));
          }
          return this._asyncIteratorImpl.return(value);
        }
      };
      if (AsyncIteratorPrototype !== void 0) {
        Object.setPrototypeOf(ReadableStreamAsyncIteratorPrototype, AsyncIteratorPrototype);
      }
      function AcquireReadableStreamAsyncIterator(stream, preventCancel) {
        const reader = AcquireReadableStreamDefaultReader(stream);
        const impl = new ReadableStreamAsyncIteratorImpl(reader, preventCancel);
        const iterator = Object.create(ReadableStreamAsyncIteratorPrototype);
        iterator._asyncIteratorImpl = impl;
        return iterator;
      }
      function IsReadableStreamAsyncIterator(x2) {
        if (!typeIsObject(x2)) {
          return false;
        }
        if (!Object.prototype.hasOwnProperty.call(x2, "_asyncIteratorImpl")) {
          return false;
        }
        try {
          return x2._asyncIteratorImpl instanceof ReadableStreamAsyncIteratorImpl;
        } catch (_a) {
          return false;
        }
      }
      function streamAsyncIteratorBrandCheckException(name) {
        return new TypeError(`ReadableStreamAsyncIterator.${name} can only be used on a ReadableSteamAsyncIterator`);
      }
      const NumberIsNaN = Number.isNaN || function(x2) {
        return x2 !== x2;
      };
      function CreateArrayFromList(elements) {
        return elements.slice();
      }
      function CopyDataBlockBytes(dest, destOffset, src, srcOffset, n) {
        new Uint8Array(dest).set(new Uint8Array(src, srcOffset, n), destOffset);
      }
      function TransferArrayBuffer(O) {
        return O;
      }
      function IsDetachedBuffer(O) {
        return false;
      }
      function ArrayBufferSlice(buffer, begin, end) {
        if (buffer.slice) {
          return buffer.slice(begin, end);
        }
        const length = end - begin;
        const slice = new ArrayBuffer(length);
        CopyDataBlockBytes(slice, 0, buffer, begin, length);
        return slice;
      }
      function IsNonNegativeNumber(v) {
        if (typeof v !== "number") {
          return false;
        }
        if (NumberIsNaN(v)) {
          return false;
        }
        if (v < 0) {
          return false;
        }
        return true;
      }
      function CloneAsUint8Array(O) {
        const buffer = ArrayBufferSlice(O.buffer, O.byteOffset, O.byteOffset + O.byteLength);
        return new Uint8Array(buffer);
      }
      function DequeueValue(container) {
        const pair = container._queue.shift();
        container._queueTotalSize -= pair.size;
        if (container._queueTotalSize < 0) {
          container._queueTotalSize = 0;
        }
        return pair.value;
      }
      function EnqueueValueWithSize(container, value, size) {
        if (!IsNonNegativeNumber(size) || size === Infinity) {
          throw new RangeError("Size must be a finite, non-NaN, non-negative number.");
        }
        container._queue.push({ value, size });
        container._queueTotalSize += size;
      }
      function PeekQueueValue(container) {
        const pair = container._queue.peek();
        return pair.value;
      }
      function ResetQueue(container) {
        container._queue = new SimpleQueue();
        container._queueTotalSize = 0;
      }
      class ReadableStreamBYOBRequest {
        constructor() {
          throw new TypeError("Illegal constructor");
        }
        get view() {
          if (!IsReadableStreamBYOBRequest(this)) {
            throw byobRequestBrandCheckException("view");
          }
          return this._view;
        }
        respond(bytesWritten) {
          if (!IsReadableStreamBYOBRequest(this)) {
            throw byobRequestBrandCheckException("respond");
          }
          assertRequiredArgument(bytesWritten, 1, "respond");
          bytesWritten = convertUnsignedLongLongWithEnforceRange(bytesWritten, "First parameter");
          if (this._associatedReadableByteStreamController === void 0) {
            throw new TypeError("This BYOB request has been invalidated");
          }
          if (IsDetachedBuffer(this._view.buffer))
            ;
          ReadableByteStreamControllerRespond(this._associatedReadableByteStreamController, bytesWritten);
        }
        respondWithNewView(view) {
          if (!IsReadableStreamBYOBRequest(this)) {
            throw byobRequestBrandCheckException("respondWithNewView");
          }
          assertRequiredArgument(view, 1, "respondWithNewView");
          if (!ArrayBuffer.isView(view)) {
            throw new TypeError("You can only respond with array buffer views");
          }
          if (this._associatedReadableByteStreamController === void 0) {
            throw new TypeError("This BYOB request has been invalidated");
          }
          if (IsDetachedBuffer(view.buffer))
            ;
          ReadableByteStreamControllerRespondWithNewView(this._associatedReadableByteStreamController, view);
        }
      }
      Object.defineProperties(ReadableStreamBYOBRequest.prototype, {
        respond: { enumerable: true },
        respondWithNewView: { enumerable: true },
        view: { enumerable: true }
      });
      if (typeof SymbolPolyfill.toStringTag === "symbol") {
        Object.defineProperty(ReadableStreamBYOBRequest.prototype, SymbolPolyfill.toStringTag, {
          value: "ReadableStreamBYOBRequest",
          configurable: true
        });
      }
      class ReadableByteStreamController {
        constructor() {
          throw new TypeError("Illegal constructor");
        }
        get byobRequest() {
          if (!IsReadableByteStreamController(this)) {
            throw byteStreamControllerBrandCheckException("byobRequest");
          }
          return ReadableByteStreamControllerGetBYOBRequest(this);
        }
        get desiredSize() {
          if (!IsReadableByteStreamController(this)) {
            throw byteStreamControllerBrandCheckException("desiredSize");
          }
          return ReadableByteStreamControllerGetDesiredSize(this);
        }
        close() {
          if (!IsReadableByteStreamController(this)) {
            throw byteStreamControllerBrandCheckException("close");
          }
          if (this._closeRequested) {
            throw new TypeError("The stream has already been closed; do not close it again!");
          }
          const state = this._controlledReadableByteStream._state;
          if (state !== "readable") {
            throw new TypeError(`The stream (in ${state} state) is not in the readable state and cannot be closed`);
          }
          ReadableByteStreamControllerClose(this);
        }
        enqueue(chunk) {
          if (!IsReadableByteStreamController(this)) {
            throw byteStreamControllerBrandCheckException("enqueue");
          }
          assertRequiredArgument(chunk, 1, "enqueue");
          if (!ArrayBuffer.isView(chunk)) {
            throw new TypeError("chunk must be an array buffer view");
          }
          if (chunk.byteLength === 0) {
            throw new TypeError("chunk must have non-zero byteLength");
          }
          if (chunk.buffer.byteLength === 0) {
            throw new TypeError(`chunk's buffer must have non-zero byteLength`);
          }
          if (this._closeRequested) {
            throw new TypeError("stream is closed or draining");
          }
          const state = this._controlledReadableByteStream._state;
          if (state !== "readable") {
            throw new TypeError(`The stream (in ${state} state) is not in the readable state and cannot be enqueued to`);
          }
          ReadableByteStreamControllerEnqueue(this, chunk);
        }
        error(e2 = void 0) {
          if (!IsReadableByteStreamController(this)) {
            throw byteStreamControllerBrandCheckException("error");
          }
          ReadableByteStreamControllerError(this, e2);
        }
        [CancelSteps](reason) {
          ReadableByteStreamControllerClearPendingPullIntos(this);
          ResetQueue(this);
          const result = this._cancelAlgorithm(reason);
          ReadableByteStreamControllerClearAlgorithms(this);
          return result;
        }
        [PullSteps](readRequest) {
          const stream = this._controlledReadableByteStream;
          if (this._queueTotalSize > 0) {
            const entry = this._queue.shift();
            this._queueTotalSize -= entry.byteLength;
            ReadableByteStreamControllerHandleQueueDrain(this);
            const view = new Uint8Array(entry.buffer, entry.byteOffset, entry.byteLength);
            readRequest._chunkSteps(view);
            return;
          }
          const autoAllocateChunkSize = this._autoAllocateChunkSize;
          if (autoAllocateChunkSize !== void 0) {
            let buffer;
            try {
              buffer = new ArrayBuffer(autoAllocateChunkSize);
            } catch (bufferE) {
              readRequest._errorSteps(bufferE);
              return;
            }
            const pullIntoDescriptor = {
              buffer,
              bufferByteLength: autoAllocateChunkSize,
              byteOffset: 0,
              byteLength: autoAllocateChunkSize,
              bytesFilled: 0,
              elementSize: 1,
              viewConstructor: Uint8Array,
              readerType: "default"
            };
            this._pendingPullIntos.push(pullIntoDescriptor);
          }
          ReadableStreamAddReadRequest(stream, readRequest);
          ReadableByteStreamControllerCallPullIfNeeded(this);
        }
      }
      Object.defineProperties(ReadableByteStreamController.prototype, {
        close: { enumerable: true },
        enqueue: { enumerable: true },
        error: { enumerable: true },
        byobRequest: { enumerable: true },
        desiredSize: { enumerable: true }
      });
      if (typeof SymbolPolyfill.toStringTag === "symbol") {
        Object.defineProperty(ReadableByteStreamController.prototype, SymbolPolyfill.toStringTag, {
          value: "ReadableByteStreamController",
          configurable: true
        });
      }
      function IsReadableByteStreamController(x2) {
        if (!typeIsObject(x2)) {
          return false;
        }
        if (!Object.prototype.hasOwnProperty.call(x2, "_controlledReadableByteStream")) {
          return false;
        }
        return x2 instanceof ReadableByteStreamController;
      }
      function IsReadableStreamBYOBRequest(x2) {
        if (!typeIsObject(x2)) {
          return false;
        }
        if (!Object.prototype.hasOwnProperty.call(x2, "_associatedReadableByteStreamController")) {
          return false;
        }
        return x2 instanceof ReadableStreamBYOBRequest;
      }
      function ReadableByteStreamControllerCallPullIfNeeded(controller) {
        const shouldPull = ReadableByteStreamControllerShouldCallPull(controller);
        if (!shouldPull) {
          return;
        }
        if (controller._pulling) {
          controller._pullAgain = true;
          return;
        }
        controller._pulling = true;
        const pullPromise = controller._pullAlgorithm();
        uponPromise(pullPromise, () => {
          controller._pulling = false;
          if (controller._pullAgain) {
            controller._pullAgain = false;
            ReadableByteStreamControllerCallPullIfNeeded(controller);
          }
        }, (e2) => {
          ReadableByteStreamControllerError(controller, e2);
        });
      }
      function ReadableByteStreamControllerClearPendingPullIntos(controller) {
        ReadableByteStreamControllerInvalidateBYOBRequest(controller);
        controller._pendingPullIntos = new SimpleQueue();
      }
      function ReadableByteStreamControllerCommitPullIntoDescriptor(stream, pullIntoDescriptor) {
        let done = false;
        if (stream._state === "closed") {
          done = true;
        }
        const filledView = ReadableByteStreamControllerConvertPullIntoDescriptor(pullIntoDescriptor);
        if (pullIntoDescriptor.readerType === "default") {
          ReadableStreamFulfillReadRequest(stream, filledView, done);
        } else {
          ReadableStreamFulfillReadIntoRequest(stream, filledView, done);
        }
      }
      function ReadableByteStreamControllerConvertPullIntoDescriptor(pullIntoDescriptor) {
        const bytesFilled = pullIntoDescriptor.bytesFilled;
        const elementSize = pullIntoDescriptor.elementSize;
        return new pullIntoDescriptor.viewConstructor(pullIntoDescriptor.buffer, pullIntoDescriptor.byteOffset, bytesFilled / elementSize);
      }
      function ReadableByteStreamControllerEnqueueChunkToQueue(controller, buffer, byteOffset, byteLength) {
        controller._queue.push({ buffer, byteOffset, byteLength });
        controller._queueTotalSize += byteLength;
      }
      function ReadableByteStreamControllerFillPullIntoDescriptorFromQueue(controller, pullIntoDescriptor) {
        const elementSize = pullIntoDescriptor.elementSize;
        const currentAlignedBytes = pullIntoDescriptor.bytesFilled - pullIntoDescriptor.bytesFilled % elementSize;
        const maxBytesToCopy = Math.min(controller._queueTotalSize, pullIntoDescriptor.byteLength - pullIntoDescriptor.bytesFilled);
        const maxBytesFilled = pullIntoDescriptor.bytesFilled + maxBytesToCopy;
        const maxAlignedBytes = maxBytesFilled - maxBytesFilled % elementSize;
        let totalBytesToCopyRemaining = maxBytesToCopy;
        let ready = false;
        if (maxAlignedBytes > currentAlignedBytes) {
          totalBytesToCopyRemaining = maxAlignedBytes - pullIntoDescriptor.bytesFilled;
          ready = true;
        }
        const queue = controller._queue;
        while (totalBytesToCopyRemaining > 0) {
          const headOfQueue = queue.peek();
          const bytesToCopy = Math.min(totalBytesToCopyRemaining, headOfQueue.byteLength);
          const destStart = pullIntoDescriptor.byteOffset + pullIntoDescriptor.bytesFilled;
          CopyDataBlockBytes(pullIntoDescriptor.buffer, destStart, headOfQueue.buffer, headOfQueue.byteOffset, bytesToCopy);
          if (headOfQueue.byteLength === bytesToCopy) {
            queue.shift();
          } else {
            headOfQueue.byteOffset += bytesToCopy;
            headOfQueue.byteLength -= bytesToCopy;
          }
          controller._queueTotalSize -= bytesToCopy;
          ReadableByteStreamControllerFillHeadPullIntoDescriptor(controller, bytesToCopy, pullIntoDescriptor);
          totalBytesToCopyRemaining -= bytesToCopy;
        }
        return ready;
      }
      function ReadableByteStreamControllerFillHeadPullIntoDescriptor(controller, size, pullIntoDescriptor) {
        pullIntoDescriptor.bytesFilled += size;
      }
      function ReadableByteStreamControllerHandleQueueDrain(controller) {
        if (controller._queueTotalSize === 0 && controller._closeRequested) {
          ReadableByteStreamControllerClearAlgorithms(controller);
          ReadableStreamClose(controller._controlledReadableByteStream);
        } else {
          ReadableByteStreamControllerCallPullIfNeeded(controller);
        }
      }
      function ReadableByteStreamControllerInvalidateBYOBRequest(controller) {
        if (controller._byobRequest === null) {
          return;
        }
        controller._byobRequest._associatedReadableByteStreamController = void 0;
        controller._byobRequest._view = null;
        controller._byobRequest = null;
      }
      function ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue(controller) {
        while (controller._pendingPullIntos.length > 0) {
          if (controller._queueTotalSize === 0) {
            return;
          }
          const pullIntoDescriptor = controller._pendingPullIntos.peek();
          if (ReadableByteStreamControllerFillPullIntoDescriptorFromQueue(controller, pullIntoDescriptor)) {
            ReadableByteStreamControllerShiftPendingPullInto(controller);
            ReadableByteStreamControllerCommitPullIntoDescriptor(controller._controlledReadableByteStream, pullIntoDescriptor);
          }
        }
      }
      function ReadableByteStreamControllerPullInto(controller, view, readIntoRequest) {
        const stream = controller._controlledReadableByteStream;
        let elementSize = 1;
        if (view.constructor !== DataView) {
          elementSize = view.constructor.BYTES_PER_ELEMENT;
        }
        const ctor = view.constructor;
        const buffer = TransferArrayBuffer(view.buffer);
        const pullIntoDescriptor = {
          buffer,
          bufferByteLength: buffer.byteLength,
          byteOffset: view.byteOffset,
          byteLength: view.byteLength,
          bytesFilled: 0,
          elementSize,
          viewConstructor: ctor,
          readerType: "byob"
        };
        if (controller._pendingPullIntos.length > 0) {
          controller._pendingPullIntos.push(pullIntoDescriptor);
          ReadableStreamAddReadIntoRequest(stream, readIntoRequest);
          return;
        }
        if (stream._state === "closed") {
          const emptyView = new ctor(pullIntoDescriptor.buffer, pullIntoDescriptor.byteOffset, 0);
          readIntoRequest._closeSteps(emptyView);
          return;
        }
        if (controller._queueTotalSize > 0) {
          if (ReadableByteStreamControllerFillPullIntoDescriptorFromQueue(controller, pullIntoDescriptor)) {
            const filledView = ReadableByteStreamControllerConvertPullIntoDescriptor(pullIntoDescriptor);
            ReadableByteStreamControllerHandleQueueDrain(controller);
            readIntoRequest._chunkSteps(filledView);
            return;
          }
          if (controller._closeRequested) {
            const e2 = new TypeError("Insufficient bytes to fill elements in the given buffer");
            ReadableByteStreamControllerError(controller, e2);
            readIntoRequest._errorSteps(e2);
            return;
          }
        }
        controller._pendingPullIntos.push(pullIntoDescriptor);
        ReadableStreamAddReadIntoRequest(stream, readIntoRequest);
        ReadableByteStreamControllerCallPullIfNeeded(controller);
      }
      function ReadableByteStreamControllerRespondInClosedState(controller, firstDescriptor) {
        const stream = controller._controlledReadableByteStream;
        if (ReadableStreamHasBYOBReader(stream)) {
          while (ReadableStreamGetNumReadIntoRequests(stream) > 0) {
            const pullIntoDescriptor = ReadableByteStreamControllerShiftPendingPullInto(controller);
            ReadableByteStreamControllerCommitPullIntoDescriptor(stream, pullIntoDescriptor);
          }
        }
      }
      function ReadableByteStreamControllerRespondInReadableState(controller, bytesWritten, pullIntoDescriptor) {
        ReadableByteStreamControllerFillHeadPullIntoDescriptor(controller, bytesWritten, pullIntoDescriptor);
        if (pullIntoDescriptor.bytesFilled < pullIntoDescriptor.elementSize) {
          return;
        }
        ReadableByteStreamControllerShiftPendingPullInto(controller);
        const remainderSize = pullIntoDescriptor.bytesFilled % pullIntoDescriptor.elementSize;
        if (remainderSize > 0) {
          const end = pullIntoDescriptor.byteOffset + pullIntoDescriptor.bytesFilled;
          const remainder = ArrayBufferSlice(pullIntoDescriptor.buffer, end - remainderSize, end);
          ReadableByteStreamControllerEnqueueChunkToQueue(controller, remainder, 0, remainder.byteLength);
        }
        pullIntoDescriptor.bytesFilled -= remainderSize;
        ReadableByteStreamControllerCommitPullIntoDescriptor(controller._controlledReadableByteStream, pullIntoDescriptor);
        ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue(controller);
      }
      function ReadableByteStreamControllerRespondInternal(controller, bytesWritten) {
        const firstDescriptor = controller._pendingPullIntos.peek();
        ReadableByteStreamControllerInvalidateBYOBRequest(controller);
        const state = controller._controlledReadableByteStream._state;
        if (state === "closed") {
          ReadableByteStreamControllerRespondInClosedState(controller);
        } else {
          ReadableByteStreamControllerRespondInReadableState(controller, bytesWritten, firstDescriptor);
        }
        ReadableByteStreamControllerCallPullIfNeeded(controller);
      }
      function ReadableByteStreamControllerShiftPendingPullInto(controller) {
        const descriptor = controller._pendingPullIntos.shift();
        return descriptor;
      }
      function ReadableByteStreamControllerShouldCallPull(controller) {
        const stream = controller._controlledReadableByteStream;
        if (stream._state !== "readable") {
          return false;
        }
        if (controller._closeRequested) {
          return false;
        }
        if (!controller._started) {
          return false;
        }
        if (ReadableStreamHasDefaultReader(stream) && ReadableStreamGetNumReadRequests(stream) > 0) {
          return true;
        }
        if (ReadableStreamHasBYOBReader(stream) && ReadableStreamGetNumReadIntoRequests(stream) > 0) {
          return true;
        }
        const desiredSize = ReadableByteStreamControllerGetDesiredSize(controller);
        if (desiredSize > 0) {
          return true;
        }
        return false;
      }
      function ReadableByteStreamControllerClearAlgorithms(controller) {
        controller._pullAlgorithm = void 0;
        controller._cancelAlgorithm = void 0;
      }
      function ReadableByteStreamControllerClose(controller) {
        const stream = controller._controlledReadableByteStream;
        if (controller._closeRequested || stream._state !== "readable") {
          return;
        }
        if (controller._queueTotalSize > 0) {
          controller._closeRequested = true;
          return;
        }
        if (controller._pendingPullIntos.length > 0) {
          const firstPendingPullInto = controller._pendingPullIntos.peek();
          if (firstPendingPullInto.bytesFilled > 0) {
            const e2 = new TypeError("Insufficient bytes to fill elements in the given buffer");
            ReadableByteStreamControllerError(controller, e2);
            throw e2;
          }
        }
        ReadableByteStreamControllerClearAlgorithms(controller);
        ReadableStreamClose(stream);
      }
      function ReadableByteStreamControllerEnqueue(controller, chunk) {
        const stream = controller._controlledReadableByteStream;
        if (controller._closeRequested || stream._state !== "readable") {
          return;
        }
        const buffer = chunk.buffer;
        const byteOffset = chunk.byteOffset;
        const byteLength = chunk.byteLength;
        const transferredBuffer = TransferArrayBuffer(buffer);
        if (controller._pendingPullIntos.length > 0) {
          const firstPendingPullInto = controller._pendingPullIntos.peek();
          if (IsDetachedBuffer(firstPendingPullInto.buffer))
            ;
          firstPendingPullInto.buffer = TransferArrayBuffer(firstPendingPullInto.buffer);
        }
        ReadableByteStreamControllerInvalidateBYOBRequest(controller);
        if (ReadableStreamHasDefaultReader(stream)) {
          if (ReadableStreamGetNumReadRequests(stream) === 0) {
            ReadableByteStreamControllerEnqueueChunkToQueue(controller, transferredBuffer, byteOffset, byteLength);
          } else {
            if (controller._pendingPullIntos.length > 0) {
              ReadableByteStreamControllerShiftPendingPullInto(controller);
            }
            const transferredView = new Uint8Array(transferredBuffer, byteOffset, byteLength);
            ReadableStreamFulfillReadRequest(stream, transferredView, false);
          }
        } else if (ReadableStreamHasBYOBReader(stream)) {
          ReadableByteStreamControllerEnqueueChunkToQueue(controller, transferredBuffer, byteOffset, byteLength);
          ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue(controller);
        } else {
          ReadableByteStreamControllerEnqueueChunkToQueue(controller, transferredBuffer, byteOffset, byteLength);
        }
        ReadableByteStreamControllerCallPullIfNeeded(controller);
      }
      function ReadableByteStreamControllerError(controller, e2) {
        const stream = controller._controlledReadableByteStream;
        if (stream._state !== "readable") {
          return;
        }
        ReadableByteStreamControllerClearPendingPullIntos(controller);
        ResetQueue(controller);
        ReadableByteStreamControllerClearAlgorithms(controller);
        ReadableStreamError(stream, e2);
      }
      function ReadableByteStreamControllerGetBYOBRequest(controller) {
        if (controller._byobRequest === null && controller._pendingPullIntos.length > 0) {
          const firstDescriptor = controller._pendingPullIntos.peek();
          const view = new Uint8Array(firstDescriptor.buffer, firstDescriptor.byteOffset + firstDescriptor.bytesFilled, firstDescriptor.byteLength - firstDescriptor.bytesFilled);
          const byobRequest = Object.create(ReadableStreamBYOBRequest.prototype);
          SetUpReadableStreamBYOBRequest(byobRequest, controller, view);
          controller._byobRequest = byobRequest;
        }
        return controller._byobRequest;
      }
      function ReadableByteStreamControllerGetDesiredSize(controller) {
        const state = controller._controlledReadableByteStream._state;
        if (state === "errored") {
          return null;
        }
        if (state === "closed") {
          return 0;
        }
        return controller._strategyHWM - controller._queueTotalSize;
      }
      function ReadableByteStreamControllerRespond(controller, bytesWritten) {
        const firstDescriptor = controller._pendingPullIntos.peek();
        const state = controller._controlledReadableByteStream._state;
        if (state === "closed") {
          if (bytesWritten !== 0) {
            throw new TypeError("bytesWritten must be 0 when calling respond() on a closed stream");
          }
        } else {
          if (bytesWritten === 0) {
            throw new TypeError("bytesWritten must be greater than 0 when calling respond() on a readable stream");
          }
          if (firstDescriptor.bytesFilled + bytesWritten > firstDescriptor.byteLength) {
            throw new RangeError("bytesWritten out of range");
          }
        }
        firstDescriptor.buffer = TransferArrayBuffer(firstDescriptor.buffer);
        ReadableByteStreamControllerRespondInternal(controller, bytesWritten);
      }
      function ReadableByteStreamControllerRespondWithNewView(controller, view) {
        const firstDescriptor = controller._pendingPullIntos.peek();
        const state = controller._controlledReadableByteStream._state;
        if (state === "closed") {
          if (view.byteLength !== 0) {
            throw new TypeError("The view's length must be 0 when calling respondWithNewView() on a closed stream");
          }
        } else {
          if (view.byteLength === 0) {
            throw new TypeError("The view's length must be greater than 0 when calling respondWithNewView() on a readable stream");
          }
        }
        if (firstDescriptor.byteOffset + firstDescriptor.bytesFilled !== view.byteOffset) {
          throw new RangeError("The region specified by view does not match byobRequest");
        }
        if (firstDescriptor.bufferByteLength !== view.buffer.byteLength) {
          throw new RangeError("The buffer of view has different capacity than byobRequest");
        }
        if (firstDescriptor.bytesFilled + view.byteLength > firstDescriptor.byteLength) {
          throw new RangeError("The region specified by view is larger than byobRequest");
        }
        const viewByteLength = view.byteLength;
        firstDescriptor.buffer = TransferArrayBuffer(view.buffer);
        ReadableByteStreamControllerRespondInternal(controller, viewByteLength);
      }
      function SetUpReadableByteStreamController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, autoAllocateChunkSize) {
        controller._controlledReadableByteStream = stream;
        controller._pullAgain = false;
        controller._pulling = false;
        controller._byobRequest = null;
        controller._queue = controller._queueTotalSize = void 0;
        ResetQueue(controller);
        controller._closeRequested = false;
        controller._started = false;
        controller._strategyHWM = highWaterMark;
        controller._pullAlgorithm = pullAlgorithm;
        controller._cancelAlgorithm = cancelAlgorithm;
        controller._autoAllocateChunkSize = autoAllocateChunkSize;
        controller._pendingPullIntos = new SimpleQueue();
        stream._readableStreamController = controller;
        const startResult = startAlgorithm();
        uponPromise(promiseResolvedWith(startResult), () => {
          controller._started = true;
          ReadableByteStreamControllerCallPullIfNeeded(controller);
        }, (r2) => {
          ReadableByteStreamControllerError(controller, r2);
        });
      }
      function SetUpReadableByteStreamControllerFromUnderlyingSource(stream, underlyingByteSource, highWaterMark) {
        const controller = Object.create(ReadableByteStreamController.prototype);
        let startAlgorithm = () => void 0;
        let pullAlgorithm = () => promiseResolvedWith(void 0);
        let cancelAlgorithm = () => promiseResolvedWith(void 0);
        if (underlyingByteSource.start !== void 0) {
          startAlgorithm = () => underlyingByteSource.start(controller);
        }
        if (underlyingByteSource.pull !== void 0) {
          pullAlgorithm = () => underlyingByteSource.pull(controller);
        }
        if (underlyingByteSource.cancel !== void 0) {
          cancelAlgorithm = (reason) => underlyingByteSource.cancel(reason);
        }
        const autoAllocateChunkSize = underlyingByteSource.autoAllocateChunkSize;
        if (autoAllocateChunkSize === 0) {
          throw new TypeError("autoAllocateChunkSize must be greater than 0");
        }
        SetUpReadableByteStreamController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, autoAllocateChunkSize);
      }
      function SetUpReadableStreamBYOBRequest(request, controller, view) {
        request._associatedReadableByteStreamController = controller;
        request._view = view;
      }
      function byobRequestBrandCheckException(name) {
        return new TypeError(`ReadableStreamBYOBRequest.prototype.${name} can only be used on a ReadableStreamBYOBRequest`);
      }
      function byteStreamControllerBrandCheckException(name) {
        return new TypeError(`ReadableByteStreamController.prototype.${name} can only be used on a ReadableByteStreamController`);
      }
      function AcquireReadableStreamBYOBReader(stream) {
        return new ReadableStreamBYOBReader(stream);
      }
      function ReadableStreamAddReadIntoRequest(stream, readIntoRequest) {
        stream._reader._readIntoRequests.push(readIntoRequest);
      }
      function ReadableStreamFulfillReadIntoRequest(stream, chunk, done) {
        const reader = stream._reader;
        const readIntoRequest = reader._readIntoRequests.shift();
        if (done) {
          readIntoRequest._closeSteps(chunk);
        } else {
          readIntoRequest._chunkSteps(chunk);
        }
      }
      function ReadableStreamGetNumReadIntoRequests(stream) {
        return stream._reader._readIntoRequests.length;
      }
      function ReadableStreamHasBYOBReader(stream) {
        const reader = stream._reader;
        if (reader === void 0) {
          return false;
        }
        if (!IsReadableStreamBYOBReader(reader)) {
          return false;
        }
        return true;
      }
      class ReadableStreamBYOBReader {
        constructor(stream) {
          assertRequiredArgument(stream, 1, "ReadableStreamBYOBReader");
          assertReadableStream(stream, "First parameter");
          if (IsReadableStreamLocked(stream)) {
            throw new TypeError("This stream has already been locked for exclusive reading by another reader");
          }
          if (!IsReadableByteStreamController(stream._readableStreamController)) {
            throw new TypeError("Cannot construct a ReadableStreamBYOBReader for a stream not constructed with a byte source");
          }
          ReadableStreamReaderGenericInitialize(this, stream);
          this._readIntoRequests = new SimpleQueue();
        }
        get closed() {
          if (!IsReadableStreamBYOBReader(this)) {
            return promiseRejectedWith(byobReaderBrandCheckException("closed"));
          }
          return this._closedPromise;
        }
        cancel(reason = void 0) {
          if (!IsReadableStreamBYOBReader(this)) {
            return promiseRejectedWith(byobReaderBrandCheckException("cancel"));
          }
          if (this._ownerReadableStream === void 0) {
            return promiseRejectedWith(readerLockException("cancel"));
          }
          return ReadableStreamReaderGenericCancel(this, reason);
        }
        read(view) {
          if (!IsReadableStreamBYOBReader(this)) {
            return promiseRejectedWith(byobReaderBrandCheckException("read"));
          }
          if (!ArrayBuffer.isView(view)) {
            return promiseRejectedWith(new TypeError("view must be an array buffer view"));
          }
          if (view.byteLength === 0) {
            return promiseRejectedWith(new TypeError("view must have non-zero byteLength"));
          }
          if (view.buffer.byteLength === 0) {
            return promiseRejectedWith(new TypeError(`view's buffer must have non-zero byteLength`));
          }
          if (IsDetachedBuffer(view.buffer))
            ;
          if (this._ownerReadableStream === void 0) {
            return promiseRejectedWith(readerLockException("read from"));
          }
          let resolvePromise;
          let rejectPromise;
          const promise = newPromise((resolve, reject) => {
            resolvePromise = resolve;
            rejectPromise = reject;
          });
          const readIntoRequest = {
            _chunkSteps: (chunk) => resolvePromise({ value: chunk, done: false }),
            _closeSteps: (chunk) => resolvePromise({ value: chunk, done: true }),
            _errorSteps: (e2) => rejectPromise(e2)
          };
          ReadableStreamBYOBReaderRead(this, view, readIntoRequest);
          return promise;
        }
        releaseLock() {
          if (!IsReadableStreamBYOBReader(this)) {
            throw byobReaderBrandCheckException("releaseLock");
          }
          if (this._ownerReadableStream === void 0) {
            return;
          }
          if (this._readIntoRequests.length > 0) {
            throw new TypeError("Tried to release a reader lock when that reader has pending read() calls un-settled");
          }
          ReadableStreamReaderGenericRelease(this);
        }
      }
      Object.defineProperties(ReadableStreamBYOBReader.prototype, {
        cancel: { enumerable: true },
        read: { enumerable: true },
        releaseLock: { enumerable: true },
        closed: { enumerable: true }
      });
      if (typeof SymbolPolyfill.toStringTag === "symbol") {
        Object.defineProperty(ReadableStreamBYOBReader.prototype, SymbolPolyfill.toStringTag, {
          value: "ReadableStreamBYOBReader",
          configurable: true
        });
      }
      function IsReadableStreamBYOBReader(x2) {
        if (!typeIsObject(x2)) {
          return false;
        }
        if (!Object.prototype.hasOwnProperty.call(x2, "_readIntoRequests")) {
          return false;
        }
        return x2 instanceof ReadableStreamBYOBReader;
      }
      function ReadableStreamBYOBReaderRead(reader, view, readIntoRequest) {
        const stream = reader._ownerReadableStream;
        stream._disturbed = true;
        if (stream._state === "errored") {
          readIntoRequest._errorSteps(stream._storedError);
        } else {
          ReadableByteStreamControllerPullInto(stream._readableStreamController, view, readIntoRequest);
        }
      }
      function byobReaderBrandCheckException(name) {
        return new TypeError(`ReadableStreamBYOBReader.prototype.${name} can only be used on a ReadableStreamBYOBReader`);
      }
      function ExtractHighWaterMark(strategy, defaultHWM) {
        const { highWaterMark } = strategy;
        if (highWaterMark === void 0) {
          return defaultHWM;
        }
        if (NumberIsNaN(highWaterMark) || highWaterMark < 0) {
          throw new RangeError("Invalid highWaterMark");
        }
        return highWaterMark;
      }
      function ExtractSizeAlgorithm(strategy) {
        const { size } = strategy;
        if (!size) {
          return () => 1;
        }
        return size;
      }
      function convertQueuingStrategy(init, context) {
        assertDictionary(init, context);
        const highWaterMark = init === null || init === void 0 ? void 0 : init.highWaterMark;
        const size = init === null || init === void 0 ? void 0 : init.size;
        return {
          highWaterMark: highWaterMark === void 0 ? void 0 : convertUnrestrictedDouble(highWaterMark),
          size: size === void 0 ? void 0 : convertQueuingStrategySize(size, `${context} has member 'size' that`)
        };
      }
      function convertQueuingStrategySize(fn, context) {
        assertFunction(fn, context);
        return (chunk) => convertUnrestrictedDouble(fn(chunk));
      }
      function convertUnderlyingSink(original, context) {
        assertDictionary(original, context);
        const abort = original === null || original === void 0 ? void 0 : original.abort;
        const close = original === null || original === void 0 ? void 0 : original.close;
        const start = original === null || original === void 0 ? void 0 : original.start;
        const type = original === null || original === void 0 ? void 0 : original.type;
        const write = original === null || original === void 0 ? void 0 : original.write;
        return {
          abort: abort === void 0 ? void 0 : convertUnderlyingSinkAbortCallback(abort, original, `${context} has member 'abort' that`),
          close: close === void 0 ? void 0 : convertUnderlyingSinkCloseCallback(close, original, `${context} has member 'close' that`),
          start: start === void 0 ? void 0 : convertUnderlyingSinkStartCallback(start, original, `${context} has member 'start' that`),
          write: write === void 0 ? void 0 : convertUnderlyingSinkWriteCallback(write, original, `${context} has member 'write' that`),
          type
        };
      }
      function convertUnderlyingSinkAbortCallback(fn, original, context) {
        assertFunction(fn, context);
        return (reason) => promiseCall(fn, original, [reason]);
      }
      function convertUnderlyingSinkCloseCallback(fn, original, context) {
        assertFunction(fn, context);
        return () => promiseCall(fn, original, []);
      }
      function convertUnderlyingSinkStartCallback(fn, original, context) {
        assertFunction(fn, context);
        return (controller) => reflectCall(fn, original, [controller]);
      }
      function convertUnderlyingSinkWriteCallback(fn, original, context) {
        assertFunction(fn, context);
        return (chunk, controller) => promiseCall(fn, original, [chunk, controller]);
      }
      function assertWritableStream(x2, context) {
        if (!IsWritableStream(x2)) {
          throw new TypeError(`${context} is not a WritableStream.`);
        }
      }
      function isAbortSignal2(value) {
        if (typeof value !== "object" || value === null) {
          return false;
        }
        try {
          return typeof value.aborted === "boolean";
        } catch (_a) {
          return false;
        }
      }
      const supportsAbortController = typeof AbortController === "function";
      function createAbortController() {
        if (supportsAbortController) {
          return new AbortController();
        }
        return void 0;
      }
      class WritableStream {
        constructor(rawUnderlyingSink = {}, rawStrategy = {}) {
          if (rawUnderlyingSink === void 0) {
            rawUnderlyingSink = null;
          } else {
            assertObject(rawUnderlyingSink, "First parameter");
          }
          const strategy = convertQueuingStrategy(rawStrategy, "Second parameter");
          const underlyingSink = convertUnderlyingSink(rawUnderlyingSink, "First parameter");
          InitializeWritableStream(this);
          const type = underlyingSink.type;
          if (type !== void 0) {
            throw new RangeError("Invalid type is specified");
          }
          const sizeAlgorithm = ExtractSizeAlgorithm(strategy);
          const highWaterMark = ExtractHighWaterMark(strategy, 1);
          SetUpWritableStreamDefaultControllerFromUnderlyingSink(this, underlyingSink, highWaterMark, sizeAlgorithm);
        }
        get locked() {
          if (!IsWritableStream(this)) {
            throw streamBrandCheckException$2("locked");
          }
          return IsWritableStreamLocked(this);
        }
        abort(reason = void 0) {
          if (!IsWritableStream(this)) {
            return promiseRejectedWith(streamBrandCheckException$2("abort"));
          }
          if (IsWritableStreamLocked(this)) {
            return promiseRejectedWith(new TypeError("Cannot abort a stream that already has a writer"));
          }
          return WritableStreamAbort(this, reason);
        }
        close() {
          if (!IsWritableStream(this)) {
            return promiseRejectedWith(streamBrandCheckException$2("close"));
          }
          if (IsWritableStreamLocked(this)) {
            return promiseRejectedWith(new TypeError("Cannot close a stream that already has a writer"));
          }
          if (WritableStreamCloseQueuedOrInFlight(this)) {
            return promiseRejectedWith(new TypeError("Cannot close an already-closing stream"));
          }
          return WritableStreamClose(this);
        }
        getWriter() {
          if (!IsWritableStream(this)) {
            throw streamBrandCheckException$2("getWriter");
          }
          return AcquireWritableStreamDefaultWriter(this);
        }
      }
      Object.defineProperties(WritableStream.prototype, {
        abort: { enumerable: true },
        close: { enumerable: true },
        getWriter: { enumerable: true },
        locked: { enumerable: true }
      });
      if (typeof SymbolPolyfill.toStringTag === "symbol") {
        Object.defineProperty(WritableStream.prototype, SymbolPolyfill.toStringTag, {
          value: "WritableStream",
          configurable: true
        });
      }
      function AcquireWritableStreamDefaultWriter(stream) {
        return new WritableStreamDefaultWriter(stream);
      }
      function CreateWritableStream(startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark = 1, sizeAlgorithm = () => 1) {
        const stream = Object.create(WritableStream.prototype);
        InitializeWritableStream(stream);
        const controller = Object.create(WritableStreamDefaultController.prototype);
        SetUpWritableStreamDefaultController(stream, controller, startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark, sizeAlgorithm);
        return stream;
      }
      function InitializeWritableStream(stream) {
        stream._state = "writable";
        stream._storedError = void 0;
        stream._writer = void 0;
        stream._writableStreamController = void 0;
        stream._writeRequests = new SimpleQueue();
        stream._inFlightWriteRequest = void 0;
        stream._closeRequest = void 0;
        stream._inFlightCloseRequest = void 0;
        stream._pendingAbortRequest = void 0;
        stream._backpressure = false;
      }
      function IsWritableStream(x2) {
        if (!typeIsObject(x2)) {
          return false;
        }
        if (!Object.prototype.hasOwnProperty.call(x2, "_writableStreamController")) {
          return false;
        }
        return x2 instanceof WritableStream;
      }
      function IsWritableStreamLocked(stream) {
        if (stream._writer === void 0) {
          return false;
        }
        return true;
      }
      function WritableStreamAbort(stream, reason) {
        var _a;
        if (stream._state === "closed" || stream._state === "errored") {
          return promiseResolvedWith(void 0);
        }
        stream._writableStreamController._abortReason = reason;
        (_a = stream._writableStreamController._abortController) === null || _a === void 0 ? void 0 : _a.abort();
        const state = stream._state;
        if (state === "closed" || state === "errored") {
          return promiseResolvedWith(void 0);
        }
        if (stream._pendingAbortRequest !== void 0) {
          return stream._pendingAbortRequest._promise;
        }
        let wasAlreadyErroring = false;
        if (state === "erroring") {
          wasAlreadyErroring = true;
          reason = void 0;
        }
        const promise = newPromise((resolve, reject) => {
          stream._pendingAbortRequest = {
            _promise: void 0,
            _resolve: resolve,
            _reject: reject,
            _reason: reason,
            _wasAlreadyErroring: wasAlreadyErroring
          };
        });
        stream._pendingAbortRequest._promise = promise;
        if (!wasAlreadyErroring) {
          WritableStreamStartErroring(stream, reason);
        }
        return promise;
      }
      function WritableStreamClose(stream) {
        const state = stream._state;
        if (state === "closed" || state === "errored") {
          return promiseRejectedWith(new TypeError(`The stream (in ${state} state) is not in the writable state and cannot be closed`));
        }
        const promise = newPromise((resolve, reject) => {
          const closeRequest = {
            _resolve: resolve,
            _reject: reject
          };
          stream._closeRequest = closeRequest;
        });
        const writer = stream._writer;
        if (writer !== void 0 && stream._backpressure && state === "writable") {
          defaultWriterReadyPromiseResolve(writer);
        }
        WritableStreamDefaultControllerClose(stream._writableStreamController);
        return promise;
      }
      function WritableStreamAddWriteRequest(stream) {
        const promise = newPromise((resolve, reject) => {
          const writeRequest = {
            _resolve: resolve,
            _reject: reject
          };
          stream._writeRequests.push(writeRequest);
        });
        return promise;
      }
      function WritableStreamDealWithRejection(stream, error) {
        const state = stream._state;
        if (state === "writable") {
          WritableStreamStartErroring(stream, error);
          return;
        }
        WritableStreamFinishErroring(stream);
      }
      function WritableStreamStartErroring(stream, reason) {
        const controller = stream._writableStreamController;
        stream._state = "erroring";
        stream._storedError = reason;
        const writer = stream._writer;
        if (writer !== void 0) {
          WritableStreamDefaultWriterEnsureReadyPromiseRejected(writer, reason);
        }
        if (!WritableStreamHasOperationMarkedInFlight(stream) && controller._started) {
          WritableStreamFinishErroring(stream);
        }
      }
      function WritableStreamFinishErroring(stream) {
        stream._state = "errored";
        stream._writableStreamController[ErrorSteps]();
        const storedError = stream._storedError;
        stream._writeRequests.forEach((writeRequest) => {
          writeRequest._reject(storedError);
        });
        stream._writeRequests = new SimpleQueue();
        if (stream._pendingAbortRequest === void 0) {
          WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
          return;
        }
        const abortRequest = stream._pendingAbortRequest;
        stream._pendingAbortRequest = void 0;
        if (abortRequest._wasAlreadyErroring) {
          abortRequest._reject(storedError);
          WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
          return;
        }
        const promise = stream._writableStreamController[AbortSteps](abortRequest._reason);
        uponPromise(promise, () => {
          abortRequest._resolve();
          WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
        }, (reason) => {
          abortRequest._reject(reason);
          WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
        });
      }
      function WritableStreamFinishInFlightWrite(stream) {
        stream._inFlightWriteRequest._resolve(void 0);
        stream._inFlightWriteRequest = void 0;
      }
      function WritableStreamFinishInFlightWriteWithError(stream, error) {
        stream._inFlightWriteRequest._reject(error);
        stream._inFlightWriteRequest = void 0;
        WritableStreamDealWithRejection(stream, error);
      }
      function WritableStreamFinishInFlightClose(stream) {
        stream._inFlightCloseRequest._resolve(void 0);
        stream._inFlightCloseRequest = void 0;
        const state = stream._state;
        if (state === "erroring") {
          stream._storedError = void 0;
          if (stream._pendingAbortRequest !== void 0) {
            stream._pendingAbortRequest._resolve();
            stream._pendingAbortRequest = void 0;
          }
        }
        stream._state = "closed";
        const writer = stream._writer;
        if (writer !== void 0) {
          defaultWriterClosedPromiseResolve(writer);
        }
      }
      function WritableStreamFinishInFlightCloseWithError(stream, error) {
        stream._inFlightCloseRequest._reject(error);
        stream._inFlightCloseRequest = void 0;
        if (stream._pendingAbortRequest !== void 0) {
          stream._pendingAbortRequest._reject(error);
          stream._pendingAbortRequest = void 0;
        }
        WritableStreamDealWithRejection(stream, error);
      }
      function WritableStreamCloseQueuedOrInFlight(stream) {
        if (stream._closeRequest === void 0 && stream._inFlightCloseRequest === void 0) {
          return false;
        }
        return true;
      }
      function WritableStreamHasOperationMarkedInFlight(stream) {
        if (stream._inFlightWriteRequest === void 0 && stream._inFlightCloseRequest === void 0) {
          return false;
        }
        return true;
      }
      function WritableStreamMarkCloseRequestInFlight(stream) {
        stream._inFlightCloseRequest = stream._closeRequest;
        stream._closeRequest = void 0;
      }
      function WritableStreamMarkFirstWriteRequestInFlight(stream) {
        stream._inFlightWriteRequest = stream._writeRequests.shift();
      }
      function WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream) {
        if (stream._closeRequest !== void 0) {
          stream._closeRequest._reject(stream._storedError);
          stream._closeRequest = void 0;
        }
        const writer = stream._writer;
        if (writer !== void 0) {
          defaultWriterClosedPromiseReject(writer, stream._storedError);
        }
      }
      function WritableStreamUpdateBackpressure(stream, backpressure) {
        const writer = stream._writer;
        if (writer !== void 0 && backpressure !== stream._backpressure) {
          if (backpressure) {
            defaultWriterReadyPromiseReset(writer);
          } else {
            defaultWriterReadyPromiseResolve(writer);
          }
        }
        stream._backpressure = backpressure;
      }
      class WritableStreamDefaultWriter {
        constructor(stream) {
          assertRequiredArgument(stream, 1, "WritableStreamDefaultWriter");
          assertWritableStream(stream, "First parameter");
          if (IsWritableStreamLocked(stream)) {
            throw new TypeError("This stream has already been locked for exclusive writing by another writer");
          }
          this._ownerWritableStream = stream;
          stream._writer = this;
          const state = stream._state;
          if (state === "writable") {
            if (!WritableStreamCloseQueuedOrInFlight(stream) && stream._backpressure) {
              defaultWriterReadyPromiseInitialize(this);
            } else {
              defaultWriterReadyPromiseInitializeAsResolved(this);
            }
            defaultWriterClosedPromiseInitialize(this);
          } else if (state === "erroring") {
            defaultWriterReadyPromiseInitializeAsRejected(this, stream._storedError);
            defaultWriterClosedPromiseInitialize(this);
          } else if (state === "closed") {
            defaultWriterReadyPromiseInitializeAsResolved(this);
            defaultWriterClosedPromiseInitializeAsResolved(this);
          } else {
            const storedError = stream._storedError;
            defaultWriterReadyPromiseInitializeAsRejected(this, storedError);
            defaultWriterClosedPromiseInitializeAsRejected(this, storedError);
          }
        }
        get closed() {
          if (!IsWritableStreamDefaultWriter(this)) {
            return promiseRejectedWith(defaultWriterBrandCheckException("closed"));
          }
          return this._closedPromise;
        }
        get desiredSize() {
          if (!IsWritableStreamDefaultWriter(this)) {
            throw defaultWriterBrandCheckException("desiredSize");
          }
          if (this._ownerWritableStream === void 0) {
            throw defaultWriterLockException("desiredSize");
          }
          return WritableStreamDefaultWriterGetDesiredSize(this);
        }
        get ready() {
          if (!IsWritableStreamDefaultWriter(this)) {
            return promiseRejectedWith(defaultWriterBrandCheckException("ready"));
          }
          return this._readyPromise;
        }
        abort(reason = void 0) {
          if (!IsWritableStreamDefaultWriter(this)) {
            return promiseRejectedWith(defaultWriterBrandCheckException("abort"));
          }
          if (this._ownerWritableStream === void 0) {
            return promiseRejectedWith(defaultWriterLockException("abort"));
          }
          return WritableStreamDefaultWriterAbort(this, reason);
        }
        close() {
          if (!IsWritableStreamDefaultWriter(this)) {
            return promiseRejectedWith(defaultWriterBrandCheckException("close"));
          }
          const stream = this._ownerWritableStream;
          if (stream === void 0) {
            return promiseRejectedWith(defaultWriterLockException("close"));
          }
          if (WritableStreamCloseQueuedOrInFlight(stream)) {
            return promiseRejectedWith(new TypeError("Cannot close an already-closing stream"));
          }
          return WritableStreamDefaultWriterClose(this);
        }
        releaseLock() {
          if (!IsWritableStreamDefaultWriter(this)) {
            throw defaultWriterBrandCheckException("releaseLock");
          }
          const stream = this._ownerWritableStream;
          if (stream === void 0) {
            return;
          }
          WritableStreamDefaultWriterRelease(this);
        }
        write(chunk = void 0) {
          if (!IsWritableStreamDefaultWriter(this)) {
            return promiseRejectedWith(defaultWriterBrandCheckException("write"));
          }
          if (this._ownerWritableStream === void 0) {
            return promiseRejectedWith(defaultWriterLockException("write to"));
          }
          return WritableStreamDefaultWriterWrite(this, chunk);
        }
      }
      Object.defineProperties(WritableStreamDefaultWriter.prototype, {
        abort: { enumerable: true },
        close: { enumerable: true },
        releaseLock: { enumerable: true },
        write: { enumerable: true },
        closed: { enumerable: true },
        desiredSize: { enumerable: true },
        ready: { enumerable: true }
      });
      if (typeof SymbolPolyfill.toStringTag === "symbol") {
        Object.defineProperty(WritableStreamDefaultWriter.prototype, SymbolPolyfill.toStringTag, {
          value: "WritableStreamDefaultWriter",
          configurable: true
        });
      }
      function IsWritableStreamDefaultWriter(x2) {
        if (!typeIsObject(x2)) {
          return false;
        }
        if (!Object.prototype.hasOwnProperty.call(x2, "_ownerWritableStream")) {
          return false;
        }
        return x2 instanceof WritableStreamDefaultWriter;
      }
      function WritableStreamDefaultWriterAbort(writer, reason) {
        const stream = writer._ownerWritableStream;
        return WritableStreamAbort(stream, reason);
      }
      function WritableStreamDefaultWriterClose(writer) {
        const stream = writer._ownerWritableStream;
        return WritableStreamClose(stream);
      }
      function WritableStreamDefaultWriterCloseWithErrorPropagation(writer) {
        const stream = writer._ownerWritableStream;
        const state = stream._state;
        if (WritableStreamCloseQueuedOrInFlight(stream) || state === "closed") {
          return promiseResolvedWith(void 0);
        }
        if (state === "errored") {
          return promiseRejectedWith(stream._storedError);
        }
        return WritableStreamDefaultWriterClose(writer);
      }
      function WritableStreamDefaultWriterEnsureClosedPromiseRejected(writer, error) {
        if (writer._closedPromiseState === "pending") {
          defaultWriterClosedPromiseReject(writer, error);
        } else {
          defaultWriterClosedPromiseResetToRejected(writer, error);
        }
      }
      function WritableStreamDefaultWriterEnsureReadyPromiseRejected(writer, error) {
        if (writer._readyPromiseState === "pending") {
          defaultWriterReadyPromiseReject(writer, error);
        } else {
          defaultWriterReadyPromiseResetToRejected(writer, error);
        }
      }
      function WritableStreamDefaultWriterGetDesiredSize(writer) {
        const stream = writer._ownerWritableStream;
        const state = stream._state;
        if (state === "errored" || state === "erroring") {
          return null;
        }
        if (state === "closed") {
          return 0;
        }
        return WritableStreamDefaultControllerGetDesiredSize(stream._writableStreamController);
      }
      function WritableStreamDefaultWriterRelease(writer) {
        const stream = writer._ownerWritableStream;
        const releasedError = new TypeError(`Writer was released and can no longer be used to monitor the stream's closedness`);
        WritableStreamDefaultWriterEnsureReadyPromiseRejected(writer, releasedError);
        WritableStreamDefaultWriterEnsureClosedPromiseRejected(writer, releasedError);
        stream._writer = void 0;
        writer._ownerWritableStream = void 0;
      }
      function WritableStreamDefaultWriterWrite(writer, chunk) {
        const stream = writer._ownerWritableStream;
        const controller = stream._writableStreamController;
        const chunkSize = WritableStreamDefaultControllerGetChunkSize(controller, chunk);
        if (stream !== writer._ownerWritableStream) {
          return promiseRejectedWith(defaultWriterLockException("write to"));
        }
        const state = stream._state;
        if (state === "errored") {
          return promiseRejectedWith(stream._storedError);
        }
        if (WritableStreamCloseQueuedOrInFlight(stream) || state === "closed") {
          return promiseRejectedWith(new TypeError("The stream is closing or closed and cannot be written to"));
        }
        if (state === "erroring") {
          return promiseRejectedWith(stream._storedError);
        }
        const promise = WritableStreamAddWriteRequest(stream);
        WritableStreamDefaultControllerWrite(controller, chunk, chunkSize);
        return promise;
      }
      const closeSentinel = {};
      class WritableStreamDefaultController {
        constructor() {
          throw new TypeError("Illegal constructor");
        }
        get abortReason() {
          if (!IsWritableStreamDefaultController(this)) {
            throw defaultControllerBrandCheckException$2("abortReason");
          }
          return this._abortReason;
        }
        get signal() {
          if (!IsWritableStreamDefaultController(this)) {
            throw defaultControllerBrandCheckException$2("signal");
          }
          if (this._abortController === void 0) {
            throw new TypeError("WritableStreamDefaultController.prototype.signal is not supported");
          }
          return this._abortController.signal;
        }
        error(e2 = void 0) {
          if (!IsWritableStreamDefaultController(this)) {
            throw defaultControllerBrandCheckException$2("error");
          }
          const state = this._controlledWritableStream._state;
          if (state !== "writable") {
            return;
          }
          WritableStreamDefaultControllerError(this, e2);
        }
        [AbortSteps](reason) {
          const result = this._abortAlgorithm(reason);
          WritableStreamDefaultControllerClearAlgorithms(this);
          return result;
        }
        [ErrorSteps]() {
          ResetQueue(this);
        }
      }
      Object.defineProperties(WritableStreamDefaultController.prototype, {
        abortReason: { enumerable: true },
        signal: { enumerable: true },
        error: { enumerable: true }
      });
      if (typeof SymbolPolyfill.toStringTag === "symbol") {
        Object.defineProperty(WritableStreamDefaultController.prototype, SymbolPolyfill.toStringTag, {
          value: "WritableStreamDefaultController",
          configurable: true
        });
      }
      function IsWritableStreamDefaultController(x2) {
        if (!typeIsObject(x2)) {
          return false;
        }
        if (!Object.prototype.hasOwnProperty.call(x2, "_controlledWritableStream")) {
          return false;
        }
        return x2 instanceof WritableStreamDefaultController;
      }
      function SetUpWritableStreamDefaultController(stream, controller, startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark, sizeAlgorithm) {
        controller._controlledWritableStream = stream;
        stream._writableStreamController = controller;
        controller._queue = void 0;
        controller._queueTotalSize = void 0;
        ResetQueue(controller);
        controller._abortReason = void 0;
        controller._abortController = createAbortController();
        controller._started = false;
        controller._strategySizeAlgorithm = sizeAlgorithm;
        controller._strategyHWM = highWaterMark;
        controller._writeAlgorithm = writeAlgorithm;
        controller._closeAlgorithm = closeAlgorithm;
        controller._abortAlgorithm = abortAlgorithm;
        const backpressure = WritableStreamDefaultControllerGetBackpressure(controller);
        WritableStreamUpdateBackpressure(stream, backpressure);
        const startResult = startAlgorithm();
        const startPromise = promiseResolvedWith(startResult);
        uponPromise(startPromise, () => {
          controller._started = true;
          WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
        }, (r2) => {
          controller._started = true;
          WritableStreamDealWithRejection(stream, r2);
        });
      }
      function SetUpWritableStreamDefaultControllerFromUnderlyingSink(stream, underlyingSink, highWaterMark, sizeAlgorithm) {
        const controller = Object.create(WritableStreamDefaultController.prototype);
        let startAlgorithm = () => void 0;
        let writeAlgorithm = () => promiseResolvedWith(void 0);
        let closeAlgorithm = () => promiseResolvedWith(void 0);
        let abortAlgorithm = () => promiseResolvedWith(void 0);
        if (underlyingSink.start !== void 0) {
          startAlgorithm = () => underlyingSink.start(controller);
        }
        if (underlyingSink.write !== void 0) {
          writeAlgorithm = (chunk) => underlyingSink.write(chunk, controller);
        }
        if (underlyingSink.close !== void 0) {
          closeAlgorithm = () => underlyingSink.close();
        }
        if (underlyingSink.abort !== void 0) {
          abortAlgorithm = (reason) => underlyingSink.abort(reason);
        }
        SetUpWritableStreamDefaultController(stream, controller, startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark, sizeAlgorithm);
      }
      function WritableStreamDefaultControllerClearAlgorithms(controller) {
        controller._writeAlgorithm = void 0;
        controller._closeAlgorithm = void 0;
        controller._abortAlgorithm = void 0;
        controller._strategySizeAlgorithm = void 0;
      }
      function WritableStreamDefaultControllerClose(controller) {
        EnqueueValueWithSize(controller, closeSentinel, 0);
        WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
      }
      function WritableStreamDefaultControllerGetChunkSize(controller, chunk) {
        try {
          return controller._strategySizeAlgorithm(chunk);
        } catch (chunkSizeE) {
          WritableStreamDefaultControllerErrorIfNeeded(controller, chunkSizeE);
          return 1;
        }
      }
      function WritableStreamDefaultControllerGetDesiredSize(controller) {
        return controller._strategyHWM - controller._queueTotalSize;
      }
      function WritableStreamDefaultControllerWrite(controller, chunk, chunkSize) {
        try {
          EnqueueValueWithSize(controller, chunk, chunkSize);
        } catch (enqueueE) {
          WritableStreamDefaultControllerErrorIfNeeded(controller, enqueueE);
          return;
        }
        const stream = controller._controlledWritableStream;
        if (!WritableStreamCloseQueuedOrInFlight(stream) && stream._state === "writable") {
          const backpressure = WritableStreamDefaultControllerGetBackpressure(controller);
          WritableStreamUpdateBackpressure(stream, backpressure);
        }
        WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
      }
      function WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller) {
        const stream = controller._controlledWritableStream;
        if (!controller._started) {
          return;
        }
        if (stream._inFlightWriteRequest !== void 0) {
          return;
        }
        const state = stream._state;
        if (state === "erroring") {
          WritableStreamFinishErroring(stream);
          return;
        }
        if (controller._queue.length === 0) {
          return;
        }
        const value = PeekQueueValue(controller);
        if (value === closeSentinel) {
          WritableStreamDefaultControllerProcessClose(controller);
        } else {
          WritableStreamDefaultControllerProcessWrite(controller, value);
        }
      }
      function WritableStreamDefaultControllerErrorIfNeeded(controller, error) {
        if (controller._controlledWritableStream._state === "writable") {
          WritableStreamDefaultControllerError(controller, error);
        }
      }
      function WritableStreamDefaultControllerProcessClose(controller) {
        const stream = controller._controlledWritableStream;
        WritableStreamMarkCloseRequestInFlight(stream);
        DequeueValue(controller);
        const sinkClosePromise = controller._closeAlgorithm();
        WritableStreamDefaultControllerClearAlgorithms(controller);
        uponPromise(sinkClosePromise, () => {
          WritableStreamFinishInFlightClose(stream);
        }, (reason) => {
          WritableStreamFinishInFlightCloseWithError(stream, reason);
        });
      }
      function WritableStreamDefaultControllerProcessWrite(controller, chunk) {
        const stream = controller._controlledWritableStream;
        WritableStreamMarkFirstWriteRequestInFlight(stream);
        const sinkWritePromise = controller._writeAlgorithm(chunk);
        uponPromise(sinkWritePromise, () => {
          WritableStreamFinishInFlightWrite(stream);
          const state = stream._state;
          DequeueValue(controller);
          if (!WritableStreamCloseQueuedOrInFlight(stream) && state === "writable") {
            const backpressure = WritableStreamDefaultControllerGetBackpressure(controller);
            WritableStreamUpdateBackpressure(stream, backpressure);
          }
          WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
        }, (reason) => {
          if (stream._state === "writable") {
            WritableStreamDefaultControllerClearAlgorithms(controller);
          }
          WritableStreamFinishInFlightWriteWithError(stream, reason);
        });
      }
      function WritableStreamDefaultControllerGetBackpressure(controller) {
        const desiredSize = WritableStreamDefaultControllerGetDesiredSize(controller);
        return desiredSize <= 0;
      }
      function WritableStreamDefaultControllerError(controller, error) {
        const stream = controller._controlledWritableStream;
        WritableStreamDefaultControllerClearAlgorithms(controller);
        WritableStreamStartErroring(stream, error);
      }
      function streamBrandCheckException$2(name) {
        return new TypeError(`WritableStream.prototype.${name} can only be used on a WritableStream`);
      }
      function defaultControllerBrandCheckException$2(name) {
        return new TypeError(`WritableStreamDefaultController.prototype.${name} can only be used on a WritableStreamDefaultController`);
      }
      function defaultWriterBrandCheckException(name) {
        return new TypeError(`WritableStreamDefaultWriter.prototype.${name} can only be used on a WritableStreamDefaultWriter`);
      }
      function defaultWriterLockException(name) {
        return new TypeError("Cannot " + name + " a stream using a released writer");
      }
      function defaultWriterClosedPromiseInitialize(writer) {
        writer._closedPromise = newPromise((resolve, reject) => {
          writer._closedPromise_resolve = resolve;
          writer._closedPromise_reject = reject;
          writer._closedPromiseState = "pending";
        });
      }
      function defaultWriterClosedPromiseInitializeAsRejected(writer, reason) {
        defaultWriterClosedPromiseInitialize(writer);
        defaultWriterClosedPromiseReject(writer, reason);
      }
      function defaultWriterClosedPromiseInitializeAsResolved(writer) {
        defaultWriterClosedPromiseInitialize(writer);
        defaultWriterClosedPromiseResolve(writer);
      }
      function defaultWriterClosedPromiseReject(writer, reason) {
        if (writer._closedPromise_reject === void 0) {
          return;
        }
        setPromiseIsHandledToTrue(writer._closedPromise);
        writer._closedPromise_reject(reason);
        writer._closedPromise_resolve = void 0;
        writer._closedPromise_reject = void 0;
        writer._closedPromiseState = "rejected";
      }
      function defaultWriterClosedPromiseResetToRejected(writer, reason) {
        defaultWriterClosedPromiseInitializeAsRejected(writer, reason);
      }
      function defaultWriterClosedPromiseResolve(writer) {
        if (writer._closedPromise_resolve === void 0) {
          return;
        }
        writer._closedPromise_resolve(void 0);
        writer._closedPromise_resolve = void 0;
        writer._closedPromise_reject = void 0;
        writer._closedPromiseState = "resolved";
      }
      function defaultWriterReadyPromiseInitialize(writer) {
        writer._readyPromise = newPromise((resolve, reject) => {
          writer._readyPromise_resolve = resolve;
          writer._readyPromise_reject = reject;
        });
        writer._readyPromiseState = "pending";
      }
      function defaultWriterReadyPromiseInitializeAsRejected(writer, reason) {
        defaultWriterReadyPromiseInitialize(writer);
        defaultWriterReadyPromiseReject(writer, reason);
      }
      function defaultWriterReadyPromiseInitializeAsResolved(writer) {
        defaultWriterReadyPromiseInitialize(writer);
        defaultWriterReadyPromiseResolve(writer);
      }
      function defaultWriterReadyPromiseReject(writer, reason) {
        if (writer._readyPromise_reject === void 0) {
          return;
        }
        setPromiseIsHandledToTrue(writer._readyPromise);
        writer._readyPromise_reject(reason);
        writer._readyPromise_resolve = void 0;
        writer._readyPromise_reject = void 0;
        writer._readyPromiseState = "rejected";
      }
      function defaultWriterReadyPromiseReset(writer) {
        defaultWriterReadyPromiseInitialize(writer);
      }
      function defaultWriterReadyPromiseResetToRejected(writer, reason) {
        defaultWriterReadyPromiseInitializeAsRejected(writer, reason);
      }
      function defaultWriterReadyPromiseResolve(writer) {
        if (writer._readyPromise_resolve === void 0) {
          return;
        }
        writer._readyPromise_resolve(void 0);
        writer._readyPromise_resolve = void 0;
        writer._readyPromise_reject = void 0;
        writer._readyPromiseState = "fulfilled";
      }
      const NativeDOMException = typeof DOMException !== "undefined" ? DOMException : void 0;
      function isDOMExceptionConstructor(ctor) {
        if (!(typeof ctor === "function" || typeof ctor === "object")) {
          return false;
        }
        try {
          new ctor();
          return true;
        } catch (_a) {
          return false;
        }
      }
      function createDOMExceptionPolyfill() {
        const ctor = function DOMException3(message, name) {
          this.message = message || "";
          this.name = name || "Error";
          if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
          }
        };
        ctor.prototype = Object.create(Error.prototype);
        Object.defineProperty(ctor.prototype, "constructor", { value: ctor, writable: true, configurable: true });
        return ctor;
      }
      const DOMException$1 = isDOMExceptionConstructor(NativeDOMException) ? NativeDOMException : createDOMExceptionPolyfill();
      function ReadableStreamPipeTo(source, dest, preventClose, preventAbort, preventCancel, signal) {
        const reader = AcquireReadableStreamDefaultReader(source);
        const writer = AcquireWritableStreamDefaultWriter(dest);
        source._disturbed = true;
        let shuttingDown = false;
        let currentWrite = promiseResolvedWith(void 0);
        return newPromise((resolve, reject) => {
          let abortAlgorithm;
          if (signal !== void 0) {
            abortAlgorithm = () => {
              const error = new DOMException$1("Aborted", "AbortError");
              const actions = [];
              if (!preventAbort) {
                actions.push(() => {
                  if (dest._state === "writable") {
                    return WritableStreamAbort(dest, error);
                  }
                  return promiseResolvedWith(void 0);
                });
              }
              if (!preventCancel) {
                actions.push(() => {
                  if (source._state === "readable") {
                    return ReadableStreamCancel(source, error);
                  }
                  return promiseResolvedWith(void 0);
                });
              }
              shutdownWithAction(() => Promise.all(actions.map((action) => action())), true, error);
            };
            if (signal.aborted) {
              abortAlgorithm();
              return;
            }
            signal.addEventListener("abort", abortAlgorithm);
          }
          function pipeLoop() {
            return newPromise((resolveLoop, rejectLoop) => {
              function next(done) {
                if (done) {
                  resolveLoop();
                } else {
                  PerformPromiseThen(pipeStep(), next, rejectLoop);
                }
              }
              next(false);
            });
          }
          function pipeStep() {
            if (shuttingDown) {
              return promiseResolvedWith(true);
            }
            return PerformPromiseThen(writer._readyPromise, () => {
              return newPromise((resolveRead, rejectRead) => {
                ReadableStreamDefaultReaderRead(reader, {
                  _chunkSteps: (chunk) => {
                    currentWrite = PerformPromiseThen(WritableStreamDefaultWriterWrite(writer, chunk), void 0, noop2);
                    resolveRead(false);
                  },
                  _closeSteps: () => resolveRead(true),
                  _errorSteps: rejectRead
                });
              });
            });
          }
          isOrBecomesErrored(source, reader._closedPromise, (storedError) => {
            if (!preventAbort) {
              shutdownWithAction(() => WritableStreamAbort(dest, storedError), true, storedError);
            } else {
              shutdown(true, storedError);
            }
          });
          isOrBecomesErrored(dest, writer._closedPromise, (storedError) => {
            if (!preventCancel) {
              shutdownWithAction(() => ReadableStreamCancel(source, storedError), true, storedError);
            } else {
              shutdown(true, storedError);
            }
          });
          isOrBecomesClosed(source, reader._closedPromise, () => {
            if (!preventClose) {
              shutdownWithAction(() => WritableStreamDefaultWriterCloseWithErrorPropagation(writer));
            } else {
              shutdown();
            }
          });
          if (WritableStreamCloseQueuedOrInFlight(dest) || dest._state === "closed") {
            const destClosed = new TypeError("the destination writable stream closed before all data could be piped to it");
            if (!preventCancel) {
              shutdownWithAction(() => ReadableStreamCancel(source, destClosed), true, destClosed);
            } else {
              shutdown(true, destClosed);
            }
          }
          setPromiseIsHandledToTrue(pipeLoop());
          function waitForWritesToFinish() {
            const oldCurrentWrite = currentWrite;
            return PerformPromiseThen(currentWrite, () => oldCurrentWrite !== currentWrite ? waitForWritesToFinish() : void 0);
          }
          function isOrBecomesErrored(stream, promise, action) {
            if (stream._state === "errored") {
              action(stream._storedError);
            } else {
              uponRejection(promise, action);
            }
          }
          function isOrBecomesClosed(stream, promise, action) {
            if (stream._state === "closed") {
              action();
            } else {
              uponFulfillment(promise, action);
            }
          }
          function shutdownWithAction(action, originalIsError, originalError) {
            if (shuttingDown) {
              return;
            }
            shuttingDown = true;
            if (dest._state === "writable" && !WritableStreamCloseQueuedOrInFlight(dest)) {
              uponFulfillment(waitForWritesToFinish(), doTheRest);
            } else {
              doTheRest();
            }
            function doTheRest() {
              uponPromise(action(), () => finalize(originalIsError, originalError), (newError) => finalize(true, newError));
            }
          }
          function shutdown(isError, error) {
            if (shuttingDown) {
              return;
            }
            shuttingDown = true;
            if (dest._state === "writable" && !WritableStreamCloseQueuedOrInFlight(dest)) {
              uponFulfillment(waitForWritesToFinish(), () => finalize(isError, error));
            } else {
              finalize(isError, error);
            }
          }
          function finalize(isError, error) {
            WritableStreamDefaultWriterRelease(writer);
            ReadableStreamReaderGenericRelease(reader);
            if (signal !== void 0) {
              signal.removeEventListener("abort", abortAlgorithm);
            }
            if (isError) {
              reject(error);
            } else {
              resolve(void 0);
            }
          }
        });
      }
      class ReadableStreamDefaultController {
        constructor() {
          throw new TypeError("Illegal constructor");
        }
        get desiredSize() {
          if (!IsReadableStreamDefaultController(this)) {
            throw defaultControllerBrandCheckException$1("desiredSize");
          }
          return ReadableStreamDefaultControllerGetDesiredSize(this);
        }
        close() {
          if (!IsReadableStreamDefaultController(this)) {
            throw defaultControllerBrandCheckException$1("close");
          }
          if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(this)) {
            throw new TypeError("The stream is not in a state that permits close");
          }
          ReadableStreamDefaultControllerClose(this);
        }
        enqueue(chunk = void 0) {
          if (!IsReadableStreamDefaultController(this)) {
            throw defaultControllerBrandCheckException$1("enqueue");
          }
          if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(this)) {
            throw new TypeError("The stream is not in a state that permits enqueue");
          }
          return ReadableStreamDefaultControllerEnqueue(this, chunk);
        }
        error(e2 = void 0) {
          if (!IsReadableStreamDefaultController(this)) {
            throw defaultControllerBrandCheckException$1("error");
          }
          ReadableStreamDefaultControllerError(this, e2);
        }
        [CancelSteps](reason) {
          ResetQueue(this);
          const result = this._cancelAlgorithm(reason);
          ReadableStreamDefaultControllerClearAlgorithms(this);
          return result;
        }
        [PullSteps](readRequest) {
          const stream = this._controlledReadableStream;
          if (this._queue.length > 0) {
            const chunk = DequeueValue(this);
            if (this._closeRequested && this._queue.length === 0) {
              ReadableStreamDefaultControllerClearAlgorithms(this);
              ReadableStreamClose(stream);
            } else {
              ReadableStreamDefaultControllerCallPullIfNeeded(this);
            }
            readRequest._chunkSteps(chunk);
          } else {
            ReadableStreamAddReadRequest(stream, readRequest);
            ReadableStreamDefaultControllerCallPullIfNeeded(this);
          }
        }
      }
      Object.defineProperties(ReadableStreamDefaultController.prototype, {
        close: { enumerable: true },
        enqueue: { enumerable: true },
        error: { enumerable: true },
        desiredSize: { enumerable: true }
      });
      if (typeof SymbolPolyfill.toStringTag === "symbol") {
        Object.defineProperty(ReadableStreamDefaultController.prototype, SymbolPolyfill.toStringTag, {
          value: "ReadableStreamDefaultController",
          configurable: true
        });
      }
      function IsReadableStreamDefaultController(x2) {
        if (!typeIsObject(x2)) {
          return false;
        }
        if (!Object.prototype.hasOwnProperty.call(x2, "_controlledReadableStream")) {
          return false;
        }
        return x2 instanceof ReadableStreamDefaultController;
      }
      function ReadableStreamDefaultControllerCallPullIfNeeded(controller) {
        const shouldPull = ReadableStreamDefaultControllerShouldCallPull(controller);
        if (!shouldPull) {
          return;
        }
        if (controller._pulling) {
          controller._pullAgain = true;
          return;
        }
        controller._pulling = true;
        const pullPromise = controller._pullAlgorithm();
        uponPromise(pullPromise, () => {
          controller._pulling = false;
          if (controller._pullAgain) {
            controller._pullAgain = false;
            ReadableStreamDefaultControllerCallPullIfNeeded(controller);
          }
        }, (e2) => {
          ReadableStreamDefaultControllerError(controller, e2);
        });
      }
      function ReadableStreamDefaultControllerShouldCallPull(controller) {
        const stream = controller._controlledReadableStream;
        if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(controller)) {
          return false;
        }
        if (!controller._started) {
          return false;
        }
        if (IsReadableStreamLocked(stream) && ReadableStreamGetNumReadRequests(stream) > 0) {
          return true;
        }
        const desiredSize = ReadableStreamDefaultControllerGetDesiredSize(controller);
        if (desiredSize > 0) {
          return true;
        }
        return false;
      }
      function ReadableStreamDefaultControllerClearAlgorithms(controller) {
        controller._pullAlgorithm = void 0;
        controller._cancelAlgorithm = void 0;
        controller._strategySizeAlgorithm = void 0;
      }
      function ReadableStreamDefaultControllerClose(controller) {
        if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(controller)) {
          return;
        }
        const stream = controller._controlledReadableStream;
        controller._closeRequested = true;
        if (controller._queue.length === 0) {
          ReadableStreamDefaultControllerClearAlgorithms(controller);
          ReadableStreamClose(stream);
        }
      }
      function ReadableStreamDefaultControllerEnqueue(controller, chunk) {
        if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(controller)) {
          return;
        }
        const stream = controller._controlledReadableStream;
        if (IsReadableStreamLocked(stream) && ReadableStreamGetNumReadRequests(stream) > 0) {
          ReadableStreamFulfillReadRequest(stream, chunk, false);
        } else {
          let chunkSize;
          try {
            chunkSize = controller._strategySizeAlgorithm(chunk);
          } catch (chunkSizeE) {
            ReadableStreamDefaultControllerError(controller, chunkSizeE);
            throw chunkSizeE;
          }
          try {
            EnqueueValueWithSize(controller, chunk, chunkSize);
          } catch (enqueueE) {
            ReadableStreamDefaultControllerError(controller, enqueueE);
            throw enqueueE;
          }
        }
        ReadableStreamDefaultControllerCallPullIfNeeded(controller);
      }
      function ReadableStreamDefaultControllerError(controller, e2) {
        const stream = controller._controlledReadableStream;
        if (stream._state !== "readable") {
          return;
        }
        ResetQueue(controller);
        ReadableStreamDefaultControllerClearAlgorithms(controller);
        ReadableStreamError(stream, e2);
      }
      function ReadableStreamDefaultControllerGetDesiredSize(controller) {
        const state = controller._controlledReadableStream._state;
        if (state === "errored") {
          return null;
        }
        if (state === "closed") {
          return 0;
        }
        return controller._strategyHWM - controller._queueTotalSize;
      }
      function ReadableStreamDefaultControllerHasBackpressure(controller) {
        if (ReadableStreamDefaultControllerShouldCallPull(controller)) {
          return false;
        }
        return true;
      }
      function ReadableStreamDefaultControllerCanCloseOrEnqueue(controller) {
        const state = controller._controlledReadableStream._state;
        if (!controller._closeRequested && state === "readable") {
          return true;
        }
        return false;
      }
      function SetUpReadableStreamDefaultController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, sizeAlgorithm) {
        controller._controlledReadableStream = stream;
        controller._queue = void 0;
        controller._queueTotalSize = void 0;
        ResetQueue(controller);
        controller._started = false;
        controller._closeRequested = false;
        controller._pullAgain = false;
        controller._pulling = false;
        controller._strategySizeAlgorithm = sizeAlgorithm;
        controller._strategyHWM = highWaterMark;
        controller._pullAlgorithm = pullAlgorithm;
        controller._cancelAlgorithm = cancelAlgorithm;
        stream._readableStreamController = controller;
        const startResult = startAlgorithm();
        uponPromise(promiseResolvedWith(startResult), () => {
          controller._started = true;
          ReadableStreamDefaultControllerCallPullIfNeeded(controller);
        }, (r2) => {
          ReadableStreamDefaultControllerError(controller, r2);
        });
      }
      function SetUpReadableStreamDefaultControllerFromUnderlyingSource(stream, underlyingSource, highWaterMark, sizeAlgorithm) {
        const controller = Object.create(ReadableStreamDefaultController.prototype);
        let startAlgorithm = () => void 0;
        let pullAlgorithm = () => promiseResolvedWith(void 0);
        let cancelAlgorithm = () => promiseResolvedWith(void 0);
        if (underlyingSource.start !== void 0) {
          startAlgorithm = () => underlyingSource.start(controller);
        }
        if (underlyingSource.pull !== void 0) {
          pullAlgorithm = () => underlyingSource.pull(controller);
        }
        if (underlyingSource.cancel !== void 0) {
          cancelAlgorithm = (reason) => underlyingSource.cancel(reason);
        }
        SetUpReadableStreamDefaultController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, sizeAlgorithm);
      }
      function defaultControllerBrandCheckException$1(name) {
        return new TypeError(`ReadableStreamDefaultController.prototype.${name} can only be used on a ReadableStreamDefaultController`);
      }
      function ReadableStreamTee(stream, cloneForBranch2) {
        if (IsReadableByteStreamController(stream._readableStreamController)) {
          return ReadableByteStreamTee(stream);
        }
        return ReadableStreamDefaultTee(stream);
      }
      function ReadableStreamDefaultTee(stream, cloneForBranch2) {
        const reader = AcquireReadableStreamDefaultReader(stream);
        let reading = false;
        let readAgain = false;
        let canceled1 = false;
        let canceled2 = false;
        let reason1;
        let reason2;
        let branch1;
        let branch2;
        let resolveCancelPromise;
        const cancelPromise = newPromise((resolve) => {
          resolveCancelPromise = resolve;
        });
        function pullAlgorithm() {
          if (reading) {
            readAgain = true;
            return promiseResolvedWith(void 0);
          }
          reading = true;
          const readRequest = {
            _chunkSteps: (chunk) => {
              queueMicrotask(() => {
                readAgain = false;
                const chunk1 = chunk;
                const chunk2 = chunk;
                if (!canceled1) {
                  ReadableStreamDefaultControllerEnqueue(branch1._readableStreamController, chunk1);
                }
                if (!canceled2) {
                  ReadableStreamDefaultControllerEnqueue(branch2._readableStreamController, chunk2);
                }
                reading = false;
                if (readAgain) {
                  pullAlgorithm();
                }
              });
            },
            _closeSteps: () => {
              reading = false;
              if (!canceled1) {
                ReadableStreamDefaultControllerClose(branch1._readableStreamController);
              }
              if (!canceled2) {
                ReadableStreamDefaultControllerClose(branch2._readableStreamController);
              }
              if (!canceled1 || !canceled2) {
                resolveCancelPromise(void 0);
              }
            },
            _errorSteps: () => {
              reading = false;
            }
          };
          ReadableStreamDefaultReaderRead(reader, readRequest);
          return promiseResolvedWith(void 0);
        }
        function cancel1Algorithm(reason) {
          canceled1 = true;
          reason1 = reason;
          if (canceled2) {
            const compositeReason = CreateArrayFromList([reason1, reason2]);
            const cancelResult = ReadableStreamCancel(stream, compositeReason);
            resolveCancelPromise(cancelResult);
          }
          return cancelPromise;
        }
        function cancel2Algorithm(reason) {
          canceled2 = true;
          reason2 = reason;
          if (canceled1) {
            const compositeReason = CreateArrayFromList([reason1, reason2]);
            const cancelResult = ReadableStreamCancel(stream, compositeReason);
            resolveCancelPromise(cancelResult);
          }
          return cancelPromise;
        }
        function startAlgorithm() {
        }
        branch1 = CreateReadableStream(startAlgorithm, pullAlgorithm, cancel1Algorithm);
        branch2 = CreateReadableStream(startAlgorithm, pullAlgorithm, cancel2Algorithm);
        uponRejection(reader._closedPromise, (r2) => {
          ReadableStreamDefaultControllerError(branch1._readableStreamController, r2);
          ReadableStreamDefaultControllerError(branch2._readableStreamController, r2);
          if (!canceled1 || !canceled2) {
            resolveCancelPromise(void 0);
          }
        });
        return [branch1, branch2];
      }
      function ReadableByteStreamTee(stream) {
        let reader = AcquireReadableStreamDefaultReader(stream);
        let reading = false;
        let readAgainForBranch1 = false;
        let readAgainForBranch2 = false;
        let canceled1 = false;
        let canceled2 = false;
        let reason1;
        let reason2;
        let branch1;
        let branch2;
        let resolveCancelPromise;
        const cancelPromise = newPromise((resolve) => {
          resolveCancelPromise = resolve;
        });
        function forwardReaderError(thisReader) {
          uponRejection(thisReader._closedPromise, (r2) => {
            if (thisReader !== reader) {
              return;
            }
            ReadableByteStreamControllerError(branch1._readableStreamController, r2);
            ReadableByteStreamControllerError(branch2._readableStreamController, r2);
            if (!canceled1 || !canceled2) {
              resolveCancelPromise(void 0);
            }
          });
        }
        function pullWithDefaultReader() {
          if (IsReadableStreamBYOBReader(reader)) {
            ReadableStreamReaderGenericRelease(reader);
            reader = AcquireReadableStreamDefaultReader(stream);
            forwardReaderError(reader);
          }
          const readRequest = {
            _chunkSteps: (chunk) => {
              queueMicrotask(() => {
                readAgainForBranch1 = false;
                readAgainForBranch2 = false;
                const chunk1 = chunk;
                let chunk2 = chunk;
                if (!canceled1 && !canceled2) {
                  try {
                    chunk2 = CloneAsUint8Array(chunk);
                  } catch (cloneE) {
                    ReadableByteStreamControllerError(branch1._readableStreamController, cloneE);
                    ReadableByteStreamControllerError(branch2._readableStreamController, cloneE);
                    resolveCancelPromise(ReadableStreamCancel(stream, cloneE));
                    return;
                  }
                }
                if (!canceled1) {
                  ReadableByteStreamControllerEnqueue(branch1._readableStreamController, chunk1);
                }
                if (!canceled2) {
                  ReadableByteStreamControllerEnqueue(branch2._readableStreamController, chunk2);
                }
                reading = false;
                if (readAgainForBranch1) {
                  pull1Algorithm();
                } else if (readAgainForBranch2) {
                  pull2Algorithm();
                }
              });
            },
            _closeSteps: () => {
              reading = false;
              if (!canceled1) {
                ReadableByteStreamControllerClose(branch1._readableStreamController);
              }
              if (!canceled2) {
                ReadableByteStreamControllerClose(branch2._readableStreamController);
              }
              if (branch1._readableStreamController._pendingPullIntos.length > 0) {
                ReadableByteStreamControllerRespond(branch1._readableStreamController, 0);
              }
              if (branch2._readableStreamController._pendingPullIntos.length > 0) {
                ReadableByteStreamControllerRespond(branch2._readableStreamController, 0);
              }
              if (!canceled1 || !canceled2) {
                resolveCancelPromise(void 0);
              }
            },
            _errorSteps: () => {
              reading = false;
            }
          };
          ReadableStreamDefaultReaderRead(reader, readRequest);
        }
        function pullWithBYOBReader(view, forBranch2) {
          if (IsReadableStreamDefaultReader(reader)) {
            ReadableStreamReaderGenericRelease(reader);
            reader = AcquireReadableStreamBYOBReader(stream);
            forwardReaderError(reader);
          }
          const byobBranch = forBranch2 ? branch2 : branch1;
          const otherBranch = forBranch2 ? branch1 : branch2;
          const readIntoRequest = {
            _chunkSteps: (chunk) => {
              queueMicrotask(() => {
                readAgainForBranch1 = false;
                readAgainForBranch2 = false;
                const byobCanceled = forBranch2 ? canceled2 : canceled1;
                const otherCanceled = forBranch2 ? canceled1 : canceled2;
                if (!otherCanceled) {
                  let clonedChunk;
                  try {
                    clonedChunk = CloneAsUint8Array(chunk);
                  } catch (cloneE) {
                    ReadableByteStreamControllerError(byobBranch._readableStreamController, cloneE);
                    ReadableByteStreamControllerError(otherBranch._readableStreamController, cloneE);
                    resolveCancelPromise(ReadableStreamCancel(stream, cloneE));
                    return;
                  }
                  if (!byobCanceled) {
                    ReadableByteStreamControllerRespondWithNewView(byobBranch._readableStreamController, chunk);
                  }
                  ReadableByteStreamControllerEnqueue(otherBranch._readableStreamController, clonedChunk);
                } else if (!byobCanceled) {
                  ReadableByteStreamControllerRespondWithNewView(byobBranch._readableStreamController, chunk);
                }
                reading = false;
                if (readAgainForBranch1) {
                  pull1Algorithm();
                } else if (readAgainForBranch2) {
                  pull2Algorithm();
                }
              });
            },
            _closeSteps: (chunk) => {
              reading = false;
              const byobCanceled = forBranch2 ? canceled2 : canceled1;
              const otherCanceled = forBranch2 ? canceled1 : canceled2;
              if (!byobCanceled) {
                ReadableByteStreamControllerClose(byobBranch._readableStreamController);
              }
              if (!otherCanceled) {
                ReadableByteStreamControllerClose(otherBranch._readableStreamController);
              }
              if (chunk !== void 0) {
                if (!byobCanceled) {
                  ReadableByteStreamControllerRespondWithNewView(byobBranch._readableStreamController, chunk);
                }
                if (!otherCanceled && otherBranch._readableStreamController._pendingPullIntos.length > 0) {
                  ReadableByteStreamControllerRespond(otherBranch._readableStreamController, 0);
                }
              }
              if (!byobCanceled || !otherCanceled) {
                resolveCancelPromise(void 0);
              }
            },
            _errorSteps: () => {
              reading = false;
            }
          };
          ReadableStreamBYOBReaderRead(reader, view, readIntoRequest);
        }
        function pull1Algorithm() {
          if (reading) {
            readAgainForBranch1 = true;
            return promiseResolvedWith(void 0);
          }
          reading = true;
          const byobRequest = ReadableByteStreamControllerGetBYOBRequest(branch1._readableStreamController);
          if (byobRequest === null) {
            pullWithDefaultReader();
          } else {
            pullWithBYOBReader(byobRequest._view, false);
          }
          return promiseResolvedWith(void 0);
        }
        function pull2Algorithm() {
          if (reading) {
            readAgainForBranch2 = true;
            return promiseResolvedWith(void 0);
          }
          reading = true;
          const byobRequest = ReadableByteStreamControllerGetBYOBRequest(branch2._readableStreamController);
          if (byobRequest === null) {
            pullWithDefaultReader();
          } else {
            pullWithBYOBReader(byobRequest._view, true);
          }
          return promiseResolvedWith(void 0);
        }
        function cancel1Algorithm(reason) {
          canceled1 = true;
          reason1 = reason;
          if (canceled2) {
            const compositeReason = CreateArrayFromList([reason1, reason2]);
            const cancelResult = ReadableStreamCancel(stream, compositeReason);
            resolveCancelPromise(cancelResult);
          }
          return cancelPromise;
        }
        function cancel2Algorithm(reason) {
          canceled2 = true;
          reason2 = reason;
          if (canceled1) {
            const compositeReason = CreateArrayFromList([reason1, reason2]);
            const cancelResult = ReadableStreamCancel(stream, compositeReason);
            resolveCancelPromise(cancelResult);
          }
          return cancelPromise;
        }
        function startAlgorithm() {
          return;
        }
        branch1 = CreateReadableByteStream(startAlgorithm, pull1Algorithm, cancel1Algorithm);
        branch2 = CreateReadableByteStream(startAlgorithm, pull2Algorithm, cancel2Algorithm);
        forwardReaderError(reader);
        return [branch1, branch2];
      }
      function convertUnderlyingDefaultOrByteSource(source, context) {
        assertDictionary(source, context);
        const original = source;
        const autoAllocateChunkSize = original === null || original === void 0 ? void 0 : original.autoAllocateChunkSize;
        const cancel = original === null || original === void 0 ? void 0 : original.cancel;
        const pull = original === null || original === void 0 ? void 0 : original.pull;
        const start = original === null || original === void 0 ? void 0 : original.start;
        const type = original === null || original === void 0 ? void 0 : original.type;
        return {
          autoAllocateChunkSize: autoAllocateChunkSize === void 0 ? void 0 : convertUnsignedLongLongWithEnforceRange(autoAllocateChunkSize, `${context} has member 'autoAllocateChunkSize' that`),
          cancel: cancel === void 0 ? void 0 : convertUnderlyingSourceCancelCallback(cancel, original, `${context} has member 'cancel' that`),
          pull: pull === void 0 ? void 0 : convertUnderlyingSourcePullCallback(pull, original, `${context} has member 'pull' that`),
          start: start === void 0 ? void 0 : convertUnderlyingSourceStartCallback(start, original, `${context} has member 'start' that`),
          type: type === void 0 ? void 0 : convertReadableStreamType(type, `${context} has member 'type' that`)
        };
      }
      function convertUnderlyingSourceCancelCallback(fn, original, context) {
        assertFunction(fn, context);
        return (reason) => promiseCall(fn, original, [reason]);
      }
      function convertUnderlyingSourcePullCallback(fn, original, context) {
        assertFunction(fn, context);
        return (controller) => promiseCall(fn, original, [controller]);
      }
      function convertUnderlyingSourceStartCallback(fn, original, context) {
        assertFunction(fn, context);
        return (controller) => reflectCall(fn, original, [controller]);
      }
      function convertReadableStreamType(type, context) {
        type = `${type}`;
        if (type !== "bytes") {
          throw new TypeError(`${context} '${type}' is not a valid enumeration value for ReadableStreamType`);
        }
        return type;
      }
      function convertReaderOptions(options, context) {
        assertDictionary(options, context);
        const mode = options === null || options === void 0 ? void 0 : options.mode;
        return {
          mode: mode === void 0 ? void 0 : convertReadableStreamReaderMode(mode, `${context} has member 'mode' that`)
        };
      }
      function convertReadableStreamReaderMode(mode, context) {
        mode = `${mode}`;
        if (mode !== "byob") {
          throw new TypeError(`${context} '${mode}' is not a valid enumeration value for ReadableStreamReaderMode`);
        }
        return mode;
      }
      function convertIteratorOptions(options, context) {
        assertDictionary(options, context);
        const preventCancel = options === null || options === void 0 ? void 0 : options.preventCancel;
        return { preventCancel: Boolean(preventCancel) };
      }
      function convertPipeOptions(options, context) {
        assertDictionary(options, context);
        const preventAbort = options === null || options === void 0 ? void 0 : options.preventAbort;
        const preventCancel = options === null || options === void 0 ? void 0 : options.preventCancel;
        const preventClose = options === null || options === void 0 ? void 0 : options.preventClose;
        const signal = options === null || options === void 0 ? void 0 : options.signal;
        if (signal !== void 0) {
          assertAbortSignal(signal, `${context} has member 'signal' that`);
        }
        return {
          preventAbort: Boolean(preventAbort),
          preventCancel: Boolean(preventCancel),
          preventClose: Boolean(preventClose),
          signal
        };
      }
      function assertAbortSignal(signal, context) {
        if (!isAbortSignal2(signal)) {
          throw new TypeError(`${context} is not an AbortSignal.`);
        }
      }
      function convertReadableWritablePair(pair, context) {
        assertDictionary(pair, context);
        const readable = pair === null || pair === void 0 ? void 0 : pair.readable;
        assertRequiredField(readable, "readable", "ReadableWritablePair");
        assertReadableStream(readable, `${context} has member 'readable' that`);
        const writable = pair === null || pair === void 0 ? void 0 : pair.writable;
        assertRequiredField(writable, "writable", "ReadableWritablePair");
        assertWritableStream(writable, `${context} has member 'writable' that`);
        return { readable, writable };
      }
      class ReadableStream2 {
        constructor(rawUnderlyingSource = {}, rawStrategy = {}) {
          if (rawUnderlyingSource === void 0) {
            rawUnderlyingSource = null;
          } else {
            assertObject(rawUnderlyingSource, "First parameter");
          }
          const strategy = convertQueuingStrategy(rawStrategy, "Second parameter");
          const underlyingSource = convertUnderlyingDefaultOrByteSource(rawUnderlyingSource, "First parameter");
          InitializeReadableStream(this);
          if (underlyingSource.type === "bytes") {
            if (strategy.size !== void 0) {
              throw new RangeError("The strategy for a byte stream cannot have a size function");
            }
            const highWaterMark = ExtractHighWaterMark(strategy, 0);
            SetUpReadableByteStreamControllerFromUnderlyingSource(this, underlyingSource, highWaterMark);
          } else {
            const sizeAlgorithm = ExtractSizeAlgorithm(strategy);
            const highWaterMark = ExtractHighWaterMark(strategy, 1);
            SetUpReadableStreamDefaultControllerFromUnderlyingSource(this, underlyingSource, highWaterMark, sizeAlgorithm);
          }
        }
        get locked() {
          if (!IsReadableStream(this)) {
            throw streamBrandCheckException$1("locked");
          }
          return IsReadableStreamLocked(this);
        }
        cancel(reason = void 0) {
          if (!IsReadableStream(this)) {
            return promiseRejectedWith(streamBrandCheckException$1("cancel"));
          }
          if (IsReadableStreamLocked(this)) {
            return promiseRejectedWith(new TypeError("Cannot cancel a stream that already has a reader"));
          }
          return ReadableStreamCancel(this, reason);
        }
        getReader(rawOptions = void 0) {
          if (!IsReadableStream(this)) {
            throw streamBrandCheckException$1("getReader");
          }
          const options = convertReaderOptions(rawOptions, "First parameter");
          if (options.mode === void 0) {
            return AcquireReadableStreamDefaultReader(this);
          }
          return AcquireReadableStreamBYOBReader(this);
        }
        pipeThrough(rawTransform, rawOptions = {}) {
          if (!IsReadableStream(this)) {
            throw streamBrandCheckException$1("pipeThrough");
          }
          assertRequiredArgument(rawTransform, 1, "pipeThrough");
          const transform = convertReadableWritablePair(rawTransform, "First parameter");
          const options = convertPipeOptions(rawOptions, "Second parameter");
          if (IsReadableStreamLocked(this)) {
            throw new TypeError("ReadableStream.prototype.pipeThrough cannot be used on a locked ReadableStream");
          }
          if (IsWritableStreamLocked(transform.writable)) {
            throw new TypeError("ReadableStream.prototype.pipeThrough cannot be used on a locked WritableStream");
          }
          const promise = ReadableStreamPipeTo(this, transform.writable, options.preventClose, options.preventAbort, options.preventCancel, options.signal);
          setPromiseIsHandledToTrue(promise);
          return transform.readable;
        }
        pipeTo(destination, rawOptions = {}) {
          if (!IsReadableStream(this)) {
            return promiseRejectedWith(streamBrandCheckException$1("pipeTo"));
          }
          if (destination === void 0) {
            return promiseRejectedWith(`Parameter 1 is required in 'pipeTo'.`);
          }
          if (!IsWritableStream(destination)) {
            return promiseRejectedWith(new TypeError(`ReadableStream.prototype.pipeTo's first argument must be a WritableStream`));
          }
          let options;
          try {
            options = convertPipeOptions(rawOptions, "Second parameter");
          } catch (e2) {
            return promiseRejectedWith(e2);
          }
          if (IsReadableStreamLocked(this)) {
            return promiseRejectedWith(new TypeError("ReadableStream.prototype.pipeTo cannot be used on a locked ReadableStream"));
          }
          if (IsWritableStreamLocked(destination)) {
            return promiseRejectedWith(new TypeError("ReadableStream.prototype.pipeTo cannot be used on a locked WritableStream"));
          }
          return ReadableStreamPipeTo(this, destination, options.preventClose, options.preventAbort, options.preventCancel, options.signal);
        }
        tee() {
          if (!IsReadableStream(this)) {
            throw streamBrandCheckException$1("tee");
          }
          const branches = ReadableStreamTee(this);
          return CreateArrayFromList(branches);
        }
        values(rawOptions = void 0) {
          if (!IsReadableStream(this)) {
            throw streamBrandCheckException$1("values");
          }
          const options = convertIteratorOptions(rawOptions, "First parameter");
          return AcquireReadableStreamAsyncIterator(this, options.preventCancel);
        }
      }
      Object.defineProperties(ReadableStream2.prototype, {
        cancel: { enumerable: true },
        getReader: { enumerable: true },
        pipeThrough: { enumerable: true },
        pipeTo: { enumerable: true },
        tee: { enumerable: true },
        values: { enumerable: true },
        locked: { enumerable: true }
      });
      if (typeof SymbolPolyfill.toStringTag === "symbol") {
        Object.defineProperty(ReadableStream2.prototype, SymbolPolyfill.toStringTag, {
          value: "ReadableStream",
          configurable: true
        });
      }
      if (typeof SymbolPolyfill.asyncIterator === "symbol") {
        Object.defineProperty(ReadableStream2.prototype, SymbolPolyfill.asyncIterator, {
          value: ReadableStream2.prototype.values,
          writable: true,
          configurable: true
        });
      }
      function CreateReadableStream(startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark = 1, sizeAlgorithm = () => 1) {
        const stream = Object.create(ReadableStream2.prototype);
        InitializeReadableStream(stream);
        const controller = Object.create(ReadableStreamDefaultController.prototype);
        SetUpReadableStreamDefaultController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, sizeAlgorithm);
        return stream;
      }
      function CreateReadableByteStream(startAlgorithm, pullAlgorithm, cancelAlgorithm) {
        const stream = Object.create(ReadableStream2.prototype);
        InitializeReadableStream(stream);
        const controller = Object.create(ReadableByteStreamController.prototype);
        SetUpReadableByteStreamController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, 0, void 0);
        return stream;
      }
      function InitializeReadableStream(stream) {
        stream._state = "readable";
        stream._reader = void 0;
        stream._storedError = void 0;
        stream._disturbed = false;
      }
      function IsReadableStream(x2) {
        if (!typeIsObject(x2)) {
          return false;
        }
        if (!Object.prototype.hasOwnProperty.call(x2, "_readableStreamController")) {
          return false;
        }
        return x2 instanceof ReadableStream2;
      }
      function IsReadableStreamLocked(stream) {
        if (stream._reader === void 0) {
          return false;
        }
        return true;
      }
      function ReadableStreamCancel(stream, reason) {
        stream._disturbed = true;
        if (stream._state === "closed") {
          return promiseResolvedWith(void 0);
        }
        if (stream._state === "errored") {
          return promiseRejectedWith(stream._storedError);
        }
        ReadableStreamClose(stream);
        const reader = stream._reader;
        if (reader !== void 0 && IsReadableStreamBYOBReader(reader)) {
          reader._readIntoRequests.forEach((readIntoRequest) => {
            readIntoRequest._closeSteps(void 0);
          });
          reader._readIntoRequests = new SimpleQueue();
        }
        const sourceCancelPromise = stream._readableStreamController[CancelSteps](reason);
        return transformPromiseWith(sourceCancelPromise, noop2);
      }
      function ReadableStreamClose(stream) {
        stream._state = "closed";
        const reader = stream._reader;
        if (reader === void 0) {
          return;
        }
        defaultReaderClosedPromiseResolve(reader);
        if (IsReadableStreamDefaultReader(reader)) {
          reader._readRequests.forEach((readRequest) => {
            readRequest._closeSteps();
          });
          reader._readRequests = new SimpleQueue();
        }
      }
      function ReadableStreamError(stream, e2) {
        stream._state = "errored";
        stream._storedError = e2;
        const reader = stream._reader;
        if (reader === void 0) {
          return;
        }
        defaultReaderClosedPromiseReject(reader, e2);
        if (IsReadableStreamDefaultReader(reader)) {
          reader._readRequests.forEach((readRequest) => {
            readRequest._errorSteps(e2);
          });
          reader._readRequests = new SimpleQueue();
        } else {
          reader._readIntoRequests.forEach((readIntoRequest) => {
            readIntoRequest._errorSteps(e2);
          });
          reader._readIntoRequests = new SimpleQueue();
        }
      }
      function streamBrandCheckException$1(name) {
        return new TypeError(`ReadableStream.prototype.${name} can only be used on a ReadableStream`);
      }
      function convertQueuingStrategyInit(init, context) {
        assertDictionary(init, context);
        const highWaterMark = init === null || init === void 0 ? void 0 : init.highWaterMark;
        assertRequiredField(highWaterMark, "highWaterMark", "QueuingStrategyInit");
        return {
          highWaterMark: convertUnrestrictedDouble(highWaterMark)
        };
      }
      const byteLengthSizeFunction = (chunk) => {
        return chunk.byteLength;
      };
      try {
        Object.defineProperty(byteLengthSizeFunction, "name", {
          value: "size",
          configurable: true
        });
      } catch (_a) {
      }
      class ByteLengthQueuingStrategy {
        constructor(options) {
          assertRequiredArgument(options, 1, "ByteLengthQueuingStrategy");
          options = convertQueuingStrategyInit(options, "First parameter");
          this._byteLengthQueuingStrategyHighWaterMark = options.highWaterMark;
        }
        get highWaterMark() {
          if (!IsByteLengthQueuingStrategy(this)) {
            throw byteLengthBrandCheckException("highWaterMark");
          }
          return this._byteLengthQueuingStrategyHighWaterMark;
        }
        get size() {
          if (!IsByteLengthQueuingStrategy(this)) {
            throw byteLengthBrandCheckException("size");
          }
          return byteLengthSizeFunction;
        }
      }
      Object.defineProperties(ByteLengthQueuingStrategy.prototype, {
        highWaterMark: { enumerable: true },
        size: { enumerable: true }
      });
      if (typeof SymbolPolyfill.toStringTag === "symbol") {
        Object.defineProperty(ByteLengthQueuingStrategy.prototype, SymbolPolyfill.toStringTag, {
          value: "ByteLengthQueuingStrategy",
          configurable: true
        });
      }
      function byteLengthBrandCheckException(name) {
        return new TypeError(`ByteLengthQueuingStrategy.prototype.${name} can only be used on a ByteLengthQueuingStrategy`);
      }
      function IsByteLengthQueuingStrategy(x2) {
        if (!typeIsObject(x2)) {
          return false;
        }
        if (!Object.prototype.hasOwnProperty.call(x2, "_byteLengthQueuingStrategyHighWaterMark")) {
          return false;
        }
        return x2 instanceof ByteLengthQueuingStrategy;
      }
      const countSizeFunction = () => {
        return 1;
      };
      try {
        Object.defineProperty(countSizeFunction, "name", {
          value: "size",
          configurable: true
        });
      } catch (_a) {
      }
      class CountQueuingStrategy {
        constructor(options) {
          assertRequiredArgument(options, 1, "CountQueuingStrategy");
          options = convertQueuingStrategyInit(options, "First parameter");
          this._countQueuingStrategyHighWaterMark = options.highWaterMark;
        }
        get highWaterMark() {
          if (!IsCountQueuingStrategy(this)) {
            throw countBrandCheckException("highWaterMark");
          }
          return this._countQueuingStrategyHighWaterMark;
        }
        get size() {
          if (!IsCountQueuingStrategy(this)) {
            throw countBrandCheckException("size");
          }
          return countSizeFunction;
        }
      }
      Object.defineProperties(CountQueuingStrategy.prototype, {
        highWaterMark: { enumerable: true },
        size: { enumerable: true }
      });
      if (typeof SymbolPolyfill.toStringTag === "symbol") {
        Object.defineProperty(CountQueuingStrategy.prototype, SymbolPolyfill.toStringTag, {
          value: "CountQueuingStrategy",
          configurable: true
        });
      }
      function countBrandCheckException(name) {
        return new TypeError(`CountQueuingStrategy.prototype.${name} can only be used on a CountQueuingStrategy`);
      }
      function IsCountQueuingStrategy(x2) {
        if (!typeIsObject(x2)) {
          return false;
        }
        if (!Object.prototype.hasOwnProperty.call(x2, "_countQueuingStrategyHighWaterMark")) {
          return false;
        }
        return x2 instanceof CountQueuingStrategy;
      }
      function convertTransformer(original, context) {
        assertDictionary(original, context);
        const flush = original === null || original === void 0 ? void 0 : original.flush;
        const readableType = original === null || original === void 0 ? void 0 : original.readableType;
        const start = original === null || original === void 0 ? void 0 : original.start;
        const transform = original === null || original === void 0 ? void 0 : original.transform;
        const writableType = original === null || original === void 0 ? void 0 : original.writableType;
        return {
          flush: flush === void 0 ? void 0 : convertTransformerFlushCallback(flush, original, `${context} has member 'flush' that`),
          readableType,
          start: start === void 0 ? void 0 : convertTransformerStartCallback(start, original, `${context} has member 'start' that`),
          transform: transform === void 0 ? void 0 : convertTransformerTransformCallback(transform, original, `${context} has member 'transform' that`),
          writableType
        };
      }
      function convertTransformerFlushCallback(fn, original, context) {
        assertFunction(fn, context);
        return (controller) => promiseCall(fn, original, [controller]);
      }
      function convertTransformerStartCallback(fn, original, context) {
        assertFunction(fn, context);
        return (controller) => reflectCall(fn, original, [controller]);
      }
      function convertTransformerTransformCallback(fn, original, context) {
        assertFunction(fn, context);
        return (chunk, controller) => promiseCall(fn, original, [chunk, controller]);
      }
      class TransformStream {
        constructor(rawTransformer = {}, rawWritableStrategy = {}, rawReadableStrategy = {}) {
          if (rawTransformer === void 0) {
            rawTransformer = null;
          }
          const writableStrategy = convertQueuingStrategy(rawWritableStrategy, "Second parameter");
          const readableStrategy = convertQueuingStrategy(rawReadableStrategy, "Third parameter");
          const transformer = convertTransformer(rawTransformer, "First parameter");
          if (transformer.readableType !== void 0) {
            throw new RangeError("Invalid readableType specified");
          }
          if (transformer.writableType !== void 0) {
            throw new RangeError("Invalid writableType specified");
          }
          const readableHighWaterMark = ExtractHighWaterMark(readableStrategy, 0);
          const readableSizeAlgorithm = ExtractSizeAlgorithm(readableStrategy);
          const writableHighWaterMark = ExtractHighWaterMark(writableStrategy, 1);
          const writableSizeAlgorithm = ExtractSizeAlgorithm(writableStrategy);
          let startPromise_resolve;
          const startPromise = newPromise((resolve) => {
            startPromise_resolve = resolve;
          });
          InitializeTransformStream(this, startPromise, writableHighWaterMark, writableSizeAlgorithm, readableHighWaterMark, readableSizeAlgorithm);
          SetUpTransformStreamDefaultControllerFromTransformer(this, transformer);
          if (transformer.start !== void 0) {
            startPromise_resolve(transformer.start(this._transformStreamController));
          } else {
            startPromise_resolve(void 0);
          }
        }
        get readable() {
          if (!IsTransformStream(this)) {
            throw streamBrandCheckException("readable");
          }
          return this._readable;
        }
        get writable() {
          if (!IsTransformStream(this)) {
            throw streamBrandCheckException("writable");
          }
          return this._writable;
        }
      }
      Object.defineProperties(TransformStream.prototype, {
        readable: { enumerable: true },
        writable: { enumerable: true }
      });
      if (typeof SymbolPolyfill.toStringTag === "symbol") {
        Object.defineProperty(TransformStream.prototype, SymbolPolyfill.toStringTag, {
          value: "TransformStream",
          configurable: true
        });
      }
      function InitializeTransformStream(stream, startPromise, writableHighWaterMark, writableSizeAlgorithm, readableHighWaterMark, readableSizeAlgorithm) {
        function startAlgorithm() {
          return startPromise;
        }
        function writeAlgorithm(chunk) {
          return TransformStreamDefaultSinkWriteAlgorithm(stream, chunk);
        }
        function abortAlgorithm(reason) {
          return TransformStreamDefaultSinkAbortAlgorithm(stream, reason);
        }
        function closeAlgorithm() {
          return TransformStreamDefaultSinkCloseAlgorithm(stream);
        }
        stream._writable = CreateWritableStream(startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, writableHighWaterMark, writableSizeAlgorithm);
        function pullAlgorithm() {
          return TransformStreamDefaultSourcePullAlgorithm(stream);
        }
        function cancelAlgorithm(reason) {
          TransformStreamErrorWritableAndUnblockWrite(stream, reason);
          return promiseResolvedWith(void 0);
        }
        stream._readable = CreateReadableStream(startAlgorithm, pullAlgorithm, cancelAlgorithm, readableHighWaterMark, readableSizeAlgorithm);
        stream._backpressure = void 0;
        stream._backpressureChangePromise = void 0;
        stream._backpressureChangePromise_resolve = void 0;
        TransformStreamSetBackpressure(stream, true);
        stream._transformStreamController = void 0;
      }
      function IsTransformStream(x2) {
        if (!typeIsObject(x2)) {
          return false;
        }
        if (!Object.prototype.hasOwnProperty.call(x2, "_transformStreamController")) {
          return false;
        }
        return x2 instanceof TransformStream;
      }
      function TransformStreamError(stream, e2) {
        ReadableStreamDefaultControllerError(stream._readable._readableStreamController, e2);
        TransformStreamErrorWritableAndUnblockWrite(stream, e2);
      }
      function TransformStreamErrorWritableAndUnblockWrite(stream, e2) {
        TransformStreamDefaultControllerClearAlgorithms(stream._transformStreamController);
        WritableStreamDefaultControllerErrorIfNeeded(stream._writable._writableStreamController, e2);
        if (stream._backpressure) {
          TransformStreamSetBackpressure(stream, false);
        }
      }
      function TransformStreamSetBackpressure(stream, backpressure) {
        if (stream._backpressureChangePromise !== void 0) {
          stream._backpressureChangePromise_resolve();
        }
        stream._backpressureChangePromise = newPromise((resolve) => {
          stream._backpressureChangePromise_resolve = resolve;
        });
        stream._backpressure = backpressure;
      }
      class TransformStreamDefaultController {
        constructor() {
          throw new TypeError("Illegal constructor");
        }
        get desiredSize() {
          if (!IsTransformStreamDefaultController(this)) {
            throw defaultControllerBrandCheckException("desiredSize");
          }
          const readableController = this._controlledTransformStream._readable._readableStreamController;
          return ReadableStreamDefaultControllerGetDesiredSize(readableController);
        }
        enqueue(chunk = void 0) {
          if (!IsTransformStreamDefaultController(this)) {
            throw defaultControllerBrandCheckException("enqueue");
          }
          TransformStreamDefaultControllerEnqueue(this, chunk);
        }
        error(reason = void 0) {
          if (!IsTransformStreamDefaultController(this)) {
            throw defaultControllerBrandCheckException("error");
          }
          TransformStreamDefaultControllerError(this, reason);
        }
        terminate() {
          if (!IsTransformStreamDefaultController(this)) {
            throw defaultControllerBrandCheckException("terminate");
          }
          TransformStreamDefaultControllerTerminate(this);
        }
      }
      Object.defineProperties(TransformStreamDefaultController.prototype, {
        enqueue: { enumerable: true },
        error: { enumerable: true },
        terminate: { enumerable: true },
        desiredSize: { enumerable: true }
      });
      if (typeof SymbolPolyfill.toStringTag === "symbol") {
        Object.defineProperty(TransformStreamDefaultController.prototype, SymbolPolyfill.toStringTag, {
          value: "TransformStreamDefaultController",
          configurable: true
        });
      }
      function IsTransformStreamDefaultController(x2) {
        if (!typeIsObject(x2)) {
          return false;
        }
        if (!Object.prototype.hasOwnProperty.call(x2, "_controlledTransformStream")) {
          return false;
        }
        return x2 instanceof TransformStreamDefaultController;
      }
      function SetUpTransformStreamDefaultController(stream, controller, transformAlgorithm, flushAlgorithm) {
        controller._controlledTransformStream = stream;
        stream._transformStreamController = controller;
        controller._transformAlgorithm = transformAlgorithm;
        controller._flushAlgorithm = flushAlgorithm;
      }
      function SetUpTransformStreamDefaultControllerFromTransformer(stream, transformer) {
        const controller = Object.create(TransformStreamDefaultController.prototype);
        let transformAlgorithm = (chunk) => {
          try {
            TransformStreamDefaultControllerEnqueue(controller, chunk);
            return promiseResolvedWith(void 0);
          } catch (transformResultE) {
            return promiseRejectedWith(transformResultE);
          }
        };
        let flushAlgorithm = () => promiseResolvedWith(void 0);
        if (transformer.transform !== void 0) {
          transformAlgorithm = (chunk) => transformer.transform(chunk, controller);
        }
        if (transformer.flush !== void 0) {
          flushAlgorithm = () => transformer.flush(controller);
        }
        SetUpTransformStreamDefaultController(stream, controller, transformAlgorithm, flushAlgorithm);
      }
      function TransformStreamDefaultControllerClearAlgorithms(controller) {
        controller._transformAlgorithm = void 0;
        controller._flushAlgorithm = void 0;
      }
      function TransformStreamDefaultControllerEnqueue(controller, chunk) {
        const stream = controller._controlledTransformStream;
        const readableController = stream._readable._readableStreamController;
        if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(readableController)) {
          throw new TypeError("Readable side is not in a state that permits enqueue");
        }
        try {
          ReadableStreamDefaultControllerEnqueue(readableController, chunk);
        } catch (e2) {
          TransformStreamErrorWritableAndUnblockWrite(stream, e2);
          throw stream._readable._storedError;
        }
        const backpressure = ReadableStreamDefaultControllerHasBackpressure(readableController);
        if (backpressure !== stream._backpressure) {
          TransformStreamSetBackpressure(stream, true);
        }
      }
      function TransformStreamDefaultControllerError(controller, e2) {
        TransformStreamError(controller._controlledTransformStream, e2);
      }
      function TransformStreamDefaultControllerPerformTransform(controller, chunk) {
        const transformPromise = controller._transformAlgorithm(chunk);
        return transformPromiseWith(transformPromise, void 0, (r2) => {
          TransformStreamError(controller._controlledTransformStream, r2);
          throw r2;
        });
      }
      function TransformStreamDefaultControllerTerminate(controller) {
        const stream = controller._controlledTransformStream;
        const readableController = stream._readable._readableStreamController;
        ReadableStreamDefaultControllerClose(readableController);
        const error = new TypeError("TransformStream terminated");
        TransformStreamErrorWritableAndUnblockWrite(stream, error);
      }
      function TransformStreamDefaultSinkWriteAlgorithm(stream, chunk) {
        const controller = stream._transformStreamController;
        if (stream._backpressure) {
          const backpressureChangePromise = stream._backpressureChangePromise;
          return transformPromiseWith(backpressureChangePromise, () => {
            const writable = stream._writable;
            const state = writable._state;
            if (state === "erroring") {
              throw writable._storedError;
            }
            return TransformStreamDefaultControllerPerformTransform(controller, chunk);
          });
        }
        return TransformStreamDefaultControllerPerformTransform(controller, chunk);
      }
      function TransformStreamDefaultSinkAbortAlgorithm(stream, reason) {
        TransformStreamError(stream, reason);
        return promiseResolvedWith(void 0);
      }
      function TransformStreamDefaultSinkCloseAlgorithm(stream) {
        const readable = stream._readable;
        const controller = stream._transformStreamController;
        const flushPromise = controller._flushAlgorithm();
        TransformStreamDefaultControllerClearAlgorithms(controller);
        return transformPromiseWith(flushPromise, () => {
          if (readable._state === "errored") {
            throw readable._storedError;
          }
          ReadableStreamDefaultControllerClose(readable._readableStreamController);
        }, (r2) => {
          TransformStreamError(stream, r2);
          throw readable._storedError;
        });
      }
      function TransformStreamDefaultSourcePullAlgorithm(stream) {
        TransformStreamSetBackpressure(stream, false);
        return stream._backpressureChangePromise;
      }
      function defaultControllerBrandCheckException(name) {
        return new TypeError(`TransformStreamDefaultController.prototype.${name} can only be used on a TransformStreamDefaultController`);
      }
      function streamBrandCheckException(name) {
        return new TypeError(`TransformStream.prototype.${name} can only be used on a TransformStream`);
      }
      exports2.ByteLengthQueuingStrategy = ByteLengthQueuingStrategy;
      exports2.CountQueuingStrategy = CountQueuingStrategy;
      exports2.ReadableByteStreamController = ReadableByteStreamController;
      exports2.ReadableStream = ReadableStream2;
      exports2.ReadableStreamBYOBReader = ReadableStreamBYOBReader;
      exports2.ReadableStreamBYOBRequest = ReadableStreamBYOBRequest;
      exports2.ReadableStreamDefaultController = ReadableStreamDefaultController;
      exports2.ReadableStreamDefaultReader = ReadableStreamDefaultReader;
      exports2.TransformStream = TransformStream;
      exports2.TransformStreamDefaultController = TransformStreamDefaultController;
      exports2.WritableStream = WritableStream;
      exports2.WritableStreamDefaultController = WritableStreamDefaultController;
      exports2.WritableStreamDefaultWriter = WritableStreamDefaultWriter;
      Object.defineProperty(exports2, "__esModule", { value: true });
    });
  }
});

// node_modules/fetch-blob/streams.cjs
var require_streams = __commonJS({
  "node_modules/fetch-blob/streams.cjs"() {
    var POOL_SIZE2 = 65536;
    if (!globalThis.ReadableStream) {
      try {
        const process2 = require("node:process");
        const { emitWarning } = process2;
        try {
          process2.emitWarning = () => {
          };
          Object.assign(globalThis, require("node:stream/web"));
          process2.emitWarning = emitWarning;
        } catch (error) {
          process2.emitWarning = emitWarning;
          throw error;
        }
      } catch (error) {
        Object.assign(globalThis, require_ponyfill_es2018());
      }
    }
    try {
      const { Blob: Blob3 } = require("buffer");
      if (Blob3 && !Blob3.prototype.stream) {
        Blob3.prototype.stream = function name(params) {
          let position = 0;
          const blob = this;
          return new ReadableStream({
            type: "bytes",
            async pull(ctrl) {
              const chunk = blob.slice(position, Math.min(blob.size, position + POOL_SIZE2));
              const buffer = await chunk.arrayBuffer();
              position += buffer.byteLength;
              ctrl.enqueue(new Uint8Array(buffer));
              if (position === blob.size) {
                ctrl.close();
              }
            }
          });
        };
      }
    } catch (error) {
    }
  }
});

// node_modules/fetch-blob/index.js
async function* toIterator(parts, clone2 = true) {
  for (const part of parts) {
    if ("stream" in part) {
      yield* part.stream();
    } else if (ArrayBuffer.isView(part)) {
      if (clone2) {
        let position = part.byteOffset;
        const end = part.byteOffset + part.byteLength;
        while (position !== end) {
          const size = Math.min(end - position, POOL_SIZE);
          const chunk = part.buffer.slice(position, position + size);
          position += chunk.byteLength;
          yield new Uint8Array(chunk);
        }
      } else {
        yield part;
      }
    } else {
      let position = 0, b = part;
      while (position !== b.size) {
        const chunk = b.slice(position, Math.min(b.size, position + POOL_SIZE));
        const buffer = await chunk.arrayBuffer();
        position += buffer.byteLength;
        yield new Uint8Array(buffer);
      }
    }
  }
}
var import_streams, POOL_SIZE, _Blob, Blob2, fetch_blob_default;
var init_fetch_blob = __esm({
  "node_modules/fetch-blob/index.js"() {
    import_streams = __toESM(require_streams(), 1);
    POOL_SIZE = 65536;
    _Blob = class Blob {
      #parts = [];
      #type = "";
      #size = 0;
      #endings = "transparent";
      constructor(blobParts = [], options = {}) {
        if (typeof blobParts !== "object" || blobParts === null) {
          throw new TypeError("Failed to construct 'Blob': The provided value cannot be converted to a sequence.");
        }
        if (typeof blobParts[Symbol.iterator] !== "function") {
          throw new TypeError("Failed to construct 'Blob': The object must have a callable @@iterator property.");
        }
        if (typeof options !== "object" && typeof options !== "function") {
          throw new TypeError("Failed to construct 'Blob': parameter 2 cannot convert to dictionary.");
        }
        if (options === null)
          options = {};
        const encoder = new TextEncoder();
        for (const element of blobParts) {
          let part;
          if (ArrayBuffer.isView(element)) {
            part = new Uint8Array(element.buffer.slice(element.byteOffset, element.byteOffset + element.byteLength));
          } else if (element instanceof ArrayBuffer) {
            part = new Uint8Array(element.slice(0));
          } else if (element instanceof Blob) {
            part = element;
          } else {
            part = encoder.encode(`${element}`);
          }
          const size = ArrayBuffer.isView(part) ? part.byteLength : part.size;
          if (size) {
            this.#size += size;
            this.#parts.push(part);
          }
        }
        this.#endings = `${options.endings === void 0 ? "transparent" : options.endings}`;
        const type = options.type === void 0 ? "" : String(options.type);
        this.#type = /^[\x20-\x7E]*$/.test(type) ? type : "";
      }
      get size() {
        return this.#size;
      }
      get type() {
        return this.#type;
      }
      async text() {
        const decoder = new TextDecoder();
        let str = "";
        for await (const part of toIterator(this.#parts, false)) {
          str += decoder.decode(part, { stream: true });
        }
        str += decoder.decode();
        return str;
      }
      async arrayBuffer() {
        const data = new Uint8Array(this.size);
        let offset = 0;
        for await (const chunk of toIterator(this.#parts, false)) {
          data.set(chunk, offset);
          offset += chunk.length;
        }
        return data.buffer;
      }
      stream() {
        const it = toIterator(this.#parts, true);
        return new globalThis.ReadableStream({
          type: "bytes",
          async pull(ctrl) {
            const chunk = await it.next();
            chunk.done ? ctrl.close() : ctrl.enqueue(chunk.value);
          },
          async cancel() {
            await it.return();
          }
        });
      }
      slice(start = 0, end = this.size, type = "") {
        const { size } = this;
        let relativeStart = start < 0 ? Math.max(size + start, 0) : Math.min(start, size);
        let relativeEnd = end < 0 ? Math.max(size + end, 0) : Math.min(end, size);
        const span = Math.max(relativeEnd - relativeStart, 0);
        const parts = this.#parts;
        const blobParts = [];
        let added = 0;
        for (const part of parts) {
          if (added >= span) {
            break;
          }
          const size2 = ArrayBuffer.isView(part) ? part.byteLength : part.size;
          if (relativeStart && size2 <= relativeStart) {
            relativeStart -= size2;
            relativeEnd -= size2;
          } else {
            let chunk;
            if (ArrayBuffer.isView(part)) {
              chunk = part.subarray(relativeStart, Math.min(size2, relativeEnd));
              added += chunk.byteLength;
            } else {
              chunk = part.slice(relativeStart, Math.min(size2, relativeEnd));
              added += chunk.size;
            }
            relativeEnd -= size2;
            blobParts.push(chunk);
            relativeStart = 0;
          }
        }
        const blob = new Blob([], { type: String(type).toLowerCase() });
        blob.#size = span;
        blob.#parts = blobParts;
        return blob;
      }
      get [Symbol.toStringTag]() {
        return "Blob";
      }
      static [Symbol.hasInstance](object) {
        return object && typeof object === "object" && typeof object.constructor === "function" && (typeof object.stream === "function" || typeof object.arrayBuffer === "function") && /^(Blob|File)$/.test(object[Symbol.toStringTag]);
      }
    };
    Object.defineProperties(_Blob.prototype, {
      size: { enumerable: true },
      type: { enumerable: true },
      slice: { enumerable: true }
    });
    Blob2 = _Blob;
    fetch_blob_default = Blob2;
  }
});

// node_modules/fetch-blob/file.js
var _File, File2, file_default;
var init_file = __esm({
  "node_modules/fetch-blob/file.js"() {
    init_fetch_blob();
    _File = class File extends fetch_blob_default {
      #lastModified = 0;
      #name = "";
      constructor(fileBits, fileName, options = {}) {
        if (arguments.length < 2) {
          throw new TypeError(`Failed to construct 'File': 2 arguments required, but only ${arguments.length} present.`);
        }
        super(fileBits, options);
        if (options === null)
          options = {};
        const lastModified = options.lastModified === void 0 ? Date.now() : Number(options.lastModified);
        if (!Number.isNaN(lastModified)) {
          this.#lastModified = lastModified;
        }
        this.#name = String(fileName);
      }
      get name() {
        return this.#name;
      }
      get lastModified() {
        return this.#lastModified;
      }
      get [Symbol.toStringTag]() {
        return "File";
      }
      static [Symbol.hasInstance](object) {
        return !!object && object instanceof fetch_blob_default && /^(File)$/.test(object[Symbol.toStringTag]);
      }
    };
    File2 = _File;
    file_default = File2;
  }
});

// node_modules/formdata-polyfill/esm.min.js
function formDataToBlob(F2, B = fetch_blob_default) {
  var b = `${r()}${r()}`.replace(/\./g, "").slice(-28).padStart(32, "-"), c = [], p = `--${b}\r
Content-Disposition: form-data; name="`;
  F2.forEach((v, n) => typeof v == "string" ? c.push(p + e(n) + `"\r
\r
${v.replace(/\r(?!\n)|(?<!\r)\n/g, "\r\n")}\r
`) : c.push(p + e(n) + `"; filename="${e(v.name, 1)}"\r
Content-Type: ${v.type || "application/octet-stream"}\r
\r
`, v, "\r\n"));
  c.push(`--${b}--`);
  return new B(c, { type: "multipart/form-data; boundary=" + b });
}
var t, i, h, r, m, f, e, x, FormData;
var init_esm_min = __esm({
  "node_modules/formdata-polyfill/esm.min.js"() {
    init_fetch_blob();
    init_file();
    ({ toStringTag: t, iterator: i, hasInstance: h } = Symbol);
    r = Math.random;
    m = "append,set,get,getAll,delete,keys,values,entries,forEach,constructor".split(",");
    f = (a, b, c) => (a += "", /^(Blob|File)$/.test(b && b[t]) ? [(c = c !== void 0 ? c + "" : b[t] == "File" ? b.name : "blob", a), b.name !== c || b[t] == "blob" ? new file_default([b], c, b) : b] : [a, b + ""]);
    e = (c, f3) => (f3 ? c : c.replace(/\r?\n|\r/g, "\r\n")).replace(/\n/g, "%0A").replace(/\r/g, "%0D").replace(/"/g, "%22");
    x = (n, a, e2) => {
      if (a.length < e2) {
        throw new TypeError(`Failed to execute '${n}' on 'FormData': ${e2} arguments required, but only ${a.length} present.`);
      }
    };
    FormData = class FormData2 {
      #d = [];
      constructor(...a) {
        if (a.length)
          throw new TypeError(`Failed to construct 'FormData': parameter 1 is not of type 'HTMLFormElement'.`);
      }
      get [t]() {
        return "FormData";
      }
      [i]() {
        return this.entries();
      }
      static [h](o) {
        return o && typeof o === "object" && o[t] === "FormData" && !m.some((m2) => typeof o[m2] != "function");
      }
      append(...a) {
        x("append", arguments, 2);
        this.#d.push(f(...a));
      }
      delete(a) {
        x("delete", arguments, 1);
        a += "";
        this.#d = this.#d.filter(([b]) => b !== a);
      }
      get(a) {
        x("get", arguments, 1);
        a += "";
        for (var b = this.#d, l = b.length, c = 0; c < l; c++)
          if (b[c][0] === a)
            return b[c][1];
        return null;
      }
      getAll(a, b) {
        x("getAll", arguments, 1);
        b = [];
        a += "";
        this.#d.forEach((c) => c[0] === a && b.push(c[1]));
        return b;
      }
      has(a) {
        x("has", arguments, 1);
        a += "";
        return this.#d.some((b) => b[0] === a);
      }
      forEach(a, b) {
        x("forEach", arguments, 1);
        for (var [c, d] of this)
          a.call(b, d, c, this);
      }
      set(...a) {
        x("set", arguments, 2);
        var b = [], c = true;
        a = f(...a);
        this.#d.forEach((d) => {
          d[0] === a[0] ? c && (c = !b.push(a)) : b.push(d);
        });
        c && b.push(a);
        this.#d = b;
      }
      *entries() {
        yield* this.#d;
      }
      *keys() {
        for (var [a] of this)
          yield a;
      }
      *values() {
        for (var [, a] of this)
          yield a;
      }
    };
  }
});

// node_modules/node-domexception/index.js
var require_node_domexception = __commonJS({
  "node_modules/node-domexception/index.js"(exports, module2) {
    if (!globalThis.DOMException) {
      try {
        const { MessageChannel } = require("worker_threads"), port = new MessageChannel().port1, ab = new ArrayBuffer();
        port.postMessage(ab, [ab, ab]);
      } catch (err) {
        err.constructor.name === "DOMException" && (globalThis.DOMException = err.constructor);
      }
    }
    module2.exports = globalThis.DOMException;
  }
});

// node_modules/fetch-blob/from.js
var import_node_fs, import_node_domexception, stat, BlobDataItem;
var init_from = __esm({
  "node_modules/fetch-blob/from.js"() {
    import_node_fs = require("node:fs");
    import_node_domexception = __toESM(require_node_domexception(), 1);
    init_file();
    init_fetch_blob();
    ({ stat } = import_node_fs.promises);
    BlobDataItem = class {
      #path;
      #start;
      constructor(options) {
        this.#path = options.path;
        this.#start = options.start;
        this.size = options.size;
        this.lastModified = options.lastModified;
        this.originalSize = options.originalSize === void 0 ? options.size : options.originalSize;
      }
      slice(start, end) {
        return new BlobDataItem({
          path: this.#path,
          lastModified: this.lastModified,
          originalSize: this.originalSize,
          size: end - start,
          start: this.#start + start
        });
      }
      async *stream() {
        const { mtimeMs, size } = await stat(this.#path);
        if (mtimeMs > this.lastModified || this.originalSize !== size) {
          throw new import_node_domexception.default("The requested file could not be read, typically due to permission problems that have occurred after a reference to a file was acquired.", "NotReadableError");
        }
        yield* (0, import_node_fs.createReadStream)(this.#path, {
          start: this.#start,
          end: this.#start + this.size - 1
        });
      }
      get [Symbol.toStringTag]() {
        return "Blob";
      }
    };
  }
});

// node_modules/node-fetch/src/utils/multipart-parser.js
var multipart_parser_exports = {};
__export(multipart_parser_exports, {
  toFormData: () => toFormData
});
function _fileName(headerValue) {
  const m2 = headerValue.match(/\bfilename=("(.*?)"|([^()<>@,;:\\"/[\]?={}\s\t]+))($|;\s)/i);
  if (!m2) {
    return;
  }
  const match = m2[2] || m2[3] || "";
  let filename = match.slice(match.lastIndexOf("\\") + 1);
  filename = filename.replace(/%22/g, '"');
  filename = filename.replace(/&#(\d{4});/g, (m3, code) => {
    return String.fromCharCode(code);
  });
  return filename;
}
async function toFormData(Body2, ct) {
  if (!/multipart/i.test(ct)) {
    throw new TypeError("Failed to fetch");
  }
  const m2 = ct.match(/boundary=(?:"([^"]+)"|([^;]+))/i);
  if (!m2) {
    throw new TypeError("no or bad content-type header, no multipart boundary");
  }
  const parser = new MultipartParser(m2[1] || m2[2]);
  let headerField;
  let headerValue;
  let entryValue;
  let entryName;
  let contentType;
  let filename;
  const entryChunks = [];
  const formData = new FormData();
  const onPartData = (ui8a) => {
    entryValue += decoder.decode(ui8a, { stream: true });
  };
  const appendToFile = (ui8a) => {
    entryChunks.push(ui8a);
  };
  const appendFileToFormData = () => {
    const file = new file_default(entryChunks, filename, { type: contentType });
    formData.append(entryName, file);
  };
  const appendEntryToFormData = () => {
    formData.append(entryName, entryValue);
  };
  const decoder = new TextDecoder("utf-8");
  decoder.decode();
  parser.onPartBegin = function() {
    parser.onPartData = onPartData;
    parser.onPartEnd = appendEntryToFormData;
    headerField = "";
    headerValue = "";
    entryValue = "";
    entryName = "";
    contentType = "";
    filename = null;
    entryChunks.length = 0;
  };
  parser.onHeaderField = function(ui8a) {
    headerField += decoder.decode(ui8a, { stream: true });
  };
  parser.onHeaderValue = function(ui8a) {
    headerValue += decoder.decode(ui8a, { stream: true });
  };
  parser.onHeaderEnd = function() {
    headerValue += decoder.decode();
    headerField = headerField.toLowerCase();
    if (headerField === "content-disposition") {
      const m3 = headerValue.match(/\bname=("([^"]*)"|([^()<>@,;:\\"/[\]?={}\s\t]+))/i);
      if (m3) {
        entryName = m3[2] || m3[3] || "";
      }
      filename = _fileName(headerValue);
      if (filename) {
        parser.onPartData = appendToFile;
        parser.onPartEnd = appendFileToFormData;
      }
    } else if (headerField === "content-type") {
      contentType = headerValue;
    }
    headerValue = "";
    headerField = "";
  };
  for await (const chunk of Body2) {
    parser.write(chunk);
  }
  parser.end();
  return formData;
}
var s, S, f2, F, LF, CR, SPACE, HYPHEN, COLON, A, Z, lower, noop, MultipartParser;
var init_multipart_parser = __esm({
  "node_modules/node-fetch/src/utils/multipart-parser.js"() {
    init_from();
    init_esm_min();
    s = 0;
    S = {
      START_BOUNDARY: s++,
      HEADER_FIELD_START: s++,
      HEADER_FIELD: s++,
      HEADER_VALUE_START: s++,
      HEADER_VALUE: s++,
      HEADER_VALUE_ALMOST_DONE: s++,
      HEADERS_ALMOST_DONE: s++,
      PART_DATA_START: s++,
      PART_DATA: s++,
      END: s++
    };
    f2 = 1;
    F = {
      PART_BOUNDARY: f2,
      LAST_BOUNDARY: f2 *= 2
    };
    LF = 10;
    CR = 13;
    SPACE = 32;
    HYPHEN = 45;
    COLON = 58;
    A = 97;
    Z = 122;
    lower = (c) => c | 32;
    noop = () => {
    };
    MultipartParser = class {
      constructor(boundary) {
        this.index = 0;
        this.flags = 0;
        this.onHeaderEnd = noop;
        this.onHeaderField = noop;
        this.onHeadersEnd = noop;
        this.onHeaderValue = noop;
        this.onPartBegin = noop;
        this.onPartData = noop;
        this.onPartEnd = noop;
        this.boundaryChars = {};
        boundary = "\r\n--" + boundary;
        const ui8a = new Uint8Array(boundary.length);
        for (let i2 = 0; i2 < boundary.length; i2++) {
          ui8a[i2] = boundary.charCodeAt(i2);
          this.boundaryChars[ui8a[i2]] = true;
        }
        this.boundary = ui8a;
        this.lookbehind = new Uint8Array(this.boundary.length + 8);
        this.state = S.START_BOUNDARY;
      }
      write(data) {
        let i2 = 0;
        const length_ = data.length;
        let previousIndex = this.index;
        let { lookbehind, boundary, boundaryChars, index, state, flags } = this;
        const boundaryLength = this.boundary.length;
        const boundaryEnd = boundaryLength - 1;
        const bufferLength = data.length;
        let c;
        let cl;
        const mark = (name) => {
          this[name + "Mark"] = i2;
        };
        const clear = (name) => {
          delete this[name + "Mark"];
        };
        const callback = (callbackSymbol, start, end, ui8a) => {
          if (start === void 0 || start !== end) {
            this[callbackSymbol](ui8a && ui8a.subarray(start, end));
          }
        };
        const dataCallback = (name, clear2) => {
          const markSymbol = name + "Mark";
          if (!(markSymbol in this)) {
            return;
          }
          if (clear2) {
            callback(name, this[markSymbol], i2, data);
            delete this[markSymbol];
          } else {
            callback(name, this[markSymbol], data.length, data);
            this[markSymbol] = 0;
          }
        };
        for (i2 = 0; i2 < length_; i2++) {
          c = data[i2];
          switch (state) {
            case S.START_BOUNDARY:
              if (index === boundary.length - 2) {
                if (c === HYPHEN) {
                  flags |= F.LAST_BOUNDARY;
                } else if (c !== CR) {
                  return;
                }
                index++;
                break;
              } else if (index - 1 === boundary.length - 2) {
                if (flags & F.LAST_BOUNDARY && c === HYPHEN) {
                  state = S.END;
                  flags = 0;
                } else if (!(flags & F.LAST_BOUNDARY) && c === LF) {
                  index = 0;
                  callback("onPartBegin");
                  state = S.HEADER_FIELD_START;
                } else {
                  return;
                }
                break;
              }
              if (c !== boundary[index + 2]) {
                index = -2;
              }
              if (c === boundary[index + 2]) {
                index++;
              }
              break;
            case S.HEADER_FIELD_START:
              state = S.HEADER_FIELD;
              mark("onHeaderField");
              index = 0;
            case S.HEADER_FIELD:
              if (c === CR) {
                clear("onHeaderField");
                state = S.HEADERS_ALMOST_DONE;
                break;
              }
              index++;
              if (c === HYPHEN) {
                break;
              }
              if (c === COLON) {
                if (index === 1) {
                  return;
                }
                dataCallback("onHeaderField", true);
                state = S.HEADER_VALUE_START;
                break;
              }
              cl = lower(c);
              if (cl < A || cl > Z) {
                return;
              }
              break;
            case S.HEADER_VALUE_START:
              if (c === SPACE) {
                break;
              }
              mark("onHeaderValue");
              state = S.HEADER_VALUE;
            case S.HEADER_VALUE:
              if (c === CR) {
                dataCallback("onHeaderValue", true);
                callback("onHeaderEnd");
                state = S.HEADER_VALUE_ALMOST_DONE;
              }
              break;
            case S.HEADER_VALUE_ALMOST_DONE:
              if (c !== LF) {
                return;
              }
              state = S.HEADER_FIELD_START;
              break;
            case S.HEADERS_ALMOST_DONE:
              if (c !== LF) {
                return;
              }
              callback("onHeadersEnd");
              state = S.PART_DATA_START;
              break;
            case S.PART_DATA_START:
              state = S.PART_DATA;
              mark("onPartData");
            case S.PART_DATA:
              previousIndex = index;
              if (index === 0) {
                i2 += boundaryEnd;
                while (i2 < bufferLength && !(data[i2] in boundaryChars)) {
                  i2 += boundaryLength;
                }
                i2 -= boundaryEnd;
                c = data[i2];
              }
              if (index < boundary.length) {
                if (boundary[index] === c) {
                  if (index === 0) {
                    dataCallback("onPartData", true);
                  }
                  index++;
                } else {
                  index = 0;
                }
              } else if (index === boundary.length) {
                index++;
                if (c === CR) {
                  flags |= F.PART_BOUNDARY;
                } else if (c === HYPHEN) {
                  flags |= F.LAST_BOUNDARY;
                } else {
                  index = 0;
                }
              } else if (index - 1 === boundary.length) {
                if (flags & F.PART_BOUNDARY) {
                  index = 0;
                  if (c === LF) {
                    flags &= ~F.PART_BOUNDARY;
                    callback("onPartEnd");
                    callback("onPartBegin");
                    state = S.HEADER_FIELD_START;
                    break;
                  }
                } else if (flags & F.LAST_BOUNDARY) {
                  if (c === HYPHEN) {
                    callback("onPartEnd");
                    state = S.END;
                    flags = 0;
                  } else {
                    index = 0;
                  }
                } else {
                  index = 0;
                }
              }
              if (index > 0) {
                lookbehind[index - 1] = c;
              } else if (previousIndex > 0) {
                const _lookbehind = new Uint8Array(lookbehind.buffer, lookbehind.byteOffset, lookbehind.byteLength);
                callback("onPartData", 0, previousIndex, _lookbehind);
                previousIndex = 0;
                mark("onPartData");
                i2--;
              }
              break;
            case S.END:
              break;
            default:
              throw new Error(`Unexpected state entered: ${state}`);
          }
        }
        dataCallback("onHeaderField");
        dataCallback("onHeaderValue");
        dataCallback("onPartData");
        this.index = index;
        this.state = state;
        this.flags = flags;
      }
      end() {
        if (this.state === S.HEADER_FIELD_START && this.index === 0 || this.state === S.PART_DATA && this.index === this.boundary.length) {
          this.onPartEnd();
        } else if (this.state !== S.END) {
          throw new Error("MultipartParser.end(): stream ended unexpectedly");
        }
      }
    };
  }
});

// node_modules/tslib/tslib.js
var require_tslib = __commonJS({
  "node_modules/tslib/tslib.js"(exports, module2) {
    var __extends;
    var __assign;
    var __rest;
    var __decorate;
    var __param;
    var __metadata;
    var __awaiter;
    var __generator;
    var __exportStar;
    var __values;
    var __read;
    var __spread;
    var __spreadArrays;
    var __spreadArray;
    var __await;
    var __asyncGenerator;
    var __asyncDelegator;
    var __asyncValues;
    var __makeTemplateObject;
    var __importStar;
    var __importDefault;
    var __classPrivateFieldGet;
    var __classPrivateFieldSet;
    var __classPrivateFieldIn;
    var __createBinding;
    (function(factory) {
      var root = typeof global === "object" ? global : typeof self === "object" ? self : typeof this === "object" ? this : {};
      if (typeof define === "function" && define.amd) {
        define("tslib", ["exports"], function(exports2) {
          factory(createExporter(root, createExporter(exports2)));
        });
      } else if (typeof module2 === "object" && typeof module2.exports === "object") {
        factory(createExporter(root, createExporter(module2.exports)));
      } else {
        factory(createExporter(root));
      }
      function createExporter(exports2, previous) {
        if (exports2 !== root) {
          if (typeof Object.create === "function") {
            Object.defineProperty(exports2, "__esModule", { value: true });
          } else {
            exports2.__esModule = true;
          }
        }
        return function(id, v) {
          return exports2[id] = previous ? previous(id, v) : v;
        };
      }
    })(function(exporter) {
      var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
        d.__proto__ = b;
      } || function(d, b) {
        for (var p in b)
          if (Object.prototype.hasOwnProperty.call(b, p))
            d[p] = b[p];
      };
      __extends = function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
      __assign = Object.assign || function(t2) {
        for (var s2, i2 = 1, n = arguments.length; i2 < n; i2++) {
          s2 = arguments[i2];
          for (var p in s2)
            if (Object.prototype.hasOwnProperty.call(s2, p))
              t2[p] = s2[p];
        }
        return t2;
      };
      __rest = function(s2, e2) {
        var t2 = {};
        for (var p in s2)
          if (Object.prototype.hasOwnProperty.call(s2, p) && e2.indexOf(p) < 0)
            t2[p] = s2[p];
        if (s2 != null && typeof Object.getOwnPropertySymbols === "function")
          for (var i2 = 0, p = Object.getOwnPropertySymbols(s2); i2 < p.length; i2++) {
            if (e2.indexOf(p[i2]) < 0 && Object.prototype.propertyIsEnumerable.call(s2, p[i2]))
              t2[p[i2]] = s2[p[i2]];
          }
        return t2;
      };
      __decorate = function(decorators, target, key, desc) {
        var c = arguments.length, r2 = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
          r2 = Reflect.decorate(decorators, target, key, desc);
        else
          for (var i2 = decorators.length - 1; i2 >= 0; i2--)
            if (d = decorators[i2])
              r2 = (c < 3 ? d(r2) : c > 3 ? d(target, key, r2) : d(target, key)) || r2;
        return c > 3 && r2 && Object.defineProperty(target, key, r2), r2;
      };
      __param = function(paramIndex, decorator) {
        return function(target, key) {
          decorator(target, key, paramIndex);
        };
      };
      __metadata = function(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
          return Reflect.metadata(metadataKey, metadataValue);
      };
      __awaiter = function(thisArg, _arguments, P, generator) {
        function adopt(value) {
          return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
          });
        }
        return new (P || (P = Promise))(function(resolve, reject) {
          function fulfilled(value) {
            try {
              step(generator.next(value));
            } catch (e2) {
              reject(e2);
            }
          }
          function rejected(value) {
            try {
              step(generator["throw"](value));
            } catch (e2) {
              reject(e2);
            }
          }
          function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
          }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
      };
      __generator = function(thisArg, body) {
        var _ = { label: 0, sent: function() {
          if (t2[0] & 1)
            throw t2[1];
          return t2[1];
        }, trys: [], ops: [] }, f3, y, t2, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
          return this;
        }), g;
        function verb(n) {
          return function(v) {
            return step([n, v]);
          };
        }
        function step(op) {
          if (f3)
            throw new TypeError("Generator is already executing.");
          while (_)
            try {
              if (f3 = 1, y && (t2 = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t2 = y["return"]) && t2.call(y), 0) : y.next) && !(t2 = t2.call(y, op[1])).done)
                return t2;
              if (y = 0, t2)
                op = [op[0] & 2, t2.value];
              switch (op[0]) {
                case 0:
                case 1:
                  t2 = op;
                  break;
                case 4:
                  _.label++;
                  return { value: op[1], done: false };
                case 5:
                  _.label++;
                  y = op[1];
                  op = [0];
                  continue;
                case 7:
                  op = _.ops.pop();
                  _.trys.pop();
                  continue;
                default:
                  if (!(t2 = _.trys, t2 = t2.length > 0 && t2[t2.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                    _ = 0;
                    continue;
                  }
                  if (op[0] === 3 && (!t2 || op[1] > t2[0] && op[1] < t2[3])) {
                    _.label = op[1];
                    break;
                  }
                  if (op[0] === 6 && _.label < t2[1]) {
                    _.label = t2[1];
                    t2 = op;
                    break;
                  }
                  if (t2 && _.label < t2[2]) {
                    _.label = t2[2];
                    _.ops.push(op);
                    break;
                  }
                  if (t2[2])
                    _.ops.pop();
                  _.trys.pop();
                  continue;
              }
              op = body.call(thisArg, _);
            } catch (e2) {
              op = [6, e2];
              y = 0;
            } finally {
              f3 = t2 = 0;
            }
          if (op[0] & 5)
            throw op[1];
          return { value: op[0] ? op[1] : void 0, done: true };
        }
      };
      __exportStar = function(m2, o) {
        for (var p in m2)
          if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p))
            __createBinding(o, m2, p);
      };
      __createBinding = Object.create ? function(o, m2, k, k2) {
        if (k2 === void 0)
          k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m2, k);
        if (!desc || ("get" in desc ? !m2.__esModule : desc.writable || desc.configurable)) {
          desc = { enumerable: true, get: function() {
            return m2[k];
          } };
        }
        Object.defineProperty(o, k2, desc);
      } : function(o, m2, k, k2) {
        if (k2 === void 0)
          k2 = k;
        o[k2] = m2[k];
      };
      __values = function(o) {
        var s2 = typeof Symbol === "function" && Symbol.iterator, m2 = s2 && o[s2], i2 = 0;
        if (m2)
          return m2.call(o);
        if (o && typeof o.length === "number")
          return {
            next: function() {
              if (o && i2 >= o.length)
                o = void 0;
              return { value: o && o[i2++], done: !o };
            }
          };
        throw new TypeError(s2 ? "Object is not iterable." : "Symbol.iterator is not defined.");
      };
      __read = function(o, n) {
        var m2 = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m2)
          return o;
        var i2 = m2.call(o), r2, ar = [], e2;
        try {
          while ((n === void 0 || n-- > 0) && !(r2 = i2.next()).done)
            ar.push(r2.value);
        } catch (error) {
          e2 = { error };
        } finally {
          try {
            if (r2 && !r2.done && (m2 = i2["return"]))
              m2.call(i2);
          } finally {
            if (e2)
              throw e2.error;
          }
        }
        return ar;
      };
      __spread = function() {
        for (var ar = [], i2 = 0; i2 < arguments.length; i2++)
          ar = ar.concat(__read(arguments[i2]));
        return ar;
      };
      __spreadArrays = function() {
        for (var s2 = 0, i2 = 0, il = arguments.length; i2 < il; i2++)
          s2 += arguments[i2].length;
        for (var r2 = Array(s2), k = 0, i2 = 0; i2 < il; i2++)
          for (var a = arguments[i2], j = 0, jl = a.length; j < jl; j++, k++)
            r2[k] = a[j];
        return r2;
      };
      __spreadArray = function(to, from, pack) {
        if (pack || arguments.length === 2)
          for (var i2 = 0, l = from.length, ar; i2 < l; i2++) {
            if (ar || !(i2 in from)) {
              if (!ar)
                ar = Array.prototype.slice.call(from, 0, i2);
              ar[i2] = from[i2];
            }
          }
        return to.concat(ar || Array.prototype.slice.call(from));
      };
      __await = function(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
      };
      __asyncGenerator = function(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator)
          throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i2, q = [];
        return i2 = {}, verb("next"), verb("throw"), verb("return"), i2[Symbol.asyncIterator] = function() {
          return this;
        }, i2;
        function verb(n) {
          if (g[n])
            i2[n] = function(v) {
              return new Promise(function(a, b) {
                q.push([n, v, a, b]) > 1 || resume(n, v);
              });
            };
        }
        function resume(n, v) {
          try {
            step(g[n](v));
          } catch (e2) {
            settle(q[0][3], e2);
          }
        }
        function step(r2) {
          r2.value instanceof __await ? Promise.resolve(r2.value.v).then(fulfill, reject) : settle(q[0][2], r2);
        }
        function fulfill(value) {
          resume("next", value);
        }
        function reject(value) {
          resume("throw", value);
        }
        function settle(f3, v) {
          if (f3(v), q.shift(), q.length)
            resume(q[0][0], q[0][1]);
        }
      };
      __asyncDelegator = function(o) {
        var i2, p;
        return i2 = {}, verb("next"), verb("throw", function(e2) {
          throw e2;
        }), verb("return"), i2[Symbol.iterator] = function() {
          return this;
        }, i2;
        function verb(n, f3) {
          i2[n] = o[n] ? function(v) {
            return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f3 ? f3(v) : v;
          } : f3;
        }
      };
      __asyncValues = function(o) {
        if (!Symbol.asyncIterator)
          throw new TypeError("Symbol.asyncIterator is not defined.");
        var m2 = o[Symbol.asyncIterator], i2;
        return m2 ? m2.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i2 = {}, verb("next"), verb("throw"), verb("return"), i2[Symbol.asyncIterator] = function() {
          return this;
        }, i2);
        function verb(n) {
          i2[n] = o[n] && function(v) {
            return new Promise(function(resolve, reject) {
              v = o[n](v), settle(resolve, reject, v.done, v.value);
            });
          };
        }
        function settle(resolve, reject, d, v) {
          Promise.resolve(v).then(function(v2) {
            resolve({ value: v2, done: d });
          }, reject);
        }
      };
      __makeTemplateObject = function(cooked, raw) {
        if (Object.defineProperty) {
          Object.defineProperty(cooked, "raw", { value: raw });
        } else {
          cooked.raw = raw;
        }
        return cooked;
      };
      var __setModuleDefault = Object.create ? function(o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
      } : function(o, v) {
        o["default"] = v;
      };
      __importStar = function(mod) {
        if (mod && mod.__esModule)
          return mod;
        var result = {};
        if (mod != null) {
          for (var k in mod)
            if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
              __createBinding(result, mod, k);
        }
        __setModuleDefault(result, mod);
        return result;
      };
      __importDefault = function(mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      __classPrivateFieldGet = function(receiver, state, kind, f3) {
        if (kind === "a" && !f3)
          throw new TypeError("Private accessor was defined without a getter");
        if (typeof state === "function" ? receiver !== state || !f3 : !state.has(receiver))
          throw new TypeError("Cannot read private member from an object whose class did not declare it");
        return kind === "m" ? f3 : kind === "a" ? f3.call(receiver) : f3 ? f3.value : state.get(receiver);
      };
      __classPrivateFieldSet = function(receiver, state, value, kind, f3) {
        if (kind === "m")
          throw new TypeError("Private method is not writable");
        if (kind === "a" && !f3)
          throw new TypeError("Private accessor was defined without a setter");
        if (typeof state === "function" ? receiver !== state || !f3 : !state.has(receiver))
          throw new TypeError("Cannot write private member to an object whose class did not declare it");
        return kind === "a" ? f3.call(receiver, value) : f3 ? f3.value = value : state.set(receiver, value), value;
      };
      __classPrivateFieldIn = function(state, receiver) {
        if (receiver === null || typeof receiver !== "object" && typeof receiver !== "function")
          throw new TypeError("Cannot use 'in' operator on non-object");
        return typeof state === "function" ? receiver === state : state.has(receiver);
      };
      exporter("__extends", __extends);
      exporter("__assign", __assign);
      exporter("__rest", __rest);
      exporter("__decorate", __decorate);
      exporter("__param", __param);
      exporter("__metadata", __metadata);
      exporter("__awaiter", __awaiter);
      exporter("__generator", __generator);
      exporter("__exportStar", __exportStar);
      exporter("__createBinding", __createBinding);
      exporter("__values", __values);
      exporter("__read", __read);
      exporter("__spread", __spread);
      exporter("__spreadArrays", __spreadArrays);
      exporter("__spreadArray", __spreadArray);
      exporter("__await", __await);
      exporter("__asyncGenerator", __asyncGenerator);
      exporter("__asyncDelegator", __asyncDelegator);
      exporter("__asyncValues", __asyncValues);
      exporter("__makeTemplateObject", __makeTemplateObject);
      exporter("__importStar", __importStar);
      exporter("__importDefault", __importDefault);
      exporter("__classPrivateFieldGet", __classPrivateFieldGet);
      exporter("__classPrivateFieldSet", __classPrivateFieldSet);
      exporter("__classPrivateFieldIn", __classPrivateFieldIn);
    });
  }
});

// node_modules/@aws-sdk/middleware-serde/dist-cjs/deserializerMiddleware.js
var require_deserializerMiddleware = __commonJS({
  "node_modules/@aws-sdk/middleware-serde/dist-cjs/deserializerMiddleware.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.deserializerMiddleware = void 0;
    var deserializerMiddleware = (options, deserializer) => (next, context) => async (args) => {
      const { response } = await next(args);
      try {
        const parsed = await deserializer(response, options);
        return {
          response,
          output: parsed
        };
      } catch (error) {
        Object.defineProperty(error, "$response", {
          value: response
        });
        throw error;
      }
    };
    exports.deserializerMiddleware = deserializerMiddleware;
  }
});

// node_modules/@aws-sdk/middleware-serde/dist-cjs/serializerMiddleware.js
var require_serializerMiddleware = __commonJS({
  "node_modules/@aws-sdk/middleware-serde/dist-cjs/serializerMiddleware.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.serializerMiddleware = void 0;
    var serializerMiddleware = (options, serializer) => (next, context) => async (args) => {
      const request = await serializer(args.input, options);
      return next({
        ...args,
        request
      });
    };
    exports.serializerMiddleware = serializerMiddleware;
  }
});

// node_modules/@aws-sdk/middleware-serde/dist-cjs/serdePlugin.js
var require_serdePlugin = __commonJS({
  "node_modules/@aws-sdk/middleware-serde/dist-cjs/serdePlugin.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getSerdePlugin = exports.serializerMiddlewareOption = exports.deserializerMiddlewareOption = void 0;
    var deserializerMiddleware_1 = require_deserializerMiddleware();
    var serializerMiddleware_1 = require_serializerMiddleware();
    exports.deserializerMiddlewareOption = {
      name: "deserializerMiddleware",
      step: "deserialize",
      tags: ["DESERIALIZER"],
      override: true
    };
    exports.serializerMiddlewareOption = {
      name: "serializerMiddleware",
      step: "serialize",
      tags: ["SERIALIZER"],
      override: true
    };
    function getSerdePlugin(config, serializer, deserializer) {
      return {
        applyToStack: (commandStack) => {
          commandStack.add((0, deserializerMiddleware_1.deserializerMiddleware)(config, deserializer), exports.deserializerMiddlewareOption);
          commandStack.add((0, serializerMiddleware_1.serializerMiddleware)(config, serializer), exports.serializerMiddlewareOption);
        }
      };
    }
    exports.getSerdePlugin = getSerdePlugin;
  }
});

// node_modules/@aws-sdk/middleware-serde/dist-cjs/index.js
var require_dist_cjs = __commonJS({
  "node_modules/@aws-sdk/middleware-serde/dist-cjs/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require_tslib();
    tslib_1.__exportStar(require_deserializerMiddleware(), exports);
    tslib_1.__exportStar(require_serdePlugin(), exports);
    tslib_1.__exportStar(require_serializerMiddleware(), exports);
  }
});

// node_modules/@aws-sdk/middleware-stack/dist-cjs/MiddlewareStack.js
var require_MiddlewareStack = __commonJS({
  "node_modules/@aws-sdk/middleware-stack/dist-cjs/MiddlewareStack.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.constructStack = void 0;
    var constructStack = () => {
      let absoluteEntries = [];
      let relativeEntries = [];
      const entriesNameSet = /* @__PURE__ */ new Set();
      const sort = (entries) => entries.sort((a, b) => stepWeights[b.step] - stepWeights[a.step] || priorityWeights[b.priority || "normal"] - priorityWeights[a.priority || "normal"]);
      const removeByName = (toRemove) => {
        let isRemoved = false;
        const filterCb = (entry) => {
          if (entry.name && entry.name === toRemove) {
            isRemoved = true;
            entriesNameSet.delete(toRemove);
            return false;
          }
          return true;
        };
        absoluteEntries = absoluteEntries.filter(filterCb);
        relativeEntries = relativeEntries.filter(filterCb);
        return isRemoved;
      };
      const removeByReference = (toRemove) => {
        let isRemoved = false;
        const filterCb = (entry) => {
          if (entry.middleware === toRemove) {
            isRemoved = true;
            if (entry.name)
              entriesNameSet.delete(entry.name);
            return false;
          }
          return true;
        };
        absoluteEntries = absoluteEntries.filter(filterCb);
        relativeEntries = relativeEntries.filter(filterCb);
        return isRemoved;
      };
      const cloneTo = (toStack) => {
        absoluteEntries.forEach((entry) => {
          toStack.add(entry.middleware, { ...entry });
        });
        relativeEntries.forEach((entry) => {
          toStack.addRelativeTo(entry.middleware, { ...entry });
        });
        return toStack;
      };
      const expandRelativeMiddlewareList = (from) => {
        const expandedMiddlewareList = [];
        from.before.forEach((entry) => {
          if (entry.before.length === 0 && entry.after.length === 0) {
            expandedMiddlewareList.push(entry);
          } else {
            expandedMiddlewareList.push(...expandRelativeMiddlewareList(entry));
          }
        });
        expandedMiddlewareList.push(from);
        from.after.reverse().forEach((entry) => {
          if (entry.before.length === 0 && entry.after.length === 0) {
            expandedMiddlewareList.push(entry);
          } else {
            expandedMiddlewareList.push(...expandRelativeMiddlewareList(entry));
          }
        });
        return expandedMiddlewareList;
      };
      const getMiddlewareList = () => {
        const normalizedAbsoluteEntries = [];
        const normalizedRelativeEntries = [];
        const normalizedEntriesNameMap = {};
        absoluteEntries.forEach((entry) => {
          const normalizedEntry = {
            ...entry,
            before: [],
            after: []
          };
          if (normalizedEntry.name)
            normalizedEntriesNameMap[normalizedEntry.name] = normalizedEntry;
          normalizedAbsoluteEntries.push(normalizedEntry);
        });
        relativeEntries.forEach((entry) => {
          const normalizedEntry = {
            ...entry,
            before: [],
            after: []
          };
          if (normalizedEntry.name)
            normalizedEntriesNameMap[normalizedEntry.name] = normalizedEntry;
          normalizedRelativeEntries.push(normalizedEntry);
        });
        normalizedRelativeEntries.forEach((entry) => {
          if (entry.toMiddleware) {
            const toMiddleware = normalizedEntriesNameMap[entry.toMiddleware];
            if (toMiddleware === void 0) {
              throw new Error(`${entry.toMiddleware} is not found when adding ${entry.name || "anonymous"} middleware ${entry.relation} ${entry.toMiddleware}`);
            }
            if (entry.relation === "after") {
              toMiddleware.after.push(entry);
            }
            if (entry.relation === "before") {
              toMiddleware.before.push(entry);
            }
          }
        });
        const mainChain = sort(normalizedAbsoluteEntries).map(expandRelativeMiddlewareList).reduce((wholeList, expendedMiddlewareList) => {
          wholeList.push(...expendedMiddlewareList);
          return wholeList;
        }, []);
        return mainChain.map((entry) => entry.middleware);
      };
      const stack = {
        add: (middleware, options = {}) => {
          const { name, override } = options;
          const entry = {
            step: "initialize",
            priority: "normal",
            middleware,
            ...options
          };
          if (name) {
            if (entriesNameSet.has(name)) {
              if (!override)
                throw new Error(`Duplicate middleware name '${name}'`);
              const toOverrideIndex = absoluteEntries.findIndex((entry2) => entry2.name === name);
              const toOverride = absoluteEntries[toOverrideIndex];
              if (toOverride.step !== entry.step || toOverride.priority !== entry.priority) {
                throw new Error(`"${name}" middleware with ${toOverride.priority} priority in ${toOverride.step} step cannot be overridden by same-name middleware with ${entry.priority} priority in ${entry.step} step.`);
              }
              absoluteEntries.splice(toOverrideIndex, 1);
            }
            entriesNameSet.add(name);
          }
          absoluteEntries.push(entry);
        },
        addRelativeTo: (middleware, options) => {
          const { name, override } = options;
          const entry = {
            middleware,
            ...options
          };
          if (name) {
            if (entriesNameSet.has(name)) {
              if (!override)
                throw new Error(`Duplicate middleware name '${name}'`);
              const toOverrideIndex = relativeEntries.findIndex((entry2) => entry2.name === name);
              const toOverride = relativeEntries[toOverrideIndex];
              if (toOverride.toMiddleware !== entry.toMiddleware || toOverride.relation !== entry.relation) {
                throw new Error(`"${name}" middleware ${toOverride.relation} "${toOverride.toMiddleware}" middleware cannot be overridden by same-name middleware ${entry.relation} "${entry.toMiddleware}" middleware.`);
              }
              relativeEntries.splice(toOverrideIndex, 1);
            }
            entriesNameSet.add(name);
          }
          relativeEntries.push(entry);
        },
        clone: () => cloneTo((0, exports.constructStack)()),
        use: (plugin) => {
          plugin.applyToStack(stack);
        },
        remove: (toRemove) => {
          if (typeof toRemove === "string")
            return removeByName(toRemove);
          else
            return removeByReference(toRemove);
        },
        removeByTag: (toRemove) => {
          let isRemoved = false;
          const filterCb = (entry) => {
            const { tags, name } = entry;
            if (tags && tags.includes(toRemove)) {
              if (name)
                entriesNameSet.delete(name);
              isRemoved = true;
              return false;
            }
            return true;
          };
          absoluteEntries = absoluteEntries.filter(filterCb);
          relativeEntries = relativeEntries.filter(filterCb);
          return isRemoved;
        },
        concat: (from) => {
          const cloned = cloneTo((0, exports.constructStack)());
          cloned.use(from);
          return cloned;
        },
        applyToStack: cloneTo,
        resolve: (handler2, context) => {
          for (const middleware of getMiddlewareList().reverse()) {
            handler2 = middleware(handler2, context);
          }
          return handler2;
        }
      };
      return stack;
    };
    exports.constructStack = constructStack;
    var stepWeights = {
      initialize: 5,
      serialize: 4,
      build: 3,
      finalizeRequest: 2,
      deserialize: 1
    };
    var priorityWeights = {
      high: 3,
      normal: 2,
      low: 1
    };
  }
});

// node_modules/@aws-sdk/middleware-stack/dist-cjs/index.js
var require_dist_cjs2 = __commonJS({
  "node_modules/@aws-sdk/middleware-stack/dist-cjs/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require_tslib();
    tslib_1.__exportStar(require_MiddlewareStack(), exports);
  }
});

// node_modules/@aws-sdk/smithy-client/dist-cjs/client.js
var require_client = __commonJS({
  "node_modules/@aws-sdk/smithy-client/dist-cjs/client.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Client = void 0;
    var middleware_stack_1 = require_dist_cjs2();
    var Client = class {
      constructor(config) {
        this.middlewareStack = (0, middleware_stack_1.constructStack)();
        this.config = config;
      }
      send(command, optionsOrCb, cb) {
        const options = typeof optionsOrCb !== "function" ? optionsOrCb : void 0;
        const callback = typeof optionsOrCb === "function" ? optionsOrCb : cb;
        const handler2 = command.resolveMiddleware(this.middlewareStack, this.config, options);
        if (callback) {
          handler2(command).then((result) => callback(null, result.output), (err) => callback(err)).catch(() => {
          });
        } else {
          return handler2(command).then((result) => result.output);
        }
      }
      destroy() {
        if (this.config.requestHandler.destroy)
          this.config.requestHandler.destroy();
      }
    };
    exports.Client = Client;
  }
});

// node_modules/@aws-sdk/smithy-client/dist-cjs/command.js
var require_command = __commonJS({
  "node_modules/@aws-sdk/smithy-client/dist-cjs/command.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Command = void 0;
    var middleware_stack_1 = require_dist_cjs2();
    var Command = class {
      constructor() {
        this.middlewareStack = (0, middleware_stack_1.constructStack)();
      }
    };
    exports.Command = Command;
  }
});

// node_modules/@aws-sdk/smithy-client/dist-cjs/constants.js
var require_constants = __commonJS({
  "node_modules/@aws-sdk/smithy-client/dist-cjs/constants.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SENSITIVE_STRING = void 0;
    exports.SENSITIVE_STRING = "***SensitiveInformation***";
  }
});

// node_modules/@aws-sdk/smithy-client/dist-cjs/parse-utils.js
var require_parse_utils = __commonJS({
  "node_modules/@aws-sdk/smithy-client/dist-cjs/parse-utils.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.strictParseByte = exports.strictParseShort = exports.strictParseInt32 = exports.strictParseInt = exports.strictParseLong = exports.limitedParseFloat32 = exports.limitedParseFloat = exports.handleFloat = exports.limitedParseDouble = exports.strictParseFloat32 = exports.strictParseFloat = exports.strictParseDouble = exports.expectUnion = exports.expectString = exports.expectObject = exports.expectNonNull = exports.expectByte = exports.expectShort = exports.expectInt32 = exports.expectInt = exports.expectLong = exports.expectFloat32 = exports.expectNumber = exports.expectBoolean = exports.parseBoolean = void 0;
    var parseBoolean = (value) => {
      switch (value) {
        case "true":
          return true;
        case "false":
          return false;
        default:
          throw new Error(`Unable to parse boolean value "${value}"`);
      }
    };
    exports.parseBoolean = parseBoolean;
    var expectBoolean = (value) => {
      if (value === null || value === void 0) {
        return void 0;
      }
      if (typeof value === "boolean") {
        return value;
      }
      throw new TypeError(`Expected boolean, got ${typeof value}`);
    };
    exports.expectBoolean = expectBoolean;
    var expectNumber = (value) => {
      if (value === null || value === void 0) {
        return void 0;
      }
      if (typeof value === "number") {
        return value;
      }
      throw new TypeError(`Expected number, got ${typeof value}`);
    };
    exports.expectNumber = expectNumber;
    var MAX_FLOAT = Math.ceil(2 ** 127 * (2 - 2 ** -23));
    var expectFloat32 = (value) => {
      const expected = (0, exports.expectNumber)(value);
      if (expected !== void 0 && !Number.isNaN(expected) && expected !== Infinity && expected !== -Infinity) {
        if (Math.abs(expected) > MAX_FLOAT) {
          throw new TypeError(`Expected 32-bit float, got ${value}`);
        }
      }
      return expected;
    };
    exports.expectFloat32 = expectFloat32;
    var expectLong = (value) => {
      if (value === null || value === void 0) {
        return void 0;
      }
      if (Number.isInteger(value) && !Number.isNaN(value)) {
        return value;
      }
      throw new TypeError(`Expected integer, got ${typeof value}`);
    };
    exports.expectLong = expectLong;
    exports.expectInt = exports.expectLong;
    var expectInt32 = (value) => expectSizedInt(value, 32);
    exports.expectInt32 = expectInt32;
    var expectShort = (value) => expectSizedInt(value, 16);
    exports.expectShort = expectShort;
    var expectByte = (value) => expectSizedInt(value, 8);
    exports.expectByte = expectByte;
    var expectSizedInt = (value, size) => {
      const expected = (0, exports.expectLong)(value);
      if (expected !== void 0 && castInt(expected, size) !== expected) {
        throw new TypeError(`Expected ${size}-bit integer, got ${value}`);
      }
      return expected;
    };
    var castInt = (value, size) => {
      switch (size) {
        case 32:
          return Int32Array.of(value)[0];
        case 16:
          return Int16Array.of(value)[0];
        case 8:
          return Int8Array.of(value)[0];
      }
    };
    var expectNonNull = (value, location) => {
      if (value === null || value === void 0) {
        if (location) {
          throw new TypeError(`Expected a non-null value for ${location}`);
        }
        throw new TypeError("Expected a non-null value");
      }
      return value;
    };
    exports.expectNonNull = expectNonNull;
    var expectObject = (value) => {
      if (value === null || value === void 0) {
        return void 0;
      }
      if (typeof value === "object" && !Array.isArray(value)) {
        return value;
      }
      throw new TypeError(`Expected object, got ${typeof value}`);
    };
    exports.expectObject = expectObject;
    var expectString = (value) => {
      if (value === null || value === void 0) {
        return void 0;
      }
      if (typeof value === "string") {
        return value;
      }
      throw new TypeError(`Expected string, got ${typeof value}`);
    };
    exports.expectString = expectString;
    var expectUnion = (value) => {
      if (value === null || value === void 0) {
        return void 0;
      }
      const asObject = (0, exports.expectObject)(value);
      const setKeys = Object.entries(asObject).filter(([_, v]) => v !== null && v !== void 0).map(([k, _]) => k);
      if (setKeys.length === 0) {
        throw new TypeError(`Unions must have exactly one non-null member`);
      }
      if (setKeys.length > 1) {
        throw new TypeError(`Unions must have exactly one non-null member. Keys ${setKeys} were not null.`);
      }
      return asObject;
    };
    exports.expectUnion = expectUnion;
    var strictParseDouble = (value) => {
      if (typeof value == "string") {
        return (0, exports.expectNumber)(parseNumber(value));
      }
      return (0, exports.expectNumber)(value);
    };
    exports.strictParseDouble = strictParseDouble;
    exports.strictParseFloat = exports.strictParseDouble;
    var strictParseFloat32 = (value) => {
      if (typeof value == "string") {
        return (0, exports.expectFloat32)(parseNumber(value));
      }
      return (0, exports.expectFloat32)(value);
    };
    exports.strictParseFloat32 = strictParseFloat32;
    var NUMBER_REGEX = /(-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)|(-?Infinity)|(NaN)/g;
    var parseNumber = (value) => {
      const matches = value.match(NUMBER_REGEX);
      if (matches === null || matches[0].length !== value.length) {
        throw new TypeError(`Expected real number, got implicit NaN`);
      }
      return parseFloat(value);
    };
    var limitedParseDouble = (value) => {
      if (typeof value == "string") {
        return parseFloatString(value);
      }
      return (0, exports.expectNumber)(value);
    };
    exports.limitedParseDouble = limitedParseDouble;
    exports.handleFloat = exports.limitedParseDouble;
    exports.limitedParseFloat = exports.limitedParseDouble;
    var limitedParseFloat32 = (value) => {
      if (typeof value == "string") {
        return parseFloatString(value);
      }
      return (0, exports.expectFloat32)(value);
    };
    exports.limitedParseFloat32 = limitedParseFloat32;
    var parseFloatString = (value) => {
      switch (value) {
        case "NaN":
          return NaN;
        case "Infinity":
          return Infinity;
        case "-Infinity":
          return -Infinity;
        default:
          throw new Error(`Unable to parse float value: ${value}`);
      }
    };
    var strictParseLong = (value) => {
      if (typeof value === "string") {
        return (0, exports.expectLong)(parseNumber(value));
      }
      return (0, exports.expectLong)(value);
    };
    exports.strictParseLong = strictParseLong;
    exports.strictParseInt = exports.strictParseLong;
    var strictParseInt32 = (value) => {
      if (typeof value === "string") {
        return (0, exports.expectInt32)(parseNumber(value));
      }
      return (0, exports.expectInt32)(value);
    };
    exports.strictParseInt32 = strictParseInt32;
    var strictParseShort = (value) => {
      if (typeof value === "string") {
        return (0, exports.expectShort)(parseNumber(value));
      }
      return (0, exports.expectShort)(value);
    };
    exports.strictParseShort = strictParseShort;
    var strictParseByte = (value) => {
      if (typeof value === "string") {
        return (0, exports.expectByte)(parseNumber(value));
      }
      return (0, exports.expectByte)(value);
    };
    exports.strictParseByte = strictParseByte;
  }
});

// node_modules/@aws-sdk/smithy-client/dist-cjs/date-utils.js
var require_date_utils = __commonJS({
  "node_modules/@aws-sdk/smithy-client/dist-cjs/date-utils.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parseEpochTimestamp = exports.parseRfc7231DateTime = exports.parseRfc3339DateTime = exports.dateToUtcString = void 0;
    var parse_utils_1 = require_parse_utils();
    var DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    function dateToUtcString(date) {
      const year = date.getUTCFullYear();
      const month = date.getUTCMonth();
      const dayOfWeek = date.getUTCDay();
      const dayOfMonthInt = date.getUTCDate();
      const hoursInt = date.getUTCHours();
      const minutesInt = date.getUTCMinutes();
      const secondsInt = date.getUTCSeconds();
      const dayOfMonthString = dayOfMonthInt < 10 ? `0${dayOfMonthInt}` : `${dayOfMonthInt}`;
      const hoursString = hoursInt < 10 ? `0${hoursInt}` : `${hoursInt}`;
      const minutesString = minutesInt < 10 ? `0${minutesInt}` : `${minutesInt}`;
      const secondsString = secondsInt < 10 ? `0${secondsInt}` : `${secondsInt}`;
      return `${DAYS[dayOfWeek]}, ${dayOfMonthString} ${MONTHS[month]} ${year} ${hoursString}:${minutesString}:${secondsString} GMT`;
    }
    exports.dateToUtcString = dateToUtcString;
    var RFC3339 = new RegExp(/^(\d{4})-(\d{2})-(\d{2})[tT](\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?[zZ]$/);
    var parseRfc3339DateTime = (value) => {
      if (value === null || value === void 0) {
        return void 0;
      }
      if (typeof value !== "string") {
        throw new TypeError("RFC-3339 date-times must be expressed as strings");
      }
      const match = RFC3339.exec(value);
      if (!match) {
        throw new TypeError("Invalid RFC-3339 date-time value");
      }
      const [_, yearStr, monthStr, dayStr, hours, minutes, seconds, fractionalMilliseconds] = match;
      const year = (0, parse_utils_1.strictParseShort)(stripLeadingZeroes(yearStr));
      const month = parseDateValue(monthStr, "month", 1, 12);
      const day = parseDateValue(dayStr, "day", 1, 31);
      return buildDate(year, month, day, { hours, minutes, seconds, fractionalMilliseconds });
    };
    exports.parseRfc3339DateTime = parseRfc3339DateTime;
    var IMF_FIXDATE = new RegExp(/^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun), (\d{2}) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{4}) (\d{2}):(\d{2}):(\d{2})(?:\.(\d+))? GMT$/);
    var RFC_850_DATE = new RegExp(/^(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday), (\d{2})-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(\d{2}) (\d{2}):(\d{2}):(\d{2})(?:\.(\d+))? GMT$/);
    var ASC_TIME = new RegExp(/^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) ( [1-9]|\d{2}) (\d{2}):(\d{2}):(\d{2})(?:\.(\d+))? (\d{4})$/);
    var parseRfc7231DateTime = (value) => {
      if (value === null || value === void 0) {
        return void 0;
      }
      if (typeof value !== "string") {
        throw new TypeError("RFC-7231 date-times must be expressed as strings");
      }
      let match = IMF_FIXDATE.exec(value);
      if (match) {
        const [_, dayStr, monthStr, yearStr, hours, minutes, seconds, fractionalMilliseconds] = match;
        return buildDate((0, parse_utils_1.strictParseShort)(stripLeadingZeroes(yearStr)), parseMonthByShortName(monthStr), parseDateValue(dayStr, "day", 1, 31), { hours, minutes, seconds, fractionalMilliseconds });
      }
      match = RFC_850_DATE.exec(value);
      if (match) {
        const [_, dayStr, monthStr, yearStr, hours, minutes, seconds, fractionalMilliseconds] = match;
        return adjustRfc850Year(buildDate(parseTwoDigitYear(yearStr), parseMonthByShortName(monthStr), parseDateValue(dayStr, "day", 1, 31), {
          hours,
          minutes,
          seconds,
          fractionalMilliseconds
        }));
      }
      match = ASC_TIME.exec(value);
      if (match) {
        const [_, monthStr, dayStr, hours, minutes, seconds, fractionalMilliseconds, yearStr] = match;
        return buildDate((0, parse_utils_1.strictParseShort)(stripLeadingZeroes(yearStr)), parseMonthByShortName(monthStr), parseDateValue(dayStr.trimLeft(), "day", 1, 31), { hours, minutes, seconds, fractionalMilliseconds });
      }
      throw new TypeError("Invalid RFC-7231 date-time value");
    };
    exports.parseRfc7231DateTime = parseRfc7231DateTime;
    var parseEpochTimestamp = (value) => {
      if (value === null || value === void 0) {
        return void 0;
      }
      let valueAsDouble;
      if (typeof value === "number") {
        valueAsDouble = value;
      } else if (typeof value === "string") {
        valueAsDouble = (0, parse_utils_1.strictParseDouble)(value);
      } else {
        throw new TypeError("Epoch timestamps must be expressed as floating point numbers or their string representation");
      }
      if (Number.isNaN(valueAsDouble) || valueAsDouble === Infinity || valueAsDouble === -Infinity) {
        throw new TypeError("Epoch timestamps must be valid, non-Infinite, non-NaN numerics");
      }
      return new Date(Math.round(valueAsDouble * 1e3));
    };
    exports.parseEpochTimestamp = parseEpochTimestamp;
    var buildDate = (year, month, day, time) => {
      const adjustedMonth = month - 1;
      validateDayOfMonth(year, adjustedMonth, day);
      return new Date(Date.UTC(year, adjustedMonth, day, parseDateValue(time.hours, "hour", 0, 23), parseDateValue(time.minutes, "minute", 0, 59), parseDateValue(time.seconds, "seconds", 0, 60), parseMilliseconds(time.fractionalMilliseconds)));
    };
    var parseTwoDigitYear = (value) => {
      const thisYear = new Date().getUTCFullYear();
      const valueInThisCentury = Math.floor(thisYear / 100) * 100 + (0, parse_utils_1.strictParseShort)(stripLeadingZeroes(value));
      if (valueInThisCentury < thisYear) {
        return valueInThisCentury + 100;
      }
      return valueInThisCentury;
    };
    var FIFTY_YEARS_IN_MILLIS = 50 * 365 * 24 * 60 * 60 * 1e3;
    var adjustRfc850Year = (input) => {
      if (input.getTime() - new Date().getTime() > FIFTY_YEARS_IN_MILLIS) {
        return new Date(Date.UTC(input.getUTCFullYear() - 100, input.getUTCMonth(), input.getUTCDate(), input.getUTCHours(), input.getUTCMinutes(), input.getUTCSeconds(), input.getUTCMilliseconds()));
      }
      return input;
    };
    var parseMonthByShortName = (value) => {
      const monthIdx = MONTHS.indexOf(value);
      if (monthIdx < 0) {
        throw new TypeError(`Invalid month: ${value}`);
      }
      return monthIdx + 1;
    };
    var DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var validateDayOfMonth = (year, month, day) => {
      let maxDays = DAYS_IN_MONTH[month];
      if (month === 1 && isLeapYear(year)) {
        maxDays = 29;
      }
      if (day > maxDays) {
        throw new TypeError(`Invalid day for ${MONTHS[month]} in ${year}: ${day}`);
      }
    };
    var isLeapYear = (year) => {
      return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    };
    var parseDateValue = (value, type, lower2, upper) => {
      const dateVal = (0, parse_utils_1.strictParseByte)(stripLeadingZeroes(value));
      if (dateVal < lower2 || dateVal > upper) {
        throw new TypeError(`${type} must be between ${lower2} and ${upper}, inclusive`);
      }
      return dateVal;
    };
    var parseMilliseconds = (value) => {
      if (value === null || value === void 0) {
        return 0;
      }
      return (0, parse_utils_1.strictParseFloat32)("0." + value) * 1e3;
    };
    var stripLeadingZeroes = (value) => {
      let idx = 0;
      while (idx < value.length - 1 && value.charAt(idx) === "0") {
        idx++;
      }
      if (idx === 0) {
        return value;
      }
      return value.slice(idx);
    };
  }
});

// node_modules/@aws-sdk/smithy-client/dist-cjs/defaults-mode.js
var require_defaults_mode = __commonJS({
  "node_modules/@aws-sdk/smithy-client/dist-cjs/defaults-mode.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.loadConfigsForDefaultMode = void 0;
    var loadConfigsForDefaultMode = (mode) => {
      switch (mode) {
        case "standard":
          return {
            retryMode: "standard",
            connectionTimeout: 3100
          };
        case "in-region":
          return {
            retryMode: "standard",
            connectionTimeout: 1100
          };
        case "cross-region":
          return {
            retryMode: "standard",
            connectionTimeout: 3100
          };
        case "mobile":
          return {
            retryMode: "standard",
            connectionTimeout: 3e4
          };
        default:
          return {};
      }
    };
    exports.loadConfigsForDefaultMode = loadConfigsForDefaultMode;
  }
});

// node_modules/@aws-sdk/smithy-client/dist-cjs/emitWarningIfUnsupportedVersion.js
var require_emitWarningIfUnsupportedVersion = __commonJS({
  "node_modules/@aws-sdk/smithy-client/dist-cjs/emitWarningIfUnsupportedVersion.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.emitWarningIfUnsupportedVersion = void 0;
    var warningEmitted = false;
    var emitWarningIfUnsupportedVersion = (version) => {
      if (version && !warningEmitted && parseInt(version.substring(1, version.indexOf("."))) < 14) {
        warningEmitted = true;
        process.emitWarning(`The AWS SDK for JavaScript (v3) will
no longer support Node.js ${version} on November 1, 2022.

To continue receiving updates to AWS services, bug fixes, and security
updates please upgrade to Node.js 14.x or later.

For details, please refer our blog post: https://a.co/48dbdYz`, `NodeDeprecationWarning`);
      }
    };
    exports.emitWarningIfUnsupportedVersion = emitWarningIfUnsupportedVersion;
  }
});

// node_modules/@aws-sdk/smithy-client/dist-cjs/exceptions.js
var require_exceptions = __commonJS({
  "node_modules/@aws-sdk/smithy-client/dist-cjs/exceptions.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.decorateServiceException = exports.ServiceException = void 0;
    var ServiceException = class extends Error {
      constructor(options) {
        super(options.message);
        Object.setPrototypeOf(this, ServiceException.prototype);
        this.name = options.name;
        this.$fault = options.$fault;
        this.$metadata = options.$metadata;
      }
    };
    exports.ServiceException = ServiceException;
    var decorateServiceException = (exception, additions = {}) => {
      Object.entries(additions).filter(([, v]) => v !== void 0).forEach(([k, v]) => {
        if (exception[k] == void 0 || exception[k] === "") {
          exception[k] = v;
        }
      });
      const message = exception.message || exception.Message || "UnknownError";
      exception.message = message;
      delete exception.Message;
      return exception;
    };
    exports.decorateServiceException = decorateServiceException;
  }
});

// node_modules/@aws-sdk/smithy-client/dist-cjs/extended-encode-uri-component.js
var require_extended_encode_uri_component = __commonJS({
  "node_modules/@aws-sdk/smithy-client/dist-cjs/extended-encode-uri-component.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.extendedEncodeURIComponent = void 0;
    function extendedEncodeURIComponent(str) {
      return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
        return "%" + c.charCodeAt(0).toString(16).toUpperCase();
      });
    }
    exports.extendedEncodeURIComponent = extendedEncodeURIComponent;
  }
});

// node_modules/@aws-sdk/smithy-client/dist-cjs/get-array-if-single-item.js
var require_get_array_if_single_item = __commonJS({
  "node_modules/@aws-sdk/smithy-client/dist-cjs/get-array-if-single-item.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getArrayIfSingleItem = void 0;
    var getArrayIfSingleItem = (mayBeArray) => Array.isArray(mayBeArray) ? mayBeArray : [mayBeArray];
    exports.getArrayIfSingleItem = getArrayIfSingleItem;
  }
});

// node_modules/@aws-sdk/smithy-client/dist-cjs/get-value-from-text-node.js
var require_get_value_from_text_node = __commonJS({
  "node_modules/@aws-sdk/smithy-client/dist-cjs/get-value-from-text-node.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getValueFromTextNode = void 0;
    var getValueFromTextNode = (obj) => {
      const textNodeName = "#text";
      for (const key in obj) {
        if (obj.hasOwnProperty(key) && obj[key][textNodeName] !== void 0) {
          obj[key] = obj[key][textNodeName];
        } else if (typeof obj[key] === "object" && obj[key] !== null) {
          obj[key] = (0, exports.getValueFromTextNode)(obj[key]);
        }
      }
      return obj;
    };
    exports.getValueFromTextNode = getValueFromTextNode;
  }
});

// node_modules/@aws-sdk/smithy-client/dist-cjs/lazy-json.js
var require_lazy_json = __commonJS({
  "node_modules/@aws-sdk/smithy-client/dist-cjs/lazy-json.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LazyJsonString = exports.StringWrapper = void 0;
    var StringWrapper = function() {
      const Class = Object.getPrototypeOf(this).constructor;
      const Constructor = Function.bind.apply(String, [null, ...arguments]);
      const instance = new Constructor();
      Object.setPrototypeOf(instance, Class.prototype);
      return instance;
    };
    exports.StringWrapper = StringWrapper;
    exports.StringWrapper.prototype = Object.create(String.prototype, {
      constructor: {
        value: exports.StringWrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    Object.setPrototypeOf(exports.StringWrapper, String);
    var LazyJsonString = class extends exports.StringWrapper {
      deserializeJSON() {
        return JSON.parse(super.toString());
      }
      toJSON() {
        return super.toString();
      }
      static fromObject(object) {
        if (object instanceof LazyJsonString) {
          return object;
        } else if (object instanceof String || typeof object === "string") {
          return new LazyJsonString(object);
        }
        return new LazyJsonString(JSON.stringify(object));
      }
    };
    exports.LazyJsonString = LazyJsonString;
  }
});

// node_modules/@aws-sdk/smithy-client/dist-cjs/ser-utils.js
var require_ser_utils = __commonJS({
  "node_modules/@aws-sdk/smithy-client/dist-cjs/ser-utils.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.serializeFloat = void 0;
    var serializeFloat = (value) => {
      if (value !== value) {
        return "NaN";
      }
      switch (value) {
        case Infinity:
          return "Infinity";
        case -Infinity:
          return "-Infinity";
        default:
          return value;
      }
    };
    exports.serializeFloat = serializeFloat;
  }
});

// node_modules/@aws-sdk/smithy-client/dist-cjs/split-every.js
var require_split_every = __commonJS({
  "node_modules/@aws-sdk/smithy-client/dist-cjs/split-every.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.splitEvery = void 0;
    function splitEvery(value, delimiter, numDelimiters) {
      if (numDelimiters <= 0 || !Number.isInteger(numDelimiters)) {
        throw new Error("Invalid number of delimiters (" + numDelimiters + ") for splitEvery.");
      }
      const segments = value.split(delimiter);
      if (numDelimiters === 1) {
        return segments;
      }
      const compoundSegments = [];
      let currentSegment = "";
      for (let i2 = 0; i2 < segments.length; i2++) {
        if (currentSegment === "") {
          currentSegment = segments[i2];
        } else {
          currentSegment += delimiter + segments[i2];
        }
        if ((i2 + 1) % numDelimiters === 0) {
          compoundSegments.push(currentSegment);
          currentSegment = "";
        }
      }
      if (currentSegment !== "") {
        compoundSegments.push(currentSegment);
      }
      return compoundSegments;
    }
    exports.splitEvery = splitEvery;
  }
});

// node_modules/@aws-sdk/smithy-client/dist-cjs/index.js
var require_dist_cjs3 = __commonJS({
  "node_modules/@aws-sdk/smithy-client/dist-cjs/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require_tslib();
    tslib_1.__exportStar(require_client(), exports);
    tslib_1.__exportStar(require_command(), exports);
    tslib_1.__exportStar(require_constants(), exports);
    tslib_1.__exportStar(require_date_utils(), exports);
    tslib_1.__exportStar(require_defaults_mode(), exports);
    tslib_1.__exportStar(require_emitWarningIfUnsupportedVersion(), exports);
    tslib_1.__exportStar(require_exceptions(), exports);
    tslib_1.__exportStar(require_extended_encode_uri_component(), exports);
    tslib_1.__exportStar(require_get_array_if_single_item(), exports);
    tslib_1.__exportStar(require_get_value_from_text_node(), exports);
    tslib_1.__exportStar(require_lazy_json(), exports);
    tslib_1.__exportStar(require_parse_utils(), exports);
    tslib_1.__exportStar(require_ser_utils(), exports);
    tslib_1.__exportStar(require_split_every(), exports);
  }
});

// node_modules/@aws-sdk/client-secrets-manager/dist-cjs/models/SecretsManagerServiceException.js
var require_SecretsManagerServiceException = __commonJS({
  "node_modules/@aws-sdk/client-secrets-manager/dist-cjs/models/SecretsManagerServiceException.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SecretsManagerServiceException = void 0;
    var smithy_client_1 = require_dist_cjs3();
    var SecretsManagerServiceException = class extends smithy_client_1.ServiceException {
      constructor(options) {
        super(options);
        Object.setPrototypeOf(this, SecretsManagerServiceException.prototype);
      }
    };
    exports.SecretsManagerServiceException = SecretsManagerServiceException;
  }
});

// node_modules/@aws-sdk/client-secrets-manager/dist-cjs/models/models_0.js
var require_models_0 = __commonJS({
  "node_modules/@aws-sdk/client-secrets-manager/dist-cjs/models/models_0.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RestoreSecretRequest = exports.ReplicateSecretToRegionsResponse = exports.ReplicateSecretToRegionsRequest = exports.RemoveRegionsFromReplicationResponse = exports.RemoveRegionsFromReplicationRequest = exports.PutSecretValueResponse = exports.PutSecretValueRequest = exports.PutResourcePolicyResponse = exports.PutResourcePolicyRequest = exports.PublicPolicyException = exports.ListSecretVersionIdsResponse = exports.SecretVersionsListEntry = exports.ListSecretVersionIdsRequest = exports.ListSecretsResponse = exports.SecretListEntry = exports.ListSecretsRequest = exports.SortOrderType = exports.InvalidNextTokenException = exports.GetSecretValueResponse = exports.GetSecretValueRequest = exports.GetResourcePolicyResponse = exports.GetResourcePolicyRequest = exports.GetRandomPasswordResponse = exports.GetRandomPasswordRequest = exports.Filter = exports.DescribeSecretResponse = exports.RotationRulesType = exports.DescribeSecretRequest = exports.DeleteSecretResponse = exports.DeleteSecretRequest = exports.DeleteResourcePolicyResponse = exports.DeleteResourcePolicyRequest = exports.ResourceExistsException = exports.PreconditionNotMetException = exports.MalformedPolicyDocumentException = exports.LimitExceededException = exports.EncryptionFailure = exports.DecryptionFailure = exports.CreateSecretResponse = exports.ReplicationStatusType = exports.StatusType = exports.CreateSecretRequest = exports.Tag = exports.ResourceNotFoundException = exports.InvalidRequestException = exports.InvalidParameterException = exports.InternalServiceError = exports.CancelRotateSecretResponse = exports.CancelRotateSecretRequest = exports.ReplicaRegionType = void 0;
    exports.ValidateResourcePolicyResponse = exports.ValidationErrorsEntry = exports.ValidateResourcePolicyRequest = exports.UpdateSecretVersionStageResponse = exports.UpdateSecretVersionStageRequest = exports.UpdateSecretResponse = exports.UpdateSecretRequest = exports.UntagResourceRequest = exports.TagResourceRequest = exports.StopReplicationToReplicaResponse = exports.StopReplicationToReplicaRequest = exports.RotateSecretResponse = exports.RotateSecretRequest = exports.RestoreSecretResponse = void 0;
    var smithy_client_1 = require_dist_cjs3();
    var SecretsManagerServiceException_1 = require_SecretsManagerServiceException();
    var ReplicaRegionType;
    (function(ReplicaRegionType2) {
      ReplicaRegionType2.filterSensitiveLog = (obj) => ({
        ...obj
      });
    })(ReplicaRegionType = exports.ReplicaRegionType || (exports.ReplicaRegionType = {}));
    var CancelRotateSecretRequest;
    (function(CancelRotateSecretRequest2) {
      CancelRotateSecretRequest2.filterSensitiveLog = (obj) => ({
        ...obj
      });
    })(CancelRotateSecretRequest = exports.CancelRotateSecretRequest || (exports.CancelRotateSecretRequest = {}));
    var CancelRotateSecretResponse;
    (function(CancelRotateSecretResponse2) {
      CancelRotateSecretResponse2.filterSensitiveLog = (obj) => ({
        ...obj
      });
    })(CancelRotateSecretResponse = exports.CancelRotateSecretResponse || (exports.CancelRotateSecretResponse = {}));
    var InternalServiceError = class extends SecretsManagerServiceException_1.SecretsManagerServiceException {
      constructor(opts) {
        super({
          name: "InternalServiceError",
          $fault: "server",
          ...opts
        });
        this.name = "InternalServiceError";
        this.$fault = "server";
        Object.setPrototypeOf(this, InternalServiceError.prototype);
        this.Message = opts.Message;
      }
    };
    exports.InternalServiceError = InternalServiceError;
    var InvalidParameterException = class extends SecretsManagerServiceException_1.SecretsManagerServiceException {
      constructor(opts) {
        super({
          name: "InvalidParameterException",
          $fault: "client",
          ...opts
        });
        this.name = "InvalidParameterException";
        this.$fault = "client";
        Object.setPrototypeOf(this, InvalidParameterException.prototype);
        this.Message = opts.Message;
      }
    };
    exports.InvalidParameterException = InvalidParameterException;
    var InvalidRequestException = class extends SecretsManagerServiceException_1.SecretsManagerServiceException {
      constructor(opts) {
        super({
          name: "InvalidRequestException",
          $fault: "client",
          ...opts
        });
        this.name = "InvalidRequestException";
        this.$fault = "client";
        Object.setPrototypeOf(this, InvalidRequestException.prototype);
        this.Message = opts.Message;
      }
    };
    exports.InvalidRequestException = InvalidRequestException;
    var ResourceNotFoundException = class extends SecretsManagerServiceException_1.SecretsManagerServiceException {
      constructor(opts) {
        super({
          name: "ResourceNotFoundException",
          $fault: "client",
          ...opts
        });
        this.name = "ResourceNotFoundException";
        this.$fault = "client";
        Object.setPrototypeOf(this, ResourceNotFoundException.prototype);
        this.Message = opts.Message;
      }
    };
    exports.ResourceNotFoundException = ResourceNotFoundException;
    var Tag;
    (function(Tag2) {
      Tag2.filterSensitiveLog = (obj) => ({
        ...obj
      });
    })(Tag = exports.Tag || (exports.Tag = {}));
    var CreateSecretRequest;
    (function(CreateSecretRequest2) {
      CreateSecretRequest2.filterSensitiveLog = (obj) => ({
        ...obj,
        ...obj.SecretBinary && { SecretBinary: smithy_client_1.SENSITIVE_STRING },
        ...obj.SecretString && { SecretString: smithy_client_1.SENSITIVE_STRING }
      });
    })(CreateSecretRequest = exports.CreateSecretRequest || (exports.CreateSecretRequest = {}));
    var StatusType;
    (function(StatusType2) {
      StatusType2["Failed"] = "Failed";
      StatusType2["InProgress"] = "InProgress";
      StatusType2["InSync"] = "InSync";
    })(StatusType = exports.StatusType || (exports.StatusType = {}));
    var ReplicationStatusType;
    (function(ReplicationStatusType2) {
      ReplicationStatusType2.filterSensitiveLog = (obj) => ({
        ...obj
      });
    })(ReplicationStatusType = exports.ReplicationStatusType || (exports.ReplicationStatusType = {}));
    var CreateSecretResponse;
    (function(CreateSecretResponse2) {
      CreateSecretResponse2.filterSensitiveLog = (obj) => ({
        ...obj
      });
    })(CreateSecretResponse = exports.CreateSecretResponse || (exports.CreateSecretResponse = {}));
    var DecryptionFailure = class extends SecretsManagerServiceException_1.SecretsManagerServiceException {
      constructor(opts) {
        super({
          name: "DecryptionFailure",
          $fault: "client",
          ...opts
        });
        this.name = "DecryptionFailure";
        this.$fault = "client";
        Object.setPrototypeOf(this, DecryptionFailure.prototype);
        this.Message = opts.Message;
      }
    };
    exports.DecryptionFailure = DecryptionFailure;
    var EncryptionFailure = class extends SecretsManagerServiceException_1.SecretsManagerServiceException {
      constructor(opts) {
        super({
          name: "EncryptionFailure",
          $fault: "client",
          ...opts
        });
        this.name = "EncryptionFailure";
        this.$fault = "client";
        Object.setPrototypeOf(this, EncryptionFailure.prototype);
        this.Message = opts.Message;
      }
    };
    exports.EncryptionFailure = EncryptionFailure;
    var LimitExceededException = class extends SecretsManagerServiceException_1.SecretsManagerServiceException {
      constructor(opts) {
        super({
          name: "LimitExceededException",
          $fault: "client",
          ...opts
        });
        this.name = "LimitExceededException";
        this.$fault = "client";
        Object.setPrototypeOf(this, LimitExceededException.prototype);
        this.Message = opts.Message;
      }
    };
    exports.LimitExceededException = LimitExceededException;
    var MalformedPolicyDocumentException = class extends SecretsManagerServiceException_1.SecretsManagerServiceException {
      constructor(opts) {
        super({
          name: "MalformedPolicyDocumentException",
          $fault: "client",
          ...opts
        });
        this.name = "MalformedPolicyDocumentException";
        this.$fault = "client";
        Object.setPrototypeOf(this, MalformedPolicyDocumentException.prototype);
        this.Message = opts.Message;
      }
    };
    exports.MalformedPolicyDocumentException = MalformedPolicyDocumentException;
    var PreconditionNotMetException = class extends SecretsManagerServiceException_1.SecretsManagerServiceException {
      constructor(opts) {
        super({
          name: "PreconditionNotMetException",
          $fault: "client",
          ...opts
        });
        this.name = "PreconditionNotMetException";
        this.$fault = "client";
        Object.setPrototypeOf(this, PreconditionNotMetException.prototype);
        this.Message = opts.Message;
      }
    };
    exports.PreconditionNotMetException = PreconditionNotMetException;
    var ResourceExistsException = class extends SecretsManagerServiceException_1.SecretsManagerServiceException {
      constructor(opts) {
        super({
          name: "ResourceExistsException",
          $fault: "client",
          ...opts
        });
        this.name = "ResourceExistsException";
        this.$fault = "client";
        Object.setPrototypeOf(this, ResourceExistsException.prototype);
        this.Message = opts.Message;
      }
    };
    exports.ResourceExistsException = ResourceExistsException;
    var DeleteResourcePolicyRequest;
    (function(DeleteResourcePolicyRequest2) {
      DeleteResourcePolicyRequest2.filterSensitiveLog = (obj) => ({
        ...obj
      });
    })(DeleteResourcePolicyRequest = exports.DeleteResourcePolicyRequest || (exports.DeleteResourcePolicyRequest = {}));
    var DeleteResourcePolicyResponse;
    (function(DeleteResourcePolicyResponse2) {
      DeleteResourcePolicyResponse2.filterSensitiveLog = (obj) => ({
        ...obj
      });
    })(DeleteResourcePolicyResponse = exports.DeleteResourcePolicyResponse || (exports.DeleteResourcePolicyResponse = {}));
    var DeleteSecretRequest;
    (function(DeleteSecretRequest2) {
      DeleteSecretRequest2.filterSensitiveLog = (obj) => ({
        ...obj
      });
    })(DeleteSecretRequest = exports.DeleteSecretRequest || (exports.DeleteSecretRequest = {}));
    var DeleteSecretResponse;
    (function(DeleteSecretResponse2) {
      DeleteSecretResponse2.filterSensitiveLog = (obj) => ({
        ...obj
      });
    })(DeleteSecretResponse = exports.DeleteSecretResponse || (exports.DeleteSecretResponse = {}));
    var DescribeSecretRequest;
    (function(DescribeSecretRequest2) {
      DescribeSecretRequest2.filterSensitiveLog = (obj) => ({
        ...obj
      });
    })(DescribeSecretRequest = exports.DescribeSecretRequest || (exports.DescribeSecretRequest = {}));
    var RotationRulesType;
    (function(RotationRulesType2) {
      RotationRulesType2.filterSensitiveLog = (obj) => ({
        ...obj
      });
    })(RotationRulesType = exports.RotationRulesType || (exports.RotationRulesType = {}));
    var DescribeSecretResponse;
    (function(DescribeSecretResponse2) {
      DescribeSecretResponse2.filterSensitiveLog = (obj) => ({
        ...obj
      });
    })(DescribeSecretResponse = exports.DescribeSecretResponse || (exports.DescribeSecretResponse = {}));
    var Filter;
    (function(Filter2) {
      Filter2.filterSensitiveLog = (obj) => ({
        ...obj
      });
    })(Filter = exports.Filter || (exports.Filter = {}));
    var GetRandomPasswordRequest;
    (function(GetRandomPasswordRequest2) {
      GetRandomPasswordRequest2.filterSensitiveLog = (obj) => ({
        ...obj
      });
    })(GetRandomPasswordRequest = exports.GetRandomPasswordRequest || (exports.GetRandomPasswordRequest = {}));
    var GetRandomPasswordResponse;
    (function(GetRandomPasswordResponse2) {
      GetRandomPasswordResponse2.filterSensitiveLog = (obj) => ({
        ...obj,
        ...obj.RandomPassword && { RandomPassword: smithy_client_1.SENSITIVE_STRING }
      });
    })(GetRandomPasswordResponse = exports.GetRandomPasswordResponse || (exports.GetRandomPasswordResponse = {}));
    var GetResourcePolicyRequest;
    (function(GetResourcePolicyRequest2) {
      GetResourcePolicyRequest2.filterSensitiveLog = (obj) => ({
        ...obj
      });
    })(GetResourcePolicyRequest = exports.GetResourcePolicyRequest || (exports.GetResourcePolicyRequest = {}));
    var GetResourcePolicyResponse;
    (function(GetResourcePolicyResponse2) {
      GetResourcePolicyResponse2.filterSensitiveLog = (obj) => ({
        ...obj
      });
    })(GetResourcePolicyResponse = exports.GetResourcePolicyResponse || (exports.GetResourcePolicyResponse = {}));
    var GetSecretValueRequest;
    (function(GetSecretValueRequest2) {
      GetSecretValueRequest2.filterSensitiveLog = (obj) => ({
        ...obj
      });
    })(GetSecretValueRequest = exports.GetSecretValueRequest || (exports.GetSecretValueRequest = {}));
    var GetSecretValueResponse;
    (function(GetSecretValueResponse2) {
      GetSecretValueResponse2.filterSensitiveLog = (obj) => ({
        ...obj,
        ...obj.SecretBinary && { SecretBinary: smithy_client_1.SENSITIVE_STRING },
        ...obj.SecretString && { SecretString: smithy_client_1.SENSITIVE_STRING }
      });
    })(GetSecretValueResponse = exports.GetSecretValueResponse || (exports.GetSecretValueResponse = {}));
    var InvalidNextTokenException = class extends SecretsManagerServiceException_1.SecretsManagerServiceException {
      constructor(opts) {
        super({
          name: "InvalidNextTokenException",
          $fault: "client",
          ...opts
        });
        this.name = "InvalidNextTokenException";
        this.$fault = "client";
        Object.setPrototypeOf(this, InvalidNextTokenException.prototype);
        this.Message = opts.Message;
      }
    };
    exports.InvalidNextTokenException = InvalidNextTokenException;
    var SortOrderType;
    (function(SortOrderType2) {
      SortOrderType2["asc"] = "asc";
      SortOrderType2["desc"] = "desc";
    })(SortOrderType = exports.SortOrderType || (exports.SortOrderType = {}));
    var ListSecretsRequest;
    (function(ListSecretsRequest2) {
      ListSecretsRequest2.filterSensitiveLog = (obj) => ({
        ...obj
      });
    })(ListSecretsRequest = exports.ListSecretsRequest || (exports.ListSecretsRequest = {}));
    var SecretListEntry;
    (function(SecretListEntry2) {
      SecretListEntry2.filterSensitiveLog = (obj) => ({
        ...obj
      });
    })(SecretListEntry = exports.SecretListEntry || (exports.SecretListEntry = {}));
    var ListSecretsResponse;
    (function(ListSecretsResponse2) {
      ListSecretsResponse2.filterSensitiveLog = (obj) => ({
        ...obj
      });
    })(ListSecretsResponse = exports.ListSecretsResponse || (exports.ListSecretsResponse = {}));
    var ListSecretVersionIdsRequest;
    (function(ListSecretVersionIdsRequest2) {
      ListSecretVersionIdsRequest2.filterSensitiveLog = (obj) => ({
        ...obj
      });
    })(ListSecretVersionIdsRequest = exports.ListSecretVersionIdsRequest || (exports.ListSecretVersionIdsRequest = {}));
    var SecretVersionsListEntry;
    (function(SecretVersionsListEntry2) {
      SecretVersionsListEntry2.filterSensitiveLog = (obj) => ({
        ...obj
      });
    })(SecretVersionsListEntry = exports.SecretVersionsListEntry || (exports.SecretVersionsListEntry = {}));
    var ListSecretVersionIdsResponse;
    (function(ListSecretVersionIdsResponse2) {
      ListSecretVersionIdsResponse2.filterSensitiveLog = (obj) => ({
        ...obj
      });
    })(ListSecretVersionIdsResponse = exports.ListSecretVersionIdsResponse || (exports.ListSecretVersionIdsResponse = {}));
    var PublicPolicyException = class extends SecretsManagerServiceException_1.SecretsManagerServiceException {
      constructor(opts) {
        super({
          name: "PublicPolicyException",
          $fault: "client",
          ...opts
        });
        this.name = "PublicPolicyException";
        this.$fault = "client";
        Object.setPrototypeOf(this, PublicPolicyException.prototype);
        this.Message = opts.Message;
      }
    };
    exports.PublicPolicyException = PublicPolicyException;
    var PutResourcePolicyRequest;
    (function(PutResourcePolicyRequest2) {
      PutResourcePolicyRequest2.filterSensitiveLog = (obj) => ({
        ...obj
      });
    })(PutResourcePolicyRequest = exports.PutResourcePolicyRequest || (exports.PutResourcePolicyRequest = {}));
    var PutResourcePolicyResponse;
    (function(PutResourcePolicyResponse2) {
      PutResourcePolicyResponse2.filterSensitiveLog = (obj) => ({
        ...obj
      });
    })(PutResourcePolicyResponse = exports.PutResourcePolicyResponse || (exports.PutResourcePolicyResponse = {}));
    var PutSecretValueRequest;
    (function(PutSecretValueRequest2) {
      PutSecretValueRequest2.filterSensitiveLog = (obj) => ({
        ...obj,
        ...obj.SecretBinary && { SecretBinary: smithy_client_1.SENSITIVE_STRING },
        ...obj.SecretString && { SecretString: smithy_client_1.SENSITIVE_STRING }
      });
    })(PutSecretValueRequest = exports.PutSecretValueRequest || (exports.PutSecretValueRequest = {}));
    var PutSecretValueResponse;
    (function(PutSecretValueResponse2) {
      PutSecretValueResponse2.filterSensitiveLog = (obj) => ({
        ...obj
      });
    })(PutSecretValueResponse = exports.PutSecretValueResponse || (exports.PutSecretValueResponse = {}));
    var RemoveRegionsFromReplicationRequest;
    (function(RemoveRegionsFromReplicationRequest2) {
      RemoveRegionsFromReplicationRequest2.filterSensitiveLog = (obj) => ({
        ...obj
      });
    })(RemoveRegionsFromReplicationRequest = exports.RemoveRegionsFromReplicationRequest || (exports.RemoveRegionsFromReplicationRequest = {}));
    var RemoveRegionsFromReplicationResponse;
    (function(RemoveRegionsFromReplicationResponse2) {
      RemoveRegionsFromReplicationResponse2.filterSensitiveLog = (obj) => ({
        ...obj
      });
    })(RemoveRegionsFromReplicationResponse = exports.RemoveRegionsFromReplicationResponse || (exports.RemoveRegionsFromReplicationResponse = {}));
    var ReplicateSecretToRegionsRequest;
    (function(ReplicateSecretToRegionsRequest2) {
      ReplicateSecretToRegionsRequest2.filterSensitiveLog = (obj) => ({
        ...obj
      });
    })(ReplicateSecretToRegionsRequest = exports.ReplicateSecretToRegionsRequest || (exports.ReplicateSecretToRegionsRequest = {}));
    var ReplicateSecretToRegionsResponse;
    (function(ReplicateSecretToRegionsResponse2) {
      ReplicateSecretToRegionsResponse2.filterSensitiveLog = (obj) => ({
        ...obj
      });
    })(ReplicateSecretToRegionsResponse = exports.ReplicateSecretToRegionsResponse || (exports.ReplicateSecretToRegionsResponse = {}));
    var RestoreSecretRequest;
    (function(RestoreSecretRequest2) {
      RestoreSecretRequest2.filterSensitiveLog = (obj) => ({
        ...obj
      });
    })(RestoreSecretRequest = exports.RestoreSecretRequest || (exports.RestoreSecretRequest = {}));
    var RestoreSecretResponse;
    (function(RestoreSecretResponse2) {
      RestoreSecretResponse2.filterSensitiveLog = (obj) => ({
        ...obj
      });
    })(RestoreSecretResponse = exports.RestoreSecretResponse || (exports.RestoreSecretResponse = {}));
    var RotateSecretRequest;
    (function(RotateSecretRequest2) {
      RotateSecretRequest2.filterSensitiveLog = (obj) => ({
        ...obj
      });
    })(RotateSecretRequest = exports.RotateSecretRequest || (exports.RotateSecretRequest = {}));
    var RotateSecretResponse;
    (function(RotateSecretResponse2) {
      RotateSecretResponse2.filterSensitiveLog = (obj) => ({
        ...obj
      });
    })(RotateSecretResponse = exports.RotateSecretResponse || (exports.RotateSecretResponse = {}));
    var StopReplicationToReplicaRequest;
    (function(StopReplicationToReplicaRequest2) {
      StopReplicationToReplicaRequest2.filterSensitiveLog = (obj) => ({
        ...obj
      });
    })(StopReplicationToReplicaRequest = exports.StopReplicationToReplicaRequest || (exports.StopReplicationToReplicaRequest = {}));
    var StopReplicationToReplicaResponse;
    (function(StopReplicationToReplicaResponse2) {
      StopReplicationToReplicaResponse2.filterSensitiveLog = (obj) => ({
        ...obj
      });
    })(StopReplicationToReplicaResponse = exports.StopReplicationToReplicaResponse || (exports.StopReplicationToReplicaResponse = {}));
    var TagResourceRequest;
    (function(TagResourceRequest2) {
      TagResourceRequest2.filterSensitiveLog = (obj) => ({
        ...obj
      });
    })(TagResourceRequest = exports.TagResourceRequest || (exports.TagResourceRequest = {}));
    var UntagResourceRequest;
    (function(UntagResourceRequest2) {
      UntagResourceRequest2.filterSensitiveLog = (obj) => ({
        ...obj
      });
    })(UntagResourceRequest = exports.UntagResourceRequest || (exports.UntagResourceRequest = {}));
    var UpdateSecretRequest;
    (function(UpdateSecretRequest2) {
      UpdateSecretRequest2.filterSensitiveLog = (obj) => ({
        ...obj,
        ...obj.SecretBinary && { SecretBinary: smithy_client_1.SENSITIVE_STRING },
        ...obj.SecretString && { SecretString: smithy_client_1.SENSITIVE_STRING }
      });
    })(UpdateSecretRequest = exports.UpdateSecretRequest || (exports.UpdateSecretRequest = {}));
    var UpdateSecretResponse;
    (function(UpdateSecretResponse2) {
      UpdateSecretResponse2.filterSensitiveLog = (obj) => ({
        ...obj
      });
    })(UpdateSecretResponse = exports.UpdateSecretResponse || (exports.UpdateSecretResponse = {}));
    var UpdateSecretVersionStageRequest;
    (function(UpdateSecretVersionStageRequest2) {
      UpdateSecretVersionStageRequest2.filterSensitiveLog = (obj) => ({
        ...obj
      });
    })(UpdateSecretVersionStageRequest = exports.UpdateSecretVersionStageRequest || (exports.UpdateSecretVersionStageRequest = {}));
    var UpdateSecretVersionStageResponse;
    (function(UpdateSecretVersionStageResponse2) {
      UpdateSecretVersionStageResponse2.filterSensitiveLog = (obj) => ({
        ...obj
      });
    })(UpdateSecretVersionStageResponse = exports.UpdateSecretVersionStageResponse || (exports.UpdateSecretVersionStageResponse = {}));
    var ValidateResourcePolicyRequest;
    (function(ValidateResourcePolicyRequest2) {
      ValidateResourcePolicyRequest2.filterSensitiveLog = (obj) => ({
        ...obj
      });
    })(ValidateResourcePolicyRequest = exports.ValidateResourcePolicyRequest || (exports.ValidateResourcePolicyRequest = {}));
    var ValidationErrorsEntry;
    (function(ValidationErrorsEntry2) {
      ValidationErrorsEntry2.filterSensitiveLog = (obj) => ({
        ...obj
      });
    })(ValidationErrorsEntry = exports.ValidationErrorsEntry || (exports.ValidationErrorsEntry = {}));
    var ValidateResourcePolicyResponse;
    (function(ValidateResourcePolicyResponse2) {
      ValidateResourcePolicyResponse2.filterSensitiveLog = (obj) => ({
        ...obj
      });
    })(ValidateResourcePolicyResponse = exports.ValidateResourcePolicyResponse || (exports.ValidateResourcePolicyResponse = {}));
  }
});

// node_modules/@aws-sdk/protocol-http/dist-cjs/httpHandler.js
var require_httpHandler = __commonJS({
  "node_modules/@aws-sdk/protocol-http/dist-cjs/httpHandler.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/@aws-sdk/protocol-http/dist-cjs/httpRequest.js
var require_httpRequest = __commonJS({
  "node_modules/@aws-sdk/protocol-http/dist-cjs/httpRequest.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HttpRequest = void 0;
    var HttpRequest = class {
      constructor(options) {
        this.method = options.method || "GET";
        this.hostname = options.hostname || "localhost";
        this.port = options.port;
        this.query = options.query || {};
        this.headers = options.headers || {};
        this.body = options.body;
        this.protocol = options.protocol ? options.protocol.slice(-1) !== ":" ? `${options.protocol}:` : options.protocol : "https:";
        this.path = options.path ? options.path.charAt(0) !== "/" ? `/${options.path}` : options.path : "/";
      }
      static isInstance(request) {
        if (!request)
          return false;
        const req = request;
        return "method" in req && "protocol" in req && "hostname" in req && "path" in req && typeof req["query"] === "object" && typeof req["headers"] === "object";
      }
      clone() {
        const cloned = new HttpRequest({
          ...this,
          headers: { ...this.headers }
        });
        if (cloned.query)
          cloned.query = cloneQuery(cloned.query);
        return cloned;
      }
    };
    exports.HttpRequest = HttpRequest;
    function cloneQuery(query) {
      return Object.keys(query).reduce((carry, paramName) => {
        const param = query[paramName];
        return {
          ...carry,
          [paramName]: Array.isArray(param) ? [...param] : param
        };
      }, {});
    }
  }
});

// node_modules/@aws-sdk/protocol-http/dist-cjs/httpResponse.js
var require_httpResponse = __commonJS({
  "node_modules/@aws-sdk/protocol-http/dist-cjs/httpResponse.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HttpResponse = void 0;
    var HttpResponse = class {
      constructor(options) {
        this.statusCode = options.statusCode;
        this.headers = options.headers || {};
        this.body = options.body;
      }
      static isInstance(response) {
        if (!response)
          return false;
        const resp = response;
        return typeof resp.statusCode === "number" && typeof resp.headers === "object";
      }
    };
    exports.HttpResponse = HttpResponse;
  }
});

// node_modules/@aws-sdk/protocol-http/dist-cjs/isValidHostname.js
var require_isValidHostname = __commonJS({
  "node_modules/@aws-sdk/protocol-http/dist-cjs/isValidHostname.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isValidHostname = void 0;
    function isValidHostname(hostname) {
      const hostPattern = /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/;
      return hostPattern.test(hostname);
    }
    exports.isValidHostname = isValidHostname;
  }
});

// node_modules/@aws-sdk/protocol-http/dist-cjs/index.js
var require_dist_cjs4 = __commonJS({
  "node_modules/@aws-sdk/protocol-http/dist-cjs/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require_tslib();
    tslib_1.__exportStar(require_httpHandler(), exports);
    tslib_1.__exportStar(require_httpRequest(), exports);
    tslib_1.__exportStar(require_httpResponse(), exports);
    tslib_1.__exportStar(require_isValidHostname(), exports);
  }
});

// node_modules/@aws-sdk/client-secrets-manager/node_modules/uuid/dist/rng.js
var require_rng = __commonJS({
  "node_modules/@aws-sdk/client-secrets-manager/node_modules/uuid/dist/rng.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = rng;
    var _crypto = _interopRequireDefault(require("crypto"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    var rnds8Pool = new Uint8Array(256);
    var poolPtr = rnds8Pool.length;
    function rng() {
      if (poolPtr > rnds8Pool.length - 16) {
        _crypto.default.randomFillSync(rnds8Pool);
        poolPtr = 0;
      }
      return rnds8Pool.slice(poolPtr, poolPtr += 16);
    }
  }
});

// node_modules/@aws-sdk/client-secrets-manager/node_modules/uuid/dist/regex.js
var require_regex = __commonJS({
  "node_modules/@aws-sdk/client-secrets-manager/node_modules/uuid/dist/regex.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var _default = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
    exports.default = _default;
  }
});

// node_modules/@aws-sdk/client-secrets-manager/node_modules/uuid/dist/validate.js
var require_validate = __commonJS({
  "node_modules/@aws-sdk/client-secrets-manager/node_modules/uuid/dist/validate.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var _regex = _interopRequireDefault(require_regex());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    function validate(uuid) {
      return typeof uuid === "string" && _regex.default.test(uuid);
    }
    var _default = validate;
    exports.default = _default;
  }
});

// node_modules/@aws-sdk/client-secrets-manager/node_modules/uuid/dist/stringify.js
var require_stringify = __commonJS({
  "node_modules/@aws-sdk/client-secrets-manager/node_modules/uuid/dist/stringify.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var _validate = _interopRequireDefault(require_validate());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    var byteToHex = [];
    for (let i2 = 0; i2 < 256; ++i2) {
      byteToHex.push((i2 + 256).toString(16).substr(1));
    }
    function stringify(arr, offset = 0) {
      const uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
      if (!(0, _validate.default)(uuid)) {
        throw TypeError("Stringified UUID is invalid");
      }
      return uuid;
    }
    var _default = stringify;
    exports.default = _default;
  }
});

// node_modules/@aws-sdk/client-secrets-manager/node_modules/uuid/dist/v1.js
var require_v1 = __commonJS({
  "node_modules/@aws-sdk/client-secrets-manager/node_modules/uuid/dist/v1.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var _rng = _interopRequireDefault(require_rng());
    var _stringify = _interopRequireDefault(require_stringify());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    var _nodeId;
    var _clockseq;
    var _lastMSecs = 0;
    var _lastNSecs = 0;
    function v1(options, buf, offset) {
      let i2 = buf && offset || 0;
      const b = buf || new Array(16);
      options = options || {};
      let node = options.node || _nodeId;
      let clockseq = options.clockseq !== void 0 ? options.clockseq : _clockseq;
      if (node == null || clockseq == null) {
        const seedBytes = options.random || (options.rng || _rng.default)();
        if (node == null) {
          node = _nodeId = [seedBytes[0] | 1, seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];
        }
        if (clockseq == null) {
          clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 16383;
        }
      }
      let msecs = options.msecs !== void 0 ? options.msecs : Date.now();
      let nsecs = options.nsecs !== void 0 ? options.nsecs : _lastNSecs + 1;
      const dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 1e4;
      if (dt < 0 && options.clockseq === void 0) {
        clockseq = clockseq + 1 & 16383;
      }
      if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === void 0) {
        nsecs = 0;
      }
      if (nsecs >= 1e4) {
        throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
      }
      _lastMSecs = msecs;
      _lastNSecs = nsecs;
      _clockseq = clockseq;
      msecs += 122192928e5;
      const tl = ((msecs & 268435455) * 1e4 + nsecs) % 4294967296;
      b[i2++] = tl >>> 24 & 255;
      b[i2++] = tl >>> 16 & 255;
      b[i2++] = tl >>> 8 & 255;
      b[i2++] = tl & 255;
      const tmh = msecs / 4294967296 * 1e4 & 268435455;
      b[i2++] = tmh >>> 8 & 255;
      b[i2++] = tmh & 255;
      b[i2++] = tmh >>> 24 & 15 | 16;
      b[i2++] = tmh >>> 16 & 255;
      b[i2++] = clockseq >>> 8 | 128;
      b[i2++] = clockseq & 255;
      for (let n = 0; n < 6; ++n) {
        b[i2 + n] = node[n];
      }
      return buf || (0, _stringify.default)(b);
    }
    var _default = v1;
    exports.default = _default;
  }
});

// node_modules/@aws-sdk/client-secrets-manager/node_modules/uuid/dist/parse.js
var require_parse = __commonJS({
  "node_modules/@aws-sdk/client-secrets-manager/node_modules/uuid/dist/parse.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var _validate = _interopRequireDefault(require_validate());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    function parse(uuid) {
      if (!(0, _validate.default)(uuid)) {
        throw TypeError("Invalid UUID");
      }
      let v;
      const arr = new Uint8Array(16);
      arr[0] = (v = parseInt(uuid.slice(0, 8), 16)) >>> 24;
      arr[1] = v >>> 16 & 255;
      arr[2] = v >>> 8 & 255;
      arr[3] = v & 255;
      arr[4] = (v = parseInt(uuid.slice(9, 13), 16)) >>> 8;
      arr[5] = v & 255;
      arr[6] = (v = parseInt(uuid.slice(14, 18), 16)) >>> 8;
      arr[7] = v & 255;
      arr[8] = (v = parseInt(uuid.slice(19, 23), 16)) >>> 8;
      arr[9] = v & 255;
      arr[10] = (v = parseInt(uuid.slice(24, 36), 16)) / 1099511627776 & 255;
      arr[11] = v / 4294967296 & 255;
      arr[12] = v >>> 24 & 255;
      arr[13] = v >>> 16 & 255;
      arr[14] = v >>> 8 & 255;
      arr[15] = v & 255;
      return arr;
    }
    var _default = parse;
    exports.default = _default;
  }
});

// node_modules/@aws-sdk/client-secrets-manager/node_modules/uuid/dist/v35.js
var require_v35 = __commonJS({
  "node_modules/@aws-sdk/client-secrets-manager/node_modules/uuid/dist/v35.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = _default;
    exports.URL = exports.DNS = void 0;
    var _stringify = _interopRequireDefault(require_stringify());
    var _parse = _interopRequireDefault(require_parse());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    function stringToBytes(str) {
      str = unescape(encodeURIComponent(str));
      const bytes = [];
      for (let i2 = 0; i2 < str.length; ++i2) {
        bytes.push(str.charCodeAt(i2));
      }
      return bytes;
    }
    var DNS = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";
    exports.DNS = DNS;
    var URL2 = "6ba7b811-9dad-11d1-80b4-00c04fd430c8";
    exports.URL = URL2;
    function _default(name, version, hashfunc) {
      function generateUUID(value, namespace, buf, offset) {
        if (typeof value === "string") {
          value = stringToBytes(value);
        }
        if (typeof namespace === "string") {
          namespace = (0, _parse.default)(namespace);
        }
        if (namespace.length !== 16) {
          throw TypeError("Namespace must be array-like (16 iterable integer values, 0-255)");
        }
        let bytes = new Uint8Array(16 + value.length);
        bytes.set(namespace);
        bytes.set(value, namespace.length);
        bytes = hashfunc(bytes);
        bytes[6] = bytes[6] & 15 | version;
        bytes[8] = bytes[8] & 63 | 128;
        if (buf) {
          offset = offset || 0;
          for (let i2 = 0; i2 < 16; ++i2) {
            buf[offset + i2] = bytes[i2];
          }
          return buf;
        }
        return (0, _stringify.default)(bytes);
      }
      try {
        generateUUID.name = name;
      } catch (err) {
      }
      generateUUID.DNS = DNS;
      generateUUID.URL = URL2;
      return generateUUID;
    }
  }
});

// node_modules/@aws-sdk/client-secrets-manager/node_modules/uuid/dist/md5.js
var require_md5 = __commonJS({
  "node_modules/@aws-sdk/client-secrets-manager/node_modules/uuid/dist/md5.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var _crypto = _interopRequireDefault(require("crypto"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    function md5(bytes) {
      if (Array.isArray(bytes)) {
        bytes = Buffer.from(bytes);
      } else if (typeof bytes === "string") {
        bytes = Buffer.from(bytes, "utf8");
      }
      return _crypto.default.createHash("md5").update(bytes).digest();
    }
    var _default = md5;
    exports.default = _default;
  }
});

// node_modules/@aws-sdk/client-secrets-manager/node_modules/uuid/dist/v3.js
var require_v3 = __commonJS({
  "node_modules/@aws-sdk/client-secrets-manager/node_modules/uuid/dist/v3.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var _v = _interopRequireDefault(require_v35());
    var _md = _interopRequireDefault(require_md5());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    var v3 = (0, _v.default)("v3", 48, _md.default);
    var _default = v3;
    exports.default = _default;
  }
});

// node_modules/@aws-sdk/client-secrets-manager/node_modules/uuid/dist/v4.js
var require_v4 = __commonJS({
  "node_modules/@aws-sdk/client-secrets-manager/node_modules/uuid/dist/v4.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var _rng = _interopRequireDefault(require_rng());
    var _stringify = _interopRequireDefault(require_stringify());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    function v4(options, buf, offset) {
      options = options || {};
      const rnds = options.random || (options.rng || _rng.default)();
      rnds[6] = rnds[6] & 15 | 64;
      rnds[8] = rnds[8] & 63 | 128;
      if (buf) {
        offset = offset || 0;
        for (let i2 = 0; i2 < 16; ++i2) {
          buf[offset + i2] = rnds[i2];
        }
        return buf;
      }
      return (0, _stringify.default)(rnds);
    }
    var _default = v4;
    exports.default = _default;
  }
});

// node_modules/@aws-sdk/client-secrets-manager/node_modules/uuid/dist/sha1.js
var require_sha1 = __commonJS({
  "node_modules/@aws-sdk/client-secrets-manager/node_modules/uuid/dist/sha1.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var _crypto = _interopRequireDefault(require("crypto"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    function sha1(bytes) {
      if (Array.isArray(bytes)) {
        bytes = Buffer.from(bytes);
      } else if (typeof bytes === "string") {
        bytes = Buffer.from(bytes, "utf8");
      }
      return _crypto.default.createHash("sha1").update(bytes).digest();
    }
    var _default = sha1;
    exports.default = _default;
  }
});

// node_modules/@aws-sdk/client-secrets-manager/node_modules/uuid/dist/v5.js
var require_v5 = __commonJS({
  "node_modules/@aws-sdk/client-secrets-manager/node_modules/uuid/dist/v5.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var _v = _interopRequireDefault(require_v35());
    var _sha = _interopRequireDefault(require_sha1());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    var v5 = (0, _v.default)("v5", 80, _sha.default);
    var _default = v5;
    exports.default = _default;
  }
});

// node_modules/@aws-sdk/client-secrets-manager/node_modules/uuid/dist/nil.js
var require_nil = __commonJS({
  "node_modules/@aws-sdk/client-secrets-manager/node_modules/uuid/dist/nil.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var _default = "00000000-0000-0000-0000-000000000000";
    exports.default = _default;
  }
});

// node_modules/@aws-sdk/client-secrets-manager/node_modules/uuid/dist/version.js
var require_version = __commonJS({
  "node_modules/@aws-sdk/client-secrets-manager/node_modules/uuid/dist/version.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var _validate = _interopRequireDefault(require_validate());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    function version(uuid) {
      if (!(0, _validate.default)(uuid)) {
        throw TypeError("Invalid UUID");
      }
      return parseInt(uuid.substr(14, 1), 16);
    }
    var _default = version;
    exports.default = _default;
  }
});

// node_modules/@aws-sdk/client-secrets-manager/node_modules/uuid/dist/index.js
var require_dist = __commonJS({
  "node_modules/@aws-sdk/client-secrets-manager/node_modules/uuid/dist/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    Object.defineProperty(exports, "v1", {
      enumerable: true,
      get: function() {
        return _v.default;
      }
    });
    Object.defineProperty(exports, "v3", {
      enumerable: true,
      get: function() {
        return _v2.default;
      }
    });
    Object.defineProperty(exports, "v4", {
      enumerable: true,
      get: function() {
        return _v3.default;
      }
    });
    Object.defineProperty(exports, "v5", {
      enumerable: true,
      get: function() {
        return _v4.default;
      }
    });
    Object.defineProperty(exports, "NIL", {
      enumerable: true,
      get: function() {
        return _nil.default;
      }
    });
    Object.defineProperty(exports, "version", {
      enumerable: true,
      get: function() {
        return _version.default;
      }
    });
    Object.defineProperty(exports, "validate", {
      enumerable: true,
      get: function() {
        return _validate.default;
      }
    });
    Object.defineProperty(exports, "stringify", {
      enumerable: true,
      get: function() {
        return _stringify.default;
      }
    });
    Object.defineProperty(exports, "parse", {
      enumerable: true,
      get: function() {
        return _parse.default;
      }
    });
    var _v = _interopRequireDefault(require_v1());
    var _v2 = _interopRequireDefault(require_v3());
    var _v3 = _interopRequireDefault(require_v4());
    var _v4 = _interopRequireDefault(require_v5());
    var _nil = _interopRequireDefault(require_nil());
    var _version = _interopRequireDefault(require_version());
    var _validate = _interopRequireDefault(require_validate());
    var _stringify = _interopRequireDefault(require_stringify());
    var _parse = _interopRequireDefault(require_parse());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
  }
});

// node_modules/@aws-sdk/client-secrets-manager/dist-cjs/protocols/Aws_json1_1.js
var require_Aws_json1_1 = __commonJS({
  "node_modules/@aws-sdk/client-secrets-manager/dist-cjs/protocols/Aws_json1_1.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.deserializeAws_json1_1ValidateResourcePolicyCommand = exports.deserializeAws_json1_1UpdateSecretVersionStageCommand = exports.deserializeAws_json1_1UpdateSecretCommand = exports.deserializeAws_json1_1UntagResourceCommand = exports.deserializeAws_json1_1TagResourceCommand = exports.deserializeAws_json1_1StopReplicationToReplicaCommand = exports.deserializeAws_json1_1RotateSecretCommand = exports.deserializeAws_json1_1RestoreSecretCommand = exports.deserializeAws_json1_1ReplicateSecretToRegionsCommand = exports.deserializeAws_json1_1RemoveRegionsFromReplicationCommand = exports.deserializeAws_json1_1PutSecretValueCommand = exports.deserializeAws_json1_1PutResourcePolicyCommand = exports.deserializeAws_json1_1ListSecretVersionIdsCommand = exports.deserializeAws_json1_1ListSecretsCommand = exports.deserializeAws_json1_1GetSecretValueCommand = exports.deserializeAws_json1_1GetResourcePolicyCommand = exports.deserializeAws_json1_1GetRandomPasswordCommand = exports.deserializeAws_json1_1DescribeSecretCommand = exports.deserializeAws_json1_1DeleteSecretCommand = exports.deserializeAws_json1_1DeleteResourcePolicyCommand = exports.deserializeAws_json1_1CreateSecretCommand = exports.deserializeAws_json1_1CancelRotateSecretCommand = exports.serializeAws_json1_1ValidateResourcePolicyCommand = exports.serializeAws_json1_1UpdateSecretVersionStageCommand = exports.serializeAws_json1_1UpdateSecretCommand = exports.serializeAws_json1_1UntagResourceCommand = exports.serializeAws_json1_1TagResourceCommand = exports.serializeAws_json1_1StopReplicationToReplicaCommand = exports.serializeAws_json1_1RotateSecretCommand = exports.serializeAws_json1_1RestoreSecretCommand = exports.serializeAws_json1_1ReplicateSecretToRegionsCommand = exports.serializeAws_json1_1RemoveRegionsFromReplicationCommand = exports.serializeAws_json1_1PutSecretValueCommand = exports.serializeAws_json1_1PutResourcePolicyCommand = exports.serializeAws_json1_1ListSecretVersionIdsCommand = exports.serializeAws_json1_1ListSecretsCommand = exports.serializeAws_json1_1GetSecretValueCommand = exports.serializeAws_json1_1GetResourcePolicyCommand = exports.serializeAws_json1_1GetRandomPasswordCommand = exports.serializeAws_json1_1DescribeSecretCommand = exports.serializeAws_json1_1DeleteSecretCommand = exports.serializeAws_json1_1DeleteResourcePolicyCommand = exports.serializeAws_json1_1CreateSecretCommand = exports.serializeAws_json1_1CancelRotateSecretCommand = void 0;
    var protocol_http_1 = require_dist_cjs4();
    var smithy_client_1 = require_dist_cjs3();
    var uuid_1 = require_dist();
    var models_0_1 = require_models_0();
    var SecretsManagerServiceException_1 = require_SecretsManagerServiceException();
    var serializeAws_json1_1CancelRotateSecretCommand = async (input, context) => {
      const headers = {
        "content-type": "application/x-amz-json-1.1",
        "x-amz-target": "secretsmanager.CancelRotateSecret"
      };
      let body;
      body = JSON.stringify(serializeAws_json1_1CancelRotateSecretRequest(input, context));
      return buildHttpRpcRequest(context, headers, "/", void 0, body);
    };
    exports.serializeAws_json1_1CancelRotateSecretCommand = serializeAws_json1_1CancelRotateSecretCommand;
    var serializeAws_json1_1CreateSecretCommand = async (input, context) => {
      const headers = {
        "content-type": "application/x-amz-json-1.1",
        "x-amz-target": "secretsmanager.CreateSecret"
      };
      let body;
      body = JSON.stringify(serializeAws_json1_1CreateSecretRequest(input, context));
      return buildHttpRpcRequest(context, headers, "/", void 0, body);
    };
    exports.serializeAws_json1_1CreateSecretCommand = serializeAws_json1_1CreateSecretCommand;
    var serializeAws_json1_1DeleteResourcePolicyCommand = async (input, context) => {
      const headers = {
        "content-type": "application/x-amz-json-1.1",
        "x-amz-target": "secretsmanager.DeleteResourcePolicy"
      };
      let body;
      body = JSON.stringify(serializeAws_json1_1DeleteResourcePolicyRequest(input, context));
      return buildHttpRpcRequest(context, headers, "/", void 0, body);
    };
    exports.serializeAws_json1_1DeleteResourcePolicyCommand = serializeAws_json1_1DeleteResourcePolicyCommand;
    var serializeAws_json1_1DeleteSecretCommand = async (input, context) => {
      const headers = {
        "content-type": "application/x-amz-json-1.1",
        "x-amz-target": "secretsmanager.DeleteSecret"
      };
      let body;
      body = JSON.stringify(serializeAws_json1_1DeleteSecretRequest(input, context));
      return buildHttpRpcRequest(context, headers, "/", void 0, body);
    };
    exports.serializeAws_json1_1DeleteSecretCommand = serializeAws_json1_1DeleteSecretCommand;
    var serializeAws_json1_1DescribeSecretCommand = async (input, context) => {
      const headers = {
        "content-type": "application/x-amz-json-1.1",
        "x-amz-target": "secretsmanager.DescribeSecret"
      };
      let body;
      body = JSON.stringify(serializeAws_json1_1DescribeSecretRequest(input, context));
      return buildHttpRpcRequest(context, headers, "/", void 0, body);
    };
    exports.serializeAws_json1_1DescribeSecretCommand = serializeAws_json1_1DescribeSecretCommand;
    var serializeAws_json1_1GetRandomPasswordCommand = async (input, context) => {
      const headers = {
        "content-type": "application/x-amz-json-1.1",
        "x-amz-target": "secretsmanager.GetRandomPassword"
      };
      let body;
      body = JSON.stringify(serializeAws_json1_1GetRandomPasswordRequest(input, context));
      return buildHttpRpcRequest(context, headers, "/", void 0, body);
    };
    exports.serializeAws_json1_1GetRandomPasswordCommand = serializeAws_json1_1GetRandomPasswordCommand;
    var serializeAws_json1_1GetResourcePolicyCommand = async (input, context) => {
      const headers = {
        "content-type": "application/x-amz-json-1.1",
        "x-amz-target": "secretsmanager.GetResourcePolicy"
      };
      let body;
      body = JSON.stringify(serializeAws_json1_1GetResourcePolicyRequest(input, context));
      return buildHttpRpcRequest(context, headers, "/", void 0, body);
    };
    exports.serializeAws_json1_1GetResourcePolicyCommand = serializeAws_json1_1GetResourcePolicyCommand;
    var serializeAws_json1_1GetSecretValueCommand = async (input, context) => {
      const headers = {
        "content-type": "application/x-amz-json-1.1",
        "x-amz-target": "secretsmanager.GetSecretValue"
      };
      let body;
      body = JSON.stringify(serializeAws_json1_1GetSecretValueRequest(input, context));
      return buildHttpRpcRequest(context, headers, "/", void 0, body);
    };
    exports.serializeAws_json1_1GetSecretValueCommand = serializeAws_json1_1GetSecretValueCommand;
    var serializeAws_json1_1ListSecretsCommand = async (input, context) => {
      const headers = {
        "content-type": "application/x-amz-json-1.1",
        "x-amz-target": "secretsmanager.ListSecrets"
      };
      let body;
      body = JSON.stringify(serializeAws_json1_1ListSecretsRequest(input, context));
      return buildHttpRpcRequest(context, headers, "/", void 0, body);
    };
    exports.serializeAws_json1_1ListSecretsCommand = serializeAws_json1_1ListSecretsCommand;
    var serializeAws_json1_1ListSecretVersionIdsCommand = async (input, context) => {
      const headers = {
        "content-type": "application/x-amz-json-1.1",
        "x-amz-target": "secretsmanager.ListSecretVersionIds"
      };
      let body;
      body = JSON.stringify(serializeAws_json1_1ListSecretVersionIdsRequest(input, context));
      return buildHttpRpcRequest(context, headers, "/", void 0, body);
    };
    exports.serializeAws_json1_1ListSecretVersionIdsCommand = serializeAws_json1_1ListSecretVersionIdsCommand;
    var serializeAws_json1_1PutResourcePolicyCommand = async (input, context) => {
      const headers = {
        "content-type": "application/x-amz-json-1.1",
        "x-amz-target": "secretsmanager.PutResourcePolicy"
      };
      let body;
      body = JSON.stringify(serializeAws_json1_1PutResourcePolicyRequest(input, context));
      return buildHttpRpcRequest(context, headers, "/", void 0, body);
    };
    exports.serializeAws_json1_1PutResourcePolicyCommand = serializeAws_json1_1PutResourcePolicyCommand;
    var serializeAws_json1_1PutSecretValueCommand = async (input, context) => {
      const headers = {
        "content-type": "application/x-amz-json-1.1",
        "x-amz-target": "secretsmanager.PutSecretValue"
      };
      let body;
      body = JSON.stringify(serializeAws_json1_1PutSecretValueRequest(input, context));
      return buildHttpRpcRequest(context, headers, "/", void 0, body);
    };
    exports.serializeAws_json1_1PutSecretValueCommand = serializeAws_json1_1PutSecretValueCommand;
    var serializeAws_json1_1RemoveRegionsFromReplicationCommand = async (input, context) => {
      const headers = {
        "content-type": "application/x-amz-json-1.1",
        "x-amz-target": "secretsmanager.RemoveRegionsFromReplication"
      };
      let body;
      body = JSON.stringify(serializeAws_json1_1RemoveRegionsFromReplicationRequest(input, context));
      return buildHttpRpcRequest(context, headers, "/", void 0, body);
    };
    exports.serializeAws_json1_1RemoveRegionsFromReplicationCommand = serializeAws_json1_1RemoveRegionsFromReplicationCommand;
    var serializeAws_json1_1ReplicateSecretToRegionsCommand = async (input, context) => {
      const headers = {
        "content-type": "application/x-amz-json-1.1",
        "x-amz-target": "secretsmanager.ReplicateSecretToRegions"
      };
      let body;
      body = JSON.stringify(serializeAws_json1_1ReplicateSecretToRegionsRequest(input, context));
      return buildHttpRpcRequest(context, headers, "/", void 0, body);
    };
    exports.serializeAws_json1_1ReplicateSecretToRegionsCommand = serializeAws_json1_1ReplicateSecretToRegionsCommand;
    var serializeAws_json1_1RestoreSecretCommand = async (input, context) => {
      const headers = {
        "content-type": "application/x-amz-json-1.1",
        "x-amz-target": "secretsmanager.RestoreSecret"
      };
      let body;
      body = JSON.stringify(serializeAws_json1_1RestoreSecretRequest(input, context));
      return buildHttpRpcRequest(context, headers, "/", void 0, body);
    };
    exports.serializeAws_json1_1RestoreSecretCommand = serializeAws_json1_1RestoreSecretCommand;
    var serializeAws_json1_1RotateSecretCommand = async (input, context) => {
      const headers = {
        "content-type": "application/x-amz-json-1.1",
        "x-amz-target": "secretsmanager.RotateSecret"
      };
      let body;
      body = JSON.stringify(serializeAws_json1_1RotateSecretRequest(input, context));
      return buildHttpRpcRequest(context, headers, "/", void 0, body);
    };
    exports.serializeAws_json1_1RotateSecretCommand = serializeAws_json1_1RotateSecretCommand;
    var serializeAws_json1_1StopReplicationToReplicaCommand = async (input, context) => {
      const headers = {
        "content-type": "application/x-amz-json-1.1",
        "x-amz-target": "secretsmanager.StopReplicationToReplica"
      };
      let body;
      body = JSON.stringify(serializeAws_json1_1StopReplicationToReplicaRequest(input, context));
      return buildHttpRpcRequest(context, headers, "/", void 0, body);
    };
    exports.serializeAws_json1_1StopReplicationToReplicaCommand = serializeAws_json1_1StopReplicationToReplicaCommand;
    var serializeAws_json1_1TagResourceCommand = async (input, context) => {
      const headers = {
        "content-type": "application/x-amz-json-1.1",
        "x-amz-target": "secretsmanager.TagResource"
      };
      let body;
      body = JSON.stringify(serializeAws_json1_1TagResourceRequest(input, context));
      return buildHttpRpcRequest(context, headers, "/", void 0, body);
    };
    exports.serializeAws_json1_1TagResourceCommand = serializeAws_json1_1TagResourceCommand;
    var serializeAws_json1_1UntagResourceCommand = async (input, context) => {
      const headers = {
        "content-type": "application/x-amz-json-1.1",
        "x-amz-target": "secretsmanager.UntagResource"
      };
      let body;
      body = JSON.stringify(serializeAws_json1_1UntagResourceRequest(input, context));
      return buildHttpRpcRequest(context, headers, "/", void 0, body);
    };
    exports.serializeAws_json1_1UntagResourceCommand = serializeAws_json1_1UntagResourceCommand;
    var serializeAws_json1_1UpdateSecretCommand = async (input, context) => {
      const headers = {
        "content-type": "application/x-amz-json-1.1",
        "x-amz-target": "secretsmanager.UpdateSecret"
      };
      let body;
      body = JSON.stringify(serializeAws_json1_1UpdateSecretRequest(input, context));
      return buildHttpRpcRequest(context, headers, "/", void 0, body);
    };
    exports.serializeAws_json1_1UpdateSecretCommand = serializeAws_json1_1UpdateSecretCommand;
    var serializeAws_json1_1UpdateSecretVersionStageCommand = async (input, context) => {
      const headers = {
        "content-type": "application/x-amz-json-1.1",
        "x-amz-target": "secretsmanager.UpdateSecretVersionStage"
      };
      let body;
      body = JSON.stringify(serializeAws_json1_1UpdateSecretVersionStageRequest(input, context));
      return buildHttpRpcRequest(context, headers, "/", void 0, body);
    };
    exports.serializeAws_json1_1UpdateSecretVersionStageCommand = serializeAws_json1_1UpdateSecretVersionStageCommand;
    var serializeAws_json1_1ValidateResourcePolicyCommand = async (input, context) => {
      const headers = {
        "content-type": "application/x-amz-json-1.1",
        "x-amz-target": "secretsmanager.ValidateResourcePolicy"
      };
      let body;
      body = JSON.stringify(serializeAws_json1_1ValidateResourcePolicyRequest(input, context));
      return buildHttpRpcRequest(context, headers, "/", void 0, body);
    };
    exports.serializeAws_json1_1ValidateResourcePolicyCommand = serializeAws_json1_1ValidateResourcePolicyCommand;
    var deserializeAws_json1_1CancelRotateSecretCommand = async (output, context) => {
      if (output.statusCode >= 300) {
        return deserializeAws_json1_1CancelRotateSecretCommandError(output, context);
      }
      const data = await parseBody(output.body, context);
      let contents = {};
      contents = deserializeAws_json1_1CancelRotateSecretResponse(data, context);
      const response = {
        $metadata: deserializeMetadata(output),
        ...contents
      };
      return Promise.resolve(response);
    };
    exports.deserializeAws_json1_1CancelRotateSecretCommand = deserializeAws_json1_1CancelRotateSecretCommand;
    var deserializeAws_json1_1CancelRotateSecretCommandError = async (output, context) => {
      const parsedOutput = {
        ...output,
        body: await parseBody(output.body, context)
      };
      let response;
      let errorCode = "UnknownError";
      errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
      switch (errorCode) {
        case "InternalServiceError":
        case "com.amazonaws.secretsmanager#InternalServiceError":
          throw await deserializeAws_json1_1InternalServiceErrorResponse(parsedOutput, context);
        case "InvalidParameterException":
        case "com.amazonaws.secretsmanager#InvalidParameterException":
          throw await deserializeAws_json1_1InvalidParameterExceptionResponse(parsedOutput, context);
        case "InvalidRequestException":
        case "com.amazonaws.secretsmanager#InvalidRequestException":
          throw await deserializeAws_json1_1InvalidRequestExceptionResponse(parsedOutput, context);
        case "ResourceNotFoundException":
        case "com.amazonaws.secretsmanager#ResourceNotFoundException":
          throw await deserializeAws_json1_1ResourceNotFoundExceptionResponse(parsedOutput, context);
        default:
          const parsedBody = parsedOutput.body;
          response = new SecretsManagerServiceException_1.SecretsManagerServiceException({
            name: parsedBody.code || parsedBody.Code || errorCode,
            $fault: "client",
            $metadata: deserializeMetadata(output)
          });
          throw (0, smithy_client_1.decorateServiceException)(response, parsedBody);
      }
    };
    var deserializeAws_json1_1CreateSecretCommand = async (output, context) => {
      if (output.statusCode >= 300) {
        return deserializeAws_json1_1CreateSecretCommandError(output, context);
      }
      const data = await parseBody(output.body, context);
      let contents = {};
      contents = deserializeAws_json1_1CreateSecretResponse(data, context);
      const response = {
        $metadata: deserializeMetadata(output),
        ...contents
      };
      return Promise.resolve(response);
    };
    exports.deserializeAws_json1_1CreateSecretCommand = deserializeAws_json1_1CreateSecretCommand;
    var deserializeAws_json1_1CreateSecretCommandError = async (output, context) => {
      const parsedOutput = {
        ...output,
        body: await parseBody(output.body, context)
      };
      let response;
      let errorCode = "UnknownError";
      errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
      switch (errorCode) {
        case "DecryptionFailure":
        case "com.amazonaws.secretsmanager#DecryptionFailure":
          throw await deserializeAws_json1_1DecryptionFailureResponse(parsedOutput, context);
        case "EncryptionFailure":
        case "com.amazonaws.secretsmanager#EncryptionFailure":
          throw await deserializeAws_json1_1EncryptionFailureResponse(parsedOutput, context);
        case "InternalServiceError":
        case "com.amazonaws.secretsmanager#InternalServiceError":
          throw await deserializeAws_json1_1InternalServiceErrorResponse(parsedOutput, context);
        case "InvalidParameterException":
        case "com.amazonaws.secretsmanager#InvalidParameterException":
          throw await deserializeAws_json1_1InvalidParameterExceptionResponse(parsedOutput, context);
        case "InvalidRequestException":
        case "com.amazonaws.secretsmanager#InvalidRequestException":
          throw await deserializeAws_json1_1InvalidRequestExceptionResponse(parsedOutput, context);
        case "LimitExceededException":
        case "com.amazonaws.secretsmanager#LimitExceededException":
          throw await deserializeAws_json1_1LimitExceededExceptionResponse(parsedOutput, context);
        case "MalformedPolicyDocumentException":
        case "com.amazonaws.secretsmanager#MalformedPolicyDocumentException":
          throw await deserializeAws_json1_1MalformedPolicyDocumentExceptionResponse(parsedOutput, context);
        case "PreconditionNotMetException":
        case "com.amazonaws.secretsmanager#PreconditionNotMetException":
          throw await deserializeAws_json1_1PreconditionNotMetExceptionResponse(parsedOutput, context);
        case "ResourceExistsException":
        case "com.amazonaws.secretsmanager#ResourceExistsException":
          throw await deserializeAws_json1_1ResourceExistsExceptionResponse(parsedOutput, context);
        case "ResourceNotFoundException":
        case "com.amazonaws.secretsmanager#ResourceNotFoundException":
          throw await deserializeAws_json1_1ResourceNotFoundExceptionResponse(parsedOutput, context);
        default:
          const parsedBody = parsedOutput.body;
          response = new SecretsManagerServiceException_1.SecretsManagerServiceException({
            name: parsedBody.code || parsedBody.Code || errorCode,
            $fault: "client",
            $metadata: deserializeMetadata(output)
          });
          throw (0, smithy_client_1.decorateServiceException)(response, parsedBody);
      }
    };
    var deserializeAws_json1_1DeleteResourcePolicyCommand = async (output, context) => {
      if (output.statusCode >= 300) {
        return deserializeAws_json1_1DeleteResourcePolicyCommandError(output, context);
      }
      const data = await parseBody(output.body, context);
      let contents = {};
      contents = deserializeAws_json1_1DeleteResourcePolicyResponse(data, context);
      const response = {
        $metadata: deserializeMetadata(output),
        ...contents
      };
      return Promise.resolve(response);
    };
    exports.deserializeAws_json1_1DeleteResourcePolicyCommand = deserializeAws_json1_1DeleteResourcePolicyCommand;
    var deserializeAws_json1_1DeleteResourcePolicyCommandError = async (output, context) => {
      const parsedOutput = {
        ...output,
        body: await parseBody(output.body, context)
      };
      let response;
      let errorCode = "UnknownError";
      errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
      switch (errorCode) {
        case "InternalServiceError":
        case "com.amazonaws.secretsmanager#InternalServiceError":
          throw await deserializeAws_json1_1InternalServiceErrorResponse(parsedOutput, context);
        case "InvalidParameterException":
        case "com.amazonaws.secretsmanager#InvalidParameterException":
          throw await deserializeAws_json1_1InvalidParameterExceptionResponse(parsedOutput, context);
        case "InvalidRequestException":
        case "com.amazonaws.secretsmanager#InvalidRequestException":
          throw await deserializeAws_json1_1InvalidRequestExceptionResponse(parsedOutput, context);
        case "ResourceNotFoundException":
        case "com.amazonaws.secretsmanager#ResourceNotFoundException":
          throw await deserializeAws_json1_1ResourceNotFoundExceptionResponse(parsedOutput, context);
        default:
          const parsedBody = parsedOutput.body;
          response = new SecretsManagerServiceException_1.SecretsManagerServiceException({
            name: parsedBody.code || parsedBody.Code || errorCode,
            $fault: "client",
            $metadata: deserializeMetadata(output)
          });
          throw (0, smithy_client_1.decorateServiceException)(response, parsedBody);
      }
    };
    var deserializeAws_json1_1DeleteSecretCommand = async (output, context) => {
      if (output.statusCode >= 300) {
        return deserializeAws_json1_1DeleteSecretCommandError(output, context);
      }
      const data = await parseBody(output.body, context);
      let contents = {};
      contents = deserializeAws_json1_1DeleteSecretResponse(data, context);
      const response = {
        $metadata: deserializeMetadata(output),
        ...contents
      };
      return Promise.resolve(response);
    };
    exports.deserializeAws_json1_1DeleteSecretCommand = deserializeAws_json1_1DeleteSecretCommand;
    var deserializeAws_json1_1DeleteSecretCommandError = async (output, context) => {
      const parsedOutput = {
        ...output,
        body: await parseBody(output.body, context)
      };
      let response;
      let errorCode = "UnknownError";
      errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
      switch (errorCode) {
        case "InternalServiceError":
        case "com.amazonaws.secretsmanager#InternalServiceError":
          throw await deserializeAws_json1_1InternalServiceErrorResponse(parsedOutput, context);
        case "InvalidParameterException":
        case "com.amazonaws.secretsmanager#InvalidParameterException":
          throw await deserializeAws_json1_1InvalidParameterExceptionResponse(parsedOutput, context);
        case "InvalidRequestException":
        case "com.amazonaws.secretsmanager#InvalidRequestException":
          throw await deserializeAws_json1_1InvalidRequestExceptionResponse(parsedOutput, context);
        case "ResourceNotFoundException":
        case "com.amazonaws.secretsmanager#ResourceNotFoundException":
          throw await deserializeAws_json1_1ResourceNotFoundExceptionResponse(parsedOutput, context);
        default:
          const parsedBody = parsedOutput.body;
          response = new SecretsManagerServiceException_1.SecretsManagerServiceException({
            name: parsedBody.code || parsedBody.Code || errorCode,
            $fault: "client",
            $metadata: deserializeMetadata(output)
          });
          throw (0, smithy_client_1.decorateServiceException)(response, parsedBody);
      }
    };
    var deserializeAws_json1_1DescribeSecretCommand = async (output, context) => {
      if (output.statusCode >= 300) {
        return deserializeAws_json1_1DescribeSecretCommandError(output, context);
      }
      const data = await parseBody(output.body, context);
      let contents = {};
      contents = deserializeAws_json1_1DescribeSecretResponse(data, context);
      const response = {
        $metadata: deserializeMetadata(output),
        ...contents
      };
      return Promise.resolve(response);
    };
    exports.deserializeAws_json1_1DescribeSecretCommand = deserializeAws_json1_1DescribeSecretCommand;
    var deserializeAws_json1_1DescribeSecretCommandError = async (output, context) => {
      const parsedOutput = {
        ...output,
        body: await parseBody(output.body, context)
      };
      let response;
      let errorCode = "UnknownError";
      errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
      switch (errorCode) {
        case "InternalServiceError":
        case "com.amazonaws.secretsmanager#InternalServiceError":
          throw await deserializeAws_json1_1InternalServiceErrorResponse(parsedOutput, context);
        case "InvalidParameterException":
        case "com.amazonaws.secretsmanager#InvalidParameterException":
          throw await deserializeAws_json1_1InvalidParameterExceptionResponse(parsedOutput, context);
        case "ResourceNotFoundException":
        case "com.amazonaws.secretsmanager#ResourceNotFoundException":
          throw await deserializeAws_json1_1ResourceNotFoundExceptionResponse(parsedOutput, context);
        default:
          const parsedBody = parsedOutput.body;
          response = new SecretsManagerServiceException_1.SecretsManagerServiceException({
            name: parsedBody.code || parsedBody.Code || errorCode,
            $fault: "client",
            $metadata: deserializeMetadata(output)
          });
          throw (0, smithy_client_1.decorateServiceException)(response, parsedBody);
      }
    };
    var deserializeAws_json1_1GetRandomPasswordCommand = async (output, context) => {
      if (output.statusCode >= 300) {
        return deserializeAws_json1_1GetRandomPasswordCommandError(output, context);
      }
      const data = await parseBody(output.body, context);
      let contents = {};
      contents = deserializeAws_json1_1GetRandomPasswordResponse(data, context);
      const response = {
        $metadata: deserializeMetadata(output),
        ...contents
      };
      return Promise.resolve(response);
    };
    exports.deserializeAws_json1_1GetRandomPasswordCommand = deserializeAws_json1_1GetRandomPasswordCommand;
    var deserializeAws_json1_1GetRandomPasswordCommandError = async (output, context) => {
      const parsedOutput = {
        ...output,
        body: await parseBody(output.body, context)
      };
      let response;
      let errorCode = "UnknownError";
      errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
      switch (errorCode) {
        case "InternalServiceError":
        case "com.amazonaws.secretsmanager#InternalServiceError":
          throw await deserializeAws_json1_1InternalServiceErrorResponse(parsedOutput, context);
        case "InvalidParameterException":
        case "com.amazonaws.secretsmanager#InvalidParameterException":
          throw await deserializeAws_json1_1InvalidParameterExceptionResponse(parsedOutput, context);
        case "InvalidRequestException":
        case "com.amazonaws.secretsmanager#InvalidRequestException":
          throw await deserializeAws_json1_1InvalidRequestExceptionResponse(parsedOutput, context);
        default:
          const parsedBody = parsedOutput.body;
          response = new SecretsManagerServiceException_1.SecretsManagerServiceException({
            name: parsedBody.code || parsedBody.Code || errorCode,
            $fault: "client",
            $metadata: deserializeMetadata(output)
          });
          throw (0, smithy_client_1.decorateServiceException)(response, parsedBody);
      }
    };
    var deserializeAws_json1_1GetResourcePolicyCommand = async (output, context) => {
      if (output.statusCode >= 300) {
        return deserializeAws_json1_1GetResourcePolicyCommandError(output, context);
      }
      const data = await parseBody(output.body, context);
      let contents = {};
      contents = deserializeAws_json1_1GetResourcePolicyResponse(data, context);
      const response = {
        $metadata: deserializeMetadata(output),
        ...contents
      };
      return Promise.resolve(response);
    };
    exports.deserializeAws_json1_1GetResourcePolicyCommand = deserializeAws_json1_1GetResourcePolicyCommand;
    var deserializeAws_json1_1GetResourcePolicyCommandError = async (output, context) => {
      const parsedOutput = {
        ...output,
        body: await parseBody(output.body, context)
      };
      let response;
      let errorCode = "UnknownError";
      errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
      switch (errorCode) {
        case "InternalServiceError":
        case "com.amazonaws.secretsmanager#InternalServiceError":
          throw await deserializeAws_json1_1InternalServiceErrorResponse(parsedOutput, context);
        case "InvalidParameterException":
        case "com.amazonaws.secretsmanager#InvalidParameterException":
          throw await deserializeAws_json1_1InvalidParameterExceptionResponse(parsedOutput, context);
        case "InvalidRequestException":
        case "com.amazonaws.secretsmanager#InvalidRequestException":
          throw await deserializeAws_json1_1InvalidRequestExceptionResponse(parsedOutput, context);
        case "ResourceNotFoundException":
        case "com.amazonaws.secretsmanager#ResourceNotFoundException":
          throw await deserializeAws_json1_1ResourceNotFoundExceptionResponse(parsedOutput, context);
        default:
          const parsedBody = parsedOutput.body;
          response = new SecretsManagerServiceException_1.SecretsManagerServiceException({
            name: parsedBody.code || parsedBody.Code || errorCode,
            $fault: "client",
            $metadata: deserializeMetadata(output)
          });
          throw (0, smithy_client_1.decorateServiceException)(response, parsedBody);
      }
    };
    var deserializeAws_json1_1GetSecretValueCommand = async (output, context) => {
      if (output.statusCode >= 300) {
        return deserializeAws_json1_1GetSecretValueCommandError(output, context);
      }
      const data = await parseBody(output.body, context);
      let contents = {};
      contents = deserializeAws_json1_1GetSecretValueResponse(data, context);
      const response = {
        $metadata: deserializeMetadata(output),
        ...contents
      };
      return Promise.resolve(response);
    };
    exports.deserializeAws_json1_1GetSecretValueCommand = deserializeAws_json1_1GetSecretValueCommand;
    var deserializeAws_json1_1GetSecretValueCommandError = async (output, context) => {
      const parsedOutput = {
        ...output,
        body: await parseBody(output.body, context)
      };
      let response;
      let errorCode = "UnknownError";
      errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
      switch (errorCode) {
        case "DecryptionFailure":
        case "com.amazonaws.secretsmanager#DecryptionFailure":
          throw await deserializeAws_json1_1DecryptionFailureResponse(parsedOutput, context);
        case "InternalServiceError":
        case "com.amazonaws.secretsmanager#InternalServiceError":
          throw await deserializeAws_json1_1InternalServiceErrorResponse(parsedOutput, context);
        case "InvalidParameterException":
        case "com.amazonaws.secretsmanager#InvalidParameterException":
          throw await deserializeAws_json1_1InvalidParameterExceptionResponse(parsedOutput, context);
        case "InvalidRequestException":
        case "com.amazonaws.secretsmanager#InvalidRequestException":
          throw await deserializeAws_json1_1InvalidRequestExceptionResponse(parsedOutput, context);
        case "ResourceNotFoundException":
        case "com.amazonaws.secretsmanager#ResourceNotFoundException":
          throw await deserializeAws_json1_1ResourceNotFoundExceptionResponse(parsedOutput, context);
        default:
          const parsedBody = parsedOutput.body;
          response = new SecretsManagerServiceException_1.SecretsManagerServiceException({
            name: parsedBody.code || parsedBody.Code || errorCode,
            $fault: "client",
            $metadata: deserializeMetadata(output)
          });
          throw (0, smithy_client_1.decorateServiceException)(response, parsedBody);
      }
    };
    var deserializeAws_json1_1ListSecretsCommand = async (output, context) => {
      if (output.statusCode >= 300) {
        return deserializeAws_json1_1ListSecretsCommandError(output, context);
      }
      const data = await parseBody(output.body, context);
      let contents = {};
      contents = deserializeAws_json1_1ListSecretsResponse(data, context);
      const response = {
        $metadata: deserializeMetadata(output),
        ...contents
      };
      return Promise.resolve(response);
    };
    exports.deserializeAws_json1_1ListSecretsCommand = deserializeAws_json1_1ListSecretsCommand;
    var deserializeAws_json1_1ListSecretsCommandError = async (output, context) => {
      const parsedOutput = {
        ...output,
        body: await parseBody(output.body, context)
      };
      let response;
      let errorCode = "UnknownError";
      errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
      switch (errorCode) {
        case "InternalServiceError":
        case "com.amazonaws.secretsmanager#InternalServiceError":
          throw await deserializeAws_json1_1InternalServiceErrorResponse(parsedOutput, context);
        case "InvalidNextTokenException":
        case "com.amazonaws.secretsmanager#InvalidNextTokenException":
          throw await deserializeAws_json1_1InvalidNextTokenExceptionResponse(parsedOutput, context);
        case "InvalidParameterException":
        case "com.amazonaws.secretsmanager#InvalidParameterException":
          throw await deserializeAws_json1_1InvalidParameterExceptionResponse(parsedOutput, context);
        default:
          const parsedBody = parsedOutput.body;
          response = new SecretsManagerServiceException_1.SecretsManagerServiceException({
            name: parsedBody.code || parsedBody.Code || errorCode,
            $fault: "client",
            $metadata: deserializeMetadata(output)
          });
          throw (0, smithy_client_1.decorateServiceException)(response, parsedBody);
      }
    };
    var deserializeAws_json1_1ListSecretVersionIdsCommand = async (output, context) => {
      if (output.statusCode >= 300) {
        return deserializeAws_json1_1ListSecretVersionIdsCommandError(output, context);
      }
      const data = await parseBody(output.body, context);
      let contents = {};
      contents = deserializeAws_json1_1ListSecretVersionIdsResponse(data, context);
      const response = {
        $metadata: deserializeMetadata(output),
        ...contents
      };
      return Promise.resolve(response);
    };
    exports.deserializeAws_json1_1ListSecretVersionIdsCommand = deserializeAws_json1_1ListSecretVersionIdsCommand;
    var deserializeAws_json1_1ListSecretVersionIdsCommandError = async (output, context) => {
      const parsedOutput = {
        ...output,
        body: await parseBody(output.body, context)
      };
      let response;
      let errorCode = "UnknownError";
      errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
      switch (errorCode) {
        case "InternalServiceError":
        case "com.amazonaws.secretsmanager#InternalServiceError":
          throw await deserializeAws_json1_1InternalServiceErrorResponse(parsedOutput, context);
        case "InvalidNextTokenException":
        case "com.amazonaws.secretsmanager#InvalidNextTokenException":
          throw await deserializeAws_json1_1InvalidNextTokenExceptionResponse(parsedOutput, context);
        case "InvalidParameterException":
        case "com.amazonaws.secretsmanager#InvalidParameterException":
          throw await deserializeAws_json1_1InvalidParameterExceptionResponse(parsedOutput, context);
        case "ResourceNotFoundException":
        case "com.amazonaws.secretsmanager#ResourceNotFoundException":
          throw await deserializeAws_json1_1ResourceNotFoundExceptionResponse(parsedOutput, context);
        default:
          const parsedBody = parsedOutput.body;
          response = new SecretsManagerServiceException_1.SecretsManagerServiceException({
            name: parsedBody.code || parsedBody.Code || errorCode,
            $fault: "client",
            $metadata: deserializeMetadata(output)
          });
          throw (0, smithy_client_1.decorateServiceException)(response, parsedBody);
      }
    };
    var deserializeAws_json1_1PutResourcePolicyCommand = async (output, context) => {
      if (output.statusCode >= 300) {
        return deserializeAws_json1_1PutResourcePolicyCommandError(output, context);
      }
      const data = await parseBody(output.body, context);
      let contents = {};
      contents = deserializeAws_json1_1PutResourcePolicyResponse(data, context);
      const response = {
        $metadata: deserializeMetadata(output),
        ...contents
      };
      return Promise.resolve(response);
    };
    exports.deserializeAws_json1_1PutResourcePolicyCommand = deserializeAws_json1_1PutResourcePolicyCommand;
    var deserializeAws_json1_1PutResourcePolicyCommandError = async (output, context) => {
      const parsedOutput = {
        ...output,
        body: await parseBody(output.body, context)
      };
      let response;
      let errorCode = "UnknownError";
      errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
      switch (errorCode) {
        case "InternalServiceError":
        case "com.amazonaws.secretsmanager#InternalServiceError":
          throw await deserializeAws_json1_1InternalServiceErrorResponse(parsedOutput, context);
        case "InvalidParameterException":
        case "com.amazonaws.secretsmanager#InvalidParameterException":
          throw await deserializeAws_json1_1InvalidParameterExceptionResponse(parsedOutput, context);
        case "InvalidRequestException":
        case "com.amazonaws.secretsmanager#InvalidRequestException":
          throw await deserializeAws_json1_1InvalidRequestExceptionResponse(parsedOutput, context);
        case "MalformedPolicyDocumentException":
        case "com.amazonaws.secretsmanager#MalformedPolicyDocumentException":
          throw await deserializeAws_json1_1MalformedPolicyDocumentExceptionResponse(parsedOutput, context);
        case "PublicPolicyException":
        case "com.amazonaws.secretsmanager#PublicPolicyException":
          throw await deserializeAws_json1_1PublicPolicyExceptionResponse(parsedOutput, context);
        case "ResourceNotFoundException":
        case "com.amazonaws.secretsmanager#ResourceNotFoundException":
          throw await deserializeAws_json1_1ResourceNotFoundExceptionResponse(parsedOutput, context);
        default:
          const parsedBody = parsedOutput.body;
          response = new SecretsManagerServiceException_1.SecretsManagerServiceException({
            name: parsedBody.code || parsedBody.Code || errorCode,
            $fault: "client",
            $metadata: deserializeMetadata(output)
          });
          throw (0, smithy_client_1.decorateServiceException)(response, parsedBody);
      }
    };
    var deserializeAws_json1_1PutSecretValueCommand = async (output, context) => {
      if (output.statusCode >= 300) {
        return deserializeAws_json1_1PutSecretValueCommandError(output, context);
      }
      const data = await parseBody(output.body, context);
      let contents = {};
      contents = deserializeAws_json1_1PutSecretValueResponse(data, context);
      const response = {
        $metadata: deserializeMetadata(output),
        ...contents
      };
      return Promise.resolve(response);
    };
    exports.deserializeAws_json1_1PutSecretValueCommand = deserializeAws_json1_1PutSecretValueCommand;
    var deserializeAws_json1_1PutSecretValueCommandError = async (output, context) => {
      const parsedOutput = {
        ...output,
        body: await parseBody(output.body, context)
      };
      let response;
      let errorCode = "UnknownError";
      errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
      switch (errorCode) {
        case "DecryptionFailure":
        case "com.amazonaws.secretsmanager#DecryptionFailure":
          throw await deserializeAws_json1_1DecryptionFailureResponse(parsedOutput, context);
        case "EncryptionFailure":
        case "com.amazonaws.secretsmanager#EncryptionFailure":
          throw await deserializeAws_json1_1EncryptionFailureResponse(parsedOutput, context);
        case "InternalServiceError":
        case "com.amazonaws.secretsmanager#InternalServiceError":
          throw await deserializeAws_json1_1InternalServiceErrorResponse(parsedOutput, context);
        case "InvalidParameterException":
        case "com.amazonaws.secretsmanager#InvalidParameterException":
          throw await deserializeAws_json1_1InvalidParameterExceptionResponse(parsedOutput, context);
        case "InvalidRequestException":
        case "com.amazonaws.secretsmanager#InvalidRequestException":
          throw await deserializeAws_json1_1InvalidRequestExceptionResponse(parsedOutput, context);
        case "LimitExceededException":
        case "com.amazonaws.secretsmanager#LimitExceededException":
          throw await deserializeAws_json1_1LimitExceededExceptionResponse(parsedOutput, context);
        case "ResourceExistsException":
        case "com.amazonaws.secretsmanager#ResourceExistsException":
          throw await deserializeAws_json1_1ResourceExistsExceptionResponse(parsedOutput, context);
        case "ResourceNotFoundException":
        case "com.amazonaws.secretsmanager#ResourceNotFoundException":
          throw await deserializeAws_json1_1ResourceNotFoundExceptionResponse(parsedOutput, context);
        default:
          const parsedBody = parsedOutput.body;
          response = new SecretsManagerServiceException_1.SecretsManagerServiceException({
            name: parsedBody.code || parsedBody.Code || errorCode,
            $fault: "client",
            $metadata: deserializeMetadata(output)
          });
          throw (0, smithy_client_1.decorateServiceException)(response, parsedBody);
      }
    };
    var deserializeAws_json1_1RemoveRegionsFromReplicationCommand = async (output, context) => {
      if (output.statusCode >= 300) {
        return deserializeAws_json1_1RemoveRegionsFromReplicationCommandError(output, context);
      }
      const data = await parseBody(output.body, context);
      let contents = {};
      contents = deserializeAws_json1_1RemoveRegionsFromReplicationResponse(data, context);
      const response = {
        $metadata: deserializeMetadata(output),
        ...contents
      };
      return Promise.resolve(response);
    };
    exports.deserializeAws_json1_1RemoveRegionsFromReplicationCommand = deserializeAws_json1_1RemoveRegionsFromReplicationCommand;
    var deserializeAws_json1_1RemoveRegionsFromReplicationCommandError = async (output, context) => {
      const parsedOutput = {
        ...output,
        body: await parseBody(output.body, context)
      };
      let response;
      let errorCode = "UnknownError";
      errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
      switch (errorCode) {
        case "InternalServiceError":
        case "com.amazonaws.secretsmanager#InternalServiceError":
          throw await deserializeAws_json1_1InternalServiceErrorResponse(parsedOutput, context);
        case "InvalidParameterException":
        case "com.amazonaws.secretsmanager#InvalidParameterException":
          throw await deserializeAws_json1_1InvalidParameterExceptionResponse(parsedOutput, context);
        case "InvalidRequestException":
        case "com.amazonaws.secretsmanager#InvalidRequestException":
          throw await deserializeAws_json1_1InvalidRequestExceptionResponse(parsedOutput, context);
        case "ResourceNotFoundException":
        case "com.amazonaws.secretsmanager#ResourceNotFoundException":
          throw await deserializeAws_json1_1ResourceNotFoundExceptionResponse(parsedOutput, context);
        default:
          const parsedBody = parsedOutput.body;
          response = new SecretsManagerServiceException_1.SecretsManagerServiceException({
            name: parsedBody.code || parsedBody.Code || errorCode,
            $fault: "client",
            $metadata: deserializeMetadata(output)
          });
          throw (0, smithy_client_1.decorateServiceException)(response, parsedBody);
      }
    };
    var deserializeAws_json1_1ReplicateSecretToRegionsCommand = async (output, context) => {
      if (output.statusCode >= 300) {
        return deserializeAws_json1_1ReplicateSecretToRegionsCommandError(output, context);
      }
      const data = await parseBody(output.body, context);
      let contents = {};
      contents = deserializeAws_json1_1ReplicateSecretToRegionsResponse(data, context);
      const response = {
        $metadata: deserializeMetadata(output),
        ...contents
      };
      return Promise.resolve(response);
    };
    exports.deserializeAws_json1_1ReplicateSecretToRegionsCommand = deserializeAws_json1_1ReplicateSecretToRegionsCommand;
    var deserializeAws_json1_1ReplicateSecretToRegionsCommandError = async (output, context) => {
      const parsedOutput = {
        ...output,
        body: await parseBody(output.body, context)
      };
      let response;
      let errorCode = "UnknownError";
      errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
      switch (errorCode) {
        case "InternalServiceError":
        case "com.amazonaws.secretsmanager#InternalServiceError":
          throw await deserializeAws_json1_1InternalServiceErrorResponse(parsedOutput, context);
        case "InvalidParameterException":
        case "com.amazonaws.secretsmanager#InvalidParameterException":
          throw await deserializeAws_json1_1InvalidParameterExceptionResponse(parsedOutput, context);
        case "InvalidRequestException":
        case "com.amazonaws.secretsmanager#InvalidRequestException":
          throw await deserializeAws_json1_1InvalidRequestExceptionResponse(parsedOutput, context);
        case "ResourceNotFoundException":
        case "com.amazonaws.secretsmanager#ResourceNotFoundException":
          throw await deserializeAws_json1_1ResourceNotFoundExceptionResponse(parsedOutput, context);
        default:
          const parsedBody = parsedOutput.body;
          response = new SecretsManagerServiceException_1.SecretsManagerServiceException({
            name: parsedBody.code || parsedBody.Code || errorCode,
            $fault: "client",
            $metadata: deserializeMetadata(output)
          });
          throw (0, smithy_client_1.decorateServiceException)(response, parsedBody);
      }
    };
    var deserializeAws_json1_1RestoreSecretCommand = async (output, context) => {
      if (output.statusCode >= 300) {
        return deserializeAws_json1_1RestoreSecretCommandError(output, context);
      }
      const data = await parseBody(output.body, context);
      let contents = {};
      contents = deserializeAws_json1_1RestoreSecretResponse(data, context);
      const response = {
        $metadata: deserializeMetadata(output),
        ...contents
      };
      return Promise.resolve(response);
    };
    exports.deserializeAws_json1_1RestoreSecretCommand = deserializeAws_json1_1RestoreSecretCommand;
    var deserializeAws_json1_1RestoreSecretCommandError = async (output, context) => {
      const parsedOutput = {
        ...output,
        body: await parseBody(output.body, context)
      };
      let response;
      let errorCode = "UnknownError";
      errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
      switch (errorCode) {
        case "InternalServiceError":
        case "com.amazonaws.secretsmanager#InternalServiceError":
          throw await deserializeAws_json1_1InternalServiceErrorResponse(parsedOutput, context);
        case "InvalidParameterException":
        case "com.amazonaws.secretsmanager#InvalidParameterException":
          throw await deserializeAws_json1_1InvalidParameterExceptionResponse(parsedOutput, context);
        case "InvalidRequestException":
        case "com.amazonaws.secretsmanager#InvalidRequestException":
          throw await deserializeAws_json1_1InvalidRequestExceptionResponse(parsedOutput, context);
        case "ResourceNotFoundException":
        case "com.amazonaws.secretsmanager#ResourceNotFoundException":
          throw await deserializeAws_json1_1ResourceNotFoundExceptionResponse(parsedOutput, context);
        default:
          const parsedBody = parsedOutput.body;
          response = new SecretsManagerServiceException_1.SecretsManagerServiceException({
            name: parsedBody.code || parsedBody.Code || errorCode,
            $fault: "client",
            $metadata: deserializeMetadata(output)
          });
          throw (0, smithy_client_1.decorateServiceException)(response, parsedBody);
      }
    };
    var deserializeAws_json1_1RotateSecretCommand = async (output, context) => {
      if (output.statusCode >= 300) {
        return deserializeAws_json1_1RotateSecretCommandError(output, context);
      }
      const data = await parseBody(output.body, context);
      let contents = {};
      contents = deserializeAws_json1_1RotateSecretResponse(data, context);
      const response = {
        $metadata: deserializeMetadata(output),
        ...contents
      };
      return Promise.resolve(response);
    };
    exports.deserializeAws_json1_1RotateSecretCommand = deserializeAws_json1_1RotateSecretCommand;
    var deserializeAws_json1_1RotateSecretCommandError = async (output, context) => {
      const parsedOutput = {
        ...output,
        body: await parseBody(output.body, context)
      };
      let response;
      let errorCode = "UnknownError";
      errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
      switch (errorCode) {
        case "InternalServiceError":
        case "com.amazonaws.secretsmanager#InternalServiceError":
          throw await deserializeAws_json1_1InternalServiceErrorResponse(parsedOutput, context);
        case "InvalidParameterException":
        case "com.amazonaws.secretsmanager#InvalidParameterException":
          throw await deserializeAws_json1_1InvalidParameterExceptionResponse(parsedOutput, context);
        case "InvalidRequestException":
        case "com.amazonaws.secretsmanager#InvalidRequestException":
          throw await deserializeAws_json1_1InvalidRequestExceptionResponse(parsedOutput, context);
        case "ResourceNotFoundException":
        case "com.amazonaws.secretsmanager#ResourceNotFoundException":
          throw await deserializeAws_json1_1ResourceNotFoundExceptionResponse(parsedOutput, context);
        default:
          const parsedBody = parsedOutput.body;
          response = new SecretsManagerServiceException_1.SecretsManagerServiceException({
            name: parsedBody.code || parsedBody.Code || errorCode,
            $fault: "client",
            $metadata: deserializeMetadata(output)
          });
          throw (0, smithy_client_1.decorateServiceException)(response, parsedBody);
      }
    };
    var deserializeAws_json1_1StopReplicationToReplicaCommand = async (output, context) => {
      if (output.statusCode >= 300) {
        return deserializeAws_json1_1StopReplicationToReplicaCommandError(output, context);
      }
      const data = await parseBody(output.body, context);
      let contents = {};
      contents = deserializeAws_json1_1StopReplicationToReplicaResponse(data, context);
      const response = {
        $metadata: deserializeMetadata(output),
        ...contents
      };
      return Promise.resolve(response);
    };
    exports.deserializeAws_json1_1StopReplicationToReplicaCommand = deserializeAws_json1_1StopReplicationToReplicaCommand;
    var deserializeAws_json1_1StopReplicationToReplicaCommandError = async (output, context) => {
      const parsedOutput = {
        ...output,
        body: await parseBody(output.body, context)
      };
      let response;
      let errorCode = "UnknownError";
      errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
      switch (errorCode) {
        case "InternalServiceError":
        case "com.amazonaws.secretsmanager#InternalServiceError":
          throw await deserializeAws_json1_1InternalServiceErrorResponse(parsedOutput, context);
        case "InvalidParameterException":
        case "com.amazonaws.secretsmanager#InvalidParameterException":
          throw await deserializeAws_json1_1InvalidParameterExceptionResponse(parsedOutput, context);
        case "InvalidRequestException":
        case "com.amazonaws.secretsmanager#InvalidRequestException":
          throw await deserializeAws_json1_1InvalidRequestExceptionResponse(parsedOutput, context);
        case "ResourceNotFoundException":
        case "com.amazonaws.secretsmanager#ResourceNotFoundException":
          throw await deserializeAws_json1_1ResourceNotFoundExceptionResponse(parsedOutput, context);
        default:
          const parsedBody = parsedOutput.body;
          response = new SecretsManagerServiceException_1.SecretsManagerServiceException({
            name: parsedBody.code || parsedBody.Code || errorCode,
            $fault: "client",
            $metadata: deserializeMetadata(output)
          });
          throw (0, smithy_client_1.decorateServiceException)(response, parsedBody);
      }
    };
    var deserializeAws_json1_1TagResourceCommand = async (output, context) => {
      if (output.statusCode >= 300) {
        return deserializeAws_json1_1TagResourceCommandError(output, context);
      }
      await collectBody(output.body, context);
      const response = {
        $metadata: deserializeMetadata(output)
      };
      return Promise.resolve(response);
    };
    exports.deserializeAws_json1_1TagResourceCommand = deserializeAws_json1_1TagResourceCommand;
    var deserializeAws_json1_1TagResourceCommandError = async (output, context) => {
      const parsedOutput = {
        ...output,
        body: await parseBody(output.body, context)
      };
      let response;
      let errorCode = "UnknownError";
      errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
      switch (errorCode) {
        case "InternalServiceError":
        case "com.amazonaws.secretsmanager#InternalServiceError":
          throw await deserializeAws_json1_1InternalServiceErrorResponse(parsedOutput, context);
        case "InvalidParameterException":
        case "com.amazonaws.secretsmanager#InvalidParameterException":
          throw await deserializeAws_json1_1InvalidParameterExceptionResponse(parsedOutput, context);
        case "InvalidRequestException":
        case "com.amazonaws.secretsmanager#InvalidRequestException":
          throw await deserializeAws_json1_1InvalidRequestExceptionResponse(parsedOutput, context);
        case "ResourceNotFoundException":
        case "com.amazonaws.secretsmanager#ResourceNotFoundException":
          throw await deserializeAws_json1_1ResourceNotFoundExceptionResponse(parsedOutput, context);
        default:
          const parsedBody = parsedOutput.body;
          response = new SecretsManagerServiceException_1.SecretsManagerServiceException({
            name: parsedBody.code || parsedBody.Code || errorCode,
            $fault: "client",
            $metadata: deserializeMetadata(output)
          });
          throw (0, smithy_client_1.decorateServiceException)(response, parsedBody);
      }
    };
    var deserializeAws_json1_1UntagResourceCommand = async (output, context) => {
      if (output.statusCode >= 300) {
        return deserializeAws_json1_1UntagResourceCommandError(output, context);
      }
      await collectBody(output.body, context);
      const response = {
        $metadata: deserializeMetadata(output)
      };
      return Promise.resolve(response);
    };
    exports.deserializeAws_json1_1UntagResourceCommand = deserializeAws_json1_1UntagResourceCommand;
    var deserializeAws_json1_1UntagResourceCommandError = async (output, context) => {
      const parsedOutput = {
        ...output,
        body: await parseBody(output.body, context)
      };
      let response;
      let errorCode = "UnknownError";
      errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
      switch (errorCode) {
        case "InternalServiceError":
        case "com.amazonaws.secretsmanager#InternalServiceError":
          throw await deserializeAws_json1_1InternalServiceErrorResponse(parsedOutput, context);
        case "InvalidParameterException":
        case "com.amazonaws.secretsmanager#InvalidParameterException":
          throw await deserializeAws_json1_1InvalidParameterExceptionResponse(parsedOutput, context);
        case "InvalidRequestException":
        case "com.amazonaws.secretsmanager#InvalidRequestException":
          throw await deserializeAws_json1_1InvalidRequestExceptionResponse(parsedOutput, context);
        case "ResourceNotFoundException":
        case "com.amazonaws.secretsmanager#ResourceNotFoundException":
          throw await deserializeAws_json1_1ResourceNotFoundExceptionResponse(parsedOutput, context);
        default:
          const parsedBody = parsedOutput.body;
          response = new SecretsManagerServiceException_1.SecretsManagerServiceException({
            name: parsedBody.code || parsedBody.Code || errorCode,
            $fault: "client",
            $metadata: deserializeMetadata(output)
          });
          throw (0, smithy_client_1.decorateServiceException)(response, parsedBody);
      }
    };
    var deserializeAws_json1_1UpdateSecretCommand = async (output, context) => {
      if (output.statusCode >= 300) {
        return deserializeAws_json1_1UpdateSecretCommandError(output, context);
      }
      const data = await parseBody(output.body, context);
      let contents = {};
      contents = deserializeAws_json1_1UpdateSecretResponse(data, context);
      const response = {
        $metadata: deserializeMetadata(output),
        ...contents
      };
      return Promise.resolve(response);
    };
    exports.deserializeAws_json1_1UpdateSecretCommand = deserializeAws_json1_1UpdateSecretCommand;
    var deserializeAws_json1_1UpdateSecretCommandError = async (output, context) => {
      const parsedOutput = {
        ...output,
        body: await parseBody(output.body, context)
      };
      let response;
      let errorCode = "UnknownError";
      errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
      switch (errorCode) {
        case "DecryptionFailure":
        case "com.amazonaws.secretsmanager#DecryptionFailure":
          throw await deserializeAws_json1_1DecryptionFailureResponse(parsedOutput, context);
        case "EncryptionFailure":
        case "com.amazonaws.secretsmanager#EncryptionFailure":
          throw await deserializeAws_json1_1EncryptionFailureResponse(parsedOutput, context);
        case "InternalServiceError":
        case "com.amazonaws.secretsmanager#InternalServiceError":
          throw await deserializeAws_json1_1InternalServiceErrorResponse(parsedOutput, context);
        case "InvalidParameterException":
        case "com.amazonaws.secretsmanager#InvalidParameterException":
          throw await deserializeAws_json1_1InvalidParameterExceptionResponse(parsedOutput, context);
        case "InvalidRequestException":
        case "com.amazonaws.secretsmanager#InvalidRequestException":
          throw await deserializeAws_json1_1InvalidRequestExceptionResponse(parsedOutput, context);
        case "LimitExceededException":
        case "com.amazonaws.secretsmanager#LimitExceededException":
          throw await deserializeAws_json1_1LimitExceededExceptionResponse(parsedOutput, context);
        case "MalformedPolicyDocumentException":
        case "com.amazonaws.secretsmanager#MalformedPolicyDocumentException":
          throw await deserializeAws_json1_1MalformedPolicyDocumentExceptionResponse(parsedOutput, context);
        case "PreconditionNotMetException":
        case "com.amazonaws.secretsmanager#PreconditionNotMetException":
          throw await deserializeAws_json1_1PreconditionNotMetExceptionResponse(parsedOutput, context);
        case "ResourceExistsException":
        case "com.amazonaws.secretsmanager#ResourceExistsException":
          throw await deserializeAws_json1_1ResourceExistsExceptionResponse(parsedOutput, context);
        case "ResourceNotFoundException":
        case "com.amazonaws.secretsmanager#ResourceNotFoundException":
          throw await deserializeAws_json1_1ResourceNotFoundExceptionResponse(parsedOutput, context);
        default:
          const parsedBody = parsedOutput.body;
          response = new SecretsManagerServiceException_1.SecretsManagerServiceException({
            name: parsedBody.code || parsedBody.Code || errorCode,
            $fault: "client",
            $metadata: deserializeMetadata(output)
          });
          throw (0, smithy_client_1.decorateServiceException)(response, parsedBody);
      }
    };
    var deserializeAws_json1_1UpdateSecretVersionStageCommand = async (output, context) => {
      if (output.statusCode >= 300) {
        return deserializeAws_json1_1UpdateSecretVersionStageCommandError(output, context);
      }
      const data = await parseBody(output.body, context);
      let contents = {};
      contents = deserializeAws_json1_1UpdateSecretVersionStageResponse(data, context);
      const response = {
        $metadata: deserializeMetadata(output),
        ...contents
      };
      return Promise.resolve(response);
    };
    exports.deserializeAws_json1_1UpdateSecretVersionStageCommand = deserializeAws_json1_1UpdateSecretVersionStageCommand;
    var deserializeAws_json1_1UpdateSecretVersionStageCommandError = async (output, context) => {
      const parsedOutput = {
        ...output,
        body: await parseBody(output.body, context)
      };
      let response;
      let errorCode = "UnknownError";
      errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
      switch (errorCode) {
        case "InternalServiceError":
        case "com.amazonaws.secretsmanager#InternalServiceError":
          throw await deserializeAws_json1_1InternalServiceErrorResponse(parsedOutput, context);
        case "InvalidParameterException":
        case "com.amazonaws.secretsmanager#InvalidParameterException":
          throw await deserializeAws_json1_1InvalidParameterExceptionResponse(parsedOutput, context);
        case "InvalidRequestException":
        case "com.amazonaws.secretsmanager#InvalidRequestException":
          throw await deserializeAws_json1_1InvalidRequestExceptionResponse(parsedOutput, context);
        case "LimitExceededException":
        case "com.amazonaws.secretsmanager#LimitExceededException":
          throw await deserializeAws_json1_1LimitExceededExceptionResponse(parsedOutput, context);
        case "ResourceNotFoundException":
        case "com.amazonaws.secretsmanager#ResourceNotFoundException":
          throw await deserializeAws_json1_1ResourceNotFoundExceptionResponse(parsedOutput, context);
        default:
          const parsedBody = parsedOutput.body;
          response = new SecretsManagerServiceException_1.SecretsManagerServiceException({
            name: parsedBody.code || parsedBody.Code || errorCode,
            $fault: "client",
            $metadata: deserializeMetadata(output)
          });
          throw (0, smithy_client_1.decorateServiceException)(response, parsedBody);
      }
    };
    var deserializeAws_json1_1ValidateResourcePolicyCommand = async (output, context) => {
      if (output.statusCode >= 300) {
        return deserializeAws_json1_1ValidateResourcePolicyCommandError(output, context);
      }
      const data = await parseBody(output.body, context);
      let contents = {};
      contents = deserializeAws_json1_1ValidateResourcePolicyResponse(data, context);
      const response = {
        $metadata: deserializeMetadata(output),
        ...contents
      };
      return Promise.resolve(response);
    };
    exports.deserializeAws_json1_1ValidateResourcePolicyCommand = deserializeAws_json1_1ValidateResourcePolicyCommand;
    var deserializeAws_json1_1ValidateResourcePolicyCommandError = async (output, context) => {
      const parsedOutput = {
        ...output,
        body: await parseBody(output.body, context)
      };
      let response;
      let errorCode = "UnknownError";
      errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
      switch (errorCode) {
        case "InternalServiceError":
        case "com.amazonaws.secretsmanager#InternalServiceError":
          throw await deserializeAws_json1_1InternalServiceErrorResponse(parsedOutput, context);
        case "InvalidParameterException":
        case "com.amazonaws.secretsmanager#InvalidParameterException":
          throw await deserializeAws_json1_1InvalidParameterExceptionResponse(parsedOutput, context);
        case "InvalidRequestException":
        case "com.amazonaws.secretsmanager#InvalidRequestException":
          throw await deserializeAws_json1_1InvalidRequestExceptionResponse(parsedOutput, context);
        case "MalformedPolicyDocumentException":
        case "com.amazonaws.secretsmanager#MalformedPolicyDocumentException":
          throw await deserializeAws_json1_1MalformedPolicyDocumentExceptionResponse(parsedOutput, context);
        case "ResourceNotFoundException":
        case "com.amazonaws.secretsmanager#ResourceNotFoundException":
          throw await deserializeAws_json1_1ResourceNotFoundExceptionResponse(parsedOutput, context);
        default:
          const parsedBody = parsedOutput.body;
          response = new SecretsManagerServiceException_1.SecretsManagerServiceException({
            name: parsedBody.code || parsedBody.Code || errorCode,
            $fault: "client",
            $metadata: deserializeMetadata(output)
          });
          throw (0, smithy_client_1.decorateServiceException)(response, parsedBody);
      }
    };
    var deserializeAws_json1_1DecryptionFailureResponse = async (parsedOutput, context) => {
      const body = parsedOutput.body;
      const deserialized = deserializeAws_json1_1DecryptionFailure(body, context);
      const exception = new models_0_1.DecryptionFailure({
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized
      });
      return (0, smithy_client_1.decorateServiceException)(exception, body);
    };
    var deserializeAws_json1_1EncryptionFailureResponse = async (parsedOutput, context) => {
      const body = parsedOutput.body;
      const deserialized = deserializeAws_json1_1EncryptionFailure(body, context);
      const exception = new models_0_1.EncryptionFailure({
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized
      });
      return (0, smithy_client_1.decorateServiceException)(exception, body);
    };
    var deserializeAws_json1_1InternalServiceErrorResponse = async (parsedOutput, context) => {
      const body = parsedOutput.body;
      const deserialized = deserializeAws_json1_1InternalServiceError(body, context);
      const exception = new models_0_1.InternalServiceError({
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized
      });
      return (0, smithy_client_1.decorateServiceException)(exception, body);
    };
    var deserializeAws_json1_1InvalidNextTokenExceptionResponse = async (parsedOutput, context) => {
      const body = parsedOutput.body;
      const deserialized = deserializeAws_json1_1InvalidNextTokenException(body, context);
      const exception = new models_0_1.InvalidNextTokenException({
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized
      });
      return (0, smithy_client_1.decorateServiceException)(exception, body);
    };
    var deserializeAws_json1_1InvalidParameterExceptionResponse = async (parsedOutput, context) => {
      const body = parsedOutput.body;
      const deserialized = deserializeAws_json1_1InvalidParameterException(body, context);
      const exception = new models_0_1.InvalidParameterException({
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized
      });
      return (0, smithy_client_1.decorateServiceException)(exception, body);
    };
    var deserializeAws_json1_1InvalidRequestExceptionResponse = async (parsedOutput, context) => {
      const body = parsedOutput.body;
      const deserialized = deserializeAws_json1_1InvalidRequestException(body, context);
      const exception = new models_0_1.InvalidRequestException({
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized
      });
      return (0, smithy_client_1.decorateServiceException)(exception, body);
    };
    var deserializeAws_json1_1LimitExceededExceptionResponse = async (parsedOutput, context) => {
      const body = parsedOutput.body;
      const deserialized = deserializeAws_json1_1LimitExceededException(body, context);
      const exception = new models_0_1.LimitExceededException({
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized
      });
      return (0, smithy_client_1.decorateServiceException)(exception, body);
    };
    var deserializeAws_json1_1MalformedPolicyDocumentExceptionResponse = async (parsedOutput, context) => {
      const body = parsedOutput.body;
      const deserialized = deserializeAws_json1_1MalformedPolicyDocumentException(body, context);
      const exception = new models_0_1.MalformedPolicyDocumentException({
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized
      });
      return (0, smithy_client_1.decorateServiceException)(exception, body);
    };
    var deserializeAws_json1_1PreconditionNotMetExceptionResponse = async (parsedOutput, context) => {
      const body = parsedOutput.body;
      const deserialized = deserializeAws_json1_1PreconditionNotMetException(body, context);
      const exception = new models_0_1.PreconditionNotMetException({
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized
      });
      return (0, smithy_client_1.decorateServiceException)(exception, body);
    };
    var deserializeAws_json1_1PublicPolicyExceptionResponse = async (parsedOutput, context) => {
      const body = parsedOutput.body;
      const deserialized = deserializeAws_json1_1PublicPolicyException(body, context);
      const exception = new models_0_1.PublicPolicyException({
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized
      });
      return (0, smithy_client_1.decorateServiceException)(exception, body);
    };
    var deserializeAws_json1_1ResourceExistsExceptionResponse = async (parsedOutput, context) => {
      const body = parsedOutput.body;
      const deserialized = deserializeAws_json1_1ResourceExistsException(body, context);
      const exception = new models_0_1.ResourceExistsException({
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized
      });
      return (0, smithy_client_1.decorateServiceException)(exception, body);
    };
    var deserializeAws_json1_1ResourceNotFoundExceptionResponse = async (parsedOutput, context) => {
      const body = parsedOutput.body;
      const deserialized = deserializeAws_json1_1ResourceNotFoundException(body, context);
      const exception = new models_0_1.ResourceNotFoundException({
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized
      });
      return (0, smithy_client_1.decorateServiceException)(exception, body);
    };
    var serializeAws_json1_1AddReplicaRegionListType = (input, context) => {
      return input.filter((e2) => e2 != null).map((entry) => {
        if (entry === null) {
          return null;
        }
        return serializeAws_json1_1ReplicaRegionType(entry, context);
      });
    };
    var serializeAws_json1_1CancelRotateSecretRequest = (input, context) => {
      return {
        ...input.SecretId !== void 0 && input.SecretId !== null && { SecretId: input.SecretId }
      };
    };
    var serializeAws_json1_1CreateSecretRequest = (input, context) => {
      var _a;
      return {
        ...input.AddReplicaRegions !== void 0 && input.AddReplicaRegions !== null && {
          AddReplicaRegions: serializeAws_json1_1AddReplicaRegionListType(input.AddReplicaRegions, context)
        },
        ClientRequestToken: (_a = input.ClientRequestToken) !== null && _a !== void 0 ? _a : (0, uuid_1.v4)(),
        ...input.Description !== void 0 && input.Description !== null && { Description: input.Description },
        ...input.ForceOverwriteReplicaSecret !== void 0 && input.ForceOverwriteReplicaSecret !== null && { ForceOverwriteReplicaSecret: input.ForceOverwriteReplicaSecret },
        ...input.KmsKeyId !== void 0 && input.KmsKeyId !== null && { KmsKeyId: input.KmsKeyId },
        ...input.Name !== void 0 && input.Name !== null && { Name: input.Name },
        ...input.SecretBinary !== void 0 && input.SecretBinary !== null && { SecretBinary: context.base64Encoder(input.SecretBinary) },
        ...input.SecretString !== void 0 && input.SecretString !== null && { SecretString: input.SecretString },
        ...input.Tags !== void 0 && input.Tags !== null && { Tags: serializeAws_json1_1TagListType(input.Tags, context) }
      };
    };
    var serializeAws_json1_1DeleteResourcePolicyRequest = (input, context) => {
      return {
        ...input.SecretId !== void 0 && input.SecretId !== null && { SecretId: input.SecretId }
      };
    };
    var serializeAws_json1_1DeleteSecretRequest = (input, context) => {
      return {
        ...input.ForceDeleteWithoutRecovery !== void 0 && input.ForceDeleteWithoutRecovery !== null && { ForceDeleteWithoutRecovery: input.ForceDeleteWithoutRecovery },
        ...input.RecoveryWindowInDays !== void 0 && input.RecoveryWindowInDays !== null && { RecoveryWindowInDays: input.RecoveryWindowInDays },
        ...input.SecretId !== void 0 && input.SecretId !== null && { SecretId: input.SecretId }
      };
    };
    var serializeAws_json1_1DescribeSecretRequest = (input, context) => {
      return {
        ...input.SecretId !== void 0 && input.SecretId !== null && { SecretId: input.SecretId }
      };
    };
    var serializeAws_json1_1Filter = (input, context) => {
      return {
        ...input.Key !== void 0 && input.Key !== null && { Key: input.Key },
        ...input.Values !== void 0 && input.Values !== null && { Values: serializeAws_json1_1FilterValuesStringList(input.Values, context) }
      };
    };
    var serializeAws_json1_1FiltersListType = (input, context) => {
      return input.filter((e2) => e2 != null).map((entry) => {
        if (entry === null) {
          return null;
        }
        return serializeAws_json1_1Filter(entry, context);
      });
    };
    var serializeAws_json1_1FilterValuesStringList = (input, context) => {
      return input.filter((e2) => e2 != null).map((entry) => {
        if (entry === null) {
          return null;
        }
        return entry;
      });
    };
    var serializeAws_json1_1GetRandomPasswordRequest = (input, context) => {
      return {
        ...input.ExcludeCharacters !== void 0 && input.ExcludeCharacters !== null && { ExcludeCharacters: input.ExcludeCharacters },
        ...input.ExcludeLowercase !== void 0 && input.ExcludeLowercase !== null && { ExcludeLowercase: input.ExcludeLowercase },
        ...input.ExcludeNumbers !== void 0 && input.ExcludeNumbers !== null && { ExcludeNumbers: input.ExcludeNumbers },
        ...input.ExcludePunctuation !== void 0 && input.ExcludePunctuation !== null && { ExcludePunctuation: input.ExcludePunctuation },
        ...input.ExcludeUppercase !== void 0 && input.ExcludeUppercase !== null && { ExcludeUppercase: input.ExcludeUppercase },
        ...input.IncludeSpace !== void 0 && input.IncludeSpace !== null && { IncludeSpace: input.IncludeSpace },
        ...input.PasswordLength !== void 0 && input.PasswordLength !== null && { PasswordLength: input.PasswordLength },
        ...input.RequireEachIncludedType !== void 0 && input.RequireEachIncludedType !== null && { RequireEachIncludedType: input.RequireEachIncludedType }
      };
    };
    var serializeAws_json1_1GetResourcePolicyRequest = (input, context) => {
      return {
        ...input.SecretId !== void 0 && input.SecretId !== null && { SecretId: input.SecretId }
      };
    };
    var serializeAws_json1_1GetSecretValueRequest = (input, context) => {
      return {
        ...input.SecretId !== void 0 && input.SecretId !== null && { SecretId: input.SecretId },
        ...input.VersionId !== void 0 && input.VersionId !== null && { VersionId: input.VersionId },
        ...input.VersionStage !== void 0 && input.VersionStage !== null && { VersionStage: input.VersionStage }
      };
    };
    var serializeAws_json1_1ListSecretsRequest = (input, context) => {
      return {
        ...input.Filters !== void 0 && input.Filters !== null && { Filters: serializeAws_json1_1FiltersListType(input.Filters, context) },
        ...input.MaxResults !== void 0 && input.MaxResults !== null && { MaxResults: input.MaxResults },
        ...input.NextToken !== void 0 && input.NextToken !== null && { NextToken: input.NextToken },
        ...input.SortOrder !== void 0 && input.SortOrder !== null && { SortOrder: input.SortOrder }
      };
    };
    var serializeAws_json1_1ListSecretVersionIdsRequest = (input, context) => {
      return {
        ...input.IncludeDeprecated !== void 0 && input.IncludeDeprecated !== null && { IncludeDeprecated: input.IncludeDeprecated },
        ...input.MaxResults !== void 0 && input.MaxResults !== null && { MaxResults: input.MaxResults },
        ...input.NextToken !== void 0 && input.NextToken !== null && { NextToken: input.NextToken },
        ...input.SecretId !== void 0 && input.SecretId !== null && { SecretId: input.SecretId }
      };
    };
    var serializeAws_json1_1PutResourcePolicyRequest = (input, context) => {
      return {
        ...input.BlockPublicPolicy !== void 0 && input.BlockPublicPolicy !== null && { BlockPublicPolicy: input.BlockPublicPolicy },
        ...input.ResourcePolicy !== void 0 && input.ResourcePolicy !== null && { ResourcePolicy: input.ResourcePolicy },
        ...input.SecretId !== void 0 && input.SecretId !== null && { SecretId: input.SecretId }
      };
    };
    var serializeAws_json1_1PutSecretValueRequest = (input, context) => {
      var _a;
      return {
        ClientRequestToken: (_a = input.ClientRequestToken) !== null && _a !== void 0 ? _a : (0, uuid_1.v4)(),
        ...input.SecretBinary !== void 0 && input.SecretBinary !== null && { SecretBinary: context.base64Encoder(input.SecretBinary) },
        ...input.SecretId !== void 0 && input.SecretId !== null && { SecretId: input.SecretId },
        ...input.SecretString !== void 0 && input.SecretString !== null && { SecretString: input.SecretString },
        ...input.VersionStages !== void 0 && input.VersionStages !== null && {
          VersionStages: serializeAws_json1_1SecretVersionStagesType(input.VersionStages, context)
        }
      };
    };
    var serializeAws_json1_1RemoveRegionsFromReplicationRequest = (input, context) => {
      return {
        ...input.RemoveReplicaRegions !== void 0 && input.RemoveReplicaRegions !== null && {
          RemoveReplicaRegions: serializeAws_json1_1RemoveReplicaRegionListType(input.RemoveReplicaRegions, context)
        },
        ...input.SecretId !== void 0 && input.SecretId !== null && { SecretId: input.SecretId }
      };
    };
    var serializeAws_json1_1RemoveReplicaRegionListType = (input, context) => {
      return input.filter((e2) => e2 != null).map((entry) => {
        if (entry === null) {
          return null;
        }
        return entry;
      });
    };
    var serializeAws_json1_1ReplicaRegionType = (input, context) => {
      return {
        ...input.KmsKeyId !== void 0 && input.KmsKeyId !== null && { KmsKeyId: input.KmsKeyId },
        ...input.Region !== void 0 && input.Region !== null && { Region: input.Region }
      };
    };
    var serializeAws_json1_1ReplicateSecretToRegionsRequest = (input, context) => {
      return {
        ...input.AddReplicaRegions !== void 0 && input.AddReplicaRegions !== null && {
          AddReplicaRegions: serializeAws_json1_1AddReplicaRegionListType(input.AddReplicaRegions, context)
        },
        ...input.ForceOverwriteReplicaSecret !== void 0 && input.ForceOverwriteReplicaSecret !== null && { ForceOverwriteReplicaSecret: input.ForceOverwriteReplicaSecret },
        ...input.SecretId !== void 0 && input.SecretId !== null && { SecretId: input.SecretId }
      };
    };
    var serializeAws_json1_1RestoreSecretRequest = (input, context) => {
      return {
        ...input.SecretId !== void 0 && input.SecretId !== null && { SecretId: input.SecretId }
      };
    };
    var serializeAws_json1_1RotateSecretRequest = (input, context) => {
      var _a;
      return {
        ClientRequestToken: (_a = input.ClientRequestToken) !== null && _a !== void 0 ? _a : (0, uuid_1.v4)(),
        ...input.RotateImmediately !== void 0 && input.RotateImmediately !== null && { RotateImmediately: input.RotateImmediately },
        ...input.RotationLambdaARN !== void 0 && input.RotationLambdaARN !== null && { RotationLambdaARN: input.RotationLambdaARN },
        ...input.RotationRules !== void 0 && input.RotationRules !== null && {
          RotationRules: serializeAws_json1_1RotationRulesType(input.RotationRules, context)
        },
        ...input.SecretId !== void 0 && input.SecretId !== null && { SecretId: input.SecretId }
      };
    };
    var serializeAws_json1_1RotationRulesType = (input, context) => {
      return {
        ...input.AutomaticallyAfterDays !== void 0 && input.AutomaticallyAfterDays !== null && { AutomaticallyAfterDays: input.AutomaticallyAfterDays },
        ...input.Duration !== void 0 && input.Duration !== null && { Duration: input.Duration },
        ...input.ScheduleExpression !== void 0 && input.ScheduleExpression !== null && { ScheduleExpression: input.ScheduleExpression }
      };
    };
    var serializeAws_json1_1SecretVersionStagesType = (input, context) => {
      return input.filter((e2) => e2 != null).map((entry) => {
        if (entry === null) {
          return null;
        }
        return entry;
      });
    };
    var serializeAws_json1_1StopReplicationToReplicaRequest = (input, context) => {
      return {
        ...input.SecretId !== void 0 && input.SecretId !== null && { SecretId: input.SecretId }
      };
    };
    var serializeAws_json1_1Tag = (input, context) => {
      return {
        ...input.Key !== void 0 && input.Key !== null && { Key: input.Key },
        ...input.Value !== void 0 && input.Value !== null && { Value: input.Value }
      };
    };
    var serializeAws_json1_1TagKeyListType = (input, context) => {
      return input.filter((e2) => e2 != null).map((entry) => {
        if (entry === null) {
          return null;
        }
        return entry;
      });
    };
    var serializeAws_json1_1TagListType = (input, context) => {
      return input.filter((e2) => e2 != null).map((entry) => {
        if (entry === null) {
          return null;
        }
        return serializeAws_json1_1Tag(entry, context);
      });
    };
    var serializeAws_json1_1TagResourceRequest = (input, context) => {
      return {
        ...input.SecretId !== void 0 && input.SecretId !== null && { SecretId: input.SecretId },
        ...input.Tags !== void 0 && input.Tags !== null && { Tags: serializeAws_json1_1TagListType(input.Tags, context) }
      };
    };
    var serializeAws_json1_1UntagResourceRequest = (input, context) => {
      return {
        ...input.SecretId !== void 0 && input.SecretId !== null && { SecretId: input.SecretId },
        ...input.TagKeys !== void 0 && input.TagKeys !== null && { TagKeys: serializeAws_json1_1TagKeyListType(input.TagKeys, context) }
      };
    };
    var serializeAws_json1_1UpdateSecretRequest = (input, context) => {
      var _a;
      return {
        ClientRequestToken: (_a = input.ClientRequestToken) !== null && _a !== void 0 ? _a : (0, uuid_1.v4)(),
        ...input.Description !== void 0 && input.Description !== null && { Description: input.Description },
        ...input.KmsKeyId !== void 0 && input.KmsKeyId !== null && { KmsKeyId: input.KmsKeyId },
        ...input.SecretBinary !== void 0 && input.SecretBinary !== null && { SecretBinary: context.base64Encoder(input.SecretBinary) },
        ...input.SecretId !== void 0 && input.SecretId !== null && { SecretId: input.SecretId },
        ...input.SecretString !== void 0 && input.SecretString !== null && { SecretString: input.SecretString }
      };
    };
    var serializeAws_json1_1UpdateSecretVersionStageRequest = (input, context) => {
      return {
        ...input.MoveToVersionId !== void 0 && input.MoveToVersionId !== null && { MoveToVersionId: input.MoveToVersionId },
        ...input.RemoveFromVersionId !== void 0 && input.RemoveFromVersionId !== null && { RemoveFromVersionId: input.RemoveFromVersionId },
        ...input.SecretId !== void 0 && input.SecretId !== null && { SecretId: input.SecretId },
        ...input.VersionStage !== void 0 && input.VersionStage !== null && { VersionStage: input.VersionStage }
      };
    };
    var serializeAws_json1_1ValidateResourcePolicyRequest = (input, context) => {
      return {
        ...input.ResourcePolicy !== void 0 && input.ResourcePolicy !== null && { ResourcePolicy: input.ResourcePolicy },
        ...input.SecretId !== void 0 && input.SecretId !== null && { SecretId: input.SecretId }
      };
    };
    var deserializeAws_json1_1CancelRotateSecretResponse = (output, context) => {
      return {
        ARN: (0, smithy_client_1.expectString)(output.ARN),
        Name: (0, smithy_client_1.expectString)(output.Name),
        VersionId: (0, smithy_client_1.expectString)(output.VersionId)
      };
    };
    var deserializeAws_json1_1CreateSecretResponse = (output, context) => {
      return {
        ARN: (0, smithy_client_1.expectString)(output.ARN),
        Name: (0, smithy_client_1.expectString)(output.Name),
        ReplicationStatus: output.ReplicationStatus !== void 0 && output.ReplicationStatus !== null ? deserializeAws_json1_1ReplicationStatusListType(output.ReplicationStatus, context) : void 0,
        VersionId: (0, smithy_client_1.expectString)(output.VersionId)
      };
    };
    var deserializeAws_json1_1DecryptionFailure = (output, context) => {
      return {
        Message: (0, smithy_client_1.expectString)(output.Message)
      };
    };
    var deserializeAws_json1_1DeleteResourcePolicyResponse = (output, context) => {
      return {
        ARN: (0, smithy_client_1.expectString)(output.ARN),
        Name: (0, smithy_client_1.expectString)(output.Name)
      };
    };
    var deserializeAws_json1_1DeleteSecretResponse = (output, context) => {
      return {
        ARN: (0, smithy_client_1.expectString)(output.ARN),
        DeletionDate: output.DeletionDate !== void 0 && output.DeletionDate !== null ? (0, smithy_client_1.expectNonNull)((0, smithy_client_1.parseEpochTimestamp)((0, smithy_client_1.expectNumber)(output.DeletionDate))) : void 0,
        Name: (0, smithy_client_1.expectString)(output.Name)
      };
    };
    var deserializeAws_json1_1DescribeSecretResponse = (output, context) => {
      return {
        ARN: (0, smithy_client_1.expectString)(output.ARN),
        CreatedDate: output.CreatedDate !== void 0 && output.CreatedDate !== null ? (0, smithy_client_1.expectNonNull)((0, smithy_client_1.parseEpochTimestamp)((0, smithy_client_1.expectNumber)(output.CreatedDate))) : void 0,
        DeletedDate: output.DeletedDate !== void 0 && output.DeletedDate !== null ? (0, smithy_client_1.expectNonNull)((0, smithy_client_1.parseEpochTimestamp)((0, smithy_client_1.expectNumber)(output.DeletedDate))) : void 0,
        Description: (0, smithy_client_1.expectString)(output.Description),
        KmsKeyId: (0, smithy_client_1.expectString)(output.KmsKeyId),
        LastAccessedDate: output.LastAccessedDate !== void 0 && output.LastAccessedDate !== null ? (0, smithy_client_1.expectNonNull)((0, smithy_client_1.parseEpochTimestamp)((0, smithy_client_1.expectNumber)(output.LastAccessedDate))) : void 0,
        LastChangedDate: output.LastChangedDate !== void 0 && output.LastChangedDate !== null ? (0, smithy_client_1.expectNonNull)((0, smithy_client_1.parseEpochTimestamp)((0, smithy_client_1.expectNumber)(output.LastChangedDate))) : void 0,
        LastRotatedDate: output.LastRotatedDate !== void 0 && output.LastRotatedDate !== null ? (0, smithy_client_1.expectNonNull)((0, smithy_client_1.parseEpochTimestamp)((0, smithy_client_1.expectNumber)(output.LastRotatedDate))) : void 0,
        Name: (0, smithy_client_1.expectString)(output.Name),
        OwningService: (0, smithy_client_1.expectString)(output.OwningService),
        PrimaryRegion: (0, smithy_client_1.expectString)(output.PrimaryRegion),
        ReplicationStatus: output.ReplicationStatus !== void 0 && output.ReplicationStatus !== null ? deserializeAws_json1_1ReplicationStatusListType(output.ReplicationStatus, context) : void 0,
        RotationEnabled: (0, smithy_client_1.expectBoolean)(output.RotationEnabled),
        RotationLambdaARN: (0, smithy_client_1.expectString)(output.RotationLambdaARN),
        RotationRules: output.RotationRules !== void 0 && output.RotationRules !== null ? deserializeAws_json1_1RotationRulesType(output.RotationRules, context) : void 0,
        Tags: output.Tags !== void 0 && output.Tags !== null ? deserializeAws_json1_1TagListType(output.Tags, context) : void 0,
        VersionIdsToStages: output.VersionIdsToStages !== void 0 && output.VersionIdsToStages !== null ? deserializeAws_json1_1SecretVersionsToStagesMapType(output.VersionIdsToStages, context) : void 0
      };
    };
    var deserializeAws_json1_1EncryptionFailure = (output, context) => {
      return {
        Message: (0, smithy_client_1.expectString)(output.Message)
      };
    };
    var deserializeAws_json1_1GetRandomPasswordResponse = (output, context) => {
      return {
        RandomPassword: (0, smithy_client_1.expectString)(output.RandomPassword)
      };
    };
    var deserializeAws_json1_1GetResourcePolicyResponse = (output, context) => {
      return {
        ARN: (0, smithy_client_1.expectString)(output.ARN),
        Name: (0, smithy_client_1.expectString)(output.Name),
        ResourcePolicy: (0, smithy_client_1.expectString)(output.ResourcePolicy)
      };
    };
    var deserializeAws_json1_1GetSecretValueResponse = (output, context) => {
      return {
        ARN: (0, smithy_client_1.expectString)(output.ARN),
        CreatedDate: output.CreatedDate !== void 0 && output.CreatedDate !== null ? (0, smithy_client_1.expectNonNull)((0, smithy_client_1.parseEpochTimestamp)((0, smithy_client_1.expectNumber)(output.CreatedDate))) : void 0,
        Name: (0, smithy_client_1.expectString)(output.Name),
        SecretBinary: output.SecretBinary !== void 0 && output.SecretBinary !== null ? context.base64Decoder(output.SecretBinary) : void 0,
        SecretString: (0, smithy_client_1.expectString)(output.SecretString),
        VersionId: (0, smithy_client_1.expectString)(output.VersionId),
        VersionStages: output.VersionStages !== void 0 && output.VersionStages !== null ? deserializeAws_json1_1SecretVersionStagesType(output.VersionStages, context) : void 0
      };
    };
    var deserializeAws_json1_1InternalServiceError = (output, context) => {
      return {
        Message: (0, smithy_client_1.expectString)(output.Message)
      };
    };
    var deserializeAws_json1_1InvalidNextTokenException = (output, context) => {
      return {
        Message: (0, smithy_client_1.expectString)(output.Message)
      };
    };
    var deserializeAws_json1_1InvalidParameterException = (output, context) => {
      return {
        Message: (0, smithy_client_1.expectString)(output.Message)
      };
    };
    var deserializeAws_json1_1InvalidRequestException = (output, context) => {
      return {
        Message: (0, smithy_client_1.expectString)(output.Message)
      };
    };
    var deserializeAws_json1_1KmsKeyIdListType = (output, context) => {
      const retVal = (output || []).filter((e2) => e2 != null).map((entry) => {
        if (entry === null) {
          return null;
        }
        return (0, smithy_client_1.expectString)(entry);
      });
      return retVal;
    };
    var deserializeAws_json1_1LimitExceededException = (output, context) => {
      return {
        Message: (0, smithy_client_1.expectString)(output.Message)
      };
    };
    var deserializeAws_json1_1ListSecretsResponse = (output, context) => {
      return {
        NextToken: (0, smithy_client_1.expectString)(output.NextToken),
        SecretList: output.SecretList !== void 0 && output.SecretList !== null ? deserializeAws_json1_1SecretListType(output.SecretList, context) : void 0
      };
    };
    var deserializeAws_json1_1ListSecretVersionIdsResponse = (output, context) => {
      return {
        ARN: (0, smithy_client_1.expectString)(output.ARN),
        Name: (0, smithy_client_1.expectString)(output.Name),
        NextToken: (0, smithy_client_1.expectString)(output.NextToken),
        Versions: output.Versions !== void 0 && output.Versions !== null ? deserializeAws_json1_1SecretVersionsListType(output.Versions, context) : void 0
      };
    };
    var deserializeAws_json1_1MalformedPolicyDocumentException = (output, context) => {
      return {
        Message: (0, smithy_client_1.expectString)(output.Message)
      };
    };
    var deserializeAws_json1_1PreconditionNotMetException = (output, context) => {
      return {
        Message: (0, smithy_client_1.expectString)(output.Message)
      };
    };
    var deserializeAws_json1_1PublicPolicyException = (output, context) => {
      return {
        Message: (0, smithy_client_1.expectString)(output.Message)
      };
    };
    var deserializeAws_json1_1PutResourcePolicyResponse = (output, context) => {
      return {
        ARN: (0, smithy_client_1.expectString)(output.ARN),
        Name: (0, smithy_client_1.expectString)(output.Name)
      };
    };
    var deserializeAws_json1_1PutSecretValueResponse = (output, context) => {
      return {
        ARN: (0, smithy_client_1.expectString)(output.ARN),
        Name: (0, smithy_client_1.expectString)(output.Name),
        VersionId: (0, smithy_client_1.expectString)(output.VersionId),
        VersionStages: output.VersionStages !== void 0 && output.VersionStages !== null ? deserializeAws_json1_1SecretVersionStagesType(output.VersionStages, context) : void 0
      };
    };
    var deserializeAws_json1_1RemoveRegionsFromReplicationResponse = (output, context) => {
      return {
        ARN: (0, smithy_client_1.expectString)(output.ARN),
        ReplicationStatus: output.ReplicationStatus !== void 0 && output.ReplicationStatus !== null ? deserializeAws_json1_1ReplicationStatusListType(output.ReplicationStatus, context) : void 0
      };
    };
    var deserializeAws_json1_1ReplicateSecretToRegionsResponse = (output, context) => {
      return {
        ARN: (0, smithy_client_1.expectString)(output.ARN),
        ReplicationStatus: output.ReplicationStatus !== void 0 && output.ReplicationStatus !== null ? deserializeAws_json1_1ReplicationStatusListType(output.ReplicationStatus, context) : void 0
      };
    };
    var deserializeAws_json1_1ReplicationStatusListType = (output, context) => {
      const retVal = (output || []).filter((e2) => e2 != null).map((entry) => {
        if (entry === null) {
          return null;
        }
        return deserializeAws_json1_1ReplicationStatusType(entry, context);
      });
      return retVal;
    };
    var deserializeAws_json1_1ReplicationStatusType = (output, context) => {
      return {
        KmsKeyId: (0, smithy_client_1.expectString)(output.KmsKeyId),
        LastAccessedDate: output.LastAccessedDate !== void 0 && output.LastAccessedDate !== null ? (0, smithy_client_1.expectNonNull)((0, smithy_client_1.parseEpochTimestamp)((0, smithy_client_1.expectNumber)(output.LastAccessedDate))) : void 0,
        Region: (0, smithy_client_1.expectString)(output.Region),
        Status: (0, smithy_client_1.expectString)(output.Status),
        StatusMessage: (0, smithy_client_1.expectString)(output.StatusMessage)
      };
    };
    var deserializeAws_json1_1ResourceExistsException = (output, context) => {
      return {
        Message: (0, smithy_client_1.expectString)(output.Message)
      };
    };
    var deserializeAws_json1_1ResourceNotFoundException = (output, context) => {
      return {
        Message: (0, smithy_client_1.expectString)(output.Message)
      };
    };
    var deserializeAws_json1_1RestoreSecretResponse = (output, context) => {
      return {
        ARN: (0, smithy_client_1.expectString)(output.ARN),
        Name: (0, smithy_client_1.expectString)(output.Name)
      };
    };
    var deserializeAws_json1_1RotateSecretResponse = (output, context) => {
      return {
        ARN: (0, smithy_client_1.expectString)(output.ARN),
        Name: (0, smithy_client_1.expectString)(output.Name),
        VersionId: (0, smithy_client_1.expectString)(output.VersionId)
      };
    };
    var deserializeAws_json1_1RotationRulesType = (output, context) => {
      return {
        AutomaticallyAfterDays: (0, smithy_client_1.expectLong)(output.AutomaticallyAfterDays),
        Duration: (0, smithy_client_1.expectString)(output.Duration),
        ScheduleExpression: (0, smithy_client_1.expectString)(output.ScheduleExpression)
      };
    };
    var deserializeAws_json1_1SecretListEntry = (output, context) => {
      return {
        ARN: (0, smithy_client_1.expectString)(output.ARN),
        CreatedDate: output.CreatedDate !== void 0 && output.CreatedDate !== null ? (0, smithy_client_1.expectNonNull)((0, smithy_client_1.parseEpochTimestamp)((0, smithy_client_1.expectNumber)(output.CreatedDate))) : void 0,
        DeletedDate: output.DeletedDate !== void 0 && output.DeletedDate !== null ? (0, smithy_client_1.expectNonNull)((0, smithy_client_1.parseEpochTimestamp)((0, smithy_client_1.expectNumber)(output.DeletedDate))) : void 0,
        Description: (0, smithy_client_1.expectString)(output.Description),
        KmsKeyId: (0, smithy_client_1.expectString)(output.KmsKeyId),
        LastAccessedDate: output.LastAccessedDate !== void 0 && output.LastAccessedDate !== null ? (0, smithy_client_1.expectNonNull)((0, smithy_client_1.parseEpochTimestamp)((0, smithy_client_1.expectNumber)(output.LastAccessedDate))) : void 0,
        LastChangedDate: output.LastChangedDate !== void 0 && output.LastChangedDate !== null ? (0, smithy_client_1.expectNonNull)((0, smithy_client_1.parseEpochTimestamp)((0, smithy_client_1.expectNumber)(output.LastChangedDate))) : void 0,
        LastRotatedDate: output.LastRotatedDate !== void 0 && output.LastRotatedDate !== null ? (0, smithy_client_1.expectNonNull)((0, smithy_client_1.parseEpochTimestamp)((0, smithy_client_1.expectNumber)(output.LastRotatedDate))) : void 0,
        Name: (0, smithy_client_1.expectString)(output.Name),
        OwningService: (0, smithy_client_1.expectString)(output.OwningService),
        PrimaryRegion: (0, smithy_client_1.expectString)(output.PrimaryRegion),
        RotationEnabled: (0, smithy_client_1.expectBoolean)(output.RotationEnabled),
        RotationLambdaARN: (0, smithy_client_1.expectString)(output.RotationLambdaARN),
        RotationRules: output.RotationRules !== void 0 && output.RotationRules !== null ? deserializeAws_json1_1RotationRulesType(output.RotationRules, context) : void 0,
        SecretVersionsToStages: output.SecretVersionsToStages !== void 0 && output.SecretVersionsToStages !== null ? deserializeAws_json1_1SecretVersionsToStagesMapType(output.SecretVersionsToStages, context) : void 0,
        Tags: output.Tags !== void 0 && output.Tags !== null ? deserializeAws_json1_1TagListType(output.Tags, context) : void 0
      };
    };
    var deserializeAws_json1_1SecretListType = (output, context) => {
      const retVal = (output || []).filter((e2) => e2 != null).map((entry) => {
        if (entry === null) {
          return null;
        }
        return deserializeAws_json1_1SecretListEntry(entry, context);
      });
      return retVal;
    };
    var deserializeAws_json1_1SecretVersionsListEntry = (output, context) => {
      return {
        CreatedDate: output.CreatedDate !== void 0 && output.CreatedDate !== null ? (0, smithy_client_1.expectNonNull)((0, smithy_client_1.parseEpochTimestamp)((0, smithy_client_1.expectNumber)(output.CreatedDate))) : void 0,
        KmsKeyIds: output.KmsKeyIds !== void 0 && output.KmsKeyIds !== null ? deserializeAws_json1_1KmsKeyIdListType(output.KmsKeyIds, context) : void 0,
        LastAccessedDate: output.LastAccessedDate !== void 0 && output.LastAccessedDate !== null ? (0, smithy_client_1.expectNonNull)((0, smithy_client_1.parseEpochTimestamp)((0, smithy_client_1.expectNumber)(output.LastAccessedDate))) : void 0,
        VersionId: (0, smithy_client_1.expectString)(output.VersionId),
        VersionStages: output.VersionStages !== void 0 && output.VersionStages !== null ? deserializeAws_json1_1SecretVersionStagesType(output.VersionStages, context) : void 0
      };
    };
    var deserializeAws_json1_1SecretVersionsListType = (output, context) => {
      const retVal = (output || []).filter((e2) => e2 != null).map((entry) => {
        if (entry === null) {
          return null;
        }
        return deserializeAws_json1_1SecretVersionsListEntry(entry, context);
      });
      return retVal;
    };
    var deserializeAws_json1_1SecretVersionStagesType = (output, context) => {
      const retVal = (output || []).filter((e2) => e2 != null).map((entry) => {
        if (entry === null) {
          return null;
        }
        return (0, smithy_client_1.expectString)(entry);
      });
      return retVal;
    };
    var deserializeAws_json1_1SecretVersionsToStagesMapType = (output, context) => {
      return Object.entries(output).reduce((acc, [key, value]) => {
        if (value === null) {
          return acc;
        }
        return {
          ...acc,
          [key]: deserializeAws_json1_1SecretVersionStagesType(value, context)
        };
      }, {});
    };
    var deserializeAws_json1_1StopReplicationToReplicaResponse = (output, context) => {
      return {
        ARN: (0, smithy_client_1.expectString)(output.ARN)
      };
    };
    var deserializeAws_json1_1Tag = (output, context) => {
      return {
        Key: (0, smithy_client_1.expectString)(output.Key),
        Value: (0, smithy_client_1.expectString)(output.Value)
      };
    };
    var deserializeAws_json1_1TagListType = (output, context) => {
      const retVal = (output || []).filter((e2) => e2 != null).map((entry) => {
        if (entry === null) {
          return null;
        }
        return deserializeAws_json1_1Tag(entry, context);
      });
      return retVal;
    };
    var deserializeAws_json1_1UpdateSecretResponse = (output, context) => {
      return {
        ARN: (0, smithy_client_1.expectString)(output.ARN),
        Name: (0, smithy_client_1.expectString)(output.Name),
        VersionId: (0, smithy_client_1.expectString)(output.VersionId)
      };
    };
    var deserializeAws_json1_1UpdateSecretVersionStageResponse = (output, context) => {
      return {
        ARN: (0, smithy_client_1.expectString)(output.ARN),
        Name: (0, smithy_client_1.expectString)(output.Name)
      };
    };
    var deserializeAws_json1_1ValidateResourcePolicyResponse = (output, context) => {
      return {
        PolicyValidationPassed: (0, smithy_client_1.expectBoolean)(output.PolicyValidationPassed),
        ValidationErrors: output.ValidationErrors !== void 0 && output.ValidationErrors !== null ? deserializeAws_json1_1ValidationErrorsType(output.ValidationErrors, context) : void 0
      };
    };
    var deserializeAws_json1_1ValidationErrorsEntry = (output, context) => {
      return {
        CheckName: (0, smithy_client_1.expectString)(output.CheckName),
        ErrorMessage: (0, smithy_client_1.expectString)(output.ErrorMessage)
      };
    };
    var deserializeAws_json1_1ValidationErrorsType = (output, context) => {
      const retVal = (output || []).filter((e2) => e2 != null).map((entry) => {
        if (entry === null) {
          return null;
        }
        return deserializeAws_json1_1ValidationErrorsEntry(entry, context);
      });
      return retVal;
    };
    var deserializeMetadata = (output) => {
      var _a;
      return {
        httpStatusCode: output.statusCode,
        requestId: (_a = output.headers["x-amzn-requestid"]) !== null && _a !== void 0 ? _a : output.headers["x-amzn-request-id"],
        extendedRequestId: output.headers["x-amz-id-2"],
        cfId: output.headers["x-amz-cf-id"]
      };
    };
    var collectBody = (streamBody = new Uint8Array(), context) => {
      if (streamBody instanceof Uint8Array) {
        return Promise.resolve(streamBody);
      }
      return context.streamCollector(streamBody) || Promise.resolve(new Uint8Array());
    };
    var collectBodyString = (streamBody, context) => collectBody(streamBody, context).then((body) => context.utf8Encoder(body));
    var buildHttpRpcRequest = async (context, headers, path, resolvedHostname, body) => {
      const { hostname, protocol = "https", port, path: basePath } = await context.endpoint();
      const contents = {
        protocol,
        hostname,
        port,
        method: "POST",
        path: basePath.endsWith("/") ? basePath.slice(0, -1) + path : basePath + path,
        headers
      };
      if (resolvedHostname !== void 0) {
        contents.hostname = resolvedHostname;
      }
      if (body !== void 0) {
        contents.body = body;
      }
      return new protocol_http_1.HttpRequest(contents);
    };
    var parseBody = (streamBody, context) => collectBodyString(streamBody, context).then((encoded) => {
      if (encoded.length) {
        return JSON.parse(encoded);
      }
      return {};
    });
    var loadRestJsonErrorCode = (output, data) => {
      const findKey = (object, key) => Object.keys(object).find((k) => k.toLowerCase() === key.toLowerCase());
      const sanitizeErrorCode = (rawValue) => {
        let cleanValue = rawValue;
        if (cleanValue.indexOf(":") >= 0) {
          cleanValue = cleanValue.split(":")[0];
        }
        if (cleanValue.indexOf("#") >= 0) {
          cleanValue = cleanValue.split("#")[1];
        }
        return cleanValue;
      };
      const headerKey = findKey(output.headers, "x-amzn-errortype");
      if (headerKey !== void 0) {
        return sanitizeErrorCode(output.headers[headerKey]);
      }
      if (data.code !== void 0) {
        return sanitizeErrorCode(data.code);
      }
      if (data["__type"] !== void 0) {
        return sanitizeErrorCode(data["__type"]);
      }
      return "";
    };
  }
});

// node_modules/@aws-sdk/client-secrets-manager/dist-cjs/commands/CancelRotateSecretCommand.js
var require_CancelRotateSecretCommand = __commonJS({
  "node_modules/@aws-sdk/client-secrets-manager/dist-cjs/commands/CancelRotateSecretCommand.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CancelRotateSecretCommand = void 0;
    var middleware_serde_1 = require_dist_cjs();
    var smithy_client_1 = require_dist_cjs3();
    var models_0_1 = require_models_0();
    var Aws_json1_1_1 = require_Aws_json1_1();
    var CancelRotateSecretCommand = class extends smithy_client_1.Command {
      constructor(input) {
        super();
        this.input = input;
      }
      resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use((0, middleware_serde_1.getSerdePlugin)(configuration, this.serialize, this.deserialize));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "SecretsManagerClient";
        const commandName = "CancelRotateSecretCommand";
        const handlerExecutionContext = {
          logger,
          clientName,
          commandName,
          inputFilterSensitiveLog: models_0_1.CancelRotateSecretRequest.filterSensitiveLog,
          outputFilterSensitiveLog: models_0_1.CancelRotateSecretResponse.filterSensitiveLog
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
      }
      serialize(input, context) {
        return (0, Aws_json1_1_1.serializeAws_json1_1CancelRotateSecretCommand)(input, context);
      }
      deserialize(output, context) {
        return (0, Aws_json1_1_1.deserializeAws_json1_1CancelRotateSecretCommand)(output, context);
      }
    };
    exports.CancelRotateSecretCommand = CancelRotateSecretCommand;
  }
});

// node_modules/@aws-sdk/client-secrets-manager/dist-cjs/commands/CreateSecretCommand.js
var require_CreateSecretCommand = __commonJS({
  "node_modules/@aws-sdk/client-secrets-manager/dist-cjs/commands/CreateSecretCommand.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CreateSecretCommand = void 0;
    var middleware_serde_1 = require_dist_cjs();
    var smithy_client_1 = require_dist_cjs3();
    var models_0_1 = require_models_0();
    var Aws_json1_1_1 = require_Aws_json1_1();
    var CreateSecretCommand = class extends smithy_client_1.Command {
      constructor(input) {
        super();
        this.input = input;
      }
      resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use((0, middleware_serde_1.getSerdePlugin)(configuration, this.serialize, this.deserialize));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "SecretsManagerClient";
        const commandName = "CreateSecretCommand";
        const handlerExecutionContext = {
          logger,
          clientName,
          commandName,
          inputFilterSensitiveLog: models_0_1.CreateSecretRequest.filterSensitiveLog,
          outputFilterSensitiveLog: models_0_1.CreateSecretResponse.filterSensitiveLog
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
      }
      serialize(input, context) {
        return (0, Aws_json1_1_1.serializeAws_json1_1CreateSecretCommand)(input, context);
      }
      deserialize(output, context) {
        return (0, Aws_json1_1_1.deserializeAws_json1_1CreateSecretCommand)(output, context);
      }
    };
    exports.CreateSecretCommand = CreateSecretCommand;
  }
});

// node_modules/@aws-sdk/client-secrets-manager/dist-cjs/commands/DeleteResourcePolicyCommand.js
var require_DeleteResourcePolicyCommand = __commonJS({
  "node_modules/@aws-sdk/client-secrets-manager/dist-cjs/commands/DeleteResourcePolicyCommand.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DeleteResourcePolicyCommand = void 0;
    var middleware_serde_1 = require_dist_cjs();
    var smithy_client_1 = require_dist_cjs3();
    var models_0_1 = require_models_0();
    var Aws_json1_1_1 = require_Aws_json1_1();
    var DeleteResourcePolicyCommand = class extends smithy_client_1.Command {
      constructor(input) {
        super();
        this.input = input;
      }
      resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use((0, middleware_serde_1.getSerdePlugin)(configuration, this.serialize, this.deserialize));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "SecretsManagerClient";
        const commandName = "DeleteResourcePolicyCommand";
        const handlerExecutionContext = {
          logger,
          clientName,
          commandName,
          inputFilterSensitiveLog: models_0_1.DeleteResourcePolicyRequest.filterSensitiveLog,
          outputFilterSensitiveLog: models_0_1.DeleteResourcePolicyResponse.filterSensitiveLog
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
      }
      serialize(input, context) {
        return (0, Aws_json1_1_1.serializeAws_json1_1DeleteResourcePolicyCommand)(input, context);
      }
      deserialize(output, context) {
        return (0, Aws_json1_1_1.deserializeAws_json1_1DeleteResourcePolicyCommand)(output, context);
      }
    };
    exports.DeleteResourcePolicyCommand = DeleteResourcePolicyCommand;
  }
});

// node_modules/@aws-sdk/client-secrets-manager/dist-cjs/commands/DeleteSecretCommand.js
var require_DeleteSecretCommand = __commonJS({
  "node_modules/@aws-sdk/client-secrets-manager/dist-cjs/commands/DeleteSecretCommand.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DeleteSecretCommand = void 0;
    var middleware_serde_1 = require_dist_cjs();
    var smithy_client_1 = require_dist_cjs3();
    var models_0_1 = require_models_0();
    var Aws_json1_1_1 = require_Aws_json1_1();
    var DeleteSecretCommand = class extends smithy_client_1.Command {
      constructor(input) {
        super();
        this.input = input;
      }
      resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use((0, middleware_serde_1.getSerdePlugin)(configuration, this.serialize, this.deserialize));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "SecretsManagerClient";
        const commandName = "DeleteSecretCommand";
        const handlerExecutionContext = {
          logger,
          clientName,
          commandName,
          inputFilterSensitiveLog: models_0_1.DeleteSecretRequest.filterSensitiveLog,
          outputFilterSensitiveLog: models_0_1.DeleteSecretResponse.filterSensitiveLog
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
      }
      serialize(input, context) {
        return (0, Aws_json1_1_1.serializeAws_json1_1DeleteSecretCommand)(input, context);
      }
      deserialize(output, context) {
        return (0, Aws_json1_1_1.deserializeAws_json1_1DeleteSecretCommand)(output, context);
      }
    };
    exports.DeleteSecretCommand = DeleteSecretCommand;
  }
});

// node_modules/@aws-sdk/client-secrets-manager/dist-cjs/commands/DescribeSecretCommand.js
var require_DescribeSecretCommand = __commonJS({
  "node_modules/@aws-sdk/client-secrets-manager/dist-cjs/commands/DescribeSecretCommand.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DescribeSecretCommand = void 0;
    var middleware_serde_1 = require_dist_cjs();
    var smithy_client_1 = require_dist_cjs3();
    var models_0_1 = require_models_0();
    var Aws_json1_1_1 = require_Aws_json1_1();
    var DescribeSecretCommand = class extends smithy_client_1.Command {
      constructor(input) {
        super();
        this.input = input;
      }
      resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use((0, middleware_serde_1.getSerdePlugin)(configuration, this.serialize, this.deserialize));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "SecretsManagerClient";
        const commandName = "DescribeSecretCommand";
        const handlerExecutionContext = {
          logger,
          clientName,
          commandName,
          inputFilterSensitiveLog: models_0_1.DescribeSecretRequest.filterSensitiveLog,
          outputFilterSensitiveLog: models_0_1.DescribeSecretResponse.filterSensitiveLog
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
      }
      serialize(input, context) {
        return (0, Aws_json1_1_1.serializeAws_json1_1DescribeSecretCommand)(input, context);
      }
      deserialize(output, context) {
        return (0, Aws_json1_1_1.deserializeAws_json1_1DescribeSecretCommand)(output, context);
      }
    };
    exports.DescribeSecretCommand = DescribeSecretCommand;
  }
});

// node_modules/@aws-sdk/client-secrets-manager/dist-cjs/commands/GetRandomPasswordCommand.js
var require_GetRandomPasswordCommand = __commonJS({
  "node_modules/@aws-sdk/client-secrets-manager/dist-cjs/commands/GetRandomPasswordCommand.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.GetRandomPasswordCommand = void 0;
    var middleware_serde_1 = require_dist_cjs();
    var smithy_client_1 = require_dist_cjs3();
    var models_0_1 = require_models_0();
    var Aws_json1_1_1 = require_Aws_json1_1();
    var GetRandomPasswordCommand = class extends smithy_client_1.Command {
      constructor(input) {
        super();
        this.input = input;
      }
      resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use((0, middleware_serde_1.getSerdePlugin)(configuration, this.serialize, this.deserialize));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "SecretsManagerClient";
        const commandName = "GetRandomPasswordCommand";
        const handlerExecutionContext = {
          logger,
          clientName,
          commandName,
          inputFilterSensitiveLog: models_0_1.GetRandomPasswordRequest.filterSensitiveLog,
          outputFilterSensitiveLog: models_0_1.GetRandomPasswordResponse.filterSensitiveLog
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
      }
      serialize(input, context) {
        return (0, Aws_json1_1_1.serializeAws_json1_1GetRandomPasswordCommand)(input, context);
      }
      deserialize(output, context) {
        return (0, Aws_json1_1_1.deserializeAws_json1_1GetRandomPasswordCommand)(output, context);
      }
    };
    exports.GetRandomPasswordCommand = GetRandomPasswordCommand;
  }
});

// node_modules/@aws-sdk/client-secrets-manager/dist-cjs/commands/GetResourcePolicyCommand.js
var require_GetResourcePolicyCommand = __commonJS({
  "node_modules/@aws-sdk/client-secrets-manager/dist-cjs/commands/GetResourcePolicyCommand.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.GetResourcePolicyCommand = void 0;
    var middleware_serde_1 = require_dist_cjs();
    var smithy_client_1 = require_dist_cjs3();
    var models_0_1 = require_models_0();
    var Aws_json1_1_1 = require_Aws_json1_1();
    var GetResourcePolicyCommand = class extends smithy_client_1.Command {
      constructor(input) {
        super();
        this.input = input;
      }
      resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use((0, middleware_serde_1.getSerdePlugin)(configuration, this.serialize, this.deserialize));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "SecretsManagerClient";
        const commandName = "GetResourcePolicyCommand";
        const handlerExecutionContext = {
          logger,
          clientName,
          commandName,
          inputFilterSensitiveLog: models_0_1.GetResourcePolicyRequest.filterSensitiveLog,
          outputFilterSensitiveLog: models_0_1.GetResourcePolicyResponse.filterSensitiveLog
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
      }
      serialize(input, context) {
        return (0, Aws_json1_1_1.serializeAws_json1_1GetResourcePolicyCommand)(input, context);
      }
      deserialize(output, context) {
        return (0, Aws_json1_1_1.deserializeAws_json1_1GetResourcePolicyCommand)(output, context);
      }
    };
    exports.GetResourcePolicyCommand = GetResourcePolicyCommand;
  }
});

// node_modules/@aws-sdk/client-secrets-manager/dist-cjs/commands/GetSecretValueCommand.js
var require_GetSecretValueCommand = __commonJS({
  "node_modules/@aws-sdk/client-secrets-manager/dist-cjs/commands/GetSecretValueCommand.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.GetSecretValueCommand = void 0;
    var middleware_serde_1 = require_dist_cjs();
    var smithy_client_1 = require_dist_cjs3();
    var models_0_1 = require_models_0();
    var Aws_json1_1_1 = require_Aws_json1_1();
    var GetSecretValueCommand = class extends smithy_client_1.Command {
      constructor(input) {
        super();
        this.input = input;
      }
      resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use((0, middleware_serde_1.getSerdePlugin)(configuration, this.serialize, this.deserialize));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "SecretsManagerClient";
        const commandName = "GetSecretValueCommand";
        const handlerExecutionContext = {
          logger,
          clientName,
          commandName,
          inputFilterSensitiveLog: models_0_1.GetSecretValueRequest.filterSensitiveLog,
          outputFilterSensitiveLog: models_0_1.GetSecretValueResponse.filterSensitiveLog
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
      }
      serialize(input, context) {
        return (0, Aws_json1_1_1.serializeAws_json1_1GetSecretValueCommand)(input, context);
      }
      deserialize(output, context) {
        return (0, Aws_json1_1_1.deserializeAws_json1_1GetSecretValueCommand)(output, context);
      }
    };
    exports.GetSecretValueCommand = GetSecretValueCommand;
  }
});

// node_modules/@aws-sdk/client-secrets-manager/dist-cjs/commands/ListSecretsCommand.js
var require_ListSecretsCommand = __commonJS({
  "node_modules/@aws-sdk/client-secrets-manager/dist-cjs/commands/ListSecretsCommand.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ListSecretsCommand = void 0;
    var middleware_serde_1 = require_dist_cjs();
    var smithy_client_1 = require_dist_cjs3();
    var models_0_1 = require_models_0();
    var Aws_json1_1_1 = require_Aws_json1_1();
    var ListSecretsCommand = class extends smithy_client_1.Command {
      constructor(input) {
        super();
        this.input = input;
      }
      resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use((0, middleware_serde_1.getSerdePlugin)(configuration, this.serialize, this.deserialize));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "SecretsManagerClient";
        const commandName = "ListSecretsCommand";
        const handlerExecutionContext = {
          logger,
          clientName,
          commandName,
          inputFilterSensitiveLog: models_0_1.ListSecretsRequest.filterSensitiveLog,
          outputFilterSensitiveLog: models_0_1.ListSecretsResponse.filterSensitiveLog
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
      }
      serialize(input, context) {
        return (0, Aws_json1_1_1.serializeAws_json1_1ListSecretsCommand)(input, context);
      }
      deserialize(output, context) {
        return (0, Aws_json1_1_1.deserializeAws_json1_1ListSecretsCommand)(output, context);
      }
    };
    exports.ListSecretsCommand = ListSecretsCommand;
  }
});

// node_modules/@aws-sdk/client-secrets-manager/dist-cjs/commands/ListSecretVersionIdsCommand.js
var require_ListSecretVersionIdsCommand = __commonJS({
  "node_modules/@aws-sdk/client-secrets-manager/dist-cjs/commands/ListSecretVersionIdsCommand.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ListSecretVersionIdsCommand = void 0;
    var middleware_serde_1 = require_dist_cjs();
    var smithy_client_1 = require_dist_cjs3();
    var models_0_1 = require_models_0();
    var Aws_json1_1_1 = require_Aws_json1_1();
    var ListSecretVersionIdsCommand = class extends smithy_client_1.Command {
      constructor(input) {
        super();
        this.input = input;
      }
      resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use((0, middleware_serde_1.getSerdePlugin)(configuration, this.serialize, this.deserialize));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "SecretsManagerClient";
        const commandName = "ListSecretVersionIdsCommand";
        const handlerExecutionContext = {
          logger,
          clientName,
          commandName,
          inputFilterSensitiveLog: models_0_1.ListSecretVersionIdsRequest.filterSensitiveLog,
          outputFilterSensitiveLog: models_0_1.ListSecretVersionIdsResponse.filterSensitiveLog
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
      }
      serialize(input, context) {
        return (0, Aws_json1_1_1.serializeAws_json1_1ListSecretVersionIdsCommand)(input, context);
      }
      deserialize(output, context) {
        return (0, Aws_json1_1_1.deserializeAws_json1_1ListSecretVersionIdsCommand)(output, context);
      }
    };
    exports.ListSecretVersionIdsCommand = ListSecretVersionIdsCommand;
  }
});

// node_modules/@aws-sdk/client-secrets-manager/dist-cjs/commands/PutResourcePolicyCommand.js
var require_PutResourcePolicyCommand = __commonJS({
  "node_modules/@aws-sdk/client-secrets-manager/dist-cjs/commands/PutResourcePolicyCommand.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PutResourcePolicyCommand = void 0;
    var middleware_serde_1 = require_dist_cjs();
    var smithy_client_1 = require_dist_cjs3();
    var models_0_1 = require_models_0();
    var Aws_json1_1_1 = require_Aws_json1_1();
    var PutResourcePolicyCommand = class extends smithy_client_1.Command {
      constructor(input) {
        super();
        this.input = input;
      }
      resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use((0, middleware_serde_1.getSerdePlugin)(configuration, this.serialize, this.deserialize));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "SecretsManagerClient";
        const commandName = "PutResourcePolicyCommand";
        const handlerExecutionContext = {
          logger,
          clientName,
          commandName,
          inputFilterSensitiveLog: models_0_1.PutResourcePolicyRequest.filterSensitiveLog,
          outputFilterSensitiveLog: models_0_1.PutResourcePolicyResponse.filterSensitiveLog
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
      }
      serialize(input, context) {
        return (0, Aws_json1_1_1.serializeAws_json1_1PutResourcePolicyCommand)(input, context);
      }
      deserialize(output, context) {
        return (0, Aws_json1_1_1.deserializeAws_json1_1PutResourcePolicyCommand)(output, context);
      }
    };
    exports.PutResourcePolicyCommand = PutResourcePolicyCommand;
  }
});

// node_modules/@aws-sdk/client-secrets-manager/dist-cjs/commands/PutSecretValueCommand.js
var require_PutSecretValueCommand = __commonJS({
  "node_modules/@aws-sdk/client-secrets-manager/dist-cjs/commands/PutSecretValueCommand.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PutSecretValueCommand = void 0;
    var middleware_serde_1 = require_dist_cjs();
    var smithy_client_1 = require_dist_cjs3();
    var models_0_1 = require_models_0();
    var Aws_json1_1_1 = require_Aws_json1_1();
    var PutSecretValueCommand = class extends smithy_client_1.Command {
      constructor(input) {
        super();
        this.input = input;
      }
      resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use((0, middleware_serde_1.getSerdePlugin)(configuration, this.serialize, this.deserialize));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "SecretsManagerClient";
        const commandName = "PutSecretValueCommand";
        const handlerExecutionContext = {
          logger,
          clientName,
          commandName,
          inputFilterSensitiveLog: models_0_1.PutSecretValueRequest.filterSensitiveLog,
          outputFilterSensitiveLog: models_0_1.PutSecretValueResponse.filterSensitiveLog
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
      }
      serialize(input, context) {
        return (0, Aws_json1_1_1.serializeAws_json1_1PutSecretValueCommand)(input, context);
      }
      deserialize(output, context) {
        return (0, Aws_json1_1_1.deserializeAws_json1_1PutSecretValueCommand)(output, context);
      }
    };
    exports.PutSecretValueCommand = PutSecretValueCommand;
  }
});

// node_modules/@aws-sdk/client-secrets-manager/dist-cjs/commands/RemoveRegionsFromReplicationCommand.js
var require_RemoveRegionsFromReplicationCommand = __commonJS({
  "node_modules/@aws-sdk/client-secrets-manager/dist-cjs/commands/RemoveRegionsFromReplicationCommand.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RemoveRegionsFromReplicationCommand = void 0;
    var middleware_serde_1 = require_dist_cjs();
    var smithy_client_1 = require_dist_cjs3();
    var models_0_1 = require_models_0();
    var Aws_json1_1_1 = require_Aws_json1_1();
    var RemoveRegionsFromReplicationCommand = class extends smithy_client_1.Command {
      constructor(input) {
        super();
        this.input = input;
      }
      resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use((0, middleware_serde_1.getSerdePlugin)(configuration, this.serialize, this.deserialize));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "SecretsManagerClient";
        const commandName = "RemoveRegionsFromReplicationCommand";
        const handlerExecutionContext = {
          logger,
          clientName,
          commandName,
          inputFilterSensitiveLog: models_0_1.RemoveRegionsFromReplicationRequest.filterSensitiveLog,
          outputFilterSensitiveLog: models_0_1.RemoveRegionsFromReplicationResponse.filterSensitiveLog
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
      }
      serialize(input, context) {
        return (0, Aws_json1_1_1.serializeAws_json1_1RemoveRegionsFromReplicationCommand)(input, context);
      }
      deserialize(output, context) {
        return (0, Aws_json1_1_1.deserializeAws_json1_1RemoveRegionsFromReplicationCommand)(output, context);
      }
    };
    exports.RemoveRegionsFromReplicationCommand = RemoveRegionsFromReplicationCommand;
  }
});

// node_modules/@aws-sdk/client-secrets-manager/dist-cjs/commands/ReplicateSecretToRegionsCommand.js
var require_ReplicateSecretToRegionsCommand = __commonJS({
  "node_modules/@aws-sdk/client-secrets-manager/dist-cjs/commands/ReplicateSecretToRegionsCommand.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ReplicateSecretToRegionsCommand = void 0;
    var middleware_serde_1 = require_dist_cjs();
    var smithy_client_1 = require_dist_cjs3();
    var models_0_1 = require_models_0();
    var Aws_json1_1_1 = require_Aws_json1_1();
    var ReplicateSecretToRegionsCommand = class extends smithy_client_1.Command {
      constructor(input) {
        super();
        this.input = input;
      }
      resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use((0, middleware_serde_1.getSerdePlugin)(configuration, this.serialize, this.deserialize));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "SecretsManagerClient";
        const commandName = "ReplicateSecretToRegionsCommand";
        const handlerExecutionContext = {
          logger,
          clientName,
          commandName,
          inputFilterSensitiveLog: models_0_1.ReplicateSecretToRegionsRequest.filterSensitiveLog,
          outputFilterSensitiveLog: models_0_1.ReplicateSecretToRegionsResponse.filterSensitiveLog
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
      }
      serialize(input, context) {
        return (0, Aws_json1_1_1.serializeAws_json1_1ReplicateSecretToRegionsCommand)(input, context);
      }
      deserialize(output, context) {
        return (0, Aws_json1_1_1.deserializeAws_json1_1ReplicateSecretToRegionsCommand)(output, context);
      }
    };
    exports.ReplicateSecretToRegionsCommand = ReplicateSecretToRegionsCommand;
  }
});

// node_modules/@aws-sdk/client-secrets-manager/dist-cjs/commands/RestoreSecretCommand.js
var require_RestoreSecretCommand = __commonJS({
  "node_modules/@aws-sdk/client-secrets-manager/dist-cjs/commands/RestoreSecretCommand.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RestoreSecretCommand = void 0;
    var middleware_serde_1 = require_dist_cjs();
    var smithy_client_1 = require_dist_cjs3();
    var models_0_1 = require_models_0();
    var Aws_json1_1_1 = require_Aws_json1_1();
    var RestoreSecretCommand = class extends smithy_client_1.Command {
      constructor(input) {
        super();
        this.input = input;
      }
      resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use((0, middleware_serde_1.getSerdePlugin)(configuration, this.serialize, this.deserialize));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "SecretsManagerClient";
        const commandName = "RestoreSecretCommand";
        const handlerExecutionContext = {
          logger,
          clientName,
          commandName,
          inputFilterSensitiveLog: models_0_1.RestoreSecretRequest.filterSensitiveLog,
          outputFilterSensitiveLog: models_0_1.RestoreSecretResponse.filterSensitiveLog
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
      }
      serialize(input, context) {
        return (0, Aws_json1_1_1.serializeAws_json1_1RestoreSecretCommand)(input, context);
      }
      deserialize(output, context) {
        return (0, Aws_json1_1_1.deserializeAws_json1_1RestoreSecretCommand)(output, context);
      }
    };
    exports.RestoreSecretCommand = RestoreSecretCommand;
  }
});

// node_modules/@aws-sdk/client-secrets-manager/dist-cjs/commands/RotateSecretCommand.js
var require_RotateSecretCommand = __commonJS({
  "node_modules/@aws-sdk/client-secrets-manager/dist-cjs/commands/RotateSecretCommand.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RotateSecretCommand = void 0;
    var middleware_serde_1 = require_dist_cjs();
    var smithy_client_1 = require_dist_cjs3();
    var models_0_1 = require_models_0();
    var Aws_json1_1_1 = require_Aws_json1_1();
    var RotateSecretCommand = class extends smithy_client_1.Command {
      constructor(input) {
        super();
        this.input = input;
      }
      resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use((0, middleware_serde_1.getSerdePlugin)(configuration, this.serialize, this.deserialize));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "SecretsManagerClient";
        const commandName = "RotateSecretCommand";
        const handlerExecutionContext = {
          logger,
          clientName,
          commandName,
          inputFilterSensitiveLog: models_0_1.RotateSecretRequest.filterSensitiveLog,
          outputFilterSensitiveLog: models_0_1.RotateSecretResponse.filterSensitiveLog
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
      }
      serialize(input, context) {
        return (0, Aws_json1_1_1.serializeAws_json1_1RotateSecretCommand)(input, context);
      }
      deserialize(output, context) {
        return (0, Aws_json1_1_1.deserializeAws_json1_1RotateSecretCommand)(output, context);
      }
    };
    exports.RotateSecretCommand = RotateSecretCommand;
  }
});

// node_modules/@aws-sdk/client-secrets-manager/dist-cjs/commands/StopReplicationToReplicaCommand.js
var require_StopReplicationToReplicaCommand = __commonJS({
  "node_modules/@aws-sdk/client-secrets-manager/dist-cjs/commands/StopReplicationToReplicaCommand.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.StopReplicationToReplicaCommand = void 0;
    var middleware_serde_1 = require_dist_cjs();
    var smithy_client_1 = require_dist_cjs3();
    var models_0_1 = require_models_0();
    var Aws_json1_1_1 = require_Aws_json1_1();
    var StopReplicationToReplicaCommand = class extends smithy_client_1.Command {
      constructor(input) {
        super();
        this.input = input;
      }
      resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use((0, middleware_serde_1.getSerdePlugin)(configuration, this.serialize, this.deserialize));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "SecretsManagerClient";
        const commandName = "StopReplicationToReplicaCommand";
        const handlerExecutionContext = {
          logger,
          clientName,
          commandName,
          inputFilterSensitiveLog: models_0_1.StopReplicationToReplicaRequest.filterSensitiveLog,
          outputFilterSensitiveLog: models_0_1.StopReplicationToReplicaResponse.filterSensitiveLog
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
      }
      serialize(input, context) {
        return (0, Aws_json1_1_1.serializeAws_json1_1StopReplicationToReplicaCommand)(input, context);
      }
      deserialize(output, context) {
        return (0, Aws_json1_1_1.deserializeAws_json1_1StopReplicationToReplicaCommand)(output, context);
      }
    };
    exports.StopReplicationToReplicaCommand = StopReplicationToReplicaCommand;
  }
});

// node_modules/@aws-sdk/client-secrets-manager/dist-cjs/commands/TagResourceCommand.js
var require_TagResourceCommand = __commonJS({
  "node_modules/@aws-sdk/client-secrets-manager/dist-cjs/commands/TagResourceCommand.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TagResourceCommand = void 0;
    var middleware_serde_1 = require_dist_cjs();
    var smithy_client_1 = require_dist_cjs3();
    var models_0_1 = require_models_0();
    var Aws_json1_1_1 = require_Aws_json1_1();
    var TagResourceCommand = class extends smithy_client_1.Command {
      constructor(input) {
        super();
        this.input = input;
      }
      resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use((0, middleware_serde_1.getSerdePlugin)(configuration, this.serialize, this.deserialize));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "SecretsManagerClient";
        const commandName = "TagResourceCommand";
        const handlerExecutionContext = {
          logger,
          clientName,
          commandName,
          inputFilterSensitiveLog: models_0_1.TagResourceRequest.filterSensitiveLog,
          outputFilterSensitiveLog: (output) => output
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
      }
      serialize(input, context) {
        return (0, Aws_json1_1_1.serializeAws_json1_1TagResourceCommand)(input, context);
      }
      deserialize(output, context) {
        return (0, Aws_json1_1_1.deserializeAws_json1_1TagResourceCommand)(output, context);
      }
    };
    exports.TagResourceCommand = TagResourceCommand;
  }
});

// node_modules/@aws-sdk/client-secrets-manager/dist-cjs/commands/UntagResourceCommand.js
var require_UntagResourceCommand = __commonJS({
  "node_modules/@aws-sdk/client-secrets-manager/dist-cjs/commands/UntagResourceCommand.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.UntagResourceCommand = void 0;
    var middleware_serde_1 = require_dist_cjs();
    var smithy_client_1 = require_dist_cjs3();
    var models_0_1 = require_models_0();
    var Aws_json1_1_1 = require_Aws_json1_1();
    var UntagResourceCommand = class extends smithy_client_1.Command {
      constructor(input) {
        super();
        this.input = input;
      }
      resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use((0, middleware_serde_1.getSerdePlugin)(configuration, this.serialize, this.deserialize));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "SecretsManagerClient";
        const commandName = "UntagResourceCommand";
        const handlerExecutionContext = {
          logger,
          clientName,
          commandName,
          inputFilterSensitiveLog: models_0_1.UntagResourceRequest.filterSensitiveLog,
          outputFilterSensitiveLog: (output) => output
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
      }
      serialize(input, context) {
        return (0, Aws_json1_1_1.serializeAws_json1_1UntagResourceCommand)(input, context);
      }
      deserialize(output, context) {
        return (0, Aws_json1_1_1.deserializeAws_json1_1UntagResourceCommand)(output, context);
      }
    };
    exports.UntagResourceCommand = UntagResourceCommand;
  }
});

// node_modules/@aws-sdk/client-secrets-manager/dist-cjs/commands/UpdateSecretCommand.js
var require_UpdateSecretCommand = __commonJS({
  "node_modules/@aws-sdk/client-secrets-manager/dist-cjs/commands/UpdateSecretCommand.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.UpdateSecretCommand = void 0;
    var middleware_serde_1 = require_dist_cjs();
    var smithy_client_1 = require_dist_cjs3();
    var models_0_1 = require_models_0();
    var Aws_json1_1_1 = require_Aws_json1_1();
    var UpdateSecretCommand = class extends smithy_client_1.Command {
      constructor(input) {
        super();
        this.input = input;
      }
      resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use((0, middleware_serde_1.getSerdePlugin)(configuration, this.serialize, this.deserialize));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "SecretsManagerClient";
        const commandName = "UpdateSecretCommand";
        const handlerExecutionContext = {
          logger,
          clientName,
          commandName,
          inputFilterSensitiveLog: models_0_1.UpdateSecretRequest.filterSensitiveLog,
          outputFilterSensitiveLog: models_0_1.UpdateSecretResponse.filterSensitiveLog
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
      }
      serialize(input, context) {
        return (0, Aws_json1_1_1.serializeAws_json1_1UpdateSecretCommand)(input, context);
      }
      deserialize(output, context) {
        return (0, Aws_json1_1_1.deserializeAws_json1_1UpdateSecretCommand)(output, context);
      }
    };
    exports.UpdateSecretCommand = UpdateSecretCommand;
  }
});

// node_modules/@aws-sdk/client-secrets-manager/dist-cjs/commands/UpdateSecretVersionStageCommand.js
var require_UpdateSecretVersionStageCommand = __commonJS({
  "node_modules/@aws-sdk/client-secrets-manager/dist-cjs/commands/UpdateSecretVersionStageCommand.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.UpdateSecretVersionStageCommand = void 0;
    var middleware_serde_1 = require_dist_cjs();
    var smithy_client_1 = require_dist_cjs3();
    var models_0_1 = require_models_0();
    var Aws_json1_1_1 = require_Aws_json1_1();
    var UpdateSecretVersionStageCommand = class extends smithy_client_1.Command {
      constructor(input) {
        super();
        this.input = input;
      }
      resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use((0, middleware_serde_1.getSerdePlugin)(configuration, this.serialize, this.deserialize));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "SecretsManagerClient";
        const commandName = "UpdateSecretVersionStageCommand";
        const handlerExecutionContext = {
          logger,
          clientName,
          commandName,
          inputFilterSensitiveLog: models_0_1.UpdateSecretVersionStageRequest.filterSensitiveLog,
          outputFilterSensitiveLog: models_0_1.UpdateSecretVersionStageResponse.filterSensitiveLog
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
      }
      serialize(input, context) {
        return (0, Aws_json1_1_1.serializeAws_json1_1UpdateSecretVersionStageCommand)(input, context);
      }
      deserialize(output, context) {
        return (0, Aws_json1_1_1.deserializeAws_json1_1UpdateSecretVersionStageCommand)(output, context);
      }
    };
    exports.UpdateSecretVersionStageCommand = UpdateSecretVersionStageCommand;
  }
});

// node_modules/@aws-sdk/client-secrets-manager/dist-cjs/commands/ValidateResourcePolicyCommand.js
var require_ValidateResourcePolicyCommand = __commonJS({
  "node_modules/@aws-sdk/client-secrets-manager/dist-cjs/commands/ValidateResourcePolicyCommand.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ValidateResourcePolicyCommand = void 0;
    var middleware_serde_1 = require_dist_cjs();
    var smithy_client_1 = require_dist_cjs3();
    var models_0_1 = require_models_0();
    var Aws_json1_1_1 = require_Aws_json1_1();
    var ValidateResourcePolicyCommand = class extends smithy_client_1.Command {
      constructor(input) {
        super();
        this.input = input;
      }
      resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use((0, middleware_serde_1.getSerdePlugin)(configuration, this.serialize, this.deserialize));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "SecretsManagerClient";
        const commandName = "ValidateResourcePolicyCommand";
        const handlerExecutionContext = {
          logger,
          clientName,
          commandName,
          inputFilterSensitiveLog: models_0_1.ValidateResourcePolicyRequest.filterSensitiveLog,
          outputFilterSensitiveLog: models_0_1.ValidateResourcePolicyResponse.filterSensitiveLog
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
      }
      serialize(input, context) {
        return (0, Aws_json1_1_1.serializeAws_json1_1ValidateResourcePolicyCommand)(input, context);
      }
      deserialize(output, context) {
        return (0, Aws_json1_1_1.deserializeAws_json1_1ValidateResourcePolicyCommand)(output, context);
      }
    };
    exports.ValidateResourcePolicyCommand = ValidateResourcePolicyCommand;
  }
});

// node_modules/@aws-sdk/util-config-provider/dist-cjs/booleanSelector.js
var require_booleanSelector = __commonJS({
  "node_modules/@aws-sdk/util-config-provider/dist-cjs/booleanSelector.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.booleanSelector = exports.SelectorType = void 0;
    var SelectorType;
    (function(SelectorType2) {
      SelectorType2["ENV"] = "env";
      SelectorType2["CONFIG"] = "shared config entry";
    })(SelectorType = exports.SelectorType || (exports.SelectorType = {}));
    var booleanSelector = (obj, key, type) => {
      if (!(key in obj))
        return void 0;
      if (obj[key] === "true")
        return true;
      if (obj[key] === "false")
        return false;
      throw new Error(`Cannot load ${type} "${key}". Expected "true" or "false", got ${obj[key]}.`);
    };
    exports.booleanSelector = booleanSelector;
  }
});

// node_modules/@aws-sdk/util-config-provider/dist-cjs/index.js
var require_dist_cjs5 = __commonJS({
  "node_modules/@aws-sdk/util-config-provider/dist-cjs/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require_tslib();
    tslib_1.__exportStar(require_booleanSelector(), exports);
  }
});

// node_modules/@aws-sdk/config-resolver/dist-cjs/endpointsConfig/NodeUseDualstackEndpointConfigOptions.js
var require_NodeUseDualstackEndpointConfigOptions = __commonJS({
  "node_modules/@aws-sdk/config-resolver/dist-cjs/endpointsConfig/NodeUseDualstackEndpointConfigOptions.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS = exports.DEFAULT_USE_DUALSTACK_ENDPOINT = exports.CONFIG_USE_DUALSTACK_ENDPOINT = exports.ENV_USE_DUALSTACK_ENDPOINT = void 0;
    var util_config_provider_1 = require_dist_cjs5();
    exports.ENV_USE_DUALSTACK_ENDPOINT = "AWS_USE_DUALSTACK_ENDPOINT";
    exports.CONFIG_USE_DUALSTACK_ENDPOINT = "use_dualstack_endpoint";
    exports.DEFAULT_USE_DUALSTACK_ENDPOINT = false;
    exports.NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS = {
      environmentVariableSelector: (env) => (0, util_config_provider_1.booleanSelector)(env, exports.ENV_USE_DUALSTACK_ENDPOINT, util_config_provider_1.SelectorType.ENV),
      configFileSelector: (profile) => (0, util_config_provider_1.booleanSelector)(profile, exports.CONFIG_USE_DUALSTACK_ENDPOINT, util_config_provider_1.SelectorType.CONFIG),
      default: false
    };
  }
});

// node_modules/@aws-sdk/config-resolver/dist-cjs/endpointsConfig/NodeUseFipsEndpointConfigOptions.js
var require_NodeUseFipsEndpointConfigOptions = __commonJS({
  "node_modules/@aws-sdk/config-resolver/dist-cjs/endpointsConfig/NodeUseFipsEndpointConfigOptions.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS = exports.DEFAULT_USE_FIPS_ENDPOINT = exports.CONFIG_USE_FIPS_ENDPOINT = exports.ENV_USE_FIPS_ENDPOINT = void 0;
    var util_config_provider_1 = require_dist_cjs5();
    exports.ENV_USE_FIPS_ENDPOINT = "AWS_USE_FIPS_ENDPOINT";
    exports.CONFIG_USE_FIPS_ENDPOINT = "use_fips_endpoint";
    exports.DEFAULT_USE_FIPS_ENDPOINT = false;
    exports.NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS = {
      environmentVariableSelector: (env) => (0, util_config_provider_1.booleanSelector)(env, exports.ENV_USE_FIPS_ENDPOINT, util_config_provider_1.SelectorType.ENV),
      configFileSelector: (profile) => (0, util_config_provider_1.booleanSelector)(profile, exports.CONFIG_USE_FIPS_ENDPOINT, util_config_provider_1.SelectorType.CONFIG),
      default: false
    };
  }
});

// node_modules/@aws-sdk/util-middleware/dist-cjs/normalizeProvider.js
var require_normalizeProvider = __commonJS({
  "node_modules/@aws-sdk/util-middleware/dist-cjs/normalizeProvider.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.normalizeProvider = void 0;
    var normalizeProvider = (input) => {
      if (typeof input === "function")
        return input;
      const promisified = Promise.resolve(input);
      return () => promisified;
    };
    exports.normalizeProvider = normalizeProvider;
  }
});

// node_modules/@aws-sdk/util-middleware/dist-cjs/index.js
var require_dist_cjs6 = __commonJS({
  "node_modules/@aws-sdk/util-middleware/dist-cjs/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require_tslib();
    tslib_1.__exportStar(require_normalizeProvider(), exports);
  }
});

// node_modules/@aws-sdk/config-resolver/dist-cjs/endpointsConfig/resolveCustomEndpointsConfig.js
var require_resolveCustomEndpointsConfig = __commonJS({
  "node_modules/@aws-sdk/config-resolver/dist-cjs/endpointsConfig/resolveCustomEndpointsConfig.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.resolveCustomEndpointsConfig = void 0;
    var util_middleware_1 = require_dist_cjs6();
    var resolveCustomEndpointsConfig = (input) => {
      var _a;
      const { endpoint, urlParser } = input;
      return {
        ...input,
        tls: (_a = input.tls) !== null && _a !== void 0 ? _a : true,
        endpoint: (0, util_middleware_1.normalizeProvider)(typeof endpoint === "string" ? urlParser(endpoint) : endpoint),
        isCustomEndpoint: true,
        useDualstackEndpoint: (0, util_middleware_1.normalizeProvider)(input.useDualstackEndpoint)
      };
    };
    exports.resolveCustomEndpointsConfig = resolveCustomEndpointsConfig;
  }
});

// node_modules/@aws-sdk/config-resolver/dist-cjs/endpointsConfig/utils/getEndpointFromRegion.js
var require_getEndpointFromRegion = __commonJS({
  "node_modules/@aws-sdk/config-resolver/dist-cjs/endpointsConfig/utils/getEndpointFromRegion.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getEndpointFromRegion = void 0;
    var getEndpointFromRegion = async (input) => {
      var _a;
      const { tls = true } = input;
      const region = await input.region();
      const dnsHostRegex = new RegExp(/^([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9])$/);
      if (!dnsHostRegex.test(region)) {
        throw new Error("Invalid region in client config");
      }
      const useDualstackEndpoint = await input.useDualstackEndpoint();
      const useFipsEndpoint = await input.useFipsEndpoint();
      const { hostname } = (_a = await input.regionInfoProvider(region, { useDualstackEndpoint, useFipsEndpoint })) !== null && _a !== void 0 ? _a : {};
      if (!hostname) {
        throw new Error("Cannot resolve hostname from client config");
      }
      return input.urlParser(`${tls ? "https:" : "http:"}//${hostname}`);
    };
    exports.getEndpointFromRegion = getEndpointFromRegion;
  }
});

// node_modules/@aws-sdk/config-resolver/dist-cjs/endpointsConfig/resolveEndpointsConfig.js
var require_resolveEndpointsConfig = __commonJS({
  "node_modules/@aws-sdk/config-resolver/dist-cjs/endpointsConfig/resolveEndpointsConfig.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.resolveEndpointsConfig = void 0;
    var util_middleware_1 = require_dist_cjs6();
    var getEndpointFromRegion_1 = require_getEndpointFromRegion();
    var resolveEndpointsConfig = (input) => {
      var _a;
      const useDualstackEndpoint = (0, util_middleware_1.normalizeProvider)(input.useDualstackEndpoint);
      const { endpoint, useFipsEndpoint, urlParser } = input;
      return {
        ...input,
        tls: (_a = input.tls) !== null && _a !== void 0 ? _a : true,
        endpoint: endpoint ? (0, util_middleware_1.normalizeProvider)(typeof endpoint === "string" ? urlParser(endpoint) : endpoint) : () => (0, getEndpointFromRegion_1.getEndpointFromRegion)({ ...input, useDualstackEndpoint, useFipsEndpoint }),
        isCustomEndpoint: endpoint ? true : false,
        useDualstackEndpoint
      };
    };
    exports.resolveEndpointsConfig = resolveEndpointsConfig;
  }
});

// node_modules/@aws-sdk/config-resolver/dist-cjs/endpointsConfig/index.js
var require_endpointsConfig = __commonJS({
  "node_modules/@aws-sdk/config-resolver/dist-cjs/endpointsConfig/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require_tslib();
    tslib_1.__exportStar(require_NodeUseDualstackEndpointConfigOptions(), exports);
    tslib_1.__exportStar(require_NodeUseFipsEndpointConfigOptions(), exports);
    tslib_1.__exportStar(require_resolveCustomEndpointsConfig(), exports);
    tslib_1.__exportStar(require_resolveEndpointsConfig(), exports);
  }
});

// node_modules/@aws-sdk/config-resolver/dist-cjs/regionConfig/config.js
var require_config = __commonJS({
  "node_modules/@aws-sdk/config-resolver/dist-cjs/regionConfig/config.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NODE_REGION_CONFIG_FILE_OPTIONS = exports.NODE_REGION_CONFIG_OPTIONS = exports.REGION_INI_NAME = exports.REGION_ENV_NAME = void 0;
    exports.REGION_ENV_NAME = "AWS_REGION";
    exports.REGION_INI_NAME = "region";
    exports.NODE_REGION_CONFIG_OPTIONS = {
      environmentVariableSelector: (env) => env[exports.REGION_ENV_NAME],
      configFileSelector: (profile) => profile[exports.REGION_INI_NAME],
      default: () => {
        throw new Error("Region is missing");
      }
    };
    exports.NODE_REGION_CONFIG_FILE_OPTIONS = {
      preferredFile: "credentials"
    };
  }
});

// node_modules/@aws-sdk/config-resolver/dist-cjs/regionConfig/isFipsRegion.js
var require_isFipsRegion = __commonJS({
  "node_modules/@aws-sdk/config-resolver/dist-cjs/regionConfig/isFipsRegion.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isFipsRegion = void 0;
    var isFipsRegion = (region) => typeof region === "string" && (region.startsWith("fips-") || region.endsWith("-fips"));
    exports.isFipsRegion = isFipsRegion;
  }
});

// node_modules/@aws-sdk/config-resolver/dist-cjs/regionConfig/getRealRegion.js
var require_getRealRegion = __commonJS({
  "node_modules/@aws-sdk/config-resolver/dist-cjs/regionConfig/getRealRegion.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getRealRegion = void 0;
    var isFipsRegion_1 = require_isFipsRegion();
    var getRealRegion = (region) => (0, isFipsRegion_1.isFipsRegion)(region) ? ["fips-aws-global", "aws-fips"].includes(region) ? "us-east-1" : region.replace(/fips-(dkr-|prod-)?|-fips/, "") : region;
    exports.getRealRegion = getRealRegion;
  }
});

// node_modules/@aws-sdk/config-resolver/dist-cjs/regionConfig/resolveRegionConfig.js
var require_resolveRegionConfig = __commonJS({
  "node_modules/@aws-sdk/config-resolver/dist-cjs/regionConfig/resolveRegionConfig.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.resolveRegionConfig = void 0;
    var getRealRegion_1 = require_getRealRegion();
    var isFipsRegion_1 = require_isFipsRegion();
    var resolveRegionConfig = (input) => {
      const { region, useFipsEndpoint } = input;
      if (!region) {
        throw new Error("Region is missing");
      }
      return {
        ...input,
        region: async () => {
          if (typeof region === "string") {
            return (0, getRealRegion_1.getRealRegion)(region);
          }
          const providedRegion = await region();
          return (0, getRealRegion_1.getRealRegion)(providedRegion);
        },
        useFipsEndpoint: async () => {
          const providedRegion = typeof region === "string" ? region : await region();
          if ((0, isFipsRegion_1.isFipsRegion)(providedRegion)) {
            return true;
          }
          return typeof useFipsEndpoint === "boolean" ? Promise.resolve(useFipsEndpoint) : useFipsEndpoint();
        }
      };
    };
    exports.resolveRegionConfig = resolveRegionConfig;
  }
});

// node_modules/@aws-sdk/config-resolver/dist-cjs/regionConfig/index.js
var require_regionConfig = __commonJS({
  "node_modules/@aws-sdk/config-resolver/dist-cjs/regionConfig/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require_tslib();
    tslib_1.__exportStar(require_config(), exports);
    tslib_1.__exportStar(require_resolveRegionConfig(), exports);
  }
});

// node_modules/@aws-sdk/config-resolver/dist-cjs/regionInfo/PartitionHash.js
var require_PartitionHash = __commonJS({
  "node_modules/@aws-sdk/config-resolver/dist-cjs/regionInfo/PartitionHash.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/@aws-sdk/config-resolver/dist-cjs/regionInfo/RegionHash.js
var require_RegionHash = __commonJS({
  "node_modules/@aws-sdk/config-resolver/dist-cjs/regionInfo/RegionHash.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/@aws-sdk/config-resolver/dist-cjs/regionInfo/getHostnameFromVariants.js
var require_getHostnameFromVariants = __commonJS({
  "node_modules/@aws-sdk/config-resolver/dist-cjs/regionInfo/getHostnameFromVariants.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getHostnameFromVariants = void 0;
    var getHostnameFromVariants = (variants = [], { useFipsEndpoint, useDualstackEndpoint }) => {
      var _a;
      return (_a = variants.find(({ tags }) => useFipsEndpoint === tags.includes("fips") && useDualstackEndpoint === tags.includes("dualstack"))) === null || _a === void 0 ? void 0 : _a.hostname;
    };
    exports.getHostnameFromVariants = getHostnameFromVariants;
  }
});

// node_modules/@aws-sdk/config-resolver/dist-cjs/regionInfo/getResolvedHostname.js
var require_getResolvedHostname = __commonJS({
  "node_modules/@aws-sdk/config-resolver/dist-cjs/regionInfo/getResolvedHostname.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getResolvedHostname = void 0;
    var getResolvedHostname = (resolvedRegion, { regionHostname, partitionHostname }) => regionHostname ? regionHostname : partitionHostname ? partitionHostname.replace("{region}", resolvedRegion) : void 0;
    exports.getResolvedHostname = getResolvedHostname;
  }
});

// node_modules/@aws-sdk/config-resolver/dist-cjs/regionInfo/getResolvedPartition.js
var require_getResolvedPartition = __commonJS({
  "node_modules/@aws-sdk/config-resolver/dist-cjs/regionInfo/getResolvedPartition.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getResolvedPartition = void 0;
    var getResolvedPartition = (region, { partitionHash }) => {
      var _a;
      return (_a = Object.keys(partitionHash || {}).find((key) => partitionHash[key].regions.includes(region))) !== null && _a !== void 0 ? _a : "aws";
    };
    exports.getResolvedPartition = getResolvedPartition;
  }
});

// node_modules/@aws-sdk/config-resolver/dist-cjs/regionInfo/getResolvedSigningRegion.js
var require_getResolvedSigningRegion = __commonJS({
  "node_modules/@aws-sdk/config-resolver/dist-cjs/regionInfo/getResolvedSigningRegion.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getResolvedSigningRegion = void 0;
    var getResolvedSigningRegion = (hostname, { signingRegion, regionRegex, useFipsEndpoint }) => {
      if (signingRegion) {
        return signingRegion;
      } else if (useFipsEndpoint) {
        const regionRegexJs = regionRegex.replace("\\\\", "\\").replace(/^\^/g, "\\.").replace(/\$$/g, "\\.");
        const regionRegexmatchArray = hostname.match(regionRegexJs);
        if (regionRegexmatchArray) {
          return regionRegexmatchArray[0].slice(1, -1);
        }
      }
    };
    exports.getResolvedSigningRegion = getResolvedSigningRegion;
  }
});

// node_modules/@aws-sdk/config-resolver/dist-cjs/regionInfo/getRegionInfo.js
var require_getRegionInfo = __commonJS({
  "node_modules/@aws-sdk/config-resolver/dist-cjs/regionInfo/getRegionInfo.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getRegionInfo = void 0;
    var getHostnameFromVariants_1 = require_getHostnameFromVariants();
    var getResolvedHostname_1 = require_getResolvedHostname();
    var getResolvedPartition_1 = require_getResolvedPartition();
    var getResolvedSigningRegion_1 = require_getResolvedSigningRegion();
    var getRegionInfo = (region, { useFipsEndpoint = false, useDualstackEndpoint = false, signingService, regionHash, partitionHash }) => {
      var _a, _b, _c, _d, _e, _f;
      const partition = (0, getResolvedPartition_1.getResolvedPartition)(region, { partitionHash });
      const resolvedRegion = region in regionHash ? region : (_b = (_a = partitionHash[partition]) === null || _a === void 0 ? void 0 : _a.endpoint) !== null && _b !== void 0 ? _b : region;
      const hostnameOptions = { useFipsEndpoint, useDualstackEndpoint };
      const regionHostname = (0, getHostnameFromVariants_1.getHostnameFromVariants)((_c = regionHash[resolvedRegion]) === null || _c === void 0 ? void 0 : _c.variants, hostnameOptions);
      const partitionHostname = (0, getHostnameFromVariants_1.getHostnameFromVariants)((_d = partitionHash[partition]) === null || _d === void 0 ? void 0 : _d.variants, hostnameOptions);
      const hostname = (0, getResolvedHostname_1.getResolvedHostname)(resolvedRegion, { regionHostname, partitionHostname });
      if (hostname === void 0) {
        throw new Error(`Endpoint resolution failed for: ${{ resolvedRegion, useFipsEndpoint, useDualstackEndpoint }}`);
      }
      const signingRegion = (0, getResolvedSigningRegion_1.getResolvedSigningRegion)(hostname, {
        signingRegion: (_e = regionHash[resolvedRegion]) === null || _e === void 0 ? void 0 : _e.signingRegion,
        regionRegex: partitionHash[partition].regionRegex,
        useFipsEndpoint
      });
      return {
        partition,
        signingService,
        hostname,
        ...signingRegion && { signingRegion },
        ...((_f = regionHash[resolvedRegion]) === null || _f === void 0 ? void 0 : _f.signingService) && {
          signingService: regionHash[resolvedRegion].signingService
        }
      };
    };
    exports.getRegionInfo = getRegionInfo;
  }
});

// node_modules/@aws-sdk/config-resolver/dist-cjs/regionInfo/index.js
var require_regionInfo = __commonJS({
  "node_modules/@aws-sdk/config-resolver/dist-cjs/regionInfo/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require_tslib();
    tslib_1.__exportStar(require_PartitionHash(), exports);
    tslib_1.__exportStar(require_RegionHash(), exports);
    tslib_1.__exportStar(require_getRegionInfo(), exports);
  }
});

// node_modules/@aws-sdk/config-resolver/dist-cjs/index.js
var require_dist_cjs7 = __commonJS({
  "node_modules/@aws-sdk/config-resolver/dist-cjs/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require_tslib();
    tslib_1.__exportStar(require_endpointsConfig(), exports);
    tslib_1.__exportStar(require_regionConfig(), exports);
    tslib_1.__exportStar(require_regionInfo(), exports);
  }
});

// node_modules/@aws-sdk/middleware-content-length/dist-cjs/index.js
var require_dist_cjs8 = __commonJS({
  "node_modules/@aws-sdk/middleware-content-length/dist-cjs/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getContentLengthPlugin = exports.contentLengthMiddlewareOptions = exports.contentLengthMiddleware = void 0;
    var protocol_http_1 = require_dist_cjs4();
    var CONTENT_LENGTH_HEADER = "content-length";
    function contentLengthMiddleware(bodyLengthChecker) {
      return (next) => async (args) => {
        const request = args.request;
        if (protocol_http_1.HttpRequest.isInstance(request)) {
          const { body, headers } = request;
          if (body && Object.keys(headers).map((str) => str.toLowerCase()).indexOf(CONTENT_LENGTH_HEADER) === -1) {
            try {
              const length = bodyLengthChecker(body);
              request.headers = {
                ...request.headers,
                [CONTENT_LENGTH_HEADER]: String(length)
              };
            } catch (error) {
            }
          }
        }
        return next({
          ...args,
          request
        });
      };
    }
    exports.contentLengthMiddleware = contentLengthMiddleware;
    exports.contentLengthMiddlewareOptions = {
      step: "build",
      tags: ["SET_CONTENT_LENGTH", "CONTENT_LENGTH"],
      name: "contentLengthMiddleware",
      override: true
    };
    var getContentLengthPlugin = (options) => ({
      applyToStack: (clientStack) => {
        clientStack.add(contentLengthMiddleware(options.bodyLengthChecker), exports.contentLengthMiddlewareOptions);
      }
    });
    exports.getContentLengthPlugin = getContentLengthPlugin;
  }
});

// node_modules/@aws-sdk/middleware-host-header/dist-cjs/index.js
var require_dist_cjs9 = __commonJS({
  "node_modules/@aws-sdk/middleware-host-header/dist-cjs/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getHostHeaderPlugin = exports.hostHeaderMiddlewareOptions = exports.hostHeaderMiddleware = exports.resolveHostHeaderConfig = void 0;
    var protocol_http_1 = require_dist_cjs4();
    function resolveHostHeaderConfig(input) {
      return input;
    }
    exports.resolveHostHeaderConfig = resolveHostHeaderConfig;
    var hostHeaderMiddleware = (options) => (next) => async (args) => {
      if (!protocol_http_1.HttpRequest.isInstance(args.request))
        return next(args);
      const { request } = args;
      const { handlerProtocol = "" } = options.requestHandler.metadata || {};
      if (handlerProtocol.indexOf("h2") >= 0 && !request.headers[":authority"]) {
        delete request.headers["host"];
        request.headers[":authority"] = "";
      } else if (!request.headers["host"]) {
        request.headers["host"] = request.hostname;
      }
      return next(args);
    };
    exports.hostHeaderMiddleware = hostHeaderMiddleware;
    exports.hostHeaderMiddlewareOptions = {
      name: "hostHeaderMiddleware",
      step: "build",
      priority: "low",
      tags: ["HOST"],
      override: true
    };
    var getHostHeaderPlugin = (options) => ({
      applyToStack: (clientStack) => {
        clientStack.add((0, exports.hostHeaderMiddleware)(options), exports.hostHeaderMiddlewareOptions);
      }
    });
    exports.getHostHeaderPlugin = getHostHeaderPlugin;
  }
});

// node_modules/@aws-sdk/middleware-logger/dist-cjs/loggerMiddleware.js
var require_loggerMiddleware = __commonJS({
  "node_modules/@aws-sdk/middleware-logger/dist-cjs/loggerMiddleware.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getLoggerPlugin = exports.loggerMiddlewareOptions = exports.loggerMiddleware = void 0;
    var loggerMiddleware = () => (next, context) => async (args) => {
      const { clientName, commandName, inputFilterSensitiveLog, logger, outputFilterSensitiveLog } = context;
      const response = await next(args);
      if (!logger) {
        return response;
      }
      if (typeof logger.info === "function") {
        const { $metadata, ...outputWithoutMetadata } = response.output;
        logger.info({
          clientName,
          commandName,
          input: inputFilterSensitiveLog(args.input),
          output: outputFilterSensitiveLog(outputWithoutMetadata),
          metadata: $metadata
        });
      }
      return response;
    };
    exports.loggerMiddleware = loggerMiddleware;
    exports.loggerMiddlewareOptions = {
      name: "loggerMiddleware",
      tags: ["LOGGER"],
      step: "initialize",
      override: true
    };
    var getLoggerPlugin = (options) => ({
      applyToStack: (clientStack) => {
        clientStack.add((0, exports.loggerMiddleware)(), exports.loggerMiddlewareOptions);
      }
    });
    exports.getLoggerPlugin = getLoggerPlugin;
  }
});

// node_modules/@aws-sdk/middleware-logger/dist-cjs/index.js
var require_dist_cjs10 = __commonJS({
  "node_modules/@aws-sdk/middleware-logger/dist-cjs/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require_tslib();
    tslib_1.__exportStar(require_loggerMiddleware(), exports);
  }
});

// node_modules/@aws-sdk/middleware-recursion-detection/dist-cjs/index.js
var require_dist_cjs11 = __commonJS({
  "node_modules/@aws-sdk/middleware-recursion-detection/dist-cjs/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getRecursionDetectionPlugin = exports.addRecursionDetectionMiddlewareOptions = exports.recursionDetectionMiddleware = void 0;
    var protocol_http_1 = require_dist_cjs4();
    var TRACE_ID_HEADER_NAME = "X-Amzn-Trace-Id";
    var ENV_LAMBDA_FUNCTION_NAME = "AWS_LAMBDA_FUNCTION_NAME";
    var ENV_TRACE_ID = "_X_AMZN_TRACE_ID";
    var recursionDetectionMiddleware = (options) => (next) => async (args) => {
      const { request } = args;
      if (!protocol_http_1.HttpRequest.isInstance(request) || options.runtime !== "node" || request.headers.hasOwnProperty(TRACE_ID_HEADER_NAME)) {
        return next(args);
      }
      const functionName = process.env[ENV_LAMBDA_FUNCTION_NAME];
      const traceId = process.env[ENV_TRACE_ID];
      const nonEmptyString = (str) => typeof str === "string" && str.length > 0;
      if (nonEmptyString(functionName) && nonEmptyString(traceId)) {
        request.headers[TRACE_ID_HEADER_NAME] = traceId;
      }
      return next({
        ...args,
        request
      });
    };
    exports.recursionDetectionMiddleware = recursionDetectionMiddleware;
    exports.addRecursionDetectionMiddlewareOptions = {
      step: "build",
      tags: ["RECURSION_DETECTION"],
      name: "recursionDetectionMiddleware",
      override: true,
      priority: "low"
    };
    var getRecursionDetectionPlugin = (options) => ({
      applyToStack: (clientStack) => {
        clientStack.add((0, exports.recursionDetectionMiddleware)(options), exports.addRecursionDetectionMiddlewareOptions);
      }
    });
    exports.getRecursionDetectionPlugin = getRecursionDetectionPlugin;
  }
});

// node_modules/@aws-sdk/middleware-retry/dist-cjs/config.js
var require_config2 = __commonJS({
  "node_modules/@aws-sdk/middleware-retry/dist-cjs/config.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DEFAULT_RETRY_MODE = exports.DEFAULT_MAX_ATTEMPTS = exports.RETRY_MODES = void 0;
    var RETRY_MODES;
    (function(RETRY_MODES2) {
      RETRY_MODES2["STANDARD"] = "standard";
      RETRY_MODES2["ADAPTIVE"] = "adaptive";
    })(RETRY_MODES = exports.RETRY_MODES || (exports.RETRY_MODES = {}));
    exports.DEFAULT_MAX_ATTEMPTS = 3;
    exports.DEFAULT_RETRY_MODE = RETRY_MODES.STANDARD;
  }
});

// node_modules/@aws-sdk/service-error-classification/dist-cjs/constants.js
var require_constants2 = __commonJS({
  "node_modules/@aws-sdk/service-error-classification/dist-cjs/constants.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TRANSIENT_ERROR_STATUS_CODES = exports.TRANSIENT_ERROR_CODES = exports.THROTTLING_ERROR_CODES = exports.CLOCK_SKEW_ERROR_CODES = void 0;
    exports.CLOCK_SKEW_ERROR_CODES = [
      "AuthFailure",
      "InvalidSignatureException",
      "RequestExpired",
      "RequestInTheFuture",
      "RequestTimeTooSkewed",
      "SignatureDoesNotMatch"
    ];
    exports.THROTTLING_ERROR_CODES = [
      "BandwidthLimitExceeded",
      "EC2ThrottledException",
      "LimitExceededException",
      "PriorRequestNotComplete",
      "ProvisionedThroughputExceededException",
      "RequestLimitExceeded",
      "RequestThrottled",
      "RequestThrottledException",
      "SlowDown",
      "ThrottledException",
      "Throttling",
      "ThrottlingException",
      "TooManyRequestsException",
      "TransactionInProgressException"
    ];
    exports.TRANSIENT_ERROR_CODES = ["AbortError", "TimeoutError", "RequestTimeout", "RequestTimeoutException"];
    exports.TRANSIENT_ERROR_STATUS_CODES = [500, 502, 503, 504];
  }
});

// node_modules/@aws-sdk/service-error-classification/dist-cjs/index.js
var require_dist_cjs12 = __commonJS({
  "node_modules/@aws-sdk/service-error-classification/dist-cjs/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isTransientError = exports.isThrottlingError = exports.isClockSkewError = exports.isRetryableByTrait = void 0;
    var constants_1 = require_constants2();
    var isRetryableByTrait = (error) => error.$retryable !== void 0;
    exports.isRetryableByTrait = isRetryableByTrait;
    var isClockSkewError = (error) => constants_1.CLOCK_SKEW_ERROR_CODES.includes(error.name);
    exports.isClockSkewError = isClockSkewError;
    var isThrottlingError = (error) => {
      var _a, _b;
      return ((_a = error.$metadata) === null || _a === void 0 ? void 0 : _a.httpStatusCode) === 429 || constants_1.THROTTLING_ERROR_CODES.includes(error.name) || ((_b = error.$retryable) === null || _b === void 0 ? void 0 : _b.throttling) == true;
    };
    exports.isThrottlingError = isThrottlingError;
    var isTransientError = (error) => {
      var _a;
      return constants_1.TRANSIENT_ERROR_CODES.includes(error.name) || constants_1.TRANSIENT_ERROR_STATUS_CODES.includes(((_a = error.$metadata) === null || _a === void 0 ? void 0 : _a.httpStatusCode) || 0);
    };
    exports.isTransientError = isTransientError;
  }
});

// node_modules/@aws-sdk/middleware-retry/dist-cjs/DefaultRateLimiter.js
var require_DefaultRateLimiter = __commonJS({
  "node_modules/@aws-sdk/middleware-retry/dist-cjs/DefaultRateLimiter.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DefaultRateLimiter = void 0;
    var service_error_classification_1 = require_dist_cjs12();
    var DefaultRateLimiter = class {
      constructor(options) {
        var _a, _b, _c, _d, _e;
        this.currentCapacity = 0;
        this.enabled = false;
        this.lastMaxRate = 0;
        this.measuredTxRate = 0;
        this.requestCount = 0;
        this.lastTimestamp = 0;
        this.timeWindow = 0;
        this.beta = (_a = options === null || options === void 0 ? void 0 : options.beta) !== null && _a !== void 0 ? _a : 0.7;
        this.minCapacity = (_b = options === null || options === void 0 ? void 0 : options.minCapacity) !== null && _b !== void 0 ? _b : 1;
        this.minFillRate = (_c = options === null || options === void 0 ? void 0 : options.minFillRate) !== null && _c !== void 0 ? _c : 0.5;
        this.scaleConstant = (_d = options === null || options === void 0 ? void 0 : options.scaleConstant) !== null && _d !== void 0 ? _d : 0.4;
        this.smooth = (_e = options === null || options === void 0 ? void 0 : options.smooth) !== null && _e !== void 0 ? _e : 0.8;
        const currentTimeInSeconds = this.getCurrentTimeInSeconds();
        this.lastThrottleTime = currentTimeInSeconds;
        this.lastTxRateBucket = Math.floor(this.getCurrentTimeInSeconds());
        this.fillRate = this.minFillRate;
        this.maxCapacity = this.minCapacity;
      }
      getCurrentTimeInSeconds() {
        return Date.now() / 1e3;
      }
      async getSendToken() {
        return this.acquireTokenBucket(1);
      }
      async acquireTokenBucket(amount) {
        if (!this.enabled) {
          return;
        }
        this.refillTokenBucket();
        if (amount > this.currentCapacity) {
          const delay = (amount - this.currentCapacity) / this.fillRate * 1e3;
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
        this.currentCapacity = this.currentCapacity - amount;
      }
      refillTokenBucket() {
        const timestamp = this.getCurrentTimeInSeconds();
        if (!this.lastTimestamp) {
          this.lastTimestamp = timestamp;
          return;
        }
        const fillAmount = (timestamp - this.lastTimestamp) * this.fillRate;
        this.currentCapacity = Math.min(this.maxCapacity, this.currentCapacity + fillAmount);
        this.lastTimestamp = timestamp;
      }
      updateClientSendingRate(response) {
        let calculatedRate;
        this.updateMeasuredRate();
        if ((0, service_error_classification_1.isThrottlingError)(response)) {
          const rateToUse = !this.enabled ? this.measuredTxRate : Math.min(this.measuredTxRate, this.fillRate);
          this.lastMaxRate = rateToUse;
          this.calculateTimeWindow();
          this.lastThrottleTime = this.getCurrentTimeInSeconds();
          calculatedRate = this.cubicThrottle(rateToUse);
          this.enableTokenBucket();
        } else {
          this.calculateTimeWindow();
          calculatedRate = this.cubicSuccess(this.getCurrentTimeInSeconds());
        }
        const newRate = Math.min(calculatedRate, 2 * this.measuredTxRate);
        this.updateTokenBucketRate(newRate);
      }
      calculateTimeWindow() {
        this.timeWindow = this.getPrecise(Math.pow(this.lastMaxRate * (1 - this.beta) / this.scaleConstant, 1 / 3));
      }
      cubicThrottle(rateToUse) {
        return this.getPrecise(rateToUse * this.beta);
      }
      cubicSuccess(timestamp) {
        return this.getPrecise(this.scaleConstant * Math.pow(timestamp - this.lastThrottleTime - this.timeWindow, 3) + this.lastMaxRate);
      }
      enableTokenBucket() {
        this.enabled = true;
      }
      updateTokenBucketRate(newRate) {
        this.refillTokenBucket();
        this.fillRate = Math.max(newRate, this.minFillRate);
        this.maxCapacity = Math.max(newRate, this.minCapacity);
        this.currentCapacity = Math.min(this.currentCapacity, this.maxCapacity);
      }
      updateMeasuredRate() {
        const t2 = this.getCurrentTimeInSeconds();
        const timeBucket = Math.floor(t2 * 2) / 2;
        this.requestCount++;
        if (timeBucket > this.lastTxRateBucket) {
          const currentRate = this.requestCount / (timeBucket - this.lastTxRateBucket);
          this.measuredTxRate = this.getPrecise(currentRate * this.smooth + this.measuredTxRate * (1 - this.smooth));
          this.requestCount = 0;
          this.lastTxRateBucket = timeBucket;
        }
      }
      getPrecise(num) {
        return parseFloat(num.toFixed(8));
      }
    };
    exports.DefaultRateLimiter = DefaultRateLimiter;
  }
});

// node_modules/@aws-sdk/middleware-retry/node_modules/uuid/dist/rng.js
var require_rng2 = __commonJS({
  "node_modules/@aws-sdk/middleware-retry/node_modules/uuid/dist/rng.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = rng;
    var _crypto = _interopRequireDefault(require("crypto"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    var rnds8Pool = new Uint8Array(256);
    var poolPtr = rnds8Pool.length;
    function rng() {
      if (poolPtr > rnds8Pool.length - 16) {
        _crypto.default.randomFillSync(rnds8Pool);
        poolPtr = 0;
      }
      return rnds8Pool.slice(poolPtr, poolPtr += 16);
    }
  }
});

// node_modules/@aws-sdk/middleware-retry/node_modules/uuid/dist/regex.js
var require_regex2 = __commonJS({
  "node_modules/@aws-sdk/middleware-retry/node_modules/uuid/dist/regex.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var _default = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
    exports.default = _default;
  }
});

// node_modules/@aws-sdk/middleware-retry/node_modules/uuid/dist/validate.js
var require_validate2 = __commonJS({
  "node_modules/@aws-sdk/middleware-retry/node_modules/uuid/dist/validate.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var _regex = _interopRequireDefault(require_regex2());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    function validate(uuid) {
      return typeof uuid === "string" && _regex.default.test(uuid);
    }
    var _default = validate;
    exports.default = _default;
  }
});

// node_modules/@aws-sdk/middleware-retry/node_modules/uuid/dist/stringify.js
var require_stringify2 = __commonJS({
  "node_modules/@aws-sdk/middleware-retry/node_modules/uuid/dist/stringify.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var _validate = _interopRequireDefault(require_validate2());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    var byteToHex = [];
    for (let i2 = 0; i2 < 256; ++i2) {
      byteToHex.push((i2 + 256).toString(16).substr(1));
    }
    function stringify(arr, offset = 0) {
      const uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
      if (!(0, _validate.default)(uuid)) {
        throw TypeError("Stringified UUID is invalid");
      }
      return uuid;
    }
    var _default = stringify;
    exports.default = _default;
  }
});

// node_modules/@aws-sdk/middleware-retry/node_modules/uuid/dist/v1.js
var require_v12 = __commonJS({
  "node_modules/@aws-sdk/middleware-retry/node_modules/uuid/dist/v1.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var _rng = _interopRequireDefault(require_rng2());
    var _stringify = _interopRequireDefault(require_stringify2());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    var _nodeId;
    var _clockseq;
    var _lastMSecs = 0;
    var _lastNSecs = 0;
    function v1(options, buf, offset) {
      let i2 = buf && offset || 0;
      const b = buf || new Array(16);
      options = options || {};
      let node = options.node || _nodeId;
      let clockseq = options.clockseq !== void 0 ? options.clockseq : _clockseq;
      if (node == null || clockseq == null) {
        const seedBytes = options.random || (options.rng || _rng.default)();
        if (node == null) {
          node = _nodeId = [seedBytes[0] | 1, seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];
        }
        if (clockseq == null) {
          clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 16383;
        }
      }
      let msecs = options.msecs !== void 0 ? options.msecs : Date.now();
      let nsecs = options.nsecs !== void 0 ? options.nsecs : _lastNSecs + 1;
      const dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 1e4;
      if (dt < 0 && options.clockseq === void 0) {
        clockseq = clockseq + 1 & 16383;
      }
      if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === void 0) {
        nsecs = 0;
      }
      if (nsecs >= 1e4) {
        throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
      }
      _lastMSecs = msecs;
      _lastNSecs = nsecs;
      _clockseq = clockseq;
      msecs += 122192928e5;
      const tl = ((msecs & 268435455) * 1e4 + nsecs) % 4294967296;
      b[i2++] = tl >>> 24 & 255;
      b[i2++] = tl >>> 16 & 255;
      b[i2++] = tl >>> 8 & 255;
      b[i2++] = tl & 255;
      const tmh = msecs / 4294967296 * 1e4 & 268435455;
      b[i2++] = tmh >>> 8 & 255;
      b[i2++] = tmh & 255;
      b[i2++] = tmh >>> 24 & 15 | 16;
      b[i2++] = tmh >>> 16 & 255;
      b[i2++] = clockseq >>> 8 | 128;
      b[i2++] = clockseq & 255;
      for (let n = 0; n < 6; ++n) {
        b[i2 + n] = node[n];
      }
      return buf || (0, _stringify.default)(b);
    }
    var _default = v1;
    exports.default = _default;
  }
});

// node_modules/@aws-sdk/middleware-retry/node_modules/uuid/dist/parse.js
var require_parse2 = __commonJS({
  "node_modules/@aws-sdk/middleware-retry/node_modules/uuid/dist/parse.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var _validate = _interopRequireDefault(require_validate2());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    function parse(uuid) {
      if (!(0, _validate.default)(uuid)) {
        throw TypeError("Invalid UUID");
      }
      let v;
      const arr = new Uint8Array(16);
      arr[0] = (v = parseInt(uuid.slice(0, 8), 16)) >>> 24;
      arr[1] = v >>> 16 & 255;
      arr[2] = v >>> 8 & 255;
      arr[3] = v & 255;
      arr[4] = (v = parseInt(uuid.slice(9, 13), 16)) >>> 8;
      arr[5] = v & 255;
      arr[6] = (v = parseInt(uuid.slice(14, 18), 16)) >>> 8;
      arr[7] = v & 255;
      arr[8] = (v = parseInt(uuid.slice(19, 23), 16)) >>> 8;
      arr[9] = v & 255;
      arr[10] = (v = parseInt(uuid.slice(24, 36), 16)) / 1099511627776 & 255;
      arr[11] = v / 4294967296 & 255;
      arr[12] = v >>> 24 & 255;
      arr[13] = v >>> 16 & 255;
      arr[14] = v >>> 8 & 255;
      arr[15] = v & 255;
      return arr;
    }
    var _default = parse;
    exports.default = _default;
  }
});

// node_modules/@aws-sdk/middleware-retry/node_modules/uuid/dist/v35.js
var require_v352 = __commonJS({
  "node_modules/@aws-sdk/middleware-retry/node_modules/uuid/dist/v35.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = _default;
    exports.URL = exports.DNS = void 0;
    var _stringify = _interopRequireDefault(require_stringify2());
    var _parse = _interopRequireDefault(require_parse2());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    function stringToBytes(str) {
      str = unescape(encodeURIComponent(str));
      const bytes = [];
      for (let i2 = 0; i2 < str.length; ++i2) {
        bytes.push(str.charCodeAt(i2));
      }
      return bytes;
    }
    var DNS = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";
    exports.DNS = DNS;
    var URL2 = "6ba7b811-9dad-11d1-80b4-00c04fd430c8";
    exports.URL = URL2;
    function _default(name, version, hashfunc) {
      function generateUUID(value, namespace, buf, offset) {
        if (typeof value === "string") {
          value = stringToBytes(value);
        }
        if (typeof namespace === "string") {
          namespace = (0, _parse.default)(namespace);
        }
        if (namespace.length !== 16) {
          throw TypeError("Namespace must be array-like (16 iterable integer values, 0-255)");
        }
        let bytes = new Uint8Array(16 + value.length);
        bytes.set(namespace);
        bytes.set(value, namespace.length);
        bytes = hashfunc(bytes);
        bytes[6] = bytes[6] & 15 | version;
        bytes[8] = bytes[8] & 63 | 128;
        if (buf) {
          offset = offset || 0;
          for (let i2 = 0; i2 < 16; ++i2) {
            buf[offset + i2] = bytes[i2];
          }
          return buf;
        }
        return (0, _stringify.default)(bytes);
      }
      try {
        generateUUID.name = name;
      } catch (err) {
      }
      generateUUID.DNS = DNS;
      generateUUID.URL = URL2;
      return generateUUID;
    }
  }
});

// node_modules/@aws-sdk/middleware-retry/node_modules/uuid/dist/md5.js
var require_md52 = __commonJS({
  "node_modules/@aws-sdk/middleware-retry/node_modules/uuid/dist/md5.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var _crypto = _interopRequireDefault(require("crypto"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    function md5(bytes) {
      if (Array.isArray(bytes)) {
        bytes = Buffer.from(bytes);
      } else if (typeof bytes === "string") {
        bytes = Buffer.from(bytes, "utf8");
      }
      return _crypto.default.createHash("md5").update(bytes).digest();
    }
    var _default = md5;
    exports.default = _default;
  }
});

// node_modules/@aws-sdk/middleware-retry/node_modules/uuid/dist/v3.js
var require_v32 = __commonJS({
  "node_modules/@aws-sdk/middleware-retry/node_modules/uuid/dist/v3.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var _v = _interopRequireDefault(require_v352());
    var _md = _interopRequireDefault(require_md52());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    var v3 = (0, _v.default)("v3", 48, _md.default);
    var _default = v3;
    exports.default = _default;
  }
});

// node_modules/@aws-sdk/middleware-retry/node_modules/uuid/dist/v4.js
var require_v42 = __commonJS({
  "node_modules/@aws-sdk/middleware-retry/node_modules/uuid/dist/v4.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var _rng = _interopRequireDefault(require_rng2());
    var _stringify = _interopRequireDefault(require_stringify2());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    function v4(options, buf, offset) {
      options = options || {};
      const rnds = options.random || (options.rng || _rng.default)();
      rnds[6] = rnds[6] & 15 | 64;
      rnds[8] = rnds[8] & 63 | 128;
      if (buf) {
        offset = offset || 0;
        for (let i2 = 0; i2 < 16; ++i2) {
          buf[offset + i2] = rnds[i2];
        }
        return buf;
      }
      return (0, _stringify.default)(rnds);
    }
    var _default = v4;
    exports.default = _default;
  }
});

// node_modules/@aws-sdk/middleware-retry/node_modules/uuid/dist/sha1.js
var require_sha12 = __commonJS({
  "node_modules/@aws-sdk/middleware-retry/node_modules/uuid/dist/sha1.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var _crypto = _interopRequireDefault(require("crypto"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    function sha1(bytes) {
      if (Array.isArray(bytes)) {
        bytes = Buffer.from(bytes);
      } else if (typeof bytes === "string") {
        bytes = Buffer.from(bytes, "utf8");
      }
      return _crypto.default.createHash("sha1").update(bytes).digest();
    }
    var _default = sha1;
    exports.default = _default;
  }
});

// node_modules/@aws-sdk/middleware-retry/node_modules/uuid/dist/v5.js
var require_v52 = __commonJS({
  "node_modules/@aws-sdk/middleware-retry/node_modules/uuid/dist/v5.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var _v = _interopRequireDefault(require_v352());
    var _sha = _interopRequireDefault(require_sha12());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    var v5 = (0, _v.default)("v5", 80, _sha.default);
    var _default = v5;
    exports.default = _default;
  }
});

// node_modules/@aws-sdk/middleware-retry/node_modules/uuid/dist/nil.js
var require_nil2 = __commonJS({
  "node_modules/@aws-sdk/middleware-retry/node_modules/uuid/dist/nil.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var _default = "00000000-0000-0000-0000-000000000000";
    exports.default = _default;
  }
});

// node_modules/@aws-sdk/middleware-retry/node_modules/uuid/dist/version.js
var require_version2 = __commonJS({
  "node_modules/@aws-sdk/middleware-retry/node_modules/uuid/dist/version.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var _validate = _interopRequireDefault(require_validate2());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    function version(uuid) {
      if (!(0, _validate.default)(uuid)) {
        throw TypeError("Invalid UUID");
      }
      return parseInt(uuid.substr(14, 1), 16);
    }
    var _default = version;
    exports.default = _default;
  }
});

// node_modules/@aws-sdk/middleware-retry/node_modules/uuid/dist/index.js
var require_dist2 = __commonJS({
  "node_modules/@aws-sdk/middleware-retry/node_modules/uuid/dist/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    Object.defineProperty(exports, "v1", {
      enumerable: true,
      get: function() {
        return _v.default;
      }
    });
    Object.defineProperty(exports, "v3", {
      enumerable: true,
      get: function() {
        return _v2.default;
      }
    });
    Object.defineProperty(exports, "v4", {
      enumerable: true,
      get: function() {
        return _v3.default;
      }
    });
    Object.defineProperty(exports, "v5", {
      enumerable: true,
      get: function() {
        return _v4.default;
      }
    });
    Object.defineProperty(exports, "NIL", {
      enumerable: true,
      get: function() {
        return _nil.default;
      }
    });
    Object.defineProperty(exports, "version", {
      enumerable: true,
      get: function() {
        return _version.default;
      }
    });
    Object.defineProperty(exports, "validate", {
      enumerable: true,
      get: function() {
        return _validate.default;
      }
    });
    Object.defineProperty(exports, "stringify", {
      enumerable: true,
      get: function() {
        return _stringify.default;
      }
    });
    Object.defineProperty(exports, "parse", {
      enumerable: true,
      get: function() {
        return _parse.default;
      }
    });
    var _v = _interopRequireDefault(require_v12());
    var _v2 = _interopRequireDefault(require_v32());
    var _v3 = _interopRequireDefault(require_v42());
    var _v4 = _interopRequireDefault(require_v52());
    var _nil = _interopRequireDefault(require_nil2());
    var _version = _interopRequireDefault(require_version2());
    var _validate = _interopRequireDefault(require_validate2());
    var _stringify = _interopRequireDefault(require_stringify2());
    var _parse = _interopRequireDefault(require_parse2());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
  }
});

// node_modules/@aws-sdk/middleware-retry/dist-cjs/constants.js
var require_constants3 = __commonJS({
  "node_modules/@aws-sdk/middleware-retry/dist-cjs/constants.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.REQUEST_HEADER = exports.INVOCATION_ID_HEADER = exports.NO_RETRY_INCREMENT = exports.TIMEOUT_RETRY_COST = exports.RETRY_COST = exports.INITIAL_RETRY_TOKENS = exports.THROTTLING_RETRY_DELAY_BASE = exports.MAXIMUM_RETRY_DELAY = exports.DEFAULT_RETRY_DELAY_BASE = void 0;
    exports.DEFAULT_RETRY_DELAY_BASE = 100;
    exports.MAXIMUM_RETRY_DELAY = 20 * 1e3;
    exports.THROTTLING_RETRY_DELAY_BASE = 500;
    exports.INITIAL_RETRY_TOKENS = 500;
    exports.RETRY_COST = 5;
    exports.TIMEOUT_RETRY_COST = 10;
    exports.NO_RETRY_INCREMENT = 1;
    exports.INVOCATION_ID_HEADER = "amz-sdk-invocation-id";
    exports.REQUEST_HEADER = "amz-sdk-request";
  }
});

// node_modules/@aws-sdk/middleware-retry/dist-cjs/defaultRetryQuota.js
var require_defaultRetryQuota = __commonJS({
  "node_modules/@aws-sdk/middleware-retry/dist-cjs/defaultRetryQuota.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getDefaultRetryQuota = void 0;
    var constants_1 = require_constants3();
    var getDefaultRetryQuota = (initialRetryTokens, options) => {
      var _a, _b, _c;
      const MAX_CAPACITY = initialRetryTokens;
      const noRetryIncrement = (_a = options === null || options === void 0 ? void 0 : options.noRetryIncrement) !== null && _a !== void 0 ? _a : constants_1.NO_RETRY_INCREMENT;
      const retryCost = (_b = options === null || options === void 0 ? void 0 : options.retryCost) !== null && _b !== void 0 ? _b : constants_1.RETRY_COST;
      const timeoutRetryCost = (_c = options === null || options === void 0 ? void 0 : options.timeoutRetryCost) !== null && _c !== void 0 ? _c : constants_1.TIMEOUT_RETRY_COST;
      let availableCapacity = initialRetryTokens;
      const getCapacityAmount = (error) => error.name === "TimeoutError" ? timeoutRetryCost : retryCost;
      const hasRetryTokens = (error) => getCapacityAmount(error) <= availableCapacity;
      const retrieveRetryTokens = (error) => {
        if (!hasRetryTokens(error)) {
          throw new Error("No retry token available");
        }
        const capacityAmount = getCapacityAmount(error);
        availableCapacity -= capacityAmount;
        return capacityAmount;
      };
      const releaseRetryTokens = (capacityReleaseAmount) => {
        availableCapacity += capacityReleaseAmount !== null && capacityReleaseAmount !== void 0 ? capacityReleaseAmount : noRetryIncrement;
        availableCapacity = Math.min(availableCapacity, MAX_CAPACITY);
      };
      return Object.freeze({
        hasRetryTokens,
        retrieveRetryTokens,
        releaseRetryTokens
      });
    };
    exports.getDefaultRetryQuota = getDefaultRetryQuota;
  }
});

// node_modules/@aws-sdk/middleware-retry/dist-cjs/delayDecider.js
var require_delayDecider = __commonJS({
  "node_modules/@aws-sdk/middleware-retry/dist-cjs/delayDecider.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.defaultDelayDecider = void 0;
    var constants_1 = require_constants3();
    var defaultDelayDecider = (delayBase, attempts) => Math.floor(Math.min(constants_1.MAXIMUM_RETRY_DELAY, Math.random() * 2 ** attempts * delayBase));
    exports.defaultDelayDecider = defaultDelayDecider;
  }
});

// node_modules/@aws-sdk/middleware-retry/dist-cjs/retryDecider.js
var require_retryDecider = __commonJS({
  "node_modules/@aws-sdk/middleware-retry/dist-cjs/retryDecider.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.defaultRetryDecider = void 0;
    var service_error_classification_1 = require_dist_cjs12();
    var defaultRetryDecider = (error) => {
      if (!error) {
        return false;
      }
      return (0, service_error_classification_1.isRetryableByTrait)(error) || (0, service_error_classification_1.isClockSkewError)(error) || (0, service_error_classification_1.isThrottlingError)(error) || (0, service_error_classification_1.isTransientError)(error);
    };
    exports.defaultRetryDecider = defaultRetryDecider;
  }
});

// node_modules/@aws-sdk/middleware-retry/dist-cjs/StandardRetryStrategy.js
var require_StandardRetryStrategy = __commonJS({
  "node_modules/@aws-sdk/middleware-retry/dist-cjs/StandardRetryStrategy.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.StandardRetryStrategy = void 0;
    var protocol_http_1 = require_dist_cjs4();
    var service_error_classification_1 = require_dist_cjs12();
    var uuid_1 = require_dist2();
    var config_1 = require_config2();
    var constants_1 = require_constants3();
    var defaultRetryQuota_1 = require_defaultRetryQuota();
    var delayDecider_1 = require_delayDecider();
    var retryDecider_1 = require_retryDecider();
    var StandardRetryStrategy = class {
      constructor(maxAttemptsProvider, options) {
        var _a, _b, _c;
        this.maxAttemptsProvider = maxAttemptsProvider;
        this.mode = config_1.RETRY_MODES.STANDARD;
        this.retryDecider = (_a = options === null || options === void 0 ? void 0 : options.retryDecider) !== null && _a !== void 0 ? _a : retryDecider_1.defaultRetryDecider;
        this.delayDecider = (_b = options === null || options === void 0 ? void 0 : options.delayDecider) !== null && _b !== void 0 ? _b : delayDecider_1.defaultDelayDecider;
        this.retryQuota = (_c = options === null || options === void 0 ? void 0 : options.retryQuota) !== null && _c !== void 0 ? _c : (0, defaultRetryQuota_1.getDefaultRetryQuota)(constants_1.INITIAL_RETRY_TOKENS);
      }
      shouldRetry(error, attempts, maxAttempts) {
        return attempts < maxAttempts && this.retryDecider(error) && this.retryQuota.hasRetryTokens(error);
      }
      async getMaxAttempts() {
        let maxAttempts;
        try {
          maxAttempts = await this.maxAttemptsProvider();
        } catch (error) {
          maxAttempts = config_1.DEFAULT_MAX_ATTEMPTS;
        }
        return maxAttempts;
      }
      async retry(next, args, options) {
        let retryTokenAmount;
        let attempts = 0;
        let totalDelay = 0;
        const maxAttempts = await this.getMaxAttempts();
        const { request } = args;
        if (protocol_http_1.HttpRequest.isInstance(request)) {
          request.headers[constants_1.INVOCATION_ID_HEADER] = (0, uuid_1.v4)();
        }
        while (true) {
          try {
            if (protocol_http_1.HttpRequest.isInstance(request)) {
              request.headers[constants_1.REQUEST_HEADER] = `attempt=${attempts + 1}; max=${maxAttempts}`;
            }
            if (options === null || options === void 0 ? void 0 : options.beforeRequest) {
              await options.beforeRequest();
            }
            const { response, output } = await next(args);
            if (options === null || options === void 0 ? void 0 : options.afterRequest) {
              options.afterRequest(response);
            }
            this.retryQuota.releaseRetryTokens(retryTokenAmount);
            output.$metadata.attempts = attempts + 1;
            output.$metadata.totalRetryDelay = totalDelay;
            return { response, output };
          } catch (e2) {
            const err = asSdkError(e2);
            attempts++;
            if (this.shouldRetry(err, attempts, maxAttempts)) {
              retryTokenAmount = this.retryQuota.retrieveRetryTokens(err);
              const delay = this.delayDecider((0, service_error_classification_1.isThrottlingError)(err) ? constants_1.THROTTLING_RETRY_DELAY_BASE : constants_1.DEFAULT_RETRY_DELAY_BASE, attempts);
              totalDelay += delay;
              await new Promise((resolve) => setTimeout(resolve, delay));
              continue;
            }
            if (!err.$metadata) {
              err.$metadata = {};
            }
            err.$metadata.attempts = attempts;
            err.$metadata.totalRetryDelay = totalDelay;
            throw err;
          }
        }
      }
    };
    exports.StandardRetryStrategy = StandardRetryStrategy;
    var asSdkError = (error) => {
      if (error instanceof Error)
        return error;
      if (error instanceof Object)
        return Object.assign(new Error(), error);
      if (typeof error === "string")
        return new Error(error);
      return new Error(`AWS SDK error wrapper for ${error}`);
    };
  }
});

// node_modules/@aws-sdk/middleware-retry/dist-cjs/AdaptiveRetryStrategy.js
var require_AdaptiveRetryStrategy = __commonJS({
  "node_modules/@aws-sdk/middleware-retry/dist-cjs/AdaptiveRetryStrategy.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AdaptiveRetryStrategy = void 0;
    var config_1 = require_config2();
    var DefaultRateLimiter_1 = require_DefaultRateLimiter();
    var StandardRetryStrategy_1 = require_StandardRetryStrategy();
    var AdaptiveRetryStrategy = class extends StandardRetryStrategy_1.StandardRetryStrategy {
      constructor(maxAttemptsProvider, options) {
        const { rateLimiter, ...superOptions } = options !== null && options !== void 0 ? options : {};
        super(maxAttemptsProvider, superOptions);
        this.rateLimiter = rateLimiter !== null && rateLimiter !== void 0 ? rateLimiter : new DefaultRateLimiter_1.DefaultRateLimiter();
        this.mode = config_1.RETRY_MODES.ADAPTIVE;
      }
      async retry(next, args) {
        return super.retry(next, args, {
          beforeRequest: async () => {
            return this.rateLimiter.getSendToken();
          },
          afterRequest: (response) => {
            this.rateLimiter.updateClientSendingRate(response);
          }
        });
      }
    };
    exports.AdaptiveRetryStrategy = AdaptiveRetryStrategy;
  }
});

// node_modules/@aws-sdk/middleware-retry/dist-cjs/configurations.js
var require_configurations = __commonJS({
  "node_modules/@aws-sdk/middleware-retry/dist-cjs/configurations.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NODE_RETRY_MODE_CONFIG_OPTIONS = exports.CONFIG_RETRY_MODE = exports.ENV_RETRY_MODE = exports.resolveRetryConfig = exports.NODE_MAX_ATTEMPT_CONFIG_OPTIONS = exports.CONFIG_MAX_ATTEMPTS = exports.ENV_MAX_ATTEMPTS = void 0;
    var util_middleware_1 = require_dist_cjs6();
    var AdaptiveRetryStrategy_1 = require_AdaptiveRetryStrategy();
    var config_1 = require_config2();
    var StandardRetryStrategy_1 = require_StandardRetryStrategy();
    exports.ENV_MAX_ATTEMPTS = "AWS_MAX_ATTEMPTS";
    exports.CONFIG_MAX_ATTEMPTS = "max_attempts";
    exports.NODE_MAX_ATTEMPT_CONFIG_OPTIONS = {
      environmentVariableSelector: (env) => {
        const value = env[exports.ENV_MAX_ATTEMPTS];
        if (!value)
          return void 0;
        const maxAttempt = parseInt(value);
        if (Number.isNaN(maxAttempt)) {
          throw new Error(`Environment variable ${exports.ENV_MAX_ATTEMPTS} mast be a number, got "${value}"`);
        }
        return maxAttempt;
      },
      configFileSelector: (profile) => {
        const value = profile[exports.CONFIG_MAX_ATTEMPTS];
        if (!value)
          return void 0;
        const maxAttempt = parseInt(value);
        if (Number.isNaN(maxAttempt)) {
          throw new Error(`Shared config file entry ${exports.CONFIG_MAX_ATTEMPTS} mast be a number, got "${value}"`);
        }
        return maxAttempt;
      },
      default: config_1.DEFAULT_MAX_ATTEMPTS
    };
    var resolveRetryConfig = (input) => {
      var _a;
      const maxAttempts = (0, util_middleware_1.normalizeProvider)((_a = input.maxAttempts) !== null && _a !== void 0 ? _a : config_1.DEFAULT_MAX_ATTEMPTS);
      return {
        ...input,
        maxAttempts,
        retryStrategy: async () => {
          if (input.retryStrategy) {
            return input.retryStrategy;
          }
          const retryMode = await (0, util_middleware_1.normalizeProvider)(input.retryMode)();
          if (retryMode === config_1.RETRY_MODES.ADAPTIVE) {
            return new AdaptiveRetryStrategy_1.AdaptiveRetryStrategy(maxAttempts);
          }
          return new StandardRetryStrategy_1.StandardRetryStrategy(maxAttempts);
        }
      };
    };
    exports.resolveRetryConfig = resolveRetryConfig;
    exports.ENV_RETRY_MODE = "AWS_RETRY_MODE";
    exports.CONFIG_RETRY_MODE = "retry_mode";
    exports.NODE_RETRY_MODE_CONFIG_OPTIONS = {
      environmentVariableSelector: (env) => env[exports.ENV_RETRY_MODE],
      configFileSelector: (profile) => profile[exports.CONFIG_RETRY_MODE],
      default: config_1.DEFAULT_RETRY_MODE
    };
  }
});

// node_modules/@aws-sdk/middleware-retry/dist-cjs/omitRetryHeadersMiddleware.js
var require_omitRetryHeadersMiddleware = __commonJS({
  "node_modules/@aws-sdk/middleware-retry/dist-cjs/omitRetryHeadersMiddleware.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getOmitRetryHeadersPlugin = exports.omitRetryHeadersMiddlewareOptions = exports.omitRetryHeadersMiddleware = void 0;
    var protocol_http_1 = require_dist_cjs4();
    var constants_1 = require_constants3();
    var omitRetryHeadersMiddleware = () => (next) => async (args) => {
      const { request } = args;
      if (protocol_http_1.HttpRequest.isInstance(request)) {
        delete request.headers[constants_1.INVOCATION_ID_HEADER];
        delete request.headers[constants_1.REQUEST_HEADER];
      }
      return next(args);
    };
    exports.omitRetryHeadersMiddleware = omitRetryHeadersMiddleware;
    exports.omitRetryHeadersMiddlewareOptions = {
      name: "omitRetryHeadersMiddleware",
      tags: ["RETRY", "HEADERS", "OMIT_RETRY_HEADERS"],
      relation: "before",
      toMiddleware: "awsAuthMiddleware",
      override: true
    };
    var getOmitRetryHeadersPlugin = (options) => ({
      applyToStack: (clientStack) => {
        clientStack.addRelativeTo((0, exports.omitRetryHeadersMiddleware)(), exports.omitRetryHeadersMiddlewareOptions);
      }
    });
    exports.getOmitRetryHeadersPlugin = getOmitRetryHeadersPlugin;
  }
});

// node_modules/@aws-sdk/middleware-retry/dist-cjs/retryMiddleware.js
var require_retryMiddleware = __commonJS({
  "node_modules/@aws-sdk/middleware-retry/dist-cjs/retryMiddleware.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getRetryPlugin = exports.retryMiddlewareOptions = exports.retryMiddleware = void 0;
    var retryMiddleware = (options) => (next, context) => async (args) => {
      const retryStrategy = await options.retryStrategy();
      if (retryStrategy === null || retryStrategy === void 0 ? void 0 : retryStrategy.mode)
        context.userAgent = [...context.userAgent || [], ["cfg/retry-mode", retryStrategy.mode]];
      return retryStrategy.retry(next, args);
    };
    exports.retryMiddleware = retryMiddleware;
    exports.retryMiddlewareOptions = {
      name: "retryMiddleware",
      tags: ["RETRY"],
      step: "finalizeRequest",
      priority: "high",
      override: true
    };
    var getRetryPlugin = (options) => ({
      applyToStack: (clientStack) => {
        clientStack.add((0, exports.retryMiddleware)(options), exports.retryMiddlewareOptions);
      }
    });
    exports.getRetryPlugin = getRetryPlugin;
  }
});

// node_modules/@aws-sdk/middleware-retry/dist-cjs/types.js
var require_types = __commonJS({
  "node_modules/@aws-sdk/middleware-retry/dist-cjs/types.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/@aws-sdk/middleware-retry/dist-cjs/index.js
var require_dist_cjs13 = __commonJS({
  "node_modules/@aws-sdk/middleware-retry/dist-cjs/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require_tslib();
    tslib_1.__exportStar(require_AdaptiveRetryStrategy(), exports);
    tslib_1.__exportStar(require_DefaultRateLimiter(), exports);
    tslib_1.__exportStar(require_StandardRetryStrategy(), exports);
    tslib_1.__exportStar(require_config2(), exports);
    tslib_1.__exportStar(require_configurations(), exports);
    tslib_1.__exportStar(require_delayDecider(), exports);
    tslib_1.__exportStar(require_omitRetryHeadersMiddleware(), exports);
    tslib_1.__exportStar(require_retryDecider(), exports);
    tslib_1.__exportStar(require_retryMiddleware(), exports);
    tslib_1.__exportStar(require_types(), exports);
  }
});

// node_modules/@aws-sdk/property-provider/dist-cjs/ProviderError.js
var require_ProviderError = __commonJS({
  "node_modules/@aws-sdk/property-provider/dist-cjs/ProviderError.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProviderError = void 0;
    var ProviderError = class extends Error {
      constructor(message, tryNextLink = true) {
        super(message);
        this.tryNextLink = tryNextLink;
        this.name = "ProviderError";
        Object.setPrototypeOf(this, ProviderError.prototype);
      }
      static from(error, tryNextLink = true) {
        return Object.assign(new this(error.message, tryNextLink), error);
      }
    };
    exports.ProviderError = ProviderError;
  }
});

// node_modules/@aws-sdk/property-provider/dist-cjs/CredentialsProviderError.js
var require_CredentialsProviderError = __commonJS({
  "node_modules/@aws-sdk/property-provider/dist-cjs/CredentialsProviderError.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CredentialsProviderError = void 0;
    var ProviderError_1 = require_ProviderError();
    var CredentialsProviderError = class extends ProviderError_1.ProviderError {
      constructor(message, tryNextLink = true) {
        super(message, tryNextLink);
        this.tryNextLink = tryNextLink;
        this.name = "CredentialsProviderError";
        Object.setPrototypeOf(this, CredentialsProviderError.prototype);
      }
    };
    exports.CredentialsProviderError = CredentialsProviderError;
  }
});

// node_modules/@aws-sdk/property-provider/dist-cjs/chain.js
var require_chain = __commonJS({
  "node_modules/@aws-sdk/property-provider/dist-cjs/chain.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.chain = void 0;
    var ProviderError_1 = require_ProviderError();
    function chain(...providers) {
      return () => {
        let promise = Promise.reject(new ProviderError_1.ProviderError("No providers in chain"));
        for (const provider of providers) {
          promise = promise.catch((err) => {
            if (err === null || err === void 0 ? void 0 : err.tryNextLink) {
              return provider();
            }
            throw err;
          });
        }
        return promise;
      };
    }
    exports.chain = chain;
  }
});

// node_modules/@aws-sdk/property-provider/dist-cjs/fromStatic.js
var require_fromStatic = __commonJS({
  "node_modules/@aws-sdk/property-provider/dist-cjs/fromStatic.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.fromStatic = void 0;
    var fromStatic = (staticValue) => () => Promise.resolve(staticValue);
    exports.fromStatic = fromStatic;
  }
});

// node_modules/@aws-sdk/property-provider/dist-cjs/memoize.js
var require_memoize = __commonJS({
  "node_modules/@aws-sdk/property-provider/dist-cjs/memoize.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.memoize = void 0;
    var memoize = (provider, isExpired, requiresRefresh) => {
      let resolved;
      let pending;
      let hasResult;
      let isConstant = false;
      const coalesceProvider = async () => {
        if (!pending) {
          pending = provider();
        }
        try {
          resolved = await pending;
          hasResult = true;
          isConstant = false;
        } finally {
          pending = void 0;
        }
        return resolved;
      };
      if (isExpired === void 0) {
        return async (options) => {
          if (!hasResult || (options === null || options === void 0 ? void 0 : options.forceRefresh)) {
            resolved = await coalesceProvider();
          }
          return resolved;
        };
      }
      return async (options) => {
        if (!hasResult || (options === null || options === void 0 ? void 0 : options.forceRefresh)) {
          resolved = await coalesceProvider();
        }
        if (isConstant) {
          return resolved;
        }
        if (requiresRefresh && !requiresRefresh(resolved)) {
          isConstant = true;
          return resolved;
        }
        if (isExpired(resolved)) {
          await coalesceProvider();
          return resolved;
        }
        return resolved;
      };
    };
    exports.memoize = memoize;
  }
});

// node_modules/@aws-sdk/property-provider/dist-cjs/index.js
var require_dist_cjs14 = __commonJS({
  "node_modules/@aws-sdk/property-provider/dist-cjs/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require_tslib();
    tslib_1.__exportStar(require_CredentialsProviderError(), exports);
    tslib_1.__exportStar(require_ProviderError(), exports);
    tslib_1.__exportStar(require_chain(), exports);
    tslib_1.__exportStar(require_fromStatic(), exports);
    tslib_1.__exportStar(require_memoize(), exports);
  }
});

// node_modules/@aws-sdk/util-hex-encoding/dist-cjs/index.js
var require_dist_cjs15 = __commonJS({
  "node_modules/@aws-sdk/util-hex-encoding/dist-cjs/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.toHex = exports.fromHex = void 0;
    var SHORT_TO_HEX = {};
    var HEX_TO_SHORT = {};
    for (let i2 = 0; i2 < 256; i2++) {
      let encodedByte = i2.toString(16).toLowerCase();
      if (encodedByte.length === 1) {
        encodedByte = `0${encodedByte}`;
      }
      SHORT_TO_HEX[i2] = encodedByte;
      HEX_TO_SHORT[encodedByte] = i2;
    }
    function fromHex(encoded) {
      if (encoded.length % 2 !== 0) {
        throw new Error("Hex encoded strings must have an even number length");
      }
      const out = new Uint8Array(encoded.length / 2);
      for (let i2 = 0; i2 < encoded.length; i2 += 2) {
        const encodedByte = encoded.slice(i2, i2 + 2).toLowerCase();
        if (encodedByte in HEX_TO_SHORT) {
          out[i2 / 2] = HEX_TO_SHORT[encodedByte];
        } else {
          throw new Error(`Cannot decode unrecognized sequence ${encodedByte} as hexadecimal`);
        }
      }
      return out;
    }
    exports.fromHex = fromHex;
    function toHex(bytes) {
      let out = "";
      for (let i2 = 0; i2 < bytes.byteLength; i2++) {
        out += SHORT_TO_HEX[bytes[i2]];
      }
      return out;
    }
    exports.toHex = toHex;
  }
});

// node_modules/@aws-sdk/signature-v4/dist-cjs/constants.js
var require_constants4 = __commonJS({
  "node_modules/@aws-sdk/signature-v4/dist-cjs/constants.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MAX_PRESIGNED_TTL = exports.KEY_TYPE_IDENTIFIER = exports.MAX_CACHE_SIZE = exports.UNSIGNED_PAYLOAD = exports.EVENT_ALGORITHM_IDENTIFIER = exports.ALGORITHM_IDENTIFIER_V4A = exports.ALGORITHM_IDENTIFIER = exports.UNSIGNABLE_PATTERNS = exports.SEC_HEADER_PATTERN = exports.PROXY_HEADER_PATTERN = exports.ALWAYS_UNSIGNABLE_HEADERS = exports.HOST_HEADER = exports.TOKEN_HEADER = exports.SHA256_HEADER = exports.SIGNATURE_HEADER = exports.GENERATED_HEADERS = exports.DATE_HEADER = exports.AMZ_DATE_HEADER = exports.AUTH_HEADER = exports.REGION_SET_PARAM = exports.TOKEN_QUERY_PARAM = exports.SIGNATURE_QUERY_PARAM = exports.EXPIRES_QUERY_PARAM = exports.SIGNED_HEADERS_QUERY_PARAM = exports.AMZ_DATE_QUERY_PARAM = exports.CREDENTIAL_QUERY_PARAM = exports.ALGORITHM_QUERY_PARAM = void 0;
    exports.ALGORITHM_QUERY_PARAM = "X-Amz-Algorithm";
    exports.CREDENTIAL_QUERY_PARAM = "X-Amz-Credential";
    exports.AMZ_DATE_QUERY_PARAM = "X-Amz-Date";
    exports.SIGNED_HEADERS_QUERY_PARAM = "X-Amz-SignedHeaders";
    exports.EXPIRES_QUERY_PARAM = "X-Amz-Expires";
    exports.SIGNATURE_QUERY_PARAM = "X-Amz-Signature";
    exports.TOKEN_QUERY_PARAM = "X-Amz-Security-Token";
    exports.REGION_SET_PARAM = "X-Amz-Region-Set";
    exports.AUTH_HEADER = "authorization";
    exports.AMZ_DATE_HEADER = exports.AMZ_DATE_QUERY_PARAM.toLowerCase();
    exports.DATE_HEADER = "date";
    exports.GENERATED_HEADERS = [exports.AUTH_HEADER, exports.AMZ_DATE_HEADER, exports.DATE_HEADER];
    exports.SIGNATURE_HEADER = exports.SIGNATURE_QUERY_PARAM.toLowerCase();
    exports.SHA256_HEADER = "x-amz-content-sha256";
    exports.TOKEN_HEADER = exports.TOKEN_QUERY_PARAM.toLowerCase();
    exports.HOST_HEADER = "host";
    exports.ALWAYS_UNSIGNABLE_HEADERS = {
      authorization: true,
      "cache-control": true,
      connection: true,
      expect: true,
      from: true,
      "keep-alive": true,
      "max-forwards": true,
      pragma: true,
      referer: true,
      te: true,
      trailer: true,
      "transfer-encoding": true,
      upgrade: true,
      "user-agent": true,
      "x-amzn-trace-id": true
    };
    exports.PROXY_HEADER_PATTERN = /^proxy-/;
    exports.SEC_HEADER_PATTERN = /^sec-/;
    exports.UNSIGNABLE_PATTERNS = [/^proxy-/i, /^sec-/i];
    exports.ALGORITHM_IDENTIFIER = "AWS4-HMAC-SHA256";
    exports.ALGORITHM_IDENTIFIER_V4A = "AWS4-ECDSA-P256-SHA256";
    exports.EVENT_ALGORITHM_IDENTIFIER = "AWS4-HMAC-SHA256-PAYLOAD";
    exports.UNSIGNED_PAYLOAD = "UNSIGNED-PAYLOAD";
    exports.MAX_CACHE_SIZE = 50;
    exports.KEY_TYPE_IDENTIFIER = "aws4_request";
    exports.MAX_PRESIGNED_TTL = 60 * 60 * 24 * 7;
  }
});

// node_modules/@aws-sdk/signature-v4/dist-cjs/credentialDerivation.js
var require_credentialDerivation = __commonJS({
  "node_modules/@aws-sdk/signature-v4/dist-cjs/credentialDerivation.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.clearCredentialCache = exports.getSigningKey = exports.createScope = void 0;
    var util_hex_encoding_1 = require_dist_cjs15();
    var constants_1 = require_constants4();
    var signingKeyCache = {};
    var cacheQueue = [];
    var createScope = (shortDate, region, service) => `${shortDate}/${region}/${service}/${constants_1.KEY_TYPE_IDENTIFIER}`;
    exports.createScope = createScope;
    var getSigningKey = async (sha256Constructor, credentials, shortDate, region, service) => {
      const credsHash = await hmac(sha256Constructor, credentials.secretAccessKey, credentials.accessKeyId);
      const cacheKey = `${shortDate}:${region}:${service}:${(0, util_hex_encoding_1.toHex)(credsHash)}:${credentials.sessionToken}`;
      if (cacheKey in signingKeyCache) {
        return signingKeyCache[cacheKey];
      }
      cacheQueue.push(cacheKey);
      while (cacheQueue.length > constants_1.MAX_CACHE_SIZE) {
        delete signingKeyCache[cacheQueue.shift()];
      }
      let key = `AWS4${credentials.secretAccessKey}`;
      for (const signable of [shortDate, region, service, constants_1.KEY_TYPE_IDENTIFIER]) {
        key = await hmac(sha256Constructor, key, signable);
      }
      return signingKeyCache[cacheKey] = key;
    };
    exports.getSigningKey = getSigningKey;
    var clearCredentialCache = () => {
      cacheQueue.length = 0;
      Object.keys(signingKeyCache).forEach((cacheKey) => {
        delete signingKeyCache[cacheKey];
      });
    };
    exports.clearCredentialCache = clearCredentialCache;
    var hmac = (ctor, secret, data) => {
      const hash = new ctor(secret);
      hash.update(data);
      return hash.digest();
    };
  }
});

// node_modules/@aws-sdk/signature-v4/dist-cjs/getCanonicalHeaders.js
var require_getCanonicalHeaders = __commonJS({
  "node_modules/@aws-sdk/signature-v4/dist-cjs/getCanonicalHeaders.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getCanonicalHeaders = void 0;
    var constants_1 = require_constants4();
    var getCanonicalHeaders = ({ headers }, unsignableHeaders, signableHeaders) => {
      const canonical = {};
      for (const headerName of Object.keys(headers).sort()) {
        const canonicalHeaderName = headerName.toLowerCase();
        if (canonicalHeaderName in constants_1.ALWAYS_UNSIGNABLE_HEADERS || (unsignableHeaders === null || unsignableHeaders === void 0 ? void 0 : unsignableHeaders.has(canonicalHeaderName)) || constants_1.PROXY_HEADER_PATTERN.test(canonicalHeaderName) || constants_1.SEC_HEADER_PATTERN.test(canonicalHeaderName)) {
          if (!signableHeaders || signableHeaders && !signableHeaders.has(canonicalHeaderName)) {
            continue;
          }
        }
        canonical[canonicalHeaderName] = headers[headerName].trim().replace(/\s+/g, " ");
      }
      return canonical;
    };
    exports.getCanonicalHeaders = getCanonicalHeaders;
  }
});

// node_modules/@aws-sdk/util-uri-escape/dist-cjs/escape-uri.js
var require_escape_uri = __commonJS({
  "node_modules/@aws-sdk/util-uri-escape/dist-cjs/escape-uri.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.escapeUri = void 0;
    var escapeUri = (uri) => encodeURIComponent(uri).replace(/[!'()*]/g, hexEncode);
    exports.escapeUri = escapeUri;
    var hexEncode = (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`;
  }
});

// node_modules/@aws-sdk/util-uri-escape/dist-cjs/escape-uri-path.js
var require_escape_uri_path = __commonJS({
  "node_modules/@aws-sdk/util-uri-escape/dist-cjs/escape-uri-path.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.escapeUriPath = void 0;
    var escape_uri_1 = require_escape_uri();
    var escapeUriPath = (uri) => uri.split("/").map(escape_uri_1.escapeUri).join("/");
    exports.escapeUriPath = escapeUriPath;
  }
});

// node_modules/@aws-sdk/util-uri-escape/dist-cjs/index.js
var require_dist_cjs16 = __commonJS({
  "node_modules/@aws-sdk/util-uri-escape/dist-cjs/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require_tslib();
    tslib_1.__exportStar(require_escape_uri(), exports);
    tslib_1.__exportStar(require_escape_uri_path(), exports);
  }
});

// node_modules/@aws-sdk/signature-v4/dist-cjs/getCanonicalQuery.js
var require_getCanonicalQuery = __commonJS({
  "node_modules/@aws-sdk/signature-v4/dist-cjs/getCanonicalQuery.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getCanonicalQuery = void 0;
    var util_uri_escape_1 = require_dist_cjs16();
    var constants_1 = require_constants4();
    var getCanonicalQuery = ({ query = {} }) => {
      const keys = [];
      const serialized = {};
      for (const key of Object.keys(query).sort()) {
        if (key.toLowerCase() === constants_1.SIGNATURE_HEADER) {
          continue;
        }
        keys.push(key);
        const value = query[key];
        if (typeof value === "string") {
          serialized[key] = `${(0, util_uri_escape_1.escapeUri)(key)}=${(0, util_uri_escape_1.escapeUri)(value)}`;
        } else if (Array.isArray(value)) {
          serialized[key] = value.slice(0).sort().reduce((encoded, value2) => encoded.concat([`${(0, util_uri_escape_1.escapeUri)(key)}=${(0, util_uri_escape_1.escapeUri)(value2)}`]), []).join("&");
        }
      }
      return keys.map((key) => serialized[key]).filter((serialized2) => serialized2).join("&");
    };
    exports.getCanonicalQuery = getCanonicalQuery;
  }
});

// node_modules/@aws-sdk/is-array-buffer/dist-cjs/index.js
var require_dist_cjs17 = __commonJS({
  "node_modules/@aws-sdk/is-array-buffer/dist-cjs/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isArrayBuffer = void 0;
    var isArrayBuffer = (arg) => typeof ArrayBuffer === "function" && arg instanceof ArrayBuffer || Object.prototype.toString.call(arg) === "[object ArrayBuffer]";
    exports.isArrayBuffer = isArrayBuffer;
  }
});

// node_modules/@aws-sdk/signature-v4/dist-cjs/getPayloadHash.js
var require_getPayloadHash = __commonJS({
  "node_modules/@aws-sdk/signature-v4/dist-cjs/getPayloadHash.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getPayloadHash = void 0;
    var is_array_buffer_1 = require_dist_cjs17();
    var util_hex_encoding_1 = require_dist_cjs15();
    var constants_1 = require_constants4();
    var getPayloadHash = async ({ headers, body }, hashConstructor) => {
      for (const headerName of Object.keys(headers)) {
        if (headerName.toLowerCase() === constants_1.SHA256_HEADER) {
          return headers[headerName];
        }
      }
      if (body == void 0) {
        return "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
      } else if (typeof body === "string" || ArrayBuffer.isView(body) || (0, is_array_buffer_1.isArrayBuffer)(body)) {
        const hashCtor = new hashConstructor();
        hashCtor.update(body);
        return (0, util_hex_encoding_1.toHex)(await hashCtor.digest());
      }
      return constants_1.UNSIGNED_PAYLOAD;
    };
    exports.getPayloadHash = getPayloadHash;
  }
});

// node_modules/@aws-sdk/signature-v4/dist-cjs/headerUtil.js
var require_headerUtil = __commonJS({
  "node_modules/@aws-sdk/signature-v4/dist-cjs/headerUtil.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.deleteHeader = exports.getHeaderValue = exports.hasHeader = void 0;
    var hasHeader = (soughtHeader, headers) => {
      soughtHeader = soughtHeader.toLowerCase();
      for (const headerName of Object.keys(headers)) {
        if (soughtHeader === headerName.toLowerCase()) {
          return true;
        }
      }
      return false;
    };
    exports.hasHeader = hasHeader;
    var getHeaderValue = (soughtHeader, headers) => {
      soughtHeader = soughtHeader.toLowerCase();
      for (const headerName of Object.keys(headers)) {
        if (soughtHeader === headerName.toLowerCase()) {
          return headers[headerName];
        }
      }
      return void 0;
    };
    exports.getHeaderValue = getHeaderValue;
    var deleteHeader = (soughtHeader, headers) => {
      soughtHeader = soughtHeader.toLowerCase();
      for (const headerName of Object.keys(headers)) {
        if (soughtHeader === headerName.toLowerCase()) {
          delete headers[headerName];
        }
      }
    };
    exports.deleteHeader = deleteHeader;
  }
});

// node_modules/@aws-sdk/signature-v4/dist-cjs/cloneRequest.js
var require_cloneRequest = __commonJS({
  "node_modules/@aws-sdk/signature-v4/dist-cjs/cloneRequest.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.cloneQuery = exports.cloneRequest = void 0;
    var cloneRequest = ({ headers, query, ...rest }) => ({
      ...rest,
      headers: { ...headers },
      query: query ? (0, exports.cloneQuery)(query) : void 0
    });
    exports.cloneRequest = cloneRequest;
    var cloneQuery = (query) => Object.keys(query).reduce((carry, paramName) => {
      const param = query[paramName];
      return {
        ...carry,
        [paramName]: Array.isArray(param) ? [...param] : param
      };
    }, {});
    exports.cloneQuery = cloneQuery;
  }
});

// node_modules/@aws-sdk/signature-v4/dist-cjs/moveHeadersToQuery.js
var require_moveHeadersToQuery = __commonJS({
  "node_modules/@aws-sdk/signature-v4/dist-cjs/moveHeadersToQuery.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.moveHeadersToQuery = void 0;
    var cloneRequest_1 = require_cloneRequest();
    var moveHeadersToQuery = (request, options = {}) => {
      var _a;
      const { headers, query = {} } = typeof request.clone === "function" ? request.clone() : (0, cloneRequest_1.cloneRequest)(request);
      for (const name of Object.keys(headers)) {
        const lname = name.toLowerCase();
        if (lname.slice(0, 6) === "x-amz-" && !((_a = options.unhoistableHeaders) === null || _a === void 0 ? void 0 : _a.has(lname))) {
          query[name] = headers[name];
          delete headers[name];
        }
      }
      return {
        ...request,
        headers,
        query
      };
    };
    exports.moveHeadersToQuery = moveHeadersToQuery;
  }
});

// node_modules/@aws-sdk/signature-v4/dist-cjs/prepareRequest.js
var require_prepareRequest = __commonJS({
  "node_modules/@aws-sdk/signature-v4/dist-cjs/prepareRequest.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.prepareRequest = void 0;
    var cloneRequest_1 = require_cloneRequest();
    var constants_1 = require_constants4();
    var prepareRequest = (request) => {
      request = typeof request.clone === "function" ? request.clone() : (0, cloneRequest_1.cloneRequest)(request);
      for (const headerName of Object.keys(request.headers)) {
        if (constants_1.GENERATED_HEADERS.indexOf(headerName.toLowerCase()) > -1) {
          delete request.headers[headerName];
        }
      }
      return request;
    };
    exports.prepareRequest = prepareRequest;
  }
});

// node_modules/@aws-sdk/signature-v4/dist-cjs/utilDate.js
var require_utilDate = __commonJS({
  "node_modules/@aws-sdk/signature-v4/dist-cjs/utilDate.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.toDate = exports.iso8601 = void 0;
    var iso8601 = (time) => (0, exports.toDate)(time).toISOString().replace(/\.\d{3}Z$/, "Z");
    exports.iso8601 = iso8601;
    var toDate = (time) => {
      if (typeof time === "number") {
        return new Date(time * 1e3);
      }
      if (typeof time === "string") {
        if (Number(time)) {
          return new Date(Number(time) * 1e3);
        }
        return new Date(time);
      }
      return time;
    };
    exports.toDate = toDate;
  }
});

// node_modules/@aws-sdk/signature-v4/dist-cjs/SignatureV4.js
var require_SignatureV4 = __commonJS({
  "node_modules/@aws-sdk/signature-v4/dist-cjs/SignatureV4.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SignatureV4 = void 0;
    var util_hex_encoding_1 = require_dist_cjs15();
    var util_middleware_1 = require_dist_cjs6();
    var constants_1 = require_constants4();
    var credentialDerivation_1 = require_credentialDerivation();
    var getCanonicalHeaders_1 = require_getCanonicalHeaders();
    var getCanonicalQuery_1 = require_getCanonicalQuery();
    var getPayloadHash_1 = require_getPayloadHash();
    var headerUtil_1 = require_headerUtil();
    var moveHeadersToQuery_1 = require_moveHeadersToQuery();
    var prepareRequest_1 = require_prepareRequest();
    var utilDate_1 = require_utilDate();
    var SignatureV4 = class {
      constructor({ applyChecksum, credentials, region, service, sha256, uriEscapePath = true }) {
        this.service = service;
        this.sha256 = sha256;
        this.uriEscapePath = uriEscapePath;
        this.applyChecksum = typeof applyChecksum === "boolean" ? applyChecksum : true;
        this.regionProvider = (0, util_middleware_1.normalizeProvider)(region);
        this.credentialProvider = (0, util_middleware_1.normalizeProvider)(credentials);
      }
      async presign(originalRequest, options = {}) {
        const { signingDate = new Date(), expiresIn = 3600, unsignableHeaders, unhoistableHeaders, signableHeaders, signingRegion, signingService } = options;
        const credentials = await this.credentialProvider();
        const region = signingRegion !== null && signingRegion !== void 0 ? signingRegion : await this.regionProvider();
        const { longDate, shortDate } = formatDate(signingDate);
        if (expiresIn > constants_1.MAX_PRESIGNED_TTL) {
          return Promise.reject("Signature version 4 presigned URLs must have an expiration date less than one week in the future");
        }
        const scope = (0, credentialDerivation_1.createScope)(shortDate, region, signingService !== null && signingService !== void 0 ? signingService : this.service);
        const request = (0, moveHeadersToQuery_1.moveHeadersToQuery)((0, prepareRequest_1.prepareRequest)(originalRequest), { unhoistableHeaders });
        if (credentials.sessionToken) {
          request.query[constants_1.TOKEN_QUERY_PARAM] = credentials.sessionToken;
        }
        request.query[constants_1.ALGORITHM_QUERY_PARAM] = constants_1.ALGORITHM_IDENTIFIER;
        request.query[constants_1.CREDENTIAL_QUERY_PARAM] = `${credentials.accessKeyId}/${scope}`;
        request.query[constants_1.AMZ_DATE_QUERY_PARAM] = longDate;
        request.query[constants_1.EXPIRES_QUERY_PARAM] = expiresIn.toString(10);
        const canonicalHeaders = (0, getCanonicalHeaders_1.getCanonicalHeaders)(request, unsignableHeaders, signableHeaders);
        request.query[constants_1.SIGNED_HEADERS_QUERY_PARAM] = getCanonicalHeaderList(canonicalHeaders);
        request.query[constants_1.SIGNATURE_QUERY_PARAM] = await this.getSignature(longDate, scope, this.getSigningKey(credentials, region, shortDate, signingService), this.createCanonicalRequest(request, canonicalHeaders, await (0, getPayloadHash_1.getPayloadHash)(originalRequest, this.sha256)));
        return request;
      }
      async sign(toSign, options) {
        if (typeof toSign === "string") {
          return this.signString(toSign, options);
        } else if (toSign.headers && toSign.payload) {
          return this.signEvent(toSign, options);
        } else {
          return this.signRequest(toSign, options);
        }
      }
      async signEvent({ headers, payload }, { signingDate = new Date(), priorSignature, signingRegion, signingService }) {
        const region = signingRegion !== null && signingRegion !== void 0 ? signingRegion : await this.regionProvider();
        const { shortDate, longDate } = formatDate(signingDate);
        const scope = (0, credentialDerivation_1.createScope)(shortDate, region, signingService !== null && signingService !== void 0 ? signingService : this.service);
        const hashedPayload = await (0, getPayloadHash_1.getPayloadHash)({ headers: {}, body: payload }, this.sha256);
        const hash = new this.sha256();
        hash.update(headers);
        const hashedHeaders = (0, util_hex_encoding_1.toHex)(await hash.digest());
        const stringToSign = [
          constants_1.EVENT_ALGORITHM_IDENTIFIER,
          longDate,
          scope,
          priorSignature,
          hashedHeaders,
          hashedPayload
        ].join("\n");
        return this.signString(stringToSign, { signingDate, signingRegion: region, signingService });
      }
      async signString(stringToSign, { signingDate = new Date(), signingRegion, signingService } = {}) {
        const credentials = await this.credentialProvider();
        const region = signingRegion !== null && signingRegion !== void 0 ? signingRegion : await this.regionProvider();
        const { shortDate } = formatDate(signingDate);
        const hash = new this.sha256(await this.getSigningKey(credentials, region, shortDate, signingService));
        hash.update(stringToSign);
        return (0, util_hex_encoding_1.toHex)(await hash.digest());
      }
      async signRequest(requestToSign, { signingDate = new Date(), signableHeaders, unsignableHeaders, signingRegion, signingService } = {}) {
        const credentials = await this.credentialProvider();
        const region = signingRegion !== null && signingRegion !== void 0 ? signingRegion : await this.regionProvider();
        const request = (0, prepareRequest_1.prepareRequest)(requestToSign);
        const { longDate, shortDate } = formatDate(signingDate);
        const scope = (0, credentialDerivation_1.createScope)(shortDate, region, signingService !== null && signingService !== void 0 ? signingService : this.service);
        request.headers[constants_1.AMZ_DATE_HEADER] = longDate;
        if (credentials.sessionToken) {
          request.headers[constants_1.TOKEN_HEADER] = credentials.sessionToken;
        }
        const payloadHash = await (0, getPayloadHash_1.getPayloadHash)(request, this.sha256);
        if (!(0, headerUtil_1.hasHeader)(constants_1.SHA256_HEADER, request.headers) && this.applyChecksum) {
          request.headers[constants_1.SHA256_HEADER] = payloadHash;
        }
        const canonicalHeaders = (0, getCanonicalHeaders_1.getCanonicalHeaders)(request, unsignableHeaders, signableHeaders);
        const signature = await this.getSignature(longDate, scope, this.getSigningKey(credentials, region, shortDate, signingService), this.createCanonicalRequest(request, canonicalHeaders, payloadHash));
        request.headers[constants_1.AUTH_HEADER] = `${constants_1.ALGORITHM_IDENTIFIER} Credential=${credentials.accessKeyId}/${scope}, SignedHeaders=${getCanonicalHeaderList(canonicalHeaders)}, Signature=${signature}`;
        return request;
      }
      createCanonicalRequest(request, canonicalHeaders, payloadHash) {
        const sortedHeaders = Object.keys(canonicalHeaders).sort();
        return `${request.method}
${this.getCanonicalPath(request)}
${(0, getCanonicalQuery_1.getCanonicalQuery)(request)}
${sortedHeaders.map((name) => `${name}:${canonicalHeaders[name]}`).join("\n")}

${sortedHeaders.join(";")}
${payloadHash}`;
      }
      async createStringToSign(longDate, credentialScope, canonicalRequest) {
        const hash = new this.sha256();
        hash.update(canonicalRequest);
        const hashedRequest = await hash.digest();
        return `${constants_1.ALGORITHM_IDENTIFIER}
${longDate}
${credentialScope}
${(0, util_hex_encoding_1.toHex)(hashedRequest)}`;
      }
      getCanonicalPath({ path }) {
        if (this.uriEscapePath) {
          const normalizedPathSegments = [];
          for (const pathSegment of path.split("/")) {
            if ((pathSegment === null || pathSegment === void 0 ? void 0 : pathSegment.length) === 0)
              continue;
            if (pathSegment === ".")
              continue;
            if (pathSegment === "..") {
              normalizedPathSegments.pop();
            } else {
              normalizedPathSegments.push(pathSegment);
            }
          }
          const normalizedPath = `${(path === null || path === void 0 ? void 0 : path.startsWith("/")) ? "/" : ""}${normalizedPathSegments.join("/")}${normalizedPathSegments.length > 0 && (path === null || path === void 0 ? void 0 : path.endsWith("/")) ? "/" : ""}`;
          const doubleEncoded = encodeURIComponent(normalizedPath);
          return doubleEncoded.replace(/%2F/g, "/");
        }
        return path;
      }
      async getSignature(longDate, credentialScope, keyPromise, canonicalRequest) {
        const stringToSign = await this.createStringToSign(longDate, credentialScope, canonicalRequest);
        const hash = new this.sha256(await keyPromise);
        hash.update(stringToSign);
        return (0, util_hex_encoding_1.toHex)(await hash.digest());
      }
      getSigningKey(credentials, region, shortDate, service) {
        return (0, credentialDerivation_1.getSigningKey)(this.sha256, credentials, shortDate, region, service || this.service);
      }
    };
    exports.SignatureV4 = SignatureV4;
    var formatDate = (now) => {
      const longDate = (0, utilDate_1.iso8601)(now).replace(/[\-:]/g, "");
      return {
        longDate,
        shortDate: longDate.slice(0, 8)
      };
    };
    var getCanonicalHeaderList = (headers) => Object.keys(headers).sort().join(";");
  }
});

// node_modules/@aws-sdk/signature-v4/dist-cjs/index.js
var require_dist_cjs18 = __commonJS({
  "node_modules/@aws-sdk/signature-v4/dist-cjs/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.prepareRequest = exports.moveHeadersToQuery = exports.getPayloadHash = exports.getCanonicalQuery = exports.getCanonicalHeaders = void 0;
    var tslib_1 = require_tslib();
    tslib_1.__exportStar(require_SignatureV4(), exports);
    var getCanonicalHeaders_1 = require_getCanonicalHeaders();
    Object.defineProperty(exports, "getCanonicalHeaders", { enumerable: true, get: function() {
      return getCanonicalHeaders_1.getCanonicalHeaders;
    } });
    var getCanonicalQuery_1 = require_getCanonicalQuery();
    Object.defineProperty(exports, "getCanonicalQuery", { enumerable: true, get: function() {
      return getCanonicalQuery_1.getCanonicalQuery;
    } });
    var getPayloadHash_1 = require_getPayloadHash();
    Object.defineProperty(exports, "getPayloadHash", { enumerable: true, get: function() {
      return getPayloadHash_1.getPayloadHash;
    } });
    var moveHeadersToQuery_1 = require_moveHeadersToQuery();
    Object.defineProperty(exports, "moveHeadersToQuery", { enumerable: true, get: function() {
      return moveHeadersToQuery_1.moveHeadersToQuery;
    } });
    var prepareRequest_1 = require_prepareRequest();
    Object.defineProperty(exports, "prepareRequest", { enumerable: true, get: function() {
      return prepareRequest_1.prepareRequest;
    } });
    tslib_1.__exportStar(require_credentialDerivation(), exports);
  }
});

// node_modules/@aws-sdk/middleware-signing/dist-cjs/configurations.js
var require_configurations2 = __commonJS({
  "node_modules/@aws-sdk/middleware-signing/dist-cjs/configurations.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.resolveSigV4AuthConfig = exports.resolveAwsAuthConfig = void 0;
    var property_provider_1 = require_dist_cjs14();
    var signature_v4_1 = require_dist_cjs18();
    var CREDENTIAL_EXPIRE_WINDOW = 3e5;
    var resolveAwsAuthConfig = (input) => {
      const normalizedCreds = input.credentials ? normalizeCredentialProvider(input.credentials) : input.credentialDefaultProvider(input);
      const { signingEscapePath = true, systemClockOffset = input.systemClockOffset || 0, sha256 } = input;
      let signer;
      if (input.signer) {
        signer = normalizeProvider(input.signer);
      } else {
        signer = () => normalizeProvider(input.region)().then(async (region) => [
          await input.regionInfoProvider(region, {
            useFipsEndpoint: await input.useFipsEndpoint(),
            useDualstackEndpoint: await input.useDualstackEndpoint()
          }) || {},
          region
        ]).then(([regionInfo, region]) => {
          const { signingRegion, signingService } = regionInfo;
          input.signingRegion = input.signingRegion || signingRegion || region;
          input.signingName = input.signingName || signingService || input.serviceId;
          const params = {
            ...input,
            credentials: normalizedCreds,
            region: input.signingRegion,
            service: input.signingName,
            sha256,
            uriEscapePath: signingEscapePath
          };
          const signerConstructor = input.signerConstructor || signature_v4_1.SignatureV4;
          return new signerConstructor(params);
        });
      }
      return {
        ...input,
        systemClockOffset,
        signingEscapePath,
        credentials: normalizedCreds,
        signer
      };
    };
    exports.resolveAwsAuthConfig = resolveAwsAuthConfig;
    var resolveSigV4AuthConfig = (input) => {
      const normalizedCreds = input.credentials ? normalizeCredentialProvider(input.credentials) : input.credentialDefaultProvider(input);
      const { signingEscapePath = true, systemClockOffset = input.systemClockOffset || 0, sha256 } = input;
      let signer;
      if (input.signer) {
        signer = normalizeProvider(input.signer);
      } else {
        signer = normalizeProvider(new signature_v4_1.SignatureV4({
          credentials: normalizedCreds,
          region: input.region,
          service: input.signingName,
          sha256,
          uriEscapePath: signingEscapePath
        }));
      }
      return {
        ...input,
        systemClockOffset,
        signingEscapePath,
        credentials: normalizedCreds,
        signer
      };
    };
    exports.resolveSigV4AuthConfig = resolveSigV4AuthConfig;
    var normalizeProvider = (input) => {
      if (typeof input === "object") {
        const promisified = Promise.resolve(input);
        return () => promisified;
      }
      return input;
    };
    var normalizeCredentialProvider = (credentials) => {
      if (typeof credentials === "function") {
        return (0, property_provider_1.memoize)(credentials, (credentials2) => credentials2.expiration !== void 0 && credentials2.expiration.getTime() - Date.now() < CREDENTIAL_EXPIRE_WINDOW, (credentials2) => credentials2.expiration !== void 0);
      }
      return normalizeProvider(credentials);
    };
  }
});

// node_modules/@aws-sdk/middleware-signing/dist-cjs/utils/getSkewCorrectedDate.js
var require_getSkewCorrectedDate = __commonJS({
  "node_modules/@aws-sdk/middleware-signing/dist-cjs/utils/getSkewCorrectedDate.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getSkewCorrectedDate = void 0;
    var getSkewCorrectedDate = (systemClockOffset) => new Date(Date.now() + systemClockOffset);
    exports.getSkewCorrectedDate = getSkewCorrectedDate;
  }
});

// node_modules/@aws-sdk/middleware-signing/dist-cjs/utils/isClockSkewed.js
var require_isClockSkewed = __commonJS({
  "node_modules/@aws-sdk/middleware-signing/dist-cjs/utils/isClockSkewed.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isClockSkewed = void 0;
    var getSkewCorrectedDate_1 = require_getSkewCorrectedDate();
    var isClockSkewed = (clockTime, systemClockOffset) => Math.abs((0, getSkewCorrectedDate_1.getSkewCorrectedDate)(systemClockOffset).getTime() - clockTime) >= 3e5;
    exports.isClockSkewed = isClockSkewed;
  }
});

// node_modules/@aws-sdk/middleware-signing/dist-cjs/utils/getUpdatedSystemClockOffset.js
var require_getUpdatedSystemClockOffset = __commonJS({
  "node_modules/@aws-sdk/middleware-signing/dist-cjs/utils/getUpdatedSystemClockOffset.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getUpdatedSystemClockOffset = void 0;
    var isClockSkewed_1 = require_isClockSkewed();
    var getUpdatedSystemClockOffset = (clockTime, currentSystemClockOffset) => {
      const clockTimeInMs = Date.parse(clockTime);
      if ((0, isClockSkewed_1.isClockSkewed)(clockTimeInMs, currentSystemClockOffset)) {
        return clockTimeInMs - Date.now();
      }
      return currentSystemClockOffset;
    };
    exports.getUpdatedSystemClockOffset = getUpdatedSystemClockOffset;
  }
});

// node_modules/@aws-sdk/middleware-signing/dist-cjs/middleware.js
var require_middleware = __commonJS({
  "node_modules/@aws-sdk/middleware-signing/dist-cjs/middleware.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getSigV4AuthPlugin = exports.getAwsAuthPlugin = exports.awsAuthMiddlewareOptions = exports.awsAuthMiddleware = void 0;
    var protocol_http_1 = require_dist_cjs4();
    var getSkewCorrectedDate_1 = require_getSkewCorrectedDate();
    var getUpdatedSystemClockOffset_1 = require_getUpdatedSystemClockOffset();
    var awsAuthMiddleware = (options) => (next, context) => async function(args) {
      if (!protocol_http_1.HttpRequest.isInstance(args.request))
        return next(args);
      const signer = await options.signer();
      const output = await next({
        ...args,
        request: await signer.sign(args.request, {
          signingDate: (0, getSkewCorrectedDate_1.getSkewCorrectedDate)(options.systemClockOffset),
          signingRegion: context["signing_region"],
          signingService: context["signing_service"]
        })
      }).catch((error) => {
        var _a;
        const serverTime = (_a = error.ServerTime) !== null && _a !== void 0 ? _a : getDateHeader(error.$response);
        if (serverTime) {
          options.systemClockOffset = (0, getUpdatedSystemClockOffset_1.getUpdatedSystemClockOffset)(serverTime, options.systemClockOffset);
        }
        throw error;
      });
      const dateHeader = getDateHeader(output.response);
      if (dateHeader) {
        options.systemClockOffset = (0, getUpdatedSystemClockOffset_1.getUpdatedSystemClockOffset)(dateHeader, options.systemClockOffset);
      }
      return output;
    };
    exports.awsAuthMiddleware = awsAuthMiddleware;
    var getDateHeader = (response) => {
      var _a, _b, _c;
      return protocol_http_1.HttpResponse.isInstance(response) ? (_b = (_a = response.headers) === null || _a === void 0 ? void 0 : _a.date) !== null && _b !== void 0 ? _b : (_c = response.headers) === null || _c === void 0 ? void 0 : _c.Date : void 0;
    };
    exports.awsAuthMiddlewareOptions = {
      name: "awsAuthMiddleware",
      tags: ["SIGNATURE", "AWSAUTH"],
      relation: "after",
      toMiddleware: "retryMiddleware",
      override: true
    };
    var getAwsAuthPlugin = (options) => ({
      applyToStack: (clientStack) => {
        clientStack.addRelativeTo((0, exports.awsAuthMiddleware)(options), exports.awsAuthMiddlewareOptions);
      }
    });
    exports.getAwsAuthPlugin = getAwsAuthPlugin;
    exports.getSigV4AuthPlugin = exports.getAwsAuthPlugin;
  }
});

// node_modules/@aws-sdk/middleware-signing/dist-cjs/index.js
var require_dist_cjs19 = __commonJS({
  "node_modules/@aws-sdk/middleware-signing/dist-cjs/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require_tslib();
    tslib_1.__exportStar(require_configurations2(), exports);
    tslib_1.__exportStar(require_middleware(), exports);
  }
});

// node_modules/@aws-sdk/middleware-user-agent/dist-cjs/configurations.js
var require_configurations3 = __commonJS({
  "node_modules/@aws-sdk/middleware-user-agent/dist-cjs/configurations.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.resolveUserAgentConfig = void 0;
    function resolveUserAgentConfig(input) {
      return {
        ...input,
        customUserAgent: typeof input.customUserAgent === "string" ? [[input.customUserAgent]] : input.customUserAgent
      };
    }
    exports.resolveUserAgentConfig = resolveUserAgentConfig;
  }
});

// node_modules/@aws-sdk/middleware-user-agent/dist-cjs/constants.js
var require_constants5 = __commonJS({
  "node_modules/@aws-sdk/middleware-user-agent/dist-cjs/constants.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.UA_ESCAPE_REGEX = exports.SPACE = exports.X_AMZ_USER_AGENT = exports.USER_AGENT = void 0;
    exports.USER_AGENT = "user-agent";
    exports.X_AMZ_USER_AGENT = "x-amz-user-agent";
    exports.SPACE = " ";
    exports.UA_ESCAPE_REGEX = /[^\!\#\$\%\&\'\*\+\-\.\^\_\`\|\~\d\w]/g;
  }
});

// node_modules/@aws-sdk/middleware-user-agent/dist-cjs/user-agent-middleware.js
var require_user_agent_middleware = __commonJS({
  "node_modules/@aws-sdk/middleware-user-agent/dist-cjs/user-agent-middleware.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getUserAgentPlugin = exports.getUserAgentMiddlewareOptions = exports.userAgentMiddleware = void 0;
    var protocol_http_1 = require_dist_cjs4();
    var constants_1 = require_constants5();
    var userAgentMiddleware = (options) => (next, context) => async (args) => {
      var _a, _b;
      const { request } = args;
      if (!protocol_http_1.HttpRequest.isInstance(request))
        return next(args);
      const { headers } = request;
      const userAgent = ((_a = context === null || context === void 0 ? void 0 : context.userAgent) === null || _a === void 0 ? void 0 : _a.map(escapeUserAgent)) || [];
      const defaultUserAgent = (await options.defaultUserAgentProvider()).map(escapeUserAgent);
      const customUserAgent = ((_b = options === null || options === void 0 ? void 0 : options.customUserAgent) === null || _b === void 0 ? void 0 : _b.map(escapeUserAgent)) || [];
      const sdkUserAgentValue = [...defaultUserAgent, ...userAgent, ...customUserAgent].join(constants_1.SPACE);
      const normalUAValue = [
        ...defaultUserAgent.filter((section) => section.startsWith("aws-sdk-")),
        ...customUserAgent
      ].join(constants_1.SPACE);
      if (options.runtime !== "browser") {
        if (normalUAValue) {
          headers[constants_1.X_AMZ_USER_AGENT] = headers[constants_1.X_AMZ_USER_AGENT] ? `${headers[constants_1.USER_AGENT]} ${normalUAValue}` : normalUAValue;
        }
        headers[constants_1.USER_AGENT] = sdkUserAgentValue;
      } else {
        headers[constants_1.X_AMZ_USER_AGENT] = sdkUserAgentValue;
      }
      return next({
        ...args,
        request
      });
    };
    exports.userAgentMiddleware = userAgentMiddleware;
    var escapeUserAgent = ([name, version]) => {
      const prefixSeparatorIndex = name.indexOf("/");
      const prefix = name.substring(0, prefixSeparatorIndex);
      let uaName = name.substring(prefixSeparatorIndex + 1);
      if (prefix === "api") {
        uaName = uaName.toLowerCase();
      }
      return [prefix, uaName, version].filter((item) => item && item.length > 0).map((item) => item === null || item === void 0 ? void 0 : item.replace(constants_1.UA_ESCAPE_REGEX, "_")).join("/");
    };
    exports.getUserAgentMiddlewareOptions = {
      name: "getUserAgentMiddleware",
      step: "build",
      priority: "low",
      tags: ["SET_USER_AGENT", "USER_AGENT"],
      override: true
    };
    var getUserAgentPlugin = (config) => ({
      applyToStack: (clientStack) => {
        clientStack.add((0, exports.userAgentMiddleware)(config), exports.getUserAgentMiddlewareOptions);
      }
    });
    exports.getUserAgentPlugin = getUserAgentPlugin;
  }
});

// node_modules/@aws-sdk/middleware-user-agent/dist-cjs/index.js
var require_dist_cjs20 = __commonJS({
  "node_modules/@aws-sdk/middleware-user-agent/dist-cjs/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require_tslib();
    tslib_1.__exportStar(require_configurations3(), exports);
    tslib_1.__exportStar(require_user_agent_middleware(), exports);
  }
});

// node_modules/@aws-sdk/client-secrets-manager/package.json
var require_package = __commonJS({
  "node_modules/@aws-sdk/client-secrets-manager/package.json"(exports, module2) {
    module2.exports = {
      _from: "@aws-sdk/client-secrets-manager",
      _id: "@aws-sdk/client-secrets-manager@3.105.0",
      _inBundle: false,
      _integrity: "sha512-9lEXFP6MgIoWTo9/Ci1wsB+bUZ86ybeukAOl13GaDRgVczkB7WqXeq0y2SnFII7NO/rUlG32tQScY7Qfq9nLiQ==",
      _location: "/@aws-sdk/client-secrets-manager",
      _phantomChildren: {},
      _requested: {
        type: "tag",
        registry: true,
        raw: "@aws-sdk/client-secrets-manager",
        name: "@aws-sdk/client-secrets-manager",
        escapedName: "@aws-sdk%2fclient-secrets-manager",
        scope: "@aws-sdk",
        rawSpec: "",
        saveSpec: null,
        fetchSpec: "latest"
      },
      _requiredBy: [
        "#USER",
        "/"
      ],
      _resolved: "https://registry.npmjs.org/@aws-sdk/client-secrets-manager/-/client-secrets-manager-3.105.0.tgz",
      _shasum: "167bd1dea3e242e64912d97138d9ee8c5cfc6fcb",
      _spec: "@aws-sdk/client-secrets-manager",
      _where: "/Users/carmenluo/test-cdk",
      author: {
        name: "AWS SDK for JavaScript Team",
        url: "https://aws.amazon.com/javascript/"
      },
      browser: {
        "./dist-es/runtimeConfig": "./dist-es/runtimeConfig.browser"
      },
      bugs: {
        url: "https://github.com/aws/aws-sdk-js-v3/issues"
      },
      bundleDependencies: false,
      dependencies: {
        "@aws-crypto/sha256-browser": "2.0.0",
        "@aws-crypto/sha256-js": "2.0.0",
        "@aws-sdk/client-sts": "3.105.0",
        "@aws-sdk/config-resolver": "3.80.0",
        "@aws-sdk/credential-provider-node": "3.105.0",
        "@aws-sdk/fetch-http-handler": "3.78.0",
        "@aws-sdk/hash-node": "3.78.0",
        "@aws-sdk/invalid-dependency": "3.78.0",
        "@aws-sdk/middleware-content-length": "3.78.0",
        "@aws-sdk/middleware-host-header": "3.78.0",
        "@aws-sdk/middleware-logger": "3.78.0",
        "@aws-sdk/middleware-recursion-detection": "3.105.0",
        "@aws-sdk/middleware-retry": "3.80.0",
        "@aws-sdk/middleware-serde": "3.78.0",
        "@aws-sdk/middleware-signing": "3.78.0",
        "@aws-sdk/middleware-stack": "3.78.0",
        "@aws-sdk/middleware-user-agent": "3.78.0",
        "@aws-sdk/node-config-provider": "3.80.0",
        "@aws-sdk/node-http-handler": "3.94.0",
        "@aws-sdk/protocol-http": "3.78.0",
        "@aws-sdk/smithy-client": "3.99.0",
        "@aws-sdk/types": "3.78.0",
        "@aws-sdk/url-parser": "3.78.0",
        "@aws-sdk/util-base64-browser": "3.58.0",
        "@aws-sdk/util-base64-node": "3.55.0",
        "@aws-sdk/util-body-length-browser": "3.55.0",
        "@aws-sdk/util-body-length-node": "3.55.0",
        "@aws-sdk/util-defaults-mode-browser": "3.99.0",
        "@aws-sdk/util-defaults-mode-node": "3.99.0",
        "@aws-sdk/util-user-agent-browser": "3.78.0",
        "@aws-sdk/util-user-agent-node": "3.80.0",
        "@aws-sdk/util-utf8-browser": "3.55.0",
        "@aws-sdk/util-utf8-node": "3.55.0",
        tslib: "^2.3.1",
        uuid: "^8.3.2"
      },
      deprecated: false,
      description: "AWS SDK for JavaScript Secrets Manager Client for Node.js, Browser and React Native",
      devDependencies: {
        "@aws-sdk/service-client-documentation-generator": "3.58.0",
        "@tsconfig/recommended": "1.0.1",
        "@types/node": "^12.7.5",
        "@types/uuid": "^8.3.0",
        concurrently: "7.0.0",
        "downlevel-dts": "0.7.0",
        rimraf: "3.0.2",
        typedoc: "0.19.2",
        typescript: "~4.6.2"
      },
      engines: {
        node: ">=12.0.0"
      },
      files: [
        "dist-*"
      ],
      homepage: "https://github.com/aws/aws-sdk-js-v3/tree/main/clients/client-secrets-manager",
      license: "Apache-2.0",
      main: "./dist-cjs/index.js",
      module: "./dist-es/index.js",
      name: "@aws-sdk/client-secrets-manager",
      "react-native": {
        "./dist-es/runtimeConfig": "./dist-es/runtimeConfig.native"
      },
      repository: {
        type: "git",
        url: "git+https://github.com/aws/aws-sdk-js-v3.git",
        directory: "clients/client-secrets-manager"
      },
      scripts: {
        build: "concurrently 'yarn:build:cjs' 'yarn:build:es' 'yarn:build:types'",
        "build:cjs": "tsc -p tsconfig.cjs.json",
        "build:docs": "typedoc",
        "build:es": "tsc -p tsconfig.es.json",
        "build:types": "tsc -p tsconfig.types.json",
        "build:types:downlevel": "downlevel-dts dist-types dist-types/ts3.4",
        clean: "rimraf ./dist-* && rimraf *.tsbuildinfo"
      },
      sideEffects: false,
      types: "./dist-types/index.d.ts",
      typesVersions: {
        "<4.0": {
          "dist-types/*": [
            "dist-types/ts3.4/*"
          ]
        }
      },
      version: "3.105.0"
    };
  }
});

// node_modules/@aws-sdk/client-sts/dist-cjs/models/STSServiceException.js
var require_STSServiceException = __commonJS({
  "node_modules/@aws-sdk/client-sts/dist-cjs/models/STSServiceException.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.STSServiceException = void 0;
    var smithy_client_1 = require_dist_cjs3();
    var STSServiceException = class extends smithy_client_1.ServiceException {
      constructor(options) {
        super(options);
        Object.setPrototypeOf(this, STSServiceException.prototype);
      }
    };
    exports.STSServiceException = STSServiceException;
  }
});

// node_modules/@aws-sdk/client-sts/dist-cjs/models/models_0.js
var require_models_02 = __commonJS({
  "node_modules/@aws-sdk/client-sts/dist-cjs/models/models_0.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.GetSessionTokenResponse = exports.GetSessionTokenRequest = exports.GetFederationTokenResponse = exports.FederatedUser = exports.GetFederationTokenRequest = exports.GetCallerIdentityResponse = exports.GetCallerIdentityRequest = exports.GetAccessKeyInfoResponse = exports.GetAccessKeyInfoRequest = exports.InvalidAuthorizationMessageException = exports.DecodeAuthorizationMessageResponse = exports.DecodeAuthorizationMessageRequest = exports.IDPCommunicationErrorException = exports.AssumeRoleWithWebIdentityResponse = exports.AssumeRoleWithWebIdentityRequest = exports.InvalidIdentityTokenException = exports.IDPRejectedClaimException = exports.AssumeRoleWithSAMLResponse = exports.AssumeRoleWithSAMLRequest = exports.RegionDisabledException = exports.PackedPolicyTooLargeException = exports.MalformedPolicyDocumentException = exports.ExpiredTokenException = exports.AssumeRoleResponse = exports.Credentials = exports.AssumeRoleRequest = exports.Tag = exports.PolicyDescriptorType = exports.AssumedRoleUser = void 0;
    var STSServiceException_1 = require_STSServiceException();
    var AssumedRoleUser;
    (function(AssumedRoleUser2) {
      AssumedRoleUser2.filterSensitiveLog = (obj) => ({
        ...obj
      });
    })(AssumedRoleUser = exports.AssumedRoleUser || (exports.AssumedRoleUser = {}));
    var PolicyDescriptorType;
    (function(PolicyDescriptorType2) {
      PolicyDescriptorType2.filterSensitiveLog = (obj) => ({
        ...obj
      });
    })(PolicyDescriptorType = exports.PolicyDescriptorType || (exports.PolicyDescriptorType = {}));
    var Tag;
    (function(Tag2) {
      Tag2.filterSensitiveLog = (obj) => ({
        ...obj
      });
    })(Tag = exports.Tag || (exports.Tag = {}));
    var AssumeRoleRequest;
    (function(AssumeRoleRequest2) {
      AssumeRoleRequest2.filterSensitiveLog = (obj) => ({
        ...obj
      });
    })(AssumeRoleRequest = exports.AssumeRoleRequest || (exports.AssumeRoleRequest = {}));
    var Credentials;
    (function(Credentials2) {
      Credentials2.filterSensitiveLog = (obj) => ({
        ...obj
      });
    })(Credentials = exports.Credentials || (exports.Credentials = {}));
    var AssumeRoleResponse;
    (function(AssumeRoleResponse2) {
      AssumeRoleResponse2.filterSensitiveLog = (obj) => ({
        ...obj
      });
    })(AssumeRoleResponse = exports.AssumeRoleResponse || (exports.AssumeRoleResponse = {}));
    var ExpiredTokenException = class extends STSServiceException_1.STSServiceException {
      constructor(opts) {
        super({
          name: "ExpiredTokenException",
          $fault: "client",
          ...opts
        });
        this.name = "ExpiredTokenException";
        this.$fault = "client";
        Object.setPrototypeOf(this, ExpiredTokenException.prototype);
      }
    };
    exports.ExpiredTokenException = ExpiredTokenException;
    var MalformedPolicyDocumentException = class extends STSServiceException_1.STSServiceException {
      constructor(opts) {
        super({
          name: "MalformedPolicyDocumentException",
          $fault: "client",
          ...opts
        });
        this.name = "MalformedPolicyDocumentException";
        this.$fault = "client";
        Object.setPrototypeOf(this, MalformedPolicyDocumentException.prototype);
      }
    };
    exports.MalformedPolicyDocumentException = MalformedPolicyDocumentException;
    var PackedPolicyTooLargeException = class extends STSServiceException_1.STSServiceException {
      constructor(opts) {
        super({
          name: "PackedPolicyTooLargeException",
          $fault: "client",
          ...opts
        });
        this.name = "PackedPolicyTooLargeException";
        this.$fault = "client";
        Object.setPrototypeOf(this, PackedPolicyTooLargeException.prototype);
      }
    };
    exports.PackedPolicyTooLargeException = PackedPolicyTooLargeException;
    var RegionDisabledException = class extends STSServiceException_1.STSServiceException {
      constructor(opts) {
        super({
          name: "RegionDisabledException",
          $fault: "client",
          ...opts
        });
        this.name = "RegionDisabledException";
        this.$fault = "client";
        Object.setPrototypeOf(this, RegionDisabledException.prototype);
      }
    };
    exports.RegionDisabledException = RegionDisabledException;
    var AssumeRoleWithSAMLRequest;
    (function(AssumeRoleWithSAMLRequest2) {
      AssumeRoleWithSAMLRequest2.filterSensitiveLog = (obj) => ({
        ...obj
      });
    })(AssumeRoleWithSAMLRequest = exports.AssumeRoleWithSAMLRequest || (exports.AssumeRoleWithSAMLRequest = {}));
    var AssumeRoleWithSAMLResponse;
    (function(AssumeRoleWithSAMLResponse2) {
      AssumeRoleWithSAMLResponse2.filterSensitiveLog = (obj) => ({
        ...obj
      });
    })(AssumeRoleWithSAMLResponse = exports.AssumeRoleWithSAMLResponse || (exports.AssumeRoleWithSAMLResponse = {}));
    var IDPRejectedClaimException = class extends STSServiceException_1.STSServiceException {
      constructor(opts) {
        super({
          name: "IDPRejectedClaimException",
          $fault: "client",
          ...opts
        });
        this.name = "IDPRejectedClaimException";
        this.$fault = "client";
        Object.setPrototypeOf(this, IDPRejectedClaimException.prototype);
      }
    };
    exports.IDPRejectedClaimException = IDPRejectedClaimException;
    var InvalidIdentityTokenException = class extends STSServiceException_1.STSServiceException {
      constructor(opts) {
        super({
          name: "InvalidIdentityTokenException",
          $fault: "client",
          ...opts
        });
        this.name = "InvalidIdentityTokenException";
        this.$fault = "client";
        Object.setPrototypeOf(this, InvalidIdentityTokenException.prototype);
      }
    };
    exports.InvalidIdentityTokenException = InvalidIdentityTokenException;
    var AssumeRoleWithWebIdentityRequest;
    (function(AssumeRoleWithWebIdentityRequest2) {
      AssumeRoleWithWebIdentityRequest2.filterSensitiveLog = (obj) => ({
        ...obj
      });
    })(AssumeRoleWithWebIdentityRequest = exports.AssumeRoleWithWebIdentityRequest || (exports.AssumeRoleWithWebIdentityRequest = {}));
    var AssumeRoleWithWebIdentityResponse;
    (function(AssumeRoleWithWebIdentityResponse2) {
      AssumeRoleWithWebIdentityResponse2.filterSensitiveLog = (obj) => ({
        ...obj
      });
    })(AssumeRoleWithWebIdentityResponse = exports.AssumeRoleWithWebIdentityResponse || (exports.AssumeRoleWithWebIdentityResponse = {}));
    var IDPCommunicationErrorException = class extends STSServiceException_1.STSServiceException {
      constructor(opts) {
        super({
          name: "IDPCommunicationErrorException",
          $fault: "client",
          ...opts
        });
        this.name = "IDPCommunicationErrorException";
        this.$fault = "client";
        Object.setPrototypeOf(this, IDPCommunicationErrorException.prototype);
      }
    };
    exports.IDPCommunicationErrorException = IDPCommunicationErrorException;
    var DecodeAuthorizationMessageRequest;
    (function(DecodeAuthorizationMessageRequest2) {
      DecodeAuthorizationMessageRequest2.filterSensitiveLog = (obj) => ({
        ...obj
      });
    })(DecodeAuthorizationMessageRequest = exports.DecodeAuthorizationMessageRequest || (exports.DecodeAuthorizationMessageRequest = {}));
    var DecodeAuthorizationMessageResponse;
    (function(DecodeAuthorizationMessageResponse2) {
      DecodeAuthorizationMessageResponse2.filterSensitiveLog = (obj) => ({
        ...obj
      });
    })(DecodeAuthorizationMessageResponse = exports.DecodeAuthorizationMessageResponse || (exports.DecodeAuthorizationMessageResponse = {}));
    var InvalidAuthorizationMessageException = class extends STSServiceException_1.STSServiceException {
      constructor(opts) {
        super({
          name: "InvalidAuthorizationMessageException",
          $fault: "client",
          ...opts
        });
        this.name = "InvalidAuthorizationMessageException";
        this.$fault = "client";
        Object.setPrototypeOf(this, InvalidAuthorizationMessageException.prototype);
      }
    };
    exports.InvalidAuthorizationMessageException = InvalidAuthorizationMessageException;
    var GetAccessKeyInfoRequest;
    (function(GetAccessKeyInfoRequest2) {
      GetAccessKeyInfoRequest2.filterSensitiveLog = (obj) => ({
        ...obj
      });
    })(GetAccessKeyInfoRequest = exports.GetAccessKeyInfoRequest || (exports.GetAccessKeyInfoRequest = {}));
    var GetAccessKeyInfoResponse;
    (function(GetAccessKeyInfoResponse2) {
      GetAccessKeyInfoResponse2.filterSensitiveLog = (obj) => ({
        ...obj
      });
    })(GetAccessKeyInfoResponse = exports.GetAccessKeyInfoResponse || (exports.GetAccessKeyInfoResponse = {}));
    var GetCallerIdentityRequest;
    (function(GetCallerIdentityRequest2) {
      GetCallerIdentityRequest2.filterSensitiveLog = (obj) => ({
        ...obj
      });
    })(GetCallerIdentityRequest = exports.GetCallerIdentityRequest || (exports.GetCallerIdentityRequest = {}));
    var GetCallerIdentityResponse;
    (function(GetCallerIdentityResponse2) {
      GetCallerIdentityResponse2.filterSensitiveLog = (obj) => ({
        ...obj
      });
    })(GetCallerIdentityResponse = exports.GetCallerIdentityResponse || (exports.GetCallerIdentityResponse = {}));
    var GetFederationTokenRequest;
    (function(GetFederationTokenRequest2) {
      GetFederationTokenRequest2.filterSensitiveLog = (obj) => ({
        ...obj
      });
    })(GetFederationTokenRequest = exports.GetFederationTokenRequest || (exports.GetFederationTokenRequest = {}));
    var FederatedUser;
    (function(FederatedUser2) {
      FederatedUser2.filterSensitiveLog = (obj) => ({
        ...obj
      });
    })(FederatedUser = exports.FederatedUser || (exports.FederatedUser = {}));
    var GetFederationTokenResponse;
    (function(GetFederationTokenResponse2) {
      GetFederationTokenResponse2.filterSensitiveLog = (obj) => ({
        ...obj
      });
    })(GetFederationTokenResponse = exports.GetFederationTokenResponse || (exports.GetFederationTokenResponse = {}));
    var GetSessionTokenRequest;
    (function(GetSessionTokenRequest2) {
      GetSessionTokenRequest2.filterSensitiveLog = (obj) => ({
        ...obj
      });
    })(GetSessionTokenRequest = exports.GetSessionTokenRequest || (exports.GetSessionTokenRequest = {}));
    var GetSessionTokenResponse;
    (function(GetSessionTokenResponse2) {
      GetSessionTokenResponse2.filterSensitiveLog = (obj) => ({
        ...obj
      });
    })(GetSessionTokenResponse = exports.GetSessionTokenResponse || (exports.GetSessionTokenResponse = {}));
  }
});

// node_modules/entities/lib/maps/entities.json
var require_entities = __commonJS({
  "node_modules/entities/lib/maps/entities.json"(exports, module2) {
    module2.exports = { Aacute: "\xC1", aacute: "\xE1", Abreve: "\u0102", abreve: "\u0103", ac: "\u223E", acd: "\u223F", acE: "\u223E\u0333", Acirc: "\xC2", acirc: "\xE2", acute: "\xB4", Acy: "\u0410", acy: "\u0430", AElig: "\xC6", aelig: "\xE6", af: "\u2061", Afr: "\u{1D504}", afr: "\u{1D51E}", Agrave: "\xC0", agrave: "\xE0", alefsym: "\u2135", aleph: "\u2135", Alpha: "\u0391", alpha: "\u03B1", Amacr: "\u0100", amacr: "\u0101", amalg: "\u2A3F", amp: "&", AMP: "&", andand: "\u2A55", And: "\u2A53", and: "\u2227", andd: "\u2A5C", andslope: "\u2A58", andv: "\u2A5A", ang: "\u2220", ange: "\u29A4", angle: "\u2220", angmsdaa: "\u29A8", angmsdab: "\u29A9", angmsdac: "\u29AA", angmsdad: "\u29AB", angmsdae: "\u29AC", angmsdaf: "\u29AD", angmsdag: "\u29AE", angmsdah: "\u29AF", angmsd: "\u2221", angrt: "\u221F", angrtvb: "\u22BE", angrtvbd: "\u299D", angsph: "\u2222", angst: "\xC5", angzarr: "\u237C", Aogon: "\u0104", aogon: "\u0105", Aopf: "\u{1D538}", aopf: "\u{1D552}", apacir: "\u2A6F", ap: "\u2248", apE: "\u2A70", ape: "\u224A", apid: "\u224B", apos: "'", ApplyFunction: "\u2061", approx: "\u2248", approxeq: "\u224A", Aring: "\xC5", aring: "\xE5", Ascr: "\u{1D49C}", ascr: "\u{1D4B6}", Assign: "\u2254", ast: "*", asymp: "\u2248", asympeq: "\u224D", Atilde: "\xC3", atilde: "\xE3", Auml: "\xC4", auml: "\xE4", awconint: "\u2233", awint: "\u2A11", backcong: "\u224C", backepsilon: "\u03F6", backprime: "\u2035", backsim: "\u223D", backsimeq: "\u22CD", Backslash: "\u2216", Barv: "\u2AE7", barvee: "\u22BD", barwed: "\u2305", Barwed: "\u2306", barwedge: "\u2305", bbrk: "\u23B5", bbrktbrk: "\u23B6", bcong: "\u224C", Bcy: "\u0411", bcy: "\u0431", bdquo: "\u201E", becaus: "\u2235", because: "\u2235", Because: "\u2235", bemptyv: "\u29B0", bepsi: "\u03F6", bernou: "\u212C", Bernoullis: "\u212C", Beta: "\u0392", beta: "\u03B2", beth: "\u2136", between: "\u226C", Bfr: "\u{1D505}", bfr: "\u{1D51F}", bigcap: "\u22C2", bigcirc: "\u25EF", bigcup: "\u22C3", bigodot: "\u2A00", bigoplus: "\u2A01", bigotimes: "\u2A02", bigsqcup: "\u2A06", bigstar: "\u2605", bigtriangledown: "\u25BD", bigtriangleup: "\u25B3", biguplus: "\u2A04", bigvee: "\u22C1", bigwedge: "\u22C0", bkarow: "\u290D", blacklozenge: "\u29EB", blacksquare: "\u25AA", blacktriangle: "\u25B4", blacktriangledown: "\u25BE", blacktriangleleft: "\u25C2", blacktriangleright: "\u25B8", blank: "\u2423", blk12: "\u2592", blk14: "\u2591", blk34: "\u2593", block: "\u2588", bne: "=\u20E5", bnequiv: "\u2261\u20E5", bNot: "\u2AED", bnot: "\u2310", Bopf: "\u{1D539}", bopf: "\u{1D553}", bot: "\u22A5", bottom: "\u22A5", bowtie: "\u22C8", boxbox: "\u29C9", boxdl: "\u2510", boxdL: "\u2555", boxDl: "\u2556", boxDL: "\u2557", boxdr: "\u250C", boxdR: "\u2552", boxDr: "\u2553", boxDR: "\u2554", boxh: "\u2500", boxH: "\u2550", boxhd: "\u252C", boxHd: "\u2564", boxhD: "\u2565", boxHD: "\u2566", boxhu: "\u2534", boxHu: "\u2567", boxhU: "\u2568", boxHU: "\u2569", boxminus: "\u229F", boxplus: "\u229E", boxtimes: "\u22A0", boxul: "\u2518", boxuL: "\u255B", boxUl: "\u255C", boxUL: "\u255D", boxur: "\u2514", boxuR: "\u2558", boxUr: "\u2559", boxUR: "\u255A", boxv: "\u2502", boxV: "\u2551", boxvh: "\u253C", boxvH: "\u256A", boxVh: "\u256B", boxVH: "\u256C", boxvl: "\u2524", boxvL: "\u2561", boxVl: "\u2562", boxVL: "\u2563", boxvr: "\u251C", boxvR: "\u255E", boxVr: "\u255F", boxVR: "\u2560", bprime: "\u2035", breve: "\u02D8", Breve: "\u02D8", brvbar: "\xA6", bscr: "\u{1D4B7}", Bscr: "\u212C", bsemi: "\u204F", bsim: "\u223D", bsime: "\u22CD", bsolb: "\u29C5", bsol: "\\", bsolhsub: "\u27C8", bull: "\u2022", bullet: "\u2022", bump: "\u224E", bumpE: "\u2AAE", bumpe: "\u224F", Bumpeq: "\u224E", bumpeq: "\u224F", Cacute: "\u0106", cacute: "\u0107", capand: "\u2A44", capbrcup: "\u2A49", capcap: "\u2A4B", cap: "\u2229", Cap: "\u22D2", capcup: "\u2A47", capdot: "\u2A40", CapitalDifferentialD: "\u2145", caps: "\u2229\uFE00", caret: "\u2041", caron: "\u02C7", Cayleys: "\u212D", ccaps: "\u2A4D", Ccaron: "\u010C", ccaron: "\u010D", Ccedil: "\xC7", ccedil: "\xE7", Ccirc: "\u0108", ccirc: "\u0109", Cconint: "\u2230", ccups: "\u2A4C", ccupssm: "\u2A50", Cdot: "\u010A", cdot: "\u010B", cedil: "\xB8", Cedilla: "\xB8", cemptyv: "\u29B2", cent: "\xA2", centerdot: "\xB7", CenterDot: "\xB7", cfr: "\u{1D520}", Cfr: "\u212D", CHcy: "\u0427", chcy: "\u0447", check: "\u2713", checkmark: "\u2713", Chi: "\u03A7", chi: "\u03C7", circ: "\u02C6", circeq: "\u2257", circlearrowleft: "\u21BA", circlearrowright: "\u21BB", circledast: "\u229B", circledcirc: "\u229A", circleddash: "\u229D", CircleDot: "\u2299", circledR: "\xAE", circledS: "\u24C8", CircleMinus: "\u2296", CirclePlus: "\u2295", CircleTimes: "\u2297", cir: "\u25CB", cirE: "\u29C3", cire: "\u2257", cirfnint: "\u2A10", cirmid: "\u2AEF", cirscir: "\u29C2", ClockwiseContourIntegral: "\u2232", CloseCurlyDoubleQuote: "\u201D", CloseCurlyQuote: "\u2019", clubs: "\u2663", clubsuit: "\u2663", colon: ":", Colon: "\u2237", Colone: "\u2A74", colone: "\u2254", coloneq: "\u2254", comma: ",", commat: "@", comp: "\u2201", compfn: "\u2218", complement: "\u2201", complexes: "\u2102", cong: "\u2245", congdot: "\u2A6D", Congruent: "\u2261", conint: "\u222E", Conint: "\u222F", ContourIntegral: "\u222E", copf: "\u{1D554}", Copf: "\u2102", coprod: "\u2210", Coproduct: "\u2210", copy: "\xA9", COPY: "\xA9", copysr: "\u2117", CounterClockwiseContourIntegral: "\u2233", crarr: "\u21B5", cross: "\u2717", Cross: "\u2A2F", Cscr: "\u{1D49E}", cscr: "\u{1D4B8}", csub: "\u2ACF", csube: "\u2AD1", csup: "\u2AD0", csupe: "\u2AD2", ctdot: "\u22EF", cudarrl: "\u2938", cudarrr: "\u2935", cuepr: "\u22DE", cuesc: "\u22DF", cularr: "\u21B6", cularrp: "\u293D", cupbrcap: "\u2A48", cupcap: "\u2A46", CupCap: "\u224D", cup: "\u222A", Cup: "\u22D3", cupcup: "\u2A4A", cupdot: "\u228D", cupor: "\u2A45", cups: "\u222A\uFE00", curarr: "\u21B7", curarrm: "\u293C", curlyeqprec: "\u22DE", curlyeqsucc: "\u22DF", curlyvee: "\u22CE", curlywedge: "\u22CF", curren: "\xA4", curvearrowleft: "\u21B6", curvearrowright: "\u21B7", cuvee: "\u22CE", cuwed: "\u22CF", cwconint: "\u2232", cwint: "\u2231", cylcty: "\u232D", dagger: "\u2020", Dagger: "\u2021", daleth: "\u2138", darr: "\u2193", Darr: "\u21A1", dArr: "\u21D3", dash: "\u2010", Dashv: "\u2AE4", dashv: "\u22A3", dbkarow: "\u290F", dblac: "\u02DD", Dcaron: "\u010E", dcaron: "\u010F", Dcy: "\u0414", dcy: "\u0434", ddagger: "\u2021", ddarr: "\u21CA", DD: "\u2145", dd: "\u2146", DDotrahd: "\u2911", ddotseq: "\u2A77", deg: "\xB0", Del: "\u2207", Delta: "\u0394", delta: "\u03B4", demptyv: "\u29B1", dfisht: "\u297F", Dfr: "\u{1D507}", dfr: "\u{1D521}", dHar: "\u2965", dharl: "\u21C3", dharr: "\u21C2", DiacriticalAcute: "\xB4", DiacriticalDot: "\u02D9", DiacriticalDoubleAcute: "\u02DD", DiacriticalGrave: "`", DiacriticalTilde: "\u02DC", diam: "\u22C4", diamond: "\u22C4", Diamond: "\u22C4", diamondsuit: "\u2666", diams: "\u2666", die: "\xA8", DifferentialD: "\u2146", digamma: "\u03DD", disin: "\u22F2", div: "\xF7", divide: "\xF7", divideontimes: "\u22C7", divonx: "\u22C7", DJcy: "\u0402", djcy: "\u0452", dlcorn: "\u231E", dlcrop: "\u230D", dollar: "$", Dopf: "\u{1D53B}", dopf: "\u{1D555}", Dot: "\xA8", dot: "\u02D9", DotDot: "\u20DC", doteq: "\u2250", doteqdot: "\u2251", DotEqual: "\u2250", dotminus: "\u2238", dotplus: "\u2214", dotsquare: "\u22A1", doublebarwedge: "\u2306", DoubleContourIntegral: "\u222F", DoubleDot: "\xA8", DoubleDownArrow: "\u21D3", DoubleLeftArrow: "\u21D0", DoubleLeftRightArrow: "\u21D4", DoubleLeftTee: "\u2AE4", DoubleLongLeftArrow: "\u27F8", DoubleLongLeftRightArrow: "\u27FA", DoubleLongRightArrow: "\u27F9", DoubleRightArrow: "\u21D2", DoubleRightTee: "\u22A8", DoubleUpArrow: "\u21D1", DoubleUpDownArrow: "\u21D5", DoubleVerticalBar: "\u2225", DownArrowBar: "\u2913", downarrow: "\u2193", DownArrow: "\u2193", Downarrow: "\u21D3", DownArrowUpArrow: "\u21F5", DownBreve: "\u0311", downdownarrows: "\u21CA", downharpoonleft: "\u21C3", downharpoonright: "\u21C2", DownLeftRightVector: "\u2950", DownLeftTeeVector: "\u295E", DownLeftVectorBar: "\u2956", DownLeftVector: "\u21BD", DownRightTeeVector: "\u295F", DownRightVectorBar: "\u2957", DownRightVector: "\u21C1", DownTeeArrow: "\u21A7", DownTee: "\u22A4", drbkarow: "\u2910", drcorn: "\u231F", drcrop: "\u230C", Dscr: "\u{1D49F}", dscr: "\u{1D4B9}", DScy: "\u0405", dscy: "\u0455", dsol: "\u29F6", Dstrok: "\u0110", dstrok: "\u0111", dtdot: "\u22F1", dtri: "\u25BF", dtrif: "\u25BE", duarr: "\u21F5", duhar: "\u296F", dwangle: "\u29A6", DZcy: "\u040F", dzcy: "\u045F", dzigrarr: "\u27FF", Eacute: "\xC9", eacute: "\xE9", easter: "\u2A6E", Ecaron: "\u011A", ecaron: "\u011B", Ecirc: "\xCA", ecirc: "\xEA", ecir: "\u2256", ecolon: "\u2255", Ecy: "\u042D", ecy: "\u044D", eDDot: "\u2A77", Edot: "\u0116", edot: "\u0117", eDot: "\u2251", ee: "\u2147", efDot: "\u2252", Efr: "\u{1D508}", efr: "\u{1D522}", eg: "\u2A9A", Egrave: "\xC8", egrave: "\xE8", egs: "\u2A96", egsdot: "\u2A98", el: "\u2A99", Element: "\u2208", elinters: "\u23E7", ell: "\u2113", els: "\u2A95", elsdot: "\u2A97", Emacr: "\u0112", emacr: "\u0113", empty: "\u2205", emptyset: "\u2205", EmptySmallSquare: "\u25FB", emptyv: "\u2205", EmptyVerySmallSquare: "\u25AB", emsp13: "\u2004", emsp14: "\u2005", emsp: "\u2003", ENG: "\u014A", eng: "\u014B", ensp: "\u2002", Eogon: "\u0118", eogon: "\u0119", Eopf: "\u{1D53C}", eopf: "\u{1D556}", epar: "\u22D5", eparsl: "\u29E3", eplus: "\u2A71", epsi: "\u03B5", Epsilon: "\u0395", epsilon: "\u03B5", epsiv: "\u03F5", eqcirc: "\u2256", eqcolon: "\u2255", eqsim: "\u2242", eqslantgtr: "\u2A96", eqslantless: "\u2A95", Equal: "\u2A75", equals: "=", EqualTilde: "\u2242", equest: "\u225F", Equilibrium: "\u21CC", equiv: "\u2261", equivDD: "\u2A78", eqvparsl: "\u29E5", erarr: "\u2971", erDot: "\u2253", escr: "\u212F", Escr: "\u2130", esdot: "\u2250", Esim: "\u2A73", esim: "\u2242", Eta: "\u0397", eta: "\u03B7", ETH: "\xD0", eth: "\xF0", Euml: "\xCB", euml: "\xEB", euro: "\u20AC", excl: "!", exist: "\u2203", Exists: "\u2203", expectation: "\u2130", exponentiale: "\u2147", ExponentialE: "\u2147", fallingdotseq: "\u2252", Fcy: "\u0424", fcy: "\u0444", female: "\u2640", ffilig: "\uFB03", fflig: "\uFB00", ffllig: "\uFB04", Ffr: "\u{1D509}", ffr: "\u{1D523}", filig: "\uFB01", FilledSmallSquare: "\u25FC", FilledVerySmallSquare: "\u25AA", fjlig: "fj", flat: "\u266D", fllig: "\uFB02", fltns: "\u25B1", fnof: "\u0192", Fopf: "\u{1D53D}", fopf: "\u{1D557}", forall: "\u2200", ForAll: "\u2200", fork: "\u22D4", forkv: "\u2AD9", Fouriertrf: "\u2131", fpartint: "\u2A0D", frac12: "\xBD", frac13: "\u2153", frac14: "\xBC", frac15: "\u2155", frac16: "\u2159", frac18: "\u215B", frac23: "\u2154", frac25: "\u2156", frac34: "\xBE", frac35: "\u2157", frac38: "\u215C", frac45: "\u2158", frac56: "\u215A", frac58: "\u215D", frac78: "\u215E", frasl: "\u2044", frown: "\u2322", fscr: "\u{1D4BB}", Fscr: "\u2131", gacute: "\u01F5", Gamma: "\u0393", gamma: "\u03B3", Gammad: "\u03DC", gammad: "\u03DD", gap: "\u2A86", Gbreve: "\u011E", gbreve: "\u011F", Gcedil: "\u0122", Gcirc: "\u011C", gcirc: "\u011D", Gcy: "\u0413", gcy: "\u0433", Gdot: "\u0120", gdot: "\u0121", ge: "\u2265", gE: "\u2267", gEl: "\u2A8C", gel: "\u22DB", geq: "\u2265", geqq: "\u2267", geqslant: "\u2A7E", gescc: "\u2AA9", ges: "\u2A7E", gesdot: "\u2A80", gesdoto: "\u2A82", gesdotol: "\u2A84", gesl: "\u22DB\uFE00", gesles: "\u2A94", Gfr: "\u{1D50A}", gfr: "\u{1D524}", gg: "\u226B", Gg: "\u22D9", ggg: "\u22D9", gimel: "\u2137", GJcy: "\u0403", gjcy: "\u0453", gla: "\u2AA5", gl: "\u2277", glE: "\u2A92", glj: "\u2AA4", gnap: "\u2A8A", gnapprox: "\u2A8A", gne: "\u2A88", gnE: "\u2269", gneq: "\u2A88", gneqq: "\u2269", gnsim: "\u22E7", Gopf: "\u{1D53E}", gopf: "\u{1D558}", grave: "`", GreaterEqual: "\u2265", GreaterEqualLess: "\u22DB", GreaterFullEqual: "\u2267", GreaterGreater: "\u2AA2", GreaterLess: "\u2277", GreaterSlantEqual: "\u2A7E", GreaterTilde: "\u2273", Gscr: "\u{1D4A2}", gscr: "\u210A", gsim: "\u2273", gsime: "\u2A8E", gsiml: "\u2A90", gtcc: "\u2AA7", gtcir: "\u2A7A", gt: ">", GT: ">", Gt: "\u226B", gtdot: "\u22D7", gtlPar: "\u2995", gtquest: "\u2A7C", gtrapprox: "\u2A86", gtrarr: "\u2978", gtrdot: "\u22D7", gtreqless: "\u22DB", gtreqqless: "\u2A8C", gtrless: "\u2277", gtrsim: "\u2273", gvertneqq: "\u2269\uFE00", gvnE: "\u2269\uFE00", Hacek: "\u02C7", hairsp: "\u200A", half: "\xBD", hamilt: "\u210B", HARDcy: "\u042A", hardcy: "\u044A", harrcir: "\u2948", harr: "\u2194", hArr: "\u21D4", harrw: "\u21AD", Hat: "^", hbar: "\u210F", Hcirc: "\u0124", hcirc: "\u0125", hearts: "\u2665", heartsuit: "\u2665", hellip: "\u2026", hercon: "\u22B9", hfr: "\u{1D525}", Hfr: "\u210C", HilbertSpace: "\u210B", hksearow: "\u2925", hkswarow: "\u2926", hoarr: "\u21FF", homtht: "\u223B", hookleftarrow: "\u21A9", hookrightarrow: "\u21AA", hopf: "\u{1D559}", Hopf: "\u210D", horbar: "\u2015", HorizontalLine: "\u2500", hscr: "\u{1D4BD}", Hscr: "\u210B", hslash: "\u210F", Hstrok: "\u0126", hstrok: "\u0127", HumpDownHump: "\u224E", HumpEqual: "\u224F", hybull: "\u2043", hyphen: "\u2010", Iacute: "\xCD", iacute: "\xED", ic: "\u2063", Icirc: "\xCE", icirc: "\xEE", Icy: "\u0418", icy: "\u0438", Idot: "\u0130", IEcy: "\u0415", iecy: "\u0435", iexcl: "\xA1", iff: "\u21D4", ifr: "\u{1D526}", Ifr: "\u2111", Igrave: "\xCC", igrave: "\xEC", ii: "\u2148", iiiint: "\u2A0C", iiint: "\u222D", iinfin: "\u29DC", iiota: "\u2129", IJlig: "\u0132", ijlig: "\u0133", Imacr: "\u012A", imacr: "\u012B", image: "\u2111", ImaginaryI: "\u2148", imagline: "\u2110", imagpart: "\u2111", imath: "\u0131", Im: "\u2111", imof: "\u22B7", imped: "\u01B5", Implies: "\u21D2", incare: "\u2105", in: "\u2208", infin: "\u221E", infintie: "\u29DD", inodot: "\u0131", intcal: "\u22BA", int: "\u222B", Int: "\u222C", integers: "\u2124", Integral: "\u222B", intercal: "\u22BA", Intersection: "\u22C2", intlarhk: "\u2A17", intprod: "\u2A3C", InvisibleComma: "\u2063", InvisibleTimes: "\u2062", IOcy: "\u0401", iocy: "\u0451", Iogon: "\u012E", iogon: "\u012F", Iopf: "\u{1D540}", iopf: "\u{1D55A}", Iota: "\u0399", iota: "\u03B9", iprod: "\u2A3C", iquest: "\xBF", iscr: "\u{1D4BE}", Iscr: "\u2110", isin: "\u2208", isindot: "\u22F5", isinE: "\u22F9", isins: "\u22F4", isinsv: "\u22F3", isinv: "\u2208", it: "\u2062", Itilde: "\u0128", itilde: "\u0129", Iukcy: "\u0406", iukcy: "\u0456", Iuml: "\xCF", iuml: "\xEF", Jcirc: "\u0134", jcirc: "\u0135", Jcy: "\u0419", jcy: "\u0439", Jfr: "\u{1D50D}", jfr: "\u{1D527}", jmath: "\u0237", Jopf: "\u{1D541}", jopf: "\u{1D55B}", Jscr: "\u{1D4A5}", jscr: "\u{1D4BF}", Jsercy: "\u0408", jsercy: "\u0458", Jukcy: "\u0404", jukcy: "\u0454", Kappa: "\u039A", kappa: "\u03BA", kappav: "\u03F0", Kcedil: "\u0136", kcedil: "\u0137", Kcy: "\u041A", kcy: "\u043A", Kfr: "\u{1D50E}", kfr: "\u{1D528}", kgreen: "\u0138", KHcy: "\u0425", khcy: "\u0445", KJcy: "\u040C", kjcy: "\u045C", Kopf: "\u{1D542}", kopf: "\u{1D55C}", Kscr: "\u{1D4A6}", kscr: "\u{1D4C0}", lAarr: "\u21DA", Lacute: "\u0139", lacute: "\u013A", laemptyv: "\u29B4", lagran: "\u2112", Lambda: "\u039B", lambda: "\u03BB", lang: "\u27E8", Lang: "\u27EA", langd: "\u2991", langle: "\u27E8", lap: "\u2A85", Laplacetrf: "\u2112", laquo: "\xAB", larrb: "\u21E4", larrbfs: "\u291F", larr: "\u2190", Larr: "\u219E", lArr: "\u21D0", larrfs: "\u291D", larrhk: "\u21A9", larrlp: "\u21AB", larrpl: "\u2939", larrsim: "\u2973", larrtl: "\u21A2", latail: "\u2919", lAtail: "\u291B", lat: "\u2AAB", late: "\u2AAD", lates: "\u2AAD\uFE00", lbarr: "\u290C", lBarr: "\u290E", lbbrk: "\u2772", lbrace: "{", lbrack: "[", lbrke: "\u298B", lbrksld: "\u298F", lbrkslu: "\u298D", Lcaron: "\u013D", lcaron: "\u013E", Lcedil: "\u013B", lcedil: "\u013C", lceil: "\u2308", lcub: "{", Lcy: "\u041B", lcy: "\u043B", ldca: "\u2936", ldquo: "\u201C", ldquor: "\u201E", ldrdhar: "\u2967", ldrushar: "\u294B", ldsh: "\u21B2", le: "\u2264", lE: "\u2266", LeftAngleBracket: "\u27E8", LeftArrowBar: "\u21E4", leftarrow: "\u2190", LeftArrow: "\u2190", Leftarrow: "\u21D0", LeftArrowRightArrow: "\u21C6", leftarrowtail: "\u21A2", LeftCeiling: "\u2308", LeftDoubleBracket: "\u27E6", LeftDownTeeVector: "\u2961", LeftDownVectorBar: "\u2959", LeftDownVector: "\u21C3", LeftFloor: "\u230A", leftharpoondown: "\u21BD", leftharpoonup: "\u21BC", leftleftarrows: "\u21C7", leftrightarrow: "\u2194", LeftRightArrow: "\u2194", Leftrightarrow: "\u21D4", leftrightarrows: "\u21C6", leftrightharpoons: "\u21CB", leftrightsquigarrow: "\u21AD", LeftRightVector: "\u294E", LeftTeeArrow: "\u21A4", LeftTee: "\u22A3", LeftTeeVector: "\u295A", leftthreetimes: "\u22CB", LeftTriangleBar: "\u29CF", LeftTriangle: "\u22B2", LeftTriangleEqual: "\u22B4", LeftUpDownVector: "\u2951", LeftUpTeeVector: "\u2960", LeftUpVectorBar: "\u2958", LeftUpVector: "\u21BF", LeftVectorBar: "\u2952", LeftVector: "\u21BC", lEg: "\u2A8B", leg: "\u22DA", leq: "\u2264", leqq: "\u2266", leqslant: "\u2A7D", lescc: "\u2AA8", les: "\u2A7D", lesdot: "\u2A7F", lesdoto: "\u2A81", lesdotor: "\u2A83", lesg: "\u22DA\uFE00", lesges: "\u2A93", lessapprox: "\u2A85", lessdot: "\u22D6", lesseqgtr: "\u22DA", lesseqqgtr: "\u2A8B", LessEqualGreater: "\u22DA", LessFullEqual: "\u2266", LessGreater: "\u2276", lessgtr: "\u2276", LessLess: "\u2AA1", lesssim: "\u2272", LessSlantEqual: "\u2A7D", LessTilde: "\u2272", lfisht: "\u297C", lfloor: "\u230A", Lfr: "\u{1D50F}", lfr: "\u{1D529}", lg: "\u2276", lgE: "\u2A91", lHar: "\u2962", lhard: "\u21BD", lharu: "\u21BC", lharul: "\u296A", lhblk: "\u2584", LJcy: "\u0409", ljcy: "\u0459", llarr: "\u21C7", ll: "\u226A", Ll: "\u22D8", llcorner: "\u231E", Lleftarrow: "\u21DA", llhard: "\u296B", lltri: "\u25FA", Lmidot: "\u013F", lmidot: "\u0140", lmoustache: "\u23B0", lmoust: "\u23B0", lnap: "\u2A89", lnapprox: "\u2A89", lne: "\u2A87", lnE: "\u2268", lneq: "\u2A87", lneqq: "\u2268", lnsim: "\u22E6", loang: "\u27EC", loarr: "\u21FD", lobrk: "\u27E6", longleftarrow: "\u27F5", LongLeftArrow: "\u27F5", Longleftarrow: "\u27F8", longleftrightarrow: "\u27F7", LongLeftRightArrow: "\u27F7", Longleftrightarrow: "\u27FA", longmapsto: "\u27FC", longrightarrow: "\u27F6", LongRightArrow: "\u27F6", Longrightarrow: "\u27F9", looparrowleft: "\u21AB", looparrowright: "\u21AC", lopar: "\u2985", Lopf: "\u{1D543}", lopf: "\u{1D55D}", loplus: "\u2A2D", lotimes: "\u2A34", lowast: "\u2217", lowbar: "_", LowerLeftArrow: "\u2199", LowerRightArrow: "\u2198", loz: "\u25CA", lozenge: "\u25CA", lozf: "\u29EB", lpar: "(", lparlt: "\u2993", lrarr: "\u21C6", lrcorner: "\u231F", lrhar: "\u21CB", lrhard: "\u296D", lrm: "\u200E", lrtri: "\u22BF", lsaquo: "\u2039", lscr: "\u{1D4C1}", Lscr: "\u2112", lsh: "\u21B0", Lsh: "\u21B0", lsim: "\u2272", lsime: "\u2A8D", lsimg: "\u2A8F", lsqb: "[", lsquo: "\u2018", lsquor: "\u201A", Lstrok: "\u0141", lstrok: "\u0142", ltcc: "\u2AA6", ltcir: "\u2A79", lt: "<", LT: "<", Lt: "\u226A", ltdot: "\u22D6", lthree: "\u22CB", ltimes: "\u22C9", ltlarr: "\u2976", ltquest: "\u2A7B", ltri: "\u25C3", ltrie: "\u22B4", ltrif: "\u25C2", ltrPar: "\u2996", lurdshar: "\u294A", luruhar: "\u2966", lvertneqq: "\u2268\uFE00", lvnE: "\u2268\uFE00", macr: "\xAF", male: "\u2642", malt: "\u2720", maltese: "\u2720", Map: "\u2905", map: "\u21A6", mapsto: "\u21A6", mapstodown: "\u21A7", mapstoleft: "\u21A4", mapstoup: "\u21A5", marker: "\u25AE", mcomma: "\u2A29", Mcy: "\u041C", mcy: "\u043C", mdash: "\u2014", mDDot: "\u223A", measuredangle: "\u2221", MediumSpace: "\u205F", Mellintrf: "\u2133", Mfr: "\u{1D510}", mfr: "\u{1D52A}", mho: "\u2127", micro: "\xB5", midast: "*", midcir: "\u2AF0", mid: "\u2223", middot: "\xB7", minusb: "\u229F", minus: "\u2212", minusd: "\u2238", minusdu: "\u2A2A", MinusPlus: "\u2213", mlcp: "\u2ADB", mldr: "\u2026", mnplus: "\u2213", models: "\u22A7", Mopf: "\u{1D544}", mopf: "\u{1D55E}", mp: "\u2213", mscr: "\u{1D4C2}", Mscr: "\u2133", mstpos: "\u223E", Mu: "\u039C", mu: "\u03BC", multimap: "\u22B8", mumap: "\u22B8", nabla: "\u2207", Nacute: "\u0143", nacute: "\u0144", nang: "\u2220\u20D2", nap: "\u2249", napE: "\u2A70\u0338", napid: "\u224B\u0338", napos: "\u0149", napprox: "\u2249", natural: "\u266E", naturals: "\u2115", natur: "\u266E", nbsp: "\xA0", nbump: "\u224E\u0338", nbumpe: "\u224F\u0338", ncap: "\u2A43", Ncaron: "\u0147", ncaron: "\u0148", Ncedil: "\u0145", ncedil: "\u0146", ncong: "\u2247", ncongdot: "\u2A6D\u0338", ncup: "\u2A42", Ncy: "\u041D", ncy: "\u043D", ndash: "\u2013", nearhk: "\u2924", nearr: "\u2197", neArr: "\u21D7", nearrow: "\u2197", ne: "\u2260", nedot: "\u2250\u0338", NegativeMediumSpace: "\u200B", NegativeThickSpace: "\u200B", NegativeThinSpace: "\u200B", NegativeVeryThinSpace: "\u200B", nequiv: "\u2262", nesear: "\u2928", nesim: "\u2242\u0338", NestedGreaterGreater: "\u226B", NestedLessLess: "\u226A", NewLine: "\n", nexist: "\u2204", nexists: "\u2204", Nfr: "\u{1D511}", nfr: "\u{1D52B}", ngE: "\u2267\u0338", nge: "\u2271", ngeq: "\u2271", ngeqq: "\u2267\u0338", ngeqslant: "\u2A7E\u0338", nges: "\u2A7E\u0338", nGg: "\u22D9\u0338", ngsim: "\u2275", nGt: "\u226B\u20D2", ngt: "\u226F", ngtr: "\u226F", nGtv: "\u226B\u0338", nharr: "\u21AE", nhArr: "\u21CE", nhpar: "\u2AF2", ni: "\u220B", nis: "\u22FC", nisd: "\u22FA", niv: "\u220B", NJcy: "\u040A", njcy: "\u045A", nlarr: "\u219A", nlArr: "\u21CD", nldr: "\u2025", nlE: "\u2266\u0338", nle: "\u2270", nleftarrow: "\u219A", nLeftarrow: "\u21CD", nleftrightarrow: "\u21AE", nLeftrightarrow: "\u21CE", nleq: "\u2270", nleqq: "\u2266\u0338", nleqslant: "\u2A7D\u0338", nles: "\u2A7D\u0338", nless: "\u226E", nLl: "\u22D8\u0338", nlsim: "\u2274", nLt: "\u226A\u20D2", nlt: "\u226E", nltri: "\u22EA", nltrie: "\u22EC", nLtv: "\u226A\u0338", nmid: "\u2224", NoBreak: "\u2060", NonBreakingSpace: "\xA0", nopf: "\u{1D55F}", Nopf: "\u2115", Not: "\u2AEC", not: "\xAC", NotCongruent: "\u2262", NotCupCap: "\u226D", NotDoubleVerticalBar: "\u2226", NotElement: "\u2209", NotEqual: "\u2260", NotEqualTilde: "\u2242\u0338", NotExists: "\u2204", NotGreater: "\u226F", NotGreaterEqual: "\u2271", NotGreaterFullEqual: "\u2267\u0338", NotGreaterGreater: "\u226B\u0338", NotGreaterLess: "\u2279", NotGreaterSlantEqual: "\u2A7E\u0338", NotGreaterTilde: "\u2275", NotHumpDownHump: "\u224E\u0338", NotHumpEqual: "\u224F\u0338", notin: "\u2209", notindot: "\u22F5\u0338", notinE: "\u22F9\u0338", notinva: "\u2209", notinvb: "\u22F7", notinvc: "\u22F6", NotLeftTriangleBar: "\u29CF\u0338", NotLeftTriangle: "\u22EA", NotLeftTriangleEqual: "\u22EC", NotLess: "\u226E", NotLessEqual: "\u2270", NotLessGreater: "\u2278", NotLessLess: "\u226A\u0338", NotLessSlantEqual: "\u2A7D\u0338", NotLessTilde: "\u2274", NotNestedGreaterGreater: "\u2AA2\u0338", NotNestedLessLess: "\u2AA1\u0338", notni: "\u220C", notniva: "\u220C", notnivb: "\u22FE", notnivc: "\u22FD", NotPrecedes: "\u2280", NotPrecedesEqual: "\u2AAF\u0338", NotPrecedesSlantEqual: "\u22E0", NotReverseElement: "\u220C", NotRightTriangleBar: "\u29D0\u0338", NotRightTriangle: "\u22EB", NotRightTriangleEqual: "\u22ED", NotSquareSubset: "\u228F\u0338", NotSquareSubsetEqual: "\u22E2", NotSquareSuperset: "\u2290\u0338", NotSquareSupersetEqual: "\u22E3", NotSubset: "\u2282\u20D2", NotSubsetEqual: "\u2288", NotSucceeds: "\u2281", NotSucceedsEqual: "\u2AB0\u0338", NotSucceedsSlantEqual: "\u22E1", NotSucceedsTilde: "\u227F\u0338", NotSuperset: "\u2283\u20D2", NotSupersetEqual: "\u2289", NotTilde: "\u2241", NotTildeEqual: "\u2244", NotTildeFullEqual: "\u2247", NotTildeTilde: "\u2249", NotVerticalBar: "\u2224", nparallel: "\u2226", npar: "\u2226", nparsl: "\u2AFD\u20E5", npart: "\u2202\u0338", npolint: "\u2A14", npr: "\u2280", nprcue: "\u22E0", nprec: "\u2280", npreceq: "\u2AAF\u0338", npre: "\u2AAF\u0338", nrarrc: "\u2933\u0338", nrarr: "\u219B", nrArr: "\u21CF", nrarrw: "\u219D\u0338", nrightarrow: "\u219B", nRightarrow: "\u21CF", nrtri: "\u22EB", nrtrie: "\u22ED", nsc: "\u2281", nsccue: "\u22E1", nsce: "\u2AB0\u0338", Nscr: "\u{1D4A9}", nscr: "\u{1D4C3}", nshortmid: "\u2224", nshortparallel: "\u2226", nsim: "\u2241", nsime: "\u2244", nsimeq: "\u2244", nsmid: "\u2224", nspar: "\u2226", nsqsube: "\u22E2", nsqsupe: "\u22E3", nsub: "\u2284", nsubE: "\u2AC5\u0338", nsube: "\u2288", nsubset: "\u2282\u20D2", nsubseteq: "\u2288", nsubseteqq: "\u2AC5\u0338", nsucc: "\u2281", nsucceq: "\u2AB0\u0338", nsup: "\u2285", nsupE: "\u2AC6\u0338", nsupe: "\u2289", nsupset: "\u2283\u20D2", nsupseteq: "\u2289", nsupseteqq: "\u2AC6\u0338", ntgl: "\u2279", Ntilde: "\xD1", ntilde: "\xF1", ntlg: "\u2278", ntriangleleft: "\u22EA", ntrianglelefteq: "\u22EC", ntriangleright: "\u22EB", ntrianglerighteq: "\u22ED", Nu: "\u039D", nu: "\u03BD", num: "#", numero: "\u2116", numsp: "\u2007", nvap: "\u224D\u20D2", nvdash: "\u22AC", nvDash: "\u22AD", nVdash: "\u22AE", nVDash: "\u22AF", nvge: "\u2265\u20D2", nvgt: ">\u20D2", nvHarr: "\u2904", nvinfin: "\u29DE", nvlArr: "\u2902", nvle: "\u2264\u20D2", nvlt: "<\u20D2", nvltrie: "\u22B4\u20D2", nvrArr: "\u2903", nvrtrie: "\u22B5\u20D2", nvsim: "\u223C\u20D2", nwarhk: "\u2923", nwarr: "\u2196", nwArr: "\u21D6", nwarrow: "\u2196", nwnear: "\u2927", Oacute: "\xD3", oacute: "\xF3", oast: "\u229B", Ocirc: "\xD4", ocirc: "\xF4", ocir: "\u229A", Ocy: "\u041E", ocy: "\u043E", odash: "\u229D", Odblac: "\u0150", odblac: "\u0151", odiv: "\u2A38", odot: "\u2299", odsold: "\u29BC", OElig: "\u0152", oelig: "\u0153", ofcir: "\u29BF", Ofr: "\u{1D512}", ofr: "\u{1D52C}", ogon: "\u02DB", Ograve: "\xD2", ograve: "\xF2", ogt: "\u29C1", ohbar: "\u29B5", ohm: "\u03A9", oint: "\u222E", olarr: "\u21BA", olcir: "\u29BE", olcross: "\u29BB", oline: "\u203E", olt: "\u29C0", Omacr: "\u014C", omacr: "\u014D", Omega: "\u03A9", omega: "\u03C9", Omicron: "\u039F", omicron: "\u03BF", omid: "\u29B6", ominus: "\u2296", Oopf: "\u{1D546}", oopf: "\u{1D560}", opar: "\u29B7", OpenCurlyDoubleQuote: "\u201C", OpenCurlyQuote: "\u2018", operp: "\u29B9", oplus: "\u2295", orarr: "\u21BB", Or: "\u2A54", or: "\u2228", ord: "\u2A5D", order: "\u2134", orderof: "\u2134", ordf: "\xAA", ordm: "\xBA", origof: "\u22B6", oror: "\u2A56", orslope: "\u2A57", orv: "\u2A5B", oS: "\u24C8", Oscr: "\u{1D4AA}", oscr: "\u2134", Oslash: "\xD8", oslash: "\xF8", osol: "\u2298", Otilde: "\xD5", otilde: "\xF5", otimesas: "\u2A36", Otimes: "\u2A37", otimes: "\u2297", Ouml: "\xD6", ouml: "\xF6", ovbar: "\u233D", OverBar: "\u203E", OverBrace: "\u23DE", OverBracket: "\u23B4", OverParenthesis: "\u23DC", para: "\xB6", parallel: "\u2225", par: "\u2225", parsim: "\u2AF3", parsl: "\u2AFD", part: "\u2202", PartialD: "\u2202", Pcy: "\u041F", pcy: "\u043F", percnt: "%", period: ".", permil: "\u2030", perp: "\u22A5", pertenk: "\u2031", Pfr: "\u{1D513}", pfr: "\u{1D52D}", Phi: "\u03A6", phi: "\u03C6", phiv: "\u03D5", phmmat: "\u2133", phone: "\u260E", Pi: "\u03A0", pi: "\u03C0", pitchfork: "\u22D4", piv: "\u03D6", planck: "\u210F", planckh: "\u210E", plankv: "\u210F", plusacir: "\u2A23", plusb: "\u229E", pluscir: "\u2A22", plus: "+", plusdo: "\u2214", plusdu: "\u2A25", pluse: "\u2A72", PlusMinus: "\xB1", plusmn: "\xB1", plussim: "\u2A26", plustwo: "\u2A27", pm: "\xB1", Poincareplane: "\u210C", pointint: "\u2A15", popf: "\u{1D561}", Popf: "\u2119", pound: "\xA3", prap: "\u2AB7", Pr: "\u2ABB", pr: "\u227A", prcue: "\u227C", precapprox: "\u2AB7", prec: "\u227A", preccurlyeq: "\u227C", Precedes: "\u227A", PrecedesEqual: "\u2AAF", PrecedesSlantEqual: "\u227C", PrecedesTilde: "\u227E", preceq: "\u2AAF", precnapprox: "\u2AB9", precneqq: "\u2AB5", precnsim: "\u22E8", pre: "\u2AAF", prE: "\u2AB3", precsim: "\u227E", prime: "\u2032", Prime: "\u2033", primes: "\u2119", prnap: "\u2AB9", prnE: "\u2AB5", prnsim: "\u22E8", prod: "\u220F", Product: "\u220F", profalar: "\u232E", profline: "\u2312", profsurf: "\u2313", prop: "\u221D", Proportional: "\u221D", Proportion: "\u2237", propto: "\u221D", prsim: "\u227E", prurel: "\u22B0", Pscr: "\u{1D4AB}", pscr: "\u{1D4C5}", Psi: "\u03A8", psi: "\u03C8", puncsp: "\u2008", Qfr: "\u{1D514}", qfr: "\u{1D52E}", qint: "\u2A0C", qopf: "\u{1D562}", Qopf: "\u211A", qprime: "\u2057", Qscr: "\u{1D4AC}", qscr: "\u{1D4C6}", quaternions: "\u210D", quatint: "\u2A16", quest: "?", questeq: "\u225F", quot: '"', QUOT: '"', rAarr: "\u21DB", race: "\u223D\u0331", Racute: "\u0154", racute: "\u0155", radic: "\u221A", raemptyv: "\u29B3", rang: "\u27E9", Rang: "\u27EB", rangd: "\u2992", range: "\u29A5", rangle: "\u27E9", raquo: "\xBB", rarrap: "\u2975", rarrb: "\u21E5", rarrbfs: "\u2920", rarrc: "\u2933", rarr: "\u2192", Rarr: "\u21A0", rArr: "\u21D2", rarrfs: "\u291E", rarrhk: "\u21AA", rarrlp: "\u21AC", rarrpl: "\u2945", rarrsim: "\u2974", Rarrtl: "\u2916", rarrtl: "\u21A3", rarrw: "\u219D", ratail: "\u291A", rAtail: "\u291C", ratio: "\u2236", rationals: "\u211A", rbarr: "\u290D", rBarr: "\u290F", RBarr: "\u2910", rbbrk: "\u2773", rbrace: "}", rbrack: "]", rbrke: "\u298C", rbrksld: "\u298E", rbrkslu: "\u2990", Rcaron: "\u0158", rcaron: "\u0159", Rcedil: "\u0156", rcedil: "\u0157", rceil: "\u2309", rcub: "}", Rcy: "\u0420", rcy: "\u0440", rdca: "\u2937", rdldhar: "\u2969", rdquo: "\u201D", rdquor: "\u201D", rdsh: "\u21B3", real: "\u211C", realine: "\u211B", realpart: "\u211C", reals: "\u211D", Re: "\u211C", rect: "\u25AD", reg: "\xAE", REG: "\xAE", ReverseElement: "\u220B", ReverseEquilibrium: "\u21CB", ReverseUpEquilibrium: "\u296F", rfisht: "\u297D", rfloor: "\u230B", rfr: "\u{1D52F}", Rfr: "\u211C", rHar: "\u2964", rhard: "\u21C1", rharu: "\u21C0", rharul: "\u296C", Rho: "\u03A1", rho: "\u03C1", rhov: "\u03F1", RightAngleBracket: "\u27E9", RightArrowBar: "\u21E5", rightarrow: "\u2192", RightArrow: "\u2192", Rightarrow: "\u21D2", RightArrowLeftArrow: "\u21C4", rightarrowtail: "\u21A3", RightCeiling: "\u2309", RightDoubleBracket: "\u27E7", RightDownTeeVector: "\u295D", RightDownVectorBar: "\u2955", RightDownVector: "\u21C2", RightFloor: "\u230B", rightharpoondown: "\u21C1", rightharpoonup: "\u21C0", rightleftarrows: "\u21C4", rightleftharpoons: "\u21CC", rightrightarrows: "\u21C9", rightsquigarrow: "\u219D", RightTeeArrow: "\u21A6", RightTee: "\u22A2", RightTeeVector: "\u295B", rightthreetimes: "\u22CC", RightTriangleBar: "\u29D0", RightTriangle: "\u22B3", RightTriangleEqual: "\u22B5", RightUpDownVector: "\u294F", RightUpTeeVector: "\u295C", RightUpVectorBar: "\u2954", RightUpVector: "\u21BE", RightVectorBar: "\u2953", RightVector: "\u21C0", ring: "\u02DA", risingdotseq: "\u2253", rlarr: "\u21C4", rlhar: "\u21CC", rlm: "\u200F", rmoustache: "\u23B1", rmoust: "\u23B1", rnmid: "\u2AEE", roang: "\u27ED", roarr: "\u21FE", robrk: "\u27E7", ropar: "\u2986", ropf: "\u{1D563}", Ropf: "\u211D", roplus: "\u2A2E", rotimes: "\u2A35", RoundImplies: "\u2970", rpar: ")", rpargt: "\u2994", rppolint: "\u2A12", rrarr: "\u21C9", Rrightarrow: "\u21DB", rsaquo: "\u203A", rscr: "\u{1D4C7}", Rscr: "\u211B", rsh: "\u21B1", Rsh: "\u21B1", rsqb: "]", rsquo: "\u2019", rsquor: "\u2019", rthree: "\u22CC", rtimes: "\u22CA", rtri: "\u25B9", rtrie: "\u22B5", rtrif: "\u25B8", rtriltri: "\u29CE", RuleDelayed: "\u29F4", ruluhar: "\u2968", rx: "\u211E", Sacute: "\u015A", sacute: "\u015B", sbquo: "\u201A", scap: "\u2AB8", Scaron: "\u0160", scaron: "\u0161", Sc: "\u2ABC", sc: "\u227B", sccue: "\u227D", sce: "\u2AB0", scE: "\u2AB4", Scedil: "\u015E", scedil: "\u015F", Scirc: "\u015C", scirc: "\u015D", scnap: "\u2ABA", scnE: "\u2AB6", scnsim: "\u22E9", scpolint: "\u2A13", scsim: "\u227F", Scy: "\u0421", scy: "\u0441", sdotb: "\u22A1", sdot: "\u22C5", sdote: "\u2A66", searhk: "\u2925", searr: "\u2198", seArr: "\u21D8", searrow: "\u2198", sect: "\xA7", semi: ";", seswar: "\u2929", setminus: "\u2216", setmn: "\u2216", sext: "\u2736", Sfr: "\u{1D516}", sfr: "\u{1D530}", sfrown: "\u2322", sharp: "\u266F", SHCHcy: "\u0429", shchcy: "\u0449", SHcy: "\u0428", shcy: "\u0448", ShortDownArrow: "\u2193", ShortLeftArrow: "\u2190", shortmid: "\u2223", shortparallel: "\u2225", ShortRightArrow: "\u2192", ShortUpArrow: "\u2191", shy: "\xAD", Sigma: "\u03A3", sigma: "\u03C3", sigmaf: "\u03C2", sigmav: "\u03C2", sim: "\u223C", simdot: "\u2A6A", sime: "\u2243", simeq: "\u2243", simg: "\u2A9E", simgE: "\u2AA0", siml: "\u2A9D", simlE: "\u2A9F", simne: "\u2246", simplus: "\u2A24", simrarr: "\u2972", slarr: "\u2190", SmallCircle: "\u2218", smallsetminus: "\u2216", smashp: "\u2A33", smeparsl: "\u29E4", smid: "\u2223", smile: "\u2323", smt: "\u2AAA", smte: "\u2AAC", smtes: "\u2AAC\uFE00", SOFTcy: "\u042C", softcy: "\u044C", solbar: "\u233F", solb: "\u29C4", sol: "/", Sopf: "\u{1D54A}", sopf: "\u{1D564}", spades: "\u2660", spadesuit: "\u2660", spar: "\u2225", sqcap: "\u2293", sqcaps: "\u2293\uFE00", sqcup: "\u2294", sqcups: "\u2294\uFE00", Sqrt: "\u221A", sqsub: "\u228F", sqsube: "\u2291", sqsubset: "\u228F", sqsubseteq: "\u2291", sqsup: "\u2290", sqsupe: "\u2292", sqsupset: "\u2290", sqsupseteq: "\u2292", square: "\u25A1", Square: "\u25A1", SquareIntersection: "\u2293", SquareSubset: "\u228F", SquareSubsetEqual: "\u2291", SquareSuperset: "\u2290", SquareSupersetEqual: "\u2292", SquareUnion: "\u2294", squarf: "\u25AA", squ: "\u25A1", squf: "\u25AA", srarr: "\u2192", Sscr: "\u{1D4AE}", sscr: "\u{1D4C8}", ssetmn: "\u2216", ssmile: "\u2323", sstarf: "\u22C6", Star: "\u22C6", star: "\u2606", starf: "\u2605", straightepsilon: "\u03F5", straightphi: "\u03D5", strns: "\xAF", sub: "\u2282", Sub: "\u22D0", subdot: "\u2ABD", subE: "\u2AC5", sube: "\u2286", subedot: "\u2AC3", submult: "\u2AC1", subnE: "\u2ACB", subne: "\u228A", subplus: "\u2ABF", subrarr: "\u2979", subset: "\u2282", Subset: "\u22D0", subseteq: "\u2286", subseteqq: "\u2AC5", SubsetEqual: "\u2286", subsetneq: "\u228A", subsetneqq: "\u2ACB", subsim: "\u2AC7", subsub: "\u2AD5", subsup: "\u2AD3", succapprox: "\u2AB8", succ: "\u227B", succcurlyeq: "\u227D", Succeeds: "\u227B", SucceedsEqual: "\u2AB0", SucceedsSlantEqual: "\u227D", SucceedsTilde: "\u227F", succeq: "\u2AB0", succnapprox: "\u2ABA", succneqq: "\u2AB6", succnsim: "\u22E9", succsim: "\u227F", SuchThat: "\u220B", sum: "\u2211", Sum: "\u2211", sung: "\u266A", sup1: "\xB9", sup2: "\xB2", sup3: "\xB3", sup: "\u2283", Sup: "\u22D1", supdot: "\u2ABE", supdsub: "\u2AD8", supE: "\u2AC6", supe: "\u2287", supedot: "\u2AC4", Superset: "\u2283", SupersetEqual: "\u2287", suphsol: "\u27C9", suphsub: "\u2AD7", suplarr: "\u297B", supmult: "\u2AC2", supnE: "\u2ACC", supne: "\u228B", supplus: "\u2AC0", supset: "\u2283", Supset: "\u22D1", supseteq: "\u2287", supseteqq: "\u2AC6", supsetneq: "\u228B", supsetneqq: "\u2ACC", supsim: "\u2AC8", supsub: "\u2AD4", supsup: "\u2AD6", swarhk: "\u2926", swarr: "\u2199", swArr: "\u21D9", swarrow: "\u2199", swnwar: "\u292A", szlig: "\xDF", Tab: "	", target: "\u2316", Tau: "\u03A4", tau: "\u03C4", tbrk: "\u23B4", Tcaron: "\u0164", tcaron: "\u0165", Tcedil: "\u0162", tcedil: "\u0163", Tcy: "\u0422", tcy: "\u0442", tdot: "\u20DB", telrec: "\u2315", Tfr: "\u{1D517}", tfr: "\u{1D531}", there4: "\u2234", therefore: "\u2234", Therefore: "\u2234", Theta: "\u0398", theta: "\u03B8", thetasym: "\u03D1", thetav: "\u03D1", thickapprox: "\u2248", thicksim: "\u223C", ThickSpace: "\u205F\u200A", ThinSpace: "\u2009", thinsp: "\u2009", thkap: "\u2248", thksim: "\u223C", THORN: "\xDE", thorn: "\xFE", tilde: "\u02DC", Tilde: "\u223C", TildeEqual: "\u2243", TildeFullEqual: "\u2245", TildeTilde: "\u2248", timesbar: "\u2A31", timesb: "\u22A0", times: "\xD7", timesd: "\u2A30", tint: "\u222D", toea: "\u2928", topbot: "\u2336", topcir: "\u2AF1", top: "\u22A4", Topf: "\u{1D54B}", topf: "\u{1D565}", topfork: "\u2ADA", tosa: "\u2929", tprime: "\u2034", trade: "\u2122", TRADE: "\u2122", triangle: "\u25B5", triangledown: "\u25BF", triangleleft: "\u25C3", trianglelefteq: "\u22B4", triangleq: "\u225C", triangleright: "\u25B9", trianglerighteq: "\u22B5", tridot: "\u25EC", trie: "\u225C", triminus: "\u2A3A", TripleDot: "\u20DB", triplus: "\u2A39", trisb: "\u29CD", tritime: "\u2A3B", trpezium: "\u23E2", Tscr: "\u{1D4AF}", tscr: "\u{1D4C9}", TScy: "\u0426", tscy: "\u0446", TSHcy: "\u040B", tshcy: "\u045B", Tstrok: "\u0166", tstrok: "\u0167", twixt: "\u226C", twoheadleftarrow: "\u219E", twoheadrightarrow: "\u21A0", Uacute: "\xDA", uacute: "\xFA", uarr: "\u2191", Uarr: "\u219F", uArr: "\u21D1", Uarrocir: "\u2949", Ubrcy: "\u040E", ubrcy: "\u045E", Ubreve: "\u016C", ubreve: "\u016D", Ucirc: "\xDB", ucirc: "\xFB", Ucy: "\u0423", ucy: "\u0443", udarr: "\u21C5", Udblac: "\u0170", udblac: "\u0171", udhar: "\u296E", ufisht: "\u297E", Ufr: "\u{1D518}", ufr: "\u{1D532}", Ugrave: "\xD9", ugrave: "\xF9", uHar: "\u2963", uharl: "\u21BF", uharr: "\u21BE", uhblk: "\u2580", ulcorn: "\u231C", ulcorner: "\u231C", ulcrop: "\u230F", ultri: "\u25F8", Umacr: "\u016A", umacr: "\u016B", uml: "\xA8", UnderBar: "_", UnderBrace: "\u23DF", UnderBracket: "\u23B5", UnderParenthesis: "\u23DD", Union: "\u22C3", UnionPlus: "\u228E", Uogon: "\u0172", uogon: "\u0173", Uopf: "\u{1D54C}", uopf: "\u{1D566}", UpArrowBar: "\u2912", uparrow: "\u2191", UpArrow: "\u2191", Uparrow: "\u21D1", UpArrowDownArrow: "\u21C5", updownarrow: "\u2195", UpDownArrow: "\u2195", Updownarrow: "\u21D5", UpEquilibrium: "\u296E", upharpoonleft: "\u21BF", upharpoonright: "\u21BE", uplus: "\u228E", UpperLeftArrow: "\u2196", UpperRightArrow: "\u2197", upsi: "\u03C5", Upsi: "\u03D2", upsih: "\u03D2", Upsilon: "\u03A5", upsilon: "\u03C5", UpTeeArrow: "\u21A5", UpTee: "\u22A5", upuparrows: "\u21C8", urcorn: "\u231D", urcorner: "\u231D", urcrop: "\u230E", Uring: "\u016E", uring: "\u016F", urtri: "\u25F9", Uscr: "\u{1D4B0}", uscr: "\u{1D4CA}", utdot: "\u22F0", Utilde: "\u0168", utilde: "\u0169", utri: "\u25B5", utrif: "\u25B4", uuarr: "\u21C8", Uuml: "\xDC", uuml: "\xFC", uwangle: "\u29A7", vangrt: "\u299C", varepsilon: "\u03F5", varkappa: "\u03F0", varnothing: "\u2205", varphi: "\u03D5", varpi: "\u03D6", varpropto: "\u221D", varr: "\u2195", vArr: "\u21D5", varrho: "\u03F1", varsigma: "\u03C2", varsubsetneq: "\u228A\uFE00", varsubsetneqq: "\u2ACB\uFE00", varsupsetneq: "\u228B\uFE00", varsupsetneqq: "\u2ACC\uFE00", vartheta: "\u03D1", vartriangleleft: "\u22B2", vartriangleright: "\u22B3", vBar: "\u2AE8", Vbar: "\u2AEB", vBarv: "\u2AE9", Vcy: "\u0412", vcy: "\u0432", vdash: "\u22A2", vDash: "\u22A8", Vdash: "\u22A9", VDash: "\u22AB", Vdashl: "\u2AE6", veebar: "\u22BB", vee: "\u2228", Vee: "\u22C1", veeeq: "\u225A", vellip: "\u22EE", verbar: "|", Verbar: "\u2016", vert: "|", Vert: "\u2016", VerticalBar: "\u2223", VerticalLine: "|", VerticalSeparator: "\u2758", VerticalTilde: "\u2240", VeryThinSpace: "\u200A", Vfr: "\u{1D519}", vfr: "\u{1D533}", vltri: "\u22B2", vnsub: "\u2282\u20D2", vnsup: "\u2283\u20D2", Vopf: "\u{1D54D}", vopf: "\u{1D567}", vprop: "\u221D", vrtri: "\u22B3", Vscr: "\u{1D4B1}", vscr: "\u{1D4CB}", vsubnE: "\u2ACB\uFE00", vsubne: "\u228A\uFE00", vsupnE: "\u2ACC\uFE00", vsupne: "\u228B\uFE00", Vvdash: "\u22AA", vzigzag: "\u299A", Wcirc: "\u0174", wcirc: "\u0175", wedbar: "\u2A5F", wedge: "\u2227", Wedge: "\u22C0", wedgeq: "\u2259", weierp: "\u2118", Wfr: "\u{1D51A}", wfr: "\u{1D534}", Wopf: "\u{1D54E}", wopf: "\u{1D568}", wp: "\u2118", wr: "\u2240", wreath: "\u2240", Wscr: "\u{1D4B2}", wscr: "\u{1D4CC}", xcap: "\u22C2", xcirc: "\u25EF", xcup: "\u22C3", xdtri: "\u25BD", Xfr: "\u{1D51B}", xfr: "\u{1D535}", xharr: "\u27F7", xhArr: "\u27FA", Xi: "\u039E", xi: "\u03BE", xlarr: "\u27F5", xlArr: "\u27F8", xmap: "\u27FC", xnis: "\u22FB", xodot: "\u2A00", Xopf: "\u{1D54F}", xopf: "\u{1D569}", xoplus: "\u2A01", xotime: "\u2A02", xrarr: "\u27F6", xrArr: "\u27F9", Xscr: "\u{1D4B3}", xscr: "\u{1D4CD}", xsqcup: "\u2A06", xuplus: "\u2A04", xutri: "\u25B3", xvee: "\u22C1", xwedge: "\u22C0", Yacute: "\xDD", yacute: "\xFD", YAcy: "\u042F", yacy: "\u044F", Ycirc: "\u0176", ycirc: "\u0177", Ycy: "\u042B", ycy: "\u044B", yen: "\xA5", Yfr: "\u{1D51C}", yfr: "\u{1D536}", YIcy: "\u0407", yicy: "\u0457", Yopf: "\u{1D550}", yopf: "\u{1D56A}", Yscr: "\u{1D4B4}", yscr: "\u{1D4CE}", YUcy: "\u042E", yucy: "\u044E", yuml: "\xFF", Yuml: "\u0178", Zacute: "\u0179", zacute: "\u017A", Zcaron: "\u017D", zcaron: "\u017E", Zcy: "\u0417", zcy: "\u0437", Zdot: "\u017B", zdot: "\u017C", zeetrf: "\u2128", ZeroWidthSpace: "\u200B", Zeta: "\u0396", zeta: "\u03B6", zfr: "\u{1D537}", Zfr: "\u2128", ZHcy: "\u0416", zhcy: "\u0436", zigrarr: "\u21DD", zopf: "\u{1D56B}", Zopf: "\u2124", Zscr: "\u{1D4B5}", zscr: "\u{1D4CF}", zwj: "\u200D", zwnj: "\u200C" };
  }
});

// node_modules/entities/lib/maps/legacy.json
var require_legacy = __commonJS({
  "node_modules/entities/lib/maps/legacy.json"(exports, module2) {
    module2.exports = { Aacute: "\xC1", aacute: "\xE1", Acirc: "\xC2", acirc: "\xE2", acute: "\xB4", AElig: "\xC6", aelig: "\xE6", Agrave: "\xC0", agrave: "\xE0", amp: "&", AMP: "&", Aring: "\xC5", aring: "\xE5", Atilde: "\xC3", atilde: "\xE3", Auml: "\xC4", auml: "\xE4", brvbar: "\xA6", Ccedil: "\xC7", ccedil: "\xE7", cedil: "\xB8", cent: "\xA2", copy: "\xA9", COPY: "\xA9", curren: "\xA4", deg: "\xB0", divide: "\xF7", Eacute: "\xC9", eacute: "\xE9", Ecirc: "\xCA", ecirc: "\xEA", Egrave: "\xC8", egrave: "\xE8", ETH: "\xD0", eth: "\xF0", Euml: "\xCB", euml: "\xEB", frac12: "\xBD", frac14: "\xBC", frac34: "\xBE", gt: ">", GT: ">", Iacute: "\xCD", iacute: "\xED", Icirc: "\xCE", icirc: "\xEE", iexcl: "\xA1", Igrave: "\xCC", igrave: "\xEC", iquest: "\xBF", Iuml: "\xCF", iuml: "\xEF", laquo: "\xAB", lt: "<", LT: "<", macr: "\xAF", micro: "\xB5", middot: "\xB7", nbsp: "\xA0", not: "\xAC", Ntilde: "\xD1", ntilde: "\xF1", Oacute: "\xD3", oacute: "\xF3", Ocirc: "\xD4", ocirc: "\xF4", Ograve: "\xD2", ograve: "\xF2", ordf: "\xAA", ordm: "\xBA", Oslash: "\xD8", oslash: "\xF8", Otilde: "\xD5", otilde: "\xF5", Ouml: "\xD6", ouml: "\xF6", para: "\xB6", plusmn: "\xB1", pound: "\xA3", quot: '"', QUOT: '"', raquo: "\xBB", reg: "\xAE", REG: "\xAE", sect: "\xA7", shy: "\xAD", sup1: "\xB9", sup2: "\xB2", sup3: "\xB3", szlig: "\xDF", THORN: "\xDE", thorn: "\xFE", times: "\xD7", Uacute: "\xDA", uacute: "\xFA", Ucirc: "\xDB", ucirc: "\xFB", Ugrave: "\xD9", ugrave: "\xF9", uml: "\xA8", Uuml: "\xDC", uuml: "\xFC", Yacute: "\xDD", yacute: "\xFD", yen: "\xA5", yuml: "\xFF" };
  }
});

// node_modules/entities/lib/maps/xml.json
var require_xml = __commonJS({
  "node_modules/entities/lib/maps/xml.json"(exports, module2) {
    module2.exports = { amp: "&", apos: "'", gt: ">", lt: "<", quot: '"' };
  }
});

// node_modules/entities/lib/maps/decode.json
var require_decode = __commonJS({
  "node_modules/entities/lib/maps/decode.json"(exports, module2) {
    module2.exports = { "0": 65533, "128": 8364, "130": 8218, "131": 402, "132": 8222, "133": 8230, "134": 8224, "135": 8225, "136": 710, "137": 8240, "138": 352, "139": 8249, "140": 338, "142": 381, "145": 8216, "146": 8217, "147": 8220, "148": 8221, "149": 8226, "150": 8211, "151": 8212, "152": 732, "153": 8482, "154": 353, "155": 8250, "156": 339, "158": 382, "159": 376 };
  }
});

// node_modules/entities/lib/decode_codepoint.js
var require_decode_codepoint = __commonJS({
  "node_modules/entities/lib/decode_codepoint.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var decode_json_1 = __importDefault(require_decode());
    var fromCodePoint = String.fromCodePoint || function(codePoint) {
      var output = "";
      if (codePoint > 65535) {
        codePoint -= 65536;
        output += String.fromCharCode(codePoint >>> 10 & 1023 | 55296);
        codePoint = 56320 | codePoint & 1023;
      }
      output += String.fromCharCode(codePoint);
      return output;
    };
    function decodeCodePoint(codePoint) {
      if (codePoint >= 55296 && codePoint <= 57343 || codePoint > 1114111) {
        return "\uFFFD";
      }
      if (codePoint in decode_json_1.default) {
        codePoint = decode_json_1.default[codePoint];
      }
      return fromCodePoint(codePoint);
    }
    exports.default = decodeCodePoint;
  }
});

// node_modules/entities/lib/decode.js
var require_decode2 = __commonJS({
  "node_modules/entities/lib/decode.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.decodeHTML = exports.decodeHTMLStrict = exports.decodeXML = void 0;
    var entities_json_1 = __importDefault(require_entities());
    var legacy_json_1 = __importDefault(require_legacy());
    var xml_json_1 = __importDefault(require_xml());
    var decode_codepoint_1 = __importDefault(require_decode_codepoint());
    var strictEntityRe = /&(?:[a-zA-Z0-9]+|#[xX][\da-fA-F]+|#\d+);/g;
    exports.decodeXML = getStrictDecoder(xml_json_1.default);
    exports.decodeHTMLStrict = getStrictDecoder(entities_json_1.default);
    function getStrictDecoder(map) {
      var replace = getReplacer(map);
      return function(str) {
        return String(str).replace(strictEntityRe, replace);
      };
    }
    var sorter = function(a, b) {
      return a < b ? 1 : -1;
    };
    exports.decodeHTML = function() {
      var legacy = Object.keys(legacy_json_1.default).sort(sorter);
      var keys = Object.keys(entities_json_1.default).sort(sorter);
      for (var i2 = 0, j = 0; i2 < keys.length; i2++) {
        if (legacy[j] === keys[i2]) {
          keys[i2] += ";?";
          j++;
        } else {
          keys[i2] += ";";
        }
      }
      var re = new RegExp("&(?:" + keys.join("|") + "|#[xX][\\da-fA-F]+;?|#\\d+;?)", "g");
      var replace = getReplacer(entities_json_1.default);
      function replacer(str) {
        if (str.substr(-1) !== ";")
          str += ";";
        return replace(str);
      }
      return function(str) {
        return String(str).replace(re, replacer);
      };
    }();
    function getReplacer(map) {
      return function replace(str) {
        if (str.charAt(1) === "#") {
          var secondChar = str.charAt(2);
          if (secondChar === "X" || secondChar === "x") {
            return decode_codepoint_1.default(parseInt(str.substr(3), 16));
          }
          return decode_codepoint_1.default(parseInt(str.substr(2), 10));
        }
        return map[str.slice(1, -1)] || str;
      };
    }
  }
});

// node_modules/entities/lib/encode.js
var require_encode = __commonJS({
  "node_modules/entities/lib/encode.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.escapeUTF8 = exports.escape = exports.encodeNonAsciiHTML = exports.encodeHTML = exports.encodeXML = void 0;
    var xml_json_1 = __importDefault(require_xml());
    var inverseXML = getInverseObj(xml_json_1.default);
    var xmlReplacer = getInverseReplacer(inverseXML);
    exports.encodeXML = getASCIIEncoder(inverseXML);
    var entities_json_1 = __importDefault(require_entities());
    var inverseHTML = getInverseObj(entities_json_1.default);
    var htmlReplacer = getInverseReplacer(inverseHTML);
    exports.encodeHTML = getInverse(inverseHTML, htmlReplacer);
    exports.encodeNonAsciiHTML = getASCIIEncoder(inverseHTML);
    function getInverseObj(obj) {
      return Object.keys(obj).sort().reduce(function(inverse, name) {
        inverse[obj[name]] = "&" + name + ";";
        return inverse;
      }, {});
    }
    function getInverseReplacer(inverse) {
      var single = [];
      var multiple = [];
      for (var _i = 0, _a = Object.keys(inverse); _i < _a.length; _i++) {
        var k = _a[_i];
        if (k.length === 1) {
          single.push("\\" + k);
        } else {
          multiple.push(k);
        }
      }
      single.sort();
      for (var start = 0; start < single.length - 1; start++) {
        var end = start;
        while (end < single.length - 1 && single[end].charCodeAt(1) + 1 === single[end + 1].charCodeAt(1)) {
          end += 1;
        }
        var count = 1 + end - start;
        if (count < 3)
          continue;
        single.splice(start, count, single[start] + "-" + single[end]);
      }
      multiple.unshift("[" + single.join("") + "]");
      return new RegExp(multiple.join("|"), "g");
    }
    var reNonASCII = /(?:[\x80-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])/g;
    var getCodePoint = String.prototype.codePointAt != null ? function(str) {
      return str.codePointAt(0);
    } : function(c) {
      return (c.charCodeAt(0) - 55296) * 1024 + c.charCodeAt(1) - 56320 + 65536;
    };
    function singleCharReplacer(c) {
      return "&#x" + (c.length > 1 ? getCodePoint(c) : c.charCodeAt(0)).toString(16).toUpperCase() + ";";
    }
    function getInverse(inverse, re) {
      return function(data) {
        return data.replace(re, function(name) {
          return inverse[name];
        }).replace(reNonASCII, singleCharReplacer);
      };
    }
    var reEscapeChars = new RegExp(xmlReplacer.source + "|" + reNonASCII.source, "g");
    function escape(data) {
      return data.replace(reEscapeChars, singleCharReplacer);
    }
    exports.escape = escape;
    function escapeUTF8(data) {
      return data.replace(xmlReplacer, singleCharReplacer);
    }
    exports.escapeUTF8 = escapeUTF8;
    function getASCIIEncoder(obj) {
      return function(data) {
        return data.replace(reEscapeChars, function(c) {
          return obj[c] || singleCharReplacer(c);
        });
      };
    }
  }
});

// node_modules/entities/lib/index.js
var require_lib = __commonJS({
  "node_modules/entities/lib/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.decodeXMLStrict = exports.decodeHTML5Strict = exports.decodeHTML4Strict = exports.decodeHTML5 = exports.decodeHTML4 = exports.decodeHTMLStrict = exports.decodeHTML = exports.decodeXML = exports.encodeHTML5 = exports.encodeHTML4 = exports.escapeUTF8 = exports.escape = exports.encodeNonAsciiHTML = exports.encodeHTML = exports.encodeXML = exports.encode = exports.decodeStrict = exports.decode = void 0;
    var decode_1 = require_decode2();
    var encode_1 = require_encode();
    function decode(data, level) {
      return (!level || level <= 0 ? decode_1.decodeXML : decode_1.decodeHTML)(data);
    }
    exports.decode = decode;
    function decodeStrict(data, level) {
      return (!level || level <= 0 ? decode_1.decodeXML : decode_1.decodeHTMLStrict)(data);
    }
    exports.decodeStrict = decodeStrict;
    function encode(data, level) {
      return (!level || level <= 0 ? encode_1.encodeXML : encode_1.encodeHTML)(data);
    }
    exports.encode = encode;
    var encode_2 = require_encode();
    Object.defineProperty(exports, "encodeXML", { enumerable: true, get: function() {
      return encode_2.encodeXML;
    } });
    Object.defineProperty(exports, "encodeHTML", { enumerable: true, get: function() {
      return encode_2.encodeHTML;
    } });
    Object.defineProperty(exports, "encodeNonAsciiHTML", { enumerable: true, get: function() {
      return encode_2.encodeNonAsciiHTML;
    } });
    Object.defineProperty(exports, "escape", { enumerable: true, get: function() {
      return encode_2.escape;
    } });
    Object.defineProperty(exports, "escapeUTF8", { enumerable: true, get: function() {
      return encode_2.escapeUTF8;
    } });
    Object.defineProperty(exports, "encodeHTML4", { enumerable: true, get: function() {
      return encode_2.encodeHTML;
    } });
    Object.defineProperty(exports, "encodeHTML5", { enumerable: true, get: function() {
      return encode_2.encodeHTML;
    } });
    var decode_2 = require_decode2();
    Object.defineProperty(exports, "decodeXML", { enumerable: true, get: function() {
      return decode_2.decodeXML;
    } });
    Object.defineProperty(exports, "decodeHTML", { enumerable: true, get: function() {
      return decode_2.decodeHTML;
    } });
    Object.defineProperty(exports, "decodeHTMLStrict", { enumerable: true, get: function() {
      return decode_2.decodeHTMLStrict;
    } });
    Object.defineProperty(exports, "decodeHTML4", { enumerable: true, get: function() {
      return decode_2.decodeHTML;
    } });
    Object.defineProperty(exports, "decodeHTML5", { enumerable: true, get: function() {
      return decode_2.decodeHTML;
    } });
    Object.defineProperty(exports, "decodeHTML4Strict", { enumerable: true, get: function() {
      return decode_2.decodeHTMLStrict;
    } });
    Object.defineProperty(exports, "decodeHTML5Strict", { enumerable: true, get: function() {
      return decode_2.decodeHTMLStrict;
    } });
    Object.defineProperty(exports, "decodeXMLStrict", { enumerable: true, get: function() {
      return decode_2.decodeXML;
    } });
  }
});

// node_modules/fast-xml-parser/src/util.js
var require_util = __commonJS({
  "node_modules/fast-xml-parser/src/util.js"(exports) {
    "use strict";
    var nameStartChar = ":A-Za-z_\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD";
    var nameChar = nameStartChar + "\\-.\\d\\u00B7\\u0300-\\u036F\\u203F-\\u2040";
    var nameRegexp = "[" + nameStartChar + "][" + nameChar + "]*";
    var regexName = new RegExp("^" + nameRegexp + "$");
    var getAllMatches = function(string, regex) {
      const matches = [];
      let match = regex.exec(string);
      while (match) {
        const allmatches = [];
        const len = match.length;
        for (let index = 0; index < len; index++) {
          allmatches.push(match[index]);
        }
        matches.push(allmatches);
        match = regex.exec(string);
      }
      return matches;
    };
    var isName = function(string) {
      const match = regexName.exec(string);
      return !(match === null || typeof match === "undefined");
    };
    exports.isExist = function(v) {
      return typeof v !== "undefined";
    };
    exports.isEmptyObject = function(obj) {
      return Object.keys(obj).length === 0;
    };
    exports.merge = function(target, a, arrayMode) {
      if (a) {
        const keys = Object.keys(a);
        const len = keys.length;
        for (let i2 = 0; i2 < len; i2++) {
          if (arrayMode === "strict") {
            target[keys[i2]] = [a[keys[i2]]];
          } else {
            target[keys[i2]] = a[keys[i2]];
          }
        }
      }
    };
    exports.getValue = function(v) {
      if (exports.isExist(v)) {
        return v;
      } else {
        return "";
      }
    };
    exports.buildOptions = function(options, defaultOptions, props) {
      var newOptions = {};
      if (!options) {
        return defaultOptions;
      }
      for (let i2 = 0; i2 < props.length; i2++) {
        if (options[props[i2]] !== void 0) {
          newOptions[props[i2]] = options[props[i2]];
        } else {
          newOptions[props[i2]] = defaultOptions[props[i2]];
        }
      }
      return newOptions;
    };
    exports.isTagNameInArrayMode = function(tagName, arrayMode, parentTagName) {
      if (arrayMode === false) {
        return false;
      } else if (arrayMode instanceof RegExp) {
        return arrayMode.test(tagName);
      } else if (typeof arrayMode === "function") {
        return !!arrayMode(tagName, parentTagName);
      }
      return arrayMode === "strict";
    };
    exports.isName = isName;
    exports.getAllMatches = getAllMatches;
    exports.nameRegexp = nameRegexp;
  }
});

// node_modules/fast-xml-parser/src/node2json.js
var require_node2json = __commonJS({
  "node_modules/fast-xml-parser/src/node2json.js"(exports) {
    "use strict";
    var util = require_util();
    var convertToJson = function(node, options, parentTagName) {
      const jObj = {};
      if ((!node.child || util.isEmptyObject(node.child)) && (!node.attrsMap || util.isEmptyObject(node.attrsMap))) {
        return util.isExist(node.val) ? node.val : "";
      }
      if (util.isExist(node.val) && !(typeof node.val === "string" && (node.val === "" || node.val === options.cdataPositionChar))) {
        const asArray = util.isTagNameInArrayMode(node.tagname, options.arrayMode, parentTagName);
        jObj[options.textNodeName] = asArray ? [node.val] : node.val;
      }
      util.merge(jObj, node.attrsMap, options.arrayMode);
      const keys = Object.keys(node.child);
      for (let index = 0; index < keys.length; index++) {
        const tagName = keys[index];
        if (node.child[tagName] && node.child[tagName].length > 1) {
          jObj[tagName] = [];
          for (let tag in node.child[tagName]) {
            if (node.child[tagName].hasOwnProperty(tag)) {
              jObj[tagName].push(convertToJson(node.child[tagName][tag], options, tagName));
            }
          }
        } else {
          const result = convertToJson(node.child[tagName][0], options, tagName);
          const asArray = options.arrayMode === true && typeof result === "object" || util.isTagNameInArrayMode(tagName, options.arrayMode, parentTagName);
          jObj[tagName] = asArray ? [result] : result;
        }
      }
      return jObj;
    };
    exports.convertToJson = convertToJson;
  }
});

// node_modules/fast-xml-parser/src/xmlNode.js
var require_xmlNode = __commonJS({
  "node_modules/fast-xml-parser/src/xmlNode.js"(exports, module2) {
    "use strict";
    module2.exports = function(tagname, parent, val) {
      this.tagname = tagname;
      this.parent = parent;
      this.child = {};
      this.attrsMap = {};
      this.val = val;
      this.addChild = function(child) {
        if (Array.isArray(this.child[child.tagname])) {
          this.child[child.tagname].push(child);
        } else {
          this.child[child.tagname] = [child];
        }
      };
    };
  }
});

// node_modules/fast-xml-parser/src/xmlstr2xmlnode.js
var require_xmlstr2xmlnode = __commonJS({
  "node_modules/fast-xml-parser/src/xmlstr2xmlnode.js"(exports) {
    "use strict";
    var util = require_util();
    var buildOptions = require_util().buildOptions;
    var xmlNode = require_xmlNode();
    var regx = "<((!\\[CDATA\\[([\\s\\S]*?)(]]>))|((NAME:)?(NAME))([^>]*)>|((\\/)(NAME)\\s*>))([^<]*)".replace(/NAME/g, util.nameRegexp);
    if (!Number.parseInt && window.parseInt) {
      Number.parseInt = window.parseInt;
    }
    if (!Number.parseFloat && window.parseFloat) {
      Number.parseFloat = window.parseFloat;
    }
    var defaultOptions = {
      attributeNamePrefix: "@_",
      attrNodeName: false,
      textNodeName: "#text",
      ignoreAttributes: true,
      ignoreNameSpace: false,
      allowBooleanAttributes: false,
      parseNodeValue: true,
      parseAttributeValue: false,
      arrayMode: false,
      trimValues: true,
      cdataTagName: false,
      cdataPositionChar: "\\c",
      tagValueProcessor: function(a, tagName) {
        return a;
      },
      attrValueProcessor: function(a, attrName) {
        return a;
      },
      stopNodes: []
    };
    exports.defaultOptions = defaultOptions;
    var props = [
      "attributeNamePrefix",
      "attrNodeName",
      "textNodeName",
      "ignoreAttributes",
      "ignoreNameSpace",
      "allowBooleanAttributes",
      "parseNodeValue",
      "parseAttributeValue",
      "arrayMode",
      "trimValues",
      "cdataTagName",
      "cdataPositionChar",
      "tagValueProcessor",
      "attrValueProcessor",
      "parseTrueNumberOnly",
      "stopNodes"
    ];
    exports.props = props;
    function processTagValue(tagName, val, options) {
      if (val) {
        if (options.trimValues) {
          val = val.trim();
        }
        val = options.tagValueProcessor(val, tagName);
        val = parseValue(val, options.parseNodeValue, options.parseTrueNumberOnly);
      }
      return val;
    }
    function resolveNameSpace(tagname, options) {
      if (options.ignoreNameSpace) {
        const tags = tagname.split(":");
        const prefix = tagname.charAt(0) === "/" ? "/" : "";
        if (tags[0] === "xmlns") {
          return "";
        }
        if (tags.length === 2) {
          tagname = prefix + tags[1];
        }
      }
      return tagname;
    }
    function parseValue(val, shouldParse, parseTrueNumberOnly) {
      if (shouldParse && typeof val === "string") {
        let parsed;
        if (val.trim() === "" || isNaN(val)) {
          parsed = val === "true" ? true : val === "false" ? false : val;
        } else {
          if (val.indexOf("0x") !== -1) {
            parsed = Number.parseInt(val, 16);
          } else if (val.indexOf(".") !== -1) {
            parsed = Number.parseFloat(val);
            val = val.replace(/\.?0+$/, "");
          } else {
            parsed = Number.parseInt(val, 10);
          }
          if (parseTrueNumberOnly) {
            parsed = String(parsed) === val ? parsed : val;
          }
        }
        return parsed;
      } else {
        if (util.isExist(val)) {
          return val;
        } else {
          return "";
        }
      }
    }
    var attrsRegx = new RegExp(`([^\\s=]+)\\s*(=\\s*(['"])(.*?)\\3)?`, "g");
    function buildAttributesMap(attrStr, options) {
      if (!options.ignoreAttributes && typeof attrStr === "string") {
        attrStr = attrStr.replace(/\r?\n/g, " ");
        const matches = util.getAllMatches(attrStr, attrsRegx);
        const len = matches.length;
        const attrs = {};
        for (let i2 = 0; i2 < len; i2++) {
          const attrName = resolveNameSpace(matches[i2][1], options);
          if (attrName.length) {
            if (matches[i2][4] !== void 0) {
              if (options.trimValues) {
                matches[i2][4] = matches[i2][4].trim();
              }
              matches[i2][4] = options.attrValueProcessor(matches[i2][4], attrName);
              attrs[options.attributeNamePrefix + attrName] = parseValue(matches[i2][4], options.parseAttributeValue, options.parseTrueNumberOnly);
            } else if (options.allowBooleanAttributes) {
              attrs[options.attributeNamePrefix + attrName] = true;
            }
          }
        }
        if (!Object.keys(attrs).length) {
          return;
        }
        if (options.attrNodeName) {
          const attrCollection = {};
          attrCollection[options.attrNodeName] = attrs;
          return attrCollection;
        }
        return attrs;
      }
    }
    var getTraversalObj = function(xmlData, options) {
      xmlData = xmlData.replace(/\r\n?/g, "\n");
      options = buildOptions(options, defaultOptions, props);
      const xmlObj = new xmlNode("!xml");
      let currentNode = xmlObj;
      let textData = "";
      for (let i2 = 0; i2 < xmlData.length; i2++) {
        const ch = xmlData[i2];
        if (ch === "<") {
          if (xmlData[i2 + 1] === "/") {
            const closeIndex = findClosingIndex(xmlData, ">", i2, "Closing Tag is not closed.");
            let tagName = xmlData.substring(i2 + 2, closeIndex).trim();
            if (options.ignoreNameSpace) {
              const colonIndex = tagName.indexOf(":");
              if (colonIndex !== -1) {
                tagName = tagName.substr(colonIndex + 1);
              }
            }
            if (currentNode) {
              if (currentNode.val) {
                currentNode.val = util.getValue(currentNode.val) + "" + processTagValue(tagName, textData, options);
              } else {
                currentNode.val = processTagValue(tagName, textData, options);
              }
            }
            if (options.stopNodes.length && options.stopNodes.includes(currentNode.tagname)) {
              currentNode.child = [];
              if (currentNode.attrsMap == void 0) {
                currentNode.attrsMap = {};
              }
              currentNode.val = xmlData.substr(currentNode.startIndex + 1, i2 - currentNode.startIndex - 1);
            }
            currentNode = currentNode.parent;
            textData = "";
            i2 = closeIndex;
          } else if (xmlData[i2 + 1] === "?") {
            i2 = findClosingIndex(xmlData, "?>", i2, "Pi Tag is not closed.");
          } else if (xmlData.substr(i2 + 1, 3) === "!--") {
            i2 = findClosingIndex(xmlData, "-->", i2, "Comment is not closed.");
          } else if (xmlData.substr(i2 + 1, 2) === "!D") {
            const closeIndex = findClosingIndex(xmlData, ">", i2, "DOCTYPE is not closed.");
            const tagExp = xmlData.substring(i2, closeIndex);
            if (tagExp.indexOf("[") >= 0) {
              i2 = xmlData.indexOf("]>", i2) + 1;
            } else {
              i2 = closeIndex;
            }
          } else if (xmlData.substr(i2 + 1, 2) === "![") {
            const closeIndex = findClosingIndex(xmlData, "]]>", i2, "CDATA is not closed.") - 2;
            const tagExp = xmlData.substring(i2 + 9, closeIndex);
            if (textData) {
              currentNode.val = util.getValue(currentNode.val) + "" + processTagValue(currentNode.tagname, textData, options);
              textData = "";
            }
            if (options.cdataTagName) {
              const childNode = new xmlNode(options.cdataTagName, currentNode, tagExp);
              currentNode.addChild(childNode);
              currentNode.val = util.getValue(currentNode.val) + options.cdataPositionChar;
              if (tagExp) {
                childNode.val = tagExp;
              }
            } else {
              currentNode.val = (currentNode.val || "") + (tagExp || "");
            }
            i2 = closeIndex + 2;
          } else {
            const result = closingIndexForOpeningTag(xmlData, i2 + 1);
            let tagExp = result.data;
            const closeIndex = result.index;
            const separatorIndex = tagExp.indexOf(" ");
            let tagName = tagExp;
            let shouldBuildAttributesMap = true;
            if (separatorIndex !== -1) {
              tagName = tagExp.substr(0, separatorIndex).replace(/\s\s*$/, "");
              tagExp = tagExp.substr(separatorIndex + 1);
            }
            if (options.ignoreNameSpace) {
              const colonIndex = tagName.indexOf(":");
              if (colonIndex !== -1) {
                tagName = tagName.substr(colonIndex + 1);
                shouldBuildAttributesMap = tagName !== result.data.substr(colonIndex + 1);
              }
            }
            if (currentNode && textData) {
              if (currentNode.tagname !== "!xml") {
                currentNode.val = util.getValue(currentNode.val) + "" + processTagValue(currentNode.tagname, textData, options);
              }
            }
            if (tagExp.length > 0 && tagExp.lastIndexOf("/") === tagExp.length - 1) {
              if (tagName[tagName.length - 1] === "/") {
                tagName = tagName.substr(0, tagName.length - 1);
                tagExp = tagName;
              } else {
                tagExp = tagExp.substr(0, tagExp.length - 1);
              }
              const childNode = new xmlNode(tagName, currentNode, "");
              if (tagName !== tagExp) {
                childNode.attrsMap = buildAttributesMap(tagExp, options);
              }
              currentNode.addChild(childNode);
            } else {
              const childNode = new xmlNode(tagName, currentNode);
              if (options.stopNodes.length && options.stopNodes.includes(childNode.tagname)) {
                childNode.startIndex = closeIndex;
              }
              if (tagName !== tagExp && shouldBuildAttributesMap) {
                childNode.attrsMap = buildAttributesMap(tagExp, options);
              }
              currentNode.addChild(childNode);
              currentNode = childNode;
            }
            textData = "";
            i2 = closeIndex;
          }
        } else {
          textData += xmlData[i2];
        }
      }
      return xmlObj;
    };
    function closingIndexForOpeningTag(data, i2) {
      let attrBoundary;
      let tagExp = "";
      for (let index = i2; index < data.length; index++) {
        let ch = data[index];
        if (attrBoundary) {
          if (ch === attrBoundary)
            attrBoundary = "";
        } else if (ch === '"' || ch === "'") {
          attrBoundary = ch;
        } else if (ch === ">") {
          return {
            data: tagExp,
            index
          };
        } else if (ch === "	") {
          ch = " ";
        }
        tagExp += ch;
      }
    }
    function findClosingIndex(xmlData, str, i2, errMsg) {
      const closingIndex = xmlData.indexOf(str, i2);
      if (closingIndex === -1) {
        throw new Error(errMsg);
      } else {
        return closingIndex + str.length - 1;
      }
    }
    exports.getTraversalObj = getTraversalObj;
  }
});

// node_modules/fast-xml-parser/src/validator.js
var require_validator = __commonJS({
  "node_modules/fast-xml-parser/src/validator.js"(exports) {
    "use strict";
    var util = require_util();
    var defaultOptions = {
      allowBooleanAttributes: false
    };
    var props = ["allowBooleanAttributes"];
    exports.validate = function(xmlData, options) {
      options = util.buildOptions(options, defaultOptions, props);
      const tags = [];
      let tagFound = false;
      let reachedRoot = false;
      if (xmlData[0] === "\uFEFF") {
        xmlData = xmlData.substr(1);
      }
      for (let i2 = 0; i2 < xmlData.length; i2++) {
        if (xmlData[i2] === "<" && xmlData[i2 + 1] === "?") {
          i2 += 2;
          i2 = readPI(xmlData, i2);
          if (i2.err)
            return i2;
        } else if (xmlData[i2] === "<") {
          i2++;
          if (xmlData[i2] === "!") {
            i2 = readCommentAndCDATA(xmlData, i2);
            continue;
          } else {
            let closingTag = false;
            if (xmlData[i2] === "/") {
              closingTag = true;
              i2++;
            }
            let tagName = "";
            for (; i2 < xmlData.length && xmlData[i2] !== ">" && xmlData[i2] !== " " && xmlData[i2] !== "	" && xmlData[i2] !== "\n" && xmlData[i2] !== "\r"; i2++) {
              tagName += xmlData[i2];
            }
            tagName = tagName.trim();
            if (tagName[tagName.length - 1] === "/") {
              tagName = tagName.substring(0, tagName.length - 1);
              i2--;
            }
            if (!validateTagName(tagName)) {
              let msg;
              if (tagName.trim().length === 0) {
                msg = "There is an unnecessary space between tag name and backward slash '</ ..'.";
              } else {
                msg = "Tag '" + tagName + "' is an invalid name.";
              }
              return getErrorObject("InvalidTag", msg, getLineNumberForPosition(xmlData, i2));
            }
            const result = readAttributeStr(xmlData, i2);
            if (result === false) {
              return getErrorObject("InvalidAttr", "Attributes for '" + tagName + "' have open quote.", getLineNumberForPosition(xmlData, i2));
            }
            let attrStr = result.value;
            i2 = result.index;
            if (attrStr[attrStr.length - 1] === "/") {
              attrStr = attrStr.substring(0, attrStr.length - 1);
              const isValid = validateAttributeString(attrStr, options);
              if (isValid === true) {
                tagFound = true;
              } else {
                return getErrorObject(isValid.err.code, isValid.err.msg, getLineNumberForPosition(xmlData, i2 - attrStr.length + isValid.err.line));
              }
            } else if (closingTag) {
              if (!result.tagClosed) {
                return getErrorObject("InvalidTag", "Closing tag '" + tagName + "' doesn't have proper closing.", getLineNumberForPosition(xmlData, i2));
              } else if (attrStr.trim().length > 0) {
                return getErrorObject("InvalidTag", "Closing tag '" + tagName + "' can't have attributes or invalid starting.", getLineNumberForPosition(xmlData, i2));
              } else {
                const otg = tags.pop();
                if (tagName !== otg) {
                  return getErrorObject("InvalidTag", "Closing tag '" + otg + "' is expected inplace of '" + tagName + "'.", getLineNumberForPosition(xmlData, i2));
                }
                if (tags.length == 0) {
                  reachedRoot = true;
                }
              }
            } else {
              const isValid = validateAttributeString(attrStr, options);
              if (isValid !== true) {
                return getErrorObject(isValid.err.code, isValid.err.msg, getLineNumberForPosition(xmlData, i2 - attrStr.length + isValid.err.line));
              }
              if (reachedRoot === true) {
                return getErrorObject("InvalidXml", "Multiple possible root nodes found.", getLineNumberForPosition(xmlData, i2));
              } else {
                tags.push(tagName);
              }
              tagFound = true;
            }
            for (i2++; i2 < xmlData.length; i2++) {
              if (xmlData[i2] === "<") {
                if (xmlData[i2 + 1] === "!") {
                  i2++;
                  i2 = readCommentAndCDATA(xmlData, i2);
                  continue;
                } else if (xmlData[i2 + 1] === "?") {
                  i2 = readPI(xmlData, ++i2);
                  if (i2.err)
                    return i2;
                } else {
                  break;
                }
              } else if (xmlData[i2] === "&") {
                const afterAmp = validateAmpersand(xmlData, i2);
                if (afterAmp == -1)
                  return getErrorObject("InvalidChar", "char '&' is not expected.", getLineNumberForPosition(xmlData, i2));
                i2 = afterAmp;
              }
            }
            if (xmlData[i2] === "<") {
              i2--;
            }
          }
        } else {
          if (xmlData[i2] === " " || xmlData[i2] === "	" || xmlData[i2] === "\n" || xmlData[i2] === "\r") {
            continue;
          }
          return getErrorObject("InvalidChar", "char '" + xmlData[i2] + "' is not expected.", getLineNumberForPosition(xmlData, i2));
        }
      }
      if (!tagFound) {
        return getErrorObject("InvalidXml", "Start tag expected.", 1);
      } else if (tags.length > 0) {
        return getErrorObject("InvalidXml", "Invalid '" + JSON.stringify(tags, null, 4).replace(/\r?\n/g, "") + "' found.", 1);
      }
      return true;
    };
    function readPI(xmlData, i2) {
      var start = i2;
      for (; i2 < xmlData.length; i2++) {
        if (xmlData[i2] == "?" || xmlData[i2] == " ") {
          var tagname = xmlData.substr(start, i2 - start);
          if (i2 > 5 && tagname === "xml") {
            return getErrorObject("InvalidXml", "XML declaration allowed only at the start of the document.", getLineNumberForPosition(xmlData, i2));
          } else if (xmlData[i2] == "?" && xmlData[i2 + 1] == ">") {
            i2++;
            break;
          } else {
            continue;
          }
        }
      }
      return i2;
    }
    function readCommentAndCDATA(xmlData, i2) {
      if (xmlData.length > i2 + 5 && xmlData[i2 + 1] === "-" && xmlData[i2 + 2] === "-") {
        for (i2 += 3; i2 < xmlData.length; i2++) {
          if (xmlData[i2] === "-" && xmlData[i2 + 1] === "-" && xmlData[i2 + 2] === ">") {
            i2 += 2;
            break;
          }
        }
      } else if (xmlData.length > i2 + 8 && xmlData[i2 + 1] === "D" && xmlData[i2 + 2] === "O" && xmlData[i2 + 3] === "C" && xmlData[i2 + 4] === "T" && xmlData[i2 + 5] === "Y" && xmlData[i2 + 6] === "P" && xmlData[i2 + 7] === "E") {
        let angleBracketsCount = 1;
        for (i2 += 8; i2 < xmlData.length; i2++) {
          if (xmlData[i2] === "<") {
            angleBracketsCount++;
          } else if (xmlData[i2] === ">") {
            angleBracketsCount--;
            if (angleBracketsCount === 0) {
              break;
            }
          }
        }
      } else if (xmlData.length > i2 + 9 && xmlData[i2 + 1] === "[" && xmlData[i2 + 2] === "C" && xmlData[i2 + 3] === "D" && xmlData[i2 + 4] === "A" && xmlData[i2 + 5] === "T" && xmlData[i2 + 6] === "A" && xmlData[i2 + 7] === "[") {
        for (i2 += 8; i2 < xmlData.length; i2++) {
          if (xmlData[i2] === "]" && xmlData[i2 + 1] === "]" && xmlData[i2 + 2] === ">") {
            i2 += 2;
            break;
          }
        }
      }
      return i2;
    }
    var doubleQuote = '"';
    var singleQuote = "'";
    function readAttributeStr(xmlData, i2) {
      let attrStr = "";
      let startChar = "";
      let tagClosed = false;
      for (; i2 < xmlData.length; i2++) {
        if (xmlData[i2] === doubleQuote || xmlData[i2] === singleQuote) {
          if (startChar === "") {
            startChar = xmlData[i2];
          } else if (startChar !== xmlData[i2]) {
            continue;
          } else {
            startChar = "";
          }
        } else if (xmlData[i2] === ">") {
          if (startChar === "") {
            tagClosed = true;
            break;
          }
        }
        attrStr += xmlData[i2];
      }
      if (startChar !== "") {
        return false;
      }
      return {
        value: attrStr,
        index: i2,
        tagClosed
      };
    }
    var validAttrStrRegxp = new RegExp(`(\\s*)([^\\s=]+)(\\s*=)?(\\s*(['"])(([\\s\\S])*?)\\5)?`, "g");
    function validateAttributeString(attrStr, options) {
      const matches = util.getAllMatches(attrStr, validAttrStrRegxp);
      const attrNames = {};
      for (let i2 = 0; i2 < matches.length; i2++) {
        if (matches[i2][1].length === 0) {
          return getErrorObject("InvalidAttr", "Attribute '" + matches[i2][2] + "' has no space in starting.", getPositionFromMatch(attrStr, matches[i2][0]));
        } else if (matches[i2][3] === void 0 && !options.allowBooleanAttributes) {
          return getErrorObject("InvalidAttr", "boolean attribute '" + matches[i2][2] + "' is not allowed.", getPositionFromMatch(attrStr, matches[i2][0]));
        }
        const attrName = matches[i2][2];
        if (!validateAttrName(attrName)) {
          return getErrorObject("InvalidAttr", "Attribute '" + attrName + "' is an invalid name.", getPositionFromMatch(attrStr, matches[i2][0]));
        }
        if (!attrNames.hasOwnProperty(attrName)) {
          attrNames[attrName] = 1;
        } else {
          return getErrorObject("InvalidAttr", "Attribute '" + attrName + "' is repeated.", getPositionFromMatch(attrStr, matches[i2][0]));
        }
      }
      return true;
    }
    function validateNumberAmpersand(xmlData, i2) {
      let re = /\d/;
      if (xmlData[i2] === "x") {
        i2++;
        re = /[\da-fA-F]/;
      }
      for (; i2 < xmlData.length; i2++) {
        if (xmlData[i2] === ";")
          return i2;
        if (!xmlData[i2].match(re))
          break;
      }
      return -1;
    }
    function validateAmpersand(xmlData, i2) {
      i2++;
      if (xmlData[i2] === ";")
        return -1;
      if (xmlData[i2] === "#") {
        i2++;
        return validateNumberAmpersand(xmlData, i2);
      }
      let count = 0;
      for (; i2 < xmlData.length; i2++, count++) {
        if (xmlData[i2].match(/\w/) && count < 20)
          continue;
        if (xmlData[i2] === ";")
          break;
        return -1;
      }
      return i2;
    }
    function getErrorObject(code, message, lineNumber) {
      return {
        err: {
          code,
          msg: message,
          line: lineNumber
        }
      };
    }
    function validateAttrName(attrName) {
      return util.isName(attrName);
    }
    function validateTagName(tagname) {
      return util.isName(tagname);
    }
    function getLineNumberForPosition(xmlData, index) {
      var lines = xmlData.substring(0, index).split(/\r?\n/);
      return lines.length;
    }
    function getPositionFromMatch(attrStr, match) {
      return attrStr.indexOf(match) + match.length;
    }
  }
});

// node_modules/fast-xml-parser/src/nimndata.js
var require_nimndata = __commonJS({
  "node_modules/fast-xml-parser/src/nimndata.js"(exports) {
    "use strict";
    var char = function(a) {
      return String.fromCharCode(a);
    };
    var chars = {
      nilChar: char(176),
      missingChar: char(201),
      nilPremitive: char(175),
      missingPremitive: char(200),
      emptyChar: char(178),
      emptyValue: char(177),
      boundryChar: char(179),
      objStart: char(198),
      arrStart: char(204),
      arrayEnd: char(185)
    };
    var charsArr = [
      chars.nilChar,
      chars.nilPremitive,
      chars.missingChar,
      chars.missingPremitive,
      chars.boundryChar,
      chars.emptyChar,
      chars.emptyValue,
      chars.arrayEnd,
      chars.objStart,
      chars.arrStart
    ];
    var _e = function(node, e_schema, options) {
      if (typeof e_schema === "string") {
        if (node && node[0] && node[0].val !== void 0) {
          return getValue(node[0].val, e_schema);
        } else {
          return getValue(node, e_schema);
        }
      } else {
        const hasValidData = hasData(node);
        if (hasValidData === true) {
          let str = "";
          if (Array.isArray(e_schema)) {
            str += chars.arrStart;
            const itemSchema = e_schema[0];
            const arr_len = node.length;
            if (typeof itemSchema === "string") {
              for (let arr_i = 0; arr_i < arr_len; arr_i++) {
                const r2 = getValue(node[arr_i].val, itemSchema);
                str = processValue(str, r2);
              }
            } else {
              for (let arr_i = 0; arr_i < arr_len; arr_i++) {
                const r2 = _e(node[arr_i], itemSchema, options);
                str = processValue(str, r2);
              }
            }
            str += chars.arrayEnd;
          } else {
            str += chars.objStart;
            const keys = Object.keys(e_schema);
            if (Array.isArray(node)) {
              node = node[0];
            }
            for (let i2 in keys) {
              const key = keys[i2];
              let r2;
              if (!options.ignoreAttributes && node.attrsMap && node.attrsMap[key]) {
                r2 = _e(node.attrsMap[key], e_schema[key], options);
              } else if (key === options.textNodeName) {
                r2 = _e(node.val, e_schema[key], options);
              } else {
                r2 = _e(node.child[key], e_schema[key], options);
              }
              str = processValue(str, r2);
            }
          }
          return str;
        } else {
          return hasValidData;
        }
      }
    };
    var getValue = function(a) {
      switch (a) {
        case void 0:
          return chars.missingPremitive;
        case null:
          return chars.nilPremitive;
        case "":
          return chars.emptyValue;
        default:
          return a;
      }
    };
    var processValue = function(str, r2) {
      if (!isAppChar(r2[0]) && !isAppChar(str[str.length - 1])) {
        str += chars.boundryChar;
      }
      return str + r2;
    };
    var isAppChar = function(ch) {
      return charsArr.indexOf(ch) !== -1;
    };
    function hasData(jObj) {
      if (jObj === void 0) {
        return chars.missingChar;
      } else if (jObj === null) {
        return chars.nilChar;
      } else if (jObj.child && Object.keys(jObj.child).length === 0 && (!jObj.attrsMap || Object.keys(jObj.attrsMap).length === 0)) {
        return chars.emptyChar;
      } else {
        return true;
      }
    }
    var x2j = require_xmlstr2xmlnode();
    var buildOptions = require_util().buildOptions;
    var convert2nimn = function(node, e_schema, options) {
      options = buildOptions(options, x2j.defaultOptions, x2j.props);
      return _e(node, e_schema, options);
    };
    exports.convert2nimn = convert2nimn;
  }
});

// node_modules/fast-xml-parser/src/node2json_str.js
var require_node2json_str = __commonJS({
  "node_modules/fast-xml-parser/src/node2json_str.js"(exports) {
    "use strict";
    var util = require_util();
    var buildOptions = require_util().buildOptions;
    var x2j = require_xmlstr2xmlnode();
    var convertToJsonString = function(node, options) {
      options = buildOptions(options, x2j.defaultOptions, x2j.props);
      options.indentBy = options.indentBy || "";
      return _cToJsonStr(node, options, 0);
    };
    var _cToJsonStr = function(node, options, level) {
      let jObj = "{";
      const keys = Object.keys(node.child);
      for (let index = 0; index < keys.length; index++) {
        var tagname = keys[index];
        if (node.child[tagname] && node.child[tagname].length > 1) {
          jObj += '"' + tagname + '" : [ ';
          for (var tag in node.child[tagname]) {
            jObj += _cToJsonStr(node.child[tagname][tag], options) + " , ";
          }
          jObj = jObj.substr(0, jObj.length - 1) + " ] ";
        } else {
          jObj += '"' + tagname + '" : ' + _cToJsonStr(node.child[tagname][0], options) + " ,";
        }
      }
      util.merge(jObj, node.attrsMap);
      if (util.isEmptyObject(jObj)) {
        return util.isExist(node.val) ? node.val : "";
      } else {
        if (util.isExist(node.val)) {
          if (!(typeof node.val === "string" && (node.val === "" || node.val === options.cdataPositionChar))) {
            jObj += '"' + options.textNodeName + '" : ' + stringval(node.val);
          }
        }
      }
      if (jObj[jObj.length - 1] === ",") {
        jObj = jObj.substr(0, jObj.length - 2);
      }
      return jObj + "}";
    };
    function stringval(v) {
      if (v === true || v === false || !isNaN(v)) {
        return v;
      } else {
        return '"' + v + '"';
      }
    }
    exports.convertToJsonString = convertToJsonString;
  }
});

// node_modules/fast-xml-parser/src/json2xml.js
var require_json2xml = __commonJS({
  "node_modules/fast-xml-parser/src/json2xml.js"(exports, module2) {
    "use strict";
    var buildOptions = require_util().buildOptions;
    var defaultOptions = {
      attributeNamePrefix: "@_",
      attrNodeName: false,
      textNodeName: "#text",
      ignoreAttributes: true,
      cdataTagName: false,
      cdataPositionChar: "\\c",
      format: false,
      indentBy: "  ",
      supressEmptyNode: false,
      tagValueProcessor: function(a) {
        return a;
      },
      attrValueProcessor: function(a) {
        return a;
      }
    };
    var props = [
      "attributeNamePrefix",
      "attrNodeName",
      "textNodeName",
      "ignoreAttributes",
      "cdataTagName",
      "cdataPositionChar",
      "format",
      "indentBy",
      "supressEmptyNode",
      "tagValueProcessor",
      "attrValueProcessor"
    ];
    function Parser(options) {
      this.options = buildOptions(options, defaultOptions, props);
      if (this.options.ignoreAttributes || this.options.attrNodeName) {
        this.isAttribute = function() {
          return false;
        };
      } else {
        this.attrPrefixLen = this.options.attributeNamePrefix.length;
        this.isAttribute = isAttribute;
      }
      if (this.options.cdataTagName) {
        this.isCDATA = isCDATA;
      } else {
        this.isCDATA = function() {
          return false;
        };
      }
      this.replaceCDATAstr = replaceCDATAstr;
      this.replaceCDATAarr = replaceCDATAarr;
      if (this.options.format) {
        this.indentate = indentate;
        this.tagEndChar = ">\n";
        this.newLine = "\n";
      } else {
        this.indentate = function() {
          return "";
        };
        this.tagEndChar = ">";
        this.newLine = "";
      }
      if (this.options.supressEmptyNode) {
        this.buildTextNode = buildEmptyTextNode;
        this.buildObjNode = buildEmptyObjNode;
      } else {
        this.buildTextNode = buildTextValNode;
        this.buildObjNode = buildObjectNode;
      }
      this.buildTextValNode = buildTextValNode;
      this.buildObjectNode = buildObjectNode;
    }
    Parser.prototype.parse = function(jObj) {
      return this.j2x(jObj, 0).val;
    };
    Parser.prototype.j2x = function(jObj, level) {
      let attrStr = "";
      let val = "";
      const keys = Object.keys(jObj);
      const len = keys.length;
      for (let i2 = 0; i2 < len; i2++) {
        const key = keys[i2];
        if (typeof jObj[key] === "undefined") {
        } else if (jObj[key] === null) {
          val += this.indentate(level) + "<" + key + "/" + this.tagEndChar;
        } else if (jObj[key] instanceof Date) {
          val += this.buildTextNode(jObj[key], key, "", level);
        } else if (typeof jObj[key] !== "object") {
          const attr = this.isAttribute(key);
          if (attr) {
            attrStr += " " + attr + '="' + this.options.attrValueProcessor("" + jObj[key]) + '"';
          } else if (this.isCDATA(key)) {
            if (jObj[this.options.textNodeName]) {
              val += this.replaceCDATAstr(jObj[this.options.textNodeName], jObj[key]);
            } else {
              val += this.replaceCDATAstr("", jObj[key]);
            }
          } else {
            if (key === this.options.textNodeName) {
              if (jObj[this.options.cdataTagName]) {
              } else {
                val += this.options.tagValueProcessor("" + jObj[key]);
              }
            } else {
              val += this.buildTextNode(jObj[key], key, "", level);
            }
          }
        } else if (Array.isArray(jObj[key])) {
          if (this.isCDATA(key)) {
            val += this.indentate(level);
            if (jObj[this.options.textNodeName]) {
              val += this.replaceCDATAarr(jObj[this.options.textNodeName], jObj[key]);
            } else {
              val += this.replaceCDATAarr("", jObj[key]);
            }
          } else {
            const arrLen = jObj[key].length;
            for (let j = 0; j < arrLen; j++) {
              const item = jObj[key][j];
              if (typeof item === "undefined") {
              } else if (item === null) {
                val += this.indentate(level) + "<" + key + "/" + this.tagEndChar;
              } else if (typeof item === "object") {
                const result = this.j2x(item, level + 1);
                val += this.buildObjNode(result.val, key, result.attrStr, level);
              } else {
                val += this.buildTextNode(item, key, "", level);
              }
            }
          }
        } else {
          if (this.options.attrNodeName && key === this.options.attrNodeName) {
            const Ks = Object.keys(jObj[key]);
            const L = Ks.length;
            for (let j = 0; j < L; j++) {
              attrStr += " " + Ks[j] + '="' + this.options.attrValueProcessor("" + jObj[key][Ks[j]]) + '"';
            }
          } else {
            const result = this.j2x(jObj[key], level + 1);
            val += this.buildObjNode(result.val, key, result.attrStr, level);
          }
        }
      }
      return { attrStr, val };
    };
    function replaceCDATAstr(str, cdata) {
      str = this.options.tagValueProcessor("" + str);
      if (this.options.cdataPositionChar === "" || str === "") {
        return str + "<![CDATA[" + cdata + "]]" + this.tagEndChar;
      } else {
        return str.replace(this.options.cdataPositionChar, "<![CDATA[" + cdata + "]]" + this.tagEndChar);
      }
    }
    function replaceCDATAarr(str, cdata) {
      str = this.options.tagValueProcessor("" + str);
      if (this.options.cdataPositionChar === "" || str === "") {
        return str + "<![CDATA[" + cdata.join("]]><![CDATA[") + "]]" + this.tagEndChar;
      } else {
        for (let v in cdata) {
          str = str.replace(this.options.cdataPositionChar, "<![CDATA[" + cdata[v] + "]]>");
        }
        return str + this.newLine;
      }
    }
    function buildObjectNode(val, key, attrStr, level) {
      if (attrStr && !val.includes("<")) {
        return this.indentate(level) + "<" + key + attrStr + ">" + val + "</" + key + this.tagEndChar;
      } else {
        return this.indentate(level) + "<" + key + attrStr + this.tagEndChar + val + this.indentate(level) + "</" + key + this.tagEndChar;
      }
    }
    function buildEmptyObjNode(val, key, attrStr, level) {
      if (val !== "") {
        return this.buildObjectNode(val, key, attrStr, level);
      } else {
        return this.indentate(level) + "<" + key + attrStr + "/" + this.tagEndChar;
      }
    }
    function buildTextValNode(val, key, attrStr, level) {
      return this.indentate(level) + "<" + key + attrStr + ">" + this.options.tagValueProcessor(val) + "</" + key + this.tagEndChar;
    }
    function buildEmptyTextNode(val, key, attrStr, level) {
      if (val !== "") {
        return this.buildTextValNode(val, key, attrStr, level);
      } else {
        return this.indentate(level) + "<" + key + attrStr + "/" + this.tagEndChar;
      }
    }
    function indentate(level) {
      return this.options.indentBy.repeat(level);
    }
    function isAttribute(name) {
      if (name.startsWith(this.options.attributeNamePrefix)) {
        return name.substr(this.attrPrefixLen);
      } else {
        return false;
      }
    }
    function isCDATA(name) {
      return name === this.options.cdataTagName;
    }
    module2.exports = Parser;
  }
});

// node_modules/fast-xml-parser/src/parser.js
var require_parser = __commonJS({
  "node_modules/fast-xml-parser/src/parser.js"(exports) {
    "use strict";
    var nodeToJson = require_node2json();
    var xmlToNodeobj = require_xmlstr2xmlnode();
    var x2xmlnode = require_xmlstr2xmlnode();
    var buildOptions = require_util().buildOptions;
    var validator = require_validator();
    exports.parse = function(xmlData, options, validationOption) {
      if (validationOption) {
        if (validationOption === true)
          validationOption = {};
        const result = validator.validate(xmlData, validationOption);
        if (result !== true) {
          throw Error(result.err.msg);
        }
      }
      options = buildOptions(options, x2xmlnode.defaultOptions, x2xmlnode.props);
      const traversableObj = xmlToNodeobj.getTraversalObj(xmlData, options);
      return nodeToJson.convertToJson(traversableObj, options);
    };
    exports.convertTonimn = require_nimndata().convert2nimn;
    exports.getTraversalObj = xmlToNodeobj.getTraversalObj;
    exports.convertToJson = nodeToJson.convertToJson;
    exports.convertToJsonString = require_node2json_str().convertToJsonString;
    exports.validate = validator.validate;
    exports.j2xParser = require_json2xml();
    exports.parseToNimn = function(xmlData, schema, options) {
      return exports.convertTonimn(exports.getTraversalObj(xmlData, options), schema, options);
    };
  }
});

// node_modules/@aws-sdk/client-sts/dist-cjs/protocols/Aws_query.js
var require_Aws_query = __commonJS({
  "node_modules/@aws-sdk/client-sts/dist-cjs/protocols/Aws_query.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.deserializeAws_queryGetSessionTokenCommand = exports.deserializeAws_queryGetFederationTokenCommand = exports.deserializeAws_queryGetCallerIdentityCommand = exports.deserializeAws_queryGetAccessKeyInfoCommand = exports.deserializeAws_queryDecodeAuthorizationMessageCommand = exports.deserializeAws_queryAssumeRoleWithWebIdentityCommand = exports.deserializeAws_queryAssumeRoleWithSAMLCommand = exports.deserializeAws_queryAssumeRoleCommand = exports.serializeAws_queryGetSessionTokenCommand = exports.serializeAws_queryGetFederationTokenCommand = exports.serializeAws_queryGetCallerIdentityCommand = exports.serializeAws_queryGetAccessKeyInfoCommand = exports.serializeAws_queryDecodeAuthorizationMessageCommand = exports.serializeAws_queryAssumeRoleWithWebIdentityCommand = exports.serializeAws_queryAssumeRoleWithSAMLCommand = exports.serializeAws_queryAssumeRoleCommand = void 0;
    var protocol_http_1 = require_dist_cjs4();
    var smithy_client_1 = require_dist_cjs3();
    var entities_1 = require_lib();
    var fast_xml_parser_1 = require_parser();
    var models_0_1 = require_models_02();
    var STSServiceException_1 = require_STSServiceException();
    var serializeAws_queryAssumeRoleCommand = async (input, context) => {
      const headers = {
        "content-type": "application/x-www-form-urlencoded"
      };
      let body;
      body = buildFormUrlencodedString({
        ...serializeAws_queryAssumeRoleRequest(input, context),
        Action: "AssumeRole",
        Version: "2011-06-15"
      });
      return buildHttpRpcRequest(context, headers, "/", void 0, body);
    };
    exports.serializeAws_queryAssumeRoleCommand = serializeAws_queryAssumeRoleCommand;
    var serializeAws_queryAssumeRoleWithSAMLCommand = async (input, context) => {
      const headers = {
        "content-type": "application/x-www-form-urlencoded"
      };
      let body;
      body = buildFormUrlencodedString({
        ...serializeAws_queryAssumeRoleWithSAMLRequest(input, context),
        Action: "AssumeRoleWithSAML",
        Version: "2011-06-15"
      });
      return buildHttpRpcRequest(context, headers, "/", void 0, body);
    };
    exports.serializeAws_queryAssumeRoleWithSAMLCommand = serializeAws_queryAssumeRoleWithSAMLCommand;
    var serializeAws_queryAssumeRoleWithWebIdentityCommand = async (input, context) => {
      const headers = {
        "content-type": "application/x-www-form-urlencoded"
      };
      let body;
      body = buildFormUrlencodedString({
        ...serializeAws_queryAssumeRoleWithWebIdentityRequest(input, context),
        Action: "AssumeRoleWithWebIdentity",
        Version: "2011-06-15"
      });
      return buildHttpRpcRequest(context, headers, "/", void 0, body);
    };
    exports.serializeAws_queryAssumeRoleWithWebIdentityCommand = serializeAws_queryAssumeRoleWithWebIdentityCommand;
    var serializeAws_queryDecodeAuthorizationMessageCommand = async (input, context) => {
      const headers = {
        "content-type": "application/x-www-form-urlencoded"
      };
      let body;
      body = buildFormUrlencodedString({
        ...serializeAws_queryDecodeAuthorizationMessageRequest(input, context),
        Action: "DecodeAuthorizationMessage",
        Version: "2011-06-15"
      });
      return buildHttpRpcRequest(context, headers, "/", void 0, body);
    };
    exports.serializeAws_queryDecodeAuthorizationMessageCommand = serializeAws_queryDecodeAuthorizationMessageCommand;
    var serializeAws_queryGetAccessKeyInfoCommand = async (input, context) => {
      const headers = {
        "content-type": "application/x-www-form-urlencoded"
      };
      let body;
      body = buildFormUrlencodedString({
        ...serializeAws_queryGetAccessKeyInfoRequest(input, context),
        Action: "GetAccessKeyInfo",
        Version: "2011-06-15"
      });
      return buildHttpRpcRequest(context, headers, "/", void 0, body);
    };
    exports.serializeAws_queryGetAccessKeyInfoCommand = serializeAws_queryGetAccessKeyInfoCommand;
    var serializeAws_queryGetCallerIdentityCommand = async (input, context) => {
      const headers = {
        "content-type": "application/x-www-form-urlencoded"
      };
      let body;
      body = buildFormUrlencodedString({
        ...serializeAws_queryGetCallerIdentityRequest(input, context),
        Action: "GetCallerIdentity",
        Version: "2011-06-15"
      });
      return buildHttpRpcRequest(context, headers, "/", void 0, body);
    };
    exports.serializeAws_queryGetCallerIdentityCommand = serializeAws_queryGetCallerIdentityCommand;
    var serializeAws_queryGetFederationTokenCommand = async (input, context) => {
      const headers = {
        "content-type": "application/x-www-form-urlencoded"
      };
      let body;
      body = buildFormUrlencodedString({
        ...serializeAws_queryGetFederationTokenRequest(input, context),
        Action: "GetFederationToken",
        Version: "2011-06-15"
      });
      return buildHttpRpcRequest(context, headers, "/", void 0, body);
    };
    exports.serializeAws_queryGetFederationTokenCommand = serializeAws_queryGetFederationTokenCommand;
    var serializeAws_queryGetSessionTokenCommand = async (input, context) => {
      const headers = {
        "content-type": "application/x-www-form-urlencoded"
      };
      let body;
      body = buildFormUrlencodedString({
        ...serializeAws_queryGetSessionTokenRequest(input, context),
        Action: "GetSessionToken",
        Version: "2011-06-15"
      });
      return buildHttpRpcRequest(context, headers, "/", void 0, body);
    };
    exports.serializeAws_queryGetSessionTokenCommand = serializeAws_queryGetSessionTokenCommand;
    var deserializeAws_queryAssumeRoleCommand = async (output, context) => {
      if (output.statusCode >= 300) {
        return deserializeAws_queryAssumeRoleCommandError(output, context);
      }
      const data = await parseBody(output.body, context);
      let contents = {};
      contents = deserializeAws_queryAssumeRoleResponse(data.AssumeRoleResult, context);
      const response = {
        $metadata: deserializeMetadata(output),
        ...contents
      };
      return Promise.resolve(response);
    };
    exports.deserializeAws_queryAssumeRoleCommand = deserializeAws_queryAssumeRoleCommand;
    var deserializeAws_queryAssumeRoleCommandError = async (output, context) => {
      const parsedOutput = {
        ...output,
        body: await parseBody(output.body, context)
      };
      let response;
      let errorCode = "UnknownError";
      errorCode = loadQueryErrorCode(output, parsedOutput.body);
      switch (errorCode) {
        case "ExpiredTokenException":
        case "com.amazonaws.sts#ExpiredTokenException":
          throw await deserializeAws_queryExpiredTokenExceptionResponse(parsedOutput, context);
        case "MalformedPolicyDocumentException":
        case "com.amazonaws.sts#MalformedPolicyDocumentException":
          throw await deserializeAws_queryMalformedPolicyDocumentExceptionResponse(parsedOutput, context);
        case "PackedPolicyTooLargeException":
        case "com.amazonaws.sts#PackedPolicyTooLargeException":
          throw await deserializeAws_queryPackedPolicyTooLargeExceptionResponse(parsedOutput, context);
        case "RegionDisabledException":
        case "com.amazonaws.sts#RegionDisabledException":
          throw await deserializeAws_queryRegionDisabledExceptionResponse(parsedOutput, context);
        default:
          const parsedBody = parsedOutput.body;
          response = new STSServiceException_1.STSServiceException({
            name: parsedBody.Error.code || parsedBody.Error.Code || errorCode,
            $fault: "client",
            $metadata: deserializeMetadata(output)
          });
          throw (0, smithy_client_1.decorateServiceException)(response, parsedBody.Error);
      }
    };
    var deserializeAws_queryAssumeRoleWithSAMLCommand = async (output, context) => {
      if (output.statusCode >= 300) {
        return deserializeAws_queryAssumeRoleWithSAMLCommandError(output, context);
      }
      const data = await parseBody(output.body, context);
      let contents = {};
      contents = deserializeAws_queryAssumeRoleWithSAMLResponse(data.AssumeRoleWithSAMLResult, context);
      const response = {
        $metadata: deserializeMetadata(output),
        ...contents
      };
      return Promise.resolve(response);
    };
    exports.deserializeAws_queryAssumeRoleWithSAMLCommand = deserializeAws_queryAssumeRoleWithSAMLCommand;
    var deserializeAws_queryAssumeRoleWithSAMLCommandError = async (output, context) => {
      const parsedOutput = {
        ...output,
        body: await parseBody(output.body, context)
      };
      let response;
      let errorCode = "UnknownError";
      errorCode = loadQueryErrorCode(output, parsedOutput.body);
      switch (errorCode) {
        case "ExpiredTokenException":
        case "com.amazonaws.sts#ExpiredTokenException":
          throw await deserializeAws_queryExpiredTokenExceptionResponse(parsedOutput, context);
        case "IDPRejectedClaimException":
        case "com.amazonaws.sts#IDPRejectedClaimException":
          throw await deserializeAws_queryIDPRejectedClaimExceptionResponse(parsedOutput, context);
        case "InvalidIdentityTokenException":
        case "com.amazonaws.sts#InvalidIdentityTokenException":
          throw await deserializeAws_queryInvalidIdentityTokenExceptionResponse(parsedOutput, context);
        case "MalformedPolicyDocumentException":
        case "com.amazonaws.sts#MalformedPolicyDocumentException":
          throw await deserializeAws_queryMalformedPolicyDocumentExceptionResponse(parsedOutput, context);
        case "PackedPolicyTooLargeException":
        case "com.amazonaws.sts#PackedPolicyTooLargeException":
          throw await deserializeAws_queryPackedPolicyTooLargeExceptionResponse(parsedOutput, context);
        case "RegionDisabledException":
        case "com.amazonaws.sts#RegionDisabledException":
          throw await deserializeAws_queryRegionDisabledExceptionResponse(parsedOutput, context);
        default:
          const parsedBody = parsedOutput.body;
          response = new STSServiceException_1.STSServiceException({
            name: parsedBody.Error.code || parsedBody.Error.Code || errorCode,
            $fault: "client",
            $metadata: deserializeMetadata(output)
          });
          throw (0, smithy_client_1.decorateServiceException)(response, parsedBody.Error);
      }
    };
    var deserializeAws_queryAssumeRoleWithWebIdentityCommand = async (output, context) => {
      if (output.statusCode >= 300) {
        return deserializeAws_queryAssumeRoleWithWebIdentityCommandError(output, context);
      }
      const data = await parseBody(output.body, context);
      let contents = {};
      contents = deserializeAws_queryAssumeRoleWithWebIdentityResponse(data.AssumeRoleWithWebIdentityResult, context);
      const response = {
        $metadata: deserializeMetadata(output),
        ...contents
      };
      return Promise.resolve(response);
    };
    exports.deserializeAws_queryAssumeRoleWithWebIdentityCommand = deserializeAws_queryAssumeRoleWithWebIdentityCommand;
    var deserializeAws_queryAssumeRoleWithWebIdentityCommandError = async (output, context) => {
      const parsedOutput = {
        ...output,
        body: await parseBody(output.body, context)
      };
      let response;
      let errorCode = "UnknownError";
      errorCode = loadQueryErrorCode(output, parsedOutput.body);
      switch (errorCode) {
        case "ExpiredTokenException":
        case "com.amazonaws.sts#ExpiredTokenException":
          throw await deserializeAws_queryExpiredTokenExceptionResponse(parsedOutput, context);
        case "IDPCommunicationErrorException":
        case "com.amazonaws.sts#IDPCommunicationErrorException":
          throw await deserializeAws_queryIDPCommunicationErrorExceptionResponse(parsedOutput, context);
        case "IDPRejectedClaimException":
        case "com.amazonaws.sts#IDPRejectedClaimException":
          throw await deserializeAws_queryIDPRejectedClaimExceptionResponse(parsedOutput, context);
        case "InvalidIdentityTokenException":
        case "com.amazonaws.sts#InvalidIdentityTokenException":
          throw await deserializeAws_queryInvalidIdentityTokenExceptionResponse(parsedOutput, context);
        case "MalformedPolicyDocumentException":
        case "com.amazonaws.sts#MalformedPolicyDocumentException":
          throw await deserializeAws_queryMalformedPolicyDocumentExceptionResponse(parsedOutput, context);
        case "PackedPolicyTooLargeException":
        case "com.amazonaws.sts#PackedPolicyTooLargeException":
          throw await deserializeAws_queryPackedPolicyTooLargeExceptionResponse(parsedOutput, context);
        case "RegionDisabledException":
        case "com.amazonaws.sts#RegionDisabledException":
          throw await deserializeAws_queryRegionDisabledExceptionResponse(parsedOutput, context);
        default:
          const parsedBody = parsedOutput.body;
          response = new STSServiceException_1.STSServiceException({
            name: parsedBody.Error.code || parsedBody.Error.Code || errorCode,
            $fault: "client",
            $metadata: deserializeMetadata(output)
          });
          throw (0, smithy_client_1.decorateServiceException)(response, parsedBody.Error);
      }
    };
    var deserializeAws_queryDecodeAuthorizationMessageCommand = async (output, context) => {
      if (output.statusCode >= 300) {
        return deserializeAws_queryDecodeAuthorizationMessageCommandError(output, context);
      }
      const data = await parseBody(output.body, context);
      let contents = {};
      contents = deserializeAws_queryDecodeAuthorizationMessageResponse(data.DecodeAuthorizationMessageResult, context);
      const response = {
        $metadata: deserializeMetadata(output),
        ...contents
      };
      return Promise.resolve(response);
    };
    exports.deserializeAws_queryDecodeAuthorizationMessageCommand = deserializeAws_queryDecodeAuthorizationMessageCommand;
    var deserializeAws_queryDecodeAuthorizationMessageCommandError = async (output, context) => {
      const parsedOutput = {
        ...output,
        body: await parseBody(output.body, context)
      };
      let response;
      let errorCode = "UnknownError";
      errorCode = loadQueryErrorCode(output, parsedOutput.body);
      switch (errorCode) {
        case "InvalidAuthorizationMessageException":
        case "com.amazonaws.sts#InvalidAuthorizationMessageException":
          throw await deserializeAws_queryInvalidAuthorizationMessageExceptionResponse(parsedOutput, context);
        default:
          const parsedBody = parsedOutput.body;
          response = new STSServiceException_1.STSServiceException({
            name: parsedBody.Error.code || parsedBody.Error.Code || errorCode,
            $fault: "client",
            $metadata: deserializeMetadata(output)
          });
          throw (0, smithy_client_1.decorateServiceException)(response, parsedBody.Error);
      }
    };
    var deserializeAws_queryGetAccessKeyInfoCommand = async (output, context) => {
      if (output.statusCode >= 300) {
        return deserializeAws_queryGetAccessKeyInfoCommandError(output, context);
      }
      const data = await parseBody(output.body, context);
      let contents = {};
      contents = deserializeAws_queryGetAccessKeyInfoResponse(data.GetAccessKeyInfoResult, context);
      const response = {
        $metadata: deserializeMetadata(output),
        ...contents
      };
      return Promise.resolve(response);
    };
    exports.deserializeAws_queryGetAccessKeyInfoCommand = deserializeAws_queryGetAccessKeyInfoCommand;
    var deserializeAws_queryGetAccessKeyInfoCommandError = async (output, context) => {
      const parsedOutput = {
        ...output,
        body: await parseBody(output.body, context)
      };
      let response;
      let errorCode = "UnknownError";
      errorCode = loadQueryErrorCode(output, parsedOutput.body);
      switch (errorCode) {
        default:
          const parsedBody = parsedOutput.body;
          response = new STSServiceException_1.STSServiceException({
            name: parsedBody.Error.code || parsedBody.Error.Code || errorCode,
            $fault: "client",
            $metadata: deserializeMetadata(output)
          });
          throw (0, smithy_client_1.decorateServiceException)(response, parsedBody.Error);
      }
    };
    var deserializeAws_queryGetCallerIdentityCommand = async (output, context) => {
      if (output.statusCode >= 300) {
        return deserializeAws_queryGetCallerIdentityCommandError(output, context);
      }
      const data = await parseBody(output.body, context);
      let contents = {};
      contents = deserializeAws_queryGetCallerIdentityResponse(data.GetCallerIdentityResult, context);
      const response = {
        $metadata: deserializeMetadata(output),
        ...contents
      };
      return Promise.resolve(response);
    };
    exports.deserializeAws_queryGetCallerIdentityCommand = deserializeAws_queryGetCallerIdentityCommand;
    var deserializeAws_queryGetCallerIdentityCommandError = async (output, context) => {
      const parsedOutput = {
        ...output,
        body: await parseBody(output.body, context)
      };
      let response;
      let errorCode = "UnknownError";
      errorCode = loadQueryErrorCode(output, parsedOutput.body);
      switch (errorCode) {
        default:
          const parsedBody = parsedOutput.body;
          response = new STSServiceException_1.STSServiceException({
            name: parsedBody.Error.code || parsedBody.Error.Code || errorCode,
            $fault: "client",
            $metadata: deserializeMetadata(output)
          });
          throw (0, smithy_client_1.decorateServiceException)(response, parsedBody.Error);
      }
    };
    var deserializeAws_queryGetFederationTokenCommand = async (output, context) => {
      if (output.statusCode >= 300) {
        return deserializeAws_queryGetFederationTokenCommandError(output, context);
      }
      const data = await parseBody(output.body, context);
      let contents = {};
      contents = deserializeAws_queryGetFederationTokenResponse(data.GetFederationTokenResult, context);
      const response = {
        $metadata: deserializeMetadata(output),
        ...contents
      };
      return Promise.resolve(response);
    };
    exports.deserializeAws_queryGetFederationTokenCommand = deserializeAws_queryGetFederationTokenCommand;
    var deserializeAws_queryGetFederationTokenCommandError = async (output, context) => {
      const parsedOutput = {
        ...output,
        body: await parseBody(output.body, context)
      };
      let response;
      let errorCode = "UnknownError";
      errorCode = loadQueryErrorCode(output, parsedOutput.body);
      switch (errorCode) {
        case "MalformedPolicyDocumentException":
        case "com.amazonaws.sts#MalformedPolicyDocumentException":
          throw await deserializeAws_queryMalformedPolicyDocumentExceptionResponse(parsedOutput, context);
        case "PackedPolicyTooLargeException":
        case "com.amazonaws.sts#PackedPolicyTooLargeException":
          throw await deserializeAws_queryPackedPolicyTooLargeExceptionResponse(parsedOutput, context);
        case "RegionDisabledException":
        case "com.amazonaws.sts#RegionDisabledException":
          throw await deserializeAws_queryRegionDisabledExceptionResponse(parsedOutput, context);
        default:
          const parsedBody = parsedOutput.body;
          response = new STSServiceException_1.STSServiceException({
            name: parsedBody.Error.code || parsedBody.Error.Code || errorCode,
            $fault: "client",
            $metadata: deserializeMetadata(output)
          });
          throw (0, smithy_client_1.decorateServiceException)(response, parsedBody.Error);
      }
    };
    var deserializeAws_queryGetSessionTokenCommand = async (output, context) => {
      if (output.statusCode >= 300) {
        return deserializeAws_queryGetSessionTokenCommandError(output, context);
      }
      const data = await parseBody(output.body, context);
      let contents = {};
      contents = deserializeAws_queryGetSessionTokenResponse(data.GetSessionTokenResult, context);
      const response = {
        $metadata: deserializeMetadata(output),
        ...contents
      };
      return Promise.resolve(response);
    };
    exports.deserializeAws_queryGetSessionTokenCommand = deserializeAws_queryGetSessionTokenCommand;
    var deserializeAws_queryGetSessionTokenCommandError = async (output, context) => {
      const parsedOutput = {
        ...output,
        body: await parseBody(output.body, context)
      };
      let response;
      let errorCode = "UnknownError";
      errorCode = loadQueryErrorCode(output, parsedOutput.body);
      switch (errorCode) {
        case "RegionDisabledException":
        case "com.amazonaws.sts#RegionDisabledException":
          throw await deserializeAws_queryRegionDisabledExceptionResponse(parsedOutput, context);
        default:
          const parsedBody = parsedOutput.body;
          response = new STSServiceException_1.STSServiceException({
            name: parsedBody.Error.code || parsedBody.Error.Code || errorCode,
            $fault: "client",
            $metadata: deserializeMetadata(output)
          });
          throw (0, smithy_client_1.decorateServiceException)(response, parsedBody.Error);
      }
    };
    var deserializeAws_queryExpiredTokenExceptionResponse = async (parsedOutput, context) => {
      const body = parsedOutput.body;
      const deserialized = deserializeAws_queryExpiredTokenException(body.Error, context);
      const exception = new models_0_1.ExpiredTokenException({
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized
      });
      return (0, smithy_client_1.decorateServiceException)(exception, body);
    };
    var deserializeAws_queryIDPCommunicationErrorExceptionResponse = async (parsedOutput, context) => {
      const body = parsedOutput.body;
      const deserialized = deserializeAws_queryIDPCommunicationErrorException(body.Error, context);
      const exception = new models_0_1.IDPCommunicationErrorException({
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized
      });
      return (0, smithy_client_1.decorateServiceException)(exception, body);
    };
    var deserializeAws_queryIDPRejectedClaimExceptionResponse = async (parsedOutput, context) => {
      const body = parsedOutput.body;
      const deserialized = deserializeAws_queryIDPRejectedClaimException(body.Error, context);
      const exception = new models_0_1.IDPRejectedClaimException({
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized
      });
      return (0, smithy_client_1.decorateServiceException)(exception, body);
    };
    var deserializeAws_queryInvalidAuthorizationMessageExceptionResponse = async (parsedOutput, context) => {
      const body = parsedOutput.body;
      const deserialized = deserializeAws_queryInvalidAuthorizationMessageException(body.Error, context);
      const exception = new models_0_1.InvalidAuthorizationMessageException({
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized
      });
      return (0, smithy_client_1.decorateServiceException)(exception, body);
    };
    var deserializeAws_queryInvalidIdentityTokenExceptionResponse = async (parsedOutput, context) => {
      const body = parsedOutput.body;
      const deserialized = deserializeAws_queryInvalidIdentityTokenException(body.Error, context);
      const exception = new models_0_1.InvalidIdentityTokenException({
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized
      });
      return (0, smithy_client_1.decorateServiceException)(exception, body);
    };
    var deserializeAws_queryMalformedPolicyDocumentExceptionResponse = async (parsedOutput, context) => {
      const body = parsedOutput.body;
      const deserialized = deserializeAws_queryMalformedPolicyDocumentException(body.Error, context);
      const exception = new models_0_1.MalformedPolicyDocumentException({
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized
      });
      return (0, smithy_client_1.decorateServiceException)(exception, body);
    };
    var deserializeAws_queryPackedPolicyTooLargeExceptionResponse = async (parsedOutput, context) => {
      const body = parsedOutput.body;
      const deserialized = deserializeAws_queryPackedPolicyTooLargeException(body.Error, context);
      const exception = new models_0_1.PackedPolicyTooLargeException({
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized
      });
      return (0, smithy_client_1.decorateServiceException)(exception, body);
    };
    var deserializeAws_queryRegionDisabledExceptionResponse = async (parsedOutput, context) => {
      const body = parsedOutput.body;
      const deserialized = deserializeAws_queryRegionDisabledException(body.Error, context);
      const exception = new models_0_1.RegionDisabledException({
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized
      });
      return (0, smithy_client_1.decorateServiceException)(exception, body);
    };
    var serializeAws_queryAssumeRoleRequest = (input, context) => {
      const entries = {};
      if (input.RoleArn !== void 0 && input.RoleArn !== null) {
        entries["RoleArn"] = input.RoleArn;
      }
      if (input.RoleSessionName !== void 0 && input.RoleSessionName !== null) {
        entries["RoleSessionName"] = input.RoleSessionName;
      }
      if (input.PolicyArns !== void 0 && input.PolicyArns !== null) {
        const memberEntries = serializeAws_querypolicyDescriptorListType(input.PolicyArns, context);
        Object.entries(memberEntries).forEach(([key, value]) => {
          const loc = `PolicyArns.${key}`;
          entries[loc] = value;
        });
      }
      if (input.Policy !== void 0 && input.Policy !== null) {
        entries["Policy"] = input.Policy;
      }
      if (input.DurationSeconds !== void 0 && input.DurationSeconds !== null) {
        entries["DurationSeconds"] = input.DurationSeconds;
      }
      if (input.Tags !== void 0 && input.Tags !== null) {
        const memberEntries = serializeAws_querytagListType(input.Tags, context);
        Object.entries(memberEntries).forEach(([key, value]) => {
          const loc = `Tags.${key}`;
          entries[loc] = value;
        });
      }
      if (input.TransitiveTagKeys !== void 0 && input.TransitiveTagKeys !== null) {
        const memberEntries = serializeAws_querytagKeyListType(input.TransitiveTagKeys, context);
        Object.entries(memberEntries).forEach(([key, value]) => {
          const loc = `TransitiveTagKeys.${key}`;
          entries[loc] = value;
        });
      }
      if (input.ExternalId !== void 0 && input.ExternalId !== null) {
        entries["ExternalId"] = input.ExternalId;
      }
      if (input.SerialNumber !== void 0 && input.SerialNumber !== null) {
        entries["SerialNumber"] = input.SerialNumber;
      }
      if (input.TokenCode !== void 0 && input.TokenCode !== null) {
        entries["TokenCode"] = input.TokenCode;
      }
      if (input.SourceIdentity !== void 0 && input.SourceIdentity !== null) {
        entries["SourceIdentity"] = input.SourceIdentity;
      }
      return entries;
    };
    var serializeAws_queryAssumeRoleWithSAMLRequest = (input, context) => {
      const entries = {};
      if (input.RoleArn !== void 0 && input.RoleArn !== null) {
        entries["RoleArn"] = input.RoleArn;
      }
      if (input.PrincipalArn !== void 0 && input.PrincipalArn !== null) {
        entries["PrincipalArn"] = input.PrincipalArn;
      }
      if (input.SAMLAssertion !== void 0 && input.SAMLAssertion !== null) {
        entries["SAMLAssertion"] = input.SAMLAssertion;
      }
      if (input.PolicyArns !== void 0 && input.PolicyArns !== null) {
        const memberEntries = serializeAws_querypolicyDescriptorListType(input.PolicyArns, context);
        Object.entries(memberEntries).forEach(([key, value]) => {
          const loc = `PolicyArns.${key}`;
          entries[loc] = value;
        });
      }
      if (input.Policy !== void 0 && input.Policy !== null) {
        entries["Policy"] = input.Policy;
      }
      if (input.DurationSeconds !== void 0 && input.DurationSeconds !== null) {
        entries["DurationSeconds"] = input.DurationSeconds;
      }
      return entries;
    };
    var serializeAws_queryAssumeRoleWithWebIdentityRequest = (input, context) => {
      const entries = {};
      if (input.RoleArn !== void 0 && input.RoleArn !== null) {
        entries["RoleArn"] = input.RoleArn;
      }
      if (input.RoleSessionName !== void 0 && input.RoleSessionName !== null) {
        entries["RoleSessionName"] = input.RoleSessionName;
      }
      if (input.WebIdentityToken !== void 0 && input.WebIdentityToken !== null) {
        entries["WebIdentityToken"] = input.WebIdentityToken;
      }
      if (input.ProviderId !== void 0 && input.ProviderId !== null) {
        entries["ProviderId"] = input.ProviderId;
      }
      if (input.PolicyArns !== void 0 && input.PolicyArns !== null) {
        const memberEntries = serializeAws_querypolicyDescriptorListType(input.PolicyArns, context);
        Object.entries(memberEntries).forEach(([key, value]) => {
          const loc = `PolicyArns.${key}`;
          entries[loc] = value;
        });
      }
      if (input.Policy !== void 0 && input.Policy !== null) {
        entries["Policy"] = input.Policy;
      }
      if (input.DurationSeconds !== void 0 && input.DurationSeconds !== null) {
        entries["DurationSeconds"] = input.DurationSeconds;
      }
      return entries;
    };
    var serializeAws_queryDecodeAuthorizationMessageRequest = (input, context) => {
      const entries = {};
      if (input.EncodedMessage !== void 0 && input.EncodedMessage !== null) {
        entries["EncodedMessage"] = input.EncodedMessage;
      }
      return entries;
    };
    var serializeAws_queryGetAccessKeyInfoRequest = (input, context) => {
      const entries = {};
      if (input.AccessKeyId !== void 0 && input.AccessKeyId !== null) {
        entries["AccessKeyId"] = input.AccessKeyId;
      }
      return entries;
    };
    var serializeAws_queryGetCallerIdentityRequest = (input, context) => {
      const entries = {};
      return entries;
    };
    var serializeAws_queryGetFederationTokenRequest = (input, context) => {
      const entries = {};
      if (input.Name !== void 0 && input.Name !== null) {
        entries["Name"] = input.Name;
      }
      if (input.Policy !== void 0 && input.Policy !== null) {
        entries["Policy"] = input.Policy;
      }
      if (input.PolicyArns !== void 0 && input.PolicyArns !== null) {
        const memberEntries = serializeAws_querypolicyDescriptorListType(input.PolicyArns, context);
        Object.entries(memberEntries).forEach(([key, value]) => {
          const loc = `PolicyArns.${key}`;
          entries[loc] = value;
        });
      }
      if (input.DurationSeconds !== void 0 && input.DurationSeconds !== null) {
        entries["DurationSeconds"] = input.DurationSeconds;
      }
      if (input.Tags !== void 0 && input.Tags !== null) {
        const memberEntries = serializeAws_querytagListType(input.Tags, context);
        Object.entries(memberEntries).forEach(([key, value]) => {
          const loc = `Tags.${key}`;
          entries[loc] = value;
        });
      }
      return entries;
    };
    var serializeAws_queryGetSessionTokenRequest = (input, context) => {
      const entries = {};
      if (input.DurationSeconds !== void 0 && input.DurationSeconds !== null) {
        entries["DurationSeconds"] = input.DurationSeconds;
      }
      if (input.SerialNumber !== void 0 && input.SerialNumber !== null) {
        entries["SerialNumber"] = input.SerialNumber;
      }
      if (input.TokenCode !== void 0 && input.TokenCode !== null) {
        entries["TokenCode"] = input.TokenCode;
      }
      return entries;
    };
    var serializeAws_querypolicyDescriptorListType = (input, context) => {
      const entries = {};
      let counter = 1;
      for (const entry of input) {
        if (entry === null) {
          continue;
        }
        const memberEntries = serializeAws_queryPolicyDescriptorType(entry, context);
        Object.entries(memberEntries).forEach(([key, value]) => {
          entries[`member.${counter}.${key}`] = value;
        });
        counter++;
      }
      return entries;
    };
    var serializeAws_queryPolicyDescriptorType = (input, context) => {
      const entries = {};
      if (input.arn !== void 0 && input.arn !== null) {
        entries["arn"] = input.arn;
      }
      return entries;
    };
    var serializeAws_queryTag = (input, context) => {
      const entries = {};
      if (input.Key !== void 0 && input.Key !== null) {
        entries["Key"] = input.Key;
      }
      if (input.Value !== void 0 && input.Value !== null) {
        entries["Value"] = input.Value;
      }
      return entries;
    };
    var serializeAws_querytagKeyListType = (input, context) => {
      const entries = {};
      let counter = 1;
      for (const entry of input) {
        if (entry === null) {
          continue;
        }
        entries[`member.${counter}`] = entry;
        counter++;
      }
      return entries;
    };
    var serializeAws_querytagListType = (input, context) => {
      const entries = {};
      let counter = 1;
      for (const entry of input) {
        if (entry === null) {
          continue;
        }
        const memberEntries = serializeAws_queryTag(entry, context);
        Object.entries(memberEntries).forEach(([key, value]) => {
          entries[`member.${counter}.${key}`] = value;
        });
        counter++;
      }
      return entries;
    };
    var deserializeAws_queryAssumedRoleUser = (output, context) => {
      const contents = {
        AssumedRoleId: void 0,
        Arn: void 0
      };
      if (output["AssumedRoleId"] !== void 0) {
        contents.AssumedRoleId = (0, smithy_client_1.expectString)(output["AssumedRoleId"]);
      }
      if (output["Arn"] !== void 0) {
        contents.Arn = (0, smithy_client_1.expectString)(output["Arn"]);
      }
      return contents;
    };
    var deserializeAws_queryAssumeRoleResponse = (output, context) => {
      const contents = {
        Credentials: void 0,
        AssumedRoleUser: void 0,
        PackedPolicySize: void 0,
        SourceIdentity: void 0
      };
      if (output["Credentials"] !== void 0) {
        contents.Credentials = deserializeAws_queryCredentials(output["Credentials"], context);
      }
      if (output["AssumedRoleUser"] !== void 0) {
        contents.AssumedRoleUser = deserializeAws_queryAssumedRoleUser(output["AssumedRoleUser"], context);
      }
      if (output["PackedPolicySize"] !== void 0) {
        contents.PackedPolicySize = (0, smithy_client_1.strictParseInt32)(output["PackedPolicySize"]);
      }
      if (output["SourceIdentity"] !== void 0) {
        contents.SourceIdentity = (0, smithy_client_1.expectString)(output["SourceIdentity"]);
      }
      return contents;
    };
    var deserializeAws_queryAssumeRoleWithSAMLResponse = (output, context) => {
      const contents = {
        Credentials: void 0,
        AssumedRoleUser: void 0,
        PackedPolicySize: void 0,
        Subject: void 0,
        SubjectType: void 0,
        Issuer: void 0,
        Audience: void 0,
        NameQualifier: void 0,
        SourceIdentity: void 0
      };
      if (output["Credentials"] !== void 0) {
        contents.Credentials = deserializeAws_queryCredentials(output["Credentials"], context);
      }
      if (output["AssumedRoleUser"] !== void 0) {
        contents.AssumedRoleUser = deserializeAws_queryAssumedRoleUser(output["AssumedRoleUser"], context);
      }
      if (output["PackedPolicySize"] !== void 0) {
        contents.PackedPolicySize = (0, smithy_client_1.strictParseInt32)(output["PackedPolicySize"]);
      }
      if (output["Subject"] !== void 0) {
        contents.Subject = (0, smithy_client_1.expectString)(output["Subject"]);
      }
      if (output["SubjectType"] !== void 0) {
        contents.SubjectType = (0, smithy_client_1.expectString)(output["SubjectType"]);
      }
      if (output["Issuer"] !== void 0) {
        contents.Issuer = (0, smithy_client_1.expectString)(output["Issuer"]);
      }
      if (output["Audience"] !== void 0) {
        contents.Audience = (0, smithy_client_1.expectString)(output["Audience"]);
      }
      if (output["NameQualifier"] !== void 0) {
        contents.NameQualifier = (0, smithy_client_1.expectString)(output["NameQualifier"]);
      }
      if (output["SourceIdentity"] !== void 0) {
        contents.SourceIdentity = (0, smithy_client_1.expectString)(output["SourceIdentity"]);
      }
      return contents;
    };
    var deserializeAws_queryAssumeRoleWithWebIdentityResponse = (output, context) => {
      const contents = {
        Credentials: void 0,
        SubjectFromWebIdentityToken: void 0,
        AssumedRoleUser: void 0,
        PackedPolicySize: void 0,
        Provider: void 0,
        Audience: void 0,
        SourceIdentity: void 0
      };
      if (output["Credentials"] !== void 0) {
        contents.Credentials = deserializeAws_queryCredentials(output["Credentials"], context);
      }
      if (output["SubjectFromWebIdentityToken"] !== void 0) {
        contents.SubjectFromWebIdentityToken = (0, smithy_client_1.expectString)(output["SubjectFromWebIdentityToken"]);
      }
      if (output["AssumedRoleUser"] !== void 0) {
        contents.AssumedRoleUser = deserializeAws_queryAssumedRoleUser(output["AssumedRoleUser"], context);
      }
      if (output["PackedPolicySize"] !== void 0) {
        contents.PackedPolicySize = (0, smithy_client_1.strictParseInt32)(output["PackedPolicySize"]);
      }
      if (output["Provider"] !== void 0) {
        contents.Provider = (0, smithy_client_1.expectString)(output["Provider"]);
      }
      if (output["Audience"] !== void 0) {
        contents.Audience = (0, smithy_client_1.expectString)(output["Audience"]);
      }
      if (output["SourceIdentity"] !== void 0) {
        contents.SourceIdentity = (0, smithy_client_1.expectString)(output["SourceIdentity"]);
      }
      return contents;
    };
    var deserializeAws_queryCredentials = (output, context) => {
      const contents = {
        AccessKeyId: void 0,
        SecretAccessKey: void 0,
        SessionToken: void 0,
        Expiration: void 0
      };
      if (output["AccessKeyId"] !== void 0) {
        contents.AccessKeyId = (0, smithy_client_1.expectString)(output["AccessKeyId"]);
      }
      if (output["SecretAccessKey"] !== void 0) {
        contents.SecretAccessKey = (0, smithy_client_1.expectString)(output["SecretAccessKey"]);
      }
      if (output["SessionToken"] !== void 0) {
        contents.SessionToken = (0, smithy_client_1.expectString)(output["SessionToken"]);
      }
      if (output["Expiration"] !== void 0) {
        contents.Expiration = (0, smithy_client_1.expectNonNull)((0, smithy_client_1.parseRfc3339DateTime)(output["Expiration"]));
      }
      return contents;
    };
    var deserializeAws_queryDecodeAuthorizationMessageResponse = (output, context) => {
      const contents = {
        DecodedMessage: void 0
      };
      if (output["DecodedMessage"] !== void 0) {
        contents.DecodedMessage = (0, smithy_client_1.expectString)(output["DecodedMessage"]);
      }
      return contents;
    };
    var deserializeAws_queryExpiredTokenException = (output, context) => {
      const contents = {
        message: void 0
      };
      if (output["message"] !== void 0) {
        contents.message = (0, smithy_client_1.expectString)(output["message"]);
      }
      return contents;
    };
    var deserializeAws_queryFederatedUser = (output, context) => {
      const contents = {
        FederatedUserId: void 0,
        Arn: void 0
      };
      if (output["FederatedUserId"] !== void 0) {
        contents.FederatedUserId = (0, smithy_client_1.expectString)(output["FederatedUserId"]);
      }
      if (output["Arn"] !== void 0) {
        contents.Arn = (0, smithy_client_1.expectString)(output["Arn"]);
      }
      return contents;
    };
    var deserializeAws_queryGetAccessKeyInfoResponse = (output, context) => {
      const contents = {
        Account: void 0
      };
      if (output["Account"] !== void 0) {
        contents.Account = (0, smithy_client_1.expectString)(output["Account"]);
      }
      return contents;
    };
    var deserializeAws_queryGetCallerIdentityResponse = (output, context) => {
      const contents = {
        UserId: void 0,
        Account: void 0,
        Arn: void 0
      };
      if (output["UserId"] !== void 0) {
        contents.UserId = (0, smithy_client_1.expectString)(output["UserId"]);
      }
      if (output["Account"] !== void 0) {
        contents.Account = (0, smithy_client_1.expectString)(output["Account"]);
      }
      if (output["Arn"] !== void 0) {
        contents.Arn = (0, smithy_client_1.expectString)(output["Arn"]);
      }
      return contents;
    };
    var deserializeAws_queryGetFederationTokenResponse = (output, context) => {
      const contents = {
        Credentials: void 0,
        FederatedUser: void 0,
        PackedPolicySize: void 0
      };
      if (output["Credentials"] !== void 0) {
        contents.Credentials = deserializeAws_queryCredentials(output["Credentials"], context);
      }
      if (output["FederatedUser"] !== void 0) {
        contents.FederatedUser = deserializeAws_queryFederatedUser(output["FederatedUser"], context);
      }
      if (output["PackedPolicySize"] !== void 0) {
        contents.PackedPolicySize = (0, smithy_client_1.strictParseInt32)(output["PackedPolicySize"]);
      }
      return contents;
    };
    var deserializeAws_queryGetSessionTokenResponse = (output, context) => {
      const contents = {
        Credentials: void 0
      };
      if (output["Credentials"] !== void 0) {
        contents.Credentials = deserializeAws_queryCredentials(output["Credentials"], context);
      }
      return contents;
    };
    var deserializeAws_queryIDPCommunicationErrorException = (output, context) => {
      const contents = {
        message: void 0
      };
      if (output["message"] !== void 0) {
        contents.message = (0, smithy_client_1.expectString)(output["message"]);
      }
      return contents;
    };
    var deserializeAws_queryIDPRejectedClaimException = (output, context) => {
      const contents = {
        message: void 0
      };
      if (output["message"] !== void 0) {
        contents.message = (0, smithy_client_1.expectString)(output["message"]);
      }
      return contents;
    };
    var deserializeAws_queryInvalidAuthorizationMessageException = (output, context) => {
      const contents = {
        message: void 0
      };
      if (output["message"] !== void 0) {
        contents.message = (0, smithy_client_1.expectString)(output["message"]);
      }
      return contents;
    };
    var deserializeAws_queryInvalidIdentityTokenException = (output, context) => {
      const contents = {
        message: void 0
      };
      if (output["message"] !== void 0) {
        contents.message = (0, smithy_client_1.expectString)(output["message"]);
      }
      return contents;
    };
    var deserializeAws_queryMalformedPolicyDocumentException = (output, context) => {
      const contents = {
        message: void 0
      };
      if (output["message"] !== void 0) {
        contents.message = (0, smithy_client_1.expectString)(output["message"]);
      }
      return contents;
    };
    var deserializeAws_queryPackedPolicyTooLargeException = (output, context) => {
      const contents = {
        message: void 0
      };
      if (output["message"] !== void 0) {
        contents.message = (0, smithy_client_1.expectString)(output["message"]);
      }
      return contents;
    };
    var deserializeAws_queryRegionDisabledException = (output, context) => {
      const contents = {
        message: void 0
      };
      if (output["message"] !== void 0) {
        contents.message = (0, smithy_client_1.expectString)(output["message"]);
      }
      return contents;
    };
    var deserializeMetadata = (output) => {
      var _a;
      return {
        httpStatusCode: output.statusCode,
        requestId: (_a = output.headers["x-amzn-requestid"]) !== null && _a !== void 0 ? _a : output.headers["x-amzn-request-id"],
        extendedRequestId: output.headers["x-amz-id-2"],
        cfId: output.headers["x-amz-cf-id"]
      };
    };
    var collectBody = (streamBody = new Uint8Array(), context) => {
      if (streamBody instanceof Uint8Array) {
        return Promise.resolve(streamBody);
      }
      return context.streamCollector(streamBody) || Promise.resolve(new Uint8Array());
    };
    var collectBodyString = (streamBody, context) => collectBody(streamBody, context).then((body) => context.utf8Encoder(body));
    var buildHttpRpcRequest = async (context, headers, path, resolvedHostname, body) => {
      const { hostname, protocol = "https", port, path: basePath } = await context.endpoint();
      const contents = {
        protocol,
        hostname,
        port,
        method: "POST",
        path: basePath.endsWith("/") ? basePath.slice(0, -1) + path : basePath + path,
        headers
      };
      if (resolvedHostname !== void 0) {
        contents.hostname = resolvedHostname;
      }
      if (body !== void 0) {
        contents.body = body;
      }
      return new protocol_http_1.HttpRequest(contents);
    };
    var parseBody = (streamBody, context) => collectBodyString(streamBody, context).then((encoded) => {
      if (encoded.length) {
        const parsedObj = (0, fast_xml_parser_1.parse)(encoded, {
          attributeNamePrefix: "",
          ignoreAttributes: false,
          parseNodeValue: false,
          trimValues: false,
          tagValueProcessor: (val) => val.trim() === "" && val.includes("\n") ? "" : (0, entities_1.decodeHTML)(val)
        });
        const textNodeName = "#text";
        const key = Object.keys(parsedObj)[0];
        const parsedObjToReturn = parsedObj[key];
        if (parsedObjToReturn[textNodeName]) {
          parsedObjToReturn[key] = parsedObjToReturn[textNodeName];
          delete parsedObjToReturn[textNodeName];
        }
        return (0, smithy_client_1.getValueFromTextNode)(parsedObjToReturn);
      }
      return {};
    });
    var buildFormUrlencodedString = (formEntries) => Object.entries(formEntries).map(([key, value]) => (0, smithy_client_1.extendedEncodeURIComponent)(key) + "=" + (0, smithy_client_1.extendedEncodeURIComponent)(value)).join("&");
    var loadQueryErrorCode = (output, data) => {
      if (data.Error.Code !== void 0) {
        return data.Error.Code;
      }
      if (output.statusCode == 404) {
        return "NotFound";
      }
      return "";
    };
  }
});

// node_modules/@aws-sdk/client-sts/dist-cjs/commands/AssumeRoleCommand.js
var require_AssumeRoleCommand = __commonJS({
  "node_modules/@aws-sdk/client-sts/dist-cjs/commands/AssumeRoleCommand.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AssumeRoleCommand = void 0;
    var middleware_serde_1 = require_dist_cjs();
    var middleware_signing_1 = require_dist_cjs19();
    var smithy_client_1 = require_dist_cjs3();
    var models_0_1 = require_models_02();
    var Aws_query_1 = require_Aws_query();
    var AssumeRoleCommand = class extends smithy_client_1.Command {
      constructor(input) {
        super();
        this.input = input;
      }
      resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use((0, middleware_serde_1.getSerdePlugin)(configuration, this.serialize, this.deserialize));
        this.middlewareStack.use((0, middleware_signing_1.getAwsAuthPlugin)(configuration));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "STSClient";
        const commandName = "AssumeRoleCommand";
        const handlerExecutionContext = {
          logger,
          clientName,
          commandName,
          inputFilterSensitiveLog: models_0_1.AssumeRoleRequest.filterSensitiveLog,
          outputFilterSensitiveLog: models_0_1.AssumeRoleResponse.filterSensitiveLog
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
      }
      serialize(input, context) {
        return (0, Aws_query_1.serializeAws_queryAssumeRoleCommand)(input, context);
      }
      deserialize(output, context) {
        return (0, Aws_query_1.deserializeAws_queryAssumeRoleCommand)(output, context);
      }
    };
    exports.AssumeRoleCommand = AssumeRoleCommand;
  }
});

// node_modules/@aws-sdk/client-sts/dist-cjs/commands/AssumeRoleWithSAMLCommand.js
var require_AssumeRoleWithSAMLCommand = __commonJS({
  "node_modules/@aws-sdk/client-sts/dist-cjs/commands/AssumeRoleWithSAMLCommand.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AssumeRoleWithSAMLCommand = void 0;
    var middleware_serde_1 = require_dist_cjs();
    var smithy_client_1 = require_dist_cjs3();
    var models_0_1 = require_models_02();
    var Aws_query_1 = require_Aws_query();
    var AssumeRoleWithSAMLCommand = class extends smithy_client_1.Command {
      constructor(input) {
        super();
        this.input = input;
      }
      resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use((0, middleware_serde_1.getSerdePlugin)(configuration, this.serialize, this.deserialize));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "STSClient";
        const commandName = "AssumeRoleWithSAMLCommand";
        const handlerExecutionContext = {
          logger,
          clientName,
          commandName,
          inputFilterSensitiveLog: models_0_1.AssumeRoleWithSAMLRequest.filterSensitiveLog,
          outputFilterSensitiveLog: models_0_1.AssumeRoleWithSAMLResponse.filterSensitiveLog
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
      }
      serialize(input, context) {
        return (0, Aws_query_1.serializeAws_queryAssumeRoleWithSAMLCommand)(input, context);
      }
      deserialize(output, context) {
        return (0, Aws_query_1.deserializeAws_queryAssumeRoleWithSAMLCommand)(output, context);
      }
    };
    exports.AssumeRoleWithSAMLCommand = AssumeRoleWithSAMLCommand;
  }
});

// node_modules/@aws-sdk/client-sts/dist-cjs/commands/AssumeRoleWithWebIdentityCommand.js
var require_AssumeRoleWithWebIdentityCommand = __commonJS({
  "node_modules/@aws-sdk/client-sts/dist-cjs/commands/AssumeRoleWithWebIdentityCommand.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AssumeRoleWithWebIdentityCommand = void 0;
    var middleware_serde_1 = require_dist_cjs();
    var smithy_client_1 = require_dist_cjs3();
    var models_0_1 = require_models_02();
    var Aws_query_1 = require_Aws_query();
    var AssumeRoleWithWebIdentityCommand = class extends smithy_client_1.Command {
      constructor(input) {
        super();
        this.input = input;
      }
      resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use((0, middleware_serde_1.getSerdePlugin)(configuration, this.serialize, this.deserialize));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "STSClient";
        const commandName = "AssumeRoleWithWebIdentityCommand";
        const handlerExecutionContext = {
          logger,
          clientName,
          commandName,
          inputFilterSensitiveLog: models_0_1.AssumeRoleWithWebIdentityRequest.filterSensitiveLog,
          outputFilterSensitiveLog: models_0_1.AssumeRoleWithWebIdentityResponse.filterSensitiveLog
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
      }
      serialize(input, context) {
        return (0, Aws_query_1.serializeAws_queryAssumeRoleWithWebIdentityCommand)(input, context);
      }
      deserialize(output, context) {
        return (0, Aws_query_1.deserializeAws_queryAssumeRoleWithWebIdentityCommand)(output, context);
      }
    };
    exports.AssumeRoleWithWebIdentityCommand = AssumeRoleWithWebIdentityCommand;
  }
});

// node_modules/@aws-sdk/client-sts/dist-cjs/commands/DecodeAuthorizationMessageCommand.js
var require_DecodeAuthorizationMessageCommand = __commonJS({
  "node_modules/@aws-sdk/client-sts/dist-cjs/commands/DecodeAuthorizationMessageCommand.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DecodeAuthorizationMessageCommand = void 0;
    var middleware_serde_1 = require_dist_cjs();
    var middleware_signing_1 = require_dist_cjs19();
    var smithy_client_1 = require_dist_cjs3();
    var models_0_1 = require_models_02();
    var Aws_query_1 = require_Aws_query();
    var DecodeAuthorizationMessageCommand = class extends smithy_client_1.Command {
      constructor(input) {
        super();
        this.input = input;
      }
      resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use((0, middleware_serde_1.getSerdePlugin)(configuration, this.serialize, this.deserialize));
        this.middlewareStack.use((0, middleware_signing_1.getAwsAuthPlugin)(configuration));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "STSClient";
        const commandName = "DecodeAuthorizationMessageCommand";
        const handlerExecutionContext = {
          logger,
          clientName,
          commandName,
          inputFilterSensitiveLog: models_0_1.DecodeAuthorizationMessageRequest.filterSensitiveLog,
          outputFilterSensitiveLog: models_0_1.DecodeAuthorizationMessageResponse.filterSensitiveLog
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
      }
      serialize(input, context) {
        return (0, Aws_query_1.serializeAws_queryDecodeAuthorizationMessageCommand)(input, context);
      }
      deserialize(output, context) {
        return (0, Aws_query_1.deserializeAws_queryDecodeAuthorizationMessageCommand)(output, context);
      }
    };
    exports.DecodeAuthorizationMessageCommand = DecodeAuthorizationMessageCommand;
  }
});

// node_modules/@aws-sdk/client-sts/dist-cjs/commands/GetAccessKeyInfoCommand.js
var require_GetAccessKeyInfoCommand = __commonJS({
  "node_modules/@aws-sdk/client-sts/dist-cjs/commands/GetAccessKeyInfoCommand.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.GetAccessKeyInfoCommand = void 0;
    var middleware_serde_1 = require_dist_cjs();
    var middleware_signing_1 = require_dist_cjs19();
    var smithy_client_1 = require_dist_cjs3();
    var models_0_1 = require_models_02();
    var Aws_query_1 = require_Aws_query();
    var GetAccessKeyInfoCommand = class extends smithy_client_1.Command {
      constructor(input) {
        super();
        this.input = input;
      }
      resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use((0, middleware_serde_1.getSerdePlugin)(configuration, this.serialize, this.deserialize));
        this.middlewareStack.use((0, middleware_signing_1.getAwsAuthPlugin)(configuration));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "STSClient";
        const commandName = "GetAccessKeyInfoCommand";
        const handlerExecutionContext = {
          logger,
          clientName,
          commandName,
          inputFilterSensitiveLog: models_0_1.GetAccessKeyInfoRequest.filterSensitiveLog,
          outputFilterSensitiveLog: models_0_1.GetAccessKeyInfoResponse.filterSensitiveLog
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
      }
      serialize(input, context) {
        return (0, Aws_query_1.serializeAws_queryGetAccessKeyInfoCommand)(input, context);
      }
      deserialize(output, context) {
        return (0, Aws_query_1.deserializeAws_queryGetAccessKeyInfoCommand)(output, context);
      }
    };
    exports.GetAccessKeyInfoCommand = GetAccessKeyInfoCommand;
  }
});

// node_modules/@aws-sdk/client-sts/dist-cjs/commands/GetCallerIdentityCommand.js
var require_GetCallerIdentityCommand = __commonJS({
  "node_modules/@aws-sdk/client-sts/dist-cjs/commands/GetCallerIdentityCommand.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.GetCallerIdentityCommand = void 0;
    var middleware_serde_1 = require_dist_cjs();
    var middleware_signing_1 = require_dist_cjs19();
    var smithy_client_1 = require_dist_cjs3();
    var models_0_1 = require_models_02();
    var Aws_query_1 = require_Aws_query();
    var GetCallerIdentityCommand = class extends smithy_client_1.Command {
      constructor(input) {
        super();
        this.input = input;
      }
      resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use((0, middleware_serde_1.getSerdePlugin)(configuration, this.serialize, this.deserialize));
        this.middlewareStack.use((0, middleware_signing_1.getAwsAuthPlugin)(configuration));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "STSClient";
        const commandName = "GetCallerIdentityCommand";
        const handlerExecutionContext = {
          logger,
          clientName,
          commandName,
          inputFilterSensitiveLog: models_0_1.GetCallerIdentityRequest.filterSensitiveLog,
          outputFilterSensitiveLog: models_0_1.GetCallerIdentityResponse.filterSensitiveLog
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
      }
      serialize(input, context) {
        return (0, Aws_query_1.serializeAws_queryGetCallerIdentityCommand)(input, context);
      }
      deserialize(output, context) {
        return (0, Aws_query_1.deserializeAws_queryGetCallerIdentityCommand)(output, context);
      }
    };
    exports.GetCallerIdentityCommand = GetCallerIdentityCommand;
  }
});

// node_modules/@aws-sdk/client-sts/dist-cjs/commands/GetFederationTokenCommand.js
var require_GetFederationTokenCommand = __commonJS({
  "node_modules/@aws-sdk/client-sts/dist-cjs/commands/GetFederationTokenCommand.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.GetFederationTokenCommand = void 0;
    var middleware_serde_1 = require_dist_cjs();
    var middleware_signing_1 = require_dist_cjs19();
    var smithy_client_1 = require_dist_cjs3();
    var models_0_1 = require_models_02();
    var Aws_query_1 = require_Aws_query();
    var GetFederationTokenCommand = class extends smithy_client_1.Command {
      constructor(input) {
        super();
        this.input = input;
      }
      resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use((0, middleware_serde_1.getSerdePlugin)(configuration, this.serialize, this.deserialize));
        this.middlewareStack.use((0, middleware_signing_1.getAwsAuthPlugin)(configuration));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "STSClient";
        const commandName = "GetFederationTokenCommand";
        const handlerExecutionContext = {
          logger,
          clientName,
          commandName,
          inputFilterSensitiveLog: models_0_1.GetFederationTokenRequest.filterSensitiveLog,
          outputFilterSensitiveLog: models_0_1.GetFederationTokenResponse.filterSensitiveLog
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
      }
      serialize(input, context) {
        return (0, Aws_query_1.serializeAws_queryGetFederationTokenCommand)(input, context);
      }
      deserialize(output, context) {
        return (0, Aws_query_1.deserializeAws_queryGetFederationTokenCommand)(output, context);
      }
    };
    exports.GetFederationTokenCommand = GetFederationTokenCommand;
  }
});

// node_modules/@aws-sdk/client-sts/dist-cjs/commands/GetSessionTokenCommand.js
var require_GetSessionTokenCommand = __commonJS({
  "node_modules/@aws-sdk/client-sts/dist-cjs/commands/GetSessionTokenCommand.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.GetSessionTokenCommand = void 0;
    var middleware_serde_1 = require_dist_cjs();
    var middleware_signing_1 = require_dist_cjs19();
    var smithy_client_1 = require_dist_cjs3();
    var models_0_1 = require_models_02();
    var Aws_query_1 = require_Aws_query();
    var GetSessionTokenCommand = class extends smithy_client_1.Command {
      constructor(input) {
        super();
        this.input = input;
      }
      resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use((0, middleware_serde_1.getSerdePlugin)(configuration, this.serialize, this.deserialize));
        this.middlewareStack.use((0, middleware_signing_1.getAwsAuthPlugin)(configuration));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "STSClient";
        const commandName = "GetSessionTokenCommand";
        const handlerExecutionContext = {
          logger,
          clientName,
          commandName,
          inputFilterSensitiveLog: models_0_1.GetSessionTokenRequest.filterSensitiveLog,
          outputFilterSensitiveLog: models_0_1.GetSessionTokenResponse.filterSensitiveLog
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
      }
      serialize(input, context) {
        return (0, Aws_query_1.serializeAws_queryGetSessionTokenCommand)(input, context);
      }
      deserialize(output, context) {
        return (0, Aws_query_1.deserializeAws_queryGetSessionTokenCommand)(output, context);
      }
    };
    exports.GetSessionTokenCommand = GetSessionTokenCommand;
  }
});

// node_modules/@aws-sdk/middleware-sdk-sts/dist-cjs/index.js
var require_dist_cjs21 = __commonJS({
  "node_modules/@aws-sdk/middleware-sdk-sts/dist-cjs/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.resolveStsAuthConfig = void 0;
    var middleware_signing_1 = require_dist_cjs19();
    var resolveStsAuthConfig = (input, { stsClientCtor }) => (0, middleware_signing_1.resolveAwsAuthConfig)({
      ...input,
      stsClientCtor
    });
    exports.resolveStsAuthConfig = resolveStsAuthConfig;
  }
});

// node_modules/@aws-sdk/client-sts/package.json
var require_package2 = __commonJS({
  "node_modules/@aws-sdk/client-sts/package.json"(exports, module2) {
    module2.exports = {
      _from: "@aws-sdk/client-sts@3.105.0",
      _id: "@aws-sdk/client-sts@3.105.0",
      _inBundle: false,
      _integrity: "sha512-ZZyw5hu0Ip/jHc9umpWTnWNUHV270fS25LB7fecUwQeC/cok+EvaG5QGBVI5t0GSUynEIC0sNlG9SDc1wLTZPA==",
      _location: "/@aws-sdk/client-sts",
      _phantomChildren: {},
      _requested: {
        type: "version",
        registry: true,
        raw: "@aws-sdk/client-sts@3.105.0",
        name: "@aws-sdk/client-sts",
        escapedName: "@aws-sdk%2fclient-sts",
        scope: "@aws-sdk",
        rawSpec: "3.105.0",
        saveSpec: null,
        fetchSpec: "3.105.0"
      },
      _requiredBy: [
        "/@aws-sdk/client-secrets-manager"
      ],
      _resolved: "https://registry.npmjs.org/@aws-sdk/client-sts/-/client-sts-3.105.0.tgz",
      _shasum: "3797869b5867c3821bbb5c5f5b7e370a635718f4",
      _spec: "@aws-sdk/client-sts@3.105.0",
      _where: "/Users/carmenluo/test-cdk/node_modules/@aws-sdk/client-secrets-manager",
      author: {
        name: "AWS SDK for JavaScript Team",
        url: "https://aws.amazon.com/javascript/"
      },
      browser: {
        "./dist-es/runtimeConfig": "./dist-es/runtimeConfig.browser"
      },
      bugs: {
        url: "https://github.com/aws/aws-sdk-js-v3/issues"
      },
      bundleDependencies: false,
      dependencies: {
        "@aws-crypto/sha256-browser": "2.0.0",
        "@aws-crypto/sha256-js": "2.0.0",
        "@aws-sdk/config-resolver": "3.80.0",
        "@aws-sdk/credential-provider-node": "3.105.0",
        "@aws-sdk/fetch-http-handler": "3.78.0",
        "@aws-sdk/hash-node": "3.78.0",
        "@aws-sdk/invalid-dependency": "3.78.0",
        "@aws-sdk/middleware-content-length": "3.78.0",
        "@aws-sdk/middleware-host-header": "3.78.0",
        "@aws-sdk/middleware-logger": "3.78.0",
        "@aws-sdk/middleware-recursion-detection": "3.105.0",
        "@aws-sdk/middleware-retry": "3.80.0",
        "@aws-sdk/middleware-sdk-sts": "3.78.0",
        "@aws-sdk/middleware-serde": "3.78.0",
        "@aws-sdk/middleware-signing": "3.78.0",
        "@aws-sdk/middleware-stack": "3.78.0",
        "@aws-sdk/middleware-user-agent": "3.78.0",
        "@aws-sdk/node-config-provider": "3.80.0",
        "@aws-sdk/node-http-handler": "3.94.0",
        "@aws-sdk/protocol-http": "3.78.0",
        "@aws-sdk/smithy-client": "3.99.0",
        "@aws-sdk/types": "3.78.0",
        "@aws-sdk/url-parser": "3.78.0",
        "@aws-sdk/util-base64-browser": "3.58.0",
        "@aws-sdk/util-base64-node": "3.55.0",
        "@aws-sdk/util-body-length-browser": "3.55.0",
        "@aws-sdk/util-body-length-node": "3.55.0",
        "@aws-sdk/util-defaults-mode-browser": "3.99.0",
        "@aws-sdk/util-defaults-mode-node": "3.99.0",
        "@aws-sdk/util-user-agent-browser": "3.78.0",
        "@aws-sdk/util-user-agent-node": "3.80.0",
        "@aws-sdk/util-utf8-browser": "3.55.0",
        "@aws-sdk/util-utf8-node": "3.55.0",
        entities: "2.2.0",
        "fast-xml-parser": "3.19.0",
        tslib: "^2.3.1"
      },
      deprecated: false,
      description: "AWS SDK for JavaScript Sts Client for Node.js, Browser and React Native",
      devDependencies: {
        "@aws-sdk/service-client-documentation-generator": "3.58.0",
        "@tsconfig/recommended": "1.0.1",
        "@types/node": "^12.7.5",
        concurrently: "7.0.0",
        "downlevel-dts": "0.7.0",
        rimraf: "3.0.2",
        typedoc: "0.19.2",
        typescript: "~4.6.2"
      },
      engines: {
        node: ">=12.0.0"
      },
      files: [
        "dist-*"
      ],
      homepage: "https://github.com/aws/aws-sdk-js-v3/tree/main/clients/client-sts",
      license: "Apache-2.0",
      main: "./dist-cjs/index.js",
      module: "./dist-es/index.js",
      name: "@aws-sdk/client-sts",
      "react-native": {
        "./dist-es/runtimeConfig": "./dist-es/runtimeConfig.native"
      },
      repository: {
        type: "git",
        url: "git+https://github.com/aws/aws-sdk-js-v3.git",
        directory: "clients/client-sts"
      },
      scripts: {
        build: "concurrently 'yarn:build:cjs' 'yarn:build:es' 'yarn:build:types'",
        "build:cjs": "tsc -p tsconfig.cjs.json",
        "build:docs": "typedoc",
        "build:es": "tsc -p tsconfig.es.json",
        "build:types": "tsc -p tsconfig.types.json",
        "build:types:downlevel": "downlevel-dts dist-types dist-types/ts3.4",
        clean: "rimraf ./dist-* && rimraf *.tsbuildinfo"
      },
      sideEffects: false,
      types: "./dist-types/index.d.ts",
      typesVersions: {
        "<4.0": {
          "dist-types/*": [
            "dist-types/ts3.4/*"
          ]
        }
      },
      version: "3.105.0"
    };
  }
});

// node_modules/@aws-sdk/client-sts/dist-cjs/defaultStsRoleAssumers.js
var require_defaultStsRoleAssumers = __commonJS({
  "node_modules/@aws-sdk/client-sts/dist-cjs/defaultStsRoleAssumers.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.decorateDefaultCredentialProvider = exports.getDefaultRoleAssumerWithWebIdentity = exports.getDefaultRoleAssumer = void 0;
    var AssumeRoleCommand_1 = require_AssumeRoleCommand();
    var AssumeRoleWithWebIdentityCommand_1 = require_AssumeRoleWithWebIdentityCommand();
    var ASSUME_ROLE_DEFAULT_REGION = "us-east-1";
    var decorateDefaultRegion = (region) => {
      if (typeof region !== "function") {
        return region === void 0 ? ASSUME_ROLE_DEFAULT_REGION : region;
      }
      return async () => {
        try {
          return await region();
        } catch (e2) {
          return ASSUME_ROLE_DEFAULT_REGION;
        }
      };
    };
    var getDefaultRoleAssumer = (stsOptions, stsClientCtor) => {
      let stsClient;
      let closureSourceCreds;
      return async (sourceCreds, params) => {
        closureSourceCreds = sourceCreds;
        if (!stsClient) {
          const { logger, region, requestHandler } = stsOptions;
          stsClient = new stsClientCtor({
            logger,
            credentialDefaultProvider: () => async () => closureSourceCreds,
            region: decorateDefaultRegion(region || stsOptions.region),
            ...requestHandler ? { requestHandler } : {}
          });
        }
        const { Credentials } = await stsClient.send(new AssumeRoleCommand_1.AssumeRoleCommand(params));
        if (!Credentials || !Credentials.AccessKeyId || !Credentials.SecretAccessKey) {
          throw new Error(`Invalid response from STS.assumeRole call with role ${params.RoleArn}`);
        }
        return {
          accessKeyId: Credentials.AccessKeyId,
          secretAccessKey: Credentials.SecretAccessKey,
          sessionToken: Credentials.SessionToken,
          expiration: Credentials.Expiration
        };
      };
    };
    exports.getDefaultRoleAssumer = getDefaultRoleAssumer;
    var getDefaultRoleAssumerWithWebIdentity = (stsOptions, stsClientCtor) => {
      let stsClient;
      return async (params) => {
        if (!stsClient) {
          const { logger, region, requestHandler } = stsOptions;
          stsClient = new stsClientCtor({
            logger,
            region: decorateDefaultRegion(region || stsOptions.region),
            ...requestHandler ? { requestHandler } : {}
          });
        }
        const { Credentials } = await stsClient.send(new AssumeRoleWithWebIdentityCommand_1.AssumeRoleWithWebIdentityCommand(params));
        if (!Credentials || !Credentials.AccessKeyId || !Credentials.SecretAccessKey) {
          throw new Error(`Invalid response from STS.assumeRoleWithWebIdentity call with role ${params.RoleArn}`);
        }
        return {
          accessKeyId: Credentials.AccessKeyId,
          secretAccessKey: Credentials.SecretAccessKey,
          sessionToken: Credentials.SessionToken,
          expiration: Credentials.Expiration
        };
      };
    };
    exports.getDefaultRoleAssumerWithWebIdentity = getDefaultRoleAssumerWithWebIdentity;
    var decorateDefaultCredentialProvider = (provider) => (input) => provider({
      roleAssumer: (0, exports.getDefaultRoleAssumer)(input, input.stsClientCtor),
      roleAssumerWithWebIdentity: (0, exports.getDefaultRoleAssumerWithWebIdentity)(input, input.stsClientCtor),
      ...input
    });
    exports.decorateDefaultCredentialProvider = decorateDefaultCredentialProvider;
  }
});

// node_modules/@aws-sdk/credential-provider-env/dist-cjs/fromEnv.js
var require_fromEnv = __commonJS({
  "node_modules/@aws-sdk/credential-provider-env/dist-cjs/fromEnv.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.fromEnv = exports.ENV_EXPIRATION = exports.ENV_SESSION = exports.ENV_SECRET = exports.ENV_KEY = void 0;
    var property_provider_1 = require_dist_cjs14();
    exports.ENV_KEY = "AWS_ACCESS_KEY_ID";
    exports.ENV_SECRET = "AWS_SECRET_ACCESS_KEY";
    exports.ENV_SESSION = "AWS_SESSION_TOKEN";
    exports.ENV_EXPIRATION = "AWS_CREDENTIAL_EXPIRATION";
    var fromEnv = () => async () => {
      const accessKeyId = process.env[exports.ENV_KEY];
      const secretAccessKey = process.env[exports.ENV_SECRET];
      const sessionToken = process.env[exports.ENV_SESSION];
      const expiry = process.env[exports.ENV_EXPIRATION];
      if (accessKeyId && secretAccessKey) {
        return {
          accessKeyId,
          secretAccessKey,
          ...sessionToken && { sessionToken },
          ...expiry && { expiration: new Date(expiry) }
        };
      }
      throw new property_provider_1.CredentialsProviderError("Unable to find environment variable credentials.");
    };
    exports.fromEnv = fromEnv;
  }
});

// node_modules/@aws-sdk/credential-provider-env/dist-cjs/index.js
var require_dist_cjs22 = __commonJS({
  "node_modules/@aws-sdk/credential-provider-env/dist-cjs/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require_tslib();
    tslib_1.__exportStar(require_fromEnv(), exports);
  }
});

// node_modules/@aws-sdk/shared-ini-file-loader/dist-cjs/getHomeDir.js
var require_getHomeDir = __commonJS({
  "node_modules/@aws-sdk/shared-ini-file-loader/dist-cjs/getHomeDir.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getHomeDir = void 0;
    var os_1 = require("os");
    var path_1 = require("path");
    var getHomeDir = () => {
      const { HOME, USERPROFILE, HOMEPATH, HOMEDRIVE = `C:${path_1.sep}` } = process.env;
      if (HOME)
        return HOME;
      if (USERPROFILE)
        return USERPROFILE;
      if (HOMEPATH)
        return `${HOMEDRIVE}${HOMEPATH}`;
      return (0, os_1.homedir)();
    };
    exports.getHomeDir = getHomeDir;
  }
});

// node_modules/@aws-sdk/shared-ini-file-loader/dist-cjs/getProfileName.js
var require_getProfileName = __commonJS({
  "node_modules/@aws-sdk/shared-ini-file-loader/dist-cjs/getProfileName.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getProfileName = exports.DEFAULT_PROFILE = exports.ENV_PROFILE = void 0;
    exports.ENV_PROFILE = "AWS_PROFILE";
    exports.DEFAULT_PROFILE = "default";
    var getProfileName = (init) => init.profile || process.env[exports.ENV_PROFILE] || exports.DEFAULT_PROFILE;
    exports.getProfileName = getProfileName;
  }
});

// node_modules/@aws-sdk/shared-ini-file-loader/dist-cjs/getSSOTokenFilepath.js
var require_getSSOTokenFilepath = __commonJS({
  "node_modules/@aws-sdk/shared-ini-file-loader/dist-cjs/getSSOTokenFilepath.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getSSOTokenFilepath = void 0;
    var crypto_1 = require("crypto");
    var path_1 = require("path");
    var getHomeDir_1 = require_getHomeDir();
    var getSSOTokenFilepath = (ssoStartUrl) => {
      const hasher = (0, crypto_1.createHash)("sha1");
      const cacheName = hasher.update(ssoStartUrl).digest("hex");
      return (0, path_1.join)((0, getHomeDir_1.getHomeDir)(), ".aws", "sso", "cache", `${cacheName}.json`);
    };
    exports.getSSOTokenFilepath = getSSOTokenFilepath;
  }
});

// node_modules/@aws-sdk/shared-ini-file-loader/dist-cjs/getSSOTokenFromFile.js
var require_getSSOTokenFromFile = __commonJS({
  "node_modules/@aws-sdk/shared-ini-file-loader/dist-cjs/getSSOTokenFromFile.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getSSOTokenFromFile = void 0;
    var fs_1 = require("fs");
    var getSSOTokenFilepath_1 = require_getSSOTokenFilepath();
    var { readFile } = fs_1.promises;
    var getSSOTokenFromFile = async (ssoStartUrl) => {
      const ssoTokenFilepath = (0, getSSOTokenFilepath_1.getSSOTokenFilepath)(ssoStartUrl);
      const ssoTokenText = await readFile(ssoTokenFilepath, "utf8");
      return JSON.parse(ssoTokenText);
    };
    exports.getSSOTokenFromFile = getSSOTokenFromFile;
  }
});

// node_modules/@aws-sdk/shared-ini-file-loader/dist-cjs/getConfigFilepath.js
var require_getConfigFilepath = __commonJS({
  "node_modules/@aws-sdk/shared-ini-file-loader/dist-cjs/getConfigFilepath.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getConfigFilepath = exports.ENV_CONFIG_PATH = void 0;
    var path_1 = require("path");
    var getHomeDir_1 = require_getHomeDir();
    exports.ENV_CONFIG_PATH = "AWS_CONFIG_FILE";
    var getConfigFilepath = () => process.env[exports.ENV_CONFIG_PATH] || (0, path_1.join)((0, getHomeDir_1.getHomeDir)(), ".aws", "config");
    exports.getConfigFilepath = getConfigFilepath;
  }
});

// node_modules/@aws-sdk/shared-ini-file-loader/dist-cjs/getCredentialsFilepath.js
var require_getCredentialsFilepath = __commonJS({
  "node_modules/@aws-sdk/shared-ini-file-loader/dist-cjs/getCredentialsFilepath.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getCredentialsFilepath = exports.ENV_CREDENTIALS_PATH = void 0;
    var path_1 = require("path");
    var getHomeDir_1 = require_getHomeDir();
    exports.ENV_CREDENTIALS_PATH = "AWS_SHARED_CREDENTIALS_FILE";
    var getCredentialsFilepath = () => process.env[exports.ENV_CREDENTIALS_PATH] || (0, path_1.join)((0, getHomeDir_1.getHomeDir)(), ".aws", "credentials");
    exports.getCredentialsFilepath = getCredentialsFilepath;
  }
});

// node_modules/@aws-sdk/shared-ini-file-loader/dist-cjs/getProfileData.js
var require_getProfileData = __commonJS({
  "node_modules/@aws-sdk/shared-ini-file-loader/dist-cjs/getProfileData.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getProfileData = void 0;
    var profileKeyRegex = /^profile\s(["'])?([^\1]+)\1$/;
    var getProfileData = (data) => Object.entries(data).filter(([key]) => profileKeyRegex.test(key)).reduce((acc, [key, value]) => ({ ...acc, [profileKeyRegex.exec(key)[2]]: value }), {
      ...data.default && { default: data.default }
    });
    exports.getProfileData = getProfileData;
  }
});

// node_modules/@aws-sdk/shared-ini-file-loader/dist-cjs/parseIni.js
var require_parseIni = __commonJS({
  "node_modules/@aws-sdk/shared-ini-file-loader/dist-cjs/parseIni.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parseIni = void 0;
    var profileNameBlockList = ["__proto__", "profile __proto__"];
    var parseIni = (iniData) => {
      const map = {};
      let currentSection;
      for (let line of iniData.split(/\r?\n/)) {
        line = line.split(/(^|\s)[;#]/)[0];
        const section = line.match(/^\s*\[([^\[\]]+)]\s*$/);
        if (section) {
          currentSection = section[1];
          if (profileNameBlockList.includes(currentSection)) {
            throw new Error(`Found invalid profile name "${currentSection}"`);
          }
        } else if (currentSection) {
          const item = line.match(/^\s*(.+?)\s*=\s*(.+?)\s*$/);
          if (item) {
            map[currentSection] = map[currentSection] || {};
            map[currentSection][item[1]] = item[2];
          }
        }
      }
      return map;
    };
    exports.parseIni = parseIni;
  }
});

// node_modules/@aws-sdk/shared-ini-file-loader/dist-cjs/slurpFile.js
var require_slurpFile = __commonJS({
  "node_modules/@aws-sdk/shared-ini-file-loader/dist-cjs/slurpFile.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.slurpFile = void 0;
    var fs_1 = require("fs");
    var { readFile } = fs_1.promises;
    var filePromisesHash = {};
    var slurpFile = (path) => {
      if (!filePromisesHash[path]) {
        filePromisesHash[path] = readFile(path, "utf8");
      }
      return filePromisesHash[path];
    };
    exports.slurpFile = slurpFile;
  }
});

// node_modules/@aws-sdk/shared-ini-file-loader/dist-cjs/loadSharedConfigFiles.js
var require_loadSharedConfigFiles = __commonJS({
  "node_modules/@aws-sdk/shared-ini-file-loader/dist-cjs/loadSharedConfigFiles.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.loadSharedConfigFiles = void 0;
    var getConfigFilepath_1 = require_getConfigFilepath();
    var getCredentialsFilepath_1 = require_getCredentialsFilepath();
    var getProfileData_1 = require_getProfileData();
    var parseIni_1 = require_parseIni();
    var slurpFile_1 = require_slurpFile();
    var swallowError = () => ({});
    var loadSharedConfigFiles = async (init = {}) => {
      const { filepath = (0, getCredentialsFilepath_1.getCredentialsFilepath)(), configFilepath = (0, getConfigFilepath_1.getConfigFilepath)() } = init;
      const parsedFiles = await Promise.all([
        (0, slurpFile_1.slurpFile)(configFilepath).then(parseIni_1.parseIni).then(getProfileData_1.getProfileData).catch(swallowError),
        (0, slurpFile_1.slurpFile)(filepath).then(parseIni_1.parseIni).catch(swallowError)
      ]);
      return {
        configFile: parsedFiles[0],
        credentialsFile: parsedFiles[1]
      };
    };
    exports.loadSharedConfigFiles = loadSharedConfigFiles;
  }
});

// node_modules/@aws-sdk/shared-ini-file-loader/dist-cjs/parseKnownFiles.js
var require_parseKnownFiles = __commonJS({
  "node_modules/@aws-sdk/shared-ini-file-loader/dist-cjs/parseKnownFiles.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parseKnownFiles = void 0;
    var loadSharedConfigFiles_1 = require_loadSharedConfigFiles();
    var parseKnownFiles = async (init) => {
      const parsedFiles = await (0, loadSharedConfigFiles_1.loadSharedConfigFiles)(init);
      return {
        ...parsedFiles.configFile,
        ...parsedFiles.credentialsFile
      };
    };
    exports.parseKnownFiles = parseKnownFiles;
  }
});

// node_modules/@aws-sdk/shared-ini-file-loader/dist-cjs/types.js
var require_types2 = __commonJS({
  "node_modules/@aws-sdk/shared-ini-file-loader/dist-cjs/types.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/@aws-sdk/shared-ini-file-loader/dist-cjs/index.js
var require_dist_cjs23 = __commonJS({
  "node_modules/@aws-sdk/shared-ini-file-loader/dist-cjs/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require_tslib();
    tslib_1.__exportStar(require_getHomeDir(), exports);
    tslib_1.__exportStar(require_getProfileName(), exports);
    tslib_1.__exportStar(require_getSSOTokenFilepath(), exports);
    tslib_1.__exportStar(require_getSSOTokenFromFile(), exports);
    tslib_1.__exportStar(require_loadSharedConfigFiles(), exports);
    tslib_1.__exportStar(require_parseKnownFiles(), exports);
    tslib_1.__exportStar(require_types2(), exports);
  }
});

// node_modules/@aws-sdk/credential-provider-imds/dist-cjs/remoteProvider/httpRequest.js
var require_httpRequest2 = __commonJS({
  "node_modules/@aws-sdk/credential-provider-imds/dist-cjs/remoteProvider/httpRequest.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.httpRequest = void 0;
    var property_provider_1 = require_dist_cjs14();
    var buffer_1 = require("buffer");
    var http_1 = require("http");
    function httpRequest(options) {
      return new Promise((resolve, reject) => {
        var _a;
        const req = (0, http_1.request)({
          method: "GET",
          ...options,
          hostname: (_a = options.hostname) === null || _a === void 0 ? void 0 : _a.replace(/^\[(.+)\]$/, "$1")
        });
        req.on("error", (err) => {
          reject(Object.assign(new property_provider_1.ProviderError("Unable to connect to instance metadata service"), err));
          req.destroy();
        });
        req.on("timeout", () => {
          reject(new property_provider_1.ProviderError("TimeoutError from instance metadata service"));
          req.destroy();
        });
        req.on("response", (res) => {
          const { statusCode = 400 } = res;
          if (statusCode < 200 || 300 <= statusCode) {
            reject(Object.assign(new property_provider_1.ProviderError("Error response received from instance metadata service"), { statusCode }));
            req.destroy();
          }
          const chunks = [];
          res.on("data", (chunk) => {
            chunks.push(chunk);
          });
          res.on("end", () => {
            resolve(buffer_1.Buffer.concat(chunks));
            req.destroy();
          });
        });
        req.end();
      });
    }
    exports.httpRequest = httpRequest;
  }
});

// node_modules/@aws-sdk/credential-provider-imds/dist-cjs/remoteProvider/ImdsCredentials.js
var require_ImdsCredentials = __commonJS({
  "node_modules/@aws-sdk/credential-provider-imds/dist-cjs/remoteProvider/ImdsCredentials.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.fromImdsCredentials = exports.isImdsCredentials = void 0;
    var isImdsCredentials = (arg) => Boolean(arg) && typeof arg === "object" && typeof arg.AccessKeyId === "string" && typeof arg.SecretAccessKey === "string" && typeof arg.Token === "string" && typeof arg.Expiration === "string";
    exports.isImdsCredentials = isImdsCredentials;
    var fromImdsCredentials = (creds) => ({
      accessKeyId: creds.AccessKeyId,
      secretAccessKey: creds.SecretAccessKey,
      sessionToken: creds.Token,
      expiration: new Date(creds.Expiration)
    });
    exports.fromImdsCredentials = fromImdsCredentials;
  }
});

// node_modules/@aws-sdk/credential-provider-imds/dist-cjs/remoteProvider/RemoteProviderInit.js
var require_RemoteProviderInit = __commonJS({
  "node_modules/@aws-sdk/credential-provider-imds/dist-cjs/remoteProvider/RemoteProviderInit.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.providerConfigFromInit = exports.DEFAULT_MAX_RETRIES = exports.DEFAULT_TIMEOUT = void 0;
    exports.DEFAULT_TIMEOUT = 1e3;
    exports.DEFAULT_MAX_RETRIES = 0;
    var providerConfigFromInit = ({ maxRetries = exports.DEFAULT_MAX_RETRIES, timeout = exports.DEFAULT_TIMEOUT }) => ({ maxRetries, timeout });
    exports.providerConfigFromInit = providerConfigFromInit;
  }
});

// node_modules/@aws-sdk/credential-provider-imds/dist-cjs/remoteProvider/retry.js
var require_retry = __commonJS({
  "node_modules/@aws-sdk/credential-provider-imds/dist-cjs/remoteProvider/retry.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.retry = void 0;
    var retry = (toRetry, maxRetries) => {
      let promise = toRetry();
      for (let i2 = 0; i2 < maxRetries; i2++) {
        promise = promise.catch(toRetry);
      }
      return promise;
    };
    exports.retry = retry;
  }
});

// node_modules/@aws-sdk/credential-provider-imds/dist-cjs/fromContainerMetadata.js
var require_fromContainerMetadata = __commonJS({
  "node_modules/@aws-sdk/credential-provider-imds/dist-cjs/fromContainerMetadata.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.fromContainerMetadata = exports.ENV_CMDS_AUTH_TOKEN = exports.ENV_CMDS_RELATIVE_URI = exports.ENV_CMDS_FULL_URI = void 0;
    var property_provider_1 = require_dist_cjs14();
    var url_1 = require("url");
    var httpRequest_1 = require_httpRequest2();
    var ImdsCredentials_1 = require_ImdsCredentials();
    var RemoteProviderInit_1 = require_RemoteProviderInit();
    var retry_1 = require_retry();
    exports.ENV_CMDS_FULL_URI = "AWS_CONTAINER_CREDENTIALS_FULL_URI";
    exports.ENV_CMDS_RELATIVE_URI = "AWS_CONTAINER_CREDENTIALS_RELATIVE_URI";
    exports.ENV_CMDS_AUTH_TOKEN = "AWS_CONTAINER_AUTHORIZATION_TOKEN";
    var fromContainerMetadata = (init = {}) => {
      const { timeout, maxRetries } = (0, RemoteProviderInit_1.providerConfigFromInit)(init);
      return () => (0, retry_1.retry)(async () => {
        const requestOptions = await getCmdsUri();
        const credsResponse = JSON.parse(await requestFromEcsImds(timeout, requestOptions));
        if (!(0, ImdsCredentials_1.isImdsCredentials)(credsResponse)) {
          throw new property_provider_1.CredentialsProviderError("Invalid response received from instance metadata service.");
        }
        return (0, ImdsCredentials_1.fromImdsCredentials)(credsResponse);
      }, maxRetries);
    };
    exports.fromContainerMetadata = fromContainerMetadata;
    var requestFromEcsImds = async (timeout, options) => {
      if (process.env[exports.ENV_CMDS_AUTH_TOKEN]) {
        options.headers = {
          ...options.headers,
          Authorization: process.env[exports.ENV_CMDS_AUTH_TOKEN]
        };
      }
      const buffer = await (0, httpRequest_1.httpRequest)({
        ...options,
        timeout
      });
      return buffer.toString();
    };
    var CMDS_IP = "169.254.170.2";
    var GREENGRASS_HOSTS = {
      localhost: true,
      "127.0.0.1": true
    };
    var GREENGRASS_PROTOCOLS = {
      "http:": true,
      "https:": true
    };
    var getCmdsUri = async () => {
      if (process.env[exports.ENV_CMDS_RELATIVE_URI]) {
        return {
          hostname: CMDS_IP,
          path: process.env[exports.ENV_CMDS_RELATIVE_URI]
        };
      }
      if (process.env[exports.ENV_CMDS_FULL_URI]) {
        const parsed = (0, url_1.parse)(process.env[exports.ENV_CMDS_FULL_URI]);
        if (!parsed.hostname || !(parsed.hostname in GREENGRASS_HOSTS)) {
          throw new property_provider_1.CredentialsProviderError(`${parsed.hostname} is not a valid container metadata service hostname`, false);
        }
        if (!parsed.protocol || !(parsed.protocol in GREENGRASS_PROTOCOLS)) {
          throw new property_provider_1.CredentialsProviderError(`${parsed.protocol} is not a valid container metadata service protocol`, false);
        }
        return {
          ...parsed,
          port: parsed.port ? parseInt(parsed.port, 10) : void 0
        };
      }
      throw new property_provider_1.CredentialsProviderError(`The container metadata credential provider cannot be used unless the ${exports.ENV_CMDS_RELATIVE_URI} or ${exports.ENV_CMDS_FULL_URI} environment variable is set`, false);
    };
  }
});

// node_modules/@aws-sdk/node-config-provider/dist-cjs/fromEnv.js
var require_fromEnv2 = __commonJS({
  "node_modules/@aws-sdk/node-config-provider/dist-cjs/fromEnv.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.fromEnv = void 0;
    var property_provider_1 = require_dist_cjs14();
    var fromEnv = (envVarSelector) => async () => {
      try {
        const config = envVarSelector(process.env);
        if (config === void 0) {
          throw new Error();
        }
        return config;
      } catch (e2) {
        throw new property_provider_1.CredentialsProviderError(e2.message || `Cannot load config from environment variables with getter: ${envVarSelector}`);
      }
    };
    exports.fromEnv = fromEnv;
  }
});

// node_modules/@aws-sdk/node-config-provider/dist-cjs/fromSharedConfigFiles.js
var require_fromSharedConfigFiles = __commonJS({
  "node_modules/@aws-sdk/node-config-provider/dist-cjs/fromSharedConfigFiles.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.fromSharedConfigFiles = void 0;
    var property_provider_1 = require_dist_cjs14();
    var shared_ini_file_loader_1 = require_dist_cjs23();
    var fromSharedConfigFiles = (configSelector, { preferredFile = "config", ...init } = {}) => async () => {
      const profile = (0, shared_ini_file_loader_1.getProfileName)(init);
      const { configFile, credentialsFile } = await (0, shared_ini_file_loader_1.loadSharedConfigFiles)(init);
      const profileFromCredentials = credentialsFile[profile] || {};
      const profileFromConfig = configFile[profile] || {};
      const mergedProfile = preferredFile === "config" ? { ...profileFromCredentials, ...profileFromConfig } : { ...profileFromConfig, ...profileFromCredentials };
      try {
        const configValue = configSelector(mergedProfile);
        if (configValue === void 0) {
          throw new Error();
        }
        return configValue;
      } catch (e2) {
        throw new property_provider_1.CredentialsProviderError(e2.message || `Cannot load config for profile ${profile} in SDK configuration files with getter: ${configSelector}`);
      }
    };
    exports.fromSharedConfigFiles = fromSharedConfigFiles;
  }
});

// node_modules/@aws-sdk/node-config-provider/dist-cjs/fromStatic.js
var require_fromStatic2 = __commonJS({
  "node_modules/@aws-sdk/node-config-provider/dist-cjs/fromStatic.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.fromStatic = void 0;
    var property_provider_1 = require_dist_cjs14();
    var isFunction = (func) => typeof func === "function";
    var fromStatic = (defaultValue) => isFunction(defaultValue) ? async () => await defaultValue() : (0, property_provider_1.fromStatic)(defaultValue);
    exports.fromStatic = fromStatic;
  }
});

// node_modules/@aws-sdk/node-config-provider/dist-cjs/configLoader.js
var require_configLoader = __commonJS({
  "node_modules/@aws-sdk/node-config-provider/dist-cjs/configLoader.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.loadConfig = void 0;
    var property_provider_1 = require_dist_cjs14();
    var fromEnv_1 = require_fromEnv2();
    var fromSharedConfigFiles_1 = require_fromSharedConfigFiles();
    var fromStatic_1 = require_fromStatic2();
    var loadConfig = ({ environmentVariableSelector, configFileSelector, default: defaultValue }, configuration = {}) => (0, property_provider_1.memoize)((0, property_provider_1.chain)((0, fromEnv_1.fromEnv)(environmentVariableSelector), (0, fromSharedConfigFiles_1.fromSharedConfigFiles)(configFileSelector, configuration), (0, fromStatic_1.fromStatic)(defaultValue)));
    exports.loadConfig = loadConfig;
  }
});

// node_modules/@aws-sdk/node-config-provider/dist-cjs/index.js
var require_dist_cjs24 = __commonJS({
  "node_modules/@aws-sdk/node-config-provider/dist-cjs/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require_tslib();
    tslib_1.__exportStar(require_configLoader(), exports);
  }
});

// node_modules/@aws-sdk/querystring-parser/dist-cjs/index.js
var require_dist_cjs25 = __commonJS({
  "node_modules/@aws-sdk/querystring-parser/dist-cjs/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parseQueryString = void 0;
    function parseQueryString(querystring) {
      const query = {};
      querystring = querystring.replace(/^\?/, "");
      if (querystring) {
        for (const pair of querystring.split("&")) {
          let [key, value = null] = pair.split("=");
          key = decodeURIComponent(key);
          if (value) {
            value = decodeURIComponent(value);
          }
          if (!(key in query)) {
            query[key] = value;
          } else if (Array.isArray(query[key])) {
            query[key].push(value);
          } else {
            query[key] = [query[key], value];
          }
        }
      }
      return query;
    }
    exports.parseQueryString = parseQueryString;
  }
});

// node_modules/@aws-sdk/url-parser/dist-cjs/index.js
var require_dist_cjs26 = __commonJS({
  "node_modules/@aws-sdk/url-parser/dist-cjs/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parseUrl = void 0;
    var querystring_parser_1 = require_dist_cjs25();
    var parseUrl = (url) => {
      const { hostname, pathname, port, protocol, search } = new URL(url);
      let query;
      if (search) {
        query = (0, querystring_parser_1.parseQueryString)(search);
      }
      return {
        hostname,
        port: port ? parseInt(port) : void 0,
        protocol,
        path: pathname,
        query
      };
    };
    exports.parseUrl = parseUrl;
  }
});

// node_modules/@aws-sdk/credential-provider-imds/dist-cjs/config/Endpoint.js
var require_Endpoint = __commonJS({
  "node_modules/@aws-sdk/credential-provider-imds/dist-cjs/config/Endpoint.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Endpoint = void 0;
    var Endpoint;
    (function(Endpoint2) {
      Endpoint2["IPv4"] = "http://169.254.169.254";
      Endpoint2["IPv6"] = "http://[fd00:ec2::254]";
    })(Endpoint = exports.Endpoint || (exports.Endpoint = {}));
  }
});

// node_modules/@aws-sdk/credential-provider-imds/dist-cjs/config/EndpointConfigOptions.js
var require_EndpointConfigOptions = __commonJS({
  "node_modules/@aws-sdk/credential-provider-imds/dist-cjs/config/EndpointConfigOptions.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ENDPOINT_CONFIG_OPTIONS = exports.CONFIG_ENDPOINT_NAME = exports.ENV_ENDPOINT_NAME = void 0;
    exports.ENV_ENDPOINT_NAME = "AWS_EC2_METADATA_SERVICE_ENDPOINT";
    exports.CONFIG_ENDPOINT_NAME = "ec2_metadata_service_endpoint";
    exports.ENDPOINT_CONFIG_OPTIONS = {
      environmentVariableSelector: (env) => env[exports.ENV_ENDPOINT_NAME],
      configFileSelector: (profile) => profile[exports.CONFIG_ENDPOINT_NAME],
      default: void 0
    };
  }
});

// node_modules/@aws-sdk/credential-provider-imds/dist-cjs/config/EndpointMode.js
var require_EndpointMode = __commonJS({
  "node_modules/@aws-sdk/credential-provider-imds/dist-cjs/config/EndpointMode.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EndpointMode = void 0;
    var EndpointMode;
    (function(EndpointMode2) {
      EndpointMode2["IPv4"] = "IPv4";
      EndpointMode2["IPv6"] = "IPv6";
    })(EndpointMode = exports.EndpointMode || (exports.EndpointMode = {}));
  }
});

// node_modules/@aws-sdk/credential-provider-imds/dist-cjs/config/EndpointModeConfigOptions.js
var require_EndpointModeConfigOptions = __commonJS({
  "node_modules/@aws-sdk/credential-provider-imds/dist-cjs/config/EndpointModeConfigOptions.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ENDPOINT_MODE_CONFIG_OPTIONS = exports.CONFIG_ENDPOINT_MODE_NAME = exports.ENV_ENDPOINT_MODE_NAME = void 0;
    var EndpointMode_1 = require_EndpointMode();
    exports.ENV_ENDPOINT_MODE_NAME = "AWS_EC2_METADATA_SERVICE_ENDPOINT_MODE";
    exports.CONFIG_ENDPOINT_MODE_NAME = "ec2_metadata_service_endpoint_mode";
    exports.ENDPOINT_MODE_CONFIG_OPTIONS = {
      environmentVariableSelector: (env) => env[exports.ENV_ENDPOINT_MODE_NAME],
      configFileSelector: (profile) => profile[exports.CONFIG_ENDPOINT_MODE_NAME],
      default: EndpointMode_1.EndpointMode.IPv4
    };
  }
});

// node_modules/@aws-sdk/credential-provider-imds/dist-cjs/utils/getInstanceMetadataEndpoint.js
var require_getInstanceMetadataEndpoint = __commonJS({
  "node_modules/@aws-sdk/credential-provider-imds/dist-cjs/utils/getInstanceMetadataEndpoint.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getInstanceMetadataEndpoint = void 0;
    var node_config_provider_1 = require_dist_cjs24();
    var url_parser_1 = require_dist_cjs26();
    var Endpoint_1 = require_Endpoint();
    var EndpointConfigOptions_1 = require_EndpointConfigOptions();
    var EndpointMode_1 = require_EndpointMode();
    var EndpointModeConfigOptions_1 = require_EndpointModeConfigOptions();
    var getInstanceMetadataEndpoint = async () => (0, url_parser_1.parseUrl)(await getFromEndpointConfig() || await getFromEndpointModeConfig());
    exports.getInstanceMetadataEndpoint = getInstanceMetadataEndpoint;
    var getFromEndpointConfig = async () => (0, node_config_provider_1.loadConfig)(EndpointConfigOptions_1.ENDPOINT_CONFIG_OPTIONS)();
    var getFromEndpointModeConfig = async () => {
      const endpointMode = await (0, node_config_provider_1.loadConfig)(EndpointModeConfigOptions_1.ENDPOINT_MODE_CONFIG_OPTIONS)();
      switch (endpointMode) {
        case EndpointMode_1.EndpointMode.IPv4:
          return Endpoint_1.Endpoint.IPv4;
        case EndpointMode_1.EndpointMode.IPv6:
          return Endpoint_1.Endpoint.IPv6;
        default:
          throw new Error(`Unsupported endpoint mode: ${endpointMode}. Select from ${Object.values(EndpointMode_1.EndpointMode)}`);
      }
    };
  }
});

// node_modules/@aws-sdk/credential-provider-imds/dist-cjs/utils/getExtendedInstanceMetadataCredentials.js
var require_getExtendedInstanceMetadataCredentials = __commonJS({
  "node_modules/@aws-sdk/credential-provider-imds/dist-cjs/utils/getExtendedInstanceMetadataCredentials.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getExtendedInstanceMetadataCredentials = void 0;
    var STATIC_STABILITY_REFRESH_INTERVAL_SECONDS = 5 * 60;
    var STATIC_STABILITY_REFRESH_INTERVAL_JITTER_WINDOW_SECONDS = 5 * 60;
    var STATIC_STABILITY_DOC_URL = "https://docs.aws.amazon.com/sdkref/latest/guide/feature-static-credentials.html";
    var getExtendedInstanceMetadataCredentials = (credentials, logger) => {
      var _a;
      const refreshInterval = STATIC_STABILITY_REFRESH_INTERVAL_SECONDS + Math.floor(Math.random() * STATIC_STABILITY_REFRESH_INTERVAL_JITTER_WINDOW_SECONDS);
      const newExpiration = new Date(Date.now() + refreshInterval * 1e3);
      logger.warn("Attempting credential expiration extension due to a credential service availability issue. A refresh of these credentials will be attempted after ${new Date(newExpiration)}.\nFor more information, please visit: " + STATIC_STABILITY_DOC_URL);
      const originalExpiration = (_a = credentials.originalExpiration) !== null && _a !== void 0 ? _a : credentials.expiration;
      return {
        ...credentials,
        ...originalExpiration ? { originalExpiration } : {},
        expiration: newExpiration
      };
    };
    exports.getExtendedInstanceMetadataCredentials = getExtendedInstanceMetadataCredentials;
  }
});

// node_modules/@aws-sdk/credential-provider-imds/dist-cjs/utils/staticStabilityProvider.js
var require_staticStabilityProvider = __commonJS({
  "node_modules/@aws-sdk/credential-provider-imds/dist-cjs/utils/staticStabilityProvider.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.staticStabilityProvider = void 0;
    var getExtendedInstanceMetadataCredentials_1 = require_getExtendedInstanceMetadataCredentials();
    var staticStabilityProvider = (provider, options = {}) => {
      const logger = (options === null || options === void 0 ? void 0 : options.logger) || console;
      let pastCredentials;
      return async () => {
        let credentials;
        try {
          credentials = await provider();
          if (credentials.expiration && credentials.expiration.getTime() < Date.now()) {
            credentials = (0, getExtendedInstanceMetadataCredentials_1.getExtendedInstanceMetadataCredentials)(credentials, logger);
          }
        } catch (e2) {
          if (pastCredentials) {
            logger.warn("Credential renew failed: ", e2);
            credentials = (0, getExtendedInstanceMetadataCredentials_1.getExtendedInstanceMetadataCredentials)(pastCredentials, logger);
          } else {
            throw e2;
          }
        }
        pastCredentials = credentials;
        return credentials;
      };
    };
    exports.staticStabilityProvider = staticStabilityProvider;
  }
});

// node_modules/@aws-sdk/credential-provider-imds/dist-cjs/fromInstanceMetadata.js
var require_fromInstanceMetadata = __commonJS({
  "node_modules/@aws-sdk/credential-provider-imds/dist-cjs/fromInstanceMetadata.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.fromInstanceMetadata = void 0;
    var property_provider_1 = require_dist_cjs14();
    var httpRequest_1 = require_httpRequest2();
    var ImdsCredentials_1 = require_ImdsCredentials();
    var RemoteProviderInit_1 = require_RemoteProviderInit();
    var retry_1 = require_retry();
    var getInstanceMetadataEndpoint_1 = require_getInstanceMetadataEndpoint();
    var staticStabilityProvider_1 = require_staticStabilityProvider();
    var IMDS_PATH = "/latest/meta-data/iam/security-credentials/";
    var IMDS_TOKEN_PATH = "/latest/api/token";
    var fromInstanceMetadata = (init = {}) => (0, staticStabilityProvider_1.staticStabilityProvider)(getInstanceImdsProvider(init), { logger: init.logger });
    exports.fromInstanceMetadata = fromInstanceMetadata;
    var getInstanceImdsProvider = (init) => {
      let disableFetchToken = false;
      const { timeout, maxRetries } = (0, RemoteProviderInit_1.providerConfigFromInit)(init);
      const getCredentials = async (maxRetries2, options) => {
        const profile = (await (0, retry_1.retry)(async () => {
          let profile2;
          try {
            profile2 = await getProfile(options);
          } catch (err) {
            if (err.statusCode === 401) {
              disableFetchToken = false;
            }
            throw err;
          }
          return profile2;
        }, maxRetries2)).trim();
        return (0, retry_1.retry)(async () => {
          let creds;
          try {
            creds = await getCredentialsFromProfile(profile, options);
          } catch (err) {
            if (err.statusCode === 401) {
              disableFetchToken = false;
            }
            throw err;
          }
          return creds;
        }, maxRetries2);
      };
      return async () => {
        const endpoint = await (0, getInstanceMetadataEndpoint_1.getInstanceMetadataEndpoint)();
        if (disableFetchToken) {
          return getCredentials(maxRetries, { ...endpoint, timeout });
        } else {
          let token;
          try {
            token = (await getMetadataToken({ ...endpoint, timeout })).toString();
          } catch (error) {
            if ((error === null || error === void 0 ? void 0 : error.statusCode) === 400) {
              throw Object.assign(error, {
                message: "EC2 Metadata token request returned error"
              });
            } else if (error.message === "TimeoutError" || [403, 404, 405].includes(error.statusCode)) {
              disableFetchToken = true;
            }
            return getCredentials(maxRetries, { ...endpoint, timeout });
          }
          return getCredentials(maxRetries, {
            ...endpoint,
            headers: {
              "x-aws-ec2-metadata-token": token
            },
            timeout
          });
        }
      };
    };
    var getMetadataToken = async (options) => (0, httpRequest_1.httpRequest)({
      ...options,
      path: IMDS_TOKEN_PATH,
      method: "PUT",
      headers: {
        "x-aws-ec2-metadata-token-ttl-seconds": "21600"
      }
    });
    var getProfile = async (options) => (await (0, httpRequest_1.httpRequest)({ ...options, path: IMDS_PATH })).toString();
    var getCredentialsFromProfile = async (profile, options) => {
      const credsResponse = JSON.parse((await (0, httpRequest_1.httpRequest)({
        ...options,
        path: IMDS_PATH + profile
      })).toString());
      if (!(0, ImdsCredentials_1.isImdsCredentials)(credsResponse)) {
        throw new property_provider_1.CredentialsProviderError("Invalid response received from instance metadata service.");
      }
      return (0, ImdsCredentials_1.fromImdsCredentials)(credsResponse);
    };
  }
});

// node_modules/@aws-sdk/credential-provider-imds/dist-cjs/types.js
var require_types3 = __commonJS({
  "node_modules/@aws-sdk/credential-provider-imds/dist-cjs/types.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/@aws-sdk/credential-provider-imds/dist-cjs/index.js
var require_dist_cjs27 = __commonJS({
  "node_modules/@aws-sdk/credential-provider-imds/dist-cjs/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getInstanceMetadataEndpoint = exports.httpRequest = void 0;
    var tslib_1 = require_tslib();
    tslib_1.__exportStar(require_fromContainerMetadata(), exports);
    tslib_1.__exportStar(require_fromInstanceMetadata(), exports);
    tslib_1.__exportStar(require_RemoteProviderInit(), exports);
    tslib_1.__exportStar(require_types3(), exports);
    var httpRequest_1 = require_httpRequest2();
    Object.defineProperty(exports, "httpRequest", { enumerable: true, get: function() {
      return httpRequest_1.httpRequest;
    } });
    var getInstanceMetadataEndpoint_1 = require_getInstanceMetadataEndpoint();
    Object.defineProperty(exports, "getInstanceMetadataEndpoint", { enumerable: true, get: function() {
      return getInstanceMetadataEndpoint_1.getInstanceMetadataEndpoint;
    } });
  }
});

// node_modules/@aws-sdk/credential-provider-ini/dist-cjs/resolveCredentialSource.js
var require_resolveCredentialSource = __commonJS({
  "node_modules/@aws-sdk/credential-provider-ini/dist-cjs/resolveCredentialSource.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.resolveCredentialSource = void 0;
    var credential_provider_env_1 = require_dist_cjs22();
    var credential_provider_imds_1 = require_dist_cjs27();
    var property_provider_1 = require_dist_cjs14();
    var resolveCredentialSource = (credentialSource, profileName) => {
      const sourceProvidersMap = {
        EcsContainer: credential_provider_imds_1.fromContainerMetadata,
        Ec2InstanceMetadata: credential_provider_imds_1.fromInstanceMetadata,
        Environment: credential_provider_env_1.fromEnv
      };
      if (credentialSource in sourceProvidersMap) {
        return sourceProvidersMap[credentialSource]();
      } else {
        throw new property_provider_1.CredentialsProviderError(`Unsupported credential source in profile ${profileName}. Got ${credentialSource}, expected EcsContainer or Ec2InstanceMetadata or Environment.`);
      }
    };
    exports.resolveCredentialSource = resolveCredentialSource;
  }
});

// node_modules/@aws-sdk/credential-provider-ini/dist-cjs/resolveAssumeRoleCredentials.js
var require_resolveAssumeRoleCredentials = __commonJS({
  "node_modules/@aws-sdk/credential-provider-ini/dist-cjs/resolveAssumeRoleCredentials.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.resolveAssumeRoleCredentials = exports.isAssumeRoleProfile = void 0;
    var property_provider_1 = require_dist_cjs14();
    var shared_ini_file_loader_1 = require_dist_cjs23();
    var resolveCredentialSource_1 = require_resolveCredentialSource();
    var resolveProfileData_1 = require_resolveProfileData();
    var isAssumeRoleProfile = (arg) => Boolean(arg) && typeof arg === "object" && typeof arg.role_arn === "string" && ["undefined", "string"].indexOf(typeof arg.role_session_name) > -1 && ["undefined", "string"].indexOf(typeof arg.external_id) > -1 && ["undefined", "string"].indexOf(typeof arg.mfa_serial) > -1 && (isAssumeRoleWithSourceProfile(arg) || isAssumeRoleWithProviderProfile(arg));
    exports.isAssumeRoleProfile = isAssumeRoleProfile;
    var isAssumeRoleWithSourceProfile = (arg) => typeof arg.source_profile === "string" && typeof arg.credential_source === "undefined";
    var isAssumeRoleWithProviderProfile = (arg) => typeof arg.credential_source === "string" && typeof arg.source_profile === "undefined";
    var resolveAssumeRoleCredentials = async (profileName, profiles, options, visitedProfiles = {}) => {
      const data = profiles[profileName];
      if (!options.roleAssumer) {
        throw new property_provider_1.CredentialsProviderError(`Profile ${profileName} requires a role to be assumed, but no role assumption callback was provided.`, false);
      }
      const { source_profile } = data;
      if (source_profile && source_profile in visitedProfiles) {
        throw new property_provider_1.CredentialsProviderError(`Detected a cycle attempting to resolve credentials for profile ${(0, shared_ini_file_loader_1.getProfileName)(options)}. Profiles visited: ` + Object.keys(visitedProfiles).join(", "), false);
      }
      const sourceCredsProvider = source_profile ? (0, resolveProfileData_1.resolveProfileData)(source_profile, profiles, options, {
        ...visitedProfiles,
        [source_profile]: true
      }) : (0, resolveCredentialSource_1.resolveCredentialSource)(data.credential_source, profileName)();
      const params = {
        RoleArn: data.role_arn,
        RoleSessionName: data.role_session_name || `aws-sdk-js-${Date.now()}`,
        ExternalId: data.external_id
      };
      const { mfa_serial } = data;
      if (mfa_serial) {
        if (!options.mfaCodeProvider) {
          throw new property_provider_1.CredentialsProviderError(`Profile ${profileName} requires multi-factor authentication, but no MFA code callback was provided.`, false);
        }
        params.SerialNumber = mfa_serial;
        params.TokenCode = await options.mfaCodeProvider(mfa_serial);
      }
      const sourceCreds = await sourceCredsProvider;
      return options.roleAssumer(sourceCreds, params);
    };
    exports.resolveAssumeRoleCredentials = resolveAssumeRoleCredentials;
  }
});

// node_modules/@aws-sdk/credential-provider-sso/dist-cjs/isSsoProfile.js
var require_isSsoProfile = __commonJS({
  "node_modules/@aws-sdk/credential-provider-sso/dist-cjs/isSsoProfile.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isSsoProfile = void 0;
    var isSsoProfile = (arg) => arg && (typeof arg.sso_start_url === "string" || typeof arg.sso_account_id === "string" || typeof arg.sso_region === "string" || typeof arg.sso_role_name === "string");
    exports.isSsoProfile = isSsoProfile;
  }
});

// node_modules/@aws-sdk/client-sso/dist-cjs/models/SSOServiceException.js
var require_SSOServiceException = __commonJS({
  "node_modules/@aws-sdk/client-sso/dist-cjs/models/SSOServiceException.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SSOServiceException = void 0;
    var smithy_client_1 = require_dist_cjs3();
    var SSOServiceException = class extends smithy_client_1.ServiceException {
      constructor(options) {
        super(options);
        Object.setPrototypeOf(this, SSOServiceException.prototype);
      }
    };
    exports.SSOServiceException = SSOServiceException;
  }
});

// node_modules/@aws-sdk/client-sso/dist-cjs/models/models_0.js
var require_models_03 = __commonJS({
  "node_modules/@aws-sdk/client-sso/dist-cjs/models/models_0.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LogoutRequest = exports.ListAccountsResponse = exports.ListAccountsRequest = exports.ListAccountRolesResponse = exports.RoleInfo = exports.ListAccountRolesRequest = exports.UnauthorizedException = exports.TooManyRequestsException = exports.ResourceNotFoundException = exports.InvalidRequestException = exports.GetRoleCredentialsResponse = exports.RoleCredentials = exports.GetRoleCredentialsRequest = exports.AccountInfo = void 0;
    var smithy_client_1 = require_dist_cjs3();
    var SSOServiceException_1 = require_SSOServiceException();
    var AccountInfo;
    (function(AccountInfo2) {
      AccountInfo2.filterSensitiveLog = (obj) => ({
        ...obj
      });
    })(AccountInfo = exports.AccountInfo || (exports.AccountInfo = {}));
    var GetRoleCredentialsRequest;
    (function(GetRoleCredentialsRequest2) {
      GetRoleCredentialsRequest2.filterSensitiveLog = (obj) => ({
        ...obj,
        ...obj.accessToken && { accessToken: smithy_client_1.SENSITIVE_STRING }
      });
    })(GetRoleCredentialsRequest = exports.GetRoleCredentialsRequest || (exports.GetRoleCredentialsRequest = {}));
    var RoleCredentials;
    (function(RoleCredentials2) {
      RoleCredentials2.filterSensitiveLog = (obj) => ({
        ...obj,
        ...obj.secretAccessKey && { secretAccessKey: smithy_client_1.SENSITIVE_STRING },
        ...obj.sessionToken && { sessionToken: smithy_client_1.SENSITIVE_STRING }
      });
    })(RoleCredentials = exports.RoleCredentials || (exports.RoleCredentials = {}));
    var GetRoleCredentialsResponse;
    (function(GetRoleCredentialsResponse2) {
      GetRoleCredentialsResponse2.filterSensitiveLog = (obj) => ({
        ...obj,
        ...obj.roleCredentials && { roleCredentials: RoleCredentials.filterSensitiveLog(obj.roleCredentials) }
      });
    })(GetRoleCredentialsResponse = exports.GetRoleCredentialsResponse || (exports.GetRoleCredentialsResponse = {}));
    var InvalidRequestException = class extends SSOServiceException_1.SSOServiceException {
      constructor(opts) {
        super({
          name: "InvalidRequestException",
          $fault: "client",
          ...opts
        });
        this.name = "InvalidRequestException";
        this.$fault = "client";
        Object.setPrototypeOf(this, InvalidRequestException.prototype);
      }
    };
    exports.InvalidRequestException = InvalidRequestException;
    var ResourceNotFoundException = class extends SSOServiceException_1.SSOServiceException {
      constructor(opts) {
        super({
          name: "ResourceNotFoundException",
          $fault: "client",
          ...opts
        });
        this.name = "ResourceNotFoundException";
        this.$fault = "client";
        Object.setPrototypeOf(this, ResourceNotFoundException.prototype);
      }
    };
    exports.ResourceNotFoundException = ResourceNotFoundException;
    var TooManyRequestsException = class extends SSOServiceException_1.SSOServiceException {
      constructor(opts) {
        super({
          name: "TooManyRequestsException",
          $fault: "client",
          ...opts
        });
        this.name = "TooManyRequestsException";
        this.$fault = "client";
        Object.setPrototypeOf(this, TooManyRequestsException.prototype);
      }
    };
    exports.TooManyRequestsException = TooManyRequestsException;
    var UnauthorizedException = class extends SSOServiceException_1.SSOServiceException {
      constructor(opts) {
        super({
          name: "UnauthorizedException",
          $fault: "client",
          ...opts
        });
        this.name = "UnauthorizedException";
        this.$fault = "client";
        Object.setPrototypeOf(this, UnauthorizedException.prototype);
      }
    };
    exports.UnauthorizedException = UnauthorizedException;
    var ListAccountRolesRequest;
    (function(ListAccountRolesRequest2) {
      ListAccountRolesRequest2.filterSensitiveLog = (obj) => ({
        ...obj,
        ...obj.accessToken && { accessToken: smithy_client_1.SENSITIVE_STRING }
      });
    })(ListAccountRolesRequest = exports.ListAccountRolesRequest || (exports.ListAccountRolesRequest = {}));
    var RoleInfo;
    (function(RoleInfo2) {
      RoleInfo2.filterSensitiveLog = (obj) => ({
        ...obj
      });
    })(RoleInfo = exports.RoleInfo || (exports.RoleInfo = {}));
    var ListAccountRolesResponse;
    (function(ListAccountRolesResponse2) {
      ListAccountRolesResponse2.filterSensitiveLog = (obj) => ({
        ...obj
      });
    })(ListAccountRolesResponse = exports.ListAccountRolesResponse || (exports.ListAccountRolesResponse = {}));
    var ListAccountsRequest;
    (function(ListAccountsRequest2) {
      ListAccountsRequest2.filterSensitiveLog = (obj) => ({
        ...obj,
        ...obj.accessToken && { accessToken: smithy_client_1.SENSITIVE_STRING }
      });
    })(ListAccountsRequest = exports.ListAccountsRequest || (exports.ListAccountsRequest = {}));
    var ListAccountsResponse;
    (function(ListAccountsResponse2) {
      ListAccountsResponse2.filterSensitiveLog = (obj) => ({
        ...obj
      });
    })(ListAccountsResponse = exports.ListAccountsResponse || (exports.ListAccountsResponse = {}));
    var LogoutRequest;
    (function(LogoutRequest2) {
      LogoutRequest2.filterSensitiveLog = (obj) => ({
        ...obj,
        ...obj.accessToken && { accessToken: smithy_client_1.SENSITIVE_STRING }
      });
    })(LogoutRequest = exports.LogoutRequest || (exports.LogoutRequest = {}));
  }
});

// node_modules/@aws-sdk/client-sso/dist-cjs/protocols/Aws_restJson1.js
var require_Aws_restJson1 = __commonJS({
  "node_modules/@aws-sdk/client-sso/dist-cjs/protocols/Aws_restJson1.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.deserializeAws_restJson1LogoutCommand = exports.deserializeAws_restJson1ListAccountsCommand = exports.deserializeAws_restJson1ListAccountRolesCommand = exports.deserializeAws_restJson1GetRoleCredentialsCommand = exports.serializeAws_restJson1LogoutCommand = exports.serializeAws_restJson1ListAccountsCommand = exports.serializeAws_restJson1ListAccountRolesCommand = exports.serializeAws_restJson1GetRoleCredentialsCommand = void 0;
    var protocol_http_1 = require_dist_cjs4();
    var smithy_client_1 = require_dist_cjs3();
    var models_0_1 = require_models_03();
    var SSOServiceException_1 = require_SSOServiceException();
    var serializeAws_restJson1GetRoleCredentialsCommand = async (input, context) => {
      const { hostname, protocol = "https", port, path: basePath } = await context.endpoint();
      const headers = {
        ...isSerializableHeaderValue(input.accessToken) && { "x-amz-sso_bearer_token": input.accessToken }
      };
      const resolvedPath = `${(basePath === null || basePath === void 0 ? void 0 : basePath.endsWith("/")) ? basePath.slice(0, -1) : basePath || ""}/federation/credentials`;
      const query = {
        ...input.roleName !== void 0 && { role_name: input.roleName },
        ...input.accountId !== void 0 && { account_id: input.accountId }
      };
      let body;
      return new protocol_http_1.HttpRequest({
        protocol,
        hostname,
        port,
        method: "GET",
        headers,
        path: resolvedPath,
        query,
        body
      });
    };
    exports.serializeAws_restJson1GetRoleCredentialsCommand = serializeAws_restJson1GetRoleCredentialsCommand;
    var serializeAws_restJson1ListAccountRolesCommand = async (input, context) => {
      const { hostname, protocol = "https", port, path: basePath } = await context.endpoint();
      const headers = {
        ...isSerializableHeaderValue(input.accessToken) && { "x-amz-sso_bearer_token": input.accessToken }
      };
      const resolvedPath = `${(basePath === null || basePath === void 0 ? void 0 : basePath.endsWith("/")) ? basePath.slice(0, -1) : basePath || ""}/assignment/roles`;
      const query = {
        ...input.nextToken !== void 0 && { next_token: input.nextToken },
        ...input.maxResults !== void 0 && { max_result: input.maxResults.toString() },
        ...input.accountId !== void 0 && { account_id: input.accountId }
      };
      let body;
      return new protocol_http_1.HttpRequest({
        protocol,
        hostname,
        port,
        method: "GET",
        headers,
        path: resolvedPath,
        query,
        body
      });
    };
    exports.serializeAws_restJson1ListAccountRolesCommand = serializeAws_restJson1ListAccountRolesCommand;
    var serializeAws_restJson1ListAccountsCommand = async (input, context) => {
      const { hostname, protocol = "https", port, path: basePath } = await context.endpoint();
      const headers = {
        ...isSerializableHeaderValue(input.accessToken) && { "x-amz-sso_bearer_token": input.accessToken }
      };
      const resolvedPath = `${(basePath === null || basePath === void 0 ? void 0 : basePath.endsWith("/")) ? basePath.slice(0, -1) : basePath || ""}/assignment/accounts`;
      const query = {
        ...input.nextToken !== void 0 && { next_token: input.nextToken },
        ...input.maxResults !== void 0 && { max_result: input.maxResults.toString() }
      };
      let body;
      return new protocol_http_1.HttpRequest({
        protocol,
        hostname,
        port,
        method: "GET",
        headers,
        path: resolvedPath,
        query,
        body
      });
    };
    exports.serializeAws_restJson1ListAccountsCommand = serializeAws_restJson1ListAccountsCommand;
    var serializeAws_restJson1LogoutCommand = async (input, context) => {
      const { hostname, protocol = "https", port, path: basePath } = await context.endpoint();
      const headers = {
        ...isSerializableHeaderValue(input.accessToken) && { "x-amz-sso_bearer_token": input.accessToken }
      };
      const resolvedPath = `${(basePath === null || basePath === void 0 ? void 0 : basePath.endsWith("/")) ? basePath.slice(0, -1) : basePath || ""}/logout`;
      let body;
      return new protocol_http_1.HttpRequest({
        protocol,
        hostname,
        port,
        method: "POST",
        headers,
        path: resolvedPath,
        body
      });
    };
    exports.serializeAws_restJson1LogoutCommand = serializeAws_restJson1LogoutCommand;
    var deserializeAws_restJson1GetRoleCredentialsCommand = async (output, context) => {
      if (output.statusCode !== 200 && output.statusCode >= 300) {
        return deserializeAws_restJson1GetRoleCredentialsCommandError(output, context);
      }
      const contents = {
        $metadata: deserializeMetadata(output),
        roleCredentials: void 0
      };
      const data = (0, smithy_client_1.expectNonNull)((0, smithy_client_1.expectObject)(await parseBody(output.body, context)), "body");
      if (data.roleCredentials !== void 0 && data.roleCredentials !== null) {
        contents.roleCredentials = deserializeAws_restJson1RoleCredentials(data.roleCredentials, context);
      }
      return Promise.resolve(contents);
    };
    exports.deserializeAws_restJson1GetRoleCredentialsCommand = deserializeAws_restJson1GetRoleCredentialsCommand;
    var deserializeAws_restJson1GetRoleCredentialsCommandError = async (output, context) => {
      const parsedOutput = {
        ...output,
        body: await parseBody(output.body, context)
      };
      let response;
      let errorCode = "UnknownError";
      errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
      switch (errorCode) {
        case "InvalidRequestException":
        case "com.amazonaws.sso#InvalidRequestException":
          throw await deserializeAws_restJson1InvalidRequestExceptionResponse(parsedOutput, context);
        case "ResourceNotFoundException":
        case "com.amazonaws.sso#ResourceNotFoundException":
          throw await deserializeAws_restJson1ResourceNotFoundExceptionResponse(parsedOutput, context);
        case "TooManyRequestsException":
        case "com.amazonaws.sso#TooManyRequestsException":
          throw await deserializeAws_restJson1TooManyRequestsExceptionResponse(parsedOutput, context);
        case "UnauthorizedException":
        case "com.amazonaws.sso#UnauthorizedException":
          throw await deserializeAws_restJson1UnauthorizedExceptionResponse(parsedOutput, context);
        default:
          const parsedBody = parsedOutput.body;
          response = new SSOServiceException_1.SSOServiceException({
            name: parsedBody.code || parsedBody.Code || errorCode,
            $fault: "client",
            $metadata: deserializeMetadata(output)
          });
          throw (0, smithy_client_1.decorateServiceException)(response, parsedBody);
      }
    };
    var deserializeAws_restJson1ListAccountRolesCommand = async (output, context) => {
      if (output.statusCode !== 200 && output.statusCode >= 300) {
        return deserializeAws_restJson1ListAccountRolesCommandError(output, context);
      }
      const contents = {
        $metadata: deserializeMetadata(output),
        nextToken: void 0,
        roleList: void 0
      };
      const data = (0, smithy_client_1.expectNonNull)((0, smithy_client_1.expectObject)(await parseBody(output.body, context)), "body");
      if (data.nextToken !== void 0 && data.nextToken !== null) {
        contents.nextToken = (0, smithy_client_1.expectString)(data.nextToken);
      }
      if (data.roleList !== void 0 && data.roleList !== null) {
        contents.roleList = deserializeAws_restJson1RoleListType(data.roleList, context);
      }
      return Promise.resolve(contents);
    };
    exports.deserializeAws_restJson1ListAccountRolesCommand = deserializeAws_restJson1ListAccountRolesCommand;
    var deserializeAws_restJson1ListAccountRolesCommandError = async (output, context) => {
      const parsedOutput = {
        ...output,
        body: await parseBody(output.body, context)
      };
      let response;
      let errorCode = "UnknownError";
      errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
      switch (errorCode) {
        case "InvalidRequestException":
        case "com.amazonaws.sso#InvalidRequestException":
          throw await deserializeAws_restJson1InvalidRequestExceptionResponse(parsedOutput, context);
        case "ResourceNotFoundException":
        case "com.amazonaws.sso#ResourceNotFoundException":
          throw await deserializeAws_restJson1ResourceNotFoundExceptionResponse(parsedOutput, context);
        case "TooManyRequestsException":
        case "com.amazonaws.sso#TooManyRequestsException":
          throw await deserializeAws_restJson1TooManyRequestsExceptionResponse(parsedOutput, context);
        case "UnauthorizedException":
        case "com.amazonaws.sso#UnauthorizedException":
          throw await deserializeAws_restJson1UnauthorizedExceptionResponse(parsedOutput, context);
        default:
          const parsedBody = parsedOutput.body;
          response = new SSOServiceException_1.SSOServiceException({
            name: parsedBody.code || parsedBody.Code || errorCode,
            $fault: "client",
            $metadata: deserializeMetadata(output)
          });
          throw (0, smithy_client_1.decorateServiceException)(response, parsedBody);
      }
    };
    var deserializeAws_restJson1ListAccountsCommand = async (output, context) => {
      if (output.statusCode !== 200 && output.statusCode >= 300) {
        return deserializeAws_restJson1ListAccountsCommandError(output, context);
      }
      const contents = {
        $metadata: deserializeMetadata(output),
        accountList: void 0,
        nextToken: void 0
      };
      const data = (0, smithy_client_1.expectNonNull)((0, smithy_client_1.expectObject)(await parseBody(output.body, context)), "body");
      if (data.accountList !== void 0 && data.accountList !== null) {
        contents.accountList = deserializeAws_restJson1AccountListType(data.accountList, context);
      }
      if (data.nextToken !== void 0 && data.nextToken !== null) {
        contents.nextToken = (0, smithy_client_1.expectString)(data.nextToken);
      }
      return Promise.resolve(contents);
    };
    exports.deserializeAws_restJson1ListAccountsCommand = deserializeAws_restJson1ListAccountsCommand;
    var deserializeAws_restJson1ListAccountsCommandError = async (output, context) => {
      const parsedOutput = {
        ...output,
        body: await parseBody(output.body, context)
      };
      let response;
      let errorCode = "UnknownError";
      errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
      switch (errorCode) {
        case "InvalidRequestException":
        case "com.amazonaws.sso#InvalidRequestException":
          throw await deserializeAws_restJson1InvalidRequestExceptionResponse(parsedOutput, context);
        case "ResourceNotFoundException":
        case "com.amazonaws.sso#ResourceNotFoundException":
          throw await deserializeAws_restJson1ResourceNotFoundExceptionResponse(parsedOutput, context);
        case "TooManyRequestsException":
        case "com.amazonaws.sso#TooManyRequestsException":
          throw await deserializeAws_restJson1TooManyRequestsExceptionResponse(parsedOutput, context);
        case "UnauthorizedException":
        case "com.amazonaws.sso#UnauthorizedException":
          throw await deserializeAws_restJson1UnauthorizedExceptionResponse(parsedOutput, context);
        default:
          const parsedBody = parsedOutput.body;
          response = new SSOServiceException_1.SSOServiceException({
            name: parsedBody.code || parsedBody.Code || errorCode,
            $fault: "client",
            $metadata: deserializeMetadata(output)
          });
          throw (0, smithy_client_1.decorateServiceException)(response, parsedBody);
      }
    };
    var deserializeAws_restJson1LogoutCommand = async (output, context) => {
      if (output.statusCode !== 200 && output.statusCode >= 300) {
        return deserializeAws_restJson1LogoutCommandError(output, context);
      }
      const contents = {
        $metadata: deserializeMetadata(output)
      };
      await collectBody(output.body, context);
      return Promise.resolve(contents);
    };
    exports.deserializeAws_restJson1LogoutCommand = deserializeAws_restJson1LogoutCommand;
    var deserializeAws_restJson1LogoutCommandError = async (output, context) => {
      const parsedOutput = {
        ...output,
        body: await parseBody(output.body, context)
      };
      let response;
      let errorCode = "UnknownError";
      errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
      switch (errorCode) {
        case "InvalidRequestException":
        case "com.amazonaws.sso#InvalidRequestException":
          throw await deserializeAws_restJson1InvalidRequestExceptionResponse(parsedOutput, context);
        case "TooManyRequestsException":
        case "com.amazonaws.sso#TooManyRequestsException":
          throw await deserializeAws_restJson1TooManyRequestsExceptionResponse(parsedOutput, context);
        case "UnauthorizedException":
        case "com.amazonaws.sso#UnauthorizedException":
          throw await deserializeAws_restJson1UnauthorizedExceptionResponse(parsedOutput, context);
        default:
          const parsedBody = parsedOutput.body;
          response = new SSOServiceException_1.SSOServiceException({
            name: parsedBody.code || parsedBody.Code || errorCode,
            $fault: "client",
            $metadata: deserializeMetadata(output)
          });
          throw (0, smithy_client_1.decorateServiceException)(response, parsedBody);
      }
    };
    var deserializeAws_restJson1InvalidRequestExceptionResponse = async (parsedOutput, context) => {
      const contents = {};
      const data = parsedOutput.body;
      if (data.message !== void 0 && data.message !== null) {
        contents.message = (0, smithy_client_1.expectString)(data.message);
      }
      const exception = new models_0_1.InvalidRequestException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents
      });
      return (0, smithy_client_1.decorateServiceException)(exception, parsedOutput.body);
    };
    var deserializeAws_restJson1ResourceNotFoundExceptionResponse = async (parsedOutput, context) => {
      const contents = {};
      const data = parsedOutput.body;
      if (data.message !== void 0 && data.message !== null) {
        contents.message = (0, smithy_client_1.expectString)(data.message);
      }
      const exception = new models_0_1.ResourceNotFoundException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents
      });
      return (0, smithy_client_1.decorateServiceException)(exception, parsedOutput.body);
    };
    var deserializeAws_restJson1TooManyRequestsExceptionResponse = async (parsedOutput, context) => {
      const contents = {};
      const data = parsedOutput.body;
      if (data.message !== void 0 && data.message !== null) {
        contents.message = (0, smithy_client_1.expectString)(data.message);
      }
      const exception = new models_0_1.TooManyRequestsException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents
      });
      return (0, smithy_client_1.decorateServiceException)(exception, parsedOutput.body);
    };
    var deserializeAws_restJson1UnauthorizedExceptionResponse = async (parsedOutput, context) => {
      const contents = {};
      const data = parsedOutput.body;
      if (data.message !== void 0 && data.message !== null) {
        contents.message = (0, smithy_client_1.expectString)(data.message);
      }
      const exception = new models_0_1.UnauthorizedException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents
      });
      return (0, smithy_client_1.decorateServiceException)(exception, parsedOutput.body);
    };
    var deserializeAws_restJson1AccountInfo = (output, context) => {
      return {
        accountId: (0, smithy_client_1.expectString)(output.accountId),
        accountName: (0, smithy_client_1.expectString)(output.accountName),
        emailAddress: (0, smithy_client_1.expectString)(output.emailAddress)
      };
    };
    var deserializeAws_restJson1AccountListType = (output, context) => {
      const retVal = (output || []).filter((e2) => e2 != null).map((entry) => {
        if (entry === null) {
          return null;
        }
        return deserializeAws_restJson1AccountInfo(entry, context);
      });
      return retVal;
    };
    var deserializeAws_restJson1RoleCredentials = (output, context) => {
      return {
        accessKeyId: (0, smithy_client_1.expectString)(output.accessKeyId),
        expiration: (0, smithy_client_1.expectLong)(output.expiration),
        secretAccessKey: (0, smithy_client_1.expectString)(output.secretAccessKey),
        sessionToken: (0, smithy_client_1.expectString)(output.sessionToken)
      };
    };
    var deserializeAws_restJson1RoleInfo = (output, context) => {
      return {
        accountId: (0, smithy_client_1.expectString)(output.accountId),
        roleName: (0, smithy_client_1.expectString)(output.roleName)
      };
    };
    var deserializeAws_restJson1RoleListType = (output, context) => {
      const retVal = (output || []).filter((e2) => e2 != null).map((entry) => {
        if (entry === null) {
          return null;
        }
        return deserializeAws_restJson1RoleInfo(entry, context);
      });
      return retVal;
    };
    var deserializeMetadata = (output) => {
      var _a;
      return {
        httpStatusCode: output.statusCode,
        requestId: (_a = output.headers["x-amzn-requestid"]) !== null && _a !== void 0 ? _a : output.headers["x-amzn-request-id"],
        extendedRequestId: output.headers["x-amz-id-2"],
        cfId: output.headers["x-amz-cf-id"]
      };
    };
    var collectBody = (streamBody = new Uint8Array(), context) => {
      if (streamBody instanceof Uint8Array) {
        return Promise.resolve(streamBody);
      }
      return context.streamCollector(streamBody) || Promise.resolve(new Uint8Array());
    };
    var collectBodyString = (streamBody, context) => collectBody(streamBody, context).then((body) => context.utf8Encoder(body));
    var isSerializableHeaderValue = (value) => value !== void 0 && value !== null && value !== "" && (!Object.getOwnPropertyNames(value).includes("length") || value.length != 0) && (!Object.getOwnPropertyNames(value).includes("size") || value.size != 0);
    var parseBody = (streamBody, context) => collectBodyString(streamBody, context).then((encoded) => {
      if (encoded.length) {
        return JSON.parse(encoded);
      }
      return {};
    });
    var loadRestJsonErrorCode = (output, data) => {
      const findKey = (object, key) => Object.keys(object).find((k) => k.toLowerCase() === key.toLowerCase());
      const sanitizeErrorCode = (rawValue) => {
        let cleanValue = rawValue;
        if (cleanValue.indexOf(":") >= 0) {
          cleanValue = cleanValue.split(":")[0];
        }
        if (cleanValue.indexOf("#") >= 0) {
          cleanValue = cleanValue.split("#")[1];
        }
        return cleanValue;
      };
      const headerKey = findKey(output.headers, "x-amzn-errortype");
      if (headerKey !== void 0) {
        return sanitizeErrorCode(output.headers[headerKey]);
      }
      if (data.code !== void 0) {
        return sanitizeErrorCode(data.code);
      }
      if (data["__type"] !== void 0) {
        return sanitizeErrorCode(data["__type"]);
      }
      return "";
    };
  }
});

// node_modules/@aws-sdk/client-sso/dist-cjs/commands/GetRoleCredentialsCommand.js
var require_GetRoleCredentialsCommand = __commonJS({
  "node_modules/@aws-sdk/client-sso/dist-cjs/commands/GetRoleCredentialsCommand.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.GetRoleCredentialsCommand = void 0;
    var middleware_serde_1 = require_dist_cjs();
    var smithy_client_1 = require_dist_cjs3();
    var models_0_1 = require_models_03();
    var Aws_restJson1_1 = require_Aws_restJson1();
    var GetRoleCredentialsCommand = class extends smithy_client_1.Command {
      constructor(input) {
        super();
        this.input = input;
      }
      resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use((0, middleware_serde_1.getSerdePlugin)(configuration, this.serialize, this.deserialize));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "SSOClient";
        const commandName = "GetRoleCredentialsCommand";
        const handlerExecutionContext = {
          logger,
          clientName,
          commandName,
          inputFilterSensitiveLog: models_0_1.GetRoleCredentialsRequest.filterSensitiveLog,
          outputFilterSensitiveLog: models_0_1.GetRoleCredentialsResponse.filterSensitiveLog
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
      }
      serialize(input, context) {
        return (0, Aws_restJson1_1.serializeAws_restJson1GetRoleCredentialsCommand)(input, context);
      }
      deserialize(output, context) {
        return (0, Aws_restJson1_1.deserializeAws_restJson1GetRoleCredentialsCommand)(output, context);
      }
    };
    exports.GetRoleCredentialsCommand = GetRoleCredentialsCommand;
  }
});

// node_modules/@aws-sdk/client-sso/dist-cjs/commands/ListAccountRolesCommand.js
var require_ListAccountRolesCommand = __commonJS({
  "node_modules/@aws-sdk/client-sso/dist-cjs/commands/ListAccountRolesCommand.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ListAccountRolesCommand = void 0;
    var middleware_serde_1 = require_dist_cjs();
    var smithy_client_1 = require_dist_cjs3();
    var models_0_1 = require_models_03();
    var Aws_restJson1_1 = require_Aws_restJson1();
    var ListAccountRolesCommand = class extends smithy_client_1.Command {
      constructor(input) {
        super();
        this.input = input;
      }
      resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use((0, middleware_serde_1.getSerdePlugin)(configuration, this.serialize, this.deserialize));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "SSOClient";
        const commandName = "ListAccountRolesCommand";
        const handlerExecutionContext = {
          logger,
          clientName,
          commandName,
          inputFilterSensitiveLog: models_0_1.ListAccountRolesRequest.filterSensitiveLog,
          outputFilterSensitiveLog: models_0_1.ListAccountRolesResponse.filterSensitiveLog
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
      }
      serialize(input, context) {
        return (0, Aws_restJson1_1.serializeAws_restJson1ListAccountRolesCommand)(input, context);
      }
      deserialize(output, context) {
        return (0, Aws_restJson1_1.deserializeAws_restJson1ListAccountRolesCommand)(output, context);
      }
    };
    exports.ListAccountRolesCommand = ListAccountRolesCommand;
  }
});

// node_modules/@aws-sdk/client-sso/dist-cjs/commands/ListAccountsCommand.js
var require_ListAccountsCommand = __commonJS({
  "node_modules/@aws-sdk/client-sso/dist-cjs/commands/ListAccountsCommand.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ListAccountsCommand = void 0;
    var middleware_serde_1 = require_dist_cjs();
    var smithy_client_1 = require_dist_cjs3();
    var models_0_1 = require_models_03();
    var Aws_restJson1_1 = require_Aws_restJson1();
    var ListAccountsCommand = class extends smithy_client_1.Command {
      constructor(input) {
        super();
        this.input = input;
      }
      resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use((0, middleware_serde_1.getSerdePlugin)(configuration, this.serialize, this.deserialize));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "SSOClient";
        const commandName = "ListAccountsCommand";
        const handlerExecutionContext = {
          logger,
          clientName,
          commandName,
          inputFilterSensitiveLog: models_0_1.ListAccountsRequest.filterSensitiveLog,
          outputFilterSensitiveLog: models_0_1.ListAccountsResponse.filterSensitiveLog
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
      }
      serialize(input, context) {
        return (0, Aws_restJson1_1.serializeAws_restJson1ListAccountsCommand)(input, context);
      }
      deserialize(output, context) {
        return (0, Aws_restJson1_1.deserializeAws_restJson1ListAccountsCommand)(output, context);
      }
    };
    exports.ListAccountsCommand = ListAccountsCommand;
  }
});

// node_modules/@aws-sdk/client-sso/dist-cjs/commands/LogoutCommand.js
var require_LogoutCommand = __commonJS({
  "node_modules/@aws-sdk/client-sso/dist-cjs/commands/LogoutCommand.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LogoutCommand = void 0;
    var middleware_serde_1 = require_dist_cjs();
    var smithy_client_1 = require_dist_cjs3();
    var models_0_1 = require_models_03();
    var Aws_restJson1_1 = require_Aws_restJson1();
    var LogoutCommand = class extends smithy_client_1.Command {
      constructor(input) {
        super();
        this.input = input;
      }
      resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use((0, middleware_serde_1.getSerdePlugin)(configuration, this.serialize, this.deserialize));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "SSOClient";
        const commandName = "LogoutCommand";
        const handlerExecutionContext = {
          logger,
          clientName,
          commandName,
          inputFilterSensitiveLog: models_0_1.LogoutRequest.filterSensitiveLog,
          outputFilterSensitiveLog: (output) => output
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
      }
      serialize(input, context) {
        return (0, Aws_restJson1_1.serializeAws_restJson1LogoutCommand)(input, context);
      }
      deserialize(output, context) {
        return (0, Aws_restJson1_1.deserializeAws_restJson1LogoutCommand)(output, context);
      }
    };
    exports.LogoutCommand = LogoutCommand;
  }
});

// node_modules/@aws-sdk/client-sso/package.json
var require_package3 = __commonJS({
  "node_modules/@aws-sdk/client-sso/package.json"(exports, module2) {
    module2.exports = {
      _from: "@aws-sdk/client-sso@3.105.0",
      _id: "@aws-sdk/client-sso@3.105.0",
      _inBundle: false,
      _integrity: "sha512-Lp92m3ayckXpAElpgZ8E6JEGB7B5sBsjCkTmYeZq3uVXF8uCVMQFmFo4v2yndLQ3NFCEE8qN2PE8obLDOAsNIA==",
      _location: "/@aws-sdk/client-sso",
      _phantomChildren: {},
      _requested: {
        type: "version",
        registry: true,
        raw: "@aws-sdk/client-sso@3.105.0",
        name: "@aws-sdk/client-sso",
        escapedName: "@aws-sdk%2fclient-sso",
        scope: "@aws-sdk",
        rawSpec: "3.105.0",
        saveSpec: null,
        fetchSpec: "3.105.0"
      },
      _requiredBy: [
        "/@aws-sdk/credential-provider-sso"
      ],
      _resolved: "https://registry.npmjs.org/@aws-sdk/client-sso/-/client-sso-3.105.0.tgz",
      _shasum: "4a46666f58c19d9690b03c4b220abcd92284344f",
      _spec: "@aws-sdk/client-sso@3.105.0",
      _where: "/Users/carmenluo/test-cdk/node_modules/@aws-sdk/credential-provider-sso",
      author: {
        name: "AWS SDK for JavaScript Team",
        url: "https://aws.amazon.com/javascript/"
      },
      browser: {
        "./dist-es/runtimeConfig": "./dist-es/runtimeConfig.browser"
      },
      bugs: {
        url: "https://github.com/aws/aws-sdk-js-v3/issues"
      },
      bundleDependencies: false,
      dependencies: {
        "@aws-crypto/sha256-browser": "2.0.0",
        "@aws-crypto/sha256-js": "2.0.0",
        "@aws-sdk/config-resolver": "3.80.0",
        "@aws-sdk/fetch-http-handler": "3.78.0",
        "@aws-sdk/hash-node": "3.78.0",
        "@aws-sdk/invalid-dependency": "3.78.0",
        "@aws-sdk/middleware-content-length": "3.78.0",
        "@aws-sdk/middleware-host-header": "3.78.0",
        "@aws-sdk/middleware-logger": "3.78.0",
        "@aws-sdk/middleware-recursion-detection": "3.105.0",
        "@aws-sdk/middleware-retry": "3.80.0",
        "@aws-sdk/middleware-serde": "3.78.0",
        "@aws-sdk/middleware-stack": "3.78.0",
        "@aws-sdk/middleware-user-agent": "3.78.0",
        "@aws-sdk/node-config-provider": "3.80.0",
        "@aws-sdk/node-http-handler": "3.94.0",
        "@aws-sdk/protocol-http": "3.78.0",
        "@aws-sdk/smithy-client": "3.99.0",
        "@aws-sdk/types": "3.78.0",
        "@aws-sdk/url-parser": "3.78.0",
        "@aws-sdk/util-base64-browser": "3.58.0",
        "@aws-sdk/util-base64-node": "3.55.0",
        "@aws-sdk/util-body-length-browser": "3.55.0",
        "@aws-sdk/util-body-length-node": "3.55.0",
        "@aws-sdk/util-defaults-mode-browser": "3.99.0",
        "@aws-sdk/util-defaults-mode-node": "3.99.0",
        "@aws-sdk/util-user-agent-browser": "3.78.0",
        "@aws-sdk/util-user-agent-node": "3.80.0",
        "@aws-sdk/util-utf8-browser": "3.55.0",
        "@aws-sdk/util-utf8-node": "3.55.0",
        tslib: "^2.3.1"
      },
      deprecated: false,
      description: "AWS SDK for JavaScript Sso Client for Node.js, Browser and React Native",
      devDependencies: {
        "@aws-sdk/service-client-documentation-generator": "3.58.0",
        "@tsconfig/recommended": "1.0.1",
        "@types/node": "^12.7.5",
        concurrently: "7.0.0",
        "downlevel-dts": "0.7.0",
        rimraf: "3.0.2",
        typedoc: "0.19.2",
        typescript: "~4.6.2"
      },
      engines: {
        node: ">=12.0.0"
      },
      files: [
        "dist-*"
      ],
      homepage: "https://github.com/aws/aws-sdk-js-v3/tree/main/clients/client-sso",
      license: "Apache-2.0",
      main: "./dist-cjs/index.js",
      module: "./dist-es/index.js",
      name: "@aws-sdk/client-sso",
      "react-native": {
        "./dist-es/runtimeConfig": "./dist-es/runtimeConfig.native"
      },
      repository: {
        type: "git",
        url: "git+https://github.com/aws/aws-sdk-js-v3.git",
        directory: "clients/client-sso"
      },
      scripts: {
        build: "concurrently 'yarn:build:cjs' 'yarn:build:es' 'yarn:build:types'",
        "build:cjs": "tsc -p tsconfig.cjs.json",
        "build:docs": "typedoc",
        "build:es": "tsc -p tsconfig.es.json",
        "build:types": "tsc -p tsconfig.types.json",
        "build:types:downlevel": "downlevel-dts dist-types dist-types/ts3.4",
        clean: "rimraf ./dist-* && rimraf *.tsbuildinfo"
      },
      sideEffects: false,
      types: "./dist-types/index.d.ts",
      typesVersions: {
        "<4.0": {
          "dist-types/*": [
            "dist-types/ts3.4/*"
          ]
        }
      },
      version: "3.105.0"
    };
  }
});

// node_modules/@aws-sdk/util-buffer-from/dist-cjs/index.js
var require_dist_cjs28 = __commonJS({
  "node_modules/@aws-sdk/util-buffer-from/dist-cjs/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.fromString = exports.fromArrayBuffer = void 0;
    var is_array_buffer_1 = require_dist_cjs17();
    var buffer_1 = require("buffer");
    var fromArrayBuffer = (input, offset = 0, length = input.byteLength - offset) => {
      if (!(0, is_array_buffer_1.isArrayBuffer)(input)) {
        throw new TypeError(`The "input" argument must be ArrayBuffer. Received type ${typeof input} (${input})`);
      }
      return buffer_1.Buffer.from(input, offset, length);
    };
    exports.fromArrayBuffer = fromArrayBuffer;
    var fromString = (input, encoding) => {
      if (typeof input !== "string") {
        throw new TypeError(`The "input" argument must be of type string. Received type ${typeof input} (${input})`);
      }
      return encoding ? buffer_1.Buffer.from(input, encoding) : buffer_1.Buffer.from(input);
    };
    exports.fromString = fromString;
  }
});

// node_modules/@aws-sdk/hash-node/dist-cjs/index.js
var require_dist_cjs29 = __commonJS({
  "node_modules/@aws-sdk/hash-node/dist-cjs/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Hash = void 0;
    var util_buffer_from_1 = require_dist_cjs28();
    var buffer_1 = require("buffer");
    var crypto_1 = require("crypto");
    var Hash = class {
      constructor(algorithmIdentifier, secret) {
        this.hash = secret ? (0, crypto_1.createHmac)(algorithmIdentifier, castSourceData(secret)) : (0, crypto_1.createHash)(algorithmIdentifier);
      }
      update(toHash, encoding) {
        this.hash.update(castSourceData(toHash, encoding));
      }
      digest() {
        return Promise.resolve(this.hash.digest());
      }
    };
    exports.Hash = Hash;
    function castSourceData(toCast, encoding) {
      if (buffer_1.Buffer.isBuffer(toCast)) {
        return toCast;
      }
      if (typeof toCast === "string") {
        return (0, util_buffer_from_1.fromString)(toCast, encoding);
      }
      if (ArrayBuffer.isView(toCast)) {
        return (0, util_buffer_from_1.fromArrayBuffer)(toCast.buffer, toCast.byteOffset, toCast.byteLength);
      }
      return (0, util_buffer_from_1.fromArrayBuffer)(toCast);
    }
  }
});

// node_modules/@aws-sdk/querystring-builder/dist-cjs/index.js
var require_dist_cjs30 = __commonJS({
  "node_modules/@aws-sdk/querystring-builder/dist-cjs/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.buildQueryString = void 0;
    var util_uri_escape_1 = require_dist_cjs16();
    function buildQueryString(query) {
      const parts = [];
      for (let key of Object.keys(query).sort()) {
        const value = query[key];
        key = (0, util_uri_escape_1.escapeUri)(key);
        if (Array.isArray(value)) {
          for (let i2 = 0, iLen = value.length; i2 < iLen; i2++) {
            parts.push(`${key}=${(0, util_uri_escape_1.escapeUri)(value[i2])}`);
          }
        } else {
          let qsEntry = key;
          if (value || typeof value === "string") {
            qsEntry += `=${(0, util_uri_escape_1.escapeUri)(value)}`;
          }
          parts.push(qsEntry);
        }
      }
      return parts.join("&");
    }
    exports.buildQueryString = buildQueryString;
  }
});

// node_modules/@aws-sdk/node-http-handler/dist-cjs/constants.js
var require_constants6 = __commonJS({
  "node_modules/@aws-sdk/node-http-handler/dist-cjs/constants.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NODEJS_TIMEOUT_ERROR_CODES = void 0;
    exports.NODEJS_TIMEOUT_ERROR_CODES = ["ECONNRESET", "EPIPE", "ETIMEDOUT"];
  }
});

// node_modules/@aws-sdk/node-http-handler/dist-cjs/get-transformed-headers.js
var require_get_transformed_headers = __commonJS({
  "node_modules/@aws-sdk/node-http-handler/dist-cjs/get-transformed-headers.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getTransformedHeaders = void 0;
    var getTransformedHeaders = (headers) => {
      const transformedHeaders = {};
      for (const name of Object.keys(headers)) {
        const headerValues = headers[name];
        transformedHeaders[name] = Array.isArray(headerValues) ? headerValues.join(",") : headerValues;
      }
      return transformedHeaders;
    };
    exports.getTransformedHeaders = getTransformedHeaders;
  }
});

// node_modules/@aws-sdk/node-http-handler/dist-cjs/set-connection-timeout.js
var require_set_connection_timeout = __commonJS({
  "node_modules/@aws-sdk/node-http-handler/dist-cjs/set-connection-timeout.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.setConnectionTimeout = void 0;
    var setConnectionTimeout = (request, reject, timeoutInMs = 0) => {
      if (!timeoutInMs) {
        return;
      }
      request.on("socket", (socket) => {
        if (socket.connecting) {
          const timeoutId = setTimeout(() => {
            request.destroy();
            reject(Object.assign(new Error(`Socket timed out without establishing a connection within ${timeoutInMs} ms`), {
              name: "TimeoutError"
            }));
          }, timeoutInMs);
          socket.on("connect", () => {
            clearTimeout(timeoutId);
          });
        }
      });
    };
    exports.setConnectionTimeout = setConnectionTimeout;
  }
});

// node_modules/@aws-sdk/node-http-handler/dist-cjs/set-socket-timeout.js
var require_set_socket_timeout = __commonJS({
  "node_modules/@aws-sdk/node-http-handler/dist-cjs/set-socket-timeout.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.setSocketTimeout = void 0;
    var setSocketTimeout = (request, reject, timeoutInMs = 0) => {
      request.setTimeout(timeoutInMs, () => {
        request.destroy();
        reject(Object.assign(new Error(`Connection timed out after ${timeoutInMs} ms`), { name: "TimeoutError" }));
      });
    };
    exports.setSocketTimeout = setSocketTimeout;
  }
});

// node_modules/@aws-sdk/node-http-handler/dist-cjs/write-request-body.js
var require_write_request_body = __commonJS({
  "node_modules/@aws-sdk/node-http-handler/dist-cjs/write-request-body.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.writeRequestBody = void 0;
    var stream_1 = require("stream");
    function writeRequestBody(httpRequest, request) {
      const expect = request.headers["Expect"] || request.headers["expect"];
      if (expect === "100-continue") {
        httpRequest.on("continue", () => {
          writeBody(httpRequest, request.body);
        });
      } else {
        writeBody(httpRequest, request.body);
      }
    }
    exports.writeRequestBody = writeRequestBody;
    function writeBody(httpRequest, body) {
      if (body instanceof stream_1.Readable) {
        body.pipe(httpRequest);
      } else if (body) {
        httpRequest.end(Buffer.from(body));
      } else {
        httpRequest.end();
      }
    }
  }
});

// node_modules/@aws-sdk/node-http-handler/dist-cjs/node-http-handler.js
var require_node_http_handler = __commonJS({
  "node_modules/@aws-sdk/node-http-handler/dist-cjs/node-http-handler.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NodeHttpHandler = void 0;
    var protocol_http_1 = require_dist_cjs4();
    var querystring_builder_1 = require_dist_cjs30();
    var http_1 = require("http");
    var https_1 = require("https");
    var constants_1 = require_constants6();
    var get_transformed_headers_1 = require_get_transformed_headers();
    var set_connection_timeout_1 = require_set_connection_timeout();
    var set_socket_timeout_1 = require_set_socket_timeout();
    var write_request_body_1 = require_write_request_body();
    var NodeHttpHandler = class {
      constructor(options) {
        this.metadata = { handlerProtocol: "http/1.1" };
        this.configProvider = new Promise((resolve, reject) => {
          if (typeof options === "function") {
            options().then((_options) => {
              resolve(this.resolveDefaultConfig(_options));
            }).catch(reject);
          } else {
            resolve(this.resolveDefaultConfig(options));
          }
        });
      }
      resolveDefaultConfig(options) {
        const { connectionTimeout, socketTimeout, httpAgent, httpsAgent } = options || {};
        const keepAlive = true;
        const maxSockets = 50;
        return {
          connectionTimeout,
          socketTimeout,
          httpAgent: httpAgent || new http_1.Agent({ keepAlive, maxSockets }),
          httpsAgent: httpsAgent || new https_1.Agent({ keepAlive, maxSockets })
        };
      }
      destroy() {
        var _a, _b, _c, _d;
        (_b = (_a = this.config) === null || _a === void 0 ? void 0 : _a.httpAgent) === null || _b === void 0 ? void 0 : _b.destroy();
        (_d = (_c = this.config) === null || _c === void 0 ? void 0 : _c.httpsAgent) === null || _d === void 0 ? void 0 : _d.destroy();
      }
      async handle(request, { abortSignal } = {}) {
        if (!this.config) {
          this.config = await this.configProvider;
        }
        return new Promise((resolve, reject) => {
          if (!this.config) {
            throw new Error("Node HTTP request handler config is not resolved");
          }
          if (abortSignal === null || abortSignal === void 0 ? void 0 : abortSignal.aborted) {
            const abortError = new Error("Request aborted");
            abortError.name = "AbortError";
            reject(abortError);
            return;
          }
          const isSSL = request.protocol === "https:";
          const queryString = (0, querystring_builder_1.buildQueryString)(request.query || {});
          const nodeHttpsOptions = {
            headers: request.headers,
            host: request.hostname,
            method: request.method,
            path: queryString ? `${request.path}?${queryString}` : request.path,
            port: request.port,
            agent: isSSL ? this.config.httpsAgent : this.config.httpAgent
          };
          const requestFunc = isSSL ? https_1.request : http_1.request;
          const req = requestFunc(nodeHttpsOptions, (res) => {
            const httpResponse = new protocol_http_1.HttpResponse({
              statusCode: res.statusCode || -1,
              headers: (0, get_transformed_headers_1.getTransformedHeaders)(res.headers),
              body: res
            });
            resolve({ response: httpResponse });
          });
          req.on("error", (err) => {
            if (constants_1.NODEJS_TIMEOUT_ERROR_CODES.includes(err.code)) {
              reject(Object.assign(err, { name: "TimeoutError" }));
            } else {
              reject(err);
            }
          });
          (0, set_connection_timeout_1.setConnectionTimeout)(req, reject, this.config.connectionTimeout);
          (0, set_socket_timeout_1.setSocketTimeout)(req, reject, this.config.socketTimeout);
          if (abortSignal) {
            abortSignal.onabort = () => {
              req.abort();
              const abortError = new Error("Request aborted");
              abortError.name = "AbortError";
              reject(abortError);
            };
          }
          (0, write_request_body_1.writeRequestBody)(req, request);
        });
      }
    };
    exports.NodeHttpHandler = NodeHttpHandler;
  }
});

// node_modules/@aws-sdk/node-http-handler/dist-cjs/node-http2-handler.js
var require_node_http2_handler = __commonJS({
  "node_modules/@aws-sdk/node-http-handler/dist-cjs/node-http2-handler.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NodeHttp2Handler = void 0;
    var protocol_http_1 = require_dist_cjs4();
    var querystring_builder_1 = require_dist_cjs30();
    var http2_1 = require("http2");
    var get_transformed_headers_1 = require_get_transformed_headers();
    var write_request_body_1 = require_write_request_body();
    var NodeHttp2Handler = class {
      constructor(options) {
        this.metadata = { handlerProtocol: "h2" };
        this.configProvider = new Promise((resolve, reject) => {
          if (typeof options === "function") {
            options().then((opts) => {
              resolve(opts || {});
            }).catch(reject);
          } else {
            resolve(options || {});
          }
        });
        this.sessionCache = /* @__PURE__ */ new Map();
      }
      destroy() {
        for (const sessions of this.sessionCache.values()) {
          sessions.forEach((session) => this.destroySession(session));
        }
        this.sessionCache.clear();
      }
      async handle(request, { abortSignal } = {}) {
        if (!this.config) {
          this.config = await this.configProvider;
        }
        const { requestTimeout, disableConcurrentStreams } = this.config;
        return new Promise((resolve, rejectOriginal) => {
          let fulfilled = false;
          if (abortSignal === null || abortSignal === void 0 ? void 0 : abortSignal.aborted) {
            fulfilled = true;
            const abortError = new Error("Request aborted");
            abortError.name = "AbortError";
            rejectOriginal(abortError);
            return;
          }
          const { hostname, method, port, protocol, path, query } = request;
          const authority = `${protocol}//${hostname}${port ? `:${port}` : ""}`;
          const session = this.getSession(authority, disableConcurrentStreams || false);
          const reject = (err) => {
            if (disableConcurrentStreams) {
              this.destroySession(session);
            }
            fulfilled = true;
            rejectOriginal(err);
          };
          const queryString = (0, querystring_builder_1.buildQueryString)(query || {});
          const req = session.request({
            ...request.headers,
            [http2_1.constants.HTTP2_HEADER_PATH]: queryString ? `${path}?${queryString}` : path,
            [http2_1.constants.HTTP2_HEADER_METHOD]: method
          });
          session.ref();
          req.on("response", (headers) => {
            const httpResponse = new protocol_http_1.HttpResponse({
              statusCode: headers[":status"] || -1,
              headers: (0, get_transformed_headers_1.getTransformedHeaders)(headers),
              body: req
            });
            fulfilled = true;
            resolve({ response: httpResponse });
            if (disableConcurrentStreams) {
              session.close();
              this.deleteSessionFromCache(authority, session);
            }
          });
          if (requestTimeout) {
            req.setTimeout(requestTimeout, () => {
              req.close();
              const timeoutError = new Error(`Stream timed out because of no activity for ${requestTimeout} ms`);
              timeoutError.name = "TimeoutError";
              reject(timeoutError);
            });
          }
          if (abortSignal) {
            abortSignal.onabort = () => {
              req.close();
              const abortError = new Error("Request aborted");
              abortError.name = "AbortError";
              reject(abortError);
            };
          }
          req.on("frameError", (type, code, id) => {
            reject(new Error(`Frame type id ${type} in stream id ${id} has failed with code ${code}.`));
          });
          req.on("error", reject);
          req.on("aborted", () => {
            reject(new Error(`HTTP/2 stream is abnormally aborted in mid-communication with result code ${req.rstCode}.`));
          });
          req.on("close", () => {
            session.unref();
            if (disableConcurrentStreams) {
              session.destroy();
            }
            if (!fulfilled) {
              reject(new Error("Unexpected error: http2 request did not get a response"));
            }
          });
          (0, write_request_body_1.writeRequestBody)(req, request);
        });
      }
      getSession(authority, disableConcurrentStreams) {
        var _a;
        const sessionCache = this.sessionCache;
        const existingSessions = sessionCache.get(authority) || [];
        if (existingSessions.length > 0 && !disableConcurrentStreams)
          return existingSessions[0];
        const newSession = (0, http2_1.connect)(authority);
        newSession.unref();
        const destroySessionCb = () => {
          this.destroySession(newSession);
          this.deleteSessionFromCache(authority, newSession);
        };
        newSession.on("goaway", destroySessionCb);
        newSession.on("error", destroySessionCb);
        newSession.on("frameError", destroySessionCb);
        newSession.on("close", () => this.deleteSessionFromCache(authority, newSession));
        if ((_a = this.config) === null || _a === void 0 ? void 0 : _a.sessionTimeout) {
          newSession.setTimeout(this.config.sessionTimeout, destroySessionCb);
        }
        existingSessions.push(newSession);
        sessionCache.set(authority, existingSessions);
        return newSession;
      }
      destroySession(session) {
        if (!session.destroyed) {
          session.destroy();
        }
      }
      deleteSessionFromCache(authority, session) {
        const existingSessions = this.sessionCache.get(authority) || [];
        if (!existingSessions.includes(session)) {
          return;
        }
        this.sessionCache.set(authority, existingSessions.filter((s2) => s2 !== session));
      }
    };
    exports.NodeHttp2Handler = NodeHttp2Handler;
  }
});

// node_modules/@aws-sdk/node-http-handler/dist-cjs/stream-collector/collector.js
var require_collector = __commonJS({
  "node_modules/@aws-sdk/node-http-handler/dist-cjs/stream-collector/collector.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Collector = void 0;
    var stream_1 = require("stream");
    var Collector = class extends stream_1.Writable {
      constructor() {
        super(...arguments);
        this.bufferedBytes = [];
      }
      _write(chunk, encoding, callback) {
        this.bufferedBytes.push(chunk);
        callback();
      }
    };
    exports.Collector = Collector;
  }
});

// node_modules/@aws-sdk/node-http-handler/dist-cjs/stream-collector/index.js
var require_stream_collector = __commonJS({
  "node_modules/@aws-sdk/node-http-handler/dist-cjs/stream-collector/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.streamCollector = void 0;
    var collector_1 = require_collector();
    var streamCollector = (stream) => new Promise((resolve, reject) => {
      const collector = new collector_1.Collector();
      stream.pipe(collector);
      stream.on("error", (err) => {
        collector.end();
        reject(err);
      });
      collector.on("error", reject);
      collector.on("finish", function() {
        const bytes = new Uint8Array(Buffer.concat(this.bufferedBytes));
        resolve(bytes);
      });
    });
    exports.streamCollector = streamCollector;
  }
});

// node_modules/@aws-sdk/node-http-handler/dist-cjs/index.js
var require_dist_cjs31 = __commonJS({
  "node_modules/@aws-sdk/node-http-handler/dist-cjs/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require_tslib();
    tslib_1.__exportStar(require_node_http_handler(), exports);
    tslib_1.__exportStar(require_node_http2_handler(), exports);
    tslib_1.__exportStar(require_stream_collector(), exports);
  }
});

// node_modules/@aws-sdk/util-base64-node/dist-cjs/index.js
var require_dist_cjs32 = __commonJS({
  "node_modules/@aws-sdk/util-base64-node/dist-cjs/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.toBase64 = exports.fromBase64 = void 0;
    var util_buffer_from_1 = require_dist_cjs28();
    var BASE64_REGEX = /^[A-Za-z0-9+/]*={0,2}$/;
    function fromBase64(input) {
      if (input.length * 3 % 4 !== 0) {
        throw new TypeError(`Incorrect padding on base64 string.`);
      }
      if (!BASE64_REGEX.exec(input)) {
        throw new TypeError(`Invalid base64 string.`);
      }
      const buffer = (0, util_buffer_from_1.fromString)(input, "base64");
      return new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
    }
    exports.fromBase64 = fromBase64;
    function toBase64(input) {
      return (0, util_buffer_from_1.fromArrayBuffer)(input.buffer, input.byteOffset, input.byteLength).toString("base64");
    }
    exports.toBase64 = toBase64;
  }
});

// node_modules/@aws-sdk/util-body-length-node/dist-cjs/calculateBodyLength.js
var require_calculateBodyLength = __commonJS({
  "node_modules/@aws-sdk/util-body-length-node/dist-cjs/calculateBodyLength.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.calculateBodyLength = void 0;
    var fs_1 = require("fs");
    var calculateBodyLength = (body) => {
      if (!body) {
        return 0;
      }
      if (typeof body === "string") {
        return Buffer.from(body).length;
      } else if (typeof body.byteLength === "number") {
        return body.byteLength;
      } else if (typeof body.size === "number") {
        return body.size;
      } else if (typeof body.path === "string" || Buffer.isBuffer(body.path)) {
        return (0, fs_1.lstatSync)(body.path).size;
      } else if (typeof body.fd === "number") {
        return (0, fs_1.fstatSync)(body.fd).size;
      }
      throw new Error(`Body Length computation failed for ${body}`);
    };
    exports.calculateBodyLength = calculateBodyLength;
  }
});

// node_modules/@aws-sdk/util-body-length-node/dist-cjs/index.js
var require_dist_cjs33 = __commonJS({
  "node_modules/@aws-sdk/util-body-length-node/dist-cjs/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require_tslib();
    tslib_1.__exportStar(require_calculateBodyLength(), exports);
  }
});

// node_modules/@aws-sdk/util-user-agent-node/dist-cjs/is-crt-available.js
var require_is_crt_available = __commonJS({
  "node_modules/@aws-sdk/util-user-agent-node/dist-cjs/is-crt-available.js"(exports, module2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isCrtAvailable = void 0;
    var isCrtAvailable = () => {
      try {
        if (typeof require === "function" && typeof module2 !== "undefined" && module2.require && require("aws-crt")) {
          return ["md/crt-avail"];
        }
        return null;
      } catch (e2) {
        return null;
      }
    };
    exports.isCrtAvailable = isCrtAvailable;
  }
});

// node_modules/@aws-sdk/util-user-agent-node/dist-cjs/index.js
var require_dist_cjs34 = __commonJS({
  "node_modules/@aws-sdk/util-user-agent-node/dist-cjs/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.defaultUserAgent = exports.UA_APP_ID_INI_NAME = exports.UA_APP_ID_ENV_NAME = void 0;
    var node_config_provider_1 = require_dist_cjs24();
    var os_1 = require("os");
    var process_1 = require("process");
    var is_crt_available_1 = require_is_crt_available();
    exports.UA_APP_ID_ENV_NAME = "AWS_SDK_UA_APP_ID";
    exports.UA_APP_ID_INI_NAME = "sdk-ua-app-id";
    var defaultUserAgent = ({ serviceId, clientVersion }) => {
      const sections = [
        ["aws-sdk-js", clientVersion],
        [`os/${(0, os_1.platform)()}`, (0, os_1.release)()],
        ["lang/js"],
        ["md/nodejs", `${process_1.versions.node}`]
      ];
      const crtAvailable = (0, is_crt_available_1.isCrtAvailable)();
      if (crtAvailable) {
        sections.push(crtAvailable);
      }
      if (serviceId) {
        sections.push([`api/${serviceId}`, clientVersion]);
      }
      if (process_1.env.AWS_EXECUTION_ENV) {
        sections.push([`exec-env/${process_1.env.AWS_EXECUTION_ENV}`]);
      }
      const appIdPromise = (0, node_config_provider_1.loadConfig)({
        environmentVariableSelector: (env) => env[exports.UA_APP_ID_ENV_NAME],
        configFileSelector: (profile) => profile[exports.UA_APP_ID_INI_NAME],
        default: void 0
      })();
      let resolvedUserAgent = void 0;
      return async () => {
        if (!resolvedUserAgent) {
          const appId = await appIdPromise;
          resolvedUserAgent = appId ? [...sections, [`app/${appId}`]] : [...sections];
        }
        return resolvedUserAgent;
      };
    };
    exports.defaultUserAgent = defaultUserAgent;
  }
});

// node_modules/@aws-sdk/util-utf8-node/dist-cjs/index.js
var require_dist_cjs35 = __commonJS({
  "node_modules/@aws-sdk/util-utf8-node/dist-cjs/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.toUtf8 = exports.fromUtf8 = void 0;
    var util_buffer_from_1 = require_dist_cjs28();
    var fromUtf8 = (input) => {
      const buf = (0, util_buffer_from_1.fromString)(input, "utf8");
      return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength / Uint8Array.BYTES_PER_ELEMENT);
    };
    exports.fromUtf8 = fromUtf8;
    var toUtf8 = (input) => (0, util_buffer_from_1.fromArrayBuffer)(input.buffer, input.byteOffset, input.byteLength).toString("utf8");
    exports.toUtf8 = toUtf8;
  }
});

// node_modules/@aws-sdk/client-sso/dist-cjs/endpoints.js
var require_endpoints = __commonJS({
  "node_modules/@aws-sdk/client-sso/dist-cjs/endpoints.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.defaultRegionInfoProvider = void 0;
    var config_resolver_1 = require_dist_cjs7();
    var regionHash = {
      "ap-northeast-1": {
        variants: [
          {
            hostname: "portal.sso.ap-northeast-1.amazonaws.com",
            tags: []
          }
        ],
        signingRegion: "ap-northeast-1"
      },
      "ap-northeast-2": {
        variants: [
          {
            hostname: "portal.sso.ap-northeast-2.amazonaws.com",
            tags: []
          }
        ],
        signingRegion: "ap-northeast-2"
      },
      "ap-northeast-3": {
        variants: [
          {
            hostname: "portal.sso.ap-northeast-3.amazonaws.com",
            tags: []
          }
        ],
        signingRegion: "ap-northeast-3"
      },
      "ap-south-1": {
        variants: [
          {
            hostname: "portal.sso.ap-south-1.amazonaws.com",
            tags: []
          }
        ],
        signingRegion: "ap-south-1"
      },
      "ap-southeast-1": {
        variants: [
          {
            hostname: "portal.sso.ap-southeast-1.amazonaws.com",
            tags: []
          }
        ],
        signingRegion: "ap-southeast-1"
      },
      "ap-southeast-2": {
        variants: [
          {
            hostname: "portal.sso.ap-southeast-2.amazonaws.com",
            tags: []
          }
        ],
        signingRegion: "ap-southeast-2"
      },
      "ca-central-1": {
        variants: [
          {
            hostname: "portal.sso.ca-central-1.amazonaws.com",
            tags: []
          }
        ],
        signingRegion: "ca-central-1"
      },
      "eu-central-1": {
        variants: [
          {
            hostname: "portal.sso.eu-central-1.amazonaws.com",
            tags: []
          }
        ],
        signingRegion: "eu-central-1"
      },
      "eu-north-1": {
        variants: [
          {
            hostname: "portal.sso.eu-north-1.amazonaws.com",
            tags: []
          }
        ],
        signingRegion: "eu-north-1"
      },
      "eu-west-1": {
        variants: [
          {
            hostname: "portal.sso.eu-west-1.amazonaws.com",
            tags: []
          }
        ],
        signingRegion: "eu-west-1"
      },
      "eu-west-2": {
        variants: [
          {
            hostname: "portal.sso.eu-west-2.amazonaws.com",
            tags: []
          }
        ],
        signingRegion: "eu-west-2"
      },
      "eu-west-3": {
        variants: [
          {
            hostname: "portal.sso.eu-west-3.amazonaws.com",
            tags: []
          }
        ],
        signingRegion: "eu-west-3"
      },
      "sa-east-1": {
        variants: [
          {
            hostname: "portal.sso.sa-east-1.amazonaws.com",
            tags: []
          }
        ],
        signingRegion: "sa-east-1"
      },
      "us-east-1": {
        variants: [
          {
            hostname: "portal.sso.us-east-1.amazonaws.com",
            tags: []
          }
        ],
        signingRegion: "us-east-1"
      },
      "us-east-2": {
        variants: [
          {
            hostname: "portal.sso.us-east-2.amazonaws.com",
            tags: []
          }
        ],
        signingRegion: "us-east-2"
      },
      "us-gov-east-1": {
        variants: [
          {
            hostname: "portal.sso.us-gov-east-1.amazonaws.com",
            tags: []
          }
        ],
        signingRegion: "us-gov-east-1"
      },
      "us-gov-west-1": {
        variants: [
          {
            hostname: "portal.sso.us-gov-west-1.amazonaws.com",
            tags: []
          }
        ],
        signingRegion: "us-gov-west-1"
      },
      "us-west-2": {
        variants: [
          {
            hostname: "portal.sso.us-west-2.amazonaws.com",
            tags: []
          }
        ],
        signingRegion: "us-west-2"
      }
    };
    var partitionHash = {
      aws: {
        regions: [
          "af-south-1",
          "ap-east-1",
          "ap-northeast-1",
          "ap-northeast-2",
          "ap-northeast-3",
          "ap-south-1",
          "ap-southeast-1",
          "ap-southeast-2",
          "ap-southeast-3",
          "ca-central-1",
          "eu-central-1",
          "eu-north-1",
          "eu-south-1",
          "eu-west-1",
          "eu-west-2",
          "eu-west-3",
          "me-south-1",
          "sa-east-1",
          "us-east-1",
          "us-east-2",
          "us-west-1",
          "us-west-2"
        ],
        regionRegex: "^(us|eu|ap|sa|ca|me|af)\\-\\w+\\-\\d+$",
        variants: [
          {
            hostname: "portal.sso.{region}.amazonaws.com",
            tags: []
          },
          {
            hostname: "portal.sso-fips.{region}.amazonaws.com",
            tags: ["fips"]
          },
          {
            hostname: "portal.sso-fips.{region}.api.aws",
            tags: ["dualstack", "fips"]
          },
          {
            hostname: "portal.sso.{region}.api.aws",
            tags: ["dualstack"]
          }
        ]
      },
      "aws-cn": {
        regions: ["cn-north-1", "cn-northwest-1"],
        regionRegex: "^cn\\-\\w+\\-\\d+$",
        variants: [
          {
            hostname: "portal.sso.{region}.amazonaws.com.cn",
            tags: []
          },
          {
            hostname: "portal.sso-fips.{region}.amazonaws.com.cn",
            tags: ["fips"]
          },
          {
            hostname: "portal.sso-fips.{region}.api.amazonwebservices.com.cn",
            tags: ["dualstack", "fips"]
          },
          {
            hostname: "portal.sso.{region}.api.amazonwebservices.com.cn",
            tags: ["dualstack"]
          }
        ]
      },
      "aws-iso": {
        regions: ["us-iso-east-1", "us-iso-west-1"],
        regionRegex: "^us\\-iso\\-\\w+\\-\\d+$",
        variants: [
          {
            hostname: "portal.sso.{region}.c2s.ic.gov",
            tags: []
          },
          {
            hostname: "portal.sso-fips.{region}.c2s.ic.gov",
            tags: ["fips"]
          }
        ]
      },
      "aws-iso-b": {
        regions: ["us-isob-east-1"],
        regionRegex: "^us\\-isob\\-\\w+\\-\\d+$",
        variants: [
          {
            hostname: "portal.sso.{region}.sc2s.sgov.gov",
            tags: []
          },
          {
            hostname: "portal.sso-fips.{region}.sc2s.sgov.gov",
            tags: ["fips"]
          }
        ]
      },
      "aws-us-gov": {
        regions: ["us-gov-east-1", "us-gov-west-1"],
        regionRegex: "^us\\-gov\\-\\w+\\-\\d+$",
        variants: [
          {
            hostname: "portal.sso.{region}.amazonaws.com",
            tags: []
          },
          {
            hostname: "portal.sso-fips.{region}.amazonaws.com",
            tags: ["fips"]
          },
          {
            hostname: "portal.sso-fips.{region}.api.aws",
            tags: ["dualstack", "fips"]
          },
          {
            hostname: "portal.sso.{region}.api.aws",
            tags: ["dualstack"]
          }
        ]
      }
    };
    var defaultRegionInfoProvider = async (region, options) => (0, config_resolver_1.getRegionInfo)(region, {
      ...options,
      signingService: "awsssoportal",
      regionHash,
      partitionHash
    });
    exports.defaultRegionInfoProvider = defaultRegionInfoProvider;
  }
});

// node_modules/@aws-sdk/client-sso/dist-cjs/runtimeConfig.shared.js
var require_runtimeConfig_shared = __commonJS({
  "node_modules/@aws-sdk/client-sso/dist-cjs/runtimeConfig.shared.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getRuntimeConfig = void 0;
    var url_parser_1 = require_dist_cjs26();
    var endpoints_1 = require_endpoints();
    var getRuntimeConfig = (config) => {
      var _a, _b, _c, _d, _e;
      return {
        apiVersion: "2019-06-10",
        disableHostPrefix: (_a = config === null || config === void 0 ? void 0 : config.disableHostPrefix) !== null && _a !== void 0 ? _a : false,
        logger: (_b = config === null || config === void 0 ? void 0 : config.logger) !== null && _b !== void 0 ? _b : {},
        regionInfoProvider: (_c = config === null || config === void 0 ? void 0 : config.regionInfoProvider) !== null && _c !== void 0 ? _c : endpoints_1.defaultRegionInfoProvider,
        serviceId: (_d = config === null || config === void 0 ? void 0 : config.serviceId) !== null && _d !== void 0 ? _d : "SSO",
        urlParser: (_e = config === null || config === void 0 ? void 0 : config.urlParser) !== null && _e !== void 0 ? _e : url_parser_1.parseUrl
      };
    };
    exports.getRuntimeConfig = getRuntimeConfig;
  }
});

// node_modules/@aws-sdk/util-defaults-mode-node/dist-cjs/constants.js
var require_constants7 = __commonJS({
  "node_modules/@aws-sdk/util-defaults-mode-node/dist-cjs/constants.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.IMDS_REGION_PATH = exports.DEFAULTS_MODE_OPTIONS = exports.ENV_IMDS_DISABLED = exports.AWS_DEFAULT_REGION_ENV = exports.AWS_REGION_ENV = exports.AWS_EXECUTION_ENV = void 0;
    exports.AWS_EXECUTION_ENV = "AWS_EXECUTION_ENV";
    exports.AWS_REGION_ENV = "AWS_REGION";
    exports.AWS_DEFAULT_REGION_ENV = "AWS_DEFAULT_REGION";
    exports.ENV_IMDS_DISABLED = "AWS_EC2_METADATA_DISABLED";
    exports.DEFAULTS_MODE_OPTIONS = ["in-region", "cross-region", "mobile", "standard", "legacy"];
    exports.IMDS_REGION_PATH = "/latest/meta-data/placement/region";
  }
});

// node_modules/@aws-sdk/util-defaults-mode-node/dist-cjs/defaultsModeConfig.js
var require_defaultsModeConfig = __commonJS({
  "node_modules/@aws-sdk/util-defaults-mode-node/dist-cjs/defaultsModeConfig.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NODE_DEFAULTS_MODE_CONFIG_OPTIONS = void 0;
    var AWS_DEFAULTS_MODE_ENV = "AWS_DEFAULTS_MODE";
    var AWS_DEFAULTS_MODE_CONFIG = "defaults_mode";
    exports.NODE_DEFAULTS_MODE_CONFIG_OPTIONS = {
      environmentVariableSelector: (env) => {
        return env[AWS_DEFAULTS_MODE_ENV];
      },
      configFileSelector: (profile) => {
        return profile[AWS_DEFAULTS_MODE_CONFIG];
      },
      default: "legacy"
    };
  }
});

// node_modules/@aws-sdk/util-defaults-mode-node/dist-cjs/resolveDefaultsModeConfig.js
var require_resolveDefaultsModeConfig = __commonJS({
  "node_modules/@aws-sdk/util-defaults-mode-node/dist-cjs/resolveDefaultsModeConfig.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.resolveDefaultsModeConfig = void 0;
    var config_resolver_1 = require_dist_cjs7();
    var credential_provider_imds_1 = require_dist_cjs27();
    var node_config_provider_1 = require_dist_cjs24();
    var property_provider_1 = require_dist_cjs14();
    var constants_1 = require_constants7();
    var defaultsModeConfig_1 = require_defaultsModeConfig();
    var resolveDefaultsModeConfig = ({ region = (0, node_config_provider_1.loadConfig)(config_resolver_1.NODE_REGION_CONFIG_OPTIONS), defaultsMode = (0, node_config_provider_1.loadConfig)(defaultsModeConfig_1.NODE_DEFAULTS_MODE_CONFIG_OPTIONS) } = {}) => (0, property_provider_1.memoize)(async () => {
      const mode = typeof defaultsMode === "function" ? await defaultsMode() : defaultsMode;
      switch (mode === null || mode === void 0 ? void 0 : mode.toLowerCase()) {
        case "auto":
          return resolveNodeDefaultsModeAuto(region);
        case "in-region":
        case "cross-region":
        case "mobile":
        case "standard":
        case "legacy":
          return Promise.resolve(mode === null || mode === void 0 ? void 0 : mode.toLocaleLowerCase());
        case void 0:
          return Promise.resolve("legacy");
        default:
          throw new Error(`Invalid parameter for "defaultsMode", expect ${constants_1.DEFAULTS_MODE_OPTIONS.join(", ")}, got ${mode}`);
      }
    });
    exports.resolveDefaultsModeConfig = resolveDefaultsModeConfig;
    var resolveNodeDefaultsModeAuto = async (clientRegion) => {
      if (clientRegion) {
        const resolvedRegion = typeof clientRegion === "function" ? await clientRegion() : clientRegion;
        const inferredRegion = await inferPhysicalRegion();
        if (!inferredRegion) {
          return "standard";
        }
        if (resolvedRegion === inferredRegion) {
          return "in-region";
        } else {
          return "cross-region";
        }
      }
      return "standard";
    };
    var inferPhysicalRegion = async () => {
      var _a;
      if (process.env[constants_1.AWS_EXECUTION_ENV] && (process.env[constants_1.AWS_REGION_ENV] || process.env[constants_1.AWS_DEFAULT_REGION_ENV])) {
        return (_a = process.env[constants_1.AWS_REGION_ENV]) !== null && _a !== void 0 ? _a : process.env[constants_1.AWS_DEFAULT_REGION_ENV];
      }
      if (!process.env[constants_1.ENV_IMDS_DISABLED]) {
        try {
          const endpoint = await (0, credential_provider_imds_1.getInstanceMetadataEndpoint)();
          return (await (0, credential_provider_imds_1.httpRequest)({ ...endpoint, path: constants_1.IMDS_REGION_PATH })).toString();
        } catch (e2) {
        }
      }
    };
  }
});

// node_modules/@aws-sdk/util-defaults-mode-node/dist-cjs/index.js
var require_dist_cjs36 = __commonJS({
  "node_modules/@aws-sdk/util-defaults-mode-node/dist-cjs/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require_tslib();
    tslib_1.__exportStar(require_resolveDefaultsModeConfig(), exports);
  }
});

// node_modules/@aws-sdk/client-sso/dist-cjs/runtimeConfig.js
var require_runtimeConfig = __commonJS({
  "node_modules/@aws-sdk/client-sso/dist-cjs/runtimeConfig.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getRuntimeConfig = void 0;
    var tslib_1 = require_tslib();
    var package_json_1 = tslib_1.__importDefault(require_package3());
    var config_resolver_1 = require_dist_cjs7();
    var hash_node_1 = require_dist_cjs29();
    var middleware_retry_1 = require_dist_cjs13();
    var node_config_provider_1 = require_dist_cjs24();
    var node_http_handler_1 = require_dist_cjs31();
    var util_base64_node_1 = require_dist_cjs32();
    var util_body_length_node_1 = require_dist_cjs33();
    var util_user_agent_node_1 = require_dist_cjs34();
    var util_utf8_node_1 = require_dist_cjs35();
    var runtimeConfig_shared_1 = require_runtimeConfig_shared();
    var smithy_client_1 = require_dist_cjs3();
    var util_defaults_mode_node_1 = require_dist_cjs36();
    var smithy_client_2 = require_dist_cjs3();
    var getRuntimeConfig = (config) => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
      (0, smithy_client_2.emitWarningIfUnsupportedVersion)(process.version);
      const defaultsMode = (0, util_defaults_mode_node_1.resolveDefaultsModeConfig)(config);
      const defaultConfigProvider = () => defaultsMode().then(smithy_client_1.loadConfigsForDefaultMode);
      const clientSharedValues = (0, runtimeConfig_shared_1.getRuntimeConfig)(config);
      return {
        ...clientSharedValues,
        ...config,
        runtime: "node",
        defaultsMode,
        base64Decoder: (_a = config === null || config === void 0 ? void 0 : config.base64Decoder) !== null && _a !== void 0 ? _a : util_base64_node_1.fromBase64,
        base64Encoder: (_b = config === null || config === void 0 ? void 0 : config.base64Encoder) !== null && _b !== void 0 ? _b : util_base64_node_1.toBase64,
        bodyLengthChecker: (_c = config === null || config === void 0 ? void 0 : config.bodyLengthChecker) !== null && _c !== void 0 ? _c : util_body_length_node_1.calculateBodyLength,
        defaultUserAgentProvider: (_d = config === null || config === void 0 ? void 0 : config.defaultUserAgentProvider) !== null && _d !== void 0 ? _d : (0, util_user_agent_node_1.defaultUserAgent)({ serviceId: clientSharedValues.serviceId, clientVersion: package_json_1.default.version }),
        maxAttempts: (_e = config === null || config === void 0 ? void 0 : config.maxAttempts) !== null && _e !== void 0 ? _e : (0, node_config_provider_1.loadConfig)(middleware_retry_1.NODE_MAX_ATTEMPT_CONFIG_OPTIONS),
        region: (_f = config === null || config === void 0 ? void 0 : config.region) !== null && _f !== void 0 ? _f : (0, node_config_provider_1.loadConfig)(config_resolver_1.NODE_REGION_CONFIG_OPTIONS, config_resolver_1.NODE_REGION_CONFIG_FILE_OPTIONS),
        requestHandler: (_g = config === null || config === void 0 ? void 0 : config.requestHandler) !== null && _g !== void 0 ? _g : new node_http_handler_1.NodeHttpHandler(defaultConfigProvider),
        retryMode: (_h = config === null || config === void 0 ? void 0 : config.retryMode) !== null && _h !== void 0 ? _h : (0, node_config_provider_1.loadConfig)({
          ...middleware_retry_1.NODE_RETRY_MODE_CONFIG_OPTIONS,
          default: async () => (await defaultConfigProvider()).retryMode || middleware_retry_1.DEFAULT_RETRY_MODE
        }),
        sha256: (_j = config === null || config === void 0 ? void 0 : config.sha256) !== null && _j !== void 0 ? _j : hash_node_1.Hash.bind(null, "sha256"),
        streamCollector: (_k = config === null || config === void 0 ? void 0 : config.streamCollector) !== null && _k !== void 0 ? _k : node_http_handler_1.streamCollector,
        useDualstackEndpoint: (_l = config === null || config === void 0 ? void 0 : config.useDualstackEndpoint) !== null && _l !== void 0 ? _l : (0, node_config_provider_1.loadConfig)(config_resolver_1.NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS),
        useFipsEndpoint: (_m = config === null || config === void 0 ? void 0 : config.useFipsEndpoint) !== null && _m !== void 0 ? _m : (0, node_config_provider_1.loadConfig)(config_resolver_1.NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS),
        utf8Decoder: (_o = config === null || config === void 0 ? void 0 : config.utf8Decoder) !== null && _o !== void 0 ? _o : util_utf8_node_1.fromUtf8,
        utf8Encoder: (_p = config === null || config === void 0 ? void 0 : config.utf8Encoder) !== null && _p !== void 0 ? _p : util_utf8_node_1.toUtf8
      };
    };
    exports.getRuntimeConfig = getRuntimeConfig;
  }
});

// node_modules/@aws-sdk/client-sso/dist-cjs/SSOClient.js
var require_SSOClient = __commonJS({
  "node_modules/@aws-sdk/client-sso/dist-cjs/SSOClient.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SSOClient = void 0;
    var config_resolver_1 = require_dist_cjs7();
    var middleware_content_length_1 = require_dist_cjs8();
    var middleware_host_header_1 = require_dist_cjs9();
    var middleware_logger_1 = require_dist_cjs10();
    var middleware_recursion_detection_1 = require_dist_cjs11();
    var middleware_retry_1 = require_dist_cjs13();
    var middleware_user_agent_1 = require_dist_cjs20();
    var smithy_client_1 = require_dist_cjs3();
    var runtimeConfig_1 = require_runtimeConfig();
    var SSOClient = class extends smithy_client_1.Client {
      constructor(configuration) {
        const _config_0 = (0, runtimeConfig_1.getRuntimeConfig)(configuration);
        const _config_1 = (0, config_resolver_1.resolveRegionConfig)(_config_0);
        const _config_2 = (0, config_resolver_1.resolveEndpointsConfig)(_config_1);
        const _config_3 = (0, middleware_retry_1.resolveRetryConfig)(_config_2);
        const _config_4 = (0, middleware_host_header_1.resolveHostHeaderConfig)(_config_3);
        const _config_5 = (0, middleware_user_agent_1.resolveUserAgentConfig)(_config_4);
        super(_config_5);
        this.config = _config_5;
        this.middlewareStack.use((0, middleware_retry_1.getRetryPlugin)(this.config));
        this.middlewareStack.use((0, middleware_content_length_1.getContentLengthPlugin)(this.config));
        this.middlewareStack.use((0, middleware_host_header_1.getHostHeaderPlugin)(this.config));
        this.middlewareStack.use((0, middleware_logger_1.getLoggerPlugin)(this.config));
        this.middlewareStack.use((0, middleware_recursion_detection_1.getRecursionDetectionPlugin)(this.config));
        this.middlewareStack.use((0, middleware_user_agent_1.getUserAgentPlugin)(this.config));
      }
      destroy() {
        super.destroy();
      }
    };
    exports.SSOClient = SSOClient;
  }
});

// node_modules/@aws-sdk/client-sso/dist-cjs/SSO.js
var require_SSO = __commonJS({
  "node_modules/@aws-sdk/client-sso/dist-cjs/SSO.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SSO = void 0;
    var GetRoleCredentialsCommand_1 = require_GetRoleCredentialsCommand();
    var ListAccountRolesCommand_1 = require_ListAccountRolesCommand();
    var ListAccountsCommand_1 = require_ListAccountsCommand();
    var LogoutCommand_1 = require_LogoutCommand();
    var SSOClient_1 = require_SSOClient();
    var SSO = class extends SSOClient_1.SSOClient {
      getRoleCredentials(args, optionsOrCb, cb) {
        const command = new GetRoleCredentialsCommand_1.GetRoleCredentialsCommand(args);
        if (typeof optionsOrCb === "function") {
          this.send(command, optionsOrCb);
        } else if (typeof cb === "function") {
          if (typeof optionsOrCb !== "object")
            throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
          this.send(command, optionsOrCb || {}, cb);
        } else {
          return this.send(command, optionsOrCb);
        }
      }
      listAccountRoles(args, optionsOrCb, cb) {
        const command = new ListAccountRolesCommand_1.ListAccountRolesCommand(args);
        if (typeof optionsOrCb === "function") {
          this.send(command, optionsOrCb);
        } else if (typeof cb === "function") {
          if (typeof optionsOrCb !== "object")
            throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
          this.send(command, optionsOrCb || {}, cb);
        } else {
          return this.send(command, optionsOrCb);
        }
      }
      listAccounts(args, optionsOrCb, cb) {
        const command = new ListAccountsCommand_1.ListAccountsCommand(args);
        if (typeof optionsOrCb === "function") {
          this.send(command, optionsOrCb);
        } else if (typeof cb === "function") {
          if (typeof optionsOrCb !== "object")
            throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
          this.send(command, optionsOrCb || {}, cb);
        } else {
          return this.send(command, optionsOrCb);
        }
      }
      logout(args, optionsOrCb, cb) {
        const command = new LogoutCommand_1.LogoutCommand(args);
        if (typeof optionsOrCb === "function") {
          this.send(command, optionsOrCb);
        } else if (typeof cb === "function") {
          if (typeof optionsOrCb !== "object")
            throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
          this.send(command, optionsOrCb || {}, cb);
        } else {
          return this.send(command, optionsOrCb);
        }
      }
    };
    exports.SSO = SSO;
  }
});

// node_modules/@aws-sdk/client-sso/dist-cjs/commands/index.js
var require_commands = __commonJS({
  "node_modules/@aws-sdk/client-sso/dist-cjs/commands/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require_tslib();
    tslib_1.__exportStar(require_GetRoleCredentialsCommand(), exports);
    tslib_1.__exportStar(require_ListAccountRolesCommand(), exports);
    tslib_1.__exportStar(require_ListAccountsCommand(), exports);
    tslib_1.__exportStar(require_LogoutCommand(), exports);
  }
});

// node_modules/@aws-sdk/client-sso/dist-cjs/models/index.js
var require_models = __commonJS({
  "node_modules/@aws-sdk/client-sso/dist-cjs/models/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require_tslib();
    tslib_1.__exportStar(require_models_03(), exports);
  }
});

// node_modules/@aws-sdk/client-sso/dist-cjs/pagination/Interfaces.js
var require_Interfaces = __commonJS({
  "node_modules/@aws-sdk/client-sso/dist-cjs/pagination/Interfaces.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/@aws-sdk/client-sso/dist-cjs/pagination/ListAccountRolesPaginator.js
var require_ListAccountRolesPaginator = __commonJS({
  "node_modules/@aws-sdk/client-sso/dist-cjs/pagination/ListAccountRolesPaginator.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.paginateListAccountRoles = void 0;
    var ListAccountRolesCommand_1 = require_ListAccountRolesCommand();
    var SSO_1 = require_SSO();
    var SSOClient_1 = require_SSOClient();
    var makePagedClientRequest = async (client, input, ...args) => {
      return await client.send(new ListAccountRolesCommand_1.ListAccountRolesCommand(input), ...args);
    };
    var makePagedRequest = async (client, input, ...args) => {
      return await client.listAccountRoles(input, ...args);
    };
    async function* paginateListAccountRoles(config, input, ...additionalArguments) {
      let token = config.startingToken || void 0;
      let hasNext = true;
      let page;
      while (hasNext) {
        input.nextToken = token;
        input["maxResults"] = config.pageSize;
        if (config.client instanceof SSO_1.SSO) {
          page = await makePagedRequest(config.client, input, ...additionalArguments);
        } else if (config.client instanceof SSOClient_1.SSOClient) {
          page = await makePagedClientRequest(config.client, input, ...additionalArguments);
        } else {
          throw new Error("Invalid client, expected SSO | SSOClient");
        }
        yield page;
        const prevToken = token;
        token = page.nextToken;
        hasNext = !!(token && (!config.stopOnSameToken || token !== prevToken));
      }
      return void 0;
    }
    exports.paginateListAccountRoles = paginateListAccountRoles;
  }
});

// node_modules/@aws-sdk/client-sso/dist-cjs/pagination/ListAccountsPaginator.js
var require_ListAccountsPaginator = __commonJS({
  "node_modules/@aws-sdk/client-sso/dist-cjs/pagination/ListAccountsPaginator.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.paginateListAccounts = void 0;
    var ListAccountsCommand_1 = require_ListAccountsCommand();
    var SSO_1 = require_SSO();
    var SSOClient_1 = require_SSOClient();
    var makePagedClientRequest = async (client, input, ...args) => {
      return await client.send(new ListAccountsCommand_1.ListAccountsCommand(input), ...args);
    };
    var makePagedRequest = async (client, input, ...args) => {
      return await client.listAccounts(input, ...args);
    };
    async function* paginateListAccounts(config, input, ...additionalArguments) {
      let token = config.startingToken || void 0;
      let hasNext = true;
      let page;
      while (hasNext) {
        input.nextToken = token;
        input["maxResults"] = config.pageSize;
        if (config.client instanceof SSO_1.SSO) {
          page = await makePagedRequest(config.client, input, ...additionalArguments);
        } else if (config.client instanceof SSOClient_1.SSOClient) {
          page = await makePagedClientRequest(config.client, input, ...additionalArguments);
        } else {
          throw new Error("Invalid client, expected SSO | SSOClient");
        }
        yield page;
        const prevToken = token;
        token = page.nextToken;
        hasNext = !!(token && (!config.stopOnSameToken || token !== prevToken));
      }
      return void 0;
    }
    exports.paginateListAccounts = paginateListAccounts;
  }
});

// node_modules/@aws-sdk/client-sso/dist-cjs/pagination/index.js
var require_pagination = __commonJS({
  "node_modules/@aws-sdk/client-sso/dist-cjs/pagination/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require_tslib();
    tslib_1.__exportStar(require_Interfaces(), exports);
    tslib_1.__exportStar(require_ListAccountRolesPaginator(), exports);
    tslib_1.__exportStar(require_ListAccountsPaginator(), exports);
  }
});

// node_modules/@aws-sdk/client-sso/dist-cjs/index.js
var require_dist_cjs37 = __commonJS({
  "node_modules/@aws-sdk/client-sso/dist-cjs/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SSOServiceException = void 0;
    var tslib_1 = require_tslib();
    tslib_1.__exportStar(require_SSO(), exports);
    tslib_1.__exportStar(require_SSOClient(), exports);
    tslib_1.__exportStar(require_commands(), exports);
    tslib_1.__exportStar(require_models(), exports);
    tslib_1.__exportStar(require_pagination(), exports);
    var SSOServiceException_1 = require_SSOServiceException();
    Object.defineProperty(exports, "SSOServiceException", { enumerable: true, get: function() {
      return SSOServiceException_1.SSOServiceException;
    } });
  }
});

// node_modules/@aws-sdk/credential-provider-sso/dist-cjs/resolveSSOCredentials.js
var require_resolveSSOCredentials = __commonJS({
  "node_modules/@aws-sdk/credential-provider-sso/dist-cjs/resolveSSOCredentials.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.resolveSSOCredentials = void 0;
    var client_sso_1 = require_dist_cjs37();
    var property_provider_1 = require_dist_cjs14();
    var shared_ini_file_loader_1 = require_dist_cjs23();
    var EXPIRE_WINDOW_MS = 15 * 60 * 1e3;
    var SHOULD_FAIL_CREDENTIAL_CHAIN = false;
    var resolveSSOCredentials = async ({ ssoStartUrl, ssoAccountId, ssoRegion, ssoRoleName, ssoClient }) => {
      let token;
      const refreshMessage = `To refresh this SSO session run aws sso login with the corresponding profile.`;
      try {
        token = await (0, shared_ini_file_loader_1.getSSOTokenFromFile)(ssoStartUrl);
      } catch (e2) {
        throw new property_provider_1.CredentialsProviderError(`The SSO session associated with this profile is invalid. ${refreshMessage}`, SHOULD_FAIL_CREDENTIAL_CHAIN);
      }
      if (new Date(token.expiresAt).getTime() - Date.now() <= EXPIRE_WINDOW_MS) {
        throw new property_provider_1.CredentialsProviderError(`The SSO session associated with this profile has expired. ${refreshMessage}`, SHOULD_FAIL_CREDENTIAL_CHAIN);
      }
      const { accessToken } = token;
      const sso = ssoClient || new client_sso_1.SSOClient({ region: ssoRegion });
      let ssoResp;
      try {
        ssoResp = await sso.send(new client_sso_1.GetRoleCredentialsCommand({
          accountId: ssoAccountId,
          roleName: ssoRoleName,
          accessToken
        }));
      } catch (e2) {
        throw property_provider_1.CredentialsProviderError.from(e2, SHOULD_FAIL_CREDENTIAL_CHAIN);
      }
      const { roleCredentials: { accessKeyId, secretAccessKey, sessionToken, expiration } = {} } = ssoResp;
      if (!accessKeyId || !secretAccessKey || !sessionToken || !expiration) {
        throw new property_provider_1.CredentialsProviderError("SSO returns an invalid temporary credential.", SHOULD_FAIL_CREDENTIAL_CHAIN);
      }
      return { accessKeyId, secretAccessKey, sessionToken, expiration: new Date(expiration) };
    };
    exports.resolveSSOCredentials = resolveSSOCredentials;
  }
});

// node_modules/@aws-sdk/credential-provider-sso/dist-cjs/validateSsoProfile.js
var require_validateSsoProfile = __commonJS({
  "node_modules/@aws-sdk/credential-provider-sso/dist-cjs/validateSsoProfile.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validateSsoProfile = void 0;
    var property_provider_1 = require_dist_cjs14();
    var validateSsoProfile = (profile) => {
      const { sso_start_url, sso_account_id, sso_region, sso_role_name } = profile;
      if (!sso_start_url || !sso_account_id || !sso_region || !sso_role_name) {
        throw new property_provider_1.CredentialsProviderError(`Profile is configured with invalid SSO credentials. Required parameters "sso_account_id", "sso_region", "sso_role_name", "sso_start_url". Got ${Object.keys(profile).join(", ")}
Reference: https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-sso.html`, false);
      }
      return profile;
    };
    exports.validateSsoProfile = validateSsoProfile;
  }
});

// node_modules/@aws-sdk/credential-provider-sso/dist-cjs/fromSSO.js
var require_fromSSO = __commonJS({
  "node_modules/@aws-sdk/credential-provider-sso/dist-cjs/fromSSO.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.fromSSO = void 0;
    var property_provider_1 = require_dist_cjs14();
    var shared_ini_file_loader_1 = require_dist_cjs23();
    var isSsoProfile_1 = require_isSsoProfile();
    var resolveSSOCredentials_1 = require_resolveSSOCredentials();
    var validateSsoProfile_1 = require_validateSsoProfile();
    var fromSSO = (init = {}) => async () => {
      const { ssoStartUrl, ssoAccountId, ssoRegion, ssoRoleName, ssoClient } = init;
      if (!ssoStartUrl && !ssoAccountId && !ssoRegion && !ssoRoleName) {
        const profiles = await (0, shared_ini_file_loader_1.parseKnownFiles)(init);
        const profileName = (0, shared_ini_file_loader_1.getProfileName)(init);
        const profile = profiles[profileName];
        if (!(0, isSsoProfile_1.isSsoProfile)(profile)) {
          throw new property_provider_1.CredentialsProviderError(`Profile ${profileName} is not configured with SSO credentials.`);
        }
        const { sso_start_url, sso_account_id, sso_region, sso_role_name } = (0, validateSsoProfile_1.validateSsoProfile)(profile);
        return (0, resolveSSOCredentials_1.resolveSSOCredentials)({
          ssoStartUrl: sso_start_url,
          ssoAccountId: sso_account_id,
          ssoRegion: sso_region,
          ssoRoleName: sso_role_name,
          ssoClient
        });
      } else if (!ssoStartUrl || !ssoAccountId || !ssoRegion || !ssoRoleName) {
        throw new property_provider_1.CredentialsProviderError('Incomplete configuration. The fromSSO() argument hash must include "ssoStartUrl", "ssoAccountId", "ssoRegion", "ssoRoleName"');
      } else {
        return (0, resolveSSOCredentials_1.resolveSSOCredentials)({ ssoStartUrl, ssoAccountId, ssoRegion, ssoRoleName, ssoClient });
      }
    };
    exports.fromSSO = fromSSO;
  }
});

// node_modules/@aws-sdk/credential-provider-sso/dist-cjs/types.js
var require_types4 = __commonJS({
  "node_modules/@aws-sdk/credential-provider-sso/dist-cjs/types.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/@aws-sdk/credential-provider-sso/dist-cjs/index.js
var require_dist_cjs38 = __commonJS({
  "node_modules/@aws-sdk/credential-provider-sso/dist-cjs/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require_tslib();
    tslib_1.__exportStar(require_fromSSO(), exports);
    tslib_1.__exportStar(require_isSsoProfile(), exports);
    tslib_1.__exportStar(require_types4(), exports);
    tslib_1.__exportStar(require_validateSsoProfile(), exports);
  }
});

// node_modules/@aws-sdk/credential-provider-ini/dist-cjs/resolveSsoCredentials.js
var require_resolveSsoCredentials = __commonJS({
  "node_modules/@aws-sdk/credential-provider-ini/dist-cjs/resolveSsoCredentials.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.resolveSsoCredentials = exports.isSsoProfile = void 0;
    var credential_provider_sso_1 = require_dist_cjs38();
    var credential_provider_sso_2 = require_dist_cjs38();
    Object.defineProperty(exports, "isSsoProfile", { enumerable: true, get: function() {
      return credential_provider_sso_2.isSsoProfile;
    } });
    var resolveSsoCredentials = (data) => {
      const { sso_start_url, sso_account_id, sso_region, sso_role_name } = (0, credential_provider_sso_1.validateSsoProfile)(data);
      return (0, credential_provider_sso_1.fromSSO)({
        ssoStartUrl: sso_start_url,
        ssoAccountId: sso_account_id,
        ssoRegion: sso_region,
        ssoRoleName: sso_role_name
      })();
    };
    exports.resolveSsoCredentials = resolveSsoCredentials;
  }
});

// node_modules/@aws-sdk/credential-provider-ini/dist-cjs/resolveStaticCredentials.js
var require_resolveStaticCredentials = __commonJS({
  "node_modules/@aws-sdk/credential-provider-ini/dist-cjs/resolveStaticCredentials.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.resolveStaticCredentials = exports.isStaticCredsProfile = void 0;
    var isStaticCredsProfile = (arg) => Boolean(arg) && typeof arg === "object" && typeof arg.aws_access_key_id === "string" && typeof arg.aws_secret_access_key === "string" && ["undefined", "string"].indexOf(typeof arg.aws_session_token) > -1;
    exports.isStaticCredsProfile = isStaticCredsProfile;
    var resolveStaticCredentials = (profile) => Promise.resolve({
      accessKeyId: profile.aws_access_key_id,
      secretAccessKey: profile.aws_secret_access_key,
      sessionToken: profile.aws_session_token
    });
    exports.resolveStaticCredentials = resolveStaticCredentials;
  }
});

// node_modules/@aws-sdk/credential-provider-web-identity/dist-cjs/fromWebToken.js
var require_fromWebToken = __commonJS({
  "node_modules/@aws-sdk/credential-provider-web-identity/dist-cjs/fromWebToken.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.fromWebToken = void 0;
    var property_provider_1 = require_dist_cjs14();
    var fromWebToken = (init) => () => {
      const { roleArn, roleSessionName, webIdentityToken, providerId, policyArns, policy, durationSeconds, roleAssumerWithWebIdentity } = init;
      if (!roleAssumerWithWebIdentity) {
        throw new property_provider_1.CredentialsProviderError(`Role Arn '${roleArn}' needs to be assumed with web identity, but no role assumption callback was provided.`, false);
      }
      return roleAssumerWithWebIdentity({
        RoleArn: roleArn,
        RoleSessionName: roleSessionName !== null && roleSessionName !== void 0 ? roleSessionName : `aws-sdk-js-session-${Date.now()}`,
        WebIdentityToken: webIdentityToken,
        ProviderId: providerId,
        PolicyArns: policyArns,
        Policy: policy,
        DurationSeconds: durationSeconds
      });
    };
    exports.fromWebToken = fromWebToken;
  }
});

// node_modules/@aws-sdk/credential-provider-web-identity/dist-cjs/fromTokenFile.js
var require_fromTokenFile = __commonJS({
  "node_modules/@aws-sdk/credential-provider-web-identity/dist-cjs/fromTokenFile.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.fromTokenFile = void 0;
    var property_provider_1 = require_dist_cjs14();
    var fs_1 = require("fs");
    var fromWebToken_1 = require_fromWebToken();
    var ENV_TOKEN_FILE = "AWS_WEB_IDENTITY_TOKEN_FILE";
    var ENV_ROLE_ARN = "AWS_ROLE_ARN";
    var ENV_ROLE_SESSION_NAME = "AWS_ROLE_SESSION_NAME";
    var fromTokenFile = (init = {}) => async () => {
      return resolveTokenFile(init);
    };
    exports.fromTokenFile = fromTokenFile;
    var resolveTokenFile = (init) => {
      var _a, _b, _c;
      const webIdentityTokenFile = (_a = init === null || init === void 0 ? void 0 : init.webIdentityTokenFile) !== null && _a !== void 0 ? _a : process.env[ENV_TOKEN_FILE];
      const roleArn = (_b = init === null || init === void 0 ? void 0 : init.roleArn) !== null && _b !== void 0 ? _b : process.env[ENV_ROLE_ARN];
      const roleSessionName = (_c = init === null || init === void 0 ? void 0 : init.roleSessionName) !== null && _c !== void 0 ? _c : process.env[ENV_ROLE_SESSION_NAME];
      if (!webIdentityTokenFile || !roleArn) {
        throw new property_provider_1.CredentialsProviderError("Web identity configuration not specified");
      }
      return (0, fromWebToken_1.fromWebToken)({
        ...init,
        webIdentityToken: (0, fs_1.readFileSync)(webIdentityTokenFile, { encoding: "ascii" }),
        roleArn,
        roleSessionName
      })();
    };
  }
});

// node_modules/@aws-sdk/credential-provider-web-identity/dist-cjs/index.js
var require_dist_cjs39 = __commonJS({
  "node_modules/@aws-sdk/credential-provider-web-identity/dist-cjs/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require_tslib();
    tslib_1.__exportStar(require_fromTokenFile(), exports);
    tslib_1.__exportStar(require_fromWebToken(), exports);
  }
});

// node_modules/@aws-sdk/credential-provider-ini/dist-cjs/resolveWebIdentityCredentials.js
var require_resolveWebIdentityCredentials = __commonJS({
  "node_modules/@aws-sdk/credential-provider-ini/dist-cjs/resolveWebIdentityCredentials.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.resolveWebIdentityCredentials = exports.isWebIdentityProfile = void 0;
    var credential_provider_web_identity_1 = require_dist_cjs39();
    var isWebIdentityProfile = (arg) => Boolean(arg) && typeof arg === "object" && typeof arg.web_identity_token_file === "string" && typeof arg.role_arn === "string" && ["undefined", "string"].indexOf(typeof arg.role_session_name) > -1;
    exports.isWebIdentityProfile = isWebIdentityProfile;
    var resolveWebIdentityCredentials = async (profile, options) => (0, credential_provider_web_identity_1.fromTokenFile)({
      webIdentityTokenFile: profile.web_identity_token_file,
      roleArn: profile.role_arn,
      roleSessionName: profile.role_session_name,
      roleAssumerWithWebIdentity: options.roleAssumerWithWebIdentity
    })();
    exports.resolveWebIdentityCredentials = resolveWebIdentityCredentials;
  }
});

// node_modules/@aws-sdk/credential-provider-ini/dist-cjs/resolveProfileData.js
var require_resolveProfileData = __commonJS({
  "node_modules/@aws-sdk/credential-provider-ini/dist-cjs/resolveProfileData.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.resolveProfileData = void 0;
    var property_provider_1 = require_dist_cjs14();
    var resolveAssumeRoleCredentials_1 = require_resolveAssumeRoleCredentials();
    var resolveSsoCredentials_1 = require_resolveSsoCredentials();
    var resolveStaticCredentials_1 = require_resolveStaticCredentials();
    var resolveWebIdentityCredentials_1 = require_resolveWebIdentityCredentials();
    var resolveProfileData = async (profileName, profiles, options, visitedProfiles = {}) => {
      const data = profiles[profileName];
      if (Object.keys(visitedProfiles).length > 0 && (0, resolveStaticCredentials_1.isStaticCredsProfile)(data)) {
        return (0, resolveStaticCredentials_1.resolveStaticCredentials)(data);
      }
      if ((0, resolveAssumeRoleCredentials_1.isAssumeRoleProfile)(data)) {
        return (0, resolveAssumeRoleCredentials_1.resolveAssumeRoleCredentials)(profileName, profiles, options, visitedProfiles);
      }
      if ((0, resolveStaticCredentials_1.isStaticCredsProfile)(data)) {
        return (0, resolveStaticCredentials_1.resolveStaticCredentials)(data);
      }
      if ((0, resolveWebIdentityCredentials_1.isWebIdentityProfile)(data)) {
        return (0, resolveWebIdentityCredentials_1.resolveWebIdentityCredentials)(data, options);
      }
      if ((0, resolveSsoCredentials_1.isSsoProfile)(data)) {
        return (0, resolveSsoCredentials_1.resolveSsoCredentials)(data);
      }
      throw new property_provider_1.CredentialsProviderError(`Profile ${profileName} could not be found or parsed in shared credentials file.`);
    };
    exports.resolveProfileData = resolveProfileData;
  }
});

// node_modules/@aws-sdk/credential-provider-ini/dist-cjs/fromIni.js
var require_fromIni = __commonJS({
  "node_modules/@aws-sdk/credential-provider-ini/dist-cjs/fromIni.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.fromIni = void 0;
    var shared_ini_file_loader_1 = require_dist_cjs23();
    var resolveProfileData_1 = require_resolveProfileData();
    var fromIni = (init = {}) => async () => {
      const profiles = await (0, shared_ini_file_loader_1.parseKnownFiles)(init);
      return (0, resolveProfileData_1.resolveProfileData)((0, shared_ini_file_loader_1.getProfileName)(init), profiles, init);
    };
    exports.fromIni = fromIni;
  }
});

// node_modules/@aws-sdk/credential-provider-ini/dist-cjs/index.js
var require_dist_cjs40 = __commonJS({
  "node_modules/@aws-sdk/credential-provider-ini/dist-cjs/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require_tslib();
    tslib_1.__exportStar(require_fromIni(), exports);
  }
});

// node_modules/@aws-sdk/credential-provider-process/dist-cjs/getValidatedProcessCredentials.js
var require_getValidatedProcessCredentials = __commonJS({
  "node_modules/@aws-sdk/credential-provider-process/dist-cjs/getValidatedProcessCredentials.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getValidatedProcessCredentials = void 0;
    var getValidatedProcessCredentials = (profileName, data) => {
      if (data.Version !== 1) {
        throw Error(`Profile ${profileName} credential_process did not return Version 1.`);
      }
      if (data.AccessKeyId === void 0 || data.SecretAccessKey === void 0) {
        throw Error(`Profile ${profileName} credential_process returned invalid credentials.`);
      }
      if (data.Expiration) {
        const currentTime = new Date();
        const expireTime = new Date(data.Expiration);
        if (expireTime < currentTime) {
          throw Error(`Profile ${profileName} credential_process returned expired credentials.`);
        }
      }
      return {
        accessKeyId: data.AccessKeyId,
        secretAccessKey: data.SecretAccessKey,
        ...data.SessionToken && { sessionToken: data.SessionToken },
        ...data.Expiration && { expiration: new Date(data.Expiration) }
      };
    };
    exports.getValidatedProcessCredentials = getValidatedProcessCredentials;
  }
});

// node_modules/@aws-sdk/credential-provider-process/dist-cjs/resolveProcessCredentials.js
var require_resolveProcessCredentials = __commonJS({
  "node_modules/@aws-sdk/credential-provider-process/dist-cjs/resolveProcessCredentials.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.resolveProcessCredentials = void 0;
    var property_provider_1 = require_dist_cjs14();
    var child_process_1 = require("child_process");
    var util_1 = require("util");
    var getValidatedProcessCredentials_1 = require_getValidatedProcessCredentials();
    var resolveProcessCredentials = async (profileName, profiles) => {
      const profile = profiles[profileName];
      if (profiles[profileName]) {
        const credentialProcess = profile["credential_process"];
        if (credentialProcess !== void 0) {
          const execPromise = (0, util_1.promisify)(child_process_1.exec);
          try {
            const { stdout } = await execPromise(credentialProcess);
            let data;
            try {
              data = JSON.parse(stdout.trim());
            } catch (_a) {
              throw Error(`Profile ${profileName} credential_process returned invalid JSON.`);
            }
            return (0, getValidatedProcessCredentials_1.getValidatedProcessCredentials)(profileName, data);
          } catch (error) {
            throw new property_provider_1.CredentialsProviderError(error.message);
          }
        } else {
          throw new property_provider_1.CredentialsProviderError(`Profile ${profileName} did not contain credential_process.`);
        }
      } else {
        throw new property_provider_1.CredentialsProviderError(`Profile ${profileName} could not be found in shared credentials file.`);
      }
    };
    exports.resolveProcessCredentials = resolveProcessCredentials;
  }
});

// node_modules/@aws-sdk/credential-provider-process/dist-cjs/fromProcess.js
var require_fromProcess = __commonJS({
  "node_modules/@aws-sdk/credential-provider-process/dist-cjs/fromProcess.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.fromProcess = void 0;
    var shared_ini_file_loader_1 = require_dist_cjs23();
    var resolveProcessCredentials_1 = require_resolveProcessCredentials();
    var fromProcess = (init = {}) => async () => {
      const profiles = await (0, shared_ini_file_loader_1.parseKnownFiles)(init);
      return (0, resolveProcessCredentials_1.resolveProcessCredentials)((0, shared_ini_file_loader_1.getProfileName)(init), profiles);
    };
    exports.fromProcess = fromProcess;
  }
});

// node_modules/@aws-sdk/credential-provider-process/dist-cjs/index.js
var require_dist_cjs41 = __commonJS({
  "node_modules/@aws-sdk/credential-provider-process/dist-cjs/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require_tslib();
    tslib_1.__exportStar(require_fromProcess(), exports);
  }
});

// node_modules/@aws-sdk/credential-provider-node/dist-cjs/remoteProvider.js
var require_remoteProvider = __commonJS({
  "node_modules/@aws-sdk/credential-provider-node/dist-cjs/remoteProvider.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.remoteProvider = exports.ENV_IMDS_DISABLED = void 0;
    var credential_provider_imds_1 = require_dist_cjs27();
    var property_provider_1 = require_dist_cjs14();
    exports.ENV_IMDS_DISABLED = "AWS_EC2_METADATA_DISABLED";
    var remoteProvider = (init) => {
      if (process.env[credential_provider_imds_1.ENV_CMDS_RELATIVE_URI] || process.env[credential_provider_imds_1.ENV_CMDS_FULL_URI]) {
        return (0, credential_provider_imds_1.fromContainerMetadata)(init);
      }
      if (process.env[exports.ENV_IMDS_DISABLED]) {
        return async () => {
          throw new property_provider_1.CredentialsProviderError("EC2 Instance Metadata Service access disabled");
        };
      }
      return (0, credential_provider_imds_1.fromInstanceMetadata)(init);
    };
    exports.remoteProvider = remoteProvider;
  }
});

// node_modules/@aws-sdk/credential-provider-node/dist-cjs/defaultProvider.js
var require_defaultProvider = __commonJS({
  "node_modules/@aws-sdk/credential-provider-node/dist-cjs/defaultProvider.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.defaultProvider = void 0;
    var credential_provider_env_1 = require_dist_cjs22();
    var credential_provider_ini_1 = require_dist_cjs40();
    var credential_provider_process_1 = require_dist_cjs41();
    var credential_provider_sso_1 = require_dist_cjs38();
    var credential_provider_web_identity_1 = require_dist_cjs39();
    var property_provider_1 = require_dist_cjs14();
    var shared_ini_file_loader_1 = require_dist_cjs23();
    var remoteProvider_1 = require_remoteProvider();
    var defaultProvider = (init = {}) => (0, property_provider_1.memoize)((0, property_provider_1.chain)(...init.profile || process.env[shared_ini_file_loader_1.ENV_PROFILE] ? [] : [(0, credential_provider_env_1.fromEnv)()], (0, credential_provider_sso_1.fromSSO)(init), (0, credential_provider_ini_1.fromIni)(init), (0, credential_provider_process_1.fromProcess)(init), (0, credential_provider_web_identity_1.fromTokenFile)(init), (0, remoteProvider_1.remoteProvider)(init), async () => {
      throw new property_provider_1.CredentialsProviderError("Could not load credentials from any providers", false);
    }), (credentials) => credentials.expiration !== void 0 && credentials.expiration.getTime() - Date.now() < 3e5, (credentials) => credentials.expiration !== void 0);
    exports.defaultProvider = defaultProvider;
  }
});

// node_modules/@aws-sdk/credential-provider-node/dist-cjs/index.js
var require_dist_cjs42 = __commonJS({
  "node_modules/@aws-sdk/credential-provider-node/dist-cjs/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require_tslib();
    tslib_1.__exportStar(require_defaultProvider(), exports);
  }
});

// node_modules/@aws-sdk/client-sts/dist-cjs/endpoints.js
var require_endpoints2 = __commonJS({
  "node_modules/@aws-sdk/client-sts/dist-cjs/endpoints.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.defaultRegionInfoProvider = void 0;
    var config_resolver_1 = require_dist_cjs7();
    var regionHash = {
      "aws-global": {
        variants: [
          {
            hostname: "sts.amazonaws.com",
            tags: []
          }
        ],
        signingRegion: "us-east-1"
      },
      "us-east-1": {
        variants: [
          {
            hostname: "sts-fips.us-east-1.amazonaws.com",
            tags: ["fips"]
          }
        ]
      },
      "us-east-2": {
        variants: [
          {
            hostname: "sts-fips.us-east-2.amazonaws.com",
            tags: ["fips"]
          }
        ]
      },
      "us-gov-east-1": {
        variants: [
          {
            hostname: "sts.us-gov-east-1.amazonaws.com",
            tags: ["fips"]
          }
        ]
      },
      "us-gov-west-1": {
        variants: [
          {
            hostname: "sts.us-gov-west-1.amazonaws.com",
            tags: ["fips"]
          }
        ]
      },
      "us-west-1": {
        variants: [
          {
            hostname: "sts-fips.us-west-1.amazonaws.com",
            tags: ["fips"]
          }
        ]
      },
      "us-west-2": {
        variants: [
          {
            hostname: "sts-fips.us-west-2.amazonaws.com",
            tags: ["fips"]
          }
        ]
      }
    };
    var partitionHash = {
      aws: {
        regions: [
          "af-south-1",
          "ap-east-1",
          "ap-northeast-1",
          "ap-northeast-2",
          "ap-northeast-3",
          "ap-south-1",
          "ap-southeast-1",
          "ap-southeast-2",
          "ap-southeast-3",
          "aws-global",
          "ca-central-1",
          "eu-central-1",
          "eu-north-1",
          "eu-south-1",
          "eu-west-1",
          "eu-west-2",
          "eu-west-3",
          "me-south-1",
          "sa-east-1",
          "us-east-1",
          "us-east-1-fips",
          "us-east-2",
          "us-east-2-fips",
          "us-west-1",
          "us-west-1-fips",
          "us-west-2",
          "us-west-2-fips"
        ],
        regionRegex: "^(us|eu|ap|sa|ca|me|af)\\-\\w+\\-\\d+$",
        variants: [
          {
            hostname: "sts.{region}.amazonaws.com",
            tags: []
          },
          {
            hostname: "sts-fips.{region}.amazonaws.com",
            tags: ["fips"]
          },
          {
            hostname: "sts-fips.{region}.api.aws",
            tags: ["dualstack", "fips"]
          },
          {
            hostname: "sts.{region}.api.aws",
            tags: ["dualstack"]
          }
        ]
      },
      "aws-cn": {
        regions: ["cn-north-1", "cn-northwest-1"],
        regionRegex: "^cn\\-\\w+\\-\\d+$",
        variants: [
          {
            hostname: "sts.{region}.amazonaws.com.cn",
            tags: []
          },
          {
            hostname: "sts-fips.{region}.amazonaws.com.cn",
            tags: ["fips"]
          },
          {
            hostname: "sts-fips.{region}.api.amazonwebservices.com.cn",
            tags: ["dualstack", "fips"]
          },
          {
            hostname: "sts.{region}.api.amazonwebservices.com.cn",
            tags: ["dualstack"]
          }
        ]
      },
      "aws-iso": {
        regions: ["us-iso-east-1", "us-iso-west-1"],
        regionRegex: "^us\\-iso\\-\\w+\\-\\d+$",
        variants: [
          {
            hostname: "sts.{region}.c2s.ic.gov",
            tags: []
          },
          {
            hostname: "sts-fips.{region}.c2s.ic.gov",
            tags: ["fips"]
          }
        ]
      },
      "aws-iso-b": {
        regions: ["us-isob-east-1"],
        regionRegex: "^us\\-isob\\-\\w+\\-\\d+$",
        variants: [
          {
            hostname: "sts.{region}.sc2s.sgov.gov",
            tags: []
          },
          {
            hostname: "sts-fips.{region}.sc2s.sgov.gov",
            tags: ["fips"]
          }
        ]
      },
      "aws-us-gov": {
        regions: ["us-gov-east-1", "us-gov-east-1-fips", "us-gov-west-1", "us-gov-west-1-fips"],
        regionRegex: "^us\\-gov\\-\\w+\\-\\d+$",
        variants: [
          {
            hostname: "sts.{region}.amazonaws.com",
            tags: []
          },
          {
            hostname: "sts.{region}.amazonaws.com",
            tags: ["fips"]
          },
          {
            hostname: "sts-fips.{region}.api.aws",
            tags: ["dualstack", "fips"]
          },
          {
            hostname: "sts.{region}.api.aws",
            tags: ["dualstack"]
          }
        ]
      }
    };
    var defaultRegionInfoProvider = async (region, options) => (0, config_resolver_1.getRegionInfo)(region, {
      ...options,
      signingService: "sts",
      regionHash,
      partitionHash
    });
    exports.defaultRegionInfoProvider = defaultRegionInfoProvider;
  }
});

// node_modules/@aws-sdk/client-sts/dist-cjs/runtimeConfig.shared.js
var require_runtimeConfig_shared2 = __commonJS({
  "node_modules/@aws-sdk/client-sts/dist-cjs/runtimeConfig.shared.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getRuntimeConfig = void 0;
    var url_parser_1 = require_dist_cjs26();
    var endpoints_1 = require_endpoints2();
    var getRuntimeConfig = (config) => {
      var _a, _b, _c, _d, _e;
      return {
        apiVersion: "2011-06-15",
        disableHostPrefix: (_a = config === null || config === void 0 ? void 0 : config.disableHostPrefix) !== null && _a !== void 0 ? _a : false,
        logger: (_b = config === null || config === void 0 ? void 0 : config.logger) !== null && _b !== void 0 ? _b : {},
        regionInfoProvider: (_c = config === null || config === void 0 ? void 0 : config.regionInfoProvider) !== null && _c !== void 0 ? _c : endpoints_1.defaultRegionInfoProvider,
        serviceId: (_d = config === null || config === void 0 ? void 0 : config.serviceId) !== null && _d !== void 0 ? _d : "STS",
        urlParser: (_e = config === null || config === void 0 ? void 0 : config.urlParser) !== null && _e !== void 0 ? _e : url_parser_1.parseUrl
      };
    };
    exports.getRuntimeConfig = getRuntimeConfig;
  }
});

// node_modules/@aws-sdk/client-sts/dist-cjs/runtimeConfig.js
var require_runtimeConfig2 = __commonJS({
  "node_modules/@aws-sdk/client-sts/dist-cjs/runtimeConfig.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getRuntimeConfig = void 0;
    var tslib_1 = require_tslib();
    var package_json_1 = tslib_1.__importDefault(require_package2());
    var defaultStsRoleAssumers_1 = require_defaultStsRoleAssumers();
    var config_resolver_1 = require_dist_cjs7();
    var credential_provider_node_1 = require_dist_cjs42();
    var hash_node_1 = require_dist_cjs29();
    var middleware_retry_1 = require_dist_cjs13();
    var node_config_provider_1 = require_dist_cjs24();
    var node_http_handler_1 = require_dist_cjs31();
    var util_base64_node_1 = require_dist_cjs32();
    var util_body_length_node_1 = require_dist_cjs33();
    var util_user_agent_node_1 = require_dist_cjs34();
    var util_utf8_node_1 = require_dist_cjs35();
    var runtimeConfig_shared_1 = require_runtimeConfig_shared2();
    var smithy_client_1 = require_dist_cjs3();
    var util_defaults_mode_node_1 = require_dist_cjs36();
    var smithy_client_2 = require_dist_cjs3();
    var getRuntimeConfig = (config) => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
      (0, smithy_client_2.emitWarningIfUnsupportedVersion)(process.version);
      const defaultsMode = (0, util_defaults_mode_node_1.resolveDefaultsModeConfig)(config);
      const defaultConfigProvider = () => defaultsMode().then(smithy_client_1.loadConfigsForDefaultMode);
      const clientSharedValues = (0, runtimeConfig_shared_1.getRuntimeConfig)(config);
      return {
        ...clientSharedValues,
        ...config,
        runtime: "node",
        defaultsMode,
        base64Decoder: (_a = config === null || config === void 0 ? void 0 : config.base64Decoder) !== null && _a !== void 0 ? _a : util_base64_node_1.fromBase64,
        base64Encoder: (_b = config === null || config === void 0 ? void 0 : config.base64Encoder) !== null && _b !== void 0 ? _b : util_base64_node_1.toBase64,
        bodyLengthChecker: (_c = config === null || config === void 0 ? void 0 : config.bodyLengthChecker) !== null && _c !== void 0 ? _c : util_body_length_node_1.calculateBodyLength,
        credentialDefaultProvider: (_d = config === null || config === void 0 ? void 0 : config.credentialDefaultProvider) !== null && _d !== void 0 ? _d : (0, defaultStsRoleAssumers_1.decorateDefaultCredentialProvider)(credential_provider_node_1.defaultProvider),
        defaultUserAgentProvider: (_e = config === null || config === void 0 ? void 0 : config.defaultUserAgentProvider) !== null && _e !== void 0 ? _e : (0, util_user_agent_node_1.defaultUserAgent)({ serviceId: clientSharedValues.serviceId, clientVersion: package_json_1.default.version }),
        maxAttempts: (_f = config === null || config === void 0 ? void 0 : config.maxAttempts) !== null && _f !== void 0 ? _f : (0, node_config_provider_1.loadConfig)(middleware_retry_1.NODE_MAX_ATTEMPT_CONFIG_OPTIONS),
        region: (_g = config === null || config === void 0 ? void 0 : config.region) !== null && _g !== void 0 ? _g : (0, node_config_provider_1.loadConfig)(config_resolver_1.NODE_REGION_CONFIG_OPTIONS, config_resolver_1.NODE_REGION_CONFIG_FILE_OPTIONS),
        requestHandler: (_h = config === null || config === void 0 ? void 0 : config.requestHandler) !== null && _h !== void 0 ? _h : new node_http_handler_1.NodeHttpHandler(defaultConfigProvider),
        retryMode: (_j = config === null || config === void 0 ? void 0 : config.retryMode) !== null && _j !== void 0 ? _j : (0, node_config_provider_1.loadConfig)({
          ...middleware_retry_1.NODE_RETRY_MODE_CONFIG_OPTIONS,
          default: async () => (await defaultConfigProvider()).retryMode || middleware_retry_1.DEFAULT_RETRY_MODE
        }),
        sha256: (_k = config === null || config === void 0 ? void 0 : config.sha256) !== null && _k !== void 0 ? _k : hash_node_1.Hash.bind(null, "sha256"),
        streamCollector: (_l = config === null || config === void 0 ? void 0 : config.streamCollector) !== null && _l !== void 0 ? _l : node_http_handler_1.streamCollector,
        useDualstackEndpoint: (_m = config === null || config === void 0 ? void 0 : config.useDualstackEndpoint) !== null && _m !== void 0 ? _m : (0, node_config_provider_1.loadConfig)(config_resolver_1.NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS),
        useFipsEndpoint: (_o = config === null || config === void 0 ? void 0 : config.useFipsEndpoint) !== null && _o !== void 0 ? _o : (0, node_config_provider_1.loadConfig)(config_resolver_1.NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS),
        utf8Decoder: (_p = config === null || config === void 0 ? void 0 : config.utf8Decoder) !== null && _p !== void 0 ? _p : util_utf8_node_1.fromUtf8,
        utf8Encoder: (_q = config === null || config === void 0 ? void 0 : config.utf8Encoder) !== null && _q !== void 0 ? _q : util_utf8_node_1.toUtf8
      };
    };
    exports.getRuntimeConfig = getRuntimeConfig;
  }
});

// node_modules/@aws-sdk/client-sts/dist-cjs/STSClient.js
var require_STSClient = __commonJS({
  "node_modules/@aws-sdk/client-sts/dist-cjs/STSClient.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.STSClient = void 0;
    var config_resolver_1 = require_dist_cjs7();
    var middleware_content_length_1 = require_dist_cjs8();
    var middleware_host_header_1 = require_dist_cjs9();
    var middleware_logger_1 = require_dist_cjs10();
    var middleware_recursion_detection_1 = require_dist_cjs11();
    var middleware_retry_1 = require_dist_cjs13();
    var middleware_sdk_sts_1 = require_dist_cjs21();
    var middleware_user_agent_1 = require_dist_cjs20();
    var smithy_client_1 = require_dist_cjs3();
    var runtimeConfig_1 = require_runtimeConfig2();
    var STSClient = class extends smithy_client_1.Client {
      constructor(configuration) {
        const _config_0 = (0, runtimeConfig_1.getRuntimeConfig)(configuration);
        const _config_1 = (0, config_resolver_1.resolveRegionConfig)(_config_0);
        const _config_2 = (0, config_resolver_1.resolveEndpointsConfig)(_config_1);
        const _config_3 = (0, middleware_retry_1.resolveRetryConfig)(_config_2);
        const _config_4 = (0, middleware_host_header_1.resolveHostHeaderConfig)(_config_3);
        const _config_5 = (0, middleware_sdk_sts_1.resolveStsAuthConfig)(_config_4, { stsClientCtor: STSClient });
        const _config_6 = (0, middleware_user_agent_1.resolveUserAgentConfig)(_config_5);
        super(_config_6);
        this.config = _config_6;
        this.middlewareStack.use((0, middleware_retry_1.getRetryPlugin)(this.config));
        this.middlewareStack.use((0, middleware_content_length_1.getContentLengthPlugin)(this.config));
        this.middlewareStack.use((0, middleware_host_header_1.getHostHeaderPlugin)(this.config));
        this.middlewareStack.use((0, middleware_logger_1.getLoggerPlugin)(this.config));
        this.middlewareStack.use((0, middleware_recursion_detection_1.getRecursionDetectionPlugin)(this.config));
        this.middlewareStack.use((0, middleware_user_agent_1.getUserAgentPlugin)(this.config));
      }
      destroy() {
        super.destroy();
      }
    };
    exports.STSClient = STSClient;
  }
});

// node_modules/@aws-sdk/client-sts/dist-cjs/STS.js
var require_STS = __commonJS({
  "node_modules/@aws-sdk/client-sts/dist-cjs/STS.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.STS = void 0;
    var AssumeRoleCommand_1 = require_AssumeRoleCommand();
    var AssumeRoleWithSAMLCommand_1 = require_AssumeRoleWithSAMLCommand();
    var AssumeRoleWithWebIdentityCommand_1 = require_AssumeRoleWithWebIdentityCommand();
    var DecodeAuthorizationMessageCommand_1 = require_DecodeAuthorizationMessageCommand();
    var GetAccessKeyInfoCommand_1 = require_GetAccessKeyInfoCommand();
    var GetCallerIdentityCommand_1 = require_GetCallerIdentityCommand();
    var GetFederationTokenCommand_1 = require_GetFederationTokenCommand();
    var GetSessionTokenCommand_1 = require_GetSessionTokenCommand();
    var STSClient_1 = require_STSClient();
    var STS = class extends STSClient_1.STSClient {
      assumeRole(args, optionsOrCb, cb) {
        const command = new AssumeRoleCommand_1.AssumeRoleCommand(args);
        if (typeof optionsOrCb === "function") {
          this.send(command, optionsOrCb);
        } else if (typeof cb === "function") {
          if (typeof optionsOrCb !== "object")
            throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
          this.send(command, optionsOrCb || {}, cb);
        } else {
          return this.send(command, optionsOrCb);
        }
      }
      assumeRoleWithSAML(args, optionsOrCb, cb) {
        const command = new AssumeRoleWithSAMLCommand_1.AssumeRoleWithSAMLCommand(args);
        if (typeof optionsOrCb === "function") {
          this.send(command, optionsOrCb);
        } else if (typeof cb === "function") {
          if (typeof optionsOrCb !== "object")
            throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
          this.send(command, optionsOrCb || {}, cb);
        } else {
          return this.send(command, optionsOrCb);
        }
      }
      assumeRoleWithWebIdentity(args, optionsOrCb, cb) {
        const command = new AssumeRoleWithWebIdentityCommand_1.AssumeRoleWithWebIdentityCommand(args);
        if (typeof optionsOrCb === "function") {
          this.send(command, optionsOrCb);
        } else if (typeof cb === "function") {
          if (typeof optionsOrCb !== "object")
            throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
          this.send(command, optionsOrCb || {}, cb);
        } else {
          return this.send(command, optionsOrCb);
        }
      }
      decodeAuthorizationMessage(args, optionsOrCb, cb) {
        const command = new DecodeAuthorizationMessageCommand_1.DecodeAuthorizationMessageCommand(args);
        if (typeof optionsOrCb === "function") {
          this.send(command, optionsOrCb);
        } else if (typeof cb === "function") {
          if (typeof optionsOrCb !== "object")
            throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
          this.send(command, optionsOrCb || {}, cb);
        } else {
          return this.send(command, optionsOrCb);
        }
      }
      getAccessKeyInfo(args, optionsOrCb, cb) {
        const command = new GetAccessKeyInfoCommand_1.GetAccessKeyInfoCommand(args);
        if (typeof optionsOrCb === "function") {
          this.send(command, optionsOrCb);
        } else if (typeof cb === "function") {
          if (typeof optionsOrCb !== "object")
            throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
          this.send(command, optionsOrCb || {}, cb);
        } else {
          return this.send(command, optionsOrCb);
        }
      }
      getCallerIdentity(args, optionsOrCb, cb) {
        const command = new GetCallerIdentityCommand_1.GetCallerIdentityCommand(args);
        if (typeof optionsOrCb === "function") {
          this.send(command, optionsOrCb);
        } else if (typeof cb === "function") {
          if (typeof optionsOrCb !== "object")
            throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
          this.send(command, optionsOrCb || {}, cb);
        } else {
          return this.send(command, optionsOrCb);
        }
      }
      getFederationToken(args, optionsOrCb, cb) {
        const command = new GetFederationTokenCommand_1.GetFederationTokenCommand(args);
        if (typeof optionsOrCb === "function") {
          this.send(command, optionsOrCb);
        } else if (typeof cb === "function") {
          if (typeof optionsOrCb !== "object")
            throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
          this.send(command, optionsOrCb || {}, cb);
        } else {
          return this.send(command, optionsOrCb);
        }
      }
      getSessionToken(args, optionsOrCb, cb) {
        const command = new GetSessionTokenCommand_1.GetSessionTokenCommand(args);
        if (typeof optionsOrCb === "function") {
          this.send(command, optionsOrCb);
        } else if (typeof cb === "function") {
          if (typeof optionsOrCb !== "object")
            throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
          this.send(command, optionsOrCb || {}, cb);
        } else {
          return this.send(command, optionsOrCb);
        }
      }
    };
    exports.STS = STS;
  }
});

// node_modules/@aws-sdk/client-sts/dist-cjs/commands/index.js
var require_commands2 = __commonJS({
  "node_modules/@aws-sdk/client-sts/dist-cjs/commands/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require_tslib();
    tslib_1.__exportStar(require_AssumeRoleCommand(), exports);
    tslib_1.__exportStar(require_AssumeRoleWithSAMLCommand(), exports);
    tslib_1.__exportStar(require_AssumeRoleWithWebIdentityCommand(), exports);
    tslib_1.__exportStar(require_DecodeAuthorizationMessageCommand(), exports);
    tslib_1.__exportStar(require_GetAccessKeyInfoCommand(), exports);
    tslib_1.__exportStar(require_GetCallerIdentityCommand(), exports);
    tslib_1.__exportStar(require_GetFederationTokenCommand(), exports);
    tslib_1.__exportStar(require_GetSessionTokenCommand(), exports);
  }
});

// node_modules/@aws-sdk/client-sts/dist-cjs/defaultRoleAssumers.js
var require_defaultRoleAssumers = __commonJS({
  "node_modules/@aws-sdk/client-sts/dist-cjs/defaultRoleAssumers.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.decorateDefaultCredentialProvider = exports.getDefaultRoleAssumerWithWebIdentity = exports.getDefaultRoleAssumer = void 0;
    var defaultStsRoleAssumers_1 = require_defaultStsRoleAssumers();
    var STSClient_1 = require_STSClient();
    var getDefaultRoleAssumer = (stsOptions = {}) => (0, defaultStsRoleAssumers_1.getDefaultRoleAssumer)(stsOptions, STSClient_1.STSClient);
    exports.getDefaultRoleAssumer = getDefaultRoleAssumer;
    var getDefaultRoleAssumerWithWebIdentity = (stsOptions = {}) => (0, defaultStsRoleAssumers_1.getDefaultRoleAssumerWithWebIdentity)(stsOptions, STSClient_1.STSClient);
    exports.getDefaultRoleAssumerWithWebIdentity = getDefaultRoleAssumerWithWebIdentity;
    var decorateDefaultCredentialProvider = (provider) => (input) => provider({
      roleAssumer: (0, exports.getDefaultRoleAssumer)(input),
      roleAssumerWithWebIdentity: (0, exports.getDefaultRoleAssumerWithWebIdentity)(input),
      ...input
    });
    exports.decorateDefaultCredentialProvider = decorateDefaultCredentialProvider;
  }
});

// node_modules/@aws-sdk/client-sts/dist-cjs/models/index.js
var require_models2 = __commonJS({
  "node_modules/@aws-sdk/client-sts/dist-cjs/models/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require_tslib();
    tslib_1.__exportStar(require_models_02(), exports);
  }
});

// node_modules/@aws-sdk/client-sts/dist-cjs/index.js
var require_dist_cjs43 = __commonJS({
  "node_modules/@aws-sdk/client-sts/dist-cjs/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.STSServiceException = void 0;
    var tslib_1 = require_tslib();
    tslib_1.__exportStar(require_STS(), exports);
    tslib_1.__exportStar(require_STSClient(), exports);
    tslib_1.__exportStar(require_commands2(), exports);
    tslib_1.__exportStar(require_defaultRoleAssumers(), exports);
    tslib_1.__exportStar(require_models2(), exports);
    var STSServiceException_1 = require_STSServiceException();
    Object.defineProperty(exports, "STSServiceException", { enumerable: true, get: function() {
      return STSServiceException_1.STSServiceException;
    } });
  }
});

// node_modules/@aws-sdk/client-secrets-manager/dist-cjs/endpoints.js
var require_endpoints3 = __commonJS({
  "node_modules/@aws-sdk/client-secrets-manager/dist-cjs/endpoints.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.defaultRegionInfoProvider = void 0;
    var config_resolver_1 = require_dist_cjs7();
    var regionHash = {
      "ca-central-1": {
        variants: [
          {
            hostname: "secretsmanager-fips.ca-central-1.amazonaws.com",
            tags: ["fips"]
          }
        ]
      },
      "us-east-1": {
        variants: [
          {
            hostname: "secretsmanager-fips.us-east-1.amazonaws.com",
            tags: ["fips"]
          }
        ]
      },
      "us-east-2": {
        variants: [
          {
            hostname: "secretsmanager-fips.us-east-2.amazonaws.com",
            tags: ["fips"]
          }
        ]
      },
      "us-gov-east-1": {
        variants: [
          {
            hostname: "secretsmanager-fips.us-gov-east-1.amazonaws.com",
            tags: ["fips"]
          }
        ]
      },
      "us-gov-west-1": {
        variants: [
          {
            hostname: "secretsmanager-fips.us-gov-west-1.amazonaws.com",
            tags: ["fips"]
          }
        ]
      },
      "us-west-1": {
        variants: [
          {
            hostname: "secretsmanager-fips.us-west-1.amazonaws.com",
            tags: ["fips"]
          }
        ]
      },
      "us-west-2": {
        variants: [
          {
            hostname: "secretsmanager-fips.us-west-2.amazonaws.com",
            tags: ["fips"]
          }
        ]
      }
    };
    var partitionHash = {
      aws: {
        regions: [
          "af-south-1",
          "ap-east-1",
          "ap-northeast-1",
          "ap-northeast-2",
          "ap-northeast-3",
          "ap-south-1",
          "ap-southeast-1",
          "ap-southeast-2",
          "ap-southeast-3",
          "ca-central-1",
          "ca-central-1-fips",
          "eu-central-1",
          "eu-north-1",
          "eu-south-1",
          "eu-west-1",
          "eu-west-2",
          "eu-west-3",
          "me-south-1",
          "sa-east-1",
          "us-east-1",
          "us-east-1-fips",
          "us-east-2",
          "us-east-2-fips",
          "us-west-1",
          "us-west-1-fips",
          "us-west-2",
          "us-west-2-fips"
        ],
        regionRegex: "^(us|eu|ap|sa|ca|me|af)\\-\\w+\\-\\d+$",
        variants: [
          {
            hostname: "secretsmanager.{region}.amazonaws.com",
            tags: []
          },
          {
            hostname: "secretsmanager-fips.{region}.amazonaws.com",
            tags: ["fips"]
          },
          {
            hostname: "secretsmanager-fips.{region}.api.aws",
            tags: ["dualstack", "fips"]
          },
          {
            hostname: "secretsmanager.{region}.api.aws",
            tags: ["dualstack"]
          }
        ]
      },
      "aws-cn": {
        regions: ["cn-north-1", "cn-northwest-1"],
        regionRegex: "^cn\\-\\w+\\-\\d+$",
        variants: [
          {
            hostname: "secretsmanager.{region}.amazonaws.com.cn",
            tags: []
          },
          {
            hostname: "secretsmanager-fips.{region}.amazonaws.com.cn",
            tags: ["fips"]
          },
          {
            hostname: "secretsmanager-fips.{region}.api.amazonwebservices.com.cn",
            tags: ["dualstack", "fips"]
          },
          {
            hostname: "secretsmanager.{region}.api.amazonwebservices.com.cn",
            tags: ["dualstack"]
          }
        ]
      },
      "aws-iso": {
        regions: ["us-iso-east-1", "us-iso-west-1"],
        regionRegex: "^us\\-iso\\-\\w+\\-\\d+$",
        variants: [
          {
            hostname: "secretsmanager.{region}.c2s.ic.gov",
            tags: []
          },
          {
            hostname: "secretsmanager-fips.{region}.c2s.ic.gov",
            tags: ["fips"]
          }
        ]
      },
      "aws-iso-b": {
        regions: ["us-isob-east-1"],
        regionRegex: "^us\\-isob\\-\\w+\\-\\d+$",
        variants: [
          {
            hostname: "secretsmanager.{region}.sc2s.sgov.gov",
            tags: []
          },
          {
            hostname: "secretsmanager-fips.{region}.sc2s.sgov.gov",
            tags: ["fips"]
          }
        ]
      },
      "aws-us-gov": {
        regions: ["us-gov-east-1", "us-gov-east-1-fips", "us-gov-west-1", "us-gov-west-1-fips"],
        regionRegex: "^us\\-gov\\-\\w+\\-\\d+$",
        variants: [
          {
            hostname: "secretsmanager.{region}.amazonaws.com",
            tags: []
          },
          {
            hostname: "secretsmanager-fips.{region}.amazonaws.com",
            tags: ["fips"]
          },
          {
            hostname: "secretsmanager-fips.{region}.api.aws",
            tags: ["dualstack", "fips"]
          },
          {
            hostname: "secretsmanager.{region}.api.aws",
            tags: ["dualstack"]
          }
        ]
      }
    };
    var defaultRegionInfoProvider = async (region, options) => (0, config_resolver_1.getRegionInfo)(region, {
      ...options,
      signingService: "secretsmanager",
      regionHash,
      partitionHash
    });
    exports.defaultRegionInfoProvider = defaultRegionInfoProvider;
  }
});

// node_modules/@aws-sdk/client-secrets-manager/dist-cjs/runtimeConfig.shared.js
var require_runtimeConfig_shared3 = __commonJS({
  "node_modules/@aws-sdk/client-secrets-manager/dist-cjs/runtimeConfig.shared.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getRuntimeConfig = void 0;
    var url_parser_1 = require_dist_cjs26();
    var endpoints_1 = require_endpoints3();
    var getRuntimeConfig = (config) => {
      var _a, _b, _c, _d, _e;
      return {
        apiVersion: "2017-10-17",
        disableHostPrefix: (_a = config === null || config === void 0 ? void 0 : config.disableHostPrefix) !== null && _a !== void 0 ? _a : false,
        logger: (_b = config === null || config === void 0 ? void 0 : config.logger) !== null && _b !== void 0 ? _b : {},
        regionInfoProvider: (_c = config === null || config === void 0 ? void 0 : config.regionInfoProvider) !== null && _c !== void 0 ? _c : endpoints_1.defaultRegionInfoProvider,
        serviceId: (_d = config === null || config === void 0 ? void 0 : config.serviceId) !== null && _d !== void 0 ? _d : "Secrets Manager",
        urlParser: (_e = config === null || config === void 0 ? void 0 : config.urlParser) !== null && _e !== void 0 ? _e : url_parser_1.parseUrl
      };
    };
    exports.getRuntimeConfig = getRuntimeConfig;
  }
});

// node_modules/@aws-sdk/client-secrets-manager/dist-cjs/runtimeConfig.js
var require_runtimeConfig3 = __commonJS({
  "node_modules/@aws-sdk/client-secrets-manager/dist-cjs/runtimeConfig.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getRuntimeConfig = void 0;
    var tslib_1 = require_tslib();
    var package_json_1 = tslib_1.__importDefault(require_package());
    var client_sts_1 = require_dist_cjs43();
    var config_resolver_1 = require_dist_cjs7();
    var credential_provider_node_1 = require_dist_cjs42();
    var hash_node_1 = require_dist_cjs29();
    var middleware_retry_1 = require_dist_cjs13();
    var node_config_provider_1 = require_dist_cjs24();
    var node_http_handler_1 = require_dist_cjs31();
    var util_base64_node_1 = require_dist_cjs32();
    var util_body_length_node_1 = require_dist_cjs33();
    var util_user_agent_node_1 = require_dist_cjs34();
    var util_utf8_node_1 = require_dist_cjs35();
    var runtimeConfig_shared_1 = require_runtimeConfig_shared3();
    var smithy_client_1 = require_dist_cjs3();
    var util_defaults_mode_node_1 = require_dist_cjs36();
    var smithy_client_2 = require_dist_cjs3();
    var getRuntimeConfig = (config) => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
      (0, smithy_client_2.emitWarningIfUnsupportedVersion)(process.version);
      const defaultsMode = (0, util_defaults_mode_node_1.resolveDefaultsModeConfig)(config);
      const defaultConfigProvider = () => defaultsMode().then(smithy_client_1.loadConfigsForDefaultMode);
      const clientSharedValues = (0, runtimeConfig_shared_1.getRuntimeConfig)(config);
      return {
        ...clientSharedValues,
        ...config,
        runtime: "node",
        defaultsMode,
        base64Decoder: (_a = config === null || config === void 0 ? void 0 : config.base64Decoder) !== null && _a !== void 0 ? _a : util_base64_node_1.fromBase64,
        base64Encoder: (_b = config === null || config === void 0 ? void 0 : config.base64Encoder) !== null && _b !== void 0 ? _b : util_base64_node_1.toBase64,
        bodyLengthChecker: (_c = config === null || config === void 0 ? void 0 : config.bodyLengthChecker) !== null && _c !== void 0 ? _c : util_body_length_node_1.calculateBodyLength,
        credentialDefaultProvider: (_d = config === null || config === void 0 ? void 0 : config.credentialDefaultProvider) !== null && _d !== void 0 ? _d : (0, client_sts_1.decorateDefaultCredentialProvider)(credential_provider_node_1.defaultProvider),
        defaultUserAgentProvider: (_e = config === null || config === void 0 ? void 0 : config.defaultUserAgentProvider) !== null && _e !== void 0 ? _e : (0, util_user_agent_node_1.defaultUserAgent)({ serviceId: clientSharedValues.serviceId, clientVersion: package_json_1.default.version }),
        maxAttempts: (_f = config === null || config === void 0 ? void 0 : config.maxAttempts) !== null && _f !== void 0 ? _f : (0, node_config_provider_1.loadConfig)(middleware_retry_1.NODE_MAX_ATTEMPT_CONFIG_OPTIONS),
        region: (_g = config === null || config === void 0 ? void 0 : config.region) !== null && _g !== void 0 ? _g : (0, node_config_provider_1.loadConfig)(config_resolver_1.NODE_REGION_CONFIG_OPTIONS, config_resolver_1.NODE_REGION_CONFIG_FILE_OPTIONS),
        requestHandler: (_h = config === null || config === void 0 ? void 0 : config.requestHandler) !== null && _h !== void 0 ? _h : new node_http_handler_1.NodeHttpHandler(defaultConfigProvider),
        retryMode: (_j = config === null || config === void 0 ? void 0 : config.retryMode) !== null && _j !== void 0 ? _j : (0, node_config_provider_1.loadConfig)({
          ...middleware_retry_1.NODE_RETRY_MODE_CONFIG_OPTIONS,
          default: async () => (await defaultConfigProvider()).retryMode || middleware_retry_1.DEFAULT_RETRY_MODE
        }),
        sha256: (_k = config === null || config === void 0 ? void 0 : config.sha256) !== null && _k !== void 0 ? _k : hash_node_1.Hash.bind(null, "sha256"),
        streamCollector: (_l = config === null || config === void 0 ? void 0 : config.streamCollector) !== null && _l !== void 0 ? _l : node_http_handler_1.streamCollector,
        useDualstackEndpoint: (_m = config === null || config === void 0 ? void 0 : config.useDualstackEndpoint) !== null && _m !== void 0 ? _m : (0, node_config_provider_1.loadConfig)(config_resolver_1.NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS),
        useFipsEndpoint: (_o = config === null || config === void 0 ? void 0 : config.useFipsEndpoint) !== null && _o !== void 0 ? _o : (0, node_config_provider_1.loadConfig)(config_resolver_1.NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS),
        utf8Decoder: (_p = config === null || config === void 0 ? void 0 : config.utf8Decoder) !== null && _p !== void 0 ? _p : util_utf8_node_1.fromUtf8,
        utf8Encoder: (_q = config === null || config === void 0 ? void 0 : config.utf8Encoder) !== null && _q !== void 0 ? _q : util_utf8_node_1.toUtf8
      };
    };
    exports.getRuntimeConfig = getRuntimeConfig;
  }
});

// node_modules/@aws-sdk/client-secrets-manager/dist-cjs/SecretsManagerClient.js
var require_SecretsManagerClient = __commonJS({
  "node_modules/@aws-sdk/client-secrets-manager/dist-cjs/SecretsManagerClient.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SecretsManagerClient = void 0;
    var config_resolver_1 = require_dist_cjs7();
    var middleware_content_length_1 = require_dist_cjs8();
    var middleware_host_header_1 = require_dist_cjs9();
    var middleware_logger_1 = require_dist_cjs10();
    var middleware_recursion_detection_1 = require_dist_cjs11();
    var middleware_retry_1 = require_dist_cjs13();
    var middleware_signing_1 = require_dist_cjs19();
    var middleware_user_agent_1 = require_dist_cjs20();
    var smithy_client_1 = require_dist_cjs3();
    var runtimeConfig_1 = require_runtimeConfig3();
    var SecretsManagerClient = class extends smithy_client_1.Client {
      constructor(configuration) {
        const _config_0 = (0, runtimeConfig_1.getRuntimeConfig)(configuration);
        const _config_1 = (0, config_resolver_1.resolveRegionConfig)(_config_0);
        const _config_2 = (0, config_resolver_1.resolveEndpointsConfig)(_config_1);
        const _config_3 = (0, middleware_retry_1.resolveRetryConfig)(_config_2);
        const _config_4 = (0, middleware_host_header_1.resolveHostHeaderConfig)(_config_3);
        const _config_5 = (0, middleware_signing_1.resolveAwsAuthConfig)(_config_4);
        const _config_6 = (0, middleware_user_agent_1.resolveUserAgentConfig)(_config_5);
        super(_config_6);
        this.config = _config_6;
        this.middlewareStack.use((0, middleware_retry_1.getRetryPlugin)(this.config));
        this.middlewareStack.use((0, middleware_content_length_1.getContentLengthPlugin)(this.config));
        this.middlewareStack.use((0, middleware_host_header_1.getHostHeaderPlugin)(this.config));
        this.middlewareStack.use((0, middleware_logger_1.getLoggerPlugin)(this.config));
        this.middlewareStack.use((0, middleware_recursion_detection_1.getRecursionDetectionPlugin)(this.config));
        this.middlewareStack.use((0, middleware_signing_1.getAwsAuthPlugin)(this.config));
        this.middlewareStack.use((0, middleware_user_agent_1.getUserAgentPlugin)(this.config));
      }
      destroy() {
        super.destroy();
      }
    };
    exports.SecretsManagerClient = SecretsManagerClient;
  }
});

// node_modules/@aws-sdk/client-secrets-manager/dist-cjs/SecretsManager.js
var require_SecretsManager = __commonJS({
  "node_modules/@aws-sdk/client-secrets-manager/dist-cjs/SecretsManager.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SecretsManager = void 0;
    var CancelRotateSecretCommand_1 = require_CancelRotateSecretCommand();
    var CreateSecretCommand_1 = require_CreateSecretCommand();
    var DeleteResourcePolicyCommand_1 = require_DeleteResourcePolicyCommand();
    var DeleteSecretCommand_1 = require_DeleteSecretCommand();
    var DescribeSecretCommand_1 = require_DescribeSecretCommand();
    var GetRandomPasswordCommand_1 = require_GetRandomPasswordCommand();
    var GetResourcePolicyCommand_1 = require_GetResourcePolicyCommand();
    var GetSecretValueCommand_1 = require_GetSecretValueCommand();
    var ListSecretsCommand_1 = require_ListSecretsCommand();
    var ListSecretVersionIdsCommand_1 = require_ListSecretVersionIdsCommand();
    var PutResourcePolicyCommand_1 = require_PutResourcePolicyCommand();
    var PutSecretValueCommand_1 = require_PutSecretValueCommand();
    var RemoveRegionsFromReplicationCommand_1 = require_RemoveRegionsFromReplicationCommand();
    var ReplicateSecretToRegionsCommand_1 = require_ReplicateSecretToRegionsCommand();
    var RestoreSecretCommand_1 = require_RestoreSecretCommand();
    var RotateSecretCommand_1 = require_RotateSecretCommand();
    var StopReplicationToReplicaCommand_1 = require_StopReplicationToReplicaCommand();
    var TagResourceCommand_1 = require_TagResourceCommand();
    var UntagResourceCommand_1 = require_UntagResourceCommand();
    var UpdateSecretCommand_1 = require_UpdateSecretCommand();
    var UpdateSecretVersionStageCommand_1 = require_UpdateSecretVersionStageCommand();
    var ValidateResourcePolicyCommand_1 = require_ValidateResourcePolicyCommand();
    var SecretsManagerClient_1 = require_SecretsManagerClient();
    var SecretsManager2 = class extends SecretsManagerClient_1.SecretsManagerClient {
      cancelRotateSecret(args, optionsOrCb, cb) {
        const command = new CancelRotateSecretCommand_1.CancelRotateSecretCommand(args);
        if (typeof optionsOrCb === "function") {
          this.send(command, optionsOrCb);
        } else if (typeof cb === "function") {
          if (typeof optionsOrCb !== "object")
            throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
          this.send(command, optionsOrCb || {}, cb);
        } else {
          return this.send(command, optionsOrCb);
        }
      }
      createSecret(args, optionsOrCb, cb) {
        const command = new CreateSecretCommand_1.CreateSecretCommand(args);
        if (typeof optionsOrCb === "function") {
          this.send(command, optionsOrCb);
        } else if (typeof cb === "function") {
          if (typeof optionsOrCb !== "object")
            throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
          this.send(command, optionsOrCb || {}, cb);
        } else {
          return this.send(command, optionsOrCb);
        }
      }
      deleteResourcePolicy(args, optionsOrCb, cb) {
        const command = new DeleteResourcePolicyCommand_1.DeleteResourcePolicyCommand(args);
        if (typeof optionsOrCb === "function") {
          this.send(command, optionsOrCb);
        } else if (typeof cb === "function") {
          if (typeof optionsOrCb !== "object")
            throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
          this.send(command, optionsOrCb || {}, cb);
        } else {
          return this.send(command, optionsOrCb);
        }
      }
      deleteSecret(args, optionsOrCb, cb) {
        const command = new DeleteSecretCommand_1.DeleteSecretCommand(args);
        if (typeof optionsOrCb === "function") {
          this.send(command, optionsOrCb);
        } else if (typeof cb === "function") {
          if (typeof optionsOrCb !== "object")
            throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
          this.send(command, optionsOrCb || {}, cb);
        } else {
          return this.send(command, optionsOrCb);
        }
      }
      describeSecret(args, optionsOrCb, cb) {
        const command = new DescribeSecretCommand_1.DescribeSecretCommand(args);
        if (typeof optionsOrCb === "function") {
          this.send(command, optionsOrCb);
        } else if (typeof cb === "function") {
          if (typeof optionsOrCb !== "object")
            throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
          this.send(command, optionsOrCb || {}, cb);
        } else {
          return this.send(command, optionsOrCb);
        }
      }
      getRandomPassword(args, optionsOrCb, cb) {
        const command = new GetRandomPasswordCommand_1.GetRandomPasswordCommand(args);
        if (typeof optionsOrCb === "function") {
          this.send(command, optionsOrCb);
        } else if (typeof cb === "function") {
          if (typeof optionsOrCb !== "object")
            throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
          this.send(command, optionsOrCb || {}, cb);
        } else {
          return this.send(command, optionsOrCb);
        }
      }
      getResourcePolicy(args, optionsOrCb, cb) {
        const command = new GetResourcePolicyCommand_1.GetResourcePolicyCommand(args);
        if (typeof optionsOrCb === "function") {
          this.send(command, optionsOrCb);
        } else if (typeof cb === "function") {
          if (typeof optionsOrCb !== "object")
            throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
          this.send(command, optionsOrCb || {}, cb);
        } else {
          return this.send(command, optionsOrCb);
        }
      }
      getSecretValue(args, optionsOrCb, cb) {
        const command = new GetSecretValueCommand_1.GetSecretValueCommand(args);
        if (typeof optionsOrCb === "function") {
          this.send(command, optionsOrCb);
        } else if (typeof cb === "function") {
          if (typeof optionsOrCb !== "object")
            throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
          this.send(command, optionsOrCb || {}, cb);
        } else {
          return this.send(command, optionsOrCb);
        }
      }
      listSecrets(args, optionsOrCb, cb) {
        const command = new ListSecretsCommand_1.ListSecretsCommand(args);
        if (typeof optionsOrCb === "function") {
          this.send(command, optionsOrCb);
        } else if (typeof cb === "function") {
          if (typeof optionsOrCb !== "object")
            throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
          this.send(command, optionsOrCb || {}, cb);
        } else {
          return this.send(command, optionsOrCb);
        }
      }
      listSecretVersionIds(args, optionsOrCb, cb) {
        const command = new ListSecretVersionIdsCommand_1.ListSecretVersionIdsCommand(args);
        if (typeof optionsOrCb === "function") {
          this.send(command, optionsOrCb);
        } else if (typeof cb === "function") {
          if (typeof optionsOrCb !== "object")
            throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
          this.send(command, optionsOrCb || {}, cb);
        } else {
          return this.send(command, optionsOrCb);
        }
      }
      putResourcePolicy(args, optionsOrCb, cb) {
        const command = new PutResourcePolicyCommand_1.PutResourcePolicyCommand(args);
        if (typeof optionsOrCb === "function") {
          this.send(command, optionsOrCb);
        } else if (typeof cb === "function") {
          if (typeof optionsOrCb !== "object")
            throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
          this.send(command, optionsOrCb || {}, cb);
        } else {
          return this.send(command, optionsOrCb);
        }
      }
      putSecretValue(args, optionsOrCb, cb) {
        const command = new PutSecretValueCommand_1.PutSecretValueCommand(args);
        if (typeof optionsOrCb === "function") {
          this.send(command, optionsOrCb);
        } else if (typeof cb === "function") {
          if (typeof optionsOrCb !== "object")
            throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
          this.send(command, optionsOrCb || {}, cb);
        } else {
          return this.send(command, optionsOrCb);
        }
      }
      removeRegionsFromReplication(args, optionsOrCb, cb) {
        const command = new RemoveRegionsFromReplicationCommand_1.RemoveRegionsFromReplicationCommand(args);
        if (typeof optionsOrCb === "function") {
          this.send(command, optionsOrCb);
        } else if (typeof cb === "function") {
          if (typeof optionsOrCb !== "object")
            throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
          this.send(command, optionsOrCb || {}, cb);
        } else {
          return this.send(command, optionsOrCb);
        }
      }
      replicateSecretToRegions(args, optionsOrCb, cb) {
        const command = new ReplicateSecretToRegionsCommand_1.ReplicateSecretToRegionsCommand(args);
        if (typeof optionsOrCb === "function") {
          this.send(command, optionsOrCb);
        } else if (typeof cb === "function") {
          if (typeof optionsOrCb !== "object")
            throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
          this.send(command, optionsOrCb || {}, cb);
        } else {
          return this.send(command, optionsOrCb);
        }
      }
      restoreSecret(args, optionsOrCb, cb) {
        const command = new RestoreSecretCommand_1.RestoreSecretCommand(args);
        if (typeof optionsOrCb === "function") {
          this.send(command, optionsOrCb);
        } else if (typeof cb === "function") {
          if (typeof optionsOrCb !== "object")
            throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
          this.send(command, optionsOrCb || {}, cb);
        } else {
          return this.send(command, optionsOrCb);
        }
      }
      rotateSecret(args, optionsOrCb, cb) {
        const command = new RotateSecretCommand_1.RotateSecretCommand(args);
        if (typeof optionsOrCb === "function") {
          this.send(command, optionsOrCb);
        } else if (typeof cb === "function") {
          if (typeof optionsOrCb !== "object")
            throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
          this.send(command, optionsOrCb || {}, cb);
        } else {
          return this.send(command, optionsOrCb);
        }
      }
      stopReplicationToReplica(args, optionsOrCb, cb) {
        const command = new StopReplicationToReplicaCommand_1.StopReplicationToReplicaCommand(args);
        if (typeof optionsOrCb === "function") {
          this.send(command, optionsOrCb);
        } else if (typeof cb === "function") {
          if (typeof optionsOrCb !== "object")
            throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
          this.send(command, optionsOrCb || {}, cb);
        } else {
          return this.send(command, optionsOrCb);
        }
      }
      tagResource(args, optionsOrCb, cb) {
        const command = new TagResourceCommand_1.TagResourceCommand(args);
        if (typeof optionsOrCb === "function") {
          this.send(command, optionsOrCb);
        } else if (typeof cb === "function") {
          if (typeof optionsOrCb !== "object")
            throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
          this.send(command, optionsOrCb || {}, cb);
        } else {
          return this.send(command, optionsOrCb);
        }
      }
      untagResource(args, optionsOrCb, cb) {
        const command = new UntagResourceCommand_1.UntagResourceCommand(args);
        if (typeof optionsOrCb === "function") {
          this.send(command, optionsOrCb);
        } else if (typeof cb === "function") {
          if (typeof optionsOrCb !== "object")
            throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
          this.send(command, optionsOrCb || {}, cb);
        } else {
          return this.send(command, optionsOrCb);
        }
      }
      updateSecret(args, optionsOrCb, cb) {
        const command = new UpdateSecretCommand_1.UpdateSecretCommand(args);
        if (typeof optionsOrCb === "function") {
          this.send(command, optionsOrCb);
        } else if (typeof cb === "function") {
          if (typeof optionsOrCb !== "object")
            throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
          this.send(command, optionsOrCb || {}, cb);
        } else {
          return this.send(command, optionsOrCb);
        }
      }
      updateSecretVersionStage(args, optionsOrCb, cb) {
        const command = new UpdateSecretVersionStageCommand_1.UpdateSecretVersionStageCommand(args);
        if (typeof optionsOrCb === "function") {
          this.send(command, optionsOrCb);
        } else if (typeof cb === "function") {
          if (typeof optionsOrCb !== "object")
            throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
          this.send(command, optionsOrCb || {}, cb);
        } else {
          return this.send(command, optionsOrCb);
        }
      }
      validateResourcePolicy(args, optionsOrCb, cb) {
        const command = new ValidateResourcePolicyCommand_1.ValidateResourcePolicyCommand(args);
        if (typeof optionsOrCb === "function") {
          this.send(command, optionsOrCb);
        } else if (typeof cb === "function") {
          if (typeof optionsOrCb !== "object")
            throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
          this.send(command, optionsOrCb || {}, cb);
        } else {
          return this.send(command, optionsOrCb);
        }
      }
    };
    exports.SecretsManager = SecretsManager2;
  }
});

// node_modules/@aws-sdk/client-secrets-manager/dist-cjs/commands/index.js
var require_commands3 = __commonJS({
  "node_modules/@aws-sdk/client-secrets-manager/dist-cjs/commands/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require_tslib();
    tslib_1.__exportStar(require_CancelRotateSecretCommand(), exports);
    tslib_1.__exportStar(require_CreateSecretCommand(), exports);
    tslib_1.__exportStar(require_DeleteResourcePolicyCommand(), exports);
    tslib_1.__exportStar(require_DeleteSecretCommand(), exports);
    tslib_1.__exportStar(require_DescribeSecretCommand(), exports);
    tslib_1.__exportStar(require_GetRandomPasswordCommand(), exports);
    tslib_1.__exportStar(require_GetResourcePolicyCommand(), exports);
    tslib_1.__exportStar(require_GetSecretValueCommand(), exports);
    tslib_1.__exportStar(require_ListSecretVersionIdsCommand(), exports);
    tslib_1.__exportStar(require_ListSecretsCommand(), exports);
    tslib_1.__exportStar(require_PutResourcePolicyCommand(), exports);
    tslib_1.__exportStar(require_PutSecretValueCommand(), exports);
    tslib_1.__exportStar(require_RemoveRegionsFromReplicationCommand(), exports);
    tslib_1.__exportStar(require_ReplicateSecretToRegionsCommand(), exports);
    tslib_1.__exportStar(require_RestoreSecretCommand(), exports);
    tslib_1.__exportStar(require_RotateSecretCommand(), exports);
    tslib_1.__exportStar(require_StopReplicationToReplicaCommand(), exports);
    tslib_1.__exportStar(require_TagResourceCommand(), exports);
    tslib_1.__exportStar(require_UntagResourceCommand(), exports);
    tslib_1.__exportStar(require_UpdateSecretCommand(), exports);
    tslib_1.__exportStar(require_UpdateSecretVersionStageCommand(), exports);
    tslib_1.__exportStar(require_ValidateResourcePolicyCommand(), exports);
  }
});

// node_modules/@aws-sdk/client-secrets-manager/dist-cjs/models/index.js
var require_models3 = __commonJS({
  "node_modules/@aws-sdk/client-secrets-manager/dist-cjs/models/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require_tslib();
    tslib_1.__exportStar(require_models_0(), exports);
  }
});

// node_modules/@aws-sdk/client-secrets-manager/dist-cjs/pagination/Interfaces.js
var require_Interfaces2 = __commonJS({
  "node_modules/@aws-sdk/client-secrets-manager/dist-cjs/pagination/Interfaces.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/@aws-sdk/client-secrets-manager/dist-cjs/pagination/ListSecretVersionIdsPaginator.js
var require_ListSecretVersionIdsPaginator = __commonJS({
  "node_modules/@aws-sdk/client-secrets-manager/dist-cjs/pagination/ListSecretVersionIdsPaginator.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.paginateListSecretVersionIds = void 0;
    var ListSecretVersionIdsCommand_1 = require_ListSecretVersionIdsCommand();
    var SecretsManager_1 = require_SecretsManager();
    var SecretsManagerClient_1 = require_SecretsManagerClient();
    var makePagedClientRequest = async (client, input, ...args) => {
      return await client.send(new ListSecretVersionIdsCommand_1.ListSecretVersionIdsCommand(input), ...args);
    };
    var makePagedRequest = async (client, input, ...args) => {
      return await client.listSecretVersionIds(input, ...args);
    };
    async function* paginateListSecretVersionIds(config, input, ...additionalArguments) {
      let token = config.startingToken || void 0;
      let hasNext = true;
      let page;
      while (hasNext) {
        input.NextToken = token;
        input["MaxResults"] = config.pageSize;
        if (config.client instanceof SecretsManager_1.SecretsManager) {
          page = await makePagedRequest(config.client, input, ...additionalArguments);
        } else if (config.client instanceof SecretsManagerClient_1.SecretsManagerClient) {
          page = await makePagedClientRequest(config.client, input, ...additionalArguments);
        } else {
          throw new Error("Invalid client, expected SecretsManager | SecretsManagerClient");
        }
        yield page;
        const prevToken = token;
        token = page.NextToken;
        hasNext = !!(token && (!config.stopOnSameToken || token !== prevToken));
      }
      return void 0;
    }
    exports.paginateListSecretVersionIds = paginateListSecretVersionIds;
  }
});

// node_modules/@aws-sdk/client-secrets-manager/dist-cjs/pagination/ListSecretsPaginator.js
var require_ListSecretsPaginator = __commonJS({
  "node_modules/@aws-sdk/client-secrets-manager/dist-cjs/pagination/ListSecretsPaginator.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.paginateListSecrets = void 0;
    var ListSecretsCommand_1 = require_ListSecretsCommand();
    var SecretsManager_1 = require_SecretsManager();
    var SecretsManagerClient_1 = require_SecretsManagerClient();
    var makePagedClientRequest = async (client, input, ...args) => {
      return await client.send(new ListSecretsCommand_1.ListSecretsCommand(input), ...args);
    };
    var makePagedRequest = async (client, input, ...args) => {
      return await client.listSecrets(input, ...args);
    };
    async function* paginateListSecrets(config, input, ...additionalArguments) {
      let token = config.startingToken || void 0;
      let hasNext = true;
      let page;
      while (hasNext) {
        input.NextToken = token;
        input["MaxResults"] = config.pageSize;
        if (config.client instanceof SecretsManager_1.SecretsManager) {
          page = await makePagedRequest(config.client, input, ...additionalArguments);
        } else if (config.client instanceof SecretsManagerClient_1.SecretsManagerClient) {
          page = await makePagedClientRequest(config.client, input, ...additionalArguments);
        } else {
          throw new Error("Invalid client, expected SecretsManager | SecretsManagerClient");
        }
        yield page;
        const prevToken = token;
        token = page.NextToken;
        hasNext = !!(token && (!config.stopOnSameToken || token !== prevToken));
      }
      return void 0;
    }
    exports.paginateListSecrets = paginateListSecrets;
  }
});

// node_modules/@aws-sdk/client-secrets-manager/dist-cjs/pagination/index.js
var require_pagination2 = __commonJS({
  "node_modules/@aws-sdk/client-secrets-manager/dist-cjs/pagination/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require_tslib();
    tslib_1.__exportStar(require_Interfaces2(), exports);
    tslib_1.__exportStar(require_ListSecretVersionIdsPaginator(), exports);
    tslib_1.__exportStar(require_ListSecretsPaginator(), exports);
  }
});

// node_modules/@aws-sdk/client-secrets-manager/dist-cjs/index.js
var require_dist_cjs44 = __commonJS({
  "node_modules/@aws-sdk/client-secrets-manager/dist-cjs/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SecretsManagerServiceException = void 0;
    var tslib_1 = require_tslib();
    tslib_1.__exportStar(require_SecretsManager(), exports);
    tslib_1.__exportStar(require_SecretsManagerClient(), exports);
    tslib_1.__exportStar(require_commands3(), exports);
    tslib_1.__exportStar(require_models3(), exports);
    tslib_1.__exportStar(require_pagination2(), exports);
    var SecretsManagerServiceException_1 = require_SecretsManagerServiceException();
    Object.defineProperty(exports, "SecretsManagerServiceException", { enumerable: true, get: function() {
      return SecretsManagerServiceException_1.SecretsManagerServiceException;
    } });
  }
});

// lib/lambda/github-handler.ts
var github_handler_exports = {};
__export(github_handler_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(github_handler_exports);

// node_modules/node-fetch/src/index.js
var import_node_http2 = __toESM(require("node:http"), 1);
var import_node_https = __toESM(require("node:https"), 1);
var import_node_zlib = __toESM(require("node:zlib"), 1);
var import_node_stream2 = __toESM(require("node:stream"), 1);
var import_node_buffer2 = require("node:buffer");

// node_modules/data-uri-to-buffer/dist/index.js
function dataUriToBuffer(uri) {
  if (!/^data:/i.test(uri)) {
    throw new TypeError('`uri` does not appear to be a Data URI (must begin with "data:")');
  }
  uri = uri.replace(/\r?\n/g, "");
  const firstComma = uri.indexOf(",");
  if (firstComma === -1 || firstComma <= 4) {
    throw new TypeError("malformed data: URI");
  }
  const meta = uri.substring(5, firstComma).split(";");
  let charset = "";
  let base64 = false;
  const type = meta[0] || "text/plain";
  let typeFull = type;
  for (let i2 = 1; i2 < meta.length; i2++) {
    if (meta[i2] === "base64") {
      base64 = true;
    } else {
      typeFull += `;${meta[i2]}`;
      if (meta[i2].indexOf("charset=") === 0) {
        charset = meta[i2].substring(8);
      }
    }
  }
  if (!meta[0] && !charset.length) {
    typeFull += ";charset=US-ASCII";
    charset = "US-ASCII";
  }
  const encoding = base64 ? "base64" : "ascii";
  const data = unescape(uri.substring(firstComma + 1));
  const buffer = Buffer.from(data, encoding);
  buffer.type = type;
  buffer.typeFull = typeFull;
  buffer.charset = charset;
  return buffer;
}
var dist_default = dataUriToBuffer;

// node_modules/node-fetch/src/body.js
var import_node_stream = __toESM(require("node:stream"), 1);
var import_node_util = require("node:util");
var import_node_buffer = require("node:buffer");
init_fetch_blob();
init_esm_min();

// node_modules/node-fetch/src/errors/base.js
var FetchBaseError = class extends Error {
  constructor(message, type) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
    this.type = type;
  }
  get name() {
    return this.constructor.name;
  }
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
};

// node_modules/node-fetch/src/errors/fetch-error.js
var FetchError = class extends FetchBaseError {
  constructor(message, type, systemError) {
    super(message, type);
    if (systemError) {
      this.code = this.errno = systemError.code;
      this.erroredSysCall = systemError.syscall;
    }
  }
};

// node_modules/node-fetch/src/utils/is.js
var NAME = Symbol.toStringTag;
var isURLSearchParameters = (object) => {
  return typeof object === "object" && typeof object.append === "function" && typeof object.delete === "function" && typeof object.get === "function" && typeof object.getAll === "function" && typeof object.has === "function" && typeof object.set === "function" && typeof object.sort === "function" && object[NAME] === "URLSearchParams";
};
var isBlob = (object) => {
  return object && typeof object === "object" && typeof object.arrayBuffer === "function" && typeof object.type === "string" && typeof object.stream === "function" && typeof object.constructor === "function" && /^(Blob|File)$/.test(object[NAME]);
};
var isAbortSignal = (object) => {
  return typeof object === "object" && (object[NAME] === "AbortSignal" || object[NAME] === "EventTarget");
};
var isDomainOrSubdomain = (destination, original) => {
  const orig = new URL(original).hostname;
  const dest = new URL(destination).hostname;
  return orig === dest || orig.endsWith(`.${dest}`);
};

// node_modules/node-fetch/src/body.js
var pipeline = (0, import_node_util.promisify)(import_node_stream.default.pipeline);
var INTERNALS = Symbol("Body internals");
var Body = class {
  constructor(body, {
    size = 0
  } = {}) {
    let boundary = null;
    if (body === null) {
      body = null;
    } else if (isURLSearchParameters(body)) {
      body = import_node_buffer.Buffer.from(body.toString());
    } else if (isBlob(body)) {
    } else if (import_node_buffer.Buffer.isBuffer(body)) {
    } else if (import_node_util.types.isAnyArrayBuffer(body)) {
      body = import_node_buffer.Buffer.from(body);
    } else if (ArrayBuffer.isView(body)) {
      body = import_node_buffer.Buffer.from(body.buffer, body.byteOffset, body.byteLength);
    } else if (body instanceof import_node_stream.default) {
    } else if (body instanceof FormData) {
      body = formDataToBlob(body);
      boundary = body.type.split("=")[1];
    } else {
      body = import_node_buffer.Buffer.from(String(body));
    }
    let stream = body;
    if (import_node_buffer.Buffer.isBuffer(body)) {
      stream = import_node_stream.default.Readable.from(body);
    } else if (isBlob(body)) {
      stream = import_node_stream.default.Readable.from(body.stream());
    }
    this[INTERNALS] = {
      body,
      stream,
      boundary,
      disturbed: false,
      error: null
    };
    this.size = size;
    if (body instanceof import_node_stream.default) {
      body.on("error", (error_) => {
        const error = error_ instanceof FetchBaseError ? error_ : new FetchError(`Invalid response body while trying to fetch ${this.url}: ${error_.message}`, "system", error_);
        this[INTERNALS].error = error;
      });
    }
  }
  get body() {
    return this[INTERNALS].stream;
  }
  get bodyUsed() {
    return this[INTERNALS].disturbed;
  }
  async arrayBuffer() {
    const { buffer, byteOffset, byteLength } = await consumeBody(this);
    return buffer.slice(byteOffset, byteOffset + byteLength);
  }
  async formData() {
    const ct = this.headers.get("content-type");
    if (ct.startsWith("application/x-www-form-urlencoded")) {
      const formData = new FormData();
      const parameters = new URLSearchParams(await this.text());
      for (const [name, value] of parameters) {
        formData.append(name, value);
      }
      return formData;
    }
    const { toFormData: toFormData2 } = await Promise.resolve().then(() => (init_multipart_parser(), multipart_parser_exports));
    return toFormData2(this.body, ct);
  }
  async blob() {
    const ct = this.headers && this.headers.get("content-type") || this[INTERNALS].body && this[INTERNALS].body.type || "";
    const buf = await this.arrayBuffer();
    return new fetch_blob_default([buf], {
      type: ct
    });
  }
  async json() {
    const text = await this.text();
    return JSON.parse(text);
  }
  async text() {
    const buffer = await consumeBody(this);
    return new TextDecoder().decode(buffer);
  }
  buffer() {
    return consumeBody(this);
  }
};
Body.prototype.buffer = (0, import_node_util.deprecate)(Body.prototype.buffer, "Please use 'response.arrayBuffer()' instead of 'response.buffer()'", "node-fetch#buffer");
Object.defineProperties(Body.prototype, {
  body: { enumerable: true },
  bodyUsed: { enumerable: true },
  arrayBuffer: { enumerable: true },
  blob: { enumerable: true },
  json: { enumerable: true },
  text: { enumerable: true },
  data: { get: (0, import_node_util.deprecate)(() => {
  }, "data doesn't exist, use json(), text(), arrayBuffer(), or body instead", "https://github.com/node-fetch/node-fetch/issues/1000 (response)") }
});
async function consumeBody(data) {
  if (data[INTERNALS].disturbed) {
    throw new TypeError(`body used already for: ${data.url}`);
  }
  data[INTERNALS].disturbed = true;
  if (data[INTERNALS].error) {
    throw data[INTERNALS].error;
  }
  const { body } = data;
  if (body === null) {
    return import_node_buffer.Buffer.alloc(0);
  }
  if (!(body instanceof import_node_stream.default)) {
    return import_node_buffer.Buffer.alloc(0);
  }
  const accum = [];
  let accumBytes = 0;
  try {
    for await (const chunk of body) {
      if (data.size > 0 && accumBytes + chunk.length > data.size) {
        const error = new FetchError(`content size at ${data.url} over limit: ${data.size}`, "max-size");
        body.destroy(error);
        throw error;
      }
      accumBytes += chunk.length;
      accum.push(chunk);
    }
  } catch (error) {
    const error_ = error instanceof FetchBaseError ? error : new FetchError(`Invalid response body while trying to fetch ${data.url}: ${error.message}`, "system", error);
    throw error_;
  }
  if (body.readableEnded === true || body._readableState.ended === true) {
    try {
      if (accum.every((c) => typeof c === "string")) {
        return import_node_buffer.Buffer.from(accum.join(""));
      }
      return import_node_buffer.Buffer.concat(accum, accumBytes);
    } catch (error) {
      throw new FetchError(`Could not create Buffer from response body for ${data.url}: ${error.message}`, "system", error);
    }
  } else {
    throw new FetchError(`Premature close of server response while trying to fetch ${data.url}`);
  }
}
var clone = (instance, highWaterMark) => {
  let p1;
  let p2;
  let { body } = instance[INTERNALS];
  if (instance.bodyUsed) {
    throw new Error("cannot clone body after it is used");
  }
  if (body instanceof import_node_stream.default && typeof body.getBoundary !== "function") {
    p1 = new import_node_stream.PassThrough({ highWaterMark });
    p2 = new import_node_stream.PassThrough({ highWaterMark });
    body.pipe(p1);
    body.pipe(p2);
    instance[INTERNALS].stream = p1;
    body = p2;
  }
  return body;
};
var getNonSpecFormDataBoundary = (0, import_node_util.deprecate)((body) => body.getBoundary(), "form-data doesn't follow the spec and requires special treatment. Use alternative package", "https://github.com/node-fetch/node-fetch/issues/1167");
var extractContentType = (body, request) => {
  if (body === null) {
    return null;
  }
  if (typeof body === "string") {
    return "text/plain;charset=UTF-8";
  }
  if (isURLSearchParameters(body)) {
    return "application/x-www-form-urlencoded;charset=UTF-8";
  }
  if (isBlob(body)) {
    return body.type || null;
  }
  if (import_node_buffer.Buffer.isBuffer(body) || import_node_util.types.isAnyArrayBuffer(body) || ArrayBuffer.isView(body)) {
    return null;
  }
  if (body instanceof FormData) {
    return `multipart/form-data; boundary=${request[INTERNALS].boundary}`;
  }
  if (body && typeof body.getBoundary === "function") {
    return `multipart/form-data;boundary=${getNonSpecFormDataBoundary(body)}`;
  }
  if (body instanceof import_node_stream.default) {
    return null;
  }
  return "text/plain;charset=UTF-8";
};
var getTotalBytes = (request) => {
  const { body } = request[INTERNALS];
  if (body === null) {
    return 0;
  }
  if (isBlob(body)) {
    return body.size;
  }
  if (import_node_buffer.Buffer.isBuffer(body)) {
    return body.length;
  }
  if (body && typeof body.getLengthSync === "function") {
    return body.hasKnownLength && body.hasKnownLength() ? body.getLengthSync() : null;
  }
  return null;
};
var writeToStream = async (dest, { body }) => {
  if (body === null) {
    dest.end();
  } else {
    await pipeline(body, dest);
  }
};

// node_modules/node-fetch/src/headers.js
var import_node_util2 = require("node:util");
var import_node_http = __toESM(require("node:http"), 1);
var validateHeaderName = typeof import_node_http.default.validateHeaderName === "function" ? import_node_http.default.validateHeaderName : (name) => {
  if (!/^[\^`\-\w!#$%&'*+.|~]+$/.test(name)) {
    const error = new TypeError(`Header name must be a valid HTTP token [${name}]`);
    Object.defineProperty(error, "code", { value: "ERR_INVALID_HTTP_TOKEN" });
    throw error;
  }
};
var validateHeaderValue = typeof import_node_http.default.validateHeaderValue === "function" ? import_node_http.default.validateHeaderValue : (name, value) => {
  if (/[^\t\u0020-\u007E\u0080-\u00FF]/.test(value)) {
    const error = new TypeError(`Invalid character in header content ["${name}"]`);
    Object.defineProperty(error, "code", { value: "ERR_INVALID_CHAR" });
    throw error;
  }
};
var Headers = class extends URLSearchParams {
  constructor(init) {
    let result = [];
    if (init instanceof Headers) {
      const raw = init.raw();
      for (const [name, values] of Object.entries(raw)) {
        result.push(...values.map((value) => [name, value]));
      }
    } else if (init == null) {
    } else if (typeof init === "object" && !import_node_util2.types.isBoxedPrimitive(init)) {
      const method = init[Symbol.iterator];
      if (method == null) {
        result.push(...Object.entries(init));
      } else {
        if (typeof method !== "function") {
          throw new TypeError("Header pairs must be iterable");
        }
        result = [...init].map((pair) => {
          if (typeof pair !== "object" || import_node_util2.types.isBoxedPrimitive(pair)) {
            throw new TypeError("Each header pair must be an iterable object");
          }
          return [...pair];
        }).map((pair) => {
          if (pair.length !== 2) {
            throw new TypeError("Each header pair must be a name/value tuple");
          }
          return [...pair];
        });
      }
    } else {
      throw new TypeError("Failed to construct 'Headers': The provided value is not of type '(sequence<sequence<ByteString>> or record<ByteString, ByteString>)");
    }
    result = result.length > 0 ? result.map(([name, value]) => {
      validateHeaderName(name);
      validateHeaderValue(name, String(value));
      return [String(name).toLowerCase(), String(value)];
    }) : void 0;
    super(result);
    return new Proxy(this, {
      get(target, p, receiver) {
        switch (p) {
          case "append":
          case "set":
            return (name, value) => {
              validateHeaderName(name);
              validateHeaderValue(name, String(value));
              return URLSearchParams.prototype[p].call(target, String(name).toLowerCase(), String(value));
            };
          case "delete":
          case "has":
          case "getAll":
            return (name) => {
              validateHeaderName(name);
              return URLSearchParams.prototype[p].call(target, String(name).toLowerCase());
            };
          case "keys":
            return () => {
              target.sort();
              return new Set(URLSearchParams.prototype.keys.call(target)).keys();
            };
          default:
            return Reflect.get(target, p, receiver);
        }
      }
    });
  }
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
  toString() {
    return Object.prototype.toString.call(this);
  }
  get(name) {
    const values = this.getAll(name);
    if (values.length === 0) {
      return null;
    }
    let value = values.join(", ");
    if (/^content-encoding$/i.test(name)) {
      value = value.toLowerCase();
    }
    return value;
  }
  forEach(callback, thisArg = void 0) {
    for (const name of this.keys()) {
      Reflect.apply(callback, thisArg, [this.get(name), name, this]);
    }
  }
  *values() {
    for (const name of this.keys()) {
      yield this.get(name);
    }
  }
  *entries() {
    for (const name of this.keys()) {
      yield [name, this.get(name)];
    }
  }
  [Symbol.iterator]() {
    return this.entries();
  }
  raw() {
    return [...this.keys()].reduce((result, key) => {
      result[key] = this.getAll(key);
      return result;
    }, {});
  }
  [Symbol.for("nodejs.util.inspect.custom")]() {
    return [...this.keys()].reduce((result, key) => {
      const values = this.getAll(key);
      if (key === "host") {
        result[key] = values[0];
      } else {
        result[key] = values.length > 1 ? values : values[0];
      }
      return result;
    }, {});
  }
};
Object.defineProperties(Headers.prototype, ["get", "entries", "forEach", "values"].reduce((result, property) => {
  result[property] = { enumerable: true };
  return result;
}, {}));
function fromRawHeaders(headers = []) {
  return new Headers(headers.reduce((result, value, index, array) => {
    if (index % 2 === 0) {
      result.push(array.slice(index, index + 2));
    }
    return result;
  }, []).filter(([name, value]) => {
    try {
      validateHeaderName(name);
      validateHeaderValue(name, String(value));
      return true;
    } catch {
      return false;
    }
  }));
}

// node_modules/node-fetch/src/utils/is-redirect.js
var redirectStatus = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
var isRedirect = (code) => {
  return redirectStatus.has(code);
};

// node_modules/node-fetch/src/response.js
var INTERNALS2 = Symbol("Response internals");
var Response = class extends Body {
  constructor(body = null, options = {}) {
    super(body, options);
    const status = options.status != null ? options.status : 200;
    const headers = new Headers(options.headers);
    if (body !== null && !headers.has("Content-Type")) {
      const contentType = extractContentType(body, this);
      if (contentType) {
        headers.append("Content-Type", contentType);
      }
    }
    this[INTERNALS2] = {
      type: "default",
      url: options.url,
      status,
      statusText: options.statusText || "",
      headers,
      counter: options.counter,
      highWaterMark: options.highWaterMark
    };
  }
  get type() {
    return this[INTERNALS2].type;
  }
  get url() {
    return this[INTERNALS2].url || "";
  }
  get status() {
    return this[INTERNALS2].status;
  }
  get ok() {
    return this[INTERNALS2].status >= 200 && this[INTERNALS2].status < 300;
  }
  get redirected() {
    return this[INTERNALS2].counter > 0;
  }
  get statusText() {
    return this[INTERNALS2].statusText;
  }
  get headers() {
    return this[INTERNALS2].headers;
  }
  get highWaterMark() {
    return this[INTERNALS2].highWaterMark;
  }
  clone() {
    return new Response(clone(this, this.highWaterMark), {
      type: this.type,
      url: this.url,
      status: this.status,
      statusText: this.statusText,
      headers: this.headers,
      ok: this.ok,
      redirected: this.redirected,
      size: this.size,
      highWaterMark: this.highWaterMark
    });
  }
  static redirect(url, status = 302) {
    if (!isRedirect(status)) {
      throw new RangeError('Failed to execute "redirect" on "response": Invalid status code');
    }
    return new Response(null, {
      headers: {
        location: new URL(url).toString()
      },
      status
    });
  }
  static error() {
    const response = new Response(null, { status: 0, statusText: "" });
    response[INTERNALS2].type = "error";
    return response;
  }
  get [Symbol.toStringTag]() {
    return "Response";
  }
};
Object.defineProperties(Response.prototype, {
  type: { enumerable: true },
  url: { enumerable: true },
  status: { enumerable: true },
  ok: { enumerable: true },
  redirected: { enumerable: true },
  statusText: { enumerable: true },
  headers: { enumerable: true },
  clone: { enumerable: true }
});

// node_modules/node-fetch/src/request.js
var import_node_url = require("node:url");
var import_node_util3 = require("node:util");

// node_modules/node-fetch/src/utils/get-search.js
var getSearch = (parsedURL) => {
  if (parsedURL.search) {
    return parsedURL.search;
  }
  const lastOffset = parsedURL.href.length - 1;
  const hash = parsedURL.hash || (parsedURL.href[lastOffset] === "#" ? "#" : "");
  return parsedURL.href[lastOffset - hash.length] === "?" ? "?" : "";
};

// node_modules/node-fetch/src/utils/referrer.js
var import_node_net = require("node:net");
function stripURLForUseAsAReferrer(url, originOnly = false) {
  if (url == null) {
    return "no-referrer";
  }
  url = new URL(url);
  if (/^(about|blob|data):$/.test(url.protocol)) {
    return "no-referrer";
  }
  url.username = "";
  url.password = "";
  url.hash = "";
  if (originOnly) {
    url.pathname = "";
    url.search = "";
  }
  return url;
}
var ReferrerPolicy = /* @__PURE__ */ new Set([
  "",
  "no-referrer",
  "no-referrer-when-downgrade",
  "same-origin",
  "origin",
  "strict-origin",
  "origin-when-cross-origin",
  "strict-origin-when-cross-origin",
  "unsafe-url"
]);
var DEFAULT_REFERRER_POLICY = "strict-origin-when-cross-origin";
function validateReferrerPolicy(referrerPolicy) {
  if (!ReferrerPolicy.has(referrerPolicy)) {
    throw new TypeError(`Invalid referrerPolicy: ${referrerPolicy}`);
  }
  return referrerPolicy;
}
function isOriginPotentiallyTrustworthy(url) {
  if (/^(http|ws)s:$/.test(url.protocol)) {
    return true;
  }
  const hostIp = url.host.replace(/(^\[)|(]$)/g, "");
  const hostIPVersion = (0, import_node_net.isIP)(hostIp);
  if (hostIPVersion === 4 && /^127\./.test(hostIp)) {
    return true;
  }
  if (hostIPVersion === 6 && /^(((0+:){7})|(::(0+:){0,6}))0*1$/.test(hostIp)) {
    return true;
  }
  if (/^(.+\.)*localhost$/.test(url.host)) {
    return false;
  }
  if (url.protocol === "file:") {
    return true;
  }
  return false;
}
function isUrlPotentiallyTrustworthy(url) {
  if (/^about:(blank|srcdoc)$/.test(url)) {
    return true;
  }
  if (url.protocol === "data:") {
    return true;
  }
  if (/^(blob|filesystem):$/.test(url.protocol)) {
    return true;
  }
  return isOriginPotentiallyTrustworthy(url);
}
function determineRequestsReferrer(request, { referrerURLCallback, referrerOriginCallback } = {}) {
  if (request.referrer === "no-referrer" || request.referrerPolicy === "") {
    return null;
  }
  const policy = request.referrerPolicy;
  if (request.referrer === "about:client") {
    return "no-referrer";
  }
  const referrerSource = request.referrer;
  let referrerURL = stripURLForUseAsAReferrer(referrerSource);
  let referrerOrigin = stripURLForUseAsAReferrer(referrerSource, true);
  if (referrerURL.toString().length > 4096) {
    referrerURL = referrerOrigin;
  }
  if (referrerURLCallback) {
    referrerURL = referrerURLCallback(referrerURL);
  }
  if (referrerOriginCallback) {
    referrerOrigin = referrerOriginCallback(referrerOrigin);
  }
  const currentURL = new URL(request.url);
  switch (policy) {
    case "no-referrer":
      return "no-referrer";
    case "origin":
      return referrerOrigin;
    case "unsafe-url":
      return referrerURL;
    case "strict-origin":
      if (isUrlPotentiallyTrustworthy(referrerURL) && !isUrlPotentiallyTrustworthy(currentURL)) {
        return "no-referrer";
      }
      return referrerOrigin.toString();
    case "strict-origin-when-cross-origin":
      if (referrerURL.origin === currentURL.origin) {
        return referrerURL;
      }
      if (isUrlPotentiallyTrustworthy(referrerURL) && !isUrlPotentiallyTrustworthy(currentURL)) {
        return "no-referrer";
      }
      return referrerOrigin;
    case "same-origin":
      if (referrerURL.origin === currentURL.origin) {
        return referrerURL;
      }
      return "no-referrer";
    case "origin-when-cross-origin":
      if (referrerURL.origin === currentURL.origin) {
        return referrerURL;
      }
      return referrerOrigin;
    case "no-referrer-when-downgrade":
      if (isUrlPotentiallyTrustworthy(referrerURL) && !isUrlPotentiallyTrustworthy(currentURL)) {
        return "no-referrer";
      }
      return referrerURL;
    default:
      throw new TypeError(`Invalid referrerPolicy: ${policy}`);
  }
}
function parseReferrerPolicyFromHeader(headers) {
  const policyTokens = (headers.get("referrer-policy") || "").split(/[,\s]+/);
  let policy = "";
  for (const token of policyTokens) {
    if (token && ReferrerPolicy.has(token)) {
      policy = token;
    }
  }
  return policy;
}

// node_modules/node-fetch/src/request.js
var INTERNALS3 = Symbol("Request internals");
var isRequest = (object) => {
  return typeof object === "object" && typeof object[INTERNALS3] === "object";
};
var doBadDataWarn = (0, import_node_util3.deprecate)(() => {
}, ".data is not a valid RequestInit property, use .body instead", "https://github.com/node-fetch/node-fetch/issues/1000 (request)");
var Request = class extends Body {
  constructor(input, init = {}) {
    let parsedURL;
    if (isRequest(input)) {
      parsedURL = new URL(input.url);
    } else {
      parsedURL = new URL(input);
      input = {};
    }
    if (parsedURL.username !== "" || parsedURL.password !== "") {
      throw new TypeError(`${parsedURL} is an url with embedded credentials.`);
    }
    let method = init.method || input.method || "GET";
    if (/^(delete|get|head|options|post|put)$/i.test(method)) {
      method = method.toUpperCase();
    }
    if ("data" in init) {
      doBadDataWarn();
    }
    if ((init.body != null || isRequest(input) && input.body !== null) && (method === "GET" || method === "HEAD")) {
      throw new TypeError("Request with GET/HEAD method cannot have body");
    }
    const inputBody = init.body ? init.body : isRequest(input) && input.body !== null ? clone(input) : null;
    super(inputBody, {
      size: init.size || input.size || 0
    });
    const headers = new Headers(init.headers || input.headers || {});
    if (inputBody !== null && !headers.has("Content-Type")) {
      const contentType = extractContentType(inputBody, this);
      if (contentType) {
        headers.set("Content-Type", contentType);
      }
    }
    let signal = isRequest(input) ? input.signal : null;
    if ("signal" in init) {
      signal = init.signal;
    }
    if (signal != null && !isAbortSignal(signal)) {
      throw new TypeError("Expected signal to be an instanceof AbortSignal or EventTarget");
    }
    let referrer = init.referrer == null ? input.referrer : init.referrer;
    if (referrer === "") {
      referrer = "no-referrer";
    } else if (referrer) {
      const parsedReferrer = new URL(referrer);
      referrer = /^about:(\/\/)?client$/.test(parsedReferrer) ? "client" : parsedReferrer;
    } else {
      referrer = void 0;
    }
    this[INTERNALS3] = {
      method,
      redirect: init.redirect || input.redirect || "follow",
      headers,
      parsedURL,
      signal,
      referrer
    };
    this.follow = init.follow === void 0 ? input.follow === void 0 ? 20 : input.follow : init.follow;
    this.compress = init.compress === void 0 ? input.compress === void 0 ? true : input.compress : init.compress;
    this.counter = init.counter || input.counter || 0;
    this.agent = init.agent || input.agent;
    this.highWaterMark = init.highWaterMark || input.highWaterMark || 16384;
    this.insecureHTTPParser = init.insecureHTTPParser || input.insecureHTTPParser || false;
    this.referrerPolicy = init.referrerPolicy || input.referrerPolicy || "";
  }
  get method() {
    return this[INTERNALS3].method;
  }
  get url() {
    return (0, import_node_url.format)(this[INTERNALS3].parsedURL);
  }
  get headers() {
    return this[INTERNALS3].headers;
  }
  get redirect() {
    return this[INTERNALS3].redirect;
  }
  get signal() {
    return this[INTERNALS3].signal;
  }
  get referrer() {
    if (this[INTERNALS3].referrer === "no-referrer") {
      return "";
    }
    if (this[INTERNALS3].referrer === "client") {
      return "about:client";
    }
    if (this[INTERNALS3].referrer) {
      return this[INTERNALS3].referrer.toString();
    }
    return void 0;
  }
  get referrerPolicy() {
    return this[INTERNALS3].referrerPolicy;
  }
  set referrerPolicy(referrerPolicy) {
    this[INTERNALS3].referrerPolicy = validateReferrerPolicy(referrerPolicy);
  }
  clone() {
    return new Request(this);
  }
  get [Symbol.toStringTag]() {
    return "Request";
  }
};
Object.defineProperties(Request.prototype, {
  method: { enumerable: true },
  url: { enumerable: true },
  headers: { enumerable: true },
  redirect: { enumerable: true },
  clone: { enumerable: true },
  signal: { enumerable: true },
  referrer: { enumerable: true },
  referrerPolicy: { enumerable: true }
});
var getNodeRequestOptions = (request) => {
  const { parsedURL } = request[INTERNALS3];
  const headers = new Headers(request[INTERNALS3].headers);
  if (!headers.has("Accept")) {
    headers.set("Accept", "*/*");
  }
  let contentLengthValue = null;
  if (request.body === null && /^(post|put)$/i.test(request.method)) {
    contentLengthValue = "0";
  }
  if (request.body !== null) {
    const totalBytes = getTotalBytes(request);
    if (typeof totalBytes === "number" && !Number.isNaN(totalBytes)) {
      contentLengthValue = String(totalBytes);
    }
  }
  if (contentLengthValue) {
    headers.set("Content-Length", contentLengthValue);
  }
  if (request.referrerPolicy === "") {
    request.referrerPolicy = DEFAULT_REFERRER_POLICY;
  }
  if (request.referrer && request.referrer !== "no-referrer") {
    request[INTERNALS3].referrer = determineRequestsReferrer(request);
  } else {
    request[INTERNALS3].referrer = "no-referrer";
  }
  if (request[INTERNALS3].referrer instanceof URL) {
    headers.set("Referer", request.referrer);
  }
  if (!headers.has("User-Agent")) {
    headers.set("User-Agent", "node-fetch");
  }
  if (request.compress && !headers.has("Accept-Encoding")) {
    headers.set("Accept-Encoding", "gzip, deflate, br");
  }
  let { agent } = request;
  if (typeof agent === "function") {
    agent = agent(parsedURL);
  }
  if (!headers.has("Connection") && !agent) {
    headers.set("Connection", "close");
  }
  const search = getSearch(parsedURL);
  const options = {
    path: parsedURL.pathname + search,
    method: request.method,
    headers: headers[Symbol.for("nodejs.util.inspect.custom")](),
    insecureHTTPParser: request.insecureHTTPParser,
    agent
  };
  return {
    parsedURL,
    options
  };
};

// node_modules/node-fetch/src/errors/abort-error.js
var AbortError = class extends FetchBaseError {
  constructor(message, type = "aborted") {
    super(message, type);
  }
};

// node_modules/node-fetch/src/index.js
init_esm_min();
init_from();
var supportedSchemas = /* @__PURE__ */ new Set(["data:", "http:", "https:"]);
async function fetch(url, options_) {
  return new Promise((resolve, reject) => {
    const request = new Request(url, options_);
    const { parsedURL, options } = getNodeRequestOptions(request);
    if (!supportedSchemas.has(parsedURL.protocol)) {
      throw new TypeError(`node-fetch cannot load ${url}. URL scheme "${parsedURL.protocol.replace(/:$/, "")}" is not supported.`);
    }
    if (parsedURL.protocol === "data:") {
      const data = dist_default(request.url);
      const response2 = new Response(data, { headers: { "Content-Type": data.typeFull } });
      resolve(response2);
      return;
    }
    const send = (parsedURL.protocol === "https:" ? import_node_https.default : import_node_http2.default).request;
    const { signal } = request;
    let response = null;
    const abort = () => {
      const error = new AbortError("The operation was aborted.");
      reject(error);
      if (request.body && request.body instanceof import_node_stream2.default.Readable) {
        request.body.destroy(error);
      }
      if (!response || !response.body) {
        return;
      }
      response.body.emit("error", error);
    };
    if (signal && signal.aborted) {
      abort();
      return;
    }
    const abortAndFinalize = () => {
      abort();
      finalize();
    };
    const request_ = send(parsedURL.toString(), options);
    if (signal) {
      signal.addEventListener("abort", abortAndFinalize);
    }
    const finalize = () => {
      request_.abort();
      if (signal) {
        signal.removeEventListener("abort", abortAndFinalize);
      }
    };
    request_.on("error", (error) => {
      reject(new FetchError(`request to ${request.url} failed, reason: ${error.message}`, "system", error));
      finalize();
    });
    fixResponseChunkedTransferBadEnding(request_, (error) => {
      response.body.destroy(error);
    });
    if (process.version < "v14") {
      request_.on("socket", (s2) => {
        let endedWithEventsCount;
        s2.prependListener("end", () => {
          endedWithEventsCount = s2._eventsCount;
        });
        s2.prependListener("close", (hadError) => {
          if (response && endedWithEventsCount < s2._eventsCount && !hadError) {
            const error = new Error("Premature close");
            error.code = "ERR_STREAM_PREMATURE_CLOSE";
            response.body.emit("error", error);
          }
        });
      });
    }
    request_.on("response", (response_) => {
      request_.setTimeout(0);
      const headers = fromRawHeaders(response_.rawHeaders);
      if (isRedirect(response_.statusCode)) {
        const location = headers.get("Location");
        let locationURL = null;
        try {
          locationURL = location === null ? null : new URL(location, request.url);
        } catch {
          if (request.redirect !== "manual") {
            reject(new FetchError(`uri requested responds with an invalid redirect URL: ${location}`, "invalid-redirect"));
            finalize();
            return;
          }
        }
        switch (request.redirect) {
          case "error":
            reject(new FetchError(`uri requested responds with a redirect, redirect mode is set to error: ${request.url}`, "no-redirect"));
            finalize();
            return;
          case "manual":
            break;
          case "follow": {
            if (locationURL === null) {
              break;
            }
            if (request.counter >= request.follow) {
              reject(new FetchError(`maximum redirect reached at: ${request.url}`, "max-redirect"));
              finalize();
              return;
            }
            const requestOptions = {
              headers: new Headers(request.headers),
              follow: request.follow,
              counter: request.counter + 1,
              agent: request.agent,
              compress: request.compress,
              method: request.method,
              body: clone(request),
              signal: request.signal,
              size: request.size,
              referrer: request.referrer,
              referrerPolicy: request.referrerPolicy
            };
            if (!isDomainOrSubdomain(request.url, locationURL)) {
              for (const name of ["authorization", "www-authenticate", "cookie", "cookie2"]) {
                requestOptions.headers.delete(name);
              }
            }
            if (response_.statusCode !== 303 && request.body && options_.body instanceof import_node_stream2.default.Readable) {
              reject(new FetchError("Cannot follow redirect with body being a readable stream", "unsupported-redirect"));
              finalize();
              return;
            }
            if (response_.statusCode === 303 || (response_.statusCode === 301 || response_.statusCode === 302) && request.method === "POST") {
              requestOptions.method = "GET";
              requestOptions.body = void 0;
              requestOptions.headers.delete("content-length");
            }
            const responseReferrerPolicy = parseReferrerPolicyFromHeader(headers);
            if (responseReferrerPolicy) {
              requestOptions.referrerPolicy = responseReferrerPolicy;
            }
            resolve(fetch(new Request(locationURL, requestOptions)));
            finalize();
            return;
          }
          default:
            return reject(new TypeError(`Redirect option '${request.redirect}' is not a valid value of RequestRedirect`));
        }
      }
      if (signal) {
        response_.once("end", () => {
          signal.removeEventListener("abort", abortAndFinalize);
        });
      }
      let body = (0, import_node_stream2.pipeline)(response_, new import_node_stream2.PassThrough(), (error) => {
        if (error) {
          reject(error);
        }
      });
      if (process.version < "v12.10") {
        response_.on("aborted", abortAndFinalize);
      }
      const responseOptions = {
        url: request.url,
        status: response_.statusCode,
        statusText: response_.statusMessage,
        headers,
        size: request.size,
        counter: request.counter,
        highWaterMark: request.highWaterMark
      };
      const codings = headers.get("Content-Encoding");
      if (!request.compress || request.method === "HEAD" || codings === null || response_.statusCode === 204 || response_.statusCode === 304) {
        response = new Response(body, responseOptions);
        resolve(response);
        return;
      }
      const zlibOptions = {
        flush: import_node_zlib.default.Z_SYNC_FLUSH,
        finishFlush: import_node_zlib.default.Z_SYNC_FLUSH
      };
      if (codings === "gzip" || codings === "x-gzip") {
        body = (0, import_node_stream2.pipeline)(body, import_node_zlib.default.createGunzip(zlibOptions), (error) => {
          if (error) {
            reject(error);
          }
        });
        response = new Response(body, responseOptions);
        resolve(response);
        return;
      }
      if (codings === "deflate" || codings === "x-deflate") {
        const raw = (0, import_node_stream2.pipeline)(response_, new import_node_stream2.PassThrough(), (error) => {
          if (error) {
            reject(error);
          }
        });
        raw.once("data", (chunk) => {
          if ((chunk[0] & 15) === 8) {
            body = (0, import_node_stream2.pipeline)(body, import_node_zlib.default.createInflate(), (error) => {
              if (error) {
                reject(error);
              }
            });
          } else {
            body = (0, import_node_stream2.pipeline)(body, import_node_zlib.default.createInflateRaw(), (error) => {
              if (error) {
                reject(error);
              }
            });
          }
          response = new Response(body, responseOptions);
          resolve(response);
        });
        raw.once("end", () => {
          if (!response) {
            response = new Response(body, responseOptions);
            resolve(response);
          }
        });
        return;
      }
      if (codings === "br") {
        body = (0, import_node_stream2.pipeline)(body, import_node_zlib.default.createBrotliDecompress(), (error) => {
          if (error) {
            reject(error);
          }
        });
        response = new Response(body, responseOptions);
        resolve(response);
        return;
      }
      response = new Response(body, responseOptions);
      resolve(response);
    });
    writeToStream(request_, request).catch(reject);
  });
}
function fixResponseChunkedTransferBadEnding(request, errorCallback) {
  const LAST_CHUNK = import_node_buffer2.Buffer.from("0\r\n\r\n");
  let isChunkedTransfer = false;
  let properLastChunkReceived = false;
  let previousChunk;
  request.on("response", (response) => {
    const { headers } = response;
    isChunkedTransfer = headers["transfer-encoding"] === "chunked" && !headers["content-length"];
  });
  request.on("socket", (socket) => {
    const onSocketClose = () => {
      if (isChunkedTransfer && !properLastChunkReceived) {
        const error = new Error("Premature close");
        error.code = "ERR_STREAM_PREMATURE_CLOSE";
        errorCallback(error);
      }
    };
    const onData = (buf) => {
      properLastChunkReceived = import_node_buffer2.Buffer.compare(buf.slice(-5), LAST_CHUNK) === 0;
      if (!properLastChunkReceived && previousChunk) {
        properLastChunkReceived = import_node_buffer2.Buffer.compare(previousChunk.slice(-3), LAST_CHUNK.slice(0, 3)) === 0 && import_node_buffer2.Buffer.compare(buf.slice(-2), LAST_CHUNK.slice(3)) === 0;
      }
      previousChunk = buf;
    };
    socket.prependListener("close", onSocketClose);
    socket.on("data", onData);
    request.on("close", () => {
      socket.removeListener("close", onSocketClose);
      socket.removeListener("data", onData);
    });
  });
}

// lib/lambda/github-handler.ts
var AWS = __toESM(require("aws-sdk"));
var import_client_secrets_manager = __toESM(require_dist_cjs44());
var getSecrets = async ({ secretName }) => {
  const client = new import_client_secrets_manager.SecretsManager({ region: "us-east-1" });
  try {
    const data = await client.getSecretValue({ SecretId: secretName });
    if ("SecretString" in data) {
      const secret = data.SecretString;
      return secret;
    }
  } catch (error) {
    console.error({
      message: `Unable to load secret key '${secretName}'`,
      details: error.toString()
    });
  }
  return {
    DIAGNOSTIC_API_KEY: ""
  };
};
var handler = async (event) => {
  console.log(event);
  const region = event.region;
  const pipelineName = event.detail.pipeline;
  const executionId = event.detail["execution-id"];
  const state = transformState(event.detail.state);
  if (state === null) {
    return;
  }
  const result = await getPipelineExecution(pipelineName, executionId);
  console.log("get piplelineExecution", result);
  console.log(pipelineName, executionId);
  const payload = createPayload(pipelineName, region, state);
  if (!result) {
    console.error(`Can not resolve pipeline execution`);
    return;
  }
  const response = await postStatusToGitHub(result.owner, result.repository, result.sha, payload);
  console.log("post response", response);
  console.log(`Successfully notified GitHub repository ${result.owner}/${result.repository} for commit ${result.sha} with payload:`, payload);
};
var getPersonalAccessToken = async () => {
  const secrets = await getSecrets({ secretName: "github-token" });
  return secrets;
  throw new Error("process.env.ACCESS_TOKEN is not defined");
};
var getPipelineExecution = async (pipelineName, executionId) => {
  var _a, _b, _c;
  const params = {
    pipelineName,
    pipelineExecutionId: executionId
  };
  const result = await new AWS.CodePipeline().getPipelineExecution(params).promise();
  console.log("get result from execution", result);
  const artifactRevision = (_b = (_a = result == null ? void 0 : result.pipelineExecution) == null ? void 0 : _a.artifactRevisions) == null ? void 0 : _b.find(() => true);
  console.log(result);
  console.log((_c = result == null ? void 0 : result.pipelineExecution) == null ? void 0 : _c.artifactRevisions);
  const revisionURL = artifactRevision == null ? void 0 : artifactRevision.revisionUrl;
  const sha = artifactRevision == null ? void 0 : artifactRevision.revisionId;
  if (!revisionURL || !sha) {
    console.error("No revision URL or commit hash resolved");
    return;
  }
  const pattern = /github.com\/(.+)\/(.+)\/commit\//;
  const matches = pattern.exec(revisionURL);
  console.log(matches);
  return {
    owner: matches == null ? void 0 : matches[1],
    repository: matches == null ? void 0 : matches[2],
    sha
  };
};
function transformState(state) {
  if (state === "STARTED") {
    return "pending";
  }
  if (state === "SUCCEEDED") {
    return "success";
  }
  if (state === "FAILED") {
    return "failure";
  }
  return null;
}
function createPayload(pipelineName, region, status) {
  let description;
  if (status === "pending") {
    description = "Build started";
  } else if (status === "success") {
    description = "Build succeeded";
  } else if (status === "failure") {
    description = "Build failed!";
  }
  return {
    state: status,
    target_url: pipelineName,
    description,
    context: `ci/${pipelineName}/${region}`
  };
}
var postStatusToGitHub = async (owner, repository, sha, payload) => {
  const url = `https://api.github.com/repos/BioCarmen/test-cdk/deployments`;
  const _payload = { ...payload, ref: sha };
  const token = await getPersonalAccessToken();
  console.log("token", token);
  console.log(_payload, sha);
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `token ${token}`
      },
      body: _payload
    });
    console.log(response);
  } catch (error) {
    console.log(error);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
/*! fetch-blob. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> */
/*! formdata-polyfill. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> */
/*! node-domexception. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> */
