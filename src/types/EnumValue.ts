import type {EnumType} from "./EnumType";

export type EnumValue<E extends EnumType> = E[keyof E];
