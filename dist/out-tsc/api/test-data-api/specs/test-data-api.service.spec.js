import { ClientsApiService, TestDataApiService, TestDataApiCountry } from '@plano/shared/api';
import { TestingUtils, LoginRole } from '@plano/shared/testing/testing-utils';
describe('TestDataApiService #needsapi', () => {
    let clientsApi;
    const testingUtils = new TestingUtils();
    let testDataApi;
    beforeAll((done) => {
        testingUtils.login({
            success: () => done(),
            role: LoginRole.ADMIN,
        });
    });
    it('create-client', (done) => {
        // generate test client
        expect().nothing();
        testDataApi = testingUtils.getService(TestDataApiService);
        testDataApi.setEmptyData();
        testDataApi.data.countries.push(TestDataApiCountry.AUSTRIA);
        testDataApi.data.countries.push(TestDataApiCountry.NETHERLANDS);
        testDataApi.save({ success: () => done(), error: fail });
    }, 40000);
    it('remove-client', (done) => {
        clientsApi = testingUtils.getService(ClientsApiService);
        clientsApi.load({
            success: () => {
                // remove all created clients
                for (const createdClientId of testDataApi.data.createdClientIds.iterable()) {
                    expect(clientsApi.data.contains(createdClientId)).toBeTruthy();
                    clientsApi.data.removeItem(createdClientId);
                }
                clientsApi.save({ success: () => done(), error: fail });
            },
        });
    });
});
//# sourceMappingURL=test-data-api.service.spec.js.map