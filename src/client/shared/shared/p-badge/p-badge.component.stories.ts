import { storiesOf, moduleMetadata } from '@storybook/angular';
import { CurrencyPipe } from '@angular/common';
import { PCurrencyPipe } from '@plano/shared/core/pipe/p-currency.pipe';
import { StorybookModule } from '@plano/storybook/storybook.module';
import { PBadgeComponent } from './p-badge.component';
import { PSupportedLocaleIds, PSupportedCurrencyCodes } from '../../../../shared/api/base/generated-types.ag';
import { BootstrapSize, PThemeEnum } from '../../bootstrap-styles.enum';
import { SharedModule } from '../shared.module';

const myStory = storiesOf('Client/Shared/p-badge', module);

myStory
	.addDecorator(
		moduleMetadata({
			imports: [
				StorybookModule,
				SharedModule,
			],
			declarations: [
			],
		}),
	);

const getTemplate = (
	theme : PBadgeComponent['theme'],
	content : string | number,
	size ?: PBadgeComponent['size'],
) : string => `
		<span class="position-relative p-2">
			<p-badge
				theme="${theme}"
				[content]="${content}"
				size="${size}"
			></p-badge>
		</span>
	`;

let template = '';
for (const theme of Object.values(PThemeEnum)) template += getTemplate(theme, `true`);
template += `<br>`;
for (const theme of Object.values(PThemeEnum)) template += getTemplate(theme, `3`);
template += `<hr>`;
template += getTemplate(undefined!, `'check'`);
template += getTemplate(undefined!, `'times'`);
template += getTemplate(undefined!, `'question'`);
template += `<hr>`;
template += `
	<span class="position-relative p-2">
	<p-badge
		theme="${PThemeEnum.DANGER}"
		[content]="2.345"
		size="${BootstrapSize.LG}"
	></p-badge>
	</span>
`;
template += `<br>`;
template += `
	<span class="position-relative p-2">
	<p-badge
		theme="${PThemeEnum.DANGER}"
		content="Some String"
		size="${BootstrapSize.LG}"
	></p-badge>
	</span>
`;
template += `<br>`;
template += `
	<span class="position-relative p-2">
	<p-badge
		theme="${PThemeEnum.SUCCESS}"
		[content]="getCurrencyContent"
		size="${BootstrapSize.LG}"
	></p-badge>
	</span>
`;
template += `
	<span class="position-relative p-2">
	<p-badge
		theme="${PThemeEnum.WARNING}"
		[content]="getCurrencyContent"
		size="${BootstrapSize.LG}"
	></p-badge>
	</span>
`;
template += `
	<span class="position-relative p-2">
	<p-badge
		theme="${PThemeEnum.DANGER}"
		[content]="getCurrencyContent"
		size="${BootstrapSize.LG}"
	></p-badge>
	</span>
`;
template += `<hr>`;
template += getTemplate(PThemeEnum.DANGER, `3`, undefined);
template += getTemplate(PThemeEnum.DANGER, `3`, BootstrapSize.SM);
template += getTemplate(PThemeEnum.DANGER, `true`, undefined);
template += getTemplate(PThemeEnum.DANGER, `true`, BootstrapSize.SM);

myStory
	.add('default', () => ({
		template: `<div class="d-flex justify-content-center"><div>${template}</div></div>`,
		props: {
			getCurrencyContent: new PCurrencyPipe(new CurrencyPipe(PSupportedLocaleIds.de_DE), null).transform(12.123, PSupportedCurrencyCodes.EUR),
		},
	}));
