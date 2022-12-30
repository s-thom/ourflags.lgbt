// Copyright (c) 2022 Stuart Thomson.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { delay, range, template } from "./utils";

describe("range", () => {
  it.each`
    length | start        | step         | expected
    ${4}   | ${undefined} | ${undefined} | ${[0, 1, 2, 3]}
    ${4}   | ${5}         | ${2}         | ${[5, 7, 9, 11]}
    ${4}   | ${0}         | ${-1}        | ${[0, -1, -2, -3]}
  `(
    "generates the correct array with length $length, start $start, and step $step",
    ({ length, start, step, expected }) => {
      expect(range(length, start, step)).toEqual(expected);
    }
  );
});

describe("template", () => {
  it("makes no changes when the input string has no replacements", () => {
    expect(template("Hello world!", {})).toBe("Hello world!");
  });

  it("makes no changes when the value is not passed", () => {
    expect(template("Hello {{name}}!", {})).toBe("Hello {{name}}!");
  });

  it("makes a single replacement", () => {
    expect(template("Hello {{name}}!", { name: "unit tests" })).toBe(
      "Hello unit tests!"
    );
  });

  it("makes multiple replacements", () => {
    expect(
      template("{{greeting}} {{name}}!", {
        greeting: "Hey,",
        name: "unit tests",
      })
    ).toBe("Hey, unit tests!");
  });
});

describe("delay", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });
  afterAll(() => {
    jest.useRealTimers();
  });

  it("resolves after the given time", async () => {
    const cb = jest.fn();

    delay(500).then(cb);

    jest.advanceTimersByTime(499);
    await Promise.resolve(); // Forcefully flush microtasks queue
    expect(cb).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);
    await Promise.resolve();
    expect(cb).toHaveBeenCalled();
  });
});
