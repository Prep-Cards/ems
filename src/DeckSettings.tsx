import { useMemo } from 'react';
import { useAppContext } from './AppContext';
import Button from './shared/Button';
import Checkboxes from './shared/Checkboxes';
import Modal, { ModalState, useModalState } from './shared/Modal';
import SVG from './shared/SVG';
import { useFormState } from './utils/hooks';
import plural from './utils/plural';

function DeckSettings() {
    const modalState = useModalState();

    const { deck } = useAppContext();

    return (
        <>
            <Button data-deck-settings onClick={modalState.onOpen} className="px-2 space-x-2 flex-center">
                <SVG.Cards className="fill-blue-100 w-7" />
                <span className="text-blue-100 opacity-40">{deck ? 'Update Deck' : 'Load Deck'}</span>
            </Button>
            {modalState.show && <DeckSettingsModal {...modalState} />}
        </>
    );
}

function DeckSettingsModal({ onClose, show }: ModalState) {
    const { deck, setDeck, getCards, categories, tags } = useAppContext();

    const form = useFormState(deck, async (next) => {
        await setDeck(next);
        onClose();
    });

    // const form: any = { value: { categories: [], tags: [] } };

    const cards = useMemo(() => getCards(form.value), [form.value, getCards]);

    // const cards = [];

    return (
        <>
            <Modal data-app-modal show={show} onClose={onClose}>
                <Modal.Body>
                    <div className="settings">
                        <h1>{deck ? 'Update' : 'Load'} Deck</h1>
                        <p className="description">Select cards to add to the current deck from categories and tags.</p>
                        <section>
                            <h2>Categories</h2>
                            <Checkboxes
                                name="categories"
                                options={categories}
                                values={form.value.categories}
                                onChange={(categories) => form.update({ categories })}
                            />
                        </section>

                        <section>
                            <h2>Tags</h2>
                            <Checkboxes
                                name="tags"
                                options={tags}
                                values={form.value.tags}
                                onChange={(tags) => form.update({ tags })}
                            />
                        </section>

                        <section>
                            <h2>Cards</h2>
                            <p>
                                <strong className="text-primary">{cards.length}</strong> {plural(cards.length, 'cards')}{' '}
                                will be loaded.
                            </p>
                        </section>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    {form.saving ? (
                        <>Saving</>
                    ) : (
                        <>
                            {' '}
                            {form.dirty && (
                                <Button onClick={form.reset} variant="text">
                                    Reset
                                </Button>
                            )}
                            <Button onClick={form.submit} disabled={!cards.length || !form.dirty} variant="text-dark">
                                {deck ? 'Update' : 'Load'}
                            </Button>
                        </>
                    )}
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default DeckSettings;
