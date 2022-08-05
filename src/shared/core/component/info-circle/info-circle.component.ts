import { TooltipDirective } from 'ngx-bootstrap/tooltip';
import { AfterViewInit} from '@angular/core';
import { ChangeDetectionStrategy, Component, Input, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { Config } from '../../config';
import { LogService } from '../../log.service';
import { ModalService } from '../../p-modal/modal.service';
import { ModalServiceOptions } from '../../p-modal/modal.service.options';
import { LocalizePipe } from '../../pipe/localize.pipe';
import { PlanoFaIconPool } from '../../plano-fa-icon-pool.enum';
import { FaIcon } from '../fa-icon/fa-icon-types';

type TooltipPlacement = 'auto' | 'right' | 'left' | 'top' | 'bottom';

@Component({
	selector: 'p-info-circle',
	templateUrl: './info-circle.component.html',
	styleUrls: ['./info-circle.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PInfoCircleComponent implements AfterViewInit {
	@Input('isMobile') private _isMobile ?: boolean;
	@Input() public headline : string | null = null;
	@Input() public placement : TooltipPlacement = 'auto';
	@Input() public icon : FaIcon = PlanoFaIconPool.MORE_INFO_TOOLTIP;
	@Input() public theme ?: ModalServiceOptions['theme'] = null;

	@ViewChild('ngContentRef', { static: true }) public ngContentRef ?: ElementRef<HTMLElement>;

	constructor(
		private changeDetectorRef : ChangeDetectorRef,
		private localize : LocalizePipe,
		private console : LogService,
		private modalService : ModalService,
	) {
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get isMobile() : boolean {
		if (this._isMobile !== undefined) return this._isMobile;
		return Config.IS_MOBILE;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get label() : string {
		if (this.headline) return this.headline;
		switch (this.theme) {
			case PThemeEnum.WARNING :
				return this.localize.transform('Warnung');
			case PThemeEnum.DANGER :
				return this.localize.transform('Achtung');
			case PThemeEnum.INFO :
				return this.localize.transform('Info');
			case PThemeEnum.DARK :
			case PThemeEnum.LIGHT :
			case PThemeEnum.PRIMARY :
			case PThemeEnum.SECONDARY :
			case PThemeEnum.SUCCESS :
			case undefined :
				if (this.headline) return this.headline;
				return this.localize.transform('Info');
			default :
				this.console.error(`${this.headline} not supported yet`);
				return this.localize.transform('Info');
		}
	}

	public ngAfterViewInit() : void {
		this.changeDetectorRef.detectChanges();
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public onClickIcon(pop : TooltipDirective) : void {
		if (!this.isMobile) {
			pop.hide();
		} else {
			if (!this.ngContentRef) {
				this.console.error('ngContentRef not defined');
				return;
			}
			if (!this.ngContentRef.nativeElement as unknown) {
				this.console.error('ngContentRef.nativeElement not defined');
				return;
			}
			if (!this.ngContentRef.nativeElement.innerHTML) {
				this.console.error('ngContentRef.nativeElement.innerHTML not defined');
				return;
			}
			this.modalService.openDefaultModal({
				modalTitle: this.label,
				description: this.ngContentRef.nativeElement.innerHTML,
			}, {
				theme: this.theme ?? null,
				centered: true,
			});
		}
	}
}
