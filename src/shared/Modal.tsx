import {
    createContext,
    HTMLAttributes,
    ReactNode,
    useContext,
    useState,
} from 'react';
import Button from './Button';
import { Layout } from './Layout';

export type ModalState = {
    show: boolean;
    onClose: () => void;
    onOpen: () => void;
};

export const useModalState = (showDefault?: boolean): ModalState => {
    const [show, setShow] = useState(!!showDefault);
    return { show, onClose: () => setShow(false), onOpen: () => setShow(true) };
};

export interface ModalProps {
    show: boolean;
    onClose: () => void;
    children: ReactNode;
}

const ModalContext = createContext<ModalProps | null>(null);

function Modal({ show, onClose, children }: ModalProps) {
    return (
        <>
            {show && (
                <div className="modal">
                    <Layout column className="overlay" onClick={onClose}>
                        <Layout
                            column
                            className="dialog"
                            onClick={(e: MouseEvent) => e.stopPropagation()}
                            role="dialog"
                            tabIndex={-1}
                            hidden={!show}
                        >
                            <ModalContext.Provider
                                value={{ show, onClose, children }}
                            >
                                {children}
                            </ModalContext.Provider>
                        </Layout>
                    </Layout>
                </div>
            )}
        </>
    );
}

function ModalBody({ children, ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <Layout {...props} column className="body">
            {children}
        </Layout>
    );
}

function ModalFooter({
    children,
    closeText = 'Cancel',
    ...props
}: HTMLAttributes<HTMLDivElement> & { closeText?: string }) {
    const { onClose } = useContext(ModalContext)!;

    return (
        <Layout justify="between" {...props} className="footer">
            <Button onClick={onClose} variant="text">
                {closeText}
            </Button>
            {children}
        </Layout>
    );
}

export default Object.assign(Modal, { Body: ModalBody, Footer: ModalFooter });
