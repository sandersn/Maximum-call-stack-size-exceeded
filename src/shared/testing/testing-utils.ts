/* eslint-disable no-console, jsdoc/require-jsdoc -- This class should not inject LogService */
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { APP_BASE_HREF } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { Type } from '@angular/core';
import { ComponentFixture, TestBedStatic } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { PossibleApiLoadDataValues } from '@plano/client/scheduling/scheduling-api-based-pages.service';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { SchedulingApiMemberBase } from '@plano/shared/api';
import { MeService } from '@plano/shared/api';
import { ApiBase } from '@plano/shared/api/base/api-base';
import { PSupportedLocaleIds } from '../api/base/generated-types.ag';
import { Url, Email} from '../api/base/generated-types.ag';
import { Id } from '../api/base/id';
import { RandomValueUtils } from '../core/random-value-utils';

interface InitArgs {

	/**
	 * List of modules to be imported.
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	imports ?: any[];

	/**
	 * List of service providers.
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	providers ?: any[];
}

/**
 * Defines the role be to used for login.
 */
export enum LoginRole {

	/**
	 * Member like someone who works in a climbing gym
	 */
	CLIENT_DEFAULT,

	/**
	 * Member like someone who works in a climbing gym with additional write permission for all shift-models
	 * and the booking-system-settings.
	 */
	CLIENT_DEFAULT_WITH_WRITE_PERMISSION,

	/**
	 * Admin like the CEO of a climbing gym
	 */
	CLIENT_OWNER,

	/**
	 * Admin like one of the Dr. Plano developers
	 */
	ADMIN,

	/**
	 * Admin like mighty Milad
	 */
	SUPER_ADMIN,

	/**
	 * CLIENT_OWNER with an expired account
	 */
	CLIENT_OWNER_EXPIRED,
}

interface LoginArgs {

	/**
	 * Success handler
	 */
	success ?: () => void;

	/**
	 * Role to be used for login.
	 */
	role ?: LoginRole;

	/**
	 * Member to login as.
	 */
	member ?: SchedulingApiMemberBase | null;

	/**
	 * Email address to login as.
	 */
	email ?: Email | null;

	/**
	 * Password to login with.
	 */
	password ?: string | null;

	/**
	 * Error handler.
	 */
	error ?: (response : HttpErrorResponse | 'not_ascii') => void;
}

/**
 * When creating a component as modal there will be NgbActiveModal provider available.
 * As we cannot create our components as modals (too many problems :( ) we fake the provider.
 */
class NgbActiveModalProvider extends NgbActiveModal {

}

const resetTestingModule = TestBed.resetTestingModule;
const preventAngularFromResetting = () : () => TestBedStatic => TestBed.resetTestingModule = () => TestBed;
// const allowAngularToReset = () => TestBed.resetTestingModule = resetTestingModule;

/**
 * Utility class for testing.
 */
export class TestingUtils extends RandomValueUtils {

	/**
	 * Init testing environment.
	 * @param imports Array of modules to be imported.
	 */
	// eslint-disable-next-line no-empty-pattern
	public init({/* imports = [], providers = [] */} : InitArgs = {}) : void {
		// Hack to stop angular from resetting all dependencies before each test. Now they are only resetted
		// by "beforeAll". Each reset means that all dependent components
		// have to be compiled by the JIT compiler which is very slow.
		// See "https://github.com/angular/angular/issues/12409" for details.
		/* beforeAll(done => (async () => {
			resetTestingModule();
			preventAngularFromResetting();

			TestBed.configureTestingModule(
			{
				declarations: [
				],
				providers: [
					{provide: APP_BASE_HREF, useValue: ''},
					{provide: NgbActiveModal, NgbActiveModalProvider}
				].concat(providers),
				imports: [
					MeModule,
					RouterModule.forRoot([])
				].concat(imports)
			});

			await TestBed.compileComponents();

			// prevent Angular from resetting testing module
			TestBed.resetTestingModule = () => TestBed;
		})().then(done).catch(done.fail));

		afterAll(() => allowAngularToReset());*/
	}

	public init2({imports = [], providers = []} : InitArgs = {}) : void {
		// Hack to stop angular from resetting all dependencies before each test. Now all
		// dependencies are only created once at test start.
		// Each reset means that all dependent components
		// have to be compiled by the JIT compiler which is very slow.
		// See "https://github.com/angular/angular/issues/12409" for details.
		resetTestingModule();
		preventAngularFromResetting();

		TestBed.configureTestingModule(
			{
				declarations: [
				],
				providers: [
					{provide: APP_BASE_HREF, useValue: ''},
					// eslint-disable-next-line @typescript-eslint/naming-convention
					{provide: NgbActiveModal, NgbActiveModalProvider: NgbActiveModalProvider},
				].concat(providers),
				imports: [
					RouterModule.forRoot([]),
				].concat(imports),
			});

		TestBed.compileComponents();

		// prevent Angular from resetting testing module
		TestBed.resetTestingModule = () => TestBed;
	}

	/**
	 * Use this method to let a test be executed for different roles.
	 */
	public testForRoles(roles : LoginRole[], tests : () => void) : void {
		for (const role of roles) {
			const roleString = LoginRole[role];

			describe(roleString, () => {
				// login with role
				beforeAll(done => {
					this.login({
						success: () => done(),
						role: role,
					});
				});

				// execute tests
				tests();
			});
		}
	}

	/**
	 * Login as client owner. The credentials are set after backend has confirmed that they are correct.
	 * So, do further api calls in or after the "success" handler.
	 * returns MeService instance
	 *
	 * This method will automatically fail the if api responds with an error and no "error" handler is defined.
	 */
	public async login({
		success,
		role = LoginRole.CLIENT_OWNER,
		member = null,
		email = null,
		password = null,
		error,
	} : LoginArgs = {}) : Promise<MeService> {
		// get login data
		let username : string;
		password = password ?? 'Drp123.';
		let searchParams = new HttpParams();

		if (member) {
			username = member.email;
		} else if (email) {
			username = email;
		} else {
			switch (role) {
				case LoginRole.CLIENT_OWNER:
					username = 'adam@dr-plano.de';
					break;

				case LoginRole.ADMIN:
				case LoginRole.SUPER_ADMIN:
					username = 'admin@dr-plano.de';
					searchParams = searchParams.set('adminArea', '');
					break;

				case LoginRole.CLIENT_DEFAULT:
					username = 'anna@dr-plano.de';
					break;

				case LoginRole.CLIENT_DEFAULT_WITH_WRITE_PERMISSION:
					username = 'alex@dr-plano.de';
					break;

				case LoginRole.CLIENT_OWNER_EXPIRED:
					username = 'expired@dr-plano.de';
					break;

				default:
					throw new Error('Unexpected role');
			}
		}

		// login…
		const me = TestBed.inject(MeService);
		await me.login(me.calcBasisAuthValue(username, password), false, true,
			() => {
				if (success)
					success();
			},
			(response : HttpErrorResponse | 'not_ascii') => {
				if (error)
					error(response);
				else
					this.logApiError(response);
			},
			searchParams);

		return me;
	}

	/**
	 * Returns a service.
	 */
	public getService<T>(token : Type<T>) : T {
		return TestBed.inject(token);
	}

	/**
	 * Create a component.
	 */
	public createComponent<T>(component : Type<T>) : T {
		const fixture = this.createFixture(component);
		// testComponent.detectChanges();
		return fixture.componentInstance;
	}

	/**
	 * Create a component.
	 */
	public createFixture<T>(component : Type<T>) : ComponentFixture<T> {
		return TestBed.createComponent(component);
	}

	/**
	 * First unload api and then load again.
	 * @param apiClass The api service class to be loaded.
	 * @param done Done method to be called when api was loaded.
	 * @param searchParams Optionally pass here additionally load params.
	 * @returns Returns the api service.
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public async unloadAndLoadApi<T extends ApiBase>(apiClass : Type<T>, done ?: any, searchParams ?: HttpParams) : Promise<T> {
		const api = this.getService(apiClass);
		api.unload();
		return this.loadApi(apiClass, done, searchParams);
	}

	/**
	 * Load api.
	 * @param apiClass The api service class to be loaded.
	 * @param done Done method to be called when api was loaded.
	 * @param searchParams Optionally pass here additionally load params.
	 * @returns Returns the api service.
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public async loadApi<T extends ApiBase>(apiClass : Type<T>, done : any, searchParams ?: HttpParams) : Promise<T> {
		const api = this.getService(apiClass);
		return new Promise((resolve, reject) => {
			api.load({
				success: () => {
					if (done)
						done();

					resolve(api);
				},
				error: (response : HttpErrorResponse) => {
					if (response.status === 434) console.error(`Api version mismatch`);
					this.logApiError(response);

					reject();
				},
				searchParams: searchParams ?? null,
			});
		});
	}

	public logApiError(response : HttpErrorResponse | 'not_ascii') : void {
		// fail current test
		fail();

		// error message
		if (response === 'not_ascii') {
			console.error('Error calling API because login-data contained non ASCII characters.');
		} else {
			console.error(`Error calling API "${response.url}" (Code: ${response.status})`);
			if (response.status === 0) {
				console.error('Backend running?');
			}
		}
	}

	/**
	 * getApiQueryParams
	 */
	public getApiQueryParams(dataType : PossibleApiLoadDataValues) : HttpParams {
		const now = new PMomentService(PSupportedLocaleIds.de_DE).m();

		return new HttpParams()
			.set('data', dataType)
			.set('start', now.clone().subtract(3, 'day').valueOf().toString())
			.set('end', now.clone().add(4, 'day').valueOf().toString());
	}

	/**
	 * Checks if a file under given `url` exists. When result is available the handler `resultHandler`
	 * with the information if the file exists will be called.
	 */
	public checkFileExists(url : Url | null, resultHandler : (exists : boolean) => void) : void {
		if (url === null) {
			resultHandler(false);
			return;
		}

		const xhr = new XMLHttpRequest();

		xhr.addEventListener('readystatechange', function() {
			if (this.readyState === this.DONE)
				resultHandler(this.status === 200);
		});
		xhr.open('HEAD', url);
		xhr.send();
	}

	/**
	 * @returns Checks if two ids are equal.
	 */
	public safeEquals(id1 : Id | null, id2 : Id | null) : boolean {
		return (id1 === null && id2 === null) ||
			(id1 !== null && id1.equals(id2));
	}
}
