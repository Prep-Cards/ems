import { Fragment, InputHTMLAttributes, useMemo, useState } from 'react';
import { useAppContext } from './AppContext';
import Button from './shared/Button';
import Checkboxes from './shared/Checkboxes';
import { Layout } from './shared/Layout';
import Modal, { ModalState, useModalState } from './shared/Modal';
import SVG from './shared/SVG';
import { DEFAULT_CARD_STAT } from './utils/constants';
import getCardProgress from './utils/getCardProgress';
import { useFormState } from './utils/hooks';

interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange' | 'step' | 'value'> {
    onChange: (value: number) => void;
    value: number;
}

function Slider({ onChange, value, ...props }: SliderProps) {
    return (
        <div className="slider">
            <div>{value}</div>
            <input
                {...props}
                value={value}
                type="range"
                step={1}
                onChange={(event) => {
                    onChange(Number(event.currentTarget.value));
                }}
            />
        </div>
    );
}

function AppSettings() {
    const modalState = useModalState();

    return (
        <>
            <Button data-app-settings onClick={modalState.onOpen} className="px-2 space-x-2 flex-center">
                <span className="text-blue-100 opacity-40">Settings</span>
                <SVG.Gear className="fill-blue-100 w-5" />
            </Button>
            {modalState.show && <AppSettingsModal {...modalState} />}
        </>
    );
}

function CardSet({ set }: { set: CardSet }) {
    const [reset, setReset] = useState(false);

    const { proficiency, cardStats, setCardStats } = useAppContext();

    const clearCardStats = async (cardIs: string[]) => {
        const nextCardStats = { ...cardStats };
        cardIs.forEach((cardId) => {
            nextCardStats[cardId] = DEFAULT_CARD_STAT;
        });
        await setCardStats(nextCardStats);
    };

    const progress = useMemo(
        () =>
            Math.round(
                (set.cards || [])
                    .map((card) => getCardProgress(proficiency.goal, cardStats[card.id]))
                    .reduce((s, n) => s + n, 0) / set.cards.length
            ),
        [set.cards, proficiency, cardStats]
    );

    const handleReset = () => {
        clearCardStats(set.cards.map((c) => c.id));
        setReset(false);
    };

    return (
        <Layout as="section" column>
            <Layout>
                <div className="category">{set.category.label}</div>
                <div className="tags">
                    {set.tags.map((tag, index) => (
                        <Fragment key={index}>{tag.label}</Fragment>
                    ))}
                </div>
            </Layout>
            <Layout>
                <div className="count">Cards: {set.cards.length}</div>
                <div className="progress">{progress}% Progress</div>
            </Layout>
            {!!progress && !reset && (
                <Layout>
                    <Button onClick={() => setReset(true)} className="ml-auto text-slate-400">
                        Reset
                    </Button>
                </Layout>
            )}
            {reset && (
                <Layout justify={null} className="description justify-end space-x-4">
                    <span>Are you sure?</span>
                    <Button onClick={() => handleReset()} className="text-slate-400">
                        Yes
                    </Button>
                    <Button onClick={() => setReset(false)} className="text-slate-400">
                        No
                    </Button>
                </Layout>
            )}
        </Layout>
    );
}

function AppSettingsModal({ onClose, show }: ModalState) {
    const { cardSets, setProficiency, proficiency } = useAppContext();

    const form = useFormState(proficiency, async (values) => setProficiency(values));

    const hideCardOption: Option = {
        label: (
            <>
                Hide card when correct <strong>{form.value.goal} times</strong>
            </>
        ),
        value: 'hideProficientCard',
    };

    return (
        <>
            <Modal data-app-modal show={show} onClose={onClose}>
                <Modal.Body>
                    <div className="settings">
                        <h1>Settings</h1>

                        {/* <section>
                            <h2>Progress Transfer</h2>
                            <p>
                                Your proficiency is only saved on this device.
                                You must import or export to transfer your
                                proficiency between devices.
                            </p>
                            <Layout justify="around" className="pt-4">
                                <Button variant="standard" onClick={() => {}}>
                                    Import
                                </Button>

                                <Button variant="standard" onClick={() => {}}>
                                    Export
                                </Button>
                            </Layout>
                        </section> */}

                        <section>
                            <h2>Proficiency</h2>

                            <h4>Proficiency Goal</h4>
                            <p className="description">The correct swipe goal for each card.</p>
                            <Slider
                                min={1}
                                max={20}
                                value={form.value.goal}
                                onChange={(goal) => form.update({ goal })}
                            />
                            <Checkboxes
                                values={form.value.hide ? [hideCardOption] : []}
                                options={[hideCardOption]}
                                onChange={(_, values) => {
                                    form.update({ hide: values?.[0] === hideCardOption.value });
                                }}
                                name="hide-proficient-card"
                            />
                        </section>

                        <section>
                            <h2>Card Sets</h2>
                            {cardSets.map((set, index) => (
                                <CardSet key={index} set={set} />
                            ))}
                        </section>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    {form.saving ? (
                        <>Saving</>
                    ) : (
                        <>
                            {form.dirty && (
                                <Button onClick={form.reset} variant="text-dark">
                                    Reset
                                </Button>
                            )}
                            <Button onClick={form.submit} disabled={!form.dirty} variant="text">
                                Save
                            </Button>
                        </>
                    )}
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default AppSettings;
