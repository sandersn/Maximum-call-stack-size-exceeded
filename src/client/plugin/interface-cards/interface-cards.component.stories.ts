import { action } from '@storybook/addon-actions';
import { storiesOf, moduleMetadata } from '@storybook/angular';
import { StorybookModule } from '@plano/storybook/storybook.module';
import { PSupportedPaymentSystems, PSupportedPosSystems } from './interface-cards.component';
import { PluginModule } from '../plugin.module';

const myStory = storiesOf('Client/PluginModule/p-interface-cards', module);
myStory
	.addDecorator(
		moduleMetadata({
			imports: [
				StorybookModule,
				PluginModule,
			],
		}),
	)
	.add('default', () => ({
		template: `
			<p-interface-cards
				(onClick)="onClick($event)"
				[posSystem]="1"
				paymentSystem="${PSupportedPaymentSystems.PAYPAL}"
				posSystem="${PSupportedPosSystems.BOULDERADO}"
			></p-interface-cards>
		`,
		props: {
			onClick: action('onClick'),
		},
	}));
