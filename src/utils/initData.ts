const getJson: <T>(name: string) => Promise<T> = async (name: string) => {
    return window.fetch('data/' + name).then((response) => response.json());
};

function removeDuplicates<TItem>(arr: TItem[], getValue: (item: TItem) => any = (v) => v) {
    return arr.filter((item, index) => index === arr.findIndex((item2) => getValue(item) === getValue(item2)));
}

export default async function initData() {
    const initialData: Data = { categories: [], tags: [], cardSets: [] };

    const indexData = await getJson<{ files: string[] }>('index.json');

    initialData.cardSets = await Promise.all(indexData.files.map((file) => getJson<CardSet>(file)));

    initialData.cardSets.forEach((cardSet) => {
        initialData.categories.push(cardSet.category);
        initialData.tags.push(...cardSet.tags);
    });

    initialData.categories = removeDuplicates(initialData.categories, (v) => v.value);
    initialData.tags = removeDuplicates(initialData.tags, (v) => v.value);

    return initialData;
}
