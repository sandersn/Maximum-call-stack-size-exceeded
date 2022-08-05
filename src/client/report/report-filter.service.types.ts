export type ReportFilterServiceCookieKeyDataType = {
	// TODO: remove `| null`
	prefix : 'ReportFilterService' | null,
	name : (
		'showAbsences' |
		'showUnpaidAbsences' |
		'showUsersWithoutEntries' |
		'showWorkingTimes' |
		'showWorkingTimesForecast'
	),
};
