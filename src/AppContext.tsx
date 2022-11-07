/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, ReactNode, useContext, useState } from 'react';
import { DEFAULT_SETTINGS, MAX_CARDS } from './utils/constants';
import SVG from './shared/SVG';
import { useMountAsync } from './utils/hooks';
import { db } from './utils/db';
import initData from './utils/initData';

export interface Props {
    children?: ReactNode;
}

const AppContext = createContext<Context | null>(null);

function useSettingState<T>(
    key: keyof Settings,
    defaultValue: T | undefined
): [state: T, setState: (next: T) => Promise<T>] {
    const [state, setState] = useState<T>(defaultValue as T);

    return [
        state,

        async (newValue: T) => {
            const newMeta = { key, value: newValue, updated: new Date() } as SettingsMeta;
            await db.settings.put(newMeta, key);
            setState(newValue);
            return newMeta.value as T;
        },
    ];
}

export function useAppContext() {
    return useContext(AppContext) as Context;
}

export function AppLoader({ children, settings, data }: Props & { settings: Settings; data: Data }) {
    const [cardStats, setCardStats] = useSettingState<CardStats>('cardStats', settings.cardStats);
    const [deck, setDeck] = useSettingState<Deck>('deck', settings.deck);
    const [proficiency, setProficiency] = useSettingState<Proficiency>('proficiency', settings.proficiency);

    return (
        <AppContext.Provider
            value={
                {
                    cardStats,
                    setCardStats,

                    deck,
                    setDeck,

                    proficiency,
                    setProficiency,

                    ...data,

                    getCards: (deck?: Deck): Card[] => {
                        if (!deck?.categories && !deck?.tags) return [];
                        const { categories, tags } = deck;

                        return data.cardSets
                            .filter(
                                (set) =>
                                    (!categories.length ||
                                        categories.some((cat) => cat.value === set.category.value)) &&
                                    (!tags.length ||
                                        tags.some((tag) => set.tags.some((sTag) => sTag.value === tag.value)))
                            )
                            .flatMap((set) => set.cards)
                            .slice(0, MAX_CARDS);
                    },
                } as Context
            }
        >
            {children}
        </AppContext.Provider>
    );
}

export function AppContextProvider({ children }: Props) {
    const [data, setData] = useState<Data>();

    const [settings, setSettings] = useState<Settings>();

    useMountAsync(async () => {
        const initialData = await initData();

        const dbSettings: Settings = {
            ...DEFAULT_SETTINGS,
            deck: { categories: [initialData.categories[0]], tags: [initialData.tags[0]] },
        };

        const settingsMeta = await Promise.all(Object.keys(dbSettings).map((key) => db.settings.get(key)));

        settingsMeta.forEach((settingMeta) => {
            if (!settingMeta?.value) return;

            dbSettings[settingMeta.key] = settingMeta.value as any;
        });

        setTimeout(() => {
            setSettings(dbSettings as Settings);
        }, 250);

        setData(initialData);
    });

    if (!settings || !data) {
        return (
            <div className="flex-col flex-grow flex-center overflow-hidden text-slate-300">
                <SVG.Cards className="fill-slate-100 w-28 animate-pulse" />
                <span className="text-sm animate-pulse">Loading</span>
            </div>
        );
    }

    return (
        <AppLoader data={data} settings={settings}>
            {children}
        </AppLoader>
    );
}
