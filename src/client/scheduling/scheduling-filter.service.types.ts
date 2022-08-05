export type SchedulingFilterServiceCookieKeyDataType = {
	// TODO: remove `| null`
	prefix : 'SchedulingFilterService' | null,
	name : (
		'hideAllAbsences' |
		'hideAllHolidays' |
		'hideAllBirthdays' |
		'hideAllShifts' |
		'hideAllShiftsFromOthers' |
		'hideAllShiftsFromMe'
	),
};
