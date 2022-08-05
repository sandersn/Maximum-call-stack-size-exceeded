import { storiesOf, moduleMetadata } from '@storybook/angular';
import { ToastsService } from '@plano/client/service/toasts.service';
import { PAlertTheme} from '@plano/client/shared/bootstrap-styles.enum';
import { PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { StorybookModule } from '@plano/storybook/storybook.module';

const myStory = storiesOf('Core/p-toast', module);
myStory

	.addDecorator(
		moduleMetadata({
			imports: [
				StorybookModule,
			],
			providers: [
				ToastsService,
			],
		}),
	);

const getTemplate = (type : PAlertTheme) : string => `
		<p-toast
			[toast]="toast"
			theme="${type}"
		>Hallo Universum</p-toast>
	`;

let template = '';
for (const type of Object.values(PThemeEnum)) template += getTemplate(type);

myStory
	.add('default', () => ({
		template: template,
		props: {
			toast: {
				title: 'Hallo Welt',
				// eslint-disable-next-line literal-blacklist/literal-blacklist
				content: 'Lorem Ipsum. Check mal die <a href="#">AGB</a>. Oder Code <code>59</code>',
				visibleOnMobile: true,
			},
			// isLoading: false,
		},
	}));

myStory
	.add('no title', () => ({
		template: template,
		props: {
			toast: {
				title: null as unknown as string,
				// eslint-disable-next-line literal-blacklist/literal-blacklist
				content: 'Lorem Ipsum. Check mal die <a href="#">AGB</a>. Oder Code <code>59</code>',
				visibleOnMobile: true,
			},
			// isLoading: false,
		},
	}));
