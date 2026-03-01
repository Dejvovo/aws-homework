export const getRandomItem = (arr: number[]) => {
  if (!arr.length) return undefined;
  return arr[Math.floor(Math.random() * arr.length)];
};

export const diff = (a: number[], b: number[]) =>
  a.filter((x) => !b.includes(x));

export const now = () => new Date().toISOString();

export const generateNumberToGuess = () => Math.ceil(Math.random() * 100);

export const generateNewUniqueId = (
  existingIds: number[],
  allPossibleIds: number[]
) => {
  const possibleUniqueIds = diff(allPossibleIds, existingIds);
  return getRandomItem(possibleUniqueIds);
};
