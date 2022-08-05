import { DecimalPipe } from '@angular/common';
import { TemplateRef } from '@angular/core';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { SchedulingService } from '@plano/client/scheduling/scheduling.service';
import { SchedulingApiAssignmentProcess } from '@plano/shared/api';
import { SchedulingApiShifts } from '@plano/shared/api';
import { RightsService } from '@plano/shared/api';
import { SchedulingApiService } from '@plano/shared/api';
import { SchedulingApiAssignmentProcesses } from '@plano/shared/api';
import { SchedulingApiAssignmentProcessType } from '@plano/shared/api';
import { MeService } from '@plano/shared/api';
import { Config } from '@plano/shared/core/config';
import { Data } from '@plano/shared/core/data/data';
import { ModalService } from '@plano/shared/core/p-modal/modal.service';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { PDictionarySourceString } from '../../../../shared/core/pipe/localize.dictionary';
import { BootstrapSize, PThemeEnum } from '../../bootstrap-styles.enum';

@Component({
	selector: 'p-assignment-processes',
	templateUrl: './p-assignment-processes.component.html',
	styleUrls: ['./p-assignment-processes.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})

export class PAssignmentProcessesComponent {
	public readonly CONFIG : typeof Config = Config;
	public newProcessName : string | null = null;
	public newProcessType : SchedulingApiAssignmentProcessType = SchedulingApiAssignmentProcessType.DR_PLANO;

	public readonly TYPES : typeof SchedulingApiAssignmentProcessType = SchedulingApiAssignmentProcessType;

	constructor(
		public api : SchedulingApiService,
		public meService : MeService,
		private modalService : ModalService,
		private rightsService : RightsService,
		private localize : LocalizePipe,
		private schedulingService : SchedulingService,
		private router : Router,
		private decimalPipe : DecimalPipe,
	) {
	}

	public PlanoFaIconPool = PlanoFaIconPool;
	public BootstrapSize = BootstrapSize;
	public PThemeEnum = PThemeEnum;

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get noItemsYet() : boolean {
		if (!this.api.isLoaded()) return true;
		if (this.assignmentProcessesForList.length) return false;
		return true;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get assignmentProcessesForList() : SchedulingApiAssignmentProcesses {
		if (!this.api.isLoaded()) return new SchedulingApiAssignmentProcesses(null, false);
		return this.api.data.assignmentProcesses;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get showAddButton() : boolean | undefined {
		if (Config.IS_MOBILE) return false;
		return this.userCanEditAssignmentProcesses;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get userCanEditAssignmentProcesses() : boolean | undefined {
		return this.rightsService.userCanEditAssignmentProcesses;
	}

	/**
	 * Open Modal with for for a new assignment process
	 */
	public createNewAssignmentProcess(modalContent : TemplateRef<unknown>) : void {
		this.newProcessName = this.localize.transform('Schichtverteilung ${counter}', {
			counter: (this.api.data.assignmentProcesses.length + 1).toString(),
		});
		this.modalService.openModal(modalContent, {
			success : () : void => {
				const newProcess = this.api.data.assignmentProcesses.createNewItem();
				newProcess.name = this.newProcessName!;
				newProcess.type = this.newProcessType;
				this.api.save();
			},
		});
	}

	/**
	 * @returns Returns all shifts not a process with empty members slots.
	 */
	private _shiftsRemainingWithEmptyMemberSlotsData = new Data<SchedulingApiShifts>(this.api);

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get shiftsRemainingWithEmptyMemberSlots() : SchedulingApiShifts {
		return this._shiftsRemainingWithEmptyMemberSlotsData.get(() => {
			return this.api.data.shifts.filterBy((item) => {
				if (!!item.assignmentProcess) return false;
				if (!item.emptyMemberSlots) return false;
				return true;
			});
		});
	}


	/**
	 * Selects/deselects all items with free slots
	 */
	public toggleShiftsRemainingWithEmptyMemberSlots() : void {
		if (this.allShiftsRemainingWithEmptyMemberSlotsSelected) {
			this.shiftsRemainingWithEmptyMemberSlots.setSelected(false);
		} else {
			this.shiftsRemainingWithEmptyMemberSlots.setSelected();
		}
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get allShiftsRemainingWithEmptyMemberSlotsSelected() : boolean {
		const items = this.shiftsRemainingWithEmptyMemberSlots;
		return !!items.length && items.length === items.selectedItems.length;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get someShiftsRemainingWithEmptyMemberSlotsSelected() : boolean {
		return this.shiftsRemainingWithEmptyMemberSlots.selectedItems.length > 0;
	}

	/**
	 * Count empty slots in the current view for shifts which are not in a assignment process.
	 */
	public get remainingEmptySlotsCounter() : number {
		let result = 0;
		for (const shift of this.shiftsRemainingWithEmptyMemberSlots.iterable()) {
			result += shift.emptyMemberSlots;
		}
		return result;
	}

	/**
	 * Count hours of empty slots in the current view for shifts which are not in a assignment process.
	 */
	public get remainingEmptySlotsHoursCounter() : string | null {
		const hour = 60 * 60 * 1000;
		let hours = 0;
		for (const shift of this.shiftsRemainingWithEmptyMemberSlots.iterable()) {
			hours += (shift.end - shift.start) / hour;
		}
		if (hours > 999) '999+';
		return this.decimalPipe.transform(hours, '1.0-0');
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get showRemainingProcessesButton() : boolean {
		if (Config.IS_MOBILE) return false;
		if (!this.api.isLoaded()) return false;
		if (!this.rightsService.userCanWriteAnyShiftModel && !this.userCanEditAssignmentProcesses) return false;
		return this.api.data.shifts.length > 0;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get listHeadline() : string {
		if (this.userCanEditAssignmentProcesses) return this.localize.transform('Schichten verteilen');
		return this.localize.transform('Schichten zu verteilen');
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get listHeadlineTooltip() : string | undefined {
		if (!this.showAddButton) return undefined;
		if (this.userCanEditAssignmentProcesses) return this.localize.transform('Erstelle einen neuen Verteilungsvorgang, um deine Schichten zu besetzen.');
		return this.localize.transform('Sobald deine Personalleitung Schichten verteilen lässt, siehst du das hier und kannst aktiv werden.');
	}

	private navigateToFirstShiftOfProcess(process : SchedulingApiAssignmentProcess) : void {
		const firstShiftOfProcess = process.shiftRefs.get(0);
		const timestamp = firstShiftOfProcess ? firstShiftOfProcess.id.start : this.schedulingService.urlParam!.date;
		this.router.navigate([`/client/scheduling/${this.schedulingService.urlParam!.calendarMode}/${timestamp}`]);
	}

	private setToggleListener(process : SchedulingApiAssignmentProcess) : void {
		const subscriber = this.schedulingService.schedulingApiHasBeenLoadedOnSchedulingComponent.subscribe({
			next: () => {
				this.api.data.shifts.toggleSelectionByItem(process);
				subscriber.unsubscribe();
			},
		});
	}

	/**
	 * Open the collapsible if possible.
	 * If not then its probably a member not an admin. Then select the fist shifts of this process in the calendar.
	 */
	public onClickProcess(process : SchedulingApiAssignmentProcess) : void {
		if (!this.isCollapsible(process)) {
			this.toggleRelatedShifts(process);
		}
		this.onClickOpenToggle(process);
	}

	/**
	 * Toggle the related shifts. If not possible, nav to first shift of them, and then toggle again.
	 */
	public toggleRelatedShifts(process : SchedulingApiAssignmentProcess) : void {
		const hasBeenSelected = this.api.data.shifts.toggleSelectionByItem(process);
		if (hasBeenSelected && !this.api.data.shifts.hasSelectedItem) {
			this.navigateToFirstShiftOfProcess(process);
			this.api.deselectAllSelections();
			this.setToggleListener(process);
		}
	}

	private isCollapsible(process : SchedulingApiAssignmentProcess) : boolean | null {
		if (Config.IS_MOBILE) return false;
		return this.userCanEdit(process);
	}

	private userCanEdit(process : SchedulingApiAssignmentProcess) : boolean | null {
		return this.rightsService.userCanEditAssignmentProcess(process);
	}

	/**
	 * Open or close this collapsible
	 */
	public onClickOpenToggle(process : SchedulingApiAssignmentProcess) : void {
		if (!this.userCanEdit(process)) return;
		process.collapsed = !process.collapsed;
	}

	/** Get a title for a SchedulingApiAssignmentProcessType */
	public titleForType(type : SchedulingApiAssignmentProcessType) : PDictionarySourceString {
		switch (type) {
			case SchedulingApiAssignmentProcessType.DR_PLANO:
				return 'Automatische Verteilung';
			case SchedulingApiAssignmentProcessType.EARLY_BIRD:
				return 'Der frühe Vogel';
			case SchedulingApiAssignmentProcessType.MANUAL:
				return 'Manuelle Verteilung';
		}
	}

	/** Get a text for a SchedulingApiAssignmentProcessType */
	public textForType(type : SchedulingApiAssignmentProcessType) : PDictionarySourceString {
		switch (type) {
			case SchedulingApiAssignmentProcessType.DR_PLANO:
				return 'Diese Verteilungsart kostet dich am wenigsten Zeit und ist zugleich besonders fair für das gesamte Team. Dr.&nbsp;Plano berücksichtigt dabei folgende Faktoren:';
			case SchedulingApiAssignmentProcessType.EARLY_BIRD:
				return 'Deine Angestellten tragen sich selbst für die freigegebenen Schichten ein. Wer am schnellsten ist, bekommt womöglich die besten Schichten. Daher ist das nicht die fairste Verteilungsart, aber sinnvoll, wenn es z.B. mal besonders schnell gehen soll.';
			case SchedulingApiAssignmentProcessType.MANUAL:
				return 'Bei dieser Verteilungsart bekommst du die Schichtwünsche deiner Angestellten. Anschließend musst du jede Schicht manuell besetzen. Das ist viel zeitaufwendiger als die automatische Verteilung, aber sinnvoll, wenn du bei der Verteilung sehr viele Sonderwünsche berücksichtigen möchtest.';
		}
	}

	/**
	 * Should the assignment processes box be visible?
	 */
	public get showAssignmentProcessesCard() : boolean {
		// This was undocumented. I just took it from the template.
		return !!this.userCanEditAssignmentProcesses || !!this.rightsService.userCanWriteAnyShiftModel || !!this.assignmentProcessesForList.length;
	}
}
