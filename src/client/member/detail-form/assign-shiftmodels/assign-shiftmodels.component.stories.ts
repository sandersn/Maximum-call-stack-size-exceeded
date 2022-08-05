import { storiesOf, moduleMetadata } from '@storybook/angular';
import { AssignShiftmodelsComponent } from './assign-shiftmodels.component';
import { PInputShiftmodelEarningsComponent } from './p-input-shiftmodel-earnings/p-input-shiftmodel-earnings.component';
import { MeService, SchedulingApiService } from '../../../../shared/api';
import { CoreModule } from '../../../../shared/core/core.module';
import { CurrentModalsService } from '../../../../shared/core/p-modal/current-modals.service';
import { PModalModule } from '../../../../shared/core/p-modal/modal.module';
import { ModalService } from '../../../../shared/core/p-modal/modal.service';
import { NgbFormatsService } from '../../../service/ngbformats.service';
import { ClientSharedModule } from '../../../shared/client-shared.module';
import { PFormsModule } from '../../../shared/p-forms/p-forms.module';
import { PListsModule } from '../../../shared/p-lists/p-lists.module';
import { PShiftModelModule } from '../../../shared/p-shiftmodel/p-shiftmodel.module';

storiesOf('assign-shiftmodels', module)
	.addDecorator(
		moduleMetadata({
			imports: [
				CoreModule,
				PListsModule,
				PFormsModule,
				ClientSharedModule,
				PShiftModelModule,
				PModalModule,
			],
			declarations: [
				PInputShiftmodelEarningsComponent,
				AssignShiftmodelsComponent,
			],
			providers: [
				NgbFormatsService,
				ModalService, CurrentModalsService,
				/* eslint-disable-next-line jsdoc/require-jsdoc */
				{ provide: MeService, useClass: class {} },
				/* eslint-disable-next-line jsdoc/require-jsdoc */
				{ provide: SchedulingApiService, useClass: class {} },
			],
		}),
	)
	.add('default', () => ({
		template: `
		<div class="d-flex justify-content-center">
			<assign-shiftmodels></assign-shiftmodels>
		</div>
		`,
	}));
