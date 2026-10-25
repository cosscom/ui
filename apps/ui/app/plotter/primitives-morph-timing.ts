export const morphStageDuration = 3.2;
export const morphHoldDuration = 2.4;
export const morphCycleDuration = 5 * morphStageDuration;

export function morphKeyTimes(...seconds: number[]) {
  return seconds.map((second) => second / morphCycleDuration).join(";");
}
