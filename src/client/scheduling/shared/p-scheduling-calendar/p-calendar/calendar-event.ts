import { CalendarEvent } from 'angular-calendar';
import { Id } from '@plano/shared/api/base/id';

export interface CalendarEventCustom extends CalendarEvent {
	shiftId : Id;
}
