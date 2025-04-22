# @superfleb/abortable

Abortable setTimeout and setInterval.

## To install

This is only available on the GitHub package registry. You will need to be connected to it and signed in.
Set your registry for the @superfleb scope to GitHub:

```shell
npm config set @superfleb:registry https://npm.pkg.github.com
```
```shell
yarn config set npmScopes.superfleb.npmRegistryServer https://npm.pkg.github.com
yarn config set npmScopes.superfleb.npmAlwaysAuth true
```

Now you can get it with

```shell
npm install @superfleb/abortable
```
```shell
yarn add @superfleb/abortable
```

## To use

```javascript
const abortController = setAbortableInterval(fn, msec, signal, expectAbortedSignal);
const abortController = setAbortableInterval(fn, msec, signal, expectAbortedSignal);
```

* `fn` - a function to call when the timeout or interval hits
* `msec` - milliseconds to wait
* `signal` (optional) - An AbortSignal that will abort the timeout/interval when aborted
* `expectAbortedSignal` - If false/omitted, passing in an already-aborted `signal` will log a warning.
   If true, the warning is skipped. In both cases, passing an already-aborted `signal` will cancel the timeout/interval
   before it starts.

```javascript
import { setAbortableTimeout, setAbortableInterval } from "@superfleb/abortable"

// Pass in your own AbortSignal if you want.
const myController = new AbortController();

const timeoutController = setAbortableTimeout(() => {
	console.log("Tick (once).");
}, 1000, myController.signal);

const intervalController = setAbortableTimeout(() => {
	console.log("Tick.");
}, 1000, myController.signal);

// You can abort both with the signal you passed in...
myController.abort();

// Or you can abort them with the controller they returned
timeoutController.abort();
intervalController.abort();
```

