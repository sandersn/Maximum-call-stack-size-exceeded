export type PBadgeIcon = 'times' | 'check' | 'question';
export type PBadgeAlign = 'left' | 'right' | 'center' | false;
// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
export type PBadgeContent = PBadgeIcon | number | boolean | string | null;

export interface PBadgeComponentInterface {
	content : PBadgeContent;
	align : PBadgeAlign;
}
