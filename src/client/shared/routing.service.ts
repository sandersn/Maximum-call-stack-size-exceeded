import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

export const enum CurrentPageEnum {
	SCHEDULING,
	REPORT,
	BOOKING,
}

@Injectable()
export class ClientRoutingService {
	private routerUrl ! : string;

	constructor(
		private router : Router,
	) {
		this.routerUrl = this.router.url;

		this.router.events.subscribe(() => {
			this.routerUrl = this.router.url;
		});
	}

	/**
	 * On what page is the user?
	 */
	public get currentPage() : CurrentPageEnum | null {
		if (this.routerUrl.startsWith('/client/scheduling')) return CurrentPageEnum.SCHEDULING;
		if (this.routerUrl.startsWith('/client/report')) return CurrentPageEnum.REPORT;
		if (this.routerUrl.startsWith('/client/booking')) return CurrentPageEnum.BOOKING;
		return null;
	}
}
