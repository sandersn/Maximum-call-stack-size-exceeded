// cSpell:ignore launchdarkly
import * as LDClient from 'launchdarkly-js-client-sdk';
import { Injectable } from '@angular/core';
import { AvailableLaunchDarklyFlags } from './launch-darkly.types';
import { Config } from '../core/config';
import { LogService } from '../core/log.service';
import { assumeNonNull } from '../core/null-type-utils';

export type LDDeskCardValue = {
	cardId : number | null,
	content ?: {
		de : string,
		en : string
	}
};

/**
 * Everything we do with LaunchDarkly should go here.
 */
@Injectable({ providedIn: 'root' })
export class PLaunchDarklyService {
	constructor(
		private console : LogService,
	) {
	}

	private lDClient : LDClient.LDClient | null = null;

	/**
	 * Init LaunchDarkly
	 */
	public init(clientId : string) : void {
		const user : LDClient.LDUser = {
			key: clientId,
		};

		this.lDClient = LDClient.initialize(Config.LAUNCH_DARKLY_CLIENT_ID, user);
		this.lDClient.waitForInitialization().then(() => {
			// initialization succeeded, flag values are now available
		}).catch(error => {
			if (Config.DEBUG) {
				this.console.warn(error);
				return;
			}
			throw new Error(error);
		});
	}

	public get<T = undefined>(
		_id : 'desk-card',
		_defaultValue ?: T,
	) : LDDeskCardValue | T;
	public get<T = undefined>(
		_id : 'block-sepa-payments',
		_defaultValue ?: T,
	) : boolean | T;

	/**
	 * Get the value from LaunchDarkly.
	 * @returns The flags value. undefined if LaunchDarkly is not available and no default value is defined
	 */
	public get<T>(
		id : AvailableLaunchDarklyFlags,
		defaultValue ?: T,
	) : T {
		assumeNonNull(this.lDClient);
		return this.lDClient.variation(id, defaultValue);
	}
}
