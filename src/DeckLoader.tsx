import { useAppContext } from './AppContext';
import Deck from './Deck';

function shuffle<T>(array: T[]) {
    let currentIndex = array.length,
        randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

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
