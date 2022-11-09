import { createContext, ReactNode, useContext, useState } from 'react';
import clsx from '../utils/clsx';
import Button from './Button';
import Layout, { LayoutProps } from './Layout';

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
                            <ModalContext.Provider value={{ show, onClose, children }}>
                                {children}
                            </ModalContext.Provider>
                        </Layout>
                    </Layout>
                </div>
            )}
        </>
    );
}

function ModalBody({ children, className, ...props }: LayoutProps) {
    return (
        <Layout {...props} column className={clsx('body', className)}>
            {children}
        </Layout>
    );
}

function ModalFooter({
    children,
    className,
    closeText = 'Cancel',
    justify = 'between',
    ...props
}: LayoutProps & { closeText?: string }) {
    const { onClose } = useContext(ModalContext)!;

    return (
        <Layout justify={justify} {...props} className={clsx('footer', className)}>
            <Button onClick={onClose} variant="text">
                {closeText}
            </Button>
            {children}
        </Layout>
    );
}

export default Object.assign(Modal, { Body: ModalBody, Footer: ModalFooter });
