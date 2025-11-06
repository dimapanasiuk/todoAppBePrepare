let nextId = 1;

export const generateId = (): string => {
  return (nextId++).toString();
};

export const resetIdCounter = (): void => {
  nextId = 1;
};
