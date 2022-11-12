import { ComponentProps, JSXElementConstructor, ReactNode } from 'react';
import clsx from '../utils/clsx';

type ComponentType = JSXElementConstructor<any> | keyof JSX.IntrinsicElements;

type Props<T extends ComponentType> = ComponentProps<T> & {
    children: ReactNode;
    justify?: string;
    items?: string;
    className?: string;
    column?: true;
    as?: T;
};

export type LayoutProps = Props<any>;

export default function Layout<T extends ComponentType>({
    children,
    justify,
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
                justify && 'justify-' + justify,
                items && 'items-' + items,
                className
            )}
        >
            {children}
        </Component>
    );
}
