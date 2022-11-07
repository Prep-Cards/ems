export default function clsx(...classes: (string | any)[]) {
    return classes.filter(Boolean).join(' ');
}
