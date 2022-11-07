import Button from './shared/Button';
import Card from './Card';
import Hammer from 'hammerjs';
import SVG from './shared/SVG';
import { Layout } from './shared/Layout';
import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import getCardProgress from './utils/getCardProgress';
import { shuffle } from './utils/shuffle';
import { useAppContext } from './AppContext';
import { DEFAULT_CARD_STAT } from './utils/constants';

function Deck({ cards }: { cards: Card[] }) {
    const { cardStats, setCardStats, proficiency } = useAppContext();

    const [cardOrder, setCardOrder] = useState(shuffle(cards.map(({ id }) => id) || []));

    const setCardStat = async (cardId: string, move: Move) => {
        const prevStat: CardStat = cardStats[cardId] || DEFAULT_CARD_STAT;
        return setCardStats({
            ...cardStats,
            [cardId]: { ...prevStat, [move]: prevStat[move] + 1 },
        });
    };

    useEffect(() => {
        setCardOrder(cards.map(({ id }) => id));
    }, [cards]);

    const stackRef = useRef<HTMLDivElement>(null);

    const appEl = document.querySelector('.App') as HTMLElement;

    const [animating, setAnimating] = useState(false);

    const triggerMove = (move: Move) => {
        appEl.classList.add('moving-' + move);

        const stack = stackRef.current!;

        const moveOutWidth = document.body.clientWidth;

        const cardEl = stack.firstChild as HTMLElement;

        setAnimating(true);

        const transitionListener = () => {
            handleMove(move, cardEl.id);

            setAnimating(false);

            cardEl.classList.remove('flip');

            appEl.classList.remove('moving-right', 'moving-left');

            cardEl.removeEventListener('transitionend', transitionListener);
        };

        cardEl.addEventListener('transitionend', transitionListener);

        if (move === 'right') {
            cardEl.style.transform = 'translate(' + moveOutWidth * 2 + 'px, -100px) rotate(-30deg)';
        } else {
            cardEl.style.transform = 'translate(-' + moveOutWidth * 2 + 'px, -100px) rotate(30deg)';
        }
    };

    useLayoutEffect(() => {
        const stack = stackRef.current;
        const cardEl = stack?.firstChild as HTMLElement;

        if (!stack || !cardEl || cardEl.id !== cardOrder[0]) return;

        const hammer = new Hammer(cardEl);

        hammer.on('pan', (event) => {
            if (animating) return;

            cardEl.classList.add('moving');

            if (event.deltaX === 0) return;
            if (event.center.x === 0 && event.center.y === 0) return;

            let direction: Move | null = null;

            if (event.deltaX > 0) direction = 'right';
            if (event.deltaX < 0) direction = 'left';

            appEl.classList.remove('moving-right', 'moving-left');

            if (direction) {
                appEl.classList.add('moving-' + direction);
            }

            stack.dataset.moving = direction || '';

            const xMulti = event.deltaX * 0.03;
            const yMulti = event.deltaY / 80;
            const rotate = xMulti * yMulti;

            event.target.style.transform =
                'translate(' + event.deltaX + 'px, ' + event.deltaY + 'px) rotate(' + rotate + 'deg)';
        });

        hammer.on('panend', (event) => {
            cardEl.classList.remove('moving');

            const move = stack.dataset.moving as Move;
            stack.dataset.moving = '';

            const keep = Math.abs(event.deltaX) < 80 || Math.abs(event.velocityX) < 0.5;

            if (keep) {
                appEl.classList.remove('moving-right', 'moving-left');
                event.target.style.transform = '';
                return;
            }

            event.preventDefault();

            triggerMove(move);
        });

        return () => hammer.destroy();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cardOrder]);

    const handleMove = (move: Move, cardId: string) => {
        setCardStat(cardId, move);

        setCardOrder((prevOrder) => {
            const newOrder = [...prevOrder];
            newOrder.push(newOrder.splice(0, 1)[0]);
            return newOrder;
        });
    };

    const cardsToDisplay = cardOrder.map((cardId) => cards.find(({ id }) => id === cardId)).filter(Boolean) as Card[];

    return (
        <main className="deck">
            <div ref={stackRef} className="stack">
                {cardsToDisplay.map((card, index) => (
                    <Card
                        key={card.id}
                        index={index}
                        {...card}
                        progress={getCardProgress(proficiency.goal, cardStats[card.id])}
                    />
                ))}
            </div>
            <Layout as="nav" justify="around" className="mt-1 h-16 p-2">
                <Button
                    onClick={() => triggerMove('left')}
                    className="rounded-full p-1 overflow-hidden active:bg-white active:bg-opacity-25"
                    draggable={false}
                    disabled={animating}
                >
                    <SVG.CircleXmark className="h-full w-auto fill-red-500" />
                </Button>
                <Button
                    onClick={() => triggerMove('right')}
                    className="rounded-full p-1 overflow-hidden active:bg-white active:bg-opacity-25"
                    draggable={false}
                    disabled={animating}
                >
                    <SVG.CircleCheck className="h-full w-auto fill-green-500 pointer-events-none" />
                </Button>
            </Layout>
        </main>
    );
}

export default Deck;