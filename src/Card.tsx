import { CSSProperties, useState } from 'react';
import Lines from './shared/LInes';
import clsx from './utils/clsx';
import { MAX_CARDS } from './utils/constants';
import runAfterFramePaint from './utils/runAfterFramePaint';

interface Props extends Card {
    index: number;
    progress: number;
}

const resizeText = (el: HTMLElement) => {
    if (el.firstElementChild!.clientHeight > el.clientHeight) {
        const fontSize = Number(el.style.fontSize.replace('rem', ''));
        el.style.fontSize = fontSize - 0.1 + 'rem';
        console.log({ fontSize, x: el.clientHeight, y: el.firstElementChild!.clientHeight });
        runAfterFramePaint(() => resizeText(el));
    }
};

function Card({ id, front, back, index, progress }: Props) {
    const [flipped, setFlipped] = useState(false);

    const style: CSSProperties = {
        zIndex: MAX_CARDS - index,
        transform: `scale(${(6 - Math.min(6, index)) / 6}) translateY(-${9 * index}px)`,
    };

    const setRef = (node: HTMLDivElement) => {
        if (!node) return;

        ['front', 'back'].forEach((item) => {
            resizeText(node.querySelector('.' + item)!);
        });
    };

    return (
        <div className={clsx('card', flipped && 'flip')} style={style} id={id} onClick={() => setFlipped((f) => !f)}>
            <div className="content" ref={setRef}>
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

export default Card;
