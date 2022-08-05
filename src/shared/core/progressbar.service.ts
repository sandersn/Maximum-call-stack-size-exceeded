import { NgProgressComponent } from 'ngx-progressbar';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { LogService } from './log.service';
import { SchedulingApiService, TimeStampApiService } from '../api';

@Injectable({providedIn: 'root'})
export class PProgressbarService {
	constructor(
		private schedulingApiService : SchedulingApiService,
		private timeStampApiService : TimeStampApiService,
		private console : LogService,
	) {
		this.initService();
	}

	private initService() : void {
		this.schedulingApiService.onDataLoadStart.subscribe(() => this.start());
		this.timeStampApiService.onDataLoadStart.subscribe(() => this.start());

		this.schedulingApiService.onDataLoaded.subscribe(() => this.complete());
		this.timeStampApiService.onDataLoaded.subscribe(() => this.complete());
	}

	public onChange : Subject<'start' | number | 'complete'> = new Subject();

	private startDelayMs : number = 20;
	private startDelayTimeout : number | null = null;
	private stopStartDelayTimeout() : void {
		window.clearTimeout(this.startDelayTimeout ?? undefined);
		this.startDelayTimeout = null;
	}

	private state : 'idle' | 'running' = 'idle';

	/**
	 * Show the progressbar and start the animation
	 */
	public start() : void {
		if (this.completeDelayTimeout !== null) {
			this.stopCompleteDelayTimeout();
			this.console.debug('Progressbar ➡ 🧭 completion delayed');
			return;
		}

		// debounceTime setting Seems to have no effect. Therefore i added startDelayTimeout myself.
		if (this.startDelayTimeout !== null) return;
		if (this.state === 'running') return;
		this.console.debug('Progressbar ➡ ⏱ requested');
		this.startDelayTimeout = window.setTimeout(() => {
			this.stopStartDelayTimeout();
			if (this.state === 'running') return;
			this.onChange.next('start');
			this.state = 'running';
			this.console.debug('Progressbar ➡ 🛫 started');
		}, this.startDelayMs);
	}

	/**
	 * Set the progressbar to a specific percentage
	 */
	public set(percentage : number) : void {
		this.onChange.next(percentage);
	}

	/**
	 * Make sure the bar will not disappear abrupt. Also… let time pass by to make it possible that another start() call
	 * can extend the duration of visibility of current bar instead of starting another one.
	 */
	private completeDelayMs : number = 50;
	private completeDelayTimeout : number | null = null;
	private stopCompleteDelayTimeout() : void {
		window.clearTimeout(this.completeDelayTimeout ?? undefined);
		this.completeDelayTimeout = null;
	}

	/**
	 * Complete the progressbar animation and hide it
	 */
	public complete() : void {
		// If a progressbar is waiting to start (startDelayTimeout) then stop this waiting and do nothing.
		if (this.startDelayTimeout !== null) {
			this.stopStartDelayTimeout();
			this.console.debug('Progressbar ➡ 🚫 requested canceled');
			return;
		}

		if (this.completeDelayTimeout !== null) return;
		if (this.state === 'idle') return;
		this.onChange.next(90);
		this.completeDelayTimeout = window.setTimeout(() => {
			this.stopCompleteDelayTimeout();
			if (this.state === 'idle') return;
			this.onChange.next('complete');
			this.state = 'idle';
			this.console.debug('Progressbar ➡ 🛬 completed');
		}, this.completeDelayMs);
	}

	/**
	 * Connect a progress bar ref to this service.
	 */
	public setSubscriber(ngProgressRef : NgProgressComponent) : void {
		this.onChange.subscribe((event) => {
			switch (event) {
				case 'start':
					ngProgressRef.start();
					break;
				case 'complete':
					ngProgressRef.complete();
					break;
				default:
					ngProgressRef.set(event);
			}
		});
	}
}
