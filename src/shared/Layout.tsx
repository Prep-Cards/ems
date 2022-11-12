import { ComponentProps, JSXElementConstructor, ReactNode } from 'react';
import clsx from '../utils/clsx';

type ComponentType = JSXElementConstructor<any> | keyof JSX.IntrinsicElements;

type Props<T extends ComponentType> = ComponentProps<T> & {
    children: ReactNode;
    justify?: Justify;
    items?: string;
    className?: string;
    column?: true;
    as?: T;
};

export type LayoutProps = Props<any>;

type Justify = 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';

export default function Layout<T extends ComponentType>({
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
                justify === 'start' && 'justify-start',
                justify === 'end' && 'justify-end',
                justify === 'center' && 'justify-center',
                justify === 'between' && 'justify-between',
                justify === 'around' && 'justify-around',
                justify === 'evenly' && 'justify-evenly',
                items && 'items-' + items,
                className
            )}
        >
            {children}
        </Component>
    );
}
