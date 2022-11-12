import { useAppContext } from './AppContext';
import Modal from './shared/Modal';
import SVG from './shared/SVG';
import version from './utils/version';

export default function IntroLoader() {
    const { getVersionIntro, setVersionIntro } = useAppContext();

    return (
        <Modal
            show={getVersionIntro() !== version}
            onClose={() => {
                setVersionIntro(version);
            }}
        >
            <Modal.Body column justify="between" className="text-center text-slate-300">
                <h1 className="mt-4 mb-0 text-white">Prep Cards</h1>

                <p>
                    <strong>Tap</strong> to flip the card.
                </p>
                <p>
                    <strong>Swipe right</strong> if you got it correct.
                </p>
                <p>
                    <strong>Swipe left</strong> if you got it wrong.
                </p>
                <p>Get it right enough times the card will be hidden.</p>

                <p>
                    Change the cards and other settings by clicking the cards{' '}
                    <SVG.Cards className="fill-blue-200 w-7 mx-1 inline-block" /> on the top right.
                </p>

                <p>
                    Does anybody ever read these introduction modal things? Any questions{' '}
                    <a href="mailto:brian@prep.cards" target="_blank" className="underline" rel="noreferrer">
                        send me a note
                    </a>
                    .
                </p>

                <p className="text-slate-500">Version {version}</p>
            </Modal.Body>
            <Modal.Footer justify="around" closeText="Close"></Modal.Footer>
        </Modal>
    );
}
