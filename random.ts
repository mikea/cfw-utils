import { ISAACGenerator } from "./isaacRandom";
import { MersenneTwister } from "./mersenneTwister";

export interface IRandom32 {
  // 32-bit unsigned random
  randU32(): number;
}

const maxU32 = 0xffffffff;

// [0,1] with 32 bit resolution
export function real(rnd: IRandom32): number {
  return rnd.randU32() * (1 / maxU32);
}

// (0,1) with 32 bit resolution
export function realx(rnd: IRandom32): number {
  return (rnd.randU32() + 0.5) * (1 / (maxU32 + 1));
}

// [0,1) with 32 bit resolution
export function rnd(rnd: IRandom32): number {
  return rnd.randU32() * (1 / (maxU32 + 1));
}

// Mersenne twister generator
export function newRandom32(seed = 0): IRandom32 {
  const generator = new MersenneTwister(seed);
  return {
    randU32() {
      return generator.randU32();
    },
  };
}

// Cryptographically secure random number generator
export function newCryptoRandom32(seed?: number[]): IRandom32 {
  const generator = new ISAACGenerator(seed);
  let consumed = 0;

  return {
    randU32() {
      const result = generator.randrsl[consumed];
      consumed++;
      if (consumed == generator.randrsl.length) {
        consumed = 0;
        generator.isaac();
      }
      return result;
    },
  };
}
