import { useAppContext } from './AppContext';
import clsx from './utils/clsx';

function plural(count: number, plural: string, singular?: string) {
    return count === 1 ? singular || plural.slice(0, -1) : plural;
}

function DeckInfo({ className, deck }: { className?: string; deck?: Deck }) {
    const { getDeck, getCards } = useAppContext();

    deck = deck || getDeck();
    const cards = getCards(deck);

    return (
        <>
            {!!cards?.length && (
                <div className={clsx('deck-info', className)}>
                    <strong>{cards.length + ' ' + plural(cards.length, 'Cards')}</strong>
                    {' - '}
                    <span>
                        {[...deck.categories.map((c) => c.label), ...deck.tags.map((c) => c.label)].map((d, index) => (
                            <span key={index}>{d}</span>
                        ))}
                    </span>
                </div>
            )}
        </>
    );
}

export default DeckInfo;
