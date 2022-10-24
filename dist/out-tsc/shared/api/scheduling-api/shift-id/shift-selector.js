import { Id } from '@plano/shared/api/base/id';
import { IdBase } from '../../base/id-base';
/**
 * This class describes a group of shifts.
 */
export class ShiftSelector extends IdBase {
    /**
     * A shift-selector cannot be instantiated publicly as it always comes from backend.
     */
    constructor(value) {
        super(value);
        // An id is treated as an primitive/immutable object so it is safe to create a fixed id wrapper object.
        this._shiftModelId = Id.create(this.data[1]);
    }
    /**
     * @param value The raw-data of the shift-id or a negative new-item-id.
     */
    static create(value) {
        return new ShiftSelector(value);
    }
    /**
     * The shift-model id.
     */
    get shiftModelId() {
        return this._shiftModelId;
    }
    /**
     * The shift-model version this shift is based on.
     */
    get shiftModelVersion() {
        return this.data[2];
    }
    /**
     * The series-id of this shift.
     */
    get seriesId() {
        return this.data[3];
    }
    /**
     * The packet index starting from 0. Also shifts which are not packets currently have here the value 0.
     * Thus, currently it is not possible to determine from this value if this is a packet or not.
     * Instead, shift.packetShifts can be examined to determine this.
     */
    get packetIndex() {
        return this.data[4];
    }
    /**
     * The shift-index of this shift.
     */
    get shiftIndex() {
        return this.data[5];
    }
    /**
     * The start-time of this shift (beginning of day).
     */
    get start() {
        return this.data[6];
    }
    /**
     * The end-time of this shift (end of day).
     */
    get end() {
        return this.data[7];
    }
    /**
     * The course-code of this shift.
     */
    get courseCode() {
        return this.data[8];
    }
    /**
     * @returns Do the shift-id values "thisValue" contains the value of another shift-selector "otherValue"?
     */
    valueContains(thisValue, otherValue) {
        return thisValue === otherValue || thisValue === null;
    }
    /**
     * @returns Does this shift-selector contains "other" shift-selector?
     */
    contains(other) {
        if (!this.valueContains(this.shiftModelId.id.rawData, other.shiftModelId.id.rawData))
            return false;
        if (!this.valueContains(this.seriesId, other.seriesId))
            return false;
        if (!this.valueContains(this.packetIndex, other.packetIndex))
            return false;
        if (!this.valueContains(this.shiftIndex, other.shiftIndex))
            return false;
        // Is start/end contained?
        if (this.start && (other.start === null || this.start > other.start))
            return false;
        if (this.end && (other.end === null || this.end < other.end))
            return false;
        // passed all tests
        return true;
    }
    /**
     * @returns Does this shift-selector and "other" belong to the same packet?
     */
    isSamePacket(other) {
        if (!(this.shiftModelId.rawData && this.shiftModelId.rawData === other.shiftModelId.rawData))
            return false;
        if (!(this.seriesId !== null && this.seriesId === other.seriesId))
            return false;
        if (!(this.packetIndex !== null && this.packetIndex === other.packetIndex))
            return false;
        return true;
    }
    /**
     * @returns Returns 0 if "v" is null or undefined. Otherwise "v" is returned.
     */
    ensureNumber(v) {
        return v !== null && v !== void 0 ? v : 0;
    }
    /**
     * Compares two shift-selectors. First criteria is start time. Then shift-model. Then, series id. And so on.
     * @param other The other shift-selector we are comparing with. Cannot be "null".
     * @param thisTime Current implementation of shift-selector start/end does not contain time information. It is always start/end of day.
     * 		Optionally pass here an alternativ start value for "this". This will be used instead of the shift-selector's own start value for comparison.
     * @param otherStart Equivalent to "thisStart". For "other" shiftSelector.
     */
    compare(other, thisStart = null, otherStart = null) {
        let compare;
        // compare start
        if (!thisStart)
            thisStart = this.start;
        if (!otherStart)
            otherStart = other.start;
        compare = this.ensureNumber(thisStart) - this.ensureNumber(otherStart);
        if (compare !== 0)
            return compare;
        // compare by shift-model
        compare = this.ensureNumber(this.shiftModelId.rawData) - this.ensureNumber(other.shiftModelId.rawData);
        if (compare !== 0)
            return compare;
        // compare by series id
        compare = this.ensureNumber(this.seriesId) - this.ensureNumber(other.seriesId);
        if (compare !== 0)
            return compare;
        // compare by packet index
        compare = this.ensureNumber(this.packetIndex) - this.ensureNumber(other.packetIndex);
        if (compare !== 0)
            return compare;
        // compare by shift index
        compare = this.ensureNumber(this.shiftIndex) - this.ensureNumber(other.shiftIndex);
        if (compare !== 0)
            return compare;
        return 0;
    }
}
//# sourceMappingURL=shift-selector.js.map