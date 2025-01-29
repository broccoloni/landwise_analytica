export const tiers = [1,4,9,15];
export const couponNames = [null, '10% off', '20% off', '30% off'];

export function getCouponName(numReports: number | null): string | null {
  if (numReports === null) return null;
    
  for (let i = 0; i < tiers.length; i++) {
    if (numReports < tiers[i]) {
      return couponNames[i] || null;
    }
  }
  return couponNames[tiers.length - 1] || null;
}