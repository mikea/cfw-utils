import { assert } from "chai";
import * as d from "./decoder";

describe("boolean", () => {
  const model = d.boolean;

  it("validates correctly", () => {
    assert.equal(model.decode(true), true);
    assert.equal(model.decode(false), false);
    assert.instanceOf(model.decode("test"), Error);
  });
});

describe("string", () => {
  const model = d.string;

  it("validates correctly", () => {
    assert.equal(model.decode("test"), "test");
    assert.instanceOf(model.decode(true), Error);
  });
});

describe("literal", () => {
  const model = d.literal("lit");

  it("validates correctly", () => {
    assert.equal(model.decode("lit"), "lit");
    assert.instanceOf(model.decode("test"), Error);
    assert.instanceOf(model.decode(true), Error);
  });
});

describe("union", () => {
  const model = d.union([d.string, d.boolean]);

  it("validates correctly", () => {
    assert.equal(model.decode("test"), "test");
    assert.equal(model.decode(true), true);
    assert.instanceOf(model.decode(10), Error);
  });
});

describe("record", () => {
  const model = d.record(d.string, d.boolean);

  it("validates correctly", () => {
    assert.deepEqual(model.decode({ test: true }), { test: true });
    assert.instanceOf(model.decode(10), Error);
    assert.instanceOf(model.decode({ test: 19 }), Error);
  });
});

describe("struct", () => {
  const model = d.struct({ a: d.string, b: d.number });

  it("validates correctly", () => {
    assert.deepEqual(model.decode({ a: "1", b: 2 }), { a: "1", b: 2 });

    assert.instanceOf(model.decode(10), Error);
    assert.instanceOf(model.decode({ a: "1" }), Error);
    assert.instanceOf(model.decode({ a: "1", b: "2" }), Error);
  });
});

describe("array", () => {
  const model = d.array(d.number);

  it("validates correctly", () => {
    assert.deepEqual(model.decode([1, 2, 3]), [1, 2, 3]);

    assert.instanceOf(model.decode([1, "2", 3]), Error);
    assert.instanceOf(model.decode(10), Error);
    assert.instanceOf(model.decode({ a: "1" }), Error);
    assert.instanceOf(model.decode({ a: "1", b: "2" }), Error);
  });
});
