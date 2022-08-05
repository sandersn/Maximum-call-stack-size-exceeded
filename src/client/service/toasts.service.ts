import { NgProgressComponent } from 'ngx-progressbar';
import { interval, Subject } from 'rxjs';
import { Subscription } from 'rxjs';
import { distinctUntilChanged, filter, finalize, flatMap, startWith, takeWhile, windowToggle } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { FaIcon } from '@plano/shared/core/component/fa-icon/fa-icon-types';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { ApiListWrapper } from '../../shared/api/base/api-list-wrapper';
import { LogService } from '../../shared/core/log.service';
import { assumeNonNull } from '../../shared/core/null-type-utils';
import { PThemeEnum } from '../shared/bootstrap-styles.enum';
import { PAlertTheme} from '../shared/bootstrap-styles.enum';

export interface ToastObject {

	/**
	 * Title of the Toast.
	 * If you don‘t set it, a default value will be set.
	 * If you set it to null, no title will be shown.
	 */
	title ?: string | null;
	content : string;

	/**
	 * Visual style of the toast
	 */
	theme ?: PAlertTheme;

	/**
	 * Duration of visibility in milliseconds
	 * 3000 is default | 0 means infinite/no timeout
	 */
	// TODO: turn visibilityDuration value into enum.
	visibilityDuration ?: 'short' | 'medium' | 'long' | 'infinite';
	visibleOnMobile ?: boolean;

	/**
	 * Title of the Toast. If set to null, a default value will be set.
	 */
	icon ?: FaIcon;

	close ?: () => void;
	dismiss ?: () => void;
	closeBtnLabel ?: string;
	dismissBtnLabel ?: string;
}

type ProgressPercentage = number;

export interface ExtendedToastObject extends ToastObject {
	progressChange$ : Subject<'start' | 'complete' | ProgressPercentage>,
	progressPaused$ : Subject<boolean>,
	progressInterval : Subscription | null,
	progressPercent : number,
}

@Injectable()
export class ToastsService {
	constructor(
		private localize : LocalizePipe,
		private console : LogService,
	) {
	}

	private toasts : ExtendedToastObject[] = [];

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get toastsAreAvailable() : boolean {
		return !!this.toasts.length;
	}

	/**
	 * To be able to have this.toasts private, i added iterable() like we have it in ApiListWrapper
	 */
	public iterable() : ReturnType<ApiListWrapper<ExtendedToastObject>['iterable']> {
		return this.toasts;
	}

	private getIndexOfItemWithSameContent(toastInput : ToastObject) : number | null {
		for (let i = 0; i < this.toasts.length; i++) {
			if (
				this.toasts[i].content.toString() === toastInput.content.toString() &&
				this.toasts[i].title?.toString() === toastInput.title?.toString()
			) {
				return i;
			}
		}
		return null;
	}

	private initDefaultValues(toast : ToastObject) : void {
		if (toast.theme === undefined) toast.theme = PThemeEnum.PRIMARY;
		if (!toast.visibilityDuration) {
			switch (toast.theme) {
				case PThemeEnum.SUCCESS:
					toast.visibilityDuration = 'short';
					break;
				case PThemeEnum.WARNING:
					toast.visibilityDuration = 'medium';
					break;
				case PThemeEnum.DANGER:
					toast.visibilityDuration = 'infinite';
					break;
				default:
					toast.visibilityDuration = 'medium';
					break;
			}
		}
		if (toast.visibleOnMobile === undefined) toast.visibleOnMobile = true;
		if (toast.close !== undefined && toast.closeBtnLabel === undefined) {
			toast.closeBtnLabel = this.localize.transform('Ok');
		}
		if (toast.dismiss !== undefined && toast.dismissBtnLabel === undefined) {
			toast.dismissBtnLabel = this.localize.transform('Schließen');
		}
	}

	/**
	 * Add a new Toast.
	 */
	public addToast(toastInput : ToastObject) : void {
		let index = this.getIndexOfItemWithSameContent(toastInput);
		if (index !== null) {
			this.runProgress(this.toasts[index]);
			return;
		}

		const toast : ExtendedToastObject = {
			progressChange$ : new Subject(),
			progressPaused$ : new Subject(),
			progressInterval : null,
			progressPercent : 0,
			...toastInput,
		};

		this.initDefaultValues(toast);

		this.toasts.push(toast);
		this.runProgress(toast);
		index = this.getIndexOfItemWithSameContent(toast);
		if (index === null) this.console.warn('Could not find related toast');
	}

	public PROGRESSBAR_SPEED : NgProgressComponent['speed'] = 500;

	private runProgress(toast : ExtendedToastObject) : void {
		const visibilityDuration = this.visibilityDurationToNumber(toast.visibilityDuration ?? 'infinite');
		if (visibilityDuration === null) return;

		// If this progressbar is already running, just reset the interval
		if (toast.progressInterval !== null) {
			toast.progressPercent = 0;
			return;
		}

		toast.progressChange$.next(toast.progressPercent);

		const pause$ = toast.progressPaused$.pipe(
			startWith(false),
			distinctUntilChanged(),
		);
		const ons$ = pause$.pipe(filter(v => v));
		const offs$ = pause$.pipe(filter(v => !v));

		const oneStepPercentage = 100 / visibilityDuration * this.PROGRESSBAR_SPEED;
		toast.progressInterval = interval(this.PROGRESSBAR_SPEED).pipe(
			// Define whats happing after the interval.
			finalize(() => {
				this.removeToast(toast);
			}),

			// Stop when 100 is reached
			// eslint-disable-next-line rxjs/no-ignored-takewhile-value
			takeWhile((_value) => toast.progressPercent < 100),

			// Make progressbar stop depending on toast.progressPaused$ state
			windowToggle(
				offs$,
				() => ons$,
			),
			flatMap(x => x),

		).subscribe(() => {
			const newPercent = toast.progressPercent + oneStepPercentage;
			toast.progressPercent = newPercent;
			toast.progressChange$.next(toast.progressPercent);
		});

	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public visibilityDurationToNumber(visibilityDuration : Exclude<ToastObject['visibilityDuration'], undefined>) : number | null {
		switch (visibilityDuration) {
			case 'short' :
				return 2500;
			case 'medium' :
				return 5000;
			case 'long' :
				return 10000;
			case 'infinite' :
				return null;
		}
	}

	/** Remove one toast from the list of visible toasts */
	public removeToast(input : ToastObject) : void {
		const index = this.getIndexOfItemWithSameContent(input);
		assumeNonNull(index, 'index', 'Could not find related toast');

		const toast = this.toasts[index];

		// If can’t find the ref, remove any.
		toast.progressChange$.next('complete');
		// window.clearTimeout(toast.timeout ?? undefined);
		this.toasts.splice(index, 1);
	}

	/** Hide all toasts immediately / remove them from the internal list */
	public removeAllToasts() : void {
		this.toasts = [];
	}
}
