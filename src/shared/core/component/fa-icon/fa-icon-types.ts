import { IconName, IconPrefix } from '@fortawesome/fontawesome-common-types';

/** A Type for all FontAwesome supported icons */
export type FaIcon = IconName | [IconPrefix, IconName];

export type PFaIcon = FaIcon | 'czk-sign' | 'kr';
