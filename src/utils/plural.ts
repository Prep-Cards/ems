export default function plural(
    count: number,
    plural: string,
    singular?: string
) {
    return count === 1 ? singular || plural.slice(0, -1) : plural;
}
