export {};

declare global {
    type Move = 'right' | 'left';

    type Option = { label: ReactNode; value: string };

    type Category = { label: string; value: string };

    type Tag = { label: string; value: string };

    type Card = {
        id: string;
        front: string;
        back: string;
    };

    type CardSet = {
        cards: Card[];
        category: Category;
        tags: Tag[];
    };

    type Deck = {
        categories: Category[];
        tags: Tag[];
    };

    type CardStats = {
        [cardId: string]: number;
    };

    type SetCardStat = (cardId: string, move: Move) => Promise<CardStats>;

    type Proficiency = {
        hide: boolean;
        goal: number;
    };

    type Settings = {
        proficiency: Proficiency;
        cardStats: CardStats;
        deck: Deck;
    };

    type SettingsMeta = { updated?: Date } & (
        | { key: 'proficiency'; value: Proficiency }
        | { key: 'cardStats'; value: CardStats }
        | { key: 'deck'; value: Deck }
    );

    type Data = {
        categories: Option[];
        tags: Option[];
        cardSets: CardSet[];
    };

    type Context = Data &
        Settings & {
            // settings
            setProficiency: Dispatch<SetStateAction<Proficiency>>;
            setCardStats: Dispatch<SetStateAction<CardStats>>;
            setDeck: Dispatch<SetStateAction<Deck>>;
            // data
            getCards: (next?: Deck | undefined) => Card[];
        };

    /**
     * DeepNonNullable
     * @desc NonNullable that works for deeply nested structure
     * @example
     *   // Expect: {
     *   //   first: {
     *   //     second: {
     *   //       name: string;
     *   //     };
     *   //   };
     *   // }
     *   type NestedProps = {
     *     first?: null | {
     *       second?: null | {
     *         name?: string | null |
     *         undefined;
     *       };
     *     };
     *   };
     *   type RequiredNestedProps = DeepNonNullable<NestedProps>;
     */
    export type DeepNonNullable<T> = T extends (...args: any[]) => any
        ? T
        : T extends any[]
        ? _DeepNonNullableArray<T[number]>
        : T extends object
        ? _DeepNonNullableObject<T>
        : T;
}
