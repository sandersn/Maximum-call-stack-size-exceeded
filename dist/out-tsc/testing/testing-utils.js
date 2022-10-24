/* eslint-disable no-console, jsdoc/require-jsdoc -- This class should not inject LogService */
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { APP_BASE_HREF } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { MeService } from '@plano/shared/api';
import { PSupportedLocaleIds } from '../api/base/generated-types.ag';
import { RandomValueUtils } from '../core/random-value-utils';
/**
 * Defines the role be to used for login.
 */
export var LoginRole;
(function (LoginRole) {
    /**
     * Member like someone who works in a climbing gym
     */
    LoginRole[LoginRole["CLIENT_DEFAULT"] = 0] = "CLIENT_DEFAULT";
    /**
     * Member like someone who works in a climbing gym with additional write permission for all shift-models
     * and the booking-system-settings.
     */
    LoginRole[LoginRole["CLIENT_DEFAULT_WITH_WRITE_PERMISSION"] = 1] = "CLIENT_DEFAULT_WITH_WRITE_PERMISSION";
    /**
     * Admin like the CEO of a climbing gym
     */
    LoginRole[LoginRole["CLIENT_OWNER"] = 2] = "CLIENT_OWNER";
    /**
     * Admin like one of the Dr. Plano developers
     */
    LoginRole[LoginRole["ADMIN"] = 3] = "ADMIN";
    /**
     * Admin like mighty Milad
     */
    LoginRole[LoginRole["SUPER_ADMIN"] = 4] = "SUPER_ADMIN";
    /**
     * CLIENT_OWNER with an expired account
     */
    LoginRole[LoginRole["CLIENT_OWNER_EXPIRED"] = 5] = "CLIENT_OWNER_EXPIRED";
})(LoginRole || (LoginRole = {}));
/**
 * When creating a component as modal there will be NgbActiveModal provider available.
 * As we cannot create our components as modals (too many problems :( ) we fake the provider.
 */
class NgbActiveModalProvider extends NgbActiveModal {
}
const resetTestingModule = TestBed.resetTestingModule;
const preventAngularFromResetting = () => TestBed.resetTestingModule = () => TestBed;
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
    init({} = {}) {
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
    init2({ imports = [], providers = [] } = {}) {
        // Hack to stop angular from resetting all dependencies before each test. Now all
        // dependencies are only created once at test start.
        // Each reset means that all dependent components
        // have to be compiled by the JIT compiler which is very slow.
        // See "https://github.com/angular/angular/issues/12409" for details.
        resetTestingModule();
        preventAngularFromResetting();
        TestBed.configureTestingModule({
            declarations: [],
            providers: [
                { provide: APP_BASE_HREF, useValue: '' },
                // eslint-disable-next-line @typescript-eslint/naming-convention
                { provide: NgbActiveModal, NgbActiveModalProvider: NgbActiveModalProvider },
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
    testForRoles(roles, tests) {
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
    async login({ success, role = LoginRole.CLIENT_OWNER, member = null, email = null, password = null, error, } = {}) {
        // get login data
        let username;
        password = password !== null && password !== void 0 ? password : 'Drp123.';
        let searchParams = new HttpParams();
        if (member) {
            username = member.email;
        }
        else if (email) {
            username = email;
        }
        else {
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
        await me.login(me.calcBasisAuthValue(username, password), false, true, () => {
            if (success)
                success();
        }, (response) => {
            if (error)
                error(response);
            else
                this.logApiError(response);
        }, searchParams);
        return me;
    }
    /**
     * Returns a service.
     */
    getService(token) {
        return TestBed.inject(token);
    }
    /**
     * Create a component.
     */
    createComponent(component) {
        const fixture = this.createFixture(component);
        // testComponent.detectChanges();
        return fixture.componentInstance;
    }
    /**
     * Create a component.
     */
    createFixture(component) {
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
    async unloadAndLoadApi(apiClass, done, searchParams) {
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
    async loadApi(apiClass, done, searchParams) {
        const api = this.getService(apiClass);
        return new Promise((resolve, reject) => {
            api.load({
                success: () => {
                    if (done)
                        done();
                    resolve(api);
                },
                error: (response) => {
                    if (response.status === 434)
                        console.error(`Api version mismatch`);
                    this.logApiError(response);
                    reject();
                },
                searchParams: searchParams !== null && searchParams !== void 0 ? searchParams : null,
            });
        });
    }
    logApiError(response) {
        // fail current test
        fail();
        // error message
        if (response === 'not_ascii') {
            console.error('Error calling API because login-data contained non ASCII characters.');
        }
        else {
            console.error(`Error calling API "${response.url}" (Code: ${response.status})`);
            if (response.status === 0) {
                console.error('Backend running?');
            }
        }
    }
    /**
     * getApiQueryParams
     */
    getApiQueryParams(dataType) {
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
    checkFileExists(url, resultHandler) {
        if (url === null) {
            resultHandler(false);
            return;
        }
        const xhr = new XMLHttpRequest();
        xhr.addEventListener('readystatechange', function () {
            if (this.readyState === this.DONE)
                resultHandler(this.status === 200);
        });
        xhr.open('HEAD', url);
        xhr.send();
    }
    /**
     * @returns Checks if two ids are equal.
     */
    safeEquals(id1, id2) {
        return (id1 === null && id2 === null) ||
            (id1 !== null && id1.equals(id2));
    }
}
//# sourceMappingURL=testing-utils.js.map