import { HttpParams } from '@angular/common/http';
import { Component, ChangeDetectionStrategy, HostBinding } from '@angular/core';
import { SLIDE_ON_NGIF_TRIGGER } from '@plano/animations';
import { SchedulingApiNotificationSettingsSettingsForDeviceType, SchedulingApiNotificationSettingsSettingsForDeviceTypeNotificationGroup} from '@plano/shared/api';
import { SchedulingApiService } from '@plano/shared/api';
import { SchedulingApiNotificationSettingsDeviceType, SchedulingApiNotificationSettingsNotificationGroup, SchedulingApiNotificationSettingsNotificationTitle } from '@plano/shared/api';
import { FaIcon } from '@plano/shared/core/component/fa-icon/fa-icon-types';
import { Config } from '@plano/shared/core/config';
import { MeService } from '@plano/shared/core/me/me.service';
import { PRequestWebPushNotificationPermissionContext, PPushNotificationsService } from '@plano/shared/core/p-push-notifications.service';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { Data } from '../../shared/core/data/data';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../shared/core/null-type-utils';
import { PThemeEnum } from '../shared/bootstrap-styles.enum';

@Component({
	selector: 'p-notifications',
	templateUrl: './notifications.component.html',
	styleUrls: ['./notifications.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
	animations: [SLIDE_ON_NGIF_TRIGGER],
})
export class NotificationsComponent {
	@HostBinding('class.flex-grow-1')
	@HostBinding('class.d-flex')
	@HostBinding('class.position-relative')
	@HostBinding('class.h-100') protected _alwaysTrue = true;

	public readonly CONFIG : typeof Config = Config;
	public pRequestWebPushNotificationPermissionContext = PRequestWebPushNotificationPermissionContext;
	private _notificationGroupTitles = new Data<SchedulingApiNotificationSettingsNotificationTitle[]>(this.api);
	private _notificationGroups = new Data<SchedulingApiNotificationSettingsNotificationGroup[][]>(this.api);

	constructor(
		public pushNotifications : PPushNotificationsService,
		public api : SchedulingApiService,
		private localize : LocalizePipe,
		private meService : MeService,
	) {
		this.api.load({
			searchParams: new HttpParams().set('data', 'notificationSettings'),
		});
	}

	/**
	 * Headlines for NotificationGroup (Tauschbörse, Verkäufe, Stempeluhr, Schichtbesetzung)
	 */
	public get notificationGroupTitles() : SchedulingApiNotificationSettingsNotificationTitle[] {
		return this._notificationGroupTitles.get(() => {
			const keys = Object.keys(SchedulingApiNotificationSettingsNotificationTitle).
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
				filter((k) => typeof SchedulingApiNotificationSettingsNotificationTitle[k as any] === 'number');

			const groupTitles = new Array<SchedulingApiNotificationSettingsNotificationTitle>();
			for (const key of keys) {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				groupTitles.push((SchedulingApiNotificationSettingsNotificationTitle as any)[key]);
			}

			return groupTitles;
		});
	}

	/**
	 * Headlines for all NotificationGroupItems of each NotificationGroup
	 */
	public get notificationGroups() : SchedulingApiNotificationSettingsNotificationGroup[][] {
		return this._notificationGroups.get(() => {
			const result : SchedulingApiNotificationSettingsNotificationGroup[][] = [];
			for (const title of this.notificationGroupTitles) {
				// for each title get the items
				if (this.api.data.notificationSettings.settingsForDeviceTypes.length === 0) {
					result.push([]);
				} else {
					const groups = new Array<SchedulingApiNotificationSettingsNotificationGroup>();

					// All settings have the same groups. So, it is fine to check just the first setting.
					const settingsForDevice = this.api.data.notificationSettings.settingsForDeviceTypes.get(0)!;
					for (const notificationGroupItem of settingsForDevice.notificationGroups.iterable()) {
						if (notificationGroupItem.title === title) {
							groups.push(notificationGroupItem.group);
						}
					}

					result.push(groups);
				}
			}
			return result;
		});
	}

	public PThemeEnum = PThemeEnum;

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public getDeviceTypeIcon(deviceType : SchedulingApiNotificationSettingsDeviceType) : FaIcon {
		switch (deviceType) {
			case SchedulingApiNotificationSettingsDeviceType.WEB_PUSH_NOTIFICATION:
				return 'desktop';

			case SchedulingApiNotificationSettingsDeviceType.APP_PUSH_NOTIFICATION:
				return 'mobile-alt';

			case SchedulingApiNotificationSettingsDeviceType.MAIL:
				return PlanoFaIconPool.EMAIL_NOTIFICATION;

			default:
				throw new Error('Unsupported case');
		}
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public getDeviceTypeLabel(deviceType : SchedulingApiNotificationSettingsDeviceType) : string {
		switch (deviceType) {
			case SchedulingApiNotificationSettingsDeviceType.WEB_PUSH_NOTIFICATION:
				return this.localize.transform('Browser Push Nachricht');

			case SchedulingApiNotificationSettingsDeviceType.APP_PUSH_NOTIFICATION:
				return this.localize.transform('App Push Nachricht');

			case SchedulingApiNotificationSettingsDeviceType.MAIL:
				return this.localize.transform('Email');

			default:
				throw new Error('Unsupported case');
		}
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public findSettingsForDeviceType(deviceType : SchedulingApiNotificationSettingsDeviceType) : SchedulingApiNotificationSettingsSettingsForDeviceType | null {
		for (const settings of this.api.data.notificationSettings.settingsForDeviceTypes.iterable()) {
			if (settings.deviceType === deviceType)
				return settings;
		}

		return null;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public findNotificationGroupItem(
		settingsForDeviceType : SchedulingApiNotificationSettingsSettingsForDeviceType,
		notificationGroup : SchedulingApiNotificationSettingsNotificationGroup,
	) : SchedulingApiNotificationSettingsSettingsForDeviceTypeNotificationGroup | null {
		for (const groupItem of settingsForDeviceType.notificationGroups.iterable()) {
			if (groupItem.group === notificationGroup) {
				return groupItem;
			}
		}

		return null;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public getNotificationGroupIcon(
		notificationGroup : SchedulingApiNotificationSettingsNotificationGroup,
	) : FaIcon | null {
		switch (notificationGroup) {
			case SchedulingApiNotificationSettingsNotificationGroup.COURSE_INQUIRY_ARRIVED:
				return 'inbox';
			case SchedulingApiNotificationSettingsNotificationGroup.COURSE_INQUIRY_DECLINED:
				return 'times';
			case SchedulingApiNotificationSettingsNotificationGroup.COURSE_BOOKED:
				return 'check';
			case SchedulingApiNotificationSettingsNotificationGroup.COURSE_BOOKING_CANCELED_BY_MEMBER:
			case SchedulingApiNotificationSettingsNotificationGroup.COURSE_BOOKING_CANCELED_BY_BOOKING_PERSON:
			case SchedulingApiNotificationSettingsNotificationGroup.COURSE_BOOKING_CANCELED_MANUAL_REFUND_NEEDED:
				return 'times';
			case SchedulingApiNotificationSettingsNotificationGroup.COURSE_INFORM_BOOKING_COMMENT:
				return ['far', 'comment-dots'];
			case SchedulingApiNotificationSettingsNotificationGroup.ONLINE_PAYMENT_FAILED:
				return 'coins';
			case SchedulingApiNotificationSettingsNotificationGroup.ONLINE_REFUNDED_BY_MEMBER:
				return 'coins';
			case SchedulingApiNotificationSettingsNotificationGroup.ONLINE_REFUND_FAILED:
				return 'coins';
			case SchedulingApiNotificationSettingsNotificationGroup.VOUCHER_NEW_ITEM:
				return PlanoFaIconPool.ITEMS_VOUCHER;
			default:
				return null;
		}
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public getNotificationGroupDescription(
		notificationGroup : SchedulingApiNotificationSettingsNotificationGroup,
	) : string | null {
		switch (notificationGroup) {
			case SchedulingApiNotificationSettingsNotificationGroup.SHIFT_EXCHANGE_GENERAL:
				return this.localize.transform('Nachrichten zu deiner eigenen Ersatzsuche oder Krankmeldung. Sowie wichtige Infos zur Ersatzsuche von anderen, wo du involviert bist.');

			case SchedulingApiNotificationSettingsNotificationGroup.SHIFT_EXCHANGE_REMINDER:
				return this.localize.transform('Wenn jemand seit Tagen wegen einer Ersatzsuche auf deine Antwort wartet.');

			case SchedulingApiNotificationSettingsNotificationGroup.COURSE_INQUIRY_ARRIVED:
			case SchedulingApiNotificationSettingsNotificationGroup.COURSE_INQUIRY_DECLINED:
			case SchedulingApiNotificationSettingsNotificationGroup.COURSE_BOOKED:
				return this.localize.transform('Tipp: Die Email-Benachrichtigung enthält auch eine Kopie der automatischen Emails, die an deine Kunden verschickt wurden.');
			case SchedulingApiNotificationSettingsNotificationGroup.COURSE_BOOKING_CANCELED_BY_MEMBER:
				return `${this.localize.transform('Bei manueller Stornierung einer Buchung in Dr.&nbsp;Plano durch dich selbst oder einen anderen User.')}<br>${ this.localize.transform('Tipp: Die Email-Benachrichtigung enthält auch eine Kopie der automatischen Emails, die an deine Kunden verschickt wurden.')}`;
			case SchedulingApiNotificationSettingsNotificationGroup.COURSE_BOOKING_CANCELED_BY_BOOKING_PERSON:
				return `${this.localize.transform('Ein Kunde hat selbst online storniert.')}<br>${this.localize.transform('Tipp: Die Email-Benachrichtigung enthält auch eine Kopie der automatischen Emails, die an deine Kunden verschickt wurden.')}`;
			case SchedulingApiNotificationSettingsNotificationGroup.COURSE_BOOKING_CANCELED_MANUAL_REFUND_NEEDED:
				return this.localize.transform('Nach einer Stornierung ist eine Rückerstattung fällig, die manuell ausgeführt werden muss. Entweder, weil die automatische Rückerstattung deaktiviert ist, oder weil nicht genügend Online-Guthaben dafür zur Verfügung steht.');

			case SchedulingApiNotificationSettingsNotificationGroup.COURSE_INFORM_BOOKING_COMMENT:
				return `${this.localize.transform('Deine Kunden können im Buchungsprozess einen Kommentar hinterlegen. Falls du dich nicht über jede Buchung & Anfrage benachrichtigen lässt, empfehlen wir dir diese Benachrichtigung einzuschalten.')}<br>${this.localize.transform('Tipp: Die Email-Benachrichtigung enthält auch eine Kopie der automatischen Emails, die an deine Kunden verschickt wurden.')}`;

			case SchedulingApiNotificationSettingsNotificationGroup.COURSE_NOT_REACHED_MIN_PARTICIPANT_COUNT:
				return this.localize.transform('Nach Ablauf der Buchungsfrist oder spätestens zwei Tage vor Angebotstermin.');

			case SchedulingApiNotificationSettingsNotificationGroup.COURSE_REACHED_MIN_PARTICIPANT_COUNT:
				return this.localize.transform('Sobald die Mindestteilnehmendenzahl erreicht wurde.');

			case SchedulingApiNotificationSettingsNotificationGroup.TIME_STAMP_NOT_STAMPED:
				return this.localize.transform('Falls du vergisst, eine geplante Schicht ein- oder auszustempeln, bekommst du spätestens am Folgetag eine Erinnerung.');

			case SchedulingApiNotificationSettingsNotificationGroup.TIME_STAMP_INFORM_OWNER_MEMBER_NOT_USED:
				return this.localize.transform(`Nach dem Gesetz müssen Angestellte innerhalb von 7 Tagen nach einer Schicht ihre Arbeitszeit gestempelt haben. Tun sie es trotz Erinnerung von Dr.&nbsp;Plano nicht, wirst du benachrichtigt.`);

			case SchedulingApiNotificationSettingsNotificationGroup.VOUCHER_NEW_ITEM:
				return this.localize.transform('Du wirst über jeden neuen Gutscheinverkauf informiert.');

			case SchedulingApiNotificationSettingsNotificationGroup.SHIFT_EXCHANGE_ITEM_SUCCESSFUL_WITH_WARNINGS:
				return this.localize.transform('Probleme können sein: Überschreitung des Maximallohns, Schichtabstände etc.');

			case SchedulingApiNotificationSettingsNotificationGroup.SHIFTS_ASSIGNMENT_PROCESS_GENERAL:
				return this.localize.transform('Nachrichten wie: Bitte Schichtwünsche abgeben; bitte in Schichten / Kursen eintragen; Schichtplan veröffentlicht etc.');

			case SchedulingApiNotificationSettingsNotificationGroup.SHIFTS_ASSIGNMENT_PROCESS_REMINDER:
				return this.localize.transform('Wenn du bis kurz vor Ablauf der Frist noch keine Schichtwünsche abgegeben oder vergessen hast, dich in Schichten einzutragen.');

			case SchedulingApiNotificationSettingsNotificationGroup.SHIFTS_ASSIGNMENT_PROCESS_REPORTS:
				return this.localize.transform('Du erhältst wichtige Berichte im Rahmen von Verteilungsvorgängen.');

			case SchedulingApiNotificationSettingsNotificationGroup.SHIFTS_ASSIGNMENT_CHANGED:
				return this.localize.transform('Wenn deine Personalleitung dich aus einer Schicht entfernt oder dir eine neue zuweist.');

			case SchedulingApiNotificationSettingsNotificationGroup.SHIFTS_ASSIGNMENT_REMINDER:
				return this.localize.transform('Einmal pro Tag wirst du an deine morgigen Schichten erinnert.');

			case SchedulingApiNotificationSettingsNotificationGroup.SHIFTS_COURSE_CANCELED:
				return this.localize.transform('Falls ein von dir geleitetes Angebot (z.B. ein Kurs) storniert wird.');

			case SchedulingApiNotificationSettingsNotificationGroup.ONLINE_PAYMENT_FAILED:
				return `${this.localize.transform('Du wirst benachrichtigt, wenn die Online-Zahlung eines Kunden fehlschlägt und der Kunde die Zahlung erneut vornehmen muss.')}<br>${this.localize.transform('Tipp: Die Email-Benachrichtigung enthält auch eine Kopie der automatischen Emails, die an deine Kunden verschickt wurden.')}`;

			case SchedulingApiNotificationSettingsNotificationGroup.ONLINE_REFUNDED_BY_MEMBER:
				return this.localize.transform('Benachrichtigung über jede Online-Rückerstattung an Kunden, die von einem <strong>anderen</strong> User in Dr.Plano veranlasst wird.');
			case SchedulingApiNotificationSettingsNotificationGroup.ONLINE_REFUND_FAILED:
				return this.localize.transform('Benachrichtigung über jede fehlgeschlagene Online-Rückerstattung.');

			default:
				return null;
		}
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public getNotificationGroupLabel(
		notificationGroup : SchedulingApiNotificationSettingsNotificationGroup,
	) : string {
		switch (notificationGroup) {
			case SchedulingApiNotificationSettingsNotificationGroup.SHIFTS_ASSIGNMENT_PROCESS_GENERAL:
				return this.localize.transform('Grundlegendes für Schichtverteilungen');

			case SchedulingApiNotificationSettingsNotificationGroup.SHIFTS_ASSIGNMENT_PROCESS_REMINDER:
				return this.localize.transform('Erinnerung an Schichtverteilungen');

			case SchedulingApiNotificationSettingsNotificationGroup.SHIFTS_ASSIGNMENT_PROCESS_REPORTS:
				return this.localize.transform('Schichtverteilung abgeschlossen');

			case SchedulingApiNotificationSettingsNotificationGroup.SHIFTS_ASSIGNMENT_CHANGED:
				return this.localize.transform('Änderungen in deiner Schichtbesetzung');

			case SchedulingApiNotificationSettingsNotificationGroup.SHIFTS_ASSIGNMENT_REMINDER:
				return this.localize.transform('Schicht-Erinnerung');

			case SchedulingApiNotificationSettingsNotificationGroup.SHIFTS_COURSE_CANCELED:
				return this.localize.transform('Stornierung');

			case SchedulingApiNotificationSettingsNotificationGroup.TIME_STAMP_NOT_STAMPED:
				return this.localize.transform('Vergessen zu stempeln');

			case SchedulingApiNotificationSettingsNotificationGroup.TIME_STAMP_INFORM_OWNER_MEMBER_NOT_USED:
				return this.localize.transform('Jemand hat nicht gestempelt');

			case SchedulingApiNotificationSettingsNotificationGroup.COURSE_NOT_REACHED_MIN_PARTICIPANT_COUNT:
				return this.localize.transform('Mindestteilnehmendenzahl nicht erreicht');

			case SchedulingApiNotificationSettingsNotificationGroup.COURSE_REACHED_MIN_PARTICIPANT_COUNT:
				return this.localize.transform('Mindestteilnehmendenzahl erreicht');

			case SchedulingApiNotificationSettingsNotificationGroup.COURSE_INQUIRY_ARRIVED:
				return this.localize.transform('Neue Buchungsanfrage eingegangen');

			case SchedulingApiNotificationSettingsNotificationGroup.COURSE_INQUIRY_DECLINED:
				return this.localize.transform('Buchungsanfrage abgelehnt');

			case SchedulingApiNotificationSettingsNotificationGroup.COURSE_BOOKED:
				return this.localize.transform('Neue Buchung');

			case SchedulingApiNotificationSettingsNotificationGroup.COURSE_INFORM_BOOKING_COMMENT:
				return this.localize.transform('Neue Buchung bzw. Anfrage mit Kundenkommentar');

			case SchedulingApiNotificationSettingsNotificationGroup.COURSE_BOOKING_CANCELED_BY_MEMBER:
				return this.localize.transform('Buchung storniert durch User');
			case SchedulingApiNotificationSettingsNotificationGroup.COURSE_BOOKING_CANCELED_BY_BOOKING_PERSON:
				return this.localize.transform('Buchung storniert vom Kunden selbst');
			case SchedulingApiNotificationSettingsNotificationGroup.COURSE_BOOKING_CANCELED_MANUAL_REFUND_NEEDED:
				return this.localize.transform('Buchung storniert und manuelle Rückerstattung nötig');

			case SchedulingApiNotificationSettingsNotificationGroup.VOUCHER_NEW_ITEM:
				return this.localize.transform('Gutschein verkauft');

			case SchedulingApiNotificationSettingsNotificationGroup.SHIFT_EXCHANGE_GENERAL:
				return this.localize.transform('Grundlegende Nachrichten');

			case SchedulingApiNotificationSettingsNotificationGroup.SHIFT_EXCHANGE_REMINDER:
				return this.localize.transform('Erinnerung: Bitte antworten!');

			case SchedulingApiNotificationSettingsNotificationGroup.SHIFT_EXCHANGE_ITEM_CREATED:
				return this.localize.transform('Jede neue Ersatzsuche');

			case SchedulingApiNotificationSettingsNotificationGroup.SHIFT_EXCHANGE_ITEM_SUCCESSFUL_WITH_WARNINGS:
				return this.localize.transform('Jede abgeschlossene Ersatzsuche mit Problemen');

			case SchedulingApiNotificationSettingsNotificationGroup.SHIFT_EXCHANGE_ITEM_SUCCESSFUL:
				return this.localize.transform('Jede abgeschlossene Ersatzsuche');

			case SchedulingApiNotificationSettingsNotificationGroup.SHIFT_EXCHANGE_ITEM_FAILED:
				return this.localize.transform('Jede gescheiterte Ersatzsuche');

			case SchedulingApiNotificationSettingsNotificationGroup.ONLINE_PAYMENT_FAILED:
				return this.localize.transform('Online-Zahlung fehlgeschlagen');
			case SchedulingApiNotificationSettingsNotificationGroup.ONLINE_REFUNDED_BY_MEMBER:
				return this.localize.transform('Online-Rückerstattung veranlasst');
			case SchedulingApiNotificationSettingsNotificationGroup.ONLINE_REFUND_FAILED:
				return this.localize.transform('Online-Rückerstattung fehlgeschlagen');

			default:
				throw new Error('Unsupported case');
		}
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public showIsRecommendedToReceiveWarning(
		notificationGroup : SchedulingApiNotificationSettingsNotificationGroup,
	) : boolean {
		for (const settingsForDeviceType of this.api.data.notificationSettings.settingsForDeviceTypes.iterable()) {
			const notificationGroupItem = this.findNotificationGroupItem(settingsForDeviceType, notificationGroup)!;

			assumeDefinedToGetStrictNullChecksRunning(notificationGroupItem, 'notificationGroupItem');
			if (!notificationGroupItem.recommendedToReceive || notificationGroupItem.enabled) {
				return false;
			}
		}

		return true;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public showIsRecommendedToReceiveMailWarning(
		notificationGroup : SchedulingApiNotificationSettingsNotificationGroup,
	) : boolean {
		// should only be shown for SHIFTS_ASSIGNMENT_PROCESS_REPORTS group
		// and when not already showIsRecommendedToReceiveWarning() is shown
		if (	notificationGroup !== SchedulingApiNotificationSettingsNotificationGroup.SHIFTS_ASSIGNMENT_PROCESS_REPORTS	||
		this.showIsRecommendedToReceiveWarning(notificationGroup)) {
			return false;
		}

		// is mail enabled for SHIFTS_ASSIGNMENT_PROCESS_REPORTS?
		let mailEnabled : boolean | null = false;

		const mailSettings = this.findSettingsForDeviceType(SchedulingApiNotificationSettingsDeviceType.MAIL);

		if (mailSettings) {
			const notificationGroupItem = this.findNotificationGroupItem(mailSettings,
				SchedulingApiNotificationSettingsNotificationGroup.SHIFTS_ASSIGNMENT_PROCESS_REPORTS);
			mailEnabled = notificationGroupItem?.enabled ?? null;
		}

		// if not warning should be shown
		return !mailEnabled;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public getTitleIcon(title : SchedulingApiNotificationSettingsNotificationTitle) : FaIcon {
		switch (title) {
			case SchedulingApiNotificationSettingsNotificationTitle.TITLE_SHIFTS:
				return PlanoFaIconPool.AREA_SCHEDULING;

			case SchedulingApiNotificationSettingsNotificationTitle.TITLE_SHIFT_EXCHANGE:
				return PlanoFaIconPool.ITEMS_SHIFT_EXCHANGE;

			case SchedulingApiNotificationSettingsNotificationTitle.TITLE_BOOKING_SYSTEM:
				return PlanoFaIconPool.ITEMS_SALES;

			case SchedulingApiNotificationSettingsNotificationTitle.TITLE_TIME_STAMP:
				return PlanoFaIconPool.AREA_TIME_STAMP;

			default:
				throw new Error('Unsupported case');
		}
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public getTitleLabel(title : SchedulingApiNotificationSettingsNotificationTitle) : string {
		switch (title) {
			case SchedulingApiNotificationSettingsNotificationTitle.TITLE_SHIFTS:
				const user = this.api.data.members.get(this.meService.data.id);
				if (!this.api.data.members.length) throw new Error(`[PLANO-FE-SD] members.length: ${this.api.data.members.length}`);
				if (!user) throw new Error(`[PLANO-FE-SD] member id: ${this.meService.data.id}`);
				const canGetManagerNotifications = user.canGetManagerNotifications();
				return this.localize.transform(canGetManagerNotifications ? 'Schichtbesetzung' : 'Deine Schichten');

			case SchedulingApiNotificationSettingsNotificationTitle.TITLE_SHIFT_EXCHANGE:
				return this.localize.transform('Tauschbörse');

			case SchedulingApiNotificationSettingsNotificationTitle.TITLE_BOOKING_SYSTEM:
				return this.localize.transform('Verkäufe');

			case SchedulingApiNotificationSettingsNotificationTitle.TITLE_TIME_STAMP:
				return this.localize.transform('Stempeluhr');

			default:
				throw new Error('Unsupported case');
		}
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public toggleThisDeviceFromPushNotifications() : void {
		switch (this.pushNotifications.thisDeviceState) {
			case 'receiving' :
				this.pushNotifications.unregisterThisDeviceFromPushNotifications();
				break;
			case 'not_receiving' :
				this.pushNotifications.requestWebPushNotificationPermission(
					PRequestWebPushNotificationPermissionContext.USER_REQUEST,
				);
				break;
			case 'blocked_in_browser' :
				break;
			default :
				throw new Error(`thisDeviceState type unknown. Its '${this.pushNotifications.thisDeviceState}'`);
		}
	}
}
