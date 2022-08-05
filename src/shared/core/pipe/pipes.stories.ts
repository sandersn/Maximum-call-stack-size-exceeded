import { storiesOf, moduleMetadata } from '@storybook/angular';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { StorybookModule } from '@plano/storybook/storybook.module';
import { LocalizePipe } from './localize.pipe';
import { PCurrencyPipe } from './p-currency.pipe';
import { AngularDatePipeFormat, PDatePipe } from './p-date.pipe';
import { FormattedDateTimePipe } from '../../../client/shared/formatted-date-time.pipe';
import { PMomentService } from '../../../client/shared/p-moment.service';
import { PDurationHoursPipe, PDurationTimePipe, SupportedDurationTimePipeUnits } from '../../../client/shared/pipe/duration-time.pipe';
import { PDurationPipe } from '../../../client/shared/pipe/p-duration.pipe';
import { PSupportedLocaleIds, PSupportedCurrencyCodes } from '../../api/base/generated-types.ag';
import { LogService } from '../log.service';

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

let pCurrencyPipeTemplate = `
	<table class="table table-striped">
	${getTableHead()}
	<tbody>`;

for (const format of ['symbol', 'symbol-narrow', 'code' /* , 'Foo', true, false */ ]) {
	pCurrencyPipeTemplate += getTableRow(format, locale => {
		const pipe = new PCurrencyPipe(new CurrencyPipe(locale), new LogService());
		return `
		${pipe.transform(1234.23, PSupportedCurrencyCodes.EUR, format, undefined, locale)}
		<br>
		${pipe.transform(-1234.23, PSupportedCurrencyCodes.EUR, format, undefined, locale)}
		<br>
		${pipe.transform(1234.23, PSupportedCurrencyCodes.EUR, format, undefined, locale, undefined, true)}
		`;
	});
}

pCurrencyPipeTemplate += `
	<tbody>
	</table>
`;

const myCurrencyPipeStory = storiesOf('Pipes/PCurrencyPipe', module);
myCurrencyPipeStory
	.addDecorator(
		moduleMetadata({
			imports: [
				StorybookModule,
			],
		}),
	);
myCurrencyPipeStory
	.add('default', () => ({
		template: pCurrencyPipeTemplate,
	}));
const myCurrencyPipeMethodStory = storiesOf('Pipes/PCurrencyPipe/getPaymentMethodIcon()', module);
myCurrencyPipeMethodStory
	.addDecorator(
		moduleMetadata({
			imports: [
				StorybookModule,
			],
		}),
	);

const SOME_PAYMENT_METHODS = [
	'Barzahlung an der Kasse',
	'PayPal Account',
	'Mit Google Pay',
	'Apple Pay, wer’s mag',
	'Mastercard für Internationale Gäste',
	'Visa Kreditkartenzahlung',
	'Irgend eine andere Kreditkarte',
	'Oder auch iDeal, was auch immer das ist',
];

for (const element of SOME_PAYMENT_METHODS) {

	myCurrencyPipeMethodStory
		.add(`String: '${element}'`, () => ({
			template: `<label>${element}</label><br>` + `<fa-icon [size]="'2x'" [icon]="icon"></fa-icon>`,
			props: {
				icon: new PCurrencyPipe(null, null).getPaymentMethodIcon(null, element),
			},
		}));

}

let pDatePipeTemplate = `
	<table class="table table-striped">
	${getTableHead()}
	<tbody>`;

for (const format of Object.values(AngularDatePipeFormat)) {
	if (format === AngularDatePipeFormat.MEDIUM) continue;
	if (format === AngularDatePipeFormat.LONG) continue;
	if (format === AngularDatePipeFormat.FULL) continue;
	if (format === AngularDatePipeFormat.LONG_TIME) continue;
	if (format === AngularDatePipeFormat.FULL_TIME) continue;
	pDatePipeTemplate += getTableRow(format, locale => {
		const pipe = new PDatePipe(new DatePipe(locale), new LogService());
		if (locale === 'en') return 'error';
		return pipe.transform(1586886748375, format, undefined, locale);
	});
}

pDatePipeTemplate += `
	<tbody>
	</table>
`;

const myDatePipeStory = storiesOf('Pipes/PDatePipe', module);
myDatePipeStory
	.addDecorator(
		moduleMetadata({
			imports: [
				StorybookModule,
			],
		}),
	);
myDatePipeStory
	.add('PDatePipe', () => ({
		template: pDatePipeTemplate,
	}));

let pDurationPipeTemplate = `
	<table class="table table-striped">
	${getTableHead()}
	<tbody>`;

pDurationPipeTemplate += getTableRow(AngularDatePipeFormat.SHORT_TIME, locale => {
	const pipe = new PDurationPipe(locale, new PDatePipe(new DatePipe(locale), new LogService()));
	if (locale === 'en') return 'error';
	return pipe.transform(1586886748375, AngularDatePipeFormat.SHORT_TIME);
});

pDurationPipeTemplate += `
	<tbody>
	</table>
`;

const pDurationPipeStory = storiesOf('Pipes/PDurationPipe', module);
pDurationPipeStory
	.addDecorator(
		moduleMetadata({
			imports: [
				StorybookModule,
			],
		}),
	);
pDurationPipeStory
	.add('default', () => ({
		template: pDurationPipeTemplate,
	}));

let pDurationAsHoursTemplate = `
	<table class="table table-striped">
	${getTableHead()}
	<tbody>`;

pDurationAsHoursTemplate += getTableRow('With Seconds', locale => {
	const pipe = new PDurationHoursPipe(new PMomentService(), new LocalizePipe(new LogService(), locale));
	if (locale === 'en') return 'error';
	return pipe.transform(1586886748375, true);
});
pDurationAsHoursTemplate += getTableRow('Without Seconds', locale => {
	const pipe = new PDurationHoursPipe(new PMomentService(), new LocalizePipe(new LogService(), locale));
	if (locale === 'en') return 'error';
	return pipe.transform(1586886748375, false);
});

pDurationAsHoursTemplate += `
	<tbody>
	</table>
`;

const pDurationAsHoursStory = storiesOf('Pipes/PDurationAsHoursPipe', module);
pDurationAsHoursStory
	.addDecorator(
		moduleMetadata({
			imports: [
				StorybookModule,
			],
		}),
	);
pDurationAsHoursStory
	.add('default', () => ({
		template: pDurationAsHoursTemplate,
	}));


let pDurationTimeTemplate = `
	<table class="table table-striped">
	${getTableHead()}
	<tbody>`;

pDurationTimeTemplate += getTableRow('default', locale => {
	const pipe = new PDurationTimePipe(new PMomentService(), new LocalizePipe(new LogService(), locale));
	if (locale === 'en') return 'error';
	return pipe.transform(1586886748375, SupportedDurationTimePipeUnits.SECONDS);
});
pDurationTimeTemplate += getTableRow('less than a day', locale => {
	const pipe = new PDurationTimePipe(new PMomentService(), new LocalizePipe(new LogService(), locale));
	if (locale === 'en') return 'error';
	return pipe.transform(19168867, SupportedDurationTimePipeUnits.SECONDS);
});
pDurationTimeTemplate += getTableRow('less than a hour', locale => {
	const pipe = new PDurationTimePipe(new PMomentService(), new LocalizePipe(new LogService(), locale));
	if (locale === 'en') return 'error';
	return pipe.transform(1916886, SupportedDurationTimePipeUnits.SECONDS);
});
pDurationTimeTemplate += getTableRow('less than a minute', locale => {
	const pipe = new PDurationTimePipe(new PMomentService(), new LocalizePipe(new LogService(), locale));
	if (locale === 'en') return 'error';
	return pipe.transform(19168, SupportedDurationTimePipeUnits.SECONDS);
});
pDurationTimeTemplate += getTableRow('Without Seconds', locale => {
	const pipe = new PDurationTimePipe(new PMomentService(), new LocalizePipe(new LogService(), locale));
	if (locale === 'en') return 'error';
	return pipe.transform(1586886748375, null);
});
pDurationTimeTemplate += getTableRow('without sub tags', locale => {
	const pipe = new PDurationTimePipe(new PMomentService(), new LocalizePipe(new LogService(), locale));
	if (locale === 'en') return 'error';
	return pipe.transform(1586886748375, SupportedDurationTimePipeUnits.SECONDS, false);
});

pDurationTimeTemplate += getTableRow('with exactly 26hrs', locale => {
	const pipe = new PDurationTimePipe(new PMomentService(), new LocalizePipe(new LogService(), locale));
	if (locale === 'en') return 'error';
	return pipe.transform(26 * 60 * 60 * 1000, SupportedDurationTimePipeUnits.SECONDS, false);
});
pDurationTimeTemplate += getTableRow('shortest way', locale => {
	const pipe = new PDurationTimePipe(new PMomentService(), new LocalizePipe(new LogService(), locale));
	if (locale === 'en') return 'error';
	return pipe.transform(26 * 60 * 60 * 1000, SupportedDurationTimePipeUnits.SECONDS, false, true);
});

pDurationTimeTemplate += `
	<tbody>
	</table>
`;


const pDurationTimeStory = storiesOf('Pipes/PDurationTimePipe', module);
pDurationTimeStory
	.addDecorator(
		moduleMetadata({
			imports: [
				StorybookModule,
			],
		}),
	);
pDurationTimeStory
	.add('default', () => ({
		template: pDurationTimeTemplate,
	}));

let formattedDateTimePipeTemplate = `
	<table class="table table-striped">
	${getTableHead()}
	<tbody>`;

formattedDateTimePipeTemplate += getTableRow('veryShort true', locale => {
	const pipe = new FormattedDateTimePipe(new PMomentService(), new PDatePipe(new DatePipe(locale), new LogService()));
	if (locale === 'en') return 'error';
	return pipe.transform(1586886748375, 1587405148375, true).full;
});
formattedDateTimePipeTemplate += getTableRow('veryShort false', locale => {
	const pipe = new FormattedDateTimePipe(new PMomentService(), new PDatePipe(new DatePipe(locale), new LogService()));
	if (locale === 'en') return 'error';
	return pipe.transform(1586886748375, 1587405148375, false).full;
});
formattedDateTimePipeTemplate += getTableRow('veryShort false, showWeekday true', locale => {
	const pipe = new FormattedDateTimePipe(new PMomentService(), new PDatePipe(new DatePipe(locale), new LogService()));
	if (locale === 'en') return 'error';
	return pipe.transform(1586886748375, 1589997148375, false, true).full;
});
formattedDateTimePipeTemplate += getTableRow('veryShort false', locale => {
	const pipe = new FormattedDateTimePipe(new PMomentService(), new PDatePipe(new DatePipe(locale), new LogService()));
	if (locale === 'en') return 'error';
	return pipe.transform(1586886748375, 1621533148375, false).full;
});


formattedDateTimePipeTemplate += `
	<tbody>
	</table>
`;

const formattedDateTimePipeStory = storiesOf('Pipes/FormattedDateTimePipe', module);
formattedDateTimePipeStory
	.addDecorator(
		moduleMetadata({
			imports: [
				StorybookModule,
			],
		}),
	);
formattedDateTimePipeStory
	.add('default', () => ({
		template: formattedDateTimePipeTemplate,
	}));
