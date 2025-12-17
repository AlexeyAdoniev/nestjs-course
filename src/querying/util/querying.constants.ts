export const DEFAULT_PAGE_SIZE = {
  USER: 10,
  ORDER: 5,
  PRODUCT: 20,
  CATEGORY: 10,
} as const satisfies Record<string, number>;

export const MAX_PAGE_SIZE = 100;
export const MAX_PAGE_NUMBER = 25;
