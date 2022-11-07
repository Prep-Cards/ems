import { CSSProperties, Fragment, useState } from 'react';
import Lines from './shared/LInes';
import clsx from './utils/clsx';
import { MAX_CARDS } from './utils/constants';

interface Props extends Card {
    index: number;
    progress: number;
}

function Card({ id, front, back, index, progress }: Props) {
    const [flipped, setFlipped] = useState(false);

    const style: CSSProperties = {
        zIndex: MAX_CARDS - index,
        transform: `scale(${(6 - Math.min(6, index)) / 6}) translateY(-${9 * index}px)`,
    };

    return (
        <div className={clsx('card', flipped && 'flip')} style={style} id={id} onClick={() => setFlipped((f) => !f)}>
            <div className="content">
                <div className="front">
                    <Lines value={front} />
                </div>
                <div className="back">
                    <Lines value={back} />
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
