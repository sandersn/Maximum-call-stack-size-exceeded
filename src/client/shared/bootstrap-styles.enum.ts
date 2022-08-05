/**
 * All themes that are available in the bootstrap framework
 */
export enum PThemeEnum {
	PRIMARY = 'primary',
	SECONDARY = 'secondary',
	SUCCESS = 'success',
	INFO = 'info',
	WARNING = 'warning',
	LIGHT = 'light',
	DARK = 'dark',
	DANGER = 'danger',
}

export enum PTextColorEnum {
	MUTED = 'muted',
	WHITE = 'white',
}
export type PTextColor = PTextColorEnum | PThemeEnum;

export enum PBackgroundColorEnum {
	WHITE = 'white',
}
export type PBackgroundColor = PBackgroundColorEnum | PThemeEnum;

export enum PBtnThemeEnum {
	OUTLINE_LIGHT = 'outline-light',
	OUTLINE_SECONDARY = 'outline-secondary',
	OUTLINE_PRIMARY = 'outline-primary',
	OUTLINE_DANGER = 'outline-danger',
	OUTLINE_DARK = 'outline-dark',
}
export type PBtnTheme = PBtnThemeEnum | PThemeEnum;

export enum PAlertThemeEnum {
	PLAIN = 'plain',
}

export type PAlertTheme = PAlertThemeEnum | PThemeEnum;

/**
 * All themes that are available in the bootstrap framework
 */
export enum BootstrapRounded {

	/** only on the left side */
	LEFT = 'left',

	/** only on the right side */
	RIGHT = 'right',

	/** no rounding */
	NONE = 'none',
}

/**
 * Very common sizes in bootstrap
 */
export enum BootstrapSize {

	/** Primary */
	SM = 'sm',

	MD = 'md',

	/** Something normal */
	LG = 'lg',
}

/**
 * @deprecated YOU SHOULD PREFER PThemeEnum
 * All themes that are available in the bootstrap framework
 */
export enum BootstrapStyles {

	/** Primary */
	PRIMARY = 'primary',

	/** Something normal */
	SECONDARY = 'secondary',

	/** Light */
	LIGHT = 'light',

	/** Dark */
	DARK = 'dark',

	/** Danger */
	DANGER = 'danger',
}
