import {
  getRandomItem,
  generateNumberToGuess,
  generateNewUniqueId,
  diff,
} from "../../lib/utils/utils";

describe("utils", () => {
  test("diff returns elements from A not in B", () => {
    expect(diff([1, 2, 3], [2])).toEqual([1, 3]);
  });

  test("getRandomItem returns undefined for empty array", () => {
    expect(getRandomItem([])).toBeUndefined();
  });

  test("generateNumberToGuess returns number between 1 and 100", () => {
    for (let i = 0; i < 100; i++) {
      const n = generateNumberToGuess();
      expect(n).toBeGreaterThanOrEqual(1);
      expect(n).toBeLessThanOrEqual(100);
    }
  });

  test("generateNewUniqueId returns only unused ids", () => {
    const existing = [1, 2];
    const all = [1, 2, 3, 4];

    const id = generateNewUniqueId(existing, all);

    expect([3, 4]).toContain(id);
  });
});
