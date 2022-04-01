// ISAAC: a fast cryptographic random number generator
// http://www.burtleburtle.net/bob/rand/isaacafa.html

const goldenRatio = 0x9e3779b9;

// Generates 256 32-bits at once
export class ISAACGenerator {
  private readonly mm: number[] = new Array<number>(256).fill(0);
  public readonly randrsl: number[] = new Array<number>(256).fill(0);
  private aa = 0;
  private bb = 0;
  private cc = 0;

  // todo: seed
  public constructor(seed?: number[]) {
    let i = 0;
    const v = new Array<number>(8).fill(goldenRatio);

    for (i = 0; i < 4; ++i /* scramble it */) {
      mix(v);
    }

    for (i = 0; i < 256; i += 8 /* fill in mm[] with messy stuff */) {
      if (seed) {
        /* use all the information in the seed */
        v[0] = add32(v[0], seed[i]);
        v[1] = add32(v[1], seed[i + 1]);
        v[2] = add32(v[2], seed[i + 2]);
        v[3] = add32(v[3], seed[i + 3]);
        v[4] = add32(v[4], seed[i + 4]);
        v[5] = add32(v[5], seed[i + 5]);
        v[6] = add32(v[6], seed[i + 6]);
        v[7] = add32(v[7], seed[i + 7]);
      }
      mix(v);
      this.mm[i] = v[0];
      this.mm[i + 1] = v[1];
      this.mm[i + 2] = v[2];
      this.mm[i + 3] = v[3];
      this.mm[i + 4] = v[4];
      this.mm[i + 5] = v[5];
      this.mm[i + 6] = v[6];
      this.mm[i + 7] = v[7];
    }

    if (seed) {
      /* do a second pass to make all of the seed affect all of mm */
      for (i = 0; i < 256; i += 8) {
        v[0] = add32(v[0], this.mm[i]);
        v[1] = add32(v[1], this.mm[i + 1]);
        v[2] = add32(v[2], this.mm[i + 2]);
        v[3] = add32(v[3], this.mm[i + 3]);
        v[4] = add32(v[4], this.mm[i + 4]);
        v[5] = add32(v[5], this.mm[i + 5]);
        v[6] = add32(v[6], this.mm[i + 6]);
        v[7] = add32(v[7], this.mm[i + 7]);
        mix(v);
        this.mm[i] = v[0];
        this.mm[i + 1] = v[1];
        this.mm[i + 2] = v[2];
        this.mm[i + 3] = v[3];
        this.mm[i + 4] = v[4];
        this.mm[i + 5] = v[5];
        this.mm[i + 6] = v[6];
        this.mm[i + 7] = v[7];
      }
    }

    this.isaac(); /* fill in the first set of results */
  }

  public isaac() {
    let x = 0,
      y = 0;

    this.cc = add32(this.cc, 1); /* cc just gets incremented once per 256 results */
    this.bb = add32(this.bb, this.cc); /* then combined with bb */

    for (let i = 0; i < 256; ++i) {
      x = this.mm[i];
      switch (i % 4) {
        case 0:
          this.aa = (this.aa ^ (this.aa << 13)) >>> 0;
          break;
        case 1:
          this.aa = (this.aa ^ (this.aa >>> 6)) >>> 0;
          break;
        case 2:
          this.aa = (this.aa ^ (this.aa << 2)) >>> 0;
          break;
        case 3:
          this.aa = (this.aa ^ (this.aa >>> 16)) >>> 0;
          break;
      }
      this.aa = add32(this.mm[(i + 128) & 0xff], this.aa);
      y = add32(this.mm[(x >>> 2) & 0xff], add32(this.aa, this.bb));
      this.mm[i] = y;
      this.bb = add32(this.mm[(y >>> 10) & 0xff], x);
      this.randrsl[i] = this.bb;

      /* Note that bits 2..9 are chosen from x but 10..17 are chosen
             from y.  The only important thing here is that 2..9 and 10..17
             don't overlap.  2..9 and 10..17 were then chosen for speed in
             the optimized version (rand.c) */
      /* See http://burtleburtle.net/bob/rand/isaac.html
             for further explanations and analysis. */
    }
  }
}

function mix(v: number[]) {
  let [a, b, c, d, e, f, g, h] = v;
  a = (a ^ (b << 11)) >>> 0;
  d = add32(d, a);
  b = add32(b, c);
  b = (b ^ (c >>> 2)) >>> 0;
  e = add32(e, b);
  c = add32(c, d);
  c = (c ^ (d << 8)) >>> 0;
  f = add32(f, c);
  d = add32(d, e);
  d = (d ^ (e >>> 16)) >>> 0;
  g = add32(g, d);
  e = add32(e, f);
  e = (e ^ (f << 10)) >>> 0;
  h = add32(h, e);
  f = add32(f, g);
  f = (f ^ (g >>> 4)) >>> 0;
  a = add32(a, f);
  g = add32(g, h);
  g = (g ^ (h << 8)) >>> 0;
  b = add32(b, g);
  h = add32(h, a);
  h = (h ^ (a >>> 9)) >>> 0;
  c = add32(c, h);
  a = add32(a, b);
  v[0] = a;
  v[1] = b;
  v[2] = c;
  v[3] = d;
  v[4] = e;
  v[5] = f;
  v[6] = g;
  v[7] = h;
}

function add32(x: number, y: number): number {
  const lsb = (x & 0xffff) + (y & 0xffff);
  const msb = (x >>> 16) + (y >>> 16) + (lsb >>> 16);
  return ((msb << 16) | (lsb & 0xffff)) >>> 0;
}
