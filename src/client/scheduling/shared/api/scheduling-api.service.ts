/* NOTE: Dont make this file even bigger. Invest some time to cleanup/split into several files */
/* eslint max-lines: ["error", 2800] */
import * as $ from 'jquery';
import { HttpResponse } from '@angular/common/http';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, NgZone, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { CookieListOfDataWrappers, FilterService } from '@plano/client/shared/filter.service';
import { PMoment } from '@plano/client/shared/p-moment.service';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { SchedulingApiMessages, SchedulingApiShiftModelCancellationPolicy, SchedulingApiTransactions} from '@plano/shared/api';
import { SchedulingApiMemo } from '@plano/shared/api';
import { SchedulingApiShiftAssignableMember } from '@plano/shared/api';
import { SchedulingApiAccountingPeriodExpectedMemberDataItem } from '@plano/shared/api';
import { SchedulingApiRightGroupShiftModelRight } from '@plano/shared/api';
import { SchedulingApiShiftMemberPrefValue } from '@plano/shared/api';
import { ApiLoadArgs, ApiSaveArgs } from '@plano/shared/api';
import { SchedulingApiBookingState, SchedulingApiHolidayBase, SchedulingApiOnlineRefundInfo, SchedulingApiRightGroupsBase, SchedulingApiShiftRepetitionType, SchedulingApiVoucherBase, SchedulingApiVouchersBase } from '@plano/shared/api';
import { SchedulingApiHolidaysBase } from '@plano/shared/api';
import { SchedulingApiTodaysShiftDescriptionsBase } from '@plano/shared/api';
import { SchedulingApiTodaysShiftDescriptionBase } from '@plano/shared/api';
import { SchedulingApiAccountingPeriodsBase } from '@plano/shared/api';
import { SchedulingApiWarningSeverity } from '@plano/shared/api';
import { SchedulingApiShiftBase } from '@plano/shared/api';
import { SchedulingApiShiftsBase } from '@plano/shared/api';
import { SchedulingApiServiceBase } from '@plano/shared/api';
import { SchedulingApiAbsenceBase } from '@plano/shared/api';
import { SchedulingApiAbsencesBase } from '@plano/shared/api';
import { SchedulingApiAbsenceType } from '@plano/shared/api';
import { SchedulingApiMemberBase } from '@plano/shared/api';
import { SchedulingApiMembersBase } from '@plano/shared/api';
import { SchedulingApiMemosBase } from '@plano/shared/api';
import { SchedulingApiShiftModelBase } from '@plano/shared/api';
import { SchedulingApiShiftModelsBase } from '@plano/shared/api';
import { SchedulingApiRootBase } from '@plano/shared/api';
import { SchedulingApiMemberAssignableShiftModelBase } from '@plano/shared/api';
import { SchedulingApiMemberAssignableShiftModelsBase } from '@plano/shared/api';
import { SchedulingApiShiftModelAssignableMemberBase } from '@plano/shared/api';
import { SchedulingApiShiftModelAssignableMembersBase } from '@plano/shared/api';
import { SchedulingApiShiftAssignableMembersBase } from '@plano/shared/api';
import { SchedulingApiAssignmentProcessBase } from '@plano/shared/api';
import { SchedulingApiAssignmentProcessType } from '@plano/shared/api';
import { SchedulingApiAssignmentProcessState } from '@plano/shared/api';
import { SchedulingApiAssignmentProcessesBase } from '@plano/shared/api';
import { SchedulingApiAccountingPeriodBase } from '@plano/shared/api';
import { SchedulingApiAccountingPeriodExpectedMemberDataBase } from '@plano/shared/api';
import { SchedulingApiRightGroupShiftModelRightsBase } from '@plano/shared/api';
import { SchedulingApiRightGroupRole } from '@plano/shared/api';
import { SchedulingApiRightGroupBase } from '@plano/shared/api';
import { SchedulingApiShiftChangeSelectorBase } from '@plano/shared/api';
import { Meta } from '@plano/shared/api';
import { Id } from '@plano/shared/api/base/id';
import { Assertions } from '@plano/shared/core/assertions';
import { Config } from '@plano/shared/core/config';
import { Data } from '@plano/shared/core/data/data';
import { PDictionarySourceString } from '@plano/shared/core/pipe/localize.dictionary';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { SchedulingApiBookable } from './scheduling-api-bookable.service';
import { SchedulingApiShiftExchanges } from './scheduling-api-shift-exchange.service';
import { ISchedulingApiMember, ISchedulingApiShift, ISchedulingApiShiftModel } from './scheduling-api.interfaces';
import { PPaymentStatusEnum } from './scheduling-api.utils';
import { ApiErrorService } from '../../../../shared/api/api-error.service';
import { ApiAttributeInfo } from '../../../../shared/api/base/api-attribute-info';
import { PApiPrimitiveTypes } from '../../../../shared/api/base/generated-types.ag';
import { Currency} from '../../../../shared/api/base/generated-types.ag';
import { NOT_CHANGED } from '../../../../shared/api/base/object-diff';
import { assumeDefinedToGetStrictNullChecksRunning, assumeNonNull } from '../../../../shared/core/null-type-utils';
import { LocalizePipe } from '../../../../shared/core/pipe/localize.pipe';
import { PThemeEnum } from '../../../shared/bootstrap-styles.enum';
import { SchedulingFilterService } from '../../scheduling-filter.service';

@Injectable({
	providedIn: 'root',
})
export class SchedulingApiService<ValidationMode extends 'draft' | 'validated' = 'validated'> extends SchedulingApiServiceBase<ValidationMode> {
	constructor(
		http : HttpClient,
		router : Router,
		apiError : ApiErrorService,
		zone : NgZone,
		injector : Injector,
	) {
		super(http, router, apiError, zone, injector);
		this._injector = injector;
	}

	private _injector ! : Injector;

	private automaticWarningsUpdateForChanges : string[] | null = null;
	private updateWarningsTimeout : number | null = null;

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public enableAutomaticWarningsUpdateOnChange(forChanges : string[]) : void {
		this.automaticWarningsUpdateForChanges = forChanges;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public disableAutomaticWarningsUpdateOnChange() : void {
		this.automaticWarningsUpdateForChanges = null;
	}

	public override changed(change : string) : void {
		// automatic update enabled and we are supposed to update for current change?
		// eslint-disable-next-line sonarjs/no-collapsible-if
		if (	this.automaticWarningsUpdateForChanges?.includes(change)) {
			// update warnings lazy.
			// E.g. when several api changes happen at the same time
			// updateWarnings() should be called only once.
			if (!this.updateWarningsTimeout) {
				this.updateWarningsTimeout = window.setTimeout(() => {
					this.zone.run(() => {
						this.updateWarnings();
						this.updateWarningsTimeout = null;
					});
				});
			}
		}

		// super
		// Hack to improve text dialogs: we ignore comment properties changes so the
		// Data properties are not recalculated
		if (	change !== 'message' 	&&
		change !== 'description' 	&&
		change !== 'illnessResponderCommentToMembers' 	&&
		change !== 'indisposedMemberComment' 	&&
		change !== 'performActionComment') {
			super.changed(change);
		}
	}


	public override load({ success = undefined, error = undefined, searchParams = new HttpParams() } : ApiLoadArgs = {}) : Promise<HttpResponse<unknown>> {
		// if automaticWarningsUpdateOnChange is enabled then add current changes to search params
		if (this.automaticWarningsUpdateForChanges) {
			const currentChanges = this.dataStack.getDataToSave(null);


			if (currentChanges !== NOT_CHANGED) {

				if (!searchParams) {
					searchParams = new HttpParams();
				}

				searchParams = searchParams.set('warningsChanges', encodeURIComponent(JSON.stringify(currentChanges)));
			}
		}

		// super
		const promise = super.load(	{
			success : success ?? null,
			error : error ?? null,
			searchParams : searchParams,
		});

		// "warningsChanges" should only be send for this api call.
		if (this.automaticWarningsUpdateForChanges) {
			this.removeParamFromLastExecutedLoadSearchParams('warningsChanges');
		}

		return promise;
	}

	private runningUpdateWarningsApiCallCount = 0;

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public updateWarnings() : void {
		// no need to update something if no data is loaded

		if (!this.isLoaded() || !this.lastExecutedLoadSearchParams)
			return;

		// tell backend that we are only interested in warnings
		let searchParams = this.lastExecutedLoadSearchParams
			.set('onlyWarnings', 'true');

		// send current changes data to backend
		const currentChanges = this.dataStack.getDataToSave(null);


		if (currentChanges !== NOT_CHANGED) {
			searchParams = searchParams.set('warningsChanges', encodeURIComponent(JSON.stringify(currentChanges)));
		}

		// don’t show stale warnings
		this.data.warnings._updateRawData([], true);

		// execute
		++this.runningUpdateWarningsApiCallCount;

		this.http.get(this.apiUrl, this.getRequestOptions(searchParams)).subscribe(
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(response : HttpResponse<any>) => {
				--this.runningUpdateWarningsApiCallCount;

				// we expect to receive only warnings data.
				// So update them manually
				const newData = response.body;
				const warningsNewData = newData[this.consts.WARNINGS];
				this.data.warnings._updateRawData(warningsNewData, false);
			},
			(response : unknown) => {
				--this.runningUpdateWarningsApiCallCount;
				this.onError(null, response);
			});
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get isUpdatingWarnings() : boolean {
		return this.runningUpdateWarningsApiCallCount > 0;
	}

	/**
	 * One method to rule them all
	 */
	public deselectAllSelections() : void {
		this.data.shiftModels.selectedItems.setSelected(false);
		this.data.shifts.selectedItems.setSelected(false);
		this.data.shiftModels.setSelected(false);
		this.data.members.setSelected(false);
		this.data.assignmentProcesses.setSelected(false);
	}

	/**
	 * Check if anything is selected. No matter if the related shifts are in the current set of shifts.
	 */
	public get hasSelectedItems() : boolean {
		if (this.data.assignmentProcesses.hasSelectedItem) return true;
		if (this.data.shiftModels.hasSelectedItem) return true;
		if (this.data.shifts.hasSelectedItem) return true;
		if (this.data.members.hasSelectedItem) return true;
		return false;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get isSwitzerland() : boolean {
		// TODO: (PLANO-13753): Currently scheduling-api does not provide the country. So, we use this hack.
		if (this.data.possibleTaxes.length < 2) return false;
		return this.data.possibleTaxes.get(1) === 2.5;
	}


	public override save({
		success = null,
		error = null,
		additionalSearchParams = null,
		saveEmptyData = false,
		sendRootMetaOnEmptyData = false,
		onlySavePath,
	} : ApiSaveArgs = {}) : Promise<HttpResponse<unknown>> {
		// are we creating a new shift?
		const shifts = this.data.shifts;
		const shiftModels = this.data.shiftModels;

		for (const shift of shifts.iterable()) {
			if (!shift.isNewItem()) continue;

			// Then we don’t want to send all values of this shift to backend but only the once which
			// differ from the shift-model. To achieve this, we create a shift with the same new-item id which represents
			// all the values from the shift-model and add this to the data-source. So, the diff
			// will automatically find everything which got changed.

			const shiftWithShiftModelData = new SchedulingApiShift(this);
			const shiftMeta = $.extend(true, [], Meta.getMeta(shift.rawData));
			shiftWithShiftModelData._updateRawData([shiftMeta], true);

			const shiftModel = shiftModels.get(shift.shiftModelId);
			if (shiftModel === null) throw new Error('shiftModel to copy from could not be found');
			shiftWithShiftModelData.copyCommonValues(shiftModel);

			this.dataStack.getDataSource()![this.consts.SHIFTS].push(shiftWithShiftModelData.rawData);
		}

		// base
		return super.save(
			{
				success: (response, noChanges) => {
					this.showBackendMessageToasts(this.data.messages, noChanges);

					if (success)
						success(response, noChanges);
				},
				error: error,
				additionalSearchParams: additionalSearchParams,
				saveEmptyData: saveEmptyData,
				sendRootMetaOnEmptyData: sendRootMetaOnEmptyData,
				onlySavePath: onlySavePath ?? null,
			});
	}

	/**
	 * Shows toasts based on messages send from backend.
	 * @param messages Messages from backend.
	 */
	private showBackendMessageToasts(messages : SchedulingApiMessages, noChanges : boolean) : void {
		if (!messages.rawData)
			return;

		const localizePipe = this._injector.get<LocalizePipe>(LocalizePipe);

		// removedDuplicateReCaptchaWhiteListedHostName
		if (messages.removedDuplicateReCaptchaWhiteListedHostName) {
			this.toasts.addToast({
				content: localizePipe.transform('Die angegebene Domain war bereits vorhanden und wurde daher automatisch gelöscht.'),
				theme: PThemeEnum.WARNING,
				visibilityDuration: 'long',
			});
		}

		// onlineRefundInfo
		const onlineRefundInfo = messages.onlineRefundInfo;

		switch (onlineRefundInfo) {
			case SchedulingApiOnlineRefundInfo.ONLINE_REFUND_SUCCESSFUL:
				this.toasts.addToast({
					content: localizePipe.transform('Online-Rückerstattung erfolgreich veranlasst.<br>Das Geld sollte in wenigen Werktagen beim Kunden ankommen.'),
					theme: PThemeEnum.SUCCESS,
					visibilityDuration: 'long',
				});
				break;
			case SchedulingApiOnlineRefundInfo.ONLINE_REFUND_PARTIALLY:
				this.toasts.addToast({
					content: localizePipe.transform('Die Rückerstattung benötigte mehrere Teilzahlungen. Leider konnten nicht alle davon erfolgreich veranlasst werden. Für mehr Infos siehe »Zahlungen« in der Buchung.'),
					theme: PThemeEnum.DANGER,
					visibilityDuration: 'infinite',
				});
				break;
			case SchedulingApiOnlineRefundInfo.ONLINE_REFUND_FAILED:
				this.toasts.addToast({
					content: localizePipe.transform('Die Online-Rückerstattung konnte leider nicht veranlasst werden. Bitte versuche es etwas später erneut.'),
					theme: PThemeEnum.DANGER,
					visibilityDuration: 'infinite',
				});
				break;
			default:
				break;
		}

		// customBookableMailsInfo
		const customBookableMailsInfo = messages.customBookableMailsInfo;

		if (!noChanges && customBookableMailsInfo.eventTriggered) {
			// email was send?
			if (customBookableMailsInfo.emailSendToBookingPerson || customBookableMailsInfo.emailSendToParticipants) {
				let text : PDictionarySourceString;
				if (customBookableMailsInfo.emailSendToBookingPerson) {
					if (customBookableMailsInfo.emailSendToParticipants) {
						text = 'An buchende Person und Teilnehmende';
					} else {
						text = 'An buchende Person';
					}
				} else {
					text = 'An Teilnehmende';
				}

				this.toasts.addToast({
					title: this.localizePipe.transform('Email an Kunden verschickt'),
					content: this.localizePipe.transform(text),
					icon: PlanoFaIconPool.EMAIL_NOTIFICATION,
					theme: PThemeEnum.INFO,
				});
			} else {
				// Inform that no email was send
				const shiftModelId = customBookableMailsInfo.affectedShiftModelId;

				assumeDefinedToGetStrictNullChecksRunning(shiftModelId, 'shiftModelId');
				this.toasts.addToast({
					title: this.localizePipe.transform('Keine Email an Kunden verschickt'),
					// eslint-disable-next-line literal-blacklist/literal-blacklist
					content: this.localizePipe.transform('Entsprechend deiner <a href="client/shiftmodel/${shiftModelId}/bookingsettings#automatic-mails" target="_blank">Einstellungen</a> in der Tätigkeit.', {shiftModelId: shiftModelId.rawData}),
					icon: PlanoFaIconPool.EMAIL_NOTIFICATION,
					visibilityDuration: 'long',
					theme: PThemeEnum.WARNING,
				});
			}
		}
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get hasFatalApiWarning() : boolean {
		if (!this.isLoaded()) return false;
		if (this.isUpdatingWarnings) return false;
		assumeDefinedToGetStrictNullChecksRunning(this.data.warnings, 'data.warnings');
		const fatalApiWarnings = this.data.warnings.filterBy(item => {
			return item.severity === SchedulingApiWarningSeverity.FATAL;
		});
		if (!fatalApiWarnings.length) return false;
		return true;
	}
}

export class SchedulingApiRoot<ValidationMode extends 'draft' | 'validated' = 'validated'> extends SchedulingApiRootBase<ValidationMode> {

	constructor( api : SchedulingApiServiceBase<ValidationMode> | null ) {
		super(api);
	}
}

export class SchedulingApiHoliday<ValidationMode extends 'draft' | 'validated' = 'validated'> extends SchedulingApiHolidayBase<ValidationMode> {
	public isHovered : boolean = false;

	constructor( api : SchedulingApiServiceBase | null ) {
		super(api);
	}
}

export class SchedulingApiHolidays<ValidationMode extends 'draft' | 'validated' = 'validated'> extends SchedulingApiHolidaysBase<ValidationMode> {
	constructor(
		api : SchedulingApiServiceBase | null,
		removeDestroyedItems : boolean,
	) {
		super(api, removeDestroyedItems);
	}

	/**
	 * get absences of day
	 * This includes al absences that start at, end at oder happen during the provided day.
	 * @param day - timestamp of the desired day
	 */
	public getByDay(dayStart : number) : SchedulingApiHolidays {
		Assertions.ensureIsDayStart(dayStart);

		const dayEnd = +(new PMomentService(Config.LOCALE_ID).m(dayStart).add(1, 'day'));
		Assertions.ensureIsDayStart(dayEnd);

		return this.filterBy(item => {
			if (dayStart >= item.time.end) return false;
			if (dayEnd <= item.time.start) return false;
			return true;
		});
	}

	/**
	 * Filters a list of Shifts by a function that returns a boolean.
	 * Returns a new list of Shifts.
	 */
	public filterBy( fn : (item : SchedulingApiHoliday) => boolean ) : SchedulingApiHolidays {
		const result = new SchedulingApiHolidays(this.api, false);
		for (const item of this.iterable()) {
			if (!fn(item)) continue;
			result.push(item);
		}
		return result;
	}
}

export class SchedulingApiAbsence<ValidationMode extends 'draft' | 'validated' = 'validated'> extends SchedulingApiAbsenceBase<ValidationMode> {
	public isHovered : boolean = false;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	constructor( api : SchedulingApiServiceBase | null, idRaw : any = 0 ) {
		super(api, idRaw);
	}

	/**
	 * Get the type as human readable string
	 */
	public get title() : PDictionarySourceString | null {
		switch (this.type) {
			case SchedulingApiAbsenceType.ILLNESS :
				return 'Krankheit';
			case SchedulingApiAbsenceType.VACATION :
				return 'Urlaub';
			case SchedulingApiAbsenceType.OTHER :
				return 'Sonstiges';
			default :
				return null;
		}
	}

	/**
	 * Get a icon name for the type
	 */
	public get typeIconName() : (
		typeof PlanoFaIconPool.ITEMS_ABSENCE_ILLNESS | typeof PlanoFaIconPool.ITEMS_ABSENCE_VACATION | typeof PlanoFaIconPool.MORE_ACTIONS | null
	) {
		switch (this.type) {
			case SchedulingApiAbsenceType.ILLNESS :
				return PlanoFaIconPool.ITEMS_ABSENCE_ILLNESS;
			case SchedulingApiAbsenceType.VACATION :
				return PlanoFaIconPool.ITEMS_ABSENCE_VACATION;
			case SchedulingApiAbsenceType.OTHER :
				return PlanoFaIconPool.MORE_ACTIONS;
			default :
				return null;
		}
	}

	/**
	 * Payroll duration
	 */
	public get duration() : number {
		let result : number;
		assumeDefinedToGetStrictNullChecksRunning(this.workingTimePerDay, 'workingTimePerDay');
		if (this.workingTimePerDay > -1) {
			result = this.workingTimePerDay * this.totalDays;
		} else {
			result = this.time.end - this.time.start;
		}
		return result;
	}

	/**
	 * Partial payroll duration for absence
	 */
	public durationBetween(min ?: number, max ?: number) : number {
		if (!this.workingTimePerDay) return 0; // Not sure if this is correct. Just re-implemented pre-null-check-behaviour
		if (this.workingTimePerDay > -1) return this.workingTimePerDay * this.totalDaysBetween(min, max);

		const START = (min && min > this.time.start) ? min : this.time.start;
		const END = (max && max < this.time.end) ? max : this.time.end;
		const duration = END - START;
		if (duration < 0) return 0;
		return duration;
	}

	/**
	 * Get calculated total payroll duration in hours as float
	 */
	private get totalDurationInHours() : number {
		const pMoment = new PMomentService();
		assumeDefinedToGetStrictNullChecksRunning(this.workingTimePerDay, 'workingTimePerDay');
		if (this.workingTimePerDay > -1) {
			return pMoment.duration(this.workingTimePerDay).asHours() *
			this.totalDays;
		}
		return pMoment.duration(this.duration).asHours();
	}

	/**
	 * Get calculated total earnings of a absence entry
	 */
	public get totalEarnings() : number {
		let result : number;
		if (!this.hourlyEarnings) {
			result = 0;
		} else {
			result = this.hourlyEarnings * this.totalDurationInHours;
		}
		return result;
	}

	/**
	 * Get calculated total earnings of a absence entry between two timestamps
	 */
	public totalEarningsBetween(min ?: number, max ?: number) : number | null {
		const partialDuration = this.durationBetween(min, max);
		const pMoment = new PMomentService(undefined);
		if (this.hourlyEarnings === null) return 0;
		return this.hourlyEarnings * pMoment.duration(partialDuration).asHours();
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get totalDays() : number {
		return this.totalDaysBetween(this.time.start, this.time.end);
	}

	/**
	 * Partial total days between two timestamps
	 */
	public totalDaysBetween(min ?: number, max ?: number) : number {
		if (!this.time.rawData) throw new Error('SchedulingApiAbsence.time is not defined [PLANO-19822]');
		const START = (min && min > this.time.start) ? min : this.time.start;
		const END = (max && max < this.time.end) ? max : this.time.end;

		const pMoment = new PMomentService(Config.LOCALE_ID);
		const startMoment = pMoment.m(END);
		const endMoment = pMoment.m(START);

		const days = startMoment.diff(endMoment, 'days', true);

		if (days < 0) return 0;

		return Math.round(days * 100) / 100;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get isFullDay() : boolean {
		if (this.workingTimePerDay === null) return true; // Not sure if this is correct. Just re-implemented pre-null-check-behaviour
		return this.workingTimePerDay > -1;
	}
}

export class SchedulingApiAbsences<ValidationMode extends 'draft' | 'validated' = 'validated'> extends SchedulingApiAbsencesBase<ValidationMode> {
	constructor(
		api : SchedulingApiServiceBase | null,
		removeDestroyedItems : boolean,
	) {
		super(api, removeDestroyedItems);
	}

	/**
	 * Filters a list of Shifts by a function that returns a boolean.
	 * Returns a new list of Shifts.
	 */
	public filterBy( fn : (item : SchedulingApiAbsence) => boolean ) : SchedulingApiAbsences {
		const result = new SchedulingApiAbsences(this.api, false);
		for (const item of this.iterable()) {
			if (!fn(item)) continue;
			result.push(item);
		}
		return result;
	}

	/**
	 * get absences of day
	 * This includes al absences that start at, end at oder happen during the provided day.
	 * @param day - timestamp of the desired day
	 */
	public getByDay(dayStart : number) : SchedulingApiAbsences {
		Assertions.ensureIsDayStart(dayStart);

		const dayEnd = +(new PMomentService(Config.LOCALE_ID).m(dayStart).add(1, 'day'));
		Assertions.ensureIsDayStart(dayEnd);

		return this.filterBy(item => {
			if (dayStart >= item.time.end) { return false; }
			if (dayEnd <= item.time.start) { return false; }
			return true;
		});
	}

	/**
	 * Get sum of total earnings of all contained absences
	 */
	public get totalEarnings() : number {
		let result : number = 0;
		for (const absence of this.iterable()) {
			result += absence.totalEarnings;
		}
		return result;
	}

	/**
	 * Get sum of partial earnings of all contained absences
	 */
	public totalEarningsBetween(min ?: number, max ?: number) : number {
		let result : number = 0;
		for (const absence of this.iterable()) {
			const totalEarnings = absence.totalEarningsBetween(min, max);
			assumeNonNull(totalEarnings, 'totalEarnings');
			result += totalEarnings;
		}
		return result;
	}

	/**
	 * Sum of payroll durations
	 */
	public get duration() : number {
		let result : number = 0;
		for (const absence of this.iterable()) {
			result += absence.duration;
		}
		return result;
	}

	/**
	 * Sum of partial payroll durations
	 */
	public durationBetween(min ?: number, max ?: number) : number {
		let result : number = 0;
		for (const absence of this.iterable()) {
			result += absence.durationBetween(min, max);
		}
		return result;
	}

	/**
	 * Get absences by Member in a new ListWrapper
	 */
	public getByMember( member : SchedulingApiMember ) : SchedulingApiAbsences {
		return this.filterBy(item => {
			if (!item.memberId.equals(member.id)) return false;
			return true;
		});
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get commentAmount() : number {
		return this.filterBy(item => !!item.ownerComment?.length).length;
	}
}

export class SchedulingApiMembers<ValidationMode extends 'draft' | 'validated' = 'validated'> extends SchedulingApiMembersBase<ValidationMode> {
	private _selectedItems : SchedulingApiMembers | null = null;
	constructor(
		api : SchedulingApiServiceBase | null,
		removeDestroyedItems : boolean,
	) {
		super(api, removeDestroyedItems);
	}

	/**
	 * get members with same birthday as day
	 * This includes al absences that start at, end at oder happen during the provided day.
	 * @param day - timestamp of the desired day
	 */
	public getByBirthday(dayStart : number) : SchedulingApiMembers {
		Assertions.ensureIsDayStart(dayStart);

		const dayEnd = +(new PMomentService(Config.LOCALE_ID).m(dayStart).startOf('day').add(1, 'day'));
		Assertions.ensureIsDayStart(dayEnd);

		return this.filterBy(item => {
			const tempMoment = new PMomentService(Config.LOCALE_ID).m(item.birthday);
			const birthdayDay = tempMoment.get('date');
			const birthdayMonth = tempMoment.get('month');
			const birthday = new PMomentService(Config.LOCALE_ID).m().set('month', birthdayMonth).set('date', birthdayDay).startOf('day');
			const itemTimestampForCurrentYear = +birthday;
			return dayStart === itemTimestampForCurrentYear;
		});
	}


	/**
	 * Set all items to the given value.
	 * value is true by default.
	 */
	public setSelected(value : boolean = true) : void {
		for (const shift of this.iterable()) {
			shift.selected = value;
		}
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public containsAll( members : SchedulingApiMembers ) : boolean {
		let result = true;
		for (const member of members.iterable()) {
			if (!this.contains(member)) {
				result = false;
			}
		}
		return result;
	}

	/**
	 * Check if at least one item of this list is selected
	 */
	public get hasSelectedItem() : boolean {
		return this.some(item => item.selected);
	}

	/**
	 * Get all selected Items as a new SchedulingApiMembers().
	 */
	public get selectedItems() : SchedulingApiMembers {
		if (this._selectedItems === null) {
			this._selectedItems = new SchedulingApiMembers(this.api, false);
		}
		this._selectedItems.clear();
		const result = this._selectedItems;
		for (const item of this.iterable()) {
			if (item.selected) {
				result.push(item);
			}
		}
		return result;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public updateSelectedStates() : void {
		for (const item of this.iterable()) {
			item.updateSelectedState();
		}
	}

	/**
	 * Check if there is at least one untrashed item
	 */
	public get hasUntrashedItem() : boolean {
		return this.some(item => !item.trashed);
	}

	/**
	 * Filters a list of Members by a function that returns a boolean.
	 * Returns a new list of Members.
	 */
	public filterBy( fn : (item : SchedulingApiMember) => boolean ) : SchedulingApiMembers {
		const result = new SchedulingApiMembers(this.api, false);
		for (const item of this.iterable()) {
			if (!fn(item)) continue;
			result.push(item);
		}
		return result;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public search(input : Parameters<SchedulingApiMember['fitsSearch']>[0]) : SchedulingApiMembers {
		if (input === '') return this;
		return this.filterBy(item => item.fitsSearch(input));
	}
}

export class SchedulingApiShiftChangeSelector<ValidationMode extends 'draft' | 'validated' = 'validated'> extends SchedulingApiShiftChangeSelectorBase<ValidationMode> {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	constructor( api : SchedulingApiServiceBase | null, idRaw ?: any ) {
		super(api, idRaw);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get isChangingShifts() : boolean {
		return 	!!this.shiftsOfShiftModelId	||
			!!this.shiftsOfSeriesId	||
			!!this.shiftsOfPacketIndex	||
			!!this.start	||
			!!this.end;
	}
}

export class SchedulingApiShift<ValidationMode extends 'draft' | 'validated' = 'validated'> extends SchedulingApiShiftBase<ValidationMode> implements ISchedulingApiShift {
	private selectedState : boolean = false;
	public wiggle : boolean = false;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	constructor( api : SchedulingApiServiceBase | null, idRaw ?: any ) {
		super(api, idRaw);
	}

	/**
	 * Does this shift belong to a packet?
	 * Note that this also returns false, if all other related shifts have been deleted.
	 */
	public get isPacket() : boolean | null {
		if (this.isNewItem()) {
			if (!this.repetition.rawData) return null;
			return this.repetition.packetRepetition.type !== SchedulingApiShiftRepetitionType.NONE;
		}

		return !!this.packetShifts.length;
	}

	/**
	 * does the item overlap with interval?
	 */
	public overlaps(min : number, max : number) : boolean {
		const intervalIsBefore = max <= this.start;
		const intervalIsAfter = min >= this.end;
		return !intervalIsBefore && !intervalIsAfter;
	}

	private _shiftExchanges = new Data<SchedulingApiShiftExchanges>(this.api);
	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get shiftExchanges() : SchedulingApiShiftExchanges {
		return this._shiftExchanges.get(() => {
			assumeDefinedToGetStrictNullChecksRunning(this.api, 'api');
			return this.api.data.shiftExchanges.filterBy(item => item.shiftRefs.contains(this.id));
		});
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get selected() : boolean {
		return this.selectedState;
	}
	public set selected( state : boolean ) {
		this.selectedState = state;
		if (state) return;

		this.wiggle = false;

		assumeDefinedToGetStrictNullChecksRunning(this.api, 'api');
		this.api.data.members.selectedItems.updateSelectedStates();
		this.api.data.shiftModels.selectedItems.updateSelectedStates();
		this.api.data.assignmentProcesses.selectedItems.updateSelectedStates();
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get isCourseFullyBooked() : boolean {
		assumeDefinedToGetStrictNullChecksRunning(this.model, 'model');
		if (this.currentCourseParticipantCount > 0 && this.model.onlyWholeCourseBookable) return true;

		const maxParticipantCount = this.maxCourseParticipantCount;
		if (maxParticipantCount && this.currentCourseParticipantCount >= maxParticipantCount) return true;

		return false;
	}

	private _model : Data<SchedulingApiShiftModel | null> = new Data<SchedulingApiShiftModel>(this.api);

	/**
	 * shorthand that returns the related model
	 */
	public get model() : SchedulingApiShiftModel {
		// NOTE: This methods exists on multiple classes:
		// TimeStampApiShift
		// SchedulingApiShift
		// SchedulingApiBooking
		// SchedulingApiTodaysShiftDescription
		const SHIFT_MODEL = this._model.get(() => {
			assumeDefinedToGetStrictNullChecksRunning(this.api, 'api');
			return this.api.data.shiftModels.get(this.shiftModelId);
		});
		assumeNonNull(SHIFT_MODEL, 'SHIFT_MODEL');

		return SHIFT_MODEL;
	}

	/**
	 * shorthand that returns the related model.color
	 */
	public get color() : SchedulingApiShiftModel['color'] {
		return this.model.color;
	}

	/**
	 * Get the name based on the linked shiftModel
	 */
	public get name() : SchedulingApiShiftModel['name'] {
		// NOTE: This methods exists on multiple classes:
		// SchedulingApiRoot
		// TimeStampApiRoot
		if (!this.model.rawData) throw new Error('Can not get shift name. ShiftModel is lost [PLANO-FE-2TT]');
		return this.model.name;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get isCourse() : SchedulingApiShiftModel['isCourse'] {
		return this.model.isCourse;
	}

	private _assignmentProcess = new Data<SchedulingApiAssignmentProcess | null>(this.api);

	/**
	 * @returns Returns the assignment process to which this shift currently belongs. "null" is returned if none exists.
	 * Note that a shift can be part of maximal one process at the same time.
	 */
	public get assignmentProcess() : SchedulingApiAssignmentProcess | null {
		return this._assignmentProcess.get(() => {
			assumeNonNull(this.api, 'this.api', 'Api must be defined to get assignmentProcesses');

			for (const assignmentProcess of this.api.data.assignmentProcesses.iterable()) {
				if (assignmentProcess.shiftRefs.contains(this.id)) return assignmentProcess;
			}

			return null;
		});
	}

	/**
	 * A readonly getter for Members that are assigned.
	 * returns a new instance of SchedulingApiMembers.
	 */
	public get assignedMembers() : SchedulingApiMembers {
		const members = new SchedulingApiMembers(this.api, false);

		for (const memberId of this.assignedMemberIds.iterable()) {
			assumeNonNull(this.api, 'this.api', 'Api must be defined to get members');
			const member = this.api.data.members.get(memberId);
			if (!member) throw new Error('Could not find assigned member');
			members.push(member);
		}

		// FIXME: (PLANO-7458)
		// https://drplano.atlassian.net/browse/PLANO-7458

		members.push = () => {
			throw new Error('assignedMembers is readonly');
		};
		members.remove = () => {
			throw new Error('assignedMembers is readonly');
		};

		return members;
	}

	/**
	 * Calculate how many members can be assigned till this shift is saturated
	 */
	public get emptyMemberSlots() : number {
		let result : number;
		if (!this.rawData) throw new Error('Cannot get emptyMemberSlots. Shift is lost [PLANO-FE-S6]');
		const amountOfEmptyBadges = this.neededMembersCount - this.assignedMemberIds.length;
		if (amountOfEmptyBadges >= 0) {
			result = amountOfEmptyBadges;
		} else {
			result = 0;
		}
		return result;
	}

	/**
	 * Check if shift is created by given shiftModel
	 * or
	 * Check if given member is assigned to shift
	 * or
	 * Check if shift is part of given assignmentProcess
	 */
	public relatesTo( item : SchedulingApiShiftModel | SchedulingApiMember | SchedulingApiAssignmentProcess ) : boolean {
		let result = false;
		if (item instanceof SchedulingApiMember) {
			for (const id of this.assignedMemberIds.iterable()) {
				if (id.equals(item.id)) {
					result = true;
				}
			}
		} else if (item instanceof SchedulingApiShiftModel) {
			if (this.shiftModelId.equals(item.id)) {
				result = true;
			}
		} else if (item.shiftRefs.get(this.id) !== null) {
			result = true;
		}
		return result;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public animateShift() : void {
		this.wiggle = true;
	}

	/**
	 * Copies all values from given shift model which are shared by shift instances. Note that this method is also used
	 * for the diff-process when creating a new shift to decide which values are send to backend.
	 */
	public copyCommonValues(shiftModel : SchedulingApiShiftModel) : void {
		this.time.start = shiftModel.time.start;
		this.time.end = shiftModel.time.end;
		this.description = shiftModel.description;

		this.neededMembersCountConf.neededMembersCount = shiftModel.neededMembersCountConf.neededMembersCount;
		this.neededMembersCountConf.perXParticipants = shiftModel.neededMembersCountConf.perXParticipants;
		this.neededMembersCountConf.isZeroNotReachedMinParticipantsCount = (
			shiftModel.neededMembersCountConf.isZeroNotReachedMinParticipantsCount
		);

		const assignableMembersCopy = this.copyRawData(shiftModel.assignableMembers.rawData);
		assumeDefinedToGetStrictNullChecksRunning(this.api, 'api');
		this.rawData[this.api.consts.SHIFT_ASSIGNABLE_MEMBERS] = assignableMembersCopy;
		this.assignableMembers._updateRawData(assignableMembersCopy, false);

		const assignedMemberIdsCopy = this.copyRawData(shiftModel.assignedMemberIds.rawData);
		this.rawData[this.api.consts.SHIFT_ASSIGNED_MEMBER_IDS] = assignedMemberIdsCopy;
		this.assignedMemberIds._updateRawData(assignedMemberIdsCopy, false);

		const repetitionCopy = this.copyRawData(shiftModel.repetition.rawData);
		this.rawData[this.api.consts.SHIFT_REPETITION] = repetitionCopy;
		this.repetition._updateRawData(repetitionCopy, false);
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private copyRawData(rawData : any[]) : any[] {
		return $.extend(true, [], rawData);
	}
}

export class SchedulingApiShifts<ValidationMode extends 'draft' | 'validated' = 'validated'> extends SchedulingApiShiftsBase<ValidationMode> {
	constructor(
		api : SchedulingApiServiceBase | null,
		removeDestroyedItems : boolean,
	) {
		super(api, removeDestroyedItems);
	}

	/**
	 * get shifts between two timestamps
	 * Does not return shifts that start or end outside the defined min and max – therefore use .overlaps(min, max).
	 * @param start - Start date in milliseconds
	 * @param end - End date in milliseconds
	 */
	public between(min : number, max : number) : SchedulingApiShifts {
		return this.filterBy((shift : SchedulingApiShift) => {
			if (!shift.rawData) throw new Error('Shift is lost');
			return min <= shift.start && max > shift.start;
		});
	}

	/**
	 * get shifts that overlaps with provided shifts
	 */
	public getOverlappingShifts(shifts : SchedulingApiShifts | null) : SchedulingApiShifts {
		const result : SchedulingApiShifts = new SchedulingApiShifts(this.api, false);
		if (!shifts) return result;
		if (!(shifts instanceof SchedulingApiShifts)) return result;

		return this.filterBy(item => this.overlaps(item.start, item.end));
	}

	/**
	 * check if shifts overlap with interval
	 * @param min - start of interval in milliseconds
	 * @param max - start of interval in milliseconds
	 */
	public overlaps(min : number, max : number) : boolean {
		return !!this.findBy((item : SchedulingApiShift) => item.overlaps(min, max));
	}


	/**
	 * get shifts of day
	 * @param timestamp - timestamp of the desired day
	 */
	public getByDay(dayStart : number) : SchedulingApiShifts {
		Assertions.ensureIsDayStart(dayStart);

		const dayEnd = +(new PMomentService(Config.LOCALE_ID).m(dayStart).add(1, 'day'));
		// Some experiments that can be removed if not used
		// const offsetStart = new PMomentService(Config.LOCALE_ID).m(dayStart).utcOffset();
		// const offsetEnd = new PMomentService(Config.LOCALE_ID).m(dayEnd).utcOffset();
		// const offsetDiffMinutes = offsetStart - offsetEnd;
		// if (offsetDiffMinutes) dayEnd = dayEnd + (offsetDiffMinutes * 60 * 1000);
		Assertions.ensureIsDayStart(dayEnd);

		return this.between(dayStart, dayEnd);
	}

	/**
	 * Toggles selection state of given item.
	 * Returns if has toggled to true or to false.
	 */
	public toggleSelectionByItem(
		item : SchedulingApiShiftModel | SchedulingApiMember | SchedulingApiAssignmentProcess,
	) : boolean {
		if (item.selected) {
			for (const shift of this.selectedItems.iterable()) {
				if (shift.relatesTo(item)) {
					shift.selected = false;
				}
			}
			item.selected = false;
			return false;
		} else {
			for (const shift of this.iterable()) {
				if (shift.relatesTo(item)) {
					shift.animateShift();
					shift.selected = true;
				}
			}
			item.selected = true;
			return true;
		}
	}

	/**
	 * Check if at least one item of this list is selected
	 */
	public get hasSelectedItem() : boolean {
		return this.some(item => item.selected);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get selectedItems() : SchedulingApiShifts {
		return this.filterBy(item => item.selected);
	}

	/**
	 * Set the .selected property of each shift, animate each shift if necessary
	 * @return Has something been changed?
	 */
	public setSelected(value : boolean = true) : boolean {
		let hasChanges = false;
		for (const shift of this.iterable()) {
			if (shift.selected === value) continue;

			shift.selected = value;
			if (shift.selected) shift.animateShift();
			hasChanges = true;
		}
		return hasChanges;
	}

	/**
	 * Filters a list of Shifts by a function that returns a boolean.
	 * Returns a new list of Shifts.
	 */
	public filterBy( fn : (shift : SchedulingApiShift) => boolean ) : SchedulingApiShifts {
		const result = new SchedulingApiShifts(this.api, false);
		for (const item of this.iterable()) {
			if (!fn(item)) continue;
			result.push(item);
		}
		return result;
	}

	/**
	 * Get pref if all items have the same pref
	 */
	public get myPref() : SchedulingApiShiftMemberPrefValue | null {
		if (!this.length) return null;

		const firstItem = this.get(0);
		if (firstItem === null) throw new Error('Could not get first item');
		const pref = firstItem.myPref;
		for (const shift of this.iterable()) {
			if (shift.myPref !== pref) return null;
		}
		return pref;
	}

	/**
	 * Hides the Shifts that are related to the provided list of ShiftModels.
	 */
	public withoutShiftModels(shiftModels : CookieListOfDataWrappers<SchedulingApiShiftModel>) : SchedulingApiShifts {
		if (!shiftModels.length) {
			return this;
		} else {
			return this.filterBy(shift => {
				return !shiftModels.contains(shift.shiftModelId);
			});
		}
	}

	private matchesAllMembersOfShift(
		shift : SchedulingApiShift,
		members : CookieListOfDataWrappers<SchedulingApiMember>,
	) : boolean {
		let matchesAllMembers = true;
		for (const assignedMemberId of shift.assignedMemberIds.iterable()) {
			if (!members.contains(assignedMemberId)) {
				matchesAllMembers = false;
			}
		}
		return matchesAllMembers;

	}

	/**
	 * Hides the Shifts that are related to the provided list of ShiftModels.
	 */
	public withoutAssignedMembers(
		members : CookieListOfDataWrappers<SchedulingApiMember>,
		options : SchedulingFilterService | null,
	) : SchedulingApiShifts {

		const isVisible = (shift : SchedulingApiShift) : boolean => {
			const hasEmptySlots = !!shift.emptyMemberSlots;
			const hasNoMembers = !shift.assignedMemberIds.length;

			if (options?.hideAllShiftsFromOthers && shift.neededMembersCount === 0) {
				return false;
			}

			return (
				(!!options && options.showItemsWithEmptyMemberSlot && hasEmptySlots) ||
				(!hasEmptySlots && hasNoMembers) ||
				!this.matchesAllMembersOfShift(shift, members)
			);
		};
		const result = new SchedulingApiShifts(this.api, false);
		for (const shift of this.iterable()) {
			if ( isVisible(shift) ) {
				result.push(shift);
			}
		}
		return result;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public filterByAssignmentProcess(
		assignmentProcess : SchedulingApiAssignmentProcess,
		// filterService : FilterService
	) : SchedulingApiShifts {
		// if (filter && filterService.isOnlyEarlyBirdAssignmentProcesses) {
		// 	return false;
		// }

		const result = new SchedulingApiShifts(this.api, false);
		for (const shiftIdObj of assignmentProcess.shiftRefs.iterable()) {
			const shift = this.get(shiftIdObj.id);
			if (shift) {
				result.push(shift);
			}
		}
		return result;
	}

	/**
	 * Get a list of all shifts where a given shiftModel was used as template
	 * or where a given member is assigned.
	 */
	public getItemsRelatedTo( filterItem : SchedulingApiShiftModel | SchedulingApiMember ) : SchedulingApiShifts {
		let result : SchedulingApiShifts = new SchedulingApiShifts(this.api, false);
		if (filterItem instanceof SchedulingApiShiftModel) {
			result = this.filterBy(shift => shift.shiftModelId.equals(filterItem.id));
		} else if (filterItem instanceof SchedulingApiMember) {
			result = this.filterBy(item => item.assignedMemberIds.contains(filterItem.id));
		}
		return result;
	}

	/**
	 * Filters a list of Shifts by multiple filter settings in a filterService.
	 * @param filterService : FilterService
	 */
	public filterByFilterService( filterService : FilterService ) : SchedulingApiShifts {
		// TODO: This should be replaced by
		// this.api.data.shifts.filterBy((item) => this.filterService.isVisible(item));
		let result : SchedulingApiShifts;
		if (filterService.isSetToShowAll) {
			// eslint-disable-next-line unicorn/no-this-assignment, @typescript-eslint/no-this-alias
			result = this;
		} else {
			// eslint-disable-next-line unicorn/no-this-assignment, @typescript-eslint/no-this-alias
			result = this;
			result = result.withoutShiftModels(filterService.hiddenItems['shiftModels']);
			result = result.withoutAssignedMembers(filterService.hiddenItems['members'], filterService.schedulingFilterService);
			result = result.filterBy(item => {

				// If no filter active - nothing to do
				if (
					!(
						filterService.isOnlyEarlyBirdAssignmentProcesses ||
						filterService.isOnlyWishPickerAssignmentProcesses
					)
				) {
					return true;
				}

				// If filter active and shift has no assignmentProcess - bad.
				if (!item.assignmentProcess) {
					return false;
				}

				if (filterService.isOnlyEarlyBirdAssignmentProcesses &&
					item.assignmentProcess.state === SchedulingApiAssignmentProcessState.EARLY_BIRD_SCHEDULING &&
					item.assignmentProcess.type === SchedulingApiAssignmentProcessType.EARLY_BIRD
				) {
					return true;
				}
				if (filterService.isOnlyWishPickerAssignmentProcesses &&
					item.assignmentProcess.state === SchedulingApiAssignmentProcessState.ASKING_MEMBER_PREFERENCES
				) {
					return true;
				}
				return false;

			});
		}
		return result;
	}


	public override createNewItem() : SchedulingApiShift {
		throw new Error('Please use createNewShift() instead.');
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public createNewShift(
		shiftModel : SchedulingApiShiftModel,
		seriesStart : PMoment.Moment,
		searchParams : HttpParams | null = null,
		success ?: (newShift : SchedulingApiShift) => void) : Promise<SchedulingApiShift> {

		return new Promise((resolve, reject) => {
			shiftModel.loadDetailed({
				success: () => {
					const newShift = super.createNewItem();
					newShift.shiftModelId = shiftModel.id;
					newShift.start = seriesStart.valueOf();

					newShift.copyCommonValues(shiftModel);

					if (success)
						success(newShift);

					resolve(newShift);
				},
				error: reject,
				searchParams : searchParams,
			});
		});
		// a new shift is partly a copy of the shift-model. So we must first get all the data of the shift-model

	}
}

export type PParentName = string;

export class SchedulingApiShiftModel<ValidationMode extends 'draft' | 'validated' = 'validated'> extends SchedulingApiShiftModelBase<ValidationMode> implements ISchedulingApiShiftModel {
	private selectedState : boolean = false;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	constructor( api : SchedulingApiServiceBase | null, idRaw ?: any ) {
		super(api, idRaw);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public fitsSearch(term : string | null) : boolean {
		if (term === null) return true;
		if (term === '') return true;
		for (const termItem of term.split(' ')) {
			const termLow = termItem.toLowerCase();
			const nameLow = this.name.toLowerCase();
			const parentNameLow = this.parentName.toLowerCase();
			if (nameLow.includes(termLow)) continue;
			if (parentNameLow.includes(termLow)) continue;
			return false;
		}
		return true;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get isFreeCourse() : boolean {
		for (const tariff of this.courseTariffs.iterable()) {
			if (tariff.trashed) continue;
			if (tariff.isInternal) continue;
			return false;
		}
		return true;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get isPacket() : boolean | undefined {
		if (!this.repetition.rawData) return undefined;
		return this.repetition.packetRepetition.type !== SchedulingApiShiftRepetitionType.NONE;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get affected() : boolean {
		if (this.selected) return false;

		assumeDefinedToGetStrictNullChecksRunning(this.api, 'api');
		for (const shift of this.api.data.shifts.selectedItems.iterable()) {
			if (shift.relatesTo(this)) {
				return true;
			}
		}
		return false;
	}

	/** @see ApiDataWrapperBase['_updateRawData'] */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public override _updateRawData(data : any[], generateMissingData : boolean) : void {
		super._updateRawData(data, generateMissingData);

		// A new shift-model must have a cancellation-policy. So, we create it.
		if (this.isNewItem() && this.cancellationPolicies.length === 0) {
			const cancellationPolicy = this.cancellationPolicies.createNewItem();
			this.currentCancellationPolicyIdTestSetter = cancellationPolicy.id;
		}
	}


	public override copy() : SchedulingApiShiftModel {
		// copy
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const copy = super.copy((data : any[]) => {
			// don’t use ids of shift-model assignable members for id replacement as they use member ids
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const dontAddToIdReplacementList : any[] = [];

			assumeDefinedToGetStrictNullChecksRunning(this.api, 'api');
			const assignableMembersRawData = data[this.api.consts.SHIFT_MODEL_ASSIGNABLE_MEMBERS];
			for (let i = 1; i < assignableMembersRawData.length; ++i)
				dontAddToIdReplacementList.push(assignableMembersRawData[i]);

			return dontAddToIdReplacementList;
		});

		// When copying a shift-model we don’t need the trashed tariffs/payment-methods anymore
		// as they are only referenced by the bookings of the source shift-model.
		for (let i = copy.coursePaymentMethods.length - 1; i >= 0; --i) {
			const coursePaymentMethod = copy.coursePaymentMethods.get(i);
			if (!coursePaymentMethod) throw new Error('Could not get paymentMethod');
			if (coursePaymentMethod.trashed)
				copy.coursePaymentMethods.remove(i);
		}

		for (let i = copy.courseTariffs.length - 1; i >= 0; --i) {
			const courseTariff = copy.courseTariffs.get(i);
			if (!courseTariff) throw new Error('Could not get tariff');
			if (courseTariff.trashed)
				copy.courseTariffs.remove(i);
		}

		return copy;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get selected() : boolean {
		return this.selectedState;
	}
	public set selected( state : boolean ) {
		this.selectedState = state;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public updateSelectedState() : void {
		assumeDefinedToGetStrictNullChecksRunning(this.api, 'api');
		const relatedShifts = this.api.data.shifts.filterBy(item => item.shiftModelId.equals(this.id));
		if (!relatedShifts.length || relatedShifts.length !== relatedShifts.selectedItems.length) {
			this.selectedState = false;
		}
	}

	/**
	 * @returns The current cancellation policy which should be shown in the shift-model and which will be used
	 * for future bookings.
	 */
	public get currentCancellationPolicy() : SchedulingApiShiftModelCancellationPolicy | null {
		return this.cancellationPolicies.get(this.currentCancellationPolicyId);
	}

	/**
	 * A readonly getter for Members that are assigned.
	 * returns a new instance of SchedulingApiMembers.
	 */
	public get assignedMembers() : SchedulingApiMembers {
		assumeDefinedToGetStrictNullChecksRunning(this.api, 'api');
		const members = new SchedulingApiMembers(this.api, false);

		for (const memberId of this.assignedMemberIds.iterable()) {
			const member = this.api.data.members.get(memberId);
			if (member === null) throw new Error('Could not find assigned member');
			members.push(member);
		}

		// FIXME: PLANO--7458
		// https://drplano.atlassian.net/browse/PLANO-7458

		members.push = () => {
			throw new Error('assignedMembers is readonly');
		};
		members.remove = () => {
			throw new Error('assignedMembers is readonly');
		};

		return members;
	}

}

export class SchedulingApiAssignmentProcess<ValidationMode extends 'draft' | 'validated' = 'validated'> extends SchedulingApiAssignmentProcessBase<ValidationMode> {
	public selectedState : boolean = false;

	constructor( api : SchedulingApiServiceBase | null ) {
		super(api);
	}

	public collapsed : boolean = true;

	// eslint-disable-next-line sonarjs/no-identical-functions, jsdoc/require-jsdoc
	public get affected() : boolean {
		if (this.selected) return false;

		assumeDefinedToGetStrictNullChecksRunning(this.api, 'api');
		for (const shift of this.api.data.shifts.selectedItems.iterable()) {
			if (shift.relatesTo(this)) {
				return true;
			}
		}
		return false;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get selected() : boolean {
		return this.selectedState;
	}
	public set selected( state : boolean ) {
		this.selectedState = state;
	}
	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public updateSelectedState() : void {
		assumeDefinedToGetStrictNullChecksRunning(this.api, 'api');
		const relatedShifts = this.api.data.shifts.filterByAssignmentProcess(this);
		if (!relatedShifts.length || relatedShifts.length !== relatedShifts.selectedItems.length) {
			this.selectedState = false;
		}
	}
	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public containsAnyShift(shifts : SchedulingApiShifts) : boolean {
		return !!this.shiftRefs.containsAnyShift(shifts);
	}
}


export class SchedulingApiAssignmentProcesses<ValidationMode extends 'draft' | 'validated' = 'validated'> extends SchedulingApiAssignmentProcessesBase<ValidationMode> {
	constructor(
		api : SchedulingApiServiceBase | null,
		removeDestroyedItems : boolean,
	) {
		super(api, removeDestroyedItems);
	}

	/**
	 * Set all items to the given value.
	 * value is true by default.
	 */
	public setSelected(value : boolean = true) : void {
		for (const item of this.iterable()) {
			item.selected = value;
		}
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public filterBy( fn : (item : SchedulingApiAssignmentProcess) => boolean ) : SchedulingApiAssignmentProcesses {
		const result = new SchedulingApiAssignmentProcesses(this.api, false);
		for (const item of this.iterable()) {
			if (!fn(item)) continue;
			result.push(item);
		}
		return result;
	}

	/**
	 * Check if at least one item of this list is selected
	 */
	public get hasSelectedItem() : boolean {
		return !!this.findBy(item => item.selected);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get selectedItems() : SchedulingApiAssignmentProcesses {
		const result : SchedulingApiAssignmentProcesses = new SchedulingApiAssignmentProcesses(this.api, false);
		for (const item of this.iterable()) {
			if (item.selected) {
				result.push(item);
			}
		}
		return result;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public updateSelectedStates() : void {
		for (const item of this.iterable()) {
			item.updateSelectedState();
		}
	}

	/**
	 * Get the assignmentProcess where the provided shift is contained
	 */
	public getByShiftId(id : Id) : SchedulingApiAssignmentProcess | null {
		for (const assignmentProcess of this.iterable()) {
			if (assignmentProcess.shiftRefs.contains(id)) {
				return assignmentProcess;
			}
		}
		return null;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public containsAnyShift(shifts : SchedulingApiShifts) : boolean {
		return !!this.findBy(item => item.containsAnyShift(shifts));
	}
}

export class SchedulingApiRightGroups<ValidationMode extends 'draft' | 'validated' = 'validated'> extends SchedulingApiRightGroupsBase<ValidationMode> {
	constructor(
		api : SchedulingApiServiceBase | null,
		removeDestroyedItems : boolean,
	) {
		super(api, removeDestroyedItems);
	}

	/**
	 * Filters a list of item by a function that returns a boolean.
	 * Returns a new list.
	 */
	public filterBy( fn : (item : SchedulingApiRightGroup) => boolean ) : SchedulingApiRightGroups {
		const result = new SchedulingApiRightGroups(this.api, false);
		for (const item of this.iterable()) {
			if (!fn(item)) continue;
			result.push(item);
		}
		return result;
	}
}

export class SchedulingApiMember<ValidationMode extends 'draft' | 'validated' = 'validated'> extends SchedulingApiMemberBase<ValidationMode> implements ISchedulingApiMember {
	public isHovered : boolean = false;
	private selectedState : boolean = false;

	constructor(
		api : SchedulingApiServiceBase | null,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		idRow ?: any,
	) {
		super(api, idRow);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get rightGroups() : SchedulingApiRightGroups {
		assumeDefinedToGetStrictNullChecksRunning(this.api, 'api');
		return this.api.data.rightGroups.filterBy(item => this.rightGroupIds.contains(item.id));
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public fitsSearch(term : string | null) : boolean {
		if (term === null) return true;
		if (term === '') return true;
		for (const termItem of term.split(' ')) {
			const termLow = termItem.toLowerCase();
			const firstNameLow = this.firstName.toLowerCase();
			const lastNameLow = this.lastName.toLowerCase();
			if (firstNameLow.includes(termLow)) continue;
			if (lastNameLow.includes(termLow)) continue;
			return false;
		}
		return true;
	}

	// eslint-disable-next-line sonarjs/no-identical-functions, jsdoc/require-jsdoc
	public get affected() : boolean {
		if (this.selected) return false;

		assumeDefinedToGetStrictNullChecksRunning(this.api, 'api');
		for (const shift of this.api.data.shifts.selectedItems.iterable()) {
			if (shift.relatesTo(this)) {
				return true;
			}
		}
		return false;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get selected() : boolean {
		return this.selectedState;
	}
	public set selected( state : boolean ) {
		this.selectedState = state;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public updateSelectedState() : void {
		assumeDefinedToGetStrictNullChecksRunning(this.api, 'api');
		const relatedShifts = this.api.data.shifts.filterBy(item => item.assignedMemberIds.contains(this.id));
		if (!relatedShifts.length || relatedShifts.length !== relatedShifts.selectedItems.length) {
			this.selectedState = false;
		}
	}

	/**
	 * @returns Returns from the assigned right groups the role with the highest power.
	 */
	public get role() : SchedulingApiRightGroupRole | null {
		if (!this.isNewItem() && this.rightGroupIds.length === 0) {
			throw new Error('member must have at least one right-group assigned');
		}

		let role = null;

		for (const rightGroupId of this.rightGroupIds.iterable()) {
			assumeDefinedToGetStrictNullChecksRunning(this.api, 'api');
			const rightGroup = this.api.data.rightGroups.get(rightGroupId);
			if (rightGroup === null) throw new Error('Could not find RIGHT_GROUP');

			if (!role || rightGroup.role > role) role = rightGroup.role;
		}

		return role;
	}

	/**
	 * Check if this Member can read given shift.
	 * Note that this also checks the role (isOwner?)
	 */
	public canRead(shiftModelId : Id) : boolean | undefined {
		// Owners can read everything
		if (this.role === SchedulingApiRightGroupRole.CLIENT_OWNER) return true;

		// Assignable Member can read
		assumeDefinedToGetStrictNullChecksRunning(this.api, 'api');
		const shiftModel = this.api.data.shiftModels.get(shiftModelId);
		if (!shiftModel) return undefined;
		if (shiftModel.assignableMembers.contains(this.id)) return true;

		// Members with right-access given from rights-management can read
		for (const rightGroupId of this.rightGroupIds.iterable()) {
			const rightGroup = this.api.data.rightGroups.get(rightGroupId);
			if (rightGroup === null) throw new Error('Could not find RIGHT_GROUP');
			const SHIFTMODEL_RIGHT = rightGroup.shiftModelRights.getByItem(shiftModelId);
			if (SHIFTMODEL_RIGHT?.canRead) return true;
		}

		return false;
	}

	/**
	 * @returns Can this Member write bookings of `shiftModel`?
	 */
	public canWriteBookings(shiftModel : SchedulingApiShiftModel) : boolean {
		// Owners can write bookings and everything
		if (this.role === SchedulingApiRightGroupRole.CLIENT_OWNER) return true;

		// Members with permission from rights-management can canWriteBookings
		for (const rightGroupId of this.rightGroupIds.iterable()) {
			assumeDefinedToGetStrictNullChecksRunning(this.api, 'api');
			const rightGroup = this.api.data.rightGroups.get(rightGroupId);
			if (rightGroup === null) throw new Error('Could not find RIGHT_GROUP');
			const SHIFTMODEL_RIGHT = rightGroup.shiftModelRights.getByItem(shiftModel.id);
			if (SHIFTMODEL_RIGHT?.canWriteBookings) return true;
		}

		return false;
	}

	/**
	 * @returns Can this Member execute online-refunds?
	 */
	public canOnlineRefund(shiftModel : SchedulingApiShiftModel) : boolean {
		// Owners can always online-refund
		if (this.role === SchedulingApiRightGroupRole.CLIENT_OWNER) return true;

		// Members with permission from rights-management can online-refund
		for (const rightGroupId of this.rightGroupIds.iterable()) {
			assumeDefinedToGetStrictNullChecksRunning(this.api, 'api');
			const rightGroup = this.api.data.rightGroups.get(rightGroupId);
			if (rightGroup === null) throw new Error('Could not find RIGHT_GROUP');
			const SHIFTMODEL_RIGHT = rightGroup.shiftModelRights.getByItem(shiftModel.id);
			if (SHIFTMODEL_RIGHT?.canOnlineRefund) return true;
		}

		return false;
	}

	/**
	 * Check if this Member can write given shift.
	 * Note that this also checks the role (isOwner?)
	 */
	public canWrite(
		item : (
			SchedulingApiShift |
			SchedulingApiShiftModel |
			SchedulingApiTodaysShiftDescription |
			Id
		),
	) : boolean {
		// Owners can write everything
		if (this.role === SchedulingApiRightGroupRole.CLIENT_OWNER) return true;

		let shiftModelId : Id | null = null;
		if (item instanceof SchedulingApiShift) {
			shiftModelId = item.shiftModelId;
		} else if (item instanceof SchedulingApiShiftModel) {
			shiftModelId = item.id;
		} else if (item instanceof SchedulingApiTodaysShiftDescription) {
			shiftModelId = item.id.shiftModelId;
		} else if (item instanceof Id) {
			shiftModelId = item;
		}

		assumeDefinedToGetStrictNullChecksRunning(shiftModelId, 'shiftModelId', 'PLANO-FE-4KZ');

		for (const rightGroupId of this.rightGroupIds.iterable()) {
			const shiftModelRight = this.getShiftModelRight(rightGroupId, shiftModelId);

			if (shiftModelRight?.canWrite) return true;
		}

		return false;
	}

	private getShiftModelRight(rightGroupId : Id, shiftModelId : Id) : SchedulingApiRightGroupShiftModelRight | null	{
		assumeDefinedToGetStrictNullChecksRunning(this.api, 'api');
		const rightGroup = this.api.data.rightGroups.get(rightGroupId);
		assumeDefinedToGetStrictNullChecksRunning(rightGroup, 'rightGroup');
		return rightGroup.shiftModelRights.getByItem(shiftModelId);
	}

	/**
	 * Check if this Member can get Manager Notifications for the given shift.
	 * Note that this also checks the role (isOwner?)
	 */
	public canGetManagerNotifications(item ?: SchedulingApiShift | SchedulingApiShiftModel | Id) : boolean {
		if (item) {
			const shiftModelId = (() => {
				if (item instanceof SchedulingApiShift) return item.shiftModelId;
				return item instanceof Id ? item : item.id;
			})();
			const isClientOwner = (this.role === SchedulingApiRightGroupRole.CLIENT_OWNER);

			for (const rightGroupId of this.rightGroupIds.iterable()) {
				const shiftModelRight = this.getShiftModelRight(rightGroupId, shiftModelId);

				if (	(shiftModelRight?.canGetManagerNotifications)	||
				(!shiftModelRight && isClientOwner)) {
					return true;
				}
			}

			return false;
		} else {
			// Check if member is getting manager notifications for any shift-model.
			assumeDefinedToGetStrictNullChecksRunning(this.api, 'api');
			for (const shiftModel of this.api.data.shiftModels.iterable()) {
				if (!shiftModel.trashed && this.canGetManagerNotifications(shiftModel))
					return true;
			}

			return false;
		}
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public hasManagerRights(item : SchedulingApiShift | SchedulingApiShiftModel | Id) : boolean {
		if (this.role === SchedulingApiRightGroupRole.CLIENT_OWNER) return true;

		return this.canWrite(item) && this.canGetManagerNotifications(item);
	}

	/**
	 * Check if this Member can write at least one shiftModel.
	 */
	public get canWriteAnyShiftModel() : boolean {
		if (this.role === SchedulingApiRightGroupRole.CLIENT_OWNER) {
			return true;
		}

		// any assigned right-group grants write permissions?
		for (const rightGroupId of this.rightGroupIds.iterable()) {
			assumeDefinedToGetStrictNullChecksRunning(this.api, 'api');
			const rightGroup = this.api.data.rightGroups.get(rightGroupId);
			if (rightGroup === null) throw new Error('Could not find RIGHT_GROUP');
			for (const shiftModelRight of rightGroup.shiftModelRights.iterable()) {
				if (shiftModelRight.canWrite) {
					return true;
				}
			}
		}

		return false;
	}

	/**
	 * Check if this Member can read at least one shiftModel.
	 */
	public get canReadAnyShiftModel() : boolean {
		if (this.role === SchedulingApiRightGroupRole.CLIENT_OWNER) return true;

		// any assigned right-group grants write permissions?
		for (const rightGroupId of this.rightGroupIds.iterable()) {
			assumeDefinedToGetStrictNullChecksRunning(this.api, 'api');
			const rightGroup = this.api.data.rightGroups.get(rightGroupId);
			if (rightGroup === null) throw new Error('Could not find RIGHT_GROUP');
			for (const shiftModelRight of rightGroup.shiftModelRights.iterable()) {
				if (shiftModelRight.canRead) return true;
			}
		}

		return false;
	}
}

export class SchedulingApiAccountingPeriodExpectedMemberData<ValidationMode extends 'draft' | 'validated' = 'validated'>
	extends SchedulingApiAccountingPeriodExpectedMemberDataBase<ValidationMode> {
	constructor(
		api : SchedulingApiServiceBase | null,
		removeDestroyedItems : boolean,
	) {
		super(api, removeDestroyedItems);
	}

	/**
	 * NOTE: getByMember() is faster
	 */
	public getByMemberId(item : Id) : SchedulingApiAccountingPeriodExpectedMemberDataItem | null {
		assumeDefinedToGetStrictNullChecksRunning(this.api, 'api');
		const member = this.api.data.members.get(item);
		if (!member) throw new Error('Could not find by member');
		return this.getByMember(member);
	}

	/**
	 * Gets by member. Doesn’t work if logged in user is not owner.
	 */
	public getByMember(item : SchedulingApiMember) : SchedulingApiAccountingPeriodExpectedMemberDataItem | null {
		return this.get(item.id);
	}
}

export class SchedulingApiAccountingPeriod<ValidationMode extends 'draft' | 'validated' = 'validated'>
	extends SchedulingApiAccountingPeriodBase<ValidationMode> {
	constructor( api : SchedulingApiServiceBase | null ) {
		super(api);
	}

}

export class SchedulingApiAccountingPeriods<ValidationMode extends 'draft' | 'validated' = 'validated'> extends SchedulingApiAccountingPeriodsBase<ValidationMode> {
	constructor(
		api : SchedulingApiServiceBase | null,
		removeDestroyedItems : boolean,
	) {
		super(api, removeDestroyedItems);
	}

	/**
	 * Filters a list of item by a function that returns a boolean.
	 * Returns a new list.
	 */
	public filterBy( fn : (item : SchedulingApiAccountingPeriod) => boolean ) : SchedulingApiAccountingPeriods {
		const result = new SchedulingApiAccountingPeriods(this.api, false);
		for (const item of this.iterable()) {
			if (!fn(item)) continue;
			result.push(item);
		}
		return result;
	}
}

export class SchedulingApiRightGroup<ValidationMode extends 'draft' | 'validated' = 'validated'> extends SchedulingApiRightGroupBase<ValidationMode> {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	constructor( api : SchedulingApiServiceBase | null, idRaw ?: any ) {
		super(api, idRaw);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public canGetManagerNotificationByItem(input : SchedulingApiShiftModel | Id | string) : boolean {
		const shiftModelRight = this.shiftModelRights.getByItem(input);

		if (shiftModelRight) return shiftModelRight.canGetManagerNotifications;

		return this.role === SchedulingApiRightGroupRole.CLIENT_OWNER;
	}
}

export class SchedulingApiRightGroupShiftModelRights<ValidationMode extends 'draft' | 'validated' = 'validated'>
	extends SchedulingApiRightGroupShiftModelRightsBase<ValidationMode> {
	constructor(
		api : SchedulingApiServiceBase | null,
		removeDestroyedItems : boolean,
	) {
		super(api, removeDestroyedItems);
	}

	/**
	 * Gets shiftModelRight by shiftModel or id of shiftModel
	 * If there is no shiftModelRight for the shiftModel it tries to find one for its parent
	 */
	public getByItem(input : SchedulingApiShiftModel | Id | SchedulingApiShiftModel['parentName']) : SchedulingApiRightGroupShiftModelRight | null {
		let result : SchedulingApiRightGroupShiftModelRight | null = null;

		// If its a string it can only be searched by Parent
		if (typeof input === 'string') return this.getByShiftModelParent(input);

		// If its not a string try to find rule for shiftModel
		const id = input instanceof SchedulingApiShiftModel ? input.id : input;
		result = this.getByShiftModel(id);
		if (!!result) return result;

		// Could not find rule for shiftModel
		// Try to find one for its Parent
		let shiftModel : SchedulingApiShiftModel;
		if (input instanceof SchedulingApiShiftModel) {
			shiftModel = input;
		} else {
			assumeDefinedToGetStrictNullChecksRunning(this.api, 'api');
			const searchedShiftModel = this.api.data.shiftModels.get(input);
			assumeNonNull(searchedShiftModel, 'searchedShiftModel', `Could not find shiftModel »${input.toString()}« in »${this.api.data.shiftModels.length}« items.`);
			shiftModel = searchedShiftModel;
		}
		return this.getByShiftModelParent(shiftModel);
	}


	/**
	 * Gets shiftModelRight by shiftModel or id of shiftModel
	 */
	public getByShiftModel(input : SchedulingApiShiftModel | Id) : SchedulingApiRightGroupShiftModelRight | null {
		const id = input instanceof Id ? input : input.id;
		for (const shiftModelRight of this.iterable()) {
			assumeDefinedToGetStrictNullChecksRunning(shiftModelRight.shiftModelId, 'shiftModelRight.shiftModelId');
			if (shiftModelRight.shiftModelId.equals(id)) {
				return shiftModelRight;
			}
		}
		return null;
	}


	/**
	 * Gets shiftModelRight by shiftModelParent or id of shiftModel
	 */
	public getByShiftModelParent(input : SchedulingApiShiftModel | SchedulingApiShiftModel['parentName']) : SchedulingApiRightGroupShiftModelRight | null {
		const shiftModelParent = input instanceof SchedulingApiShiftModel ? input.parentName : input;
		for (const shiftModelRight of this.iterable()) {
			if (shiftModelRight.shiftModelParentName === shiftModelParent) {
				return shiftModelRight;
			}
		}
		return null;
	}

}

export class SchedulingApiAssignableShiftModel<ValidationMode extends 'draft' | 'validated' = 'validated'>
		extends SchedulingApiMemberAssignableShiftModelBase<ValidationMode> {
	constructor( api : SchedulingApiServiceBase | null ) {
		super(api);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get shiftModel() : SchedulingApiShiftModel {
		assumeNonNull(this.api, 'this.api', 'Api must be defined to get shiftmodels');
		return this.api.data.shiftModels.get(this.shiftModelId)!;
	}
}

export class SchedulingApiShiftModelAssignableMember<ValidationMode extends 'draft' | 'validated' = 'validated'>
		extends SchedulingApiShiftModelAssignableMemberBase<ValidationMode> {
	constructor( api : SchedulingApiServiceBase | null ) {
		super(api);
	}
}

export class SchedulingApiShiftModelAssignableMembers<ValidationMode extends 'draft' | 'validated' = 'validated'>
		extends SchedulingApiShiftModelAssignableMembersBase<ValidationMode> {
	constructor(
		api : SchedulingApiServiceBase | null,
		removeDestroyedItems : boolean,
	) {
		super(api, removeDestroyedItems);
	}
	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public getByMemberId(id : Id) : SchedulingApiShiftModelAssignableMember | null {
		return this.findBy(item => item.memberId.equals(id));
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public getByMember(item : SchedulingApiMember) : SchedulingApiShiftModelAssignableMember | null {
		return this.getByMemberId(item.id);
	}

	/**
	 * Get Amount of all un-trashed items
	 */
	public get unTrashedItemsAmount() : number {
		assumeDefinedToGetStrictNullChecksRunning(this.api, 'api');
		let result = 0;
		for (const item of this.iterable()) {
			const member = this.api.data.members.get(item.memberId);
			if (!member) throw new Error('Could not find member');
			if (!member.trashed) {
				result += 1;
			}
		}
		return result;
	}

	/**
	 * Check if there is at least one un-trashed item
	 */
	public get hasUntrashedItem() : boolean {
		return !!this.findBy(item => {
			assumeDefinedToGetStrictNullChecksRunning(this.api, 'api');
			const member = this.api.data.members.get(item.memberId);
			if (!member) throw new Error('Could not find member');
			return !member.trashed;
		});
	}

	/**
	 * Filters a list of ShiftModelAssignableMember by a function that returns a boolean.
	 * Returns a new list of ShiftModelAssignableMember.
	 */
	public filterBy(
		fn : (item : SchedulingApiShiftModelAssignableMember) => boolean,
	) : SchedulingApiShiftModelAssignableMembers {
		const result = new SchedulingApiShiftModelAssignableMembers(this.api, false);
		for (const item of this.iterable()) {
			if (!fn(item)) continue;
			result.push(item);
		}
		return result;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get members() : SchedulingApiMembers {
		assumeDefinedToGetStrictNullChecksRunning(this.api, 'api');
		const result = new SchedulingApiMembers(this.api, false);
		for (const assignableMember of this.iterable()) {
			const member = this.api.data.members.get(assignableMember.memberId);
			if (!member) throw new Error('Could not find by member');
			result.push(member);
		}
		return result;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public containsMember(item : SchedulingApiMember) : boolean {
		return !!this.getByMember(item);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public addNewMember(member : SchedulingApiMember, earning ?: number) : void {
		// NOTE: duplicate! This method exists here:
		// SchedulingApiAssignableShiftModels
		// SchedulingApiAssignableMembers

		if (this.containsMember(member)) return;

		const tempAssignableMember = this.createNewItem();
		// eslint-disable-next-line unicorn/prefer-logical-operator-over-ternary
		tempAssignableMember.hourlyEarnings = earning ? earning : 0;
		tempAssignableMember.memberId = member.id;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public removeMember(item : SchedulingApiMember) : void {
		const assignableMember = this.getByMember(item);
		if (assignableMember) {
			this.removeItem(assignableMember);
		}
	}

}

export class SchedulingApiShiftAssignableMembers<ValidationMode extends 'draft' | 'validated' = 'validated'>
		extends SchedulingApiShiftAssignableMembersBase<ValidationMode> {
	constructor(
		api : SchedulingApiServiceBase | null,
		removeDestroyedItems : boolean,
	) {
		super(api, removeDestroyedItems);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public getByMemberId(id : Id) : SchedulingApiShiftAssignableMember | null {
		return this.findBy(item => item.memberId.equals(id));
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public containsMemberId(item : Id) : boolean {
		for (const assignableMember of this.iterable()) {
			if (assignableMember.memberId.equals(item)) {
				return true;
			}
		}
		return false;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public getByMember(item : SchedulingApiMember) : SchedulingApiShiftAssignableMember | null {
		return this.getByMemberId(item.id);
	}

	/**
	 * Get Amount of all untrashed items
	 */
	public get unTrashedItemsAmount() : number {
		assumeDefinedToGetStrictNullChecksRunning(this.api, 'api');
		let result = 0;
		for (const item of this.iterable()) {
			const member = this.api.data.members.get(item.memberId);
			if (!member) throw new Error('Could not find by member');
			if (!member.trashed) {
				result += 1;
			}
		}
		return result;
	}

	/**
	 * Check if there is at least one untrashed item
	 */
	public get hasUntrashedItem() : boolean {
		assumeDefinedToGetStrictNullChecksRunning(this.api, 'api');
		return !!this.findBy(item => {
			assumeDefinedToGetStrictNullChecksRunning(this.api, 'api');
			const member = this.api.data.members.get(item.memberId);
			if (!member) throw new Error('Could not find member');
			return !member.trashed;
		});
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public containsMember(item : SchedulingApiMember) : boolean {
		return !!this.getByMember(item);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public addNewMember(
		member : SchedulingApiMember,
		earning : number = 0,
	) : void {
		if (this.containsMember(member)) return;

		const tempAssignableMember = this.createNewItem();
		tempAssignableMember.hourlyEarnings = earning;
		tempAssignableMember.memberId = member.id;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public removeMember(item : SchedulingApiMember) : void {
		const assignableMember = this.getByMember(item);
		if (assignableMember) {
			this.removeItem(assignableMember);
		}
	}

	/**
	 * Filters a list of ShiftModels by a function that returns a boolean.
	 * Returns a new list of ShiftModels.
	 */
	public filterBy( fn : (item : SchedulingApiShiftAssignableMember) => boolean ) : SchedulingApiShiftAssignableMembers {
		const result = new SchedulingApiShiftAssignableMembers(this.api, false);
		for (const item of this.iterable()) {
			if (!fn(item)) continue;
			result.push(item);
		}
		return result;
	}

}

export class SchedulingApiShiftModels<ValidationMode extends 'draft' | 'validated' = 'validated'>
		extends SchedulingApiShiftModelsBase<ValidationMode> {
	constructor(
		api : SchedulingApiServiceBase | null,
		removeDestroyedItems : boolean,
	) {
		super(api, removeDestroyedItems);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public search(input : Parameters<SchedulingApiShiftModel['fitsSearch']>[0]) : SchedulingApiShiftModels {
		if (input === '') return this;
		return this.filterBy(item => item.fitsSearch(input));
	}

	/**
	 * Set all items to the given value.
	 * value is true by default.
	 */
	public setSelected(value : boolean = true) : void {
		for (const shift of this.iterable()) {
			shift.selected = value;
		}
	}

	/**
	 * Check if at least one item of this list is selected
	 */
	public get hasSelectedItem() : boolean {
		return !!this.findBy(item => item.selected);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get selectedItems() : SchedulingApiShiftModels {
		return this.filterBy(item => item.selected);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get trashedItemsAmount() : number {
		let result = 0;
		for (const shiftModel of this.iterable()) {
			if (shiftModel.trashed) {
				result += 1;
			}
		}
		return result;
	}

	/**
	 * Check if there is at least one untrashed item
	 */
	public get hasUntrashedItem() : boolean {
		return !!this.findBy(item => !item.trashed);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public updateSelectedStates() : void {
		for (const item of this.iterable()) {
			item.updateSelectedState();
		}
	}


	public override createNewItem(id ?: Id) : SchedulingApiShiftModel {
		return super.createNewItem(id);
	}


	public override removeItem(shiftModel : SchedulingApiShiftModel) : void {
		super.removeItem(shiftModel);
	}

	private _groupByParentName = new Data<SchedulingApiShiftModels[]>(this.api);

	/**
	 * @returns Returns a list of lists where each inner list contains the shift-models with the same parent name.
	 * Note: Iterating maps in ng templates seems not be supported. So, instead this list of list structure was used.
	 */
	public get groupByParentName() : SchedulingApiShiftModels[] {
		return this._groupByParentName.get(() => {
			// calculate value of groupedByParentName
			const groupedList : SchedulingApiShiftModels[] = [];
			const getListForParentName = (parentName : string) : SchedulingApiShiftModels => {
				let result : SchedulingApiShiftModels | undefined = undefined;
				for (const list of groupedList) {
					// Does a list already exist for this parent name?
					const firstItem = list.get(0);
					if (firstItem === null) throw new Error('Could not get first item');
					if (parentName === firstItem.parentName) {
						result = list;
						break;
					}
				}
				// Create new list if not already exist for this parent name.
				if (!result) {
					result = new SchedulingApiShiftModels(this.api, false);
					groupedList.push(result);
				}
				return result;
			};

			for ( const shiftModel of this.iterable() ) {
				const parentName = shiftModel.parentName;

				// Does a list already exist for this parent name?
				const listForThisParentName = getListForParentName(parentName);

				// Add shift model to list
				listForThisParentName.push(shiftModel);
			}

			// sort outer list
			groupedList.sort((a : SchedulingApiShiftModels, b : SchedulingApiShiftModels) : number => {
				const firstItemA = a.get(0);
				if (firstItemA === null) throw new Error('Could not get first item of a');
				const firstItemB = b.get(0);
				if (firstItemB === null) throw new Error('Could not get first item of b');
				return firstItemA.parentName.localeCompare(firstItemB.parentName);
			});

			return groupedList;
		});
	}

	/**
	 * @returns Returns a list of list where each inner list contains the shift-models with the same parent name.
	 * Note: Iterating maps in ng templates seems not be supported. So, instead this list of list structure was used.
	 */
	public get parentNames() : string[] {
		const result : string[] = [];
		for (const shiftModel of this.iterable()) {
			const notIncluded = !result.includes(shiftModel.parentName);
			if (notIncluded) {
				result.push(shiftModel.parentName);
			}
		}
		return result;
	}

	/**
	 * @returns Returns a list of all courseGroups
	 */
	public get courseGroups() : string[] {
		const result : string[] = [];
		for (const shiftModel of this.iterable()) {
			if (shiftModel.courseGroup === null) continue;
			const notIncluded = !result.includes(shiftModel.courseGroup);
			if (notIncluded) {
				result.push(shiftModel.courseGroup);
			}
		}
		return result;
	}

	/**
	 * Filters a list of ShiftModels by a function that returns a boolean.
	 * Returns a new list of ShiftModels.
	 */
	public filterBy( fn : (item : SchedulingApiShiftModel) => boolean ) : SchedulingApiShiftModels {
		const result = new SchedulingApiShiftModels(this.api, false);
		for (const item of this.iterable()) {
			if (!fn(item)) continue;
			result.push(item);
		}
		return result;
	}

}

export class SchedulingApiAssignableShiftModels<ValidationMode extends 'draft' | 'validated' = 'validated'>
		extends SchedulingApiMemberAssignableShiftModelsBase<ValidationMode> {
	constructor(
		api : SchedulingApiServiceBase | null,
		removeDestroyedItems : boolean,
	) {
		super(api, removeDestroyedItems);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public getByShiftModel(input : SchedulingApiShiftModel) : SchedulingApiAssignableShiftModel | undefined {
		for (const assignableShiftModel of this.iterable()) {
			if (assignableShiftModel.shiftModelId.equals(input.id)) {
				return assignableShiftModel;
			}
		}
		return undefined;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get shiftModels() : SchedulingApiShiftModels {
		const result = new SchedulingApiShiftModels(this.api, false);
		for (const assignableShiftModel of this.iterable()) {
			const shiftModelToPush = assignableShiftModel.shiftModel;
			// @ts-expect-error -- PLANO-FE-4Q7 -- Leave this here until we released 3.1 – afterwards this can be removed if there are no further Sentry entries
			assumeNonNull(shiftModelToPush, 'shiftModelToPush', 'PLANO-FE-4Q7');
			result.push(shiftModelToPush);
		}
		return result;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public containsShiftModel(item : SchedulingApiShiftModel) : boolean {
		return !!this.getByShiftModel(item);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public addNewShiftModel(
		shiftModel : SchedulingApiShiftModel,
		earning : number = 0,
	) : void {
		// NOTE: duplicate! This method exists here:
		// SchedulingApiAssignableShiftModels
		// SchedulingApiAssignableMembers

		if (this.containsShiftModel(shiftModel)) return;

		const assignableShiftModel = this.createNewItem();
		// eslint-disable-next-line unicorn/prefer-logical-operator-over-ternary
		assignableShiftModel.hourlyEarnings = earning ? earning : 0;
		assignableShiftModel.shiftModelId = shiftModel.id;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public removeShiftModel(item : SchedulingApiShiftModel) : void {
		const assignableShiftModel = this.getByShiftModel(item);
		if (!assignableShiftModel) throw new Error('Could not get assignableShiftModel');
		this.removeItem(assignableShiftModel);
	}

}

export class SchedulingApiMemos<ValidationMode extends 'draft' | 'validated' = 'validated'> extends SchedulingApiMemosBase<ValidationMode> {
	constructor(
		api : SchedulingApiServiceBase | null,
		removeDestroyedItems : boolean,
	) {
		super(api, removeDestroyedItems);
	}

	/**
	 * Get the Memo where the start is at the same day as the day of the provided timestamp
	 */
	public getByDay(dayStart : number) : SchedulingApiMemo | null {
		Assertions.ensureIsDayStart(dayStart);
		if (!dayStart) throw new Error('Can not get Memo. Timestamp is not defined.');

		for (const memo of this.iterable()) {
			// We assume that memo.start is start of day
			Assertions.ensureIsDayStart(memo.start);

			if (memo.start === dayStart) return memo;
		}
		return null;
	}

}

export class SchedulingApiTodaysShiftDescriptions<ValidationMode extends 'draft' | 'validated' = 'validated'>
		extends SchedulingApiTodaysShiftDescriptionsBase<ValidationMode> {
	constructor(
		api : SchedulingApiServiceBase | null,
		removeDestroyedItems : boolean,
	) {
		super(api, removeDestroyedItems);
	}

	/**
	 * Filters a list of SchedulingApiTodaysShiftDescriptions by a function that returns a boolean.
	 */
	public filterBy(
		fn : (item : SchedulingApiTodaysShiftDescription) => boolean,
	) : SchedulingApiTodaysShiftDescriptions {
		const result = new SchedulingApiTodaysShiftDescriptions(this.api, false);
		for (const item of this.iterable()) {
			if (!fn(item)) continue;
			result.push(item);
		}
		return result;
	}
}

export class SchedulingApiTodaysShiftDescription<ValidationMode extends 'draft' | 'validated' = 'validated'>
		extends SchedulingApiTodaysShiftDescriptionBase<ValidationMode> {
	constructor(
		public override api : SchedulingApiServiceBase | null,
	) {
		super(api);
	}

	private _model : Data<SchedulingApiShiftModel | null> = new Data<SchedulingApiShiftModel>(this.api);

	/**
	 * shorthand that returns the related model
	 */
	public get model() : SchedulingApiShiftModel {
		// NOTE: This methods exists on multiple classes:
		// TimeStampApiShift
		// SchedulingApiShift
		// SchedulingApiBooking
		// SchedulingApiTodaysShiftDescription
		const SHIFT_MODEL = this._model.get(() => {
			assumeDefinedToGetStrictNullChecksRunning(this.api, 'api');
			return this.api.data.shiftModels.get(this.id.shiftModelId);
		});
		assumeNonNull(SHIFT_MODEL, 'SHIFT_MODEL');

		return SHIFT_MODEL;
	}

	/**
	 * Get the name based on the linked shiftModel
	 */
	public get name() : SchedulingApiShiftModel['name'] {
		// NOTE: This methods exists on multiple classes:
		// SchedulingApiRoot
		// TimeStampApiRoot
		return this.model.name;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get isRequesterAssigned() : boolean {
		for (const assignedMemberId of this.assignedMemberIds.iterable()) {
			assumeDefinedToGetStrictNullChecksRunning(this.api, 'api');
			if (this.api.rightsService.isMe(assignedMemberId))
				return true;
		}

		return false;
	}

	/**
	 * A readonly getter for Members that are assigned.
	 * returns a new instance of SchedulingApiMembers.
	 */
	public get assignedMembers() : SchedulingApiMembers {
		const members = new SchedulingApiMembers(this.api, false);

		for (const memberId of this.assignedMemberIds.iterable()) {
			assumeDefinedToGetStrictNullChecksRunning(this.api, 'api');
			const member = this.api.data.members.get(memberId);
			if (!member) throw new Error('Could not find by member');
			members.push(member);
		}

		// FIXME: PLANO--7458
		// https://drplano.atlassian.net/browse/PLANO-7458

		members.push = () => {
			throw new Error('assignedMembers is readonly');
		};
		members.remove = () => {
			throw new Error('assignedMembers is readonly');
		};

		return members;
	}
}

export class SchedulingApiVouchers<ValidationMode extends 'draft' | 'validated' = 'validated'> extends SchedulingApiVouchersBase<ValidationMode> {

	/**
	 * Filters a list of Shifts by a function that returns a boolean.
	 * Returns a new list of Shifts.
	 */
	public filterBy( fn : (item : SchedulingApiVoucher) => boolean ) : SchedulingApiVouchers {
		const result = new SchedulingApiVouchers(this.api, false);
		for (const item of this.iterable()) {
			if (!fn(item)) continue;
			result.push(item);
		}
		return result;
	}
}

export class SchedulingApiVoucher<ValidationMode extends 'draft' | 'validated' = 'validated'> extends SchedulingApiVoucherBase<ValidationMode> {

	/**
	 * @returns All transactions belonging to this voucher.
	 */
	public get transactions() : SchedulingApiTransactions {
		assumeDefinedToGetStrictNullChecksRunning(this.api, 'api');
		return this.api.data.transactions.filterBy(item => this.id.equals(item.voucherId));
	}

	public attributeInfoAmountToPay =  new ApiAttributeInfo<SchedulingApiVoucher, Currency>({
		apiObjWrapper: this,
		name: 'amountToPay',
		id: 'VOUCHER_AMOUNT_TO_PAY',
		primitiveType: PApiPrimitiveTypes.Currency,
		canEdit: () => false,
		readMode: () => true,
	});

	/**
	 * How much needs to be paid for this voucher overall. This value is independent of how much has been paid already (i.e. `currentlyPaid`).
	 */
	public get amountToPay() : Currency | null {
		return this.price;
	}

	/**
	 * @see SchedulingApiBookingBase['currentlyPaid']
	 */
	public override get currentlyPaid() : Currency {
		return SchedulingApiBookable.currentlyPaid(this, super.attributeInfoCurrentlyPaid, super.currentlyPaid);
	}

	/**
	 * @see SchedulingApiBookable['getOpenAmount']
	 */
	public getOpenAmount(currentlyPaid ?: Currency | null) : Currency | null {
		return SchedulingApiBookable.getOpenAmount(this, currentlyPaid);
	}

	/**
	 * getter for the status of payment
	 */
	public get paymentStatus() : PPaymentStatusEnum | null {
		return SchedulingApiBookable.paymentStatus(this);
	}

	public readonly state : SchedulingApiBookingState = SchedulingApiBookingState.BOOKED;

	/**
	 * Same as currentlyPaid but more up-to-date if user is about to create a new transaction.
	 * The new amount of the new transaction will be part of this getter.
	 */
	public get newCurrentlyPaid() : Currency | null {
		return SchedulingApiBookable.newCurrentlyPaid(this);
	}

}
