// lib/bigIntSerializer.ts

import { formatLargeNumber } from "./formatLargeNumber";

export function serializeBigInt(obj: any): any {
  if (typeof obj === 'bigint') {
    return formatLargeNumber(obj);
  } else if (Array.isArray(obj)) {
    return obj.map(serializeBigInt);
  } else if (obj && typeof obj === 'object') {
    const result: any = {};
    for (const key in obj) {
      result[key] = serializeBigInt(obj[key]);
    }
    return result;
  }
  return obj;
}