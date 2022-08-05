import { action } from '@storybook/addon-actions';
import { storiesOf, moduleMetadata } from '@storybook/angular';
import { SchedulingApiShift } from '@plano/client/scheduling/shared/api/scheduling-api.service';
import { ClientPipesModule } from '@plano/client/shared/pipe/client-pipes.module';
import { ModalHeaderComponent } from './modal-header.component';
import { PThemeEnum } from '../../../../client/shared/bootstrap-styles.enum';

export const THEME : {
	[K in PThemeEnum | 'default'] : PThemeEnum | undefined;
} = {
	default: undefined,
	danger: PThemeEnum.DANGER,
	dark: PThemeEnum.DARK,
	info: PThemeEnum.INFO,
	light: PThemeEnum.LIGHT,
	primary: PThemeEnum.PRIMARY,
	secondary: PThemeEnum.SECONDARY,
	success: PThemeEnum.SUCCESS,
	warning: PThemeEnum.WARNING,
};

const myStory = storiesOf('Core/Modal', module);

myStory
	.addDecorator(
		moduleMetadata({
			imports: [ClientPipesModule],
			schemas: [],
			declarations: [ModalHeaderComponent],
			providers: [],
		}),
	)
	.add('p-modal-header', () => ({
		template: `
			<div class="bg-{{theme}}">
				<p-modal-header
					[title]="title"
					[item]="item"
					(onClose)="onClose($event)"
					[theme]="theme"
				></p-modal-header>
			</div>
		`,
		props: {
			title: 'Hallo',
			onClose: action('onClose'),
			item: (() => {
				const result = new SchedulingApiShift(null);
				result.start = Date.now();
				return result;
			})(),
			theme: THEME.default,
		},
	}));
