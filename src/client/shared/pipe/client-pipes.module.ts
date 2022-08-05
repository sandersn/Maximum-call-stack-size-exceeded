import { NgModule } from '@angular/core';
import { PDurationTimePipe, PDurationHoursPipe } from './duration-time.pipe';
import { PDurationPipe } from './p-duration.pipe';
import { PTimeAgoPipe } from './time-ago.pipe';

@NgModule({
	declarations: [
		PDurationHoursPipe,
		PDurationPipe,
		PDurationTimePipe,
		PTimeAgoPipe,
	],
	exports: [
		PDurationHoursPipe,
		PDurationPipe,
		PDurationTimePipe,
		PTimeAgoPipe,
	],
})
export class ClientPipesModule {}
