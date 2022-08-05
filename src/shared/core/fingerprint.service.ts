/* eslint-disable import/no-named-as-default-member */
import FingerprintJS from '@fingerprintjs/fingerprintjs-pro';
import { Agent } from '@fingerprintjs/fingerprintjs-pro';
import { Injectable } from '@angular/core';
import { makeQueryablePromise } from './queryable-promise';
import { QueryablePromise } from './queryable-promise';

/**
 * Service to determine unique device fingerprint (so called "visitorId").
 */
@Injectable( { providedIn: 'root' } )
export class PFingerprintService {
	constructor(
	) {
	}

	private fingerprintAgent : QueryablePromise<Agent> | null = null;

	private _visitorId : string | undefined = undefined;
	private _visitorIdPromise : QueryablePromise<string> | null = null;

	/**
	 * Returns the unique visitor-id of this device. `undefined` is returned when the
	 * id has not been determined yet.
	 *
	 * Call this method only if you need it because it causes costs at www.fingerprintjs.com.
	 */
	public get visitorId() : string | undefined {
		this.getVisitorIdPromise();
		return this._visitorId;
	}

	/**
	 * Ensures that the Fingerprint agent is loaded. The agent is needed to identify an device by a visitor id.
	 * See www.fingerprintjs.com.
	 */
	private ensureAgent() : Promise<Agent> {
		if (this.fingerprintAgent === null) {
			this.fingerprintAgent = makeQueryablePromise(new Promise<Agent>(resolve => {
				// we experienced app freezes because of fingerprint. Loading the agent deferred seem to reduce the problem.
				// So, we use a timeout.
				window.setTimeout(() => {
					FingerprintJS.load({
						token: '1vrkqOkin1vheD7P2yWa', // cSpell:disable-line
						region: 'eu',
						endpoint: 'https://fp.dr-plano.com',
					}).then(agent => resolve(agent));
				}, 2000);
			}));
		}

		return this.fingerprintAgent;
	}

	/**
	 * Is any finger-print operation running now?
	 */
	public get isLoading() : boolean {
		const agentPending = this.fingerprintAgent?.isPending() ?? false;
		const visitorIdPending = this._visitorIdPromise?.isPending() ?? false;

		return agentPending || visitorIdPending;
	}

	/**
	 * Returns `visitorId` as a promise.
	 *
	 * Call this method only if you need it because it causes costs at www.fingerprintjs.com.
	 */
	public getVisitorIdPromise() : Promise<string> {
		if (!this._visitorIdPromise) {
			this._visitorIdPromise = makeQueryablePromise(
				this.ensureAgent()
					.then(fp => fp.get())
					.then(result => this._visitorId = result.visitorId));
		}

		return this._visitorIdPromise;
	}
}
