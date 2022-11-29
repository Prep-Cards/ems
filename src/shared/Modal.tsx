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
    className?: string;
    size?: 'full' | null;
}

const ModalContext = createContext<ModalProps | null>(null);

function Modal({ show, onClose, children, className, size = 'full' }: ModalProps) {
    return (
        <>
            {show && (
                <div className={clsx('modal', className)}>
                    <Layout column className="overlay" onClick={onClose}>
                        <Layout
                            column
                            className={clsx('dialog', size)}
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

function ModalFooter({ children, className, justify = 'between', ...props }: LayoutProps & { closeText?: string }) {
    const { onClose } = useContext(ModalContext)!;

    return (
        <Layout justify={justify} {...props} className={clsx('footer', className)}>
            <Button onClick={onClose} variant="text">
                Close
            </Button>
            {children}
        </Layout>
    );
}

export default Object.assign(Modal, { Body: ModalBody, Footer: ModalFooter });
