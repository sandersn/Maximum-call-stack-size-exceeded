import { storiesOf, moduleMetadata } from '@storybook/angular';
import { FormatWidth, getLocaleDateFormat, getLocaleTimeFormat, getLocaleNumberSymbol, getLocaleDayNames, getLocaleCurrencyName, getLocaleFirstDayOfWeek, FormStyle, TranslationWidth, NumberSymbol } from '@angular/common';
import { StorybookModule } from '@plano/storybook/storybook.module';
import { PSupportedLocaleIds } from '../api/base/generated-types.ag';

const hiddenLocale = new Set([
	PSupportedLocaleIds.de_AT,
	PSupportedLocaleIds.de_CH,
	PSupportedLocaleIds.de_LU,
	PSupportedLocaleIds.en_BE,
]);

const getTableHead = () : string => {
	let result = ``;
	result += `<thead>`;
	result += `<tr>`;
	result += `<th></th>`;
	for (const locale of Object.values(PSupportedLocaleIds)) {
		if (hiddenLocale.has(locale)) continue;
		result += `<th>${locale}</th>`;
	}
	result += `</tr>`;
	result += `</thead>`;
	return result;
};

const getTableRow = (title : string | boolean, fn : (locale : PSupportedLocaleIds) => unknown) : string => {
	let result = ``;
	result += `<tr>`;
	result += `<th>${title}</th>`;
	for (const locale of Object.values(PSupportedLocaleIds)) {
		if (hiddenLocale.has(locale)) continue;

		result += `<td [innerHTML]="'${fn(locale)}'"></td>`;
	}
	result += `</tr>`;
	return result;
};

const myStoryAngular = storiesOf('Pipes/@angular', module);
myStoryAngular
	.addDecorator(
		moduleMetadata({
			imports: [
				StorybookModule,
			],
		}),
	);

myStoryAngular
	.add('global functions', () => ({
		template: `
			<p>Hier kann man die Werte sehen die Angular aus aus der Library »cldr« ausliest. Sie dienen als Grundlage für unsere sogenannten »Pipes«. Was wir daraus machen, kann von dem abweichen, was Angular uns vorgibt.</p>
			<table class="table table-striped">
			${getTableHead()}
			<tbody>
				${getTableRow('TimeFormat', locale => getLocaleTimeFormat(locale, FormatWidth.Medium))}
				${getTableRow('DateFormats Medium', locale => getLocaleDateFormat(locale, FormatWidth.Medium))}
				${getTableRow('DateFormats Short', locale => getLocaleDateFormat(locale, FormatWidth.Short))}
				${getTableRow('CurrencyName', getLocaleCurrencyName)}
				${getTableRow('NumberSymbol', locale => {
			const WEEKDAY_NAMES = getLocaleDayNames(PSupportedLocaleIds.de_DE, FormStyle.Format, TranslationWidth.Wide);
			return WEEKDAY_NAMES[getLocaleFirstDayOfWeek(locale)];
		})}
				${getTableRow('DecimalSeperator', locale => {
			const S = getLocaleNumberSymbol(locale, NumberSymbol.Decimal);
			return `1${S === ',' ? '.' : S}000${S === ',' ? S : '.'}00`;
		})}
			</table>
		`,
	}));
