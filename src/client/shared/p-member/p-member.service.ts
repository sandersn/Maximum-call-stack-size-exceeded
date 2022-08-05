import { Injectable } from '@angular/core';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';

@Injectable()
export class MemberService {
	constructor(
		private localize : LocalizePipe,
	) {
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public makeNameGenitive(genitivName : string) : string {
		if (genitivName.charAt(genitivName.length - 1).match(/[sxz|ß]/)) return this.localize.transform('${genitivName}’', { genitivName: genitivName });
		// if (genitivName.indexOf('Andrea') > -1) return this.localize.transform('${genitivName}’s', { genitivName: genitivName });
		return this.localize.transform('${genitivName}s', { genitivName: genitivName });
	}
}
