import worker from "./worker"
export default class WebWorker {
	constructor(a) {
		const code = a.toString();
		const blob = new Blob(['('+code+')()']);
		return new Worker(worker);
	}
}
