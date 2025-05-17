/**
 * American markets only have two types of holiday statuses
 *
 * A holiday will either make the entire exchange closed, or will in certain
 * cases make the market a half day
 */
export enum NYSE_HolidayStatus{
    HALF_DAY= "HALF_DAY",
    CLOSED= "CLOSED",
}
