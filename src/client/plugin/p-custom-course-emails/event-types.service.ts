import { Injectable } from '@angular/core';
import { SchedulingApiCustomBookableMailEventType } from '@plano/shared/api';
import { FaIcon } from '@plano/shared/core/component/fa-icon/fa-icon-types';
import { PDictionarySourceString } from '@plano/shared/core/pipe/localize.dictionary';

interface EventTypesObject {
	type : SchedulingApiCustomBookableMailEventType;
	title : PDictionarySourceString;
	description ?: PDictionarySourceString;
	icon ?: FaIcon;
}

@Injectable()
export class EventTypesService {
	public eventTypesObjects : EventTypesObject[] = [
		{
			type : SchedulingApiCustomBookableMailEventType.INQUIRY_ARRIVAL_NOTICE,
			title : 'Buchungsanfrage eingegangen',
			description : 'Diese Email erhalten deine Kunden, nachdem sie online eine Buchungsanfrage gesendet haben.',
			icon : 'inbox',
		},
		{
			type : SchedulingApiCustomBookableMailEventType.INQUIRY_DECLINED,
			title : 'Buchungsanfrage abgelehnt',
			icon : 'times',
		},
		{
			type : SchedulingApiCustomBookableMailEventType.BOOKED,
			title : 'Erfolgreich gebucht',
			description: 'Diese Email erhalten Kunden bei direkter Online-Buchung oder bei Bestätigung ihrer Buchungsanfrage.',
			icon : 'check',
		},
		{
			type : SchedulingApiCustomBookableMailEventType.BOOKING_CANCELED,
			title : 'Buchung storniert',
			icon : 'times',
		},
		{
			type : SchedulingApiCustomBookableMailEventType.PAYMENT_PARTIAL,
			title : 'Teilzahlung erhalten',
			icon : 'coins',
		},
		{
			type : SchedulingApiCustomBookableMailEventType.PAYMENT_COMPLETE,
			title : 'Buchungspreis komplett bezahlt',
			icon : 'coins',
		},
		{
			type : SchedulingApiCustomBookableMailEventType.ONLINE_PAYMENT_FAILED,
			title : 'Online-Zahlung fehlgeschlagen',
			description: 'Diese Email erhalten Kunden, deren Online-Zahlung nachträglich fehlgeschlagen ist (z.B. weil ihr Konto nicht gedeckt war). Die Email enthält einen Button, worüber deine Kunden erneut zahlen können.',
			icon : 'coins',
		},
		{
			type : SchedulingApiCustomBookableMailEventType.REFUNDED,
			title : 'Geld erstattet',
			icon : 'coins',
		},
		{
			type : SchedulingApiCustomBookableMailEventType.AMOUNT_TO_PAY_CHANGED,
			title : 'Buchungspreis geändert',
			icon : 'coins',
		},
		{
			type : SchedulingApiCustomBookableMailEventType.PAYMENT_METHOD_CHANGED,
			title : 'Präferierte Zahlungsart geändert',
			icon : 'coins',
		},
		{
			type : SchedulingApiCustomBookableMailEventType.COURSE_REMINDER,
			title : 'Termin-Erinnerung',
			description : '2 Tage vor dem ersten Termin',
			icon : 'bell',
		},
		{
			type : SchedulingApiCustomBookableMailEventType.DATE_CHANGED,
			title : 'Angebotstermin geändert',
			description : 'Diese Email wird verschickt, wenn sich die Uhrzeit oder das Datum eines gebuchten Angebots ändert. Oder einer der Termine eines mehrtägigen Angebots gelöscht wird.',
			icon : 'exchange-alt',
		},
		{
			type : SchedulingApiCustomBookableMailEventType.PARTICIPATED,
			title : 'Teilnahme abgeschlossen',
			description : 'Diese Email wird spätestens am Tag nach der Teilnahme an einem gebuchten Angebot verschickt.',
			icon : 'trophy',
		},
		{
			type : SchedulingApiCustomBookableMailEventType.VOUCHER_NEW_ITEM,
			title : 'Neuer Gutschein',
		},
	];

	constructor() {}

	/**
	 * Get item/object by eventType
	 */
	private getItem(eventType : SchedulingApiCustomBookableMailEventType) : EventTypesObject | undefined {
		return this.eventTypesObjects.find(item => item.type === eventType);
	}

	/**
	 * Get title by eventType
	 */
	public getTitle(eventType : SchedulingApiCustomBookableMailEventType) : PDictionarySourceString | undefined {
		const item = this.getItem(eventType);
		return item ? item.title : undefined;
	}

	/**
	 * Get icon by eventType
	 */
	public getIcon(eventType : SchedulingApiCustomBookableMailEventType) : FaIcon | null {
		const item = this.getItem(eventType);
		if (item) return item.icon ?? null;
		return null;
	}

	/**
	 * Get description by eventType
	 */
	public getDescription(eventType : SchedulingApiCustomBookableMailEventType) : string | undefined {
		const item = this.getItem(eventType);
		return item ? item.description : undefined;
	}


}
