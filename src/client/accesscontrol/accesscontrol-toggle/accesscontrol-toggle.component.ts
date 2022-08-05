import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { SchedulingApiRightGroupShiftModelRight} from '@plano/shared/api';
import { SchedulingApiService } from '@plano/shared/api';
import { SchedulingApiShiftModel } from '@plano/shared/api';
import { SchedulingApiRightGroup } from '@plano/shared/api';
import { SchedulingApiRightGroupRole } from '@plano/shared/api';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { assumeDefinedToGetStrictNullChecksRunning, assumeNonNull } from '../../../shared/core/null-type-utils';

@Component({
	selector: 'p-accesscontrol-toggle[item][rightGroup]',
	templateUrl: './accesscontrol-toggle.component.html',
	styleUrls: ['./accesscontrol-toggle.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class AccessControlToggleComponent {
	public hovered : boolean = false;
	@Input() public item ! : SchedulingApiShiftModel | string;
	@Input() public rightGroup ! : SchedulingApiRightGroup;

	@Input() public disabled : boolean = false;

	constructor(
		public api : SchedulingApiService,
	) {
	}

	public PlanoFaIconPool = PlanoFaIconPool;

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get settingExistsForThisArea() : boolean {
		assumeDefinedToGetStrictNullChecksRunning(this.rightGroup, 'rightGroup', 'this should be impossible');
		let parentName : string;
		if (this.item instanceof SchedulingApiShiftModel) {
			parentName = this.item.parentName;
			return !this.rightGroup.shiftModelRights.getByShiftModelParent(parentName) ? true : false;
		}
		parentName = this.item;
		return !this.rightGroup.shiftModelRights.getByShiftModelParent(parentName) ? false : true;

	}

	/**
	 * Get shiftModelRight if possible
	 */
	private get shiftModelRight() : SchedulingApiRightGroupShiftModelRight | null {
		return this.rightGroup.shiftModelRights.getByItem(this.item);
	}

	/**
	 * Create shiftModelRight if there is no existing
	 */
	private createShiftModelRightIfNecessary() : void {
		if ((this.item instanceof SchedulingApiShiftModel) && this.rightGroup.shiftModelRights.getByShiftModel(this.item)) {
			return;
		}
		if ((typeof this.item === 'string') && this.rightGroup.shiftModelRights.getByShiftModelParent(this.item)) {
			return;
		}

		// no shiftModelRight item available?

		const parentRight = this.shiftModelRight;

		// create new one
		const RIGHT = this.rightGroup.shiftModelRights.createNewItem();

		if (this.item instanceof SchedulingApiShiftModel) {
			RIGHT.shiftModelId = this.item.id;
		} else {
			RIGHT.shiftModelParentName = this.item;
		}

		// set default values
		const defaultValue = (this.rightGroup.role === SchedulingApiRightGroupRole.CLIENT_OWNER);

		RIGHT.canRead = parentRight ? parentRight.canRead : defaultValue;
		RIGHT.canWrite = parentRight ? parentRight.canWrite : defaultValue;
		RIGHT.canGetManagerNotifications = parentRight ? parentRight.canGetManagerNotifications : defaultValue;
	}

	/**
	 * Toggle the state of the visibility button
	 */
	public toggleCanRead() : void {
		this.createShiftModelRightIfNecessary();
		assumeNonNull(this.shiftModelRight);
		this.shiftModelRight.canRead = !this.shiftModelRight.canRead;
	}

	/**
	 * Toggle the state of the editability button
	 * Everything that will be pEditable will also be visible
	 */
	public toggleCanWrite() : void {
		this.createShiftModelRightIfNecessary();

		assumeNonNull(this.shiftModelRight);
		this.shiftModelRight.canWrite = !this.shiftModelRight.canWrite;
	}

	/**
	 * Toggle the state of the editability button
	 * Everything that will be pEditable will also be visible
	 */
	public toggleCanGetManagerNotifications() : void {
		this.createShiftModelRightIfNecessary();

		assumeNonNull(this.shiftModelRight);
		this.shiftModelRight.canGetManagerNotifications = !this.shiftModelRight.canGetManagerNotifications;
	}

	/**
	 * Toggle the state of the editability button
	 * Everything that will be pEditable will also be visible
	 */
	public toggleCanManageBookings() : void {
		this.createShiftModelRightIfNecessary();

		assumeNonNull(this.shiftModelRight);
		this.shiftModelRight.canWriteBookings = !this.shiftModelRight.canWriteBookings;
	}

	/**
	 * Toggles the right to online-refund.
	 */
	public toggleCanOnlineRefund() : void {
		this.createShiftModelRightIfNecessary();

		assumeNonNull(this.shiftModelRight);
		this.shiftModelRight.canOnlineRefund = !this.shiftModelRight.canOnlineRefund;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get isMemberRightGroup() : boolean {
		return this.rightGroup.role === SchedulingApiRightGroupRole.CLIENT_DEFAULT;
	}

}
