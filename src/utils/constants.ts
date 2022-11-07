export const MAX_CARDS = 999;

export const DEFAULT_SETTINGS: Settings = {
    proficiency: { hide: true, goal: 10 },
    deck: { categories: [], tags: [] } as Deck,
    cardStats: {} as CardStats,
};

export const DEFAULT_CARD_STAT: CardStat = { left: 0, right: 0 };
