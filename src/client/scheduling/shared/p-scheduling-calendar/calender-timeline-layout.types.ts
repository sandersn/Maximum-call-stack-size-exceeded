import { ISchedulingApiShift } from '../api/scheduling-api.interfaces';

export interface ILayout {
	x : number;
	y : number;
	z : number;
	width : number;
	height : number;
	show : boolean;
}

export interface IShiftData {

	/**
	 * Layout object for this shift.
	 */
	layout : ILayout;

	shift : ISchedulingApiShift | null;
}

export interface IColumnData {

	/**
	 * Layout object for this column.
	 */
	layout : ILayout;

	/**
	 * Name of the column. Possible types:
	 * - string: The column represents a shiftmodel-parent.
	 * - number: The column represents a day column (timestamp of start of the day).
	 */
	name : string | number | null;

	/**
	 * Shifts data belonging to this column.
	 */
	shifts : Array<IShiftData>;
}
