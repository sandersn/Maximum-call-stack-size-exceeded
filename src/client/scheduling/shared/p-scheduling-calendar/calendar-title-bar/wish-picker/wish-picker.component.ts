import { PopoverDirective } from 'ngx-bootstrap/popover';
import { Component, Input, Output, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { SchedulingService } from '@plano/client/scheduling/scheduling.service';
import { PWishesService } from '@plano/client/scheduling/wishes.service';
import { ToastsService } from '@plano/client/service/toasts.service';
import { PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { FilterService } from '@plano/client/shared/filter.service';
import { SchedulingApiService } from '@plano/shared/api';
import { SchedulingApiShift } from '@plano/shared/api';
import { SchedulingApiShifts } from '@plano/shared/api';
import { SchedulingApiShiftMemberPrefValue } from '@plano/shared/api';
import { Config } from '@plano/shared/core/config';
import { PPushNotificationsService, PRequestWebPushNotificationPermissionContext } from '@plano/shared/core/p-push-notifications.service';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';

@Component({
	selector: 'p-wish-picker[api]',
	templateUrl: './wish-picker.component.html',
	styleUrls: ['./wish-picker.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
	// host: {
	// 	'(dragover)': 'onDragOver()'
	// },
	// animations: [
	// 	// TODO: This is very slow. Need to find a better solution before i reenable this.
	// 	// trigger('scaleIn', [
	// 	// 	state('false', style({
	// 	// 		display: 'none !important',
	// 	// 		padding: '0',
	// 	// 		width: '0',
	// 	// 		opacity: '0'
	// 	// 	})),
	// 	// 	state('true', style({
	// 	// 	})),
	// 	//
	// 	// 	transition('false => true', [
	// 	// 		animate(150)
	// 	// 	]),
	// 	// 	transition('true => false', [
	// 	// 		animate(0)
	// 	// 	]),
	// 	// ]),
	// 	// trigger('scale', [
	// 	// 	state('false', style({
	// 	// 		display: 'none !important',
	// 	// 		padding: '0',
	// 	// 		width: '0',
	// 	// 		opacity: '0'
	// 	// 	})),
	// 	// 	state('true', style({
	// 	// 	})),
	// 	//
	// 	// 	transition('false => true', [
	// 	// 		animate(150)
	// 	// 	]),
	// 	// 	transition('true => false', [
	// 	// 		animate(150)
	// 	// 	]),
	// 	// ])
	// ],
})
export class WishPickerComponent {
	@HostBinding('class.d-flex') protected _alwaysTrue = true;

	public memberPrefValues = {
		CAN: SchedulingApiShiftMemberPrefValue.CAN,
		CANNOT: SchedulingApiShiftMemberPrefValue.CANNOT,
		WANT: SchedulingApiShiftMemberPrefValue.WANT,
	};

	@Input() public shift : SchedulingApiShift | null = null;
	@Input() public shifts : SchedulingApiShifts | null = null;
	@Input() public api ! : SchedulingApiService;

	@Output() public onPick : EventEmitter<SchedulingApiShiftMemberPrefValue> = new EventEmitter<SchedulingApiShiftMemberPrefValue>();

	public collapsed : boolean = false;
	public readonly CONFIG : typeof Config = Config;

	constructor(
		private schedulingService : SchedulingService,
		private filterService : FilterService,
		private pWishesService : PWishesService,
		private toastsService : ToastsService,
		private pPushNotificationsService : PPushNotificationsService,
		private localize : LocalizePipe,
	) {
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public onUncollapse(event : Event) : void {
		// this.collapsed = false;
		// this.onCollapseChanges.emit(this.collapsed);

		event.preventDefault();
		event.stopPropagation();
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get pickerButtonsDisabled() : boolean {
		if (!this.shift && !this.shifts?.length) return true;
		return false;
	}

	/**
	 * Handle click on one of the whish buttons
	 */
	public handleOnPick(
		$event : Event,
		whish : SchedulingApiShiftMemberPrefValue = 0,
	) : void {
		if (this.pickerButtonsDisabled) return;
		// this.collapsed = true;
		// this.onCollapseChanges.emit(this.collapsed);

		$event.preventDefault();
		$event.stopPropagation();

		if (this.shift) {
			this.shift.myPref = whish;
		} else if (this.shifts) {
			for (const shift of this.shifts.iterable()) {
				shift.myPref = whish;
			}
		}

		this.shifts!.setSelected(false);

		this.onPick.emit(whish);
		this.api.save();
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get myPref() : SchedulingApiShiftMemberPrefValue | null {
		if (this.shift) return this.shift.myPref;
		if (this.shifts) return this.shifts.myPref ?? null;
		return null;
	}

	private askForNotificationPermissionIfNecessary() : void {
		this.pPushNotificationsService.requestWebPushNotificationPermission(
			PRequestWebPushNotificationPermissionContext.CLOSED_UI_WISH_PICKER_MODE,
		);
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public stopMode() : void {
		if (this.api.isLoaded()) {
			this.api.data.shifts.setSelected(false);
		}
		if (Config.IS_MOBILE) {
			this.filterService.showOnlyWishPickerAssignmentProcesses(false);
		}
		this.schedulingService.wishPickerMode = false;
		this.triggerThankYouMessage();
		this.askForNotificationPermissionIfNecessary();
	}

	private triggerThankYouMessage() : void {
		let msg : string = this.localize.transform('Danke für deine Schichtwünsche.');
		if (this.pWishesService.freeWishesCount) {
			msg += `<br>${this.pWishesService.freeWishesCount}`;
			if (this.pWishesService.freeWishesCount === 1) {
				msg += ` ${this.localize.transform('Schichtwunsch ist noch offen.')}`;
			} else if (this.pWishesService.freeWishesCount > 1) {
				msg += ` ${this.localize.transform('Schichtwünsche sind noch offen.')}`;
			}
		}

		this.toastsService.addToast({
			content: msg,
			theme: this.pWishesService.freeWishesCount ? PThemeEnum.INFO : PThemeEnum.SUCCESS,
			visibleOnMobile: true,
		});
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get popoverForREMOVE() : PopoverDirective['popover'] {
		if (this.pickerButtonsDisabled) return this.localize.transform('Bitte erst Schichten auswählen');
		return this.localize.transform('Schichtwunsch entfernen');
	}
	// eslint-disable-next-line jsdoc/require-jsdoc
	public get popoverForWANT() : PopoverDirective['popover'] {
		if (this.pickerButtonsDisabled) return this.localize.transform('Bitte erst Schichten auswählen');
		return this.localize.transform('Möchte die Schicht');
	}
	// eslint-disable-next-line jsdoc/require-jsdoc
	public get popoverForCAN() : PopoverDirective['popover'] {
		if (this.pickerButtonsDisabled) return this.localize.transform('Bitte erst Schichten auswählen');
		return this.localize.transform('Wenn es sein muss');
	}
	// eslint-disable-next-line jsdoc/require-jsdoc
	public get popoverForCANNOT() : PopoverDirective['popover'] {
		if (this.pickerButtonsDisabled) return this.localize.transform('Bitte erst Schichten auswählen');
		return this.localize.transform('Kann nicht');
	}
}
