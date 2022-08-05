import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { Params} from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
import { Config } from '@plano/shared/core/config';
import { PServiceWithCookiesInterface} from '@plano/shared/core/p-cookie.service';
import { PCookieService } from '@plano/shared/core/p-cookie.service';
import { SidebarTab } from './p-sidebar.types';

@Injectable()
export class PSidebarService implements PServiceWithCookiesInterface {
	private _mainSidebarIsCollapsed : boolean | null = null;

	public currentTab : SidebarTab | null = null;
	private _isWorkloadMode : boolean | null = null;

	private _editMemberListItemsMode : boolean | null = null;
	private _editShiftModelListItemsMode : boolean | null = null;

	private _filterMembersModeActive : boolean | null = null;
	private _filterShiftModelsModeActive : boolean | null = null;

	private _memberSearchTerm : string | null = null;
	private _shiftModelSearchTerm : string | null = null;

	public showWorkload : {
		// eslint-disable-next-line @typescript-eslint/naming-convention
		0 : boolean,
		// eslint-disable-next-line @typescript-eslint/naming-convention
		1 : boolean,
	// eslint-disable-next-line @typescript-eslint/naming-convention
	} = { 0: true, 1: true };

	constructor(
		private pCookieService : PCookieService,
		private activatedRoute : ActivatedRoute,
		private location : Location,
		private router : Router,
	) {
		// watch query params
		this.activatedRoute.queryParams.subscribe((inputQueryParams : Params) => {
			// show members workload?
			if (inputQueryParams['showMembersWorkload'] !== 'true') return;

			// remove query params so reloading page does not trigger this again.
			// We use this.location which also removes the params from browsers history stack.
			const urlWithoutParams = this.router.url.split('?')[0] ;
			this.location.replaceState(urlWithoutParams);

			// show members workload
			this.currentTab = SidebarTab.MEMBERS;
			this.isWorkloadMode = true;
		});
	}

	/**
	 * Init all necessary values for this class
	 */
	public initValues() : void {
		if (this.mainSidebarIsCollapsed === null) this.mainSidebarIsCollapsed = false;
		if (this.currentTab === null) this.currentTab = SidebarTab.DESK;
		if (this.isWorkloadMode === null) this.isWorkloadMode = false;
		if (this.editMemberListItemsMode === null) this.editMemberListItemsMode = false;
		if (this.editShiftModelListItemsMode === null) this.editShiftModelListItemsMode = false;
		if (this.filterMembersModeActive === null) this.filterMembersModeActive = false;
		if (this.filterShiftModelsModeActive === null) this.filterShiftModelsModeActive = false;
		if (this.memberSearchTerm === '') this.memberSearchTerm = '';
		if (this.shiftModelSearchTerm === null) this.shiftModelSearchTerm = '';
	}

	/**
	 * Read values from cookies if available
	 */
	public readCookies() : void {
		if (this.mainSidebarIsCollapsed === null && this.pCookieService.has({name: 'mainSidebarIsCollapsed', prefix: null})) {
			this.mainSidebarIsCollapsed = this.pCookieService.get({name: 'mainSidebarIsCollapsed', prefix: null}) === 'true';
		}
		if (this.isWorkloadMode === null && this.pCookieService.has({name: 'isWorkloadMode', prefix: null})) {
			this.isWorkloadMode = this.pCookieService.get({name: 'isWorkloadMode', prefix: null}) === 'true';
		}
		if (this.editMemberListItemsMode === null && this.pCookieService.has({name: 'editMemberListItemsMode', prefix: null})) {
			this.editMemberListItemsMode = this.pCookieService.get({name: 'editMemberListItemsMode', prefix: null}) === 'true';
		}
		if (this.editShiftModelListItemsMode === null && this.pCookieService.has({name: 'editShiftModelListItemsMode', prefix: null})) {
			this.editShiftModelListItemsMode = this.pCookieService.get({name: 'editShiftModelListItemsMode', prefix: null}) === 'true';
		}
		if (this.filterMembersModeActive === null && this.pCookieService.has({name: 'filterMembersModeActive', prefix: null})) {
			this.filterMembersModeActive = this.pCookieService.get({name: 'filterMembersModeActive', prefix: null}) === 'true';
		}
		if (this.filterShiftModelsModeActive === null && this.pCookieService.has({name: 'filterShiftModelsModeActive', prefix: null})) {
			this.filterShiftModelsModeActive = this.pCookieService.get({name: 'filterShiftModelsModeActive', prefix: null}) === 'true';
		}
		if (this.memberSearchTerm === null && this.pCookieService.has({name: 'memberSearchTerm', prefix: null})) {
			this.memberSearchTerm = this.pCookieService.get({name: 'memberSearchTerm', prefix: null})!;
		}
		if (this.shiftModelSearchTerm === null && this.pCookieService.has({name: 'shiftModelSearchTerm', prefix: null})) {
			this.shiftModelSearchTerm = this.pCookieService.get({name: 'shiftModelSearchTerm', prefix: null})!;
		}
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get mainSidebarIsCollapsed() : boolean | null {
		if (Config.IS_MOBILE) return true;
		return this._mainSidebarIsCollapsed;
	}
	public set mainSidebarIsCollapsed(value : boolean | null) {
		this.pCookieService.put({name: 'mainSidebarIsCollapsed', prefix: null}, value ?? false);
		this._mainSidebarIsCollapsed = value;
	}
	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get isWorkloadMode() : boolean | null {
		return this._isWorkloadMode;
	}
	public set isWorkloadMode(value : boolean | null) {
		this.pCookieService.put({name: 'isWorkloadMode', prefix: null}, value ?? false);
		this._isWorkloadMode = value;
	}
	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get editMemberListItemsMode() : boolean | null {
		return this._editMemberListItemsMode;
	}
	public set editMemberListItemsMode(value : boolean | null) {
		this.pCookieService.put({name: 'editMemberListItemsMode', prefix: null}, value ?? false);
		this._editMemberListItemsMode = value;
	}
	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get editShiftModelListItemsMode() : boolean | null {
		return this._editShiftModelListItemsMode;
	}
	public set editShiftModelListItemsMode(value : boolean | null) {
		this.pCookieService.put({name: 'editShiftModelListItemsMode', prefix: null}, value ?? false);
		this._editShiftModelListItemsMode = value;
	}
	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get filterMembersModeActive() : boolean | null {
		return this._filterMembersModeActive;
	}
	public set filterMembersModeActive(value : boolean | null) {
		this.pCookieService.put({name: 'filterMembersModeActive', prefix: null}, value ?? false);
		this._filterMembersModeActive = value;
	}
	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get filterShiftModelsModeActive() : boolean | null {
		return this._filterShiftModelsModeActive;
	}
	public set filterShiftModelsModeActive(value : boolean | null) {
		this.pCookieService.put({name: 'filterShiftModelsModeActive', prefix: null}, value ?? false);
		this._filterShiftModelsModeActive = value;
	}
	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get memberSearchTerm() : string | null {
		return this._memberSearchTerm;
	}
	public set memberSearchTerm(value : string | null) {
		this.pCookieService.put({name: 'memberSearchTerm', prefix: null}, value ?? '');
		this._memberSearchTerm = value;
	}
	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get shiftModelSearchTerm() : string | null {
		return this._shiftModelSearchTerm ?? '';
	}
	public set shiftModelSearchTerm(value : string | null) {
		this.pCookieService.put({name: 'shiftModelSearchTerm', prefix: null}, value ?? '');
		this._shiftModelSearchTerm = value;
	}

	/** @see PServiceInterface['unload'] */
	public unload() : void {
		this._mainSidebarIsCollapsed = null;
		this.currentTab = null;
		this._isWorkloadMode = null;
		this._editMemberListItemsMode = null;
		this._editShiftModelListItemsMode = null;
		this._filterMembersModeActive = null;
		this._filterShiftModelsModeActive = null;
		this._memberSearchTerm = null;
		this._shiftModelSearchTerm = null;

		// eslint-disable-next-line @typescript-eslint/naming-convention
		this.showWorkload = { 0: true, 1: true };
	}
}
