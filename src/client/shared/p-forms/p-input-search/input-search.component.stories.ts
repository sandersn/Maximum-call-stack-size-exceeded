import { storiesOf, moduleMetadata } from '@storybook/angular';
import { StorybookModule } from '@plano/storybook/storybook.module';
import { STORYBOOK_STRINGIFY_FN, STORYBOOK_NGMODEL_VALUE_OUTPUT } from '@plano/storybook/storybook.utils';
import { PInputSearchComponent } from './input-search.component';
import { BootstrapSize, PBtnThemeEnum, PThemeEnum } from '../../bootstrap-styles.enum';
import { PFormsModule } from '../p-forms.module';

const myStory = storiesOf('Client/PForms/p-input-search', module);
myStory

	.addDecorator(
		moduleMetadata({
			imports: [
				StorybookModule,
				PFormsModule,
			],
			declarations: [
			],
		}),
	);

const getTemplate = (
	size ?: PInputSearchComponent['size'],
	theme ?: PInputSearchComponent['theme'],
	darkMode ?: PInputSearchComponent['darkMode'],
) : string => {
	return `
		<div class="p-5 d-flex align-items-center o-hidden"
			[class.bg-dark]="${darkMode}"
		>
			<p-input-search
				[(ngModel)]="ngModel"
				[(isActive)]="isActive"
				size="${size}"
				[darkMode]="${darkMode}"
				style="${theme}"
			></p-input-search>
			<div class="d-flex align-items-center text-white flex-grow-1" *ngIf="!isActive">
				<fa-icon class="ml-auto" icon="beer"></fa-icon>
				<fa-icon class="ml-2" icon="hand-spock"></fa-icon>
			</div>
		</div>
	`;
};

myStory
	.add('default', () => ({
		template: `
			${getTemplate(BootstrapSize.SM, PThemeEnum.LIGHT, true)}
			${getTemplate(undefined, PThemeEnum.LIGHT, true)}
			${getTemplate(BootstrapSize.LG, PThemeEnum.LIGHT, true)}
			${getTemplate(undefined, PBtnThemeEnum.OUTLINE_SECONDARY, true)}
			<hr>
			${STORYBOOK_NGMODEL_VALUE_OUTPUT}
		`,
		props: {
			stringify: STORYBOOK_STRINGIFY_FN,
			ngModel: undefined as unknown,
			isActive: undefined as unknown,
		},
	}));
