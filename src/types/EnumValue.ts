import type {EnumType} from "./EnumType";

export type EnumValue<T extends EnumType> = T[keyof T];
