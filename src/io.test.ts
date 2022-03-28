import { assert } from "chai";
import * as t from "./io";

describe("boolean", () => {
  const model = t.boolean;

  it("validates correctly", () => {
    assert.equal(model.decode(true), true);
    assert.equal(model.decode(false), false);
    assert.instanceOf(model.decode("test"), Error);
  });
});

describe("string", () => {
  const model = t.string;

  it("validates correctly", () => {
    assert.equal(model.decode("test"), "test");
    assert.instanceOf(model.decode(true), Error);
  });
});

describe("literal", () => {
  const model = t.literal("lit");

  it("validates correctly", () => {
    assert.equal(model.decode("lit"), "lit");
    assert.instanceOf(model.decode("test"), Error);
    assert.instanceOf(model.decode(true), Error);
  });
});

describe("union", () => {
  const model = t.union([t.string, t.boolean]);

  it("validates correctly", () => {
    assert.equal(model.decode("test"), "test");
    assert.equal(model.decode(true), true);
    assert.instanceOf(model.decode(10), Error);
  });
});

describe("record", () => {
  const model = t.record(t.string, t.boolean);

  it("validates correctly", () => {
    assert.deepEqual(model.decode({ test: true }), { test: true });
    assert.instanceOf(model.decode(10), Error);
    assert.instanceOf(model.decode({ test: 19 }), Error);
  });
});

describe("struct", () => {
  const model = t.struct({ a: t.string, b: t.number });

  it("validates correctly", () => {
    assert.deepEqual(model.decode({ a: "1", b: 2 }), { a: "1", b: 2 });

    assert.instanceOf(model.decode(10), Error);
    assert.instanceOf(model.decode({ a: "1" }), Error);
    assert.instanceOf(model.decode({ a: "1", b: "2" }), Error);
  });
});

describe("array", () => {
  const model = t.array(t.number);

  it("validates correctly", () => {
    assert.deepEqual(model.decode([1, 2, 3]), [1, 2, 3]);

    assert.instanceOf(model.decode([1, "2", 3]), Error);
    assert.instanceOf(model.decode(10), Error);
    assert.instanceOf(model.decode({ a: "1" }), Error);
    assert.instanceOf(model.decode({ a: "1", b: "2" }), Error);
  });
});
