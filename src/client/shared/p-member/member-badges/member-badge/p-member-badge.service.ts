import { Injectable } from '@angular/core';
import { SchedulingApiMember, SchedulingApiMembers } from '@plano/shared/api';
import { Config } from '@plano/shared/core/config';
import { LogService } from '@plano/shared/core/log.service';
import { PartialNull } from '../../../../../shared/core/typescript-utils';
import { ISchedulingApiMember } from '../../../../scheduling/shared/api/scheduling-api.interfaces';

interface InitialLetterCounters { firstName : number; lastName : number; }

@Injectable({ providedIn: 'root' })
export class PMemberBadgeService {
	private initials : {memberId : SchedulingApiMember['id'] | null, initial : string | null}[] = [];

	constructor(
		private console : LogService,
	) {}

	/**
	 * Checks if the letter-pos in alphabet is lower, equal or higher.
	 * @returns
	 * -1 if lower
	 * 0 if equal
	 * 1 if higher
	 */
	private relativePositionInAlphabet(name : string, otherName : string, index : number) : number {
		const oneLetter = name.charAt(index).toLowerCase();
		const otherLetter = otherName.charAt(index).toLowerCase();

		if (oneLetter === ' ' || otherLetter === ' ') return 0;
		if (oneLetter === otherLetter) return 0;
		if (oneLetter < otherLetter) return -1;
		return 1;
	}

	/**
	 * Get initials for this member from the storage if possible.
	 */
	private getInitialsFromStorage(memberId : SchedulingApiMember['id'] | null) : string | null {
		// If the initials have been generated once, find them in the array.
		if (!memberId) {
			if (Config.DEBUG) this.console.error('No memberId!');
			return null;
		}
		const initialFromArray = this.initials.find(item => {
			if (!item.memberId) {
				if (Config.DEBUG) this.console.error('No item.memberId!');
				return false;
			}
			return item.memberId.equals(memberId);
		});
		if (!initialFromArray) return null;
		return initialFromArray.initial;
	}

	private membersAreEqual(
		memberOne : { firstName : SchedulingApiMember['firstName'], lastName : SchedulingApiMember['lastName'] },
		memberTwo : { firstName : SchedulingApiMember['firstName'], lastName : SchedulingApiMember['lastName'] },
	) : boolean {
		return (
			memberOne.firstName.replace(/ \(gelöscht\)/, '') === memberTwo.firstName.replace(/ \(gelöscht\)/, '') &&
			memberOne.lastName === memberTwo.lastName
		);
	}

	/**
	 * Count how many letters the initials of first and last name need to make these two members unique against each other
	 */
	private getMinLetterCounters(
		memberOne : { firstName : SchedulingApiMember['firstName'], lastName : SchedulingApiMember['lastName'] },
		memberTwo : { firstName : SchedulingApiMember['firstName'], lastName : SchedulingApiMember['lastName'] },
	) : {
			firstName : number,
			lastName : number,
		} {
		// both members are equal?
		if (this.membersAreEqual(memberOne, memberTwo)) return { firstName: 1, lastName: 1 };

		//
		// Calculate min counters
		//
		let firstNameIndex = 0;
		let lastNameIndex = 0;
		let relatedPosFirstName = this.relativePositionInAlphabet(memberOne.firstName, memberTwo.firstName, firstNameIndex);
		let relatedPosLastName = this.relativePositionInAlphabet(memberOne.lastName, memberTwo.lastName, lastNameIndex);

		// Skip if the letter of otherMember's firstName is lower in the alphabet than the members letter
		if (relatedPosFirstName === -1) return { firstName: firstNameIndex + 1, lastName: lastNameIndex + 1 };
		// Skip if the letter of otherMember's lastName is lower in the alphabet than the members letter
		if (relatedPosLastName === -1) return { firstName: firstNameIndex + 1, lastName: lastNameIndex + 1 };

		// member and otherMember would have the same initials. So lets give them more letters.
		while (relatedPosFirstName === 0 && relatedPosLastName === 0) {
			if ((firstNameIndex + lastNameIndex) % 2 === 0) {
				// Index of letter-iteration is EVEN? Then append a letter to first name.
				firstNameIndex++;
				relatedPosFirstName = this.relativePositionInAlphabet(memberOne.firstName, memberTwo.firstName, firstNameIndex);
			} else {
				// Index of letter-iteration is ODD? Then append a letter to last name.
				lastNameIndex++;
				relatedPosLastName = this.relativePositionInAlphabet(memberOne.lastName, memberTwo.lastName, lastNameIndex);
			}
		}

		return { firstName: firstNameIndex + 1, lastName: lastNameIndex + 1 };
	}

	private isValidMemberName(member : PartialNull<Pick<ISchedulingApiMember, 'firstName' | 'lastName'>>) : member is Pick<ISchedulingApiMember, 'firstName' | 'lastName'> {
		if (!member.firstName) return false;
		if (!member.lastName) return false;
		if (!member.firstName.length) return false;
		if (!member.lastName.length) return false;
		return true;
	}

	/**
	 * Reset initials
	 */
	public resetInitials() : void {
		this.initials = [];
	}

	private cutNames(member : Pick<ISchedulingApiMember, 'firstName' | 'lastName'>, lengthOfFirstPart : number, lengthOfLastPart : number) : string {
		let result = '';
		for (let i = 0; i < lengthOfFirstPart; i++) result += member.firstName.charAt(i);
		for (let i = 0; i < lengthOfLastPart; i++) result += member.lastName.charAt(i);
		return result;
	}

	/**
	 * Some clients are sensible about some initials. They don’t want to see some initials of their employees,
	 * because they associate these initials with abbreviations they don’t want to be reminded of.
	 * Example: »Susanne Schmidt« turns to »SS« which was the abbreviation of Schutzstaffel in Nazi-Germany.
	 * I know its wired… i would not want to change the initials of our users. But i am sick of the discussion.
	 * So i created this method that customizes the affected member initials.
	 *
	 * I dedicate this function to Karl Marx, Sigmund Freud and Kurt Tucholsky.
	 *
	 * More information for lists of forbidden content:
	 * https://de.wikipedia.org/wiki/Bücherverbrennung_1933_in_Deutschland
	 */
	private isForbiddenAbbreviation(result : string) : boolean {
		if (!result) return false;
		const resultLowerCase = result.toLowerCase();
		switch (resultLowerCase) {
			case 'ss': return true; // Schutzstaffel
			case 'sa': return true; // Sturmabteilung
			case 'sd': return true; // Sicherheitsdienst des Reichsführers SS
			case 'bh': return true; // Blood and Honour
			case 'ns': return true; // Nationalsozialismus
			case 'nsu': return true; // Nationalsozialistischer Untergrund
			case 'wc': return true; // Water Closet
			case 'kz': return true; // Konzentrationslager
			case 'ah': return true; // Adolf Hitler
			case 'hh': return true; // Heil Hitler
			case 'is': return true; // Islamischer Staat
			case 'aa': return true; // Anonyme Alkoholiker
			case 'sm': return true; // Sadomasochismus
			case 'gv': return true; // Geschlechtsverkehr
			case 'kkk': return true; // Ku-Klux-Klan
			case 'wp': return true; // White Power
			case 'npd': return true; // Nationaldemokratische Partei Deutschlands
			case 'afd': return true; // Sogenannte »Alternative für Deutschland«
			default: return false;
		}
	}

	private generateInitials(
		member : Pick<ISchedulingApiMember, 'firstName' | 'lastName'>,
		initialLetterCounters : InitialLetterCounters,
	) : string {
		let result = '';
		result = this.cutNames(member, initialLetterCounters.firstName, initialLetterCounters.lastName);

		// Generated Names are too long? Try Fallbacks
		if (result.length > 5) result = this.cutNames(member, initialLetterCounters.firstName, 2);
		if (result.length > 5) result = this.cutNames(member, 2, initialLetterCounters.lastName);
		if (result.length > 5) result = this.cutNames(member, 2, 3);

		// If this is a forbidden abbreviation, add a letter to the first-name
		while (this.isForbiddenAbbreviation(result)) {
			if (initialLetterCounters.firstName < member.firstName.length) {
				// Try more first name letters in the next run.
				initialLetterCounters.firstName = initialLetterCounters.firstName + 1;
			} else if (initialLetterCounters.lastName < member.lastName.length) {
				// Try more last name letters in the next run.
				initialLetterCounters.lastName = initialLetterCounters.lastName + 1;
			} else {
				// The initials already contain the full name. There is nothing we can do about it ¯\_(ツ)_/¯
				break;
			}
			result = this.cutNames(member, initialLetterCounters.firstName, initialLetterCounters.lastName);
		}

		return result;
	}

	/**
	 * Get generated initials.
	 */
	private initStorage(
		member : PartialNull<Pick<ISchedulingApiMember, 'firstName' | 'lastName' | 'id' | 'trashed'>>,
		allMembers : SchedulingApiMembers | null = null,
	) : string | null {
		// Member has no valid member name? Then its probably a new member with no name yet.
		if (!this.isValidMemberName(member)) return null;

		// We don‘t care about duplicate initials if a member is trashed. So generate the minimum.
		// Minimum is: first letter of firstName and first letter of lastName.
		if (member.trashed) return this.generateInitials(member, { firstName: 1, lastName: 1 });

		// If this is a new Member, we don’t care about duplicate initials because of performance during changes on the name.
		if (member.id === null) return this.generateInitials(member, { firstName: 1, lastName: 1 });

		if (!allMembers) return null;

		// This holds the information of how many letters are needed to generate account-wide unique initials.
		const letterCounters : InitialLetterCounters = { firstName : 1, lastName : 1 };

		// Iterate other members
		for (const otherMember of allMembers.iterable()) {
			// Ignore deleted members
			if (otherMember.trashed) continue;

			// Skip if this is the wanted member
			if (member.id.equals(otherMember.id)) continue;

			// If there is a similar member, then calculate how many letters are needed to make both unique.
			const counters = this.getMinLetterCounters(member, otherMember);
			if (counters.firstName > letterCounters.firstName) letterCounters.firstName = counters.firstName;
			if (counters.lastName > letterCounters.lastName) letterCounters.lastName = counters.lastName;
		}

		return this.generateInitials(member, letterCounters);
	}

	/**
	 * Get unique initials for every user.
	 */
	public getInitials(
		member : PartialNull<Pick<ISchedulingApiMember, 'firstName' | 'lastName' | 'id' | 'trashed'>>,
		allMembers : SchedulingApiMembers | null = null,
	) : string | null {
		let result : string | null = null;

		// If the initials have already been generated, find them in the array.
		result = this.getInitialsFromStorage(member.id);
		if (result) return result;

		// Initials have not been generated yet. So lets do this now.
		result = this.initStorage(member, allMembers);
		// Store these initials, so they don’t have to get generated multiple times.
		this.initials.push({ memberId : member.id, initial: result });

		return result;
	}
}
