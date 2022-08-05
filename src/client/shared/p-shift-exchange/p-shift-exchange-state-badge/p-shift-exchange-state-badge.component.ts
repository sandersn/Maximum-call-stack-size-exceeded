import { Component, Input, ChangeDetectionStrategy, HostBinding } from '@angular/core';
import { PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { SchedulingApiShiftExchange, SchedulingApiShiftExchangeCommunication } from '@plano/shared/api';
import { PShiftExchangeConceptService } from '../p-shift-exchange-concept.service';

@Component({
	selector: 'p-shift-exchange-state-badge[shiftExchange]',
	templateUrl: './p-shift-exchange-state-badge.component.html',
	styleUrls: ['./p-shift-exchange-state-badge.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class PShiftExchangeStateBadgeComponent {
	@Input() public shiftExchange ! : SchedulingApiShiftExchange;
	@Input() public communication : SchedulingApiShiftExchangeCommunication | null = null;

	constructor(
		private pShiftExchangeConceptService : PShiftExchangeConceptService,
	) {
	}

	@Input('text') private _text : string | null = null;

	@Input('theme') private _theme : PThemeEnum | null = null;

	@HostBinding('title')
	// eslint-disable-next-line jsdoc/require-jsdoc
	public get text() : string | null {
		if (this._text) return this._text;
		if (this.communication) {
			return this.pShiftExchangeConceptService.getActionStateText(
				this.shiftExchange,
				this.communication,
				this.communication.lastAction,
			);
		}
		return this.pShiftExchangeConceptService.getStateText(this.shiftExchange);
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get theme() : PThemeEnum | null {
		if (this._theme) return this._theme;
		if (this.communication) {
			this.pShiftExchangeConceptService.getCommunicationStateStyle(
				this.communication.communicationState,
				this.communication.lastAction,
			);
		}
		return this.pShiftExchangeConceptService.getStateStyle(this.shiftExchange);
	}
}
