import { storiesOf, moduleMetadata } from '@storybook/angular';
import { SchedulingApiShift } from '@plano/shared/api';
import { SchedulingApiShiftPacketShifts } from '@plano/shared/api';
import { Config } from '@plano/shared/core/config';
import { StorybookModule } from '@plano/storybook/storybook.module';
import { PMomentService } from '../../p-moment.service';
import { ClientSharedComponentsModule } from '../client-shared-components.module';

const shiftMock = new SchedulingApiShift(null, 123);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const addItem = (list : SchedulingApiShiftPacketShifts, id ?: any) : void => {
	const days = 1;
	list.createNewItem(id).start = +(new PMomentService(Config.LOCALE_ID).m().add(days, 'day'));
};

const shiftPacketsMockW4 = new SchedulingApiShiftPacketShifts(null, false);
addItem(shiftPacketsMockW4);
addItem(shiftPacketsMockW4, shiftMock.id);
addItem(shiftPacketsMockW4);
addItem(shiftPacketsMockW4);

const shiftPacketsMockW9 = new SchedulingApiShiftPacketShifts(null, false);
addItem(shiftPacketsMockW9);
addItem(shiftPacketsMockW9);
addItem(shiftPacketsMockW9, shiftMock.id);
addItem(shiftPacketsMockW9);
addItem(shiftPacketsMockW9);
addItem(shiftPacketsMockW9);
addItem(shiftPacketsMockW9);
addItem(shiftPacketsMockW9);
addItem(shiftPacketsMockW9);

const myStory = storiesOf('Client/ClientSharedComponents/p-packet-shifts', module);
myStory
	.addDecorator(
		moduleMetadata({
			imports: [
				StorybookModule,
				ClientSharedComponentsModule,
			],
		}),
	)
	.add('default', () => ({
		template: `
			<p-packet-shifts
				[currentShiftId]="model.id"
				[packetShifts]="packet"
			></p-packet-shifts>
		`,
		props: {
			model: shiftMock,
			packet: shiftPacketsMockW4,
		},
	}))
	.add('with 9 entries', () => ({
		template: `
			<p-packet-shifts
				[currentShiftId]="model.id"
				[packetShifts]="packet"
			></p-packet-shifts>
		`,
		props: {
			model: shiftMock,
			packet: shiftPacketsMockW9,
		},
	}));
