import { storiesOf, moduleMetadata } from '@storybook/angular';
import { PAlertTheme} from '@plano/client/shared/bootstrap-styles.enum';
import { PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { StorybookModule } from '@plano/storybook/storybook.module';
import { THEME } from '../modal-header/modal-header.component.stories';
import { PModalModule } from '../modal.module';

const myStory = storiesOf('Core/Modal', module);
myStory

	.addDecorator(
		moduleMetadata({
			imports: [
				StorybookModule,
				PModalModule,
			],
		}),
	);

const getTemplate = (type : PAlertTheme) : string => `
		<div class="rounded bg-${type} border border-${type} shadow-lg m-5">
			<p-modal-content
				[modalTitle]="'Hallo Welt'"
				theme="${type}"
			>
				<p-modal-content-body>Hallo Universum</p-modal-content-body>
			</p-modal-content>
		</div>
	`;

let template = '';
for (const type of Object.values(PThemeEnum)) template += getTemplate(type);

myStory
	.add('p-modal-content', () => ({
		template: template,
		props: {
			// title: '',
			// isLoading: false,
			theme: THEME.default,
		},
	}));
