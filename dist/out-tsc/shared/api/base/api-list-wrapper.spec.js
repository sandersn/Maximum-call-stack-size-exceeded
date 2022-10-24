import { ApiListWrapper, ApiDataWrapperBase, ApiObjectWrapper, Meta } from '@plano/shared/api';
import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { Id } from './id';
class NumberListWrapper extends ApiListWrapper {
    createNewItem() {
        this.push(0);
        return 0;
    }
    wrapItem(item) {
        return item;
    }
    containsPrimitives() {
        return true;
    }
    containsIds() {
        return false;
    }
    createInstance(removeDestroyedItems) {
        return new NumberListWrapper(null, removeDestroyedItems);
    }
    get dni() {
        return '0';
    }
}
class ExampleObjectWrapper extends ApiObjectWrapper {
    constructor(api) {
        super(api, ExampleObjectWrapper);
    }
    saveDetailed(_input = {}) {
        throw new Error('Method not implemented.');
    }
    loadDetailed(_input) {
        throw new Error('Method not implemented.');
    }
    get id() {
        return Id.create(Meta.getId(this.rawData));
    }
    _updateRawData(data) {
        this.data = data;
    }
    _fixIds(_idReplacements) {
    }
    get dni() {
        return '0';
    }
}
class DataWrapperListWrapper extends ApiListWrapper {
    createNewItem() {
        const newItem = new ExampleObjectWrapper(this.api);
        newItem._updateRawData([0]);
        this.push(newItem);
        return newItem;
    }
    wrapItem(item) {
        const newWrapper = new ExampleObjectWrapper(this.api);
        newWrapper._updateRawData(item);
        return newWrapper;
    }
    containsPrimitives() {
        return false;
    }
    containsIds() {
        return false;
    }
    createInstance(removeDestroyedItems) {
        return new DataWrapperListWrapper(null, removeDestroyedItems);
    }
    get dni() {
        return '0';
    }
}
describe('ApiListWrapper', () => {
    const testingUtils = new TestingUtils();
    testingUtils.init();
    /**
     * We want to test the list when it contains primitives and data wrappers. To avoid
     * duplicate code this function implements the tests in a general way.
     */
    const doTests = (listFactory, item0, item1, item2, itemNew) => {
        let list;
        const expectParentToBe = (item, value) => {
            if (item instanceof ApiDataWrapperBase)
                expect(item.parent).toBe(value);
        };
        beforeEach(() => {
            // reset all data
            list = listFactory();
            list.push(item0);
            list.push(item1);
            list.push(item2);
            if (itemNew instanceof ApiDataWrapperBase)
                itemNew.parent = null;
        });
        it('get()', () => {
            expect(list.get(1)).toBe(item1);
            if (item1 instanceof ApiObjectWrapper) {
                expect(list.get(item1.id)).toBe(item1);
                expect(item1.parent).toBe(list);
            }
        });
        it('set()', () => {
            expectParentToBe(itemNew, null);
            list.set(1, itemNew);
            expect(list.get(1)).toBe(itemNew);
            expectParentToBe(itemNew, list);
        });
        it('length', () => {
            expect(list.length).toBe(3);
        });
        it('iterable', () => {
            expect(list.iterable()[0]).toBe(item0);
            expect(list.iterable()[1]).toBe(item1);
            expect(list.iterable()[2]).toBe(item2);
        });
        it('remove()', () => {
            const itemToRemove = list.get(1);
            expectParentToBe(itemToRemove, list);
            list.remove(1);
            expect(list.length).toBe(2);
            expect(list.get(0)).toBe(item0);
            expect(list.get(1)).toBe(item2);
            expectParentToBe(itemToRemove, null);
        });
        it('clear()', () => {
            list.clear();
            expect(list.length).toBe(0);
            expectParentToBe(item0, null);
            expectParentToBe(item1, null);
            expectParentToBe(item2, null);
        });
        it('indexOf()', () => {
            expect(list.indexOf(item1)).toBe(1);
            if (item1 instanceof ApiObjectWrapper)
                expect(list.indexOf(item1.id)).toBe(1);
        });
        it('removeItem()', () => {
            expectParentToBe(item1, list);
            list.removeItem(item1);
            expect(list.length).toBe(2);
            expect(list.get(0)).toBe(item0);
            expect(list.get(1)).toBe(item2);
            expectParentToBe(item1, null);
        });
        it('push()', () => {
            expectParentToBe(itemNew, null);
            list.push(itemNew);
            expect(list.length).toBe(4);
            expect(list.get(3)).toBe(itemNew);
            expectParentToBe(itemNew, list);
        });
        it('_updateRawData() ', () => {
            if (item0 instanceof ApiObjectWrapper &&
                item1 instanceof ApiObjectWrapper &&
                item2 instanceof ApiObjectWrapper &&
                itemNew instanceof ApiObjectWrapper) {
                // set new raw data
                const newItemId = Id.create(999);
                const newRawData = [true, [item0.id.rawData, 'a'], [item2.id.rawData, 'b'], [newItemId.rawData, 'c']];
                list._updateRawData(newRawData, false);
                // check that the wrapper objects have not changed
                expect(list.get(item0.id)).toBe(item0);
                expect(list.get(item2.id)).toBe(item2);
                // item1 was removed
                expect(item1.rawData).toBeNull();
                expectParentToBe(item1, null);
                // check that the newly added item has correct parent
                const newItem = list.get(newItemId);
                expectParentToBe(newItem, list);
            }
            else {
                expect().nothing();
            }
        });
    };
    describe('containing primitives', () => {
        doTests(() => { return new NumberListWrapper(null, false); }, 0, 1, 2, 10);
    });
    describe('containing data-wrappers', () => {
        const item0 = new ExampleObjectWrapper(null);
        item0._updateRawData([1]);
        const item1 = new ExampleObjectWrapper(null);
        item1._updateRawData([2]);
        const item2 = new ExampleObjectWrapper(null);
        item2._updateRawData([3]);
        const itemNew = new ExampleObjectWrapper(null);
        itemNew._updateRawData([0]);
        doTests(() => { return new DataWrapperListWrapper(null, false); }, item0, item1, item2, itemNew);
    });
});
//# sourceMappingURL=api-list-wrapper.spec.js.map