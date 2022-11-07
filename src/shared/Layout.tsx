import { ComponentProps, JSXElementConstructor, ReactNode } from 'react';
import clsx from '../utils/clsx';

type ComponentType = JSXElementConstructor<any> | keyof JSX.IntrinsicElements;

type Props<T extends ComponentType> = ComponentProps<T> & {
    children: ReactNode;
    justify?: 'between' | 'around';
    items?: 'center';
    className?: string;
    column?: true;
    as?: T;
};

export function Layout<T extends ComponentType>({
    children,
    justify = 'between',
    items,
    as: Component = 'div',
    column,
    className,
    ...props
}: Props<T>) {
    return (
        <Component
            {...props}
            className={clsx(
                'flex',
                column ? 'flex-col' : 'flex-row',
                justify === 'around' && 'justify-around',
                justify === 'between' && 'justify-between',
                items === 'center' && 'items-center',
                className
            )}
        >
            {children}
        </Component>
    );
}
