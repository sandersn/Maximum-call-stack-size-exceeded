import { PipeTransform } from '@angular/core';
import { Pipe } from '@angular/core';
import { PSupportedLocaleIds } from '@plano/shared/api/base/generated-types.ag';
import { Config } from '../config';

/**
 * A Pipe to localize file path's. It will automatically add language code before file ending.
 * e.g. 'my_file.png' will be transformed by this pipe to 'my_file.de.png' depending on current locale.
 */

@Pipe({ name: 'pLocalizeFile' })
export class LocalizeFilePipe implements PipeTransform {

	/**
	 * Translate the given string.
	 * @param input String to be translated
	 * @param locale location code containing a language to be translated to
	 * @returns translated string
	 */
	public transform(input : string, locale ?: PSupportedLocaleIds) : string {
		const fileEndingDotIndex = input.lastIndexOf('.');

		return input.substr(0, fileEndingDotIndex + 1) +
			Config.getLanguageCode(locale) +
			input.substr(fileEndingDotIndex);
	}
}
