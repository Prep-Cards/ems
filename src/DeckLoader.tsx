import { useAppContext } from './AppContext';
import Deck from './Deck';
import { shuffle } from './utils/shuffle';

function DeckLoader() {
    const { cards } = useAppContext();

    return (
        <>
            {!!cards?.length ? (
                <Deck cards={shuffle(cards)} />
            ) : (
                <div className="flex-col flex-grow flex-center overflow-hidden text-gray-400">No cards loaded.</div>
            )}
        </>
    );
}

export default DeckLoader;
