import { Injectable, NgZone } from '@angular/core';
import { SchedulingApiBirthday, SchedulingApiBirthdays } from './scheduling-api-birthday.service';
import { SchedulingApiService } from './scheduling-api.service';
import { SchedulingApiMembers} from './scheduling-api.service';
import { DataInput } from '../../../../shared/core/data/data-input';
import { PServiceInterface } from '../../../../shared/core/p-service.interface';
import { PMomentService } from '../../../shared/p-moment.service';

@Injectable({providedIn: 'root'})
export class BirthdayService extends DataInput implements PServiceInterface {
	constructor(
		protected override zone : NgZone,
		public api : SchedulingApiService,
		private pMoment : PMomentService,
	) {
		super(zone);
	}

	public _birthdays : BirthdayService['birthdays'] = new SchedulingApiBirthdays(null, null, false);

	/**
	 * A stack of all birthdays available for this account
	 */
	public get birthdays() : SchedulingApiBirthdays {
		if (!this.api.isLoaded()) return new SchedulingApiBirthdays(null, null, false);
		if (this._birthdays.length === 0) this.addMembersFromApi();
		return this._birthdays;
	}

	private addMembersFromApi() : void {
		const membersWithBirthdays = this.api.data.members.filterBy(item => !!item.birthday);
		if (membersWithBirthdays.length === 0) return;
		this.addMembersToList(membersWithBirthdays);
	}

	private addMembersToList(members : SchedulingApiMembers) : void {
		const birthdays = members.filterBy(item => !!item.birthday).map(item => {
			const birthday = new SchedulingApiBirthday();
			birthday.firstName = item.firstName;
			birthday.lastName = item.lastName;
			birthday.day = +this.pMoment.m(item.birthday).get('date') as SchedulingApiBirthday['day'];
			birthday.month = +this.pMoment.m(item.birthday).get('month') as SchedulingApiBirthday['month'];
			birthday.memberId = item.id;
			return birthday;
		});
		for (const birthday of birthdays) {
			this._birthdays.push(birthday);
		}
	}

	/** @see PServiceInterface['unload'] */
	public unload() : void {
		this._birthdays = new SchedulingApiBirthdays(null, null, false);
	}

	/** @see PServiceInterface['initValues'] */
	public initValues() : void {
	}
}
