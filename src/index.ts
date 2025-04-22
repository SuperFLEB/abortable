const methods = {
	'timeout': [globalThis.setTimeout, globalThis.clearTimeout],
	'interval': [globalThis.setInterval, globalThis.clearInterval],
} as const;

function abortable(method: keyof typeof methods, callback: () => void, msec: number, signal?: AbortSignal, expectAbortedSignal?: boolean): AbortController {
	const [set, clear] = methods[method];
	if (signal && signal.aborted && !expectAbortedSignal) {
		const reason = `Not creating abortable ${method} because the signal was already aborted`;
		console.warn(reason);
		const abortedController = new AbortController();
		abortedController.abort();
		return abortedController;
	}

	const myAbort = new AbortController();
	const signals = signal ? AbortSignal.any([signal, myAbort.signal]) : myAbort.signal;

	const id = set(callback, msec);

	signals.addEventListener("abort", () => {
		clear(id);
		myAbort.abort();
	}, { once: true });

	return myAbort;
}

export const setAbortableTimeout = abortable.bind(globalThis, "timeout");
export const setAbortableInterval = abortable.bind(globalThis, "interval");
