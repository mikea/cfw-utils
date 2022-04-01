const n = 624;
const m = 397;
const upperMask = 0x80000000;
const lowerMask = 0x7fffffff;
const matrixA = 0x9908b0df;
const mag01 = [0, matrixA];

export class MersenneTwister {
  private readonly mt = new Array<number>(n);
  private mti = n + 1;

  constructor(seed: number) {
    this.seed = seed;
  }

  private set seed(seed: number) {
    this.mt[0] = seed >>> 0;
    for (this.mti = 1; this.mti < n; this.mti++) {
      const s = this.mt[this.mti - 1] ^ (this.mt[this.mti - 1] >>> 30);
      this.mt[this.mti] = ((((s & 0xffff0000) >>> 16) * 1812433253) << 16) + (s & 0x0000ffff) * 1812433253 + this.mti;
      this.mt[this.mti] >>>= 0;
    }
  }

  public randU32(): number {
    let y: number;

    if (this.mti >= n) {
      if (this.mti === n + 1) {
        this.seed = 5489;
      }

      let kk: number;

      for (kk = 0; kk < n - m; kk++) {
        y = (this.mt[kk] & upperMask) | (this.mt[kk + 1] & lowerMask);
        this.mt[kk] = this.mt[kk + m] ^ (y >>> 1) ^ mag01[y & 1];
      }

      for (; kk < n - 1; kk++) {
        y = (this.mt[kk] & upperMask) | (this.mt[kk + 1] & lowerMask);
        this.mt[kk] = this.mt[kk + (m - n)] ^ (y >>> 1) ^ mag01[y & 1];
      }

      y = (this.mt[n - 1] & upperMask) | (this.mt[0] & lowerMask);
      this.mt[n - 1] = this.mt[m - 1] ^ (y >>> 1) ^ mag01[y & 1];
      this.mti = 0;
    }

    y = this.mt[this.mti++];

    y ^= y >>> 11;
    y ^= (y << 7) & 0x9d2c5680;
    y ^= (y << 15) & 0xefc60000;
    y ^= y >>> 18;

    return y >>> 0;
  }
}
