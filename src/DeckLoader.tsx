import { useMemo } from 'react';
import { useAppContext } from './AppContext';
import Deck from './Deck';

function DeckLoader() {
    const { getCards, deck } = useAppContext();

    const cards = useMemo(() => getCards(deck), [deck, getCards]);

    return (
        <>
            {!!cards?.length ? (
                <Deck cards={cards} />
            ) : (
                <div className="flex-col flex-grow flex-center overflow-hidden text-gray-400">No deck loaded</div>
            )}
        </>
    );
}

export default DeckLoader;
