import { OnDestroy} from '@angular/core';
import { Component, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { ToastObject } from '@plano/client/service/toasts.service';
import { ToastsService } from '@plano/client/service/toasts.service';
import { TimeStampApiShiftModels } from '@plano/shared/api';
import { RightsService, TimeStampApiShift } from '@plano/shared/api';
import { TimeStampApiShiftModel, TimeStampApiService } from '@plano/shared/api';
import { MeService } from '@plano/shared/api';
import { Id } from '@plano/shared/api/base/id';
import { Config } from '@plano/shared/core/config';
import { PDictionarySourceString } from '@plano/shared/core/pipe/localize.dictionary';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { BootstrapSize, PThemeEnum } from '../shared/bootstrap-styles.enum';

@Component({
	selector: 'p-time-stamp',
	templateUrl: './time-stamp.component.html',
	styleUrls: ['./time-stamp.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
	// animations: [
	// 	trigger('slide', [
	// 		transition(':enter', [
	// 			style({
	// 				height: 0,
	// 				overflow: 'hidden',
	// 			}),
	// 			animate(300),
	// 		]),
	// 		transition(':leave', [
	// 			style({
	// 				height: 0,
	// 				overflow: 'hidden',
	// 			}),
	// 			animate(300),
	// 		]),
	// 	]),
	// ],
})
export class TimeStampComponent implements OnDestroy {
	@HostBinding('class.flex-grow-1')
	@HostBinding('class.d-flex')
	@HostBinding('class.position-relative') protected _alwaysTrue = true;

	/**
	 * Flag to define if this work-session is a unplanned
	 */
	public isUnplanned : boolean = false;

	/**
	 * The temporary selected shiftModel or shift that will be used as selected item if user hits
	 * start
	 * NOTE: We can not store it directly into api.data.selectedShiftId because this would have an
	 * effect on the diff function – so it could cause trouble in the database.
	 */
	public tempSelectedItem : TimeStampApiShift | TimeStampApiShiftModel | null = null;

	constructor(
		public meService : MeService,
		public api : TimeStampApiService,
		private toasts : ToastsService,
		private localize : LocalizePipe,
		private rightsService : RightsService,
	) {
		this.loadNewData();
	}

	public PThemeEnum = PThemeEnum;
	public PlanoFaIconPool = PlanoFaIconPool;
	public BootstrapSize = BootstrapSize;

	/**
	 * Returns starting time of currently stamped shift
	 */
	public get start() : number | null | undefined {
		if (!this.api.isLoaded()) return undefined;
		return this.api.data.start;
	}

	/**
	 * The temporary selected shift Id that will be used as selected item if user hits start
	 */
	private get tempSelectedShiftId() : Id | null {
		if (this.tempSelectedItem instanceof TimeStampApiShift) {
			return this.tempSelectedItem.id;
		}
		return null;
	}

	// FIXME: PLANO-15429 - Return type should be ShiftId not Id
	/**
	 * Returns the Id of the selected shift. No matter if temporary or already active.
	 */
	public get selectedShiftId() : Id | null {
		if (this.api.data.selectedShiftId !== null) {
			return this.api.data.selectedShiftId;
		}
		return this.tempSelectedShiftId;
	}

	/**
	 * Is there a temporary selected shift id that will be used as selected item if user hits start?
	 */
	public get hasTempSelectedShiftId() : boolean {
		return this.tempSelectedShiftId !== null;
	}

	/**
	 * The temporary selected item that will be used if user hits start
	 */
	public get tempSelectedShiftModelId() : Id | undefined {
		if (this.tempSelectedItem instanceof TimeStampApiShiftModel) {
			return this.tempSelectedItem.id;
		}
		return undefined;
	}

	/**
	 * Load new Data from api
	 */
	private loadNewData() : void {
		this.api.load({
			success: () => {
				if (!this.api.data.shifts.length) {
					this.isUnplanned = true;
				}
			},
		});
	}

	/**
	 * Disables the checkbox for unplanned shifts
	 */
	public get disableUnplannedShiftToggle() : boolean {
		if (!this.api.isLoaded()) return true;
		if (!this.unplannedEntriesPossible) return true;
		if (this.noStampableItemsAvailableForStamping) return true;
		return !!this.start || !this.api.data.shifts.length;
	}

	/**
	 * Is tracking for unplanned entries for this user possible?
	 */
	public get unplannedEntriesPossible() : boolean {
		if (!this.shiftModelsForDropdown.length) return false;
		return true;
	}

	/**
	 * Is tracking for planned entries (those for shifts where user is assigned) for this user possible?
	 */
	public get plannedEntriesPossible() : boolean {
		if (!this.api.data.shifts.length) return false;
		return true;
	}

	/**
	 * User has selected a new shiftModel
	 */
	public onSelectShiftModelId(id ?: Id) : void {
		this.onSelectItem(this.api.data.shiftModels.get(id ?? null));
	}

	/**
	 * User has selected a new shift
	 */
	public onSelectShiftId(id ?: Id) : void {
		this.onSelectItem(this.api.data.shifts.get(id ?? null));
	}

	/**
	 * Disables the select shifts dropdown mostly depending on user action
	 */
	public get disableShiftSelect() : boolean {
		if (!this.api.isLoaded()) return true;
		// some time-stamp entry is already running? block btn
		if (this.start) return true;
		// user selected "i want to track a unplanned shift"
		if (this.isUnplanned) return true;
		// user selected "i want to track a planned shift"
		if (!this.api.data.shifts.length) return true;
		return false;
	}

	/**
	 * Disables the select shifts dropdown mostly depending on BE
	 */
	public get disableShiftModelSelect() : boolean {
		// Block every api-related button if api is not loaded
		if (!this.api.isLoaded()) return true;
		// some time-stamp entry is already running? block btn
		if (this.start) return true;
		// this user can not do unplanned entries? block btn
		if (!this.unplannedEntriesPossible) return true;
		// user selected "i want to track a planned shift"
		if (!this.isUnplanned) return true;
		return false;
	}

	/**
	 * User has selected a new item
	 */
	private onSelectItem(shiftItem : TimeStampApiShift | TimeStampApiShiftModel | null = null) : void {
		this.tempSelectedItem = shiftItem;
	}

	/**
	 * Returns generated warning messages
	 */
	public get warningMessages() : PDictionarySourceString[] {
		return this.api.warningMessages;
	}

	/**
	 * toggle the 'is unplanned' checkbox and select an item
	 */
	public toggleIsUnplanned() : void {
		this.isUnplanned = !this.isUnplanned;
		this.onSelectItem();
	}

	/**
	 * Returns the initial shift model of the selected Item
	 */
	public get initialShiftModel() : TimeStampApiShiftModel | undefined {
		if (this.api.data.selectedItem instanceof TimeStampApiShiftModel) {
			return this.api.data.selectedItem;
		}
		return undefined;
	}

	/**
	 * When user ends his tracked time.
	 */
	public onEnd() : void {
		this.addEndToast();
		this.refreshCommentReminderToast();
	}

	/**
	 * Adds the reminder if necessary
	 */
	public refreshCommentReminderToast() : void {
		const newToast : ToastObject = {
			content: this.localize.transform('Du musst unten noch einen Kommentar für die Personalleitung abgeben.'),
			theme: PThemeEnum.WARNING,
			visibilityDuration: 'long',
		};
		if (!this.api.data.end) return;
		if (this.api.hasWarningMessages && !this.api.data.comment) {
			this.toasts.addToast(newToast);
		} else {
			this.toasts.removeToast(newToast);
		}
	}

	/**
	 * Success-Toast
	 */
	public addEndToast() : void {
		if (!this.api.data.end) return;

		this.toasts.addToast({
			content: this.localize.transform(
				// eslint-disable-next-line literal-blacklist/literal-blacklist
				'Deine eingestempelten Zeiten wurden gespeichert! Du kannst sie in der <a href="client/report">Auswertung</a> einsehen.',
			),
			theme: PThemeEnum.SUCCESS,
			visibilityDuration: 'long',
		});
	}

	/**
	 * ngOnDestroy
	 */
	public ngOnDestroy() : void {
		this.toasts.removeAllToasts();
	}

	/**
	 * Reset the time-stamp so the user can e.g. start a new shift right away
	 */
	public resetTimeStamp(event ?: Event) : void {
		this.tempSelectedItem = null;
		this.onSelectItem();
		if (event) { event.preventDefault(); }
		this.toasts.removeAllToasts();
		this.api.setEmptyData();
		this.loadNewData();
	}

	/**
	 * Is this device allowed to use the time stamp? `undefined` is returned if this cannot be determined yet.
	 */
	public get isAllowedTimeStampDevice() : boolean | undefined {
		return this.api.data.allowedTimeStampDevices.isDeviceAllowedToTimeStamp();
	}

	/**
	 * Returns tooltip relating to unplanned shifts
	 * @example 'Your are not allowed…'
	 * @example 'Thank your for …'
	 */
	public get unplannedShiftToggleTooltipContent() : string | undefined {
		if (Config.IS_MOBILE) return undefined;
		if (!this.unplannedEntriesPossible) return this.localize.transform('Du darfst keine Tätigkeiten ausführen. Dementsprechend kannst du keinen ungeplanten Einsatz stempeln.');
		if (this.disableUnplannedShiftToggle) return this.localize.transform('Aktuell bist du keiner Schicht zugewiesen. Also kannst du nur einen ungeplanten Einsatz machen. Wähle dazu eine Tätigkeit und klicke auf »Einstempeln«.');
		return this.localize.transform('Du hilfst deinen Kollegen, obwohl du nicht für die Schicht eingetragen warst? Löblich! Deine Arbeitszeit kannst du dann als »ungeplanten Einsatz« stempeln. Wähle dazu eine Tätigkeit und klicke auf »Einstempeln«.');
	}

	/**
	 * Returns the for the user available shift models
	 */
	public get shiftModelsForDropdown() : TimeStampApiShiftModels {
		return this.api.data.shiftModels.filterBy(item => item.assignable && !item.trashed);
	}

	/**
	 * Are there any shift models assigned to the user?
	 */
	public get noStampableItemsAvailableForStamping() : boolean {
		return !this.shiftModelsForDropdown.length && !this.api.data.shifts.length;
	}

	/**
	 * Check if shiftmodels exists.
	 */
	public get noShiftModelExists() : boolean {
		return !this.api.data.shiftModels.filterBy(item => !item.trashed).length;
	}

	/**
	 * Has the user rights to create shiftModels?
	 */
	public get canCreateShiftModels() : boolean | null {
		return this.rightsService.isOwner;
	}

	/**
	 * Specially on mobile we want to show as few ui elements as possible.
	 * So we don’t always show the section (checkbox and input) for unplanned shifts.
	 */
	public get showSectionForUnplanned() : boolean {
		if (Config.IS_MOBILE && !this.unplannedEntriesPossible) return false;
		return !this.api.data.start || !!this.initialShiftModel;
	}

	/**
	 * Label for the button for the shift dropdown.
	 * returning undefined means that the default will be used. default ist something like "choose your shift"
	 */
	public get shiftSelectPlaceholder() : string | null {
		if (!this.plannedEntriesPossible) return this.localize.transform('Keine Schichten zu stempeln');
		return null;
	}
}
