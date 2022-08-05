import { TemplateRef } from '@angular/core';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, HostBinding } from '@angular/core';
import { SchedulingApiRightGroup} from '@plano/shared/api';
import { SchedulingApiService, SchedulingApiRightGroups } from '@plano/shared/api';
import { SchedulingApiRightGroupRole } from '@plano/shared/api';
import { ModalService } from '@plano/shared/core/p-modal/modal.service';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { assumeNonNull } from '../../../shared/core/null-type-utils';

@Component({
	selector: 'p-rightgroup-header[rightGroups]',
	templateUrl: './rightgroup-header.component.html',
	styleUrls: ['./rightgroup-header.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class RightgroupHeaderComponent {
	public schedulingApiRightGroupRole : typeof SchedulingApiRightGroupRole = SchedulingApiRightGroupRole;
	@Input() public rightGroup : SchedulingApiRightGroup | null = null;
	@Output() private rightGroupChange : EventEmitter<SchedulingApiRightGroup | null> = new EventEmitter<SchedulingApiRightGroup | null>();
	@Input() public rightGroups ! : SchedulingApiRightGroups;

	@HostBinding('class.card') private _alwaysTrue = true;
	@HostBinding('class.bg-dark') private get hasBgDark() : boolean {
		return !!this.rightGroup;
	}

	constructor(
		public _api : SchedulingApiService,
		private modalService : ModalService,
		private localize : LocalizePipe,
	) {
	}

	public PlanoFaIconPool = PlanoFaIconPool;

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get api() : SchedulingApiService { return this._api; }

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public selectRightGroup(rightGroupItem : SchedulingApiRightGroup) : void {
		this.rightGroup = rightGroupItem;
		this.rightGroupChange.emit(rightGroupItem);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public editRightGroup(modalContent : TemplateRef<unknown>) : void {
		this.modalService.openModal(modalContent);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public isAdminRightGroup(rightGroup : SchedulingApiRightGroup | null) : boolean {
		return !!rightGroup && rightGroup.role === SchedulingApiRightGroupRole.CLIENT_OWNER;
	}
	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public setToAdminRightGroup() : void {
		assumeNonNull(this.rightGroup);
		this.rightGroup.role = SchedulingApiRightGroupRole.CLIENT_OWNER;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public isMemberRightGroup(rightGroup : SchedulingApiRightGroup | null) : boolean {
		return !!rightGroup && rightGroup.role === SchedulingApiRightGroupRole.CLIENT_DEFAULT;
	}
	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public setToMemberRightGroup() : void {
		assumeNonNull(this.rightGroup);
		this.rightGroup.role = SchedulingApiRightGroupRole.CLIENT_DEFAULT;
	}


	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public addRightGroup(modalContent : TemplateRef<unknown>) : void {
		const previousRightGroup = this.rightGroup;
		this.rightGroup = null;
		this.rightGroup = this.rightGroups.createNewItem();
		this.rightGroup.role = SchedulingApiRightGroupRole.CLIENT_DEFAULT;
		this.rightGroup.name = '';
		this.modalService.openModal(modalContent, {
			success: () => {
				this._api.save();
				this.rightGroupChange.emit(this.rightGroup);
			},
			dismiss: () => {
				assumeNonNull(this.rightGroup);
				this.rightGroups.removeItem(this.rightGroup);
				this.rightGroup = previousRightGroup;
			},
		});
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get hasRightGroupChangeBinding() : boolean {
		return this.rightGroupChange.observers.length > 0;
	}

	/**
	 * Check if this is the last existing admin group
	 */
	public lastExistingAdminGroup(rightGroup : SchedulingApiRightGroup) : boolean {
		if (rightGroup.role !== SchedulingApiRightGroupRole.CLIENT_OWNER) {
			return false;
		}
		let result = 0;
		for (const rightGroupItem of this.rightGroups.iterable()) {
			if (rightGroupItem.role === SchedulingApiRightGroupRole.CLIENT_OWNER) {
				++result;
			}
		}
		return result === 1;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public getTitleForRightGroup(rightGroup : SchedulingApiRightGroup | null) : string {
		return rightGroup?.name ?? this.localize.transform('Bitte wählen');
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public getTitleForTypeOfRightGroup(rightGroup : SchedulingApiRightGroup) : string {
		if (this.isAdminRightGroup(rightGroup)) return this.localize.transform('Admins');
		if (this.isMemberRightGroup(rightGroup)) return this.localize.transform('Mitarbeitende');
		return '-';
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get editableIsActive() : boolean {
		if (!this.rightGroup) return false;
		if (this.rightGroup.isNewItem()) return false;
		return true;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get translatedLabelForRole() : string {
		assumeNonNull(this.rightGroup);
		return this.localize.transform('Für wen ist ${name} gedacht?', {
			// eslint-disable-next-line no-autofix/@typescript-eslint/no-unnecessary-condition
			name: this.rightGroup.name ?? this.localize.transform('sie'),
		});
	}
}
