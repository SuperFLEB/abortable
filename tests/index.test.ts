import {setAbortableInterval, setAbortableTimeout} from "../src/index";

describe("setAbortable", () => {
	it("executes a timeout", async () => {
		const success = jest.fn();
		const promise = new Promise(
			(res) => {
				setAbortableTimeout(() => {
					success();
					res(1);
				}, 500);
			});
		expect(success).not.toHaveBeenCalled();
		await promise;
		expect(success).toHaveBeenCalledTimes(1);
	});

	it("executes an interval", async () => {
		let resolve = (val: any) => {};
		const promise = new Promise(res => { resolve = res; });
		let counter = 0;
		const abortController = setAbortableInterval(() => {
			if (counter >= 5) {
				resolve(1);
				return;
			}
			counter++;
		}, 100);
		await promise;
		expect(counter).toBe(5);
		abortController.abort();
	});

	it("aborts a timeout with the returned abort controller", async () => {
		let counter = 0;
		const abortController = setAbortableTimeout(() => {
			counter++;
		}, 1000);
		await new Promise(res => setTimeout(res, 100));
		abortController.abort();
		await new Promise(res => setTimeout(res, 1000));
		expect(counter).toBe(0);
	});

	it("aborts an interval with the returned abort controller", async () => {
		let counter = 0;
		const abortController = setAbortableInterval(() => {
			counter++;
		}, 1000);
		await new Promise(res => setTimeout(res, 100));
		abortController.abort();
		await new Promise(res => setTimeout(res, 1000));
		expect(counter).toBe(0);
	});

	it("aborts a timeout with the passed-in abort signal", async () => {
		let counter = 0;
		const abortController = new AbortController();
		setAbortableTimeout(() => {
			counter++;
		}, 1000, abortController.signal);
		await new Promise(res => setTimeout(res, 100));
		abortController.abort();
		await new Promise(res => setTimeout(res, 1000));
		expect(counter).toBe(0);
	});

	it("aborts an interval with the passed-in abort signal", async () => {
		let counter = 0;
		const abortController = new AbortController();

		setAbortableInterval(() => {
			counter++;
		}, 1000, abortController.signal);
		await new Promise(res => setTimeout(res, 100));
		abortController.abort();
		await new Promise(res => setTimeout(res, 1000));
		expect(counter).toBe(0);
	});

	it("never starts a timeout when the abort signal is already aborted", async () => {
		let counter = 0;
		const abortController = new AbortController();
		abortController.abort();
		setAbortableTimeout(() => {
			counter++;
		}, 100, abortController.signal);
		await new Promise(res => setTimeout(res, 500));
		expect(counter).toBe(0);
	});

	it("never starts an interval when the abort signal is already aborted", async () => {
		let counter = 0;
		const abortController = new AbortController();
		abortController.abort();
		setAbortableInterval(() => {
			counter++;
		}, 100, abortController.signal);
		await new Promise(res => setTimeout(res, 500));
		expect(counter).toBe(0);
	});
});

