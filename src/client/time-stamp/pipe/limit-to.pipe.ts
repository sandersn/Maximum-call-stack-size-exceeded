import { Pipe } from '@angular/core';
import { PipeTransform } from '@angular/core';

@Pipe({ name: 'pLimitTo' })
export class LimitToPipe implements PipeTransform {
// eslint-disable-next-line jsdoc/require-jsdoc
	public transform(value : string | null, args : string) : string {
		if (value === null) { return ''; }
		// let limit = args.length > 0 ? parseInt(args[0], 10) : 10;
		// let trail = args.length > 1 ? args[1] : '…';
		const limit = args ? Number.parseInt(args, 10) : 10;
		return value.length > limit ? value.substring(0, limit) : value;
	}
}
