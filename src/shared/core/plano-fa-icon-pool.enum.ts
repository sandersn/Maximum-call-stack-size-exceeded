import { PFaIcon } from './component/fa-icon/fa-icon-types';

// It is necessary to wrap PlanoFaIconPool into this fn
// in order to create a PlanoFaIconPoolValues later

// https://stackoverflow.com/a/53662389/1537751
const t = <V extends PFaIcon, T extends {[key in string] : V}>(o : T) : T => {
	return o;
};

/**
 * A Set of all Icons available in our App.
 * @example
 *   In ts file:
 *     public ICONS = PlanoFaIconPool;
 *   In template:
 *     <fa-icon [icon]="ICONS.ITEMS_SHIFT_EXCHANGE"></fa-icon>
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const PlanoFaIconPool = t({
	// ACTIONS
	ADD: 'plus',
	EDIT: 'pen',
	UNDO: 'undo',
	SEARCH: 'search',
	UPLOAD: 'upload',
	EXECUTE: 'play',
	PAUSE: 'pause',
	DOWNLOAD: 'download',
	DISMISS: 'times',
	SUCCESS: 'check',
	MORE_INFO: 'info',
	MORE_INFO_TOOLTIP: 'info-circle',
	DELETE: 'trash',
	RESTORE: 'trash-restore',
	MORE_ACTIONS: 'ellipsis-h',
	EXTERNAL_LINK: 'external-link-alt',
	LINK: 'link',
	SEND_EMAIL: 'paper-plane',
	EXPORT: 'external-link-alt',
	EVALUATE_SHIFT_PLAN: 'flask',
	STATISTICS_EXPORT: 'chart-pie',
	EXPORT_AS_PDF: 'file-pdf',
	EXPORT_AS_EXCEL: 'file-excel',
	EXPORT_AS_CSV: 'file-csv',

	NAV_BACK: 'arrow-left',
	NAV_FORWARD: 'arrow-right',
	SCROLL_DOWN: 'arrow-down',
	SCROLL_UP: 'arrow-up',
	NEXT: 'angle-right',
	PREV: 'angle-left',

	HOURGLASS_HALF: 'hourglass-half',
	OPEN_MAIL: 'envelope-open-text',

	// STATES
	TRASHED: 'trash',
	SYNCING: 'sync',
	CANCELED: 'times',
	LOADING: 'spinner',
	NOT_POSSIBLE: 'times-circle',
	LOCKED: 'lock',

	COLLAPSIBLE_CLOSE: 'chevron-down',
	COLLAPSIBLE_CLOSE_TO_LEFT: 'chevron-left',
	COLLAPSIBLE_OPEN: 'chevron-up',

	DROPDOWN_CLOSE: 'caret-down',
	DROPDOWN_OPEN: 'caret-up',

	CHECKBOX_SELECTED: 'check-square',
	CHECKBOX_UNSELECTED: ['far', 'square'],

	RADIO_SELECTED: 'circle',
	RADIO_UNSELECTED: ['far', 'circle'],

	VISIBLE: 'eye',
	INVISIBLE: 'eye-slash',

	BOOKING_BOOKED: 'check',
	BOOKING_CANCELED: 'times',
	BOOKING_DECLINED: 'times',
	BOOKING_INQUIRY: 'inbox',
	BOOKING_PAYMENT_STATUS: 'coins',
	BOOKING_COMMENT: ['far', 'comment-dots'],

	CALENDAR_SELECT_RELATED_SHIFTS: 'calendar-check',
	CALENDAR_DAY: 'calendar-day',
	CALENDAR_WEEK: 'calendar-week',
	CALENDAR_MONTH: 'calendar',
	CLOCK:'clock',

	STATE_DATE_PICKED: 'calendar-alt',
	STATE_DATE_EMPTY: ['far', 'calendar-alt'],

	EXCHANGE_SHIFT: 'exchange-alt',
	EXCHANGE_SHIFT_OFFER: 'long-arrow-alt-right',

	// API OBJECTS
	ITEMS_MEMBER: 'user',
	ITEMS_PARTICIPANT: 'users',
	ITEMS_ABSENCE_ILLNESS: 'briefcase-medical',
	ITEMS_ABSENCE_VACATION: 'umbrella-beach',
	ITEMS_ASSIGNMENT_PROCESS: 'heart',
	ITEMS_SHIFT_EXCHANGE: 'hands-helping',
	ITEMS_BOOKING_PERSON: 'user',
	ITEMS_PARTICIPANTS: 'user-friends',
	ITEMS_SALES: 'shopping-bag',
	ITEMS_VOUCHER: 'gift',
	ITEMS_SHIFTS: ['far', 'calendar-alt'],
	ITEMS_SHIFT_MODELS: 'layer-group',

	// AREAS / MENU
	AREA_SCHEDULING: 'calendar-alt',
	AREA_TIME_STAMP: 'stopwatch',
	AREA_TUTORIALS: 'lightbulb',
	AREA_TRANSACTIONS: 'coins',
	AREA_FAQ: 'question-circle',

	// BRANDS
	BRAND_YOUTUBE: ['fab', 'youtube'],
	BRAND_FACEBOOK: ['fab', 'facebook-square'],
	BRAND_PAYPAL: ['fab', 'paypal'],
	BRAND_INTERNET_EXPLORER: ['fab', 'internet-explorer'],
	BRAND_ANDROID: ['fab', 'android'],
	BRAND_APPLE: ['fab', 'apple'],

	// CURRENCIES
	EUR: 'euro-sign',
	GBP: 'pound-sign',

	// Components
	IMAGE_UPLOAD: ['fas', 'image'],
	FILTER: 'filter',
	LIST: 'list',
	NOTE : ['fas', 'sticky-note'],

	// OTHER
	INTERNET: ['fas', 'globe-americas'],
	PUSH_NOTIFICATION: 'bell',
	NO_PUSH_NOTIFICATION: 'bell-slash',
	EMAIL_NOTIFICATION: 'envelope',

	MOBILE_MENU: 'bars',
	INCOMING_PAYMENT: 'share',
	OUTGOING_PAYMENT: 'reply',
	CORONA: 'virus', // TODO: [2024-01-01] Is this stupid corona still a thing? If not, remove this entry.
	CHARGEBACK_FLOW: 'arrow-right',
	BIRTHDAY: 'birthday-cake',
	TEXT_LEFT: 'align-left',
	GRID_MENU: 'th',

	SCHEDULING: 'user-friends',
	ONLINE_PAYMENT: 'laptop',

	// ALERTS
	WARNING: 'exclamation-triangle',
	SECURITY: 'shield-alt',
});

export type PlanoFaIconPoolKeys = keyof typeof PlanoFaIconPool;


/**
 * All available icons in our pool
 * @example
 *   @Input() public icon : PlanoFaIconPoolValues | `${IconName}`;
 */
export type PlanoFaIconPoolValues = typeof PlanoFaIconPool[PlanoFaIconPoolKeys];
