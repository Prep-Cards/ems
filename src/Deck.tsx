import Button from './shared/Button';
import Hammer from 'hammerjs';
import SVG from './shared/SVG';
import Layout from './shared/Layout';
import { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import getCardProgress from './utils/getCardProgress';
import { useAppContext } from './AppContext';
import runAfterFramePaint from './utils/runAfterFramePaint';
import Lines from './shared/LInes';
import clsx from './utils/clsx';
import { useMountEffect } from './utils/hooks';

const resizeText = (el: HTMLElement) => {
    if (el.firstElementChild!.clientHeight > el.clientHeight) {
        const fontSize = Number(el.style.fontSize.replace('rem', ''));
        el.style.fontSize = fontSize - 0.1 + 'rem';
        runAfterFramePaint(() => resizeText(el));
    }
};

function Card({
    id,
    front,
    back,
    progress,
    triggerMove,
}: Card & { progress: number; triggerMove: (move: Move) => void }) {
    const [flipped, setFlipped] = useState(false);

    const contentRef = useRef<HTMLDivElement>(null);

    useMountEffect(() => {
        if (!contentRef.current) return;

        const contentEl = contentRef.current! as HTMLElement;
        const cardEl = contentEl.parentElement!;

        ['front', 'back'].forEach((item) => {
            resizeText(contentEl.querySelector('.' + item)!);
        });

        setTimeout(() => {
            cardEl.style.transform = `translate(0, 0)`;
        }, 1);

        const hammer = new Hammer(cardEl);

        hammer.on('pan', (event) => {
            if (event.deltaX === 0 || (event.center.x === 0 && event.center.y === 0)) {
                return;
            }

            let direction: Move | null = null;
            if (event.deltaX > 0) direction = 'right';
            if (event.deltaX < 0) direction = 'left';

            document.body.classList.add('moving-' + direction);

            cardEl.dataset.moving = direction || '';

            const xMulti = event.deltaX * 0.03;
            const yMulti = event.deltaY / 80;
            const rotate = xMulti * yMulti;

            event.target.style.transform =
                'translate(' + event.deltaX + 'px, ' + event.deltaY + 'px) rotate(' + rotate + 'deg)';
        });

        hammer.on('panend', (event) => {
            const move = cardEl.dataset.moving as Move;
            delete cardEl.dataset.moving;

            const movedEnough = !(Math.abs(event.deltaX) < 80 || Math.abs(event.velocityX) < 0.5);

            if (!movedEnough) {
                document.body.classList.remove('moving-right', 'moving-left');
                event.target.style.transform = '';
                return;
            }

            event.preventDefault();

            triggerMove(move);
        });

        return () => {
            hammer.destroy();
        };
    });

    return (
        <div
            className={clsx('card', flipped && 'flip')}
            id={id}
            onClick={() => setFlipped((f) => !f)}
            style={{
                transform: 'translate(-5vh, 100vh)',
            }}
        >
            <div className="content" ref={contentRef}>
                <div className="front" style={{ fontSize: '1.3rem' }}>
                    <div>
                        <Lines value={front} />
                    </div>
                </div>
                <div className="back" style={{ fontSize: '1.3rem' }}>
                    <div>
                        <Lines value={back} />
                    </div>
                </div>
            </div>
            <div className="absolute right-1 left-1 bottom-1 px-4 rounded-lg overflow-hidden">
                <div className="w-full bg-white bg-opacity-25 rounded-lg">
                    <div className="h-2 bg-green-400 rounded-lg" style={{ width: progress + '%' }}></div>
                </div>
            </div>
        </div>
    );
}

function Deck({ cards }: { cards: Card[] }) {
    const { setCardStats, getCardStats, getProficiency } = useAppContext();

    const hiddenCards = useRef([] as number[]);

    const getNextCard = useCallback(
        (
            index: number
        ): {
            index: number;
            progress: number;
        } => {
            if (hiddenCards.current.length === cards.length) {
                return {
                    index: -1,
                    progress: -1,
                };
            }

            const nextIndex = index + 1;

            const nextCard = cards[nextIndex];

            if (!nextCard) {
                // loop back around
                return getNextCard(0);
            }

            const progress = getCardProgress(getProficiency().goal, getCardStats()[nextCard.id]);

            if (progress >= 100) {
                hiddenCards.current.push(nextIndex);
                return getNextCard(nextIndex);
            }

            return {
                index: nextIndex,
                progress,
            };
        },
        [cards, getCardStats, getProficiency]
    );

    useEffect(() => {
        hiddenCards.current = [];
        setCurrentCard(getNextCard(0));
    }, [cards, getNextCard]);

    const [currentCard, setCurrentCard] = useState<{
        index: number;
        progress: number;
    }>(getNextCard(0));

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const setCardStat = async (cardId: string, correct: boolean) =>
        setCardStats((prevStats: CardStats) => ({
            ...prevStats,
            [cardId]: Math.max(0, (prevStats[cardId] || 0) + (correct ? 1 : -1)),
        }));

    const stackRef = useRef<HTMLDivElement>(null);

    const [cardSwitching, setCardSwitching] = useState(false);

    const triggerMove = useCallback(
        (move: Move) => {
            const cardEl = stackRef.current?.firstChild as HTMLElement;

            if (cardSwitching) return;

            setCardSwitching(true);

            const moveOutWidth = document.body.clientWidth;

            const transitionListener = () => {
                cardEl.classList.remove('flip');
                cardEl.style.transform = `translate(0, 0)`;

                document.body.classList.remove('moving-right', 'moving-left');

                setCardStat(cardEl.id, move === 'right');
                setCurrentCard(getNextCard(currentCard.index));
                setCardSwitching(false);

                cardEl.removeEventListener('transitionend', transitionListener);
            };

            cardEl.addEventListener('transitionend', transitionListener);

            if (move === 'right') {
                cardEl.style.transform = 'translate(' + moveOutWidth * 2 + 'px, -100px) rotate(-30deg)';
            } else {
                cardEl.style.transform = 'translate(-' + moveOutWidth * 2 + 'px, -100px) rotate(30deg)';
            }
        },
        [cardSwitching, currentCard, getNextCard, setCardStat]
    );

    const CardDisplay = useMemo(() => {
        const card = cards[currentCard.index];

        return (
            <>
                {card ? (
                    <Card key={card.id} {...card} progress={currentCard.progress} triggerMove={triggerMove} />
                ) : (
                    <>
                        {currentCard.index === -1 ? (
                            <div className="card flex-center flex-col space-y-4 text-slate-200">
                                <span>All Cards are marked proficient.</span>
                                <span className="text-xl">Nice job!</span>
                            </div>
                        ) : (
                            <>No cards found.</>
                        )}
                    </>
                )}
            </>
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cards, currentCard.index, currentCard.progress, triggerMove]);

    return (
        <main className="deck">
            <div ref={stackRef} className="stack">
                {CardDisplay}
            </div>
            <Layout
                as="nav"
                justify="around"
                className={clsx('mt-1 h-16 p-2', currentCard.index === -1 && 'opacity-0')}
            >
                <Button
                    onClick={() => triggerMove('left')}
                    className="rounded-full p-1 overflow-hidden active:bg-white active:bg-opacity-25"
                    draggable={false}
                    disabled={cardSwitching}
                >
                    <SVG.CircleXmark className="h-full w-auto fill-red-500" />
                </Button>
                <Button
                    onClick={() => triggerMove('right')}
                    className="rounded-full p-1 overflow-hidden active:bg-white active:bg-opacity-25"
                    draggable={false}
                    disabled={cardSwitching}
                >
                    <SVG.CircleCheck className="h-full w-auto fill-green-500 pointer-events-none" />
                </Button>
            </Layout>
        </main>
    );
}

export default Deck;
