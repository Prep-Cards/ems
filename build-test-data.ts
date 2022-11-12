import { writeFileSync, readdirSync, unlinkSync } from 'fs';
import path from 'path';

function slugify(text: string) {
    return text
        .toString() // Cast to string (optional)
        .normalize('NFKD') // The normalize() using NFKD method returns the Unicode Normalization Form of a given string.
        .toLowerCase() // Convert the string to lowercase letters
        .trim() // Remove whitespace from both sides of a string (optional)
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/_/g, '-') // Replace _ with -
        .replace(/\-\-+/g, '-') // Replace multiple - with single -
        .replace(/\-$/g, ''); // Remove trailing -
}

const labelsToOptions = (labels: string[]): Option[] => labels.map((label) => ({ value: slugify(label), label }));

type Option = { label: string; value: string };

type Category = Option;

type Tag = Option;

type CardJson = {
    id: string;
    front: string;
    back: string;
};

type CardSetJson = {
    name: string;
    cards: CardJson[];
    category: Category;
    tags: Tag[];
};

function generateFakeData() {
    const cardCount = 3;

    const cardSets: CardSetJson[] = [];
    const tags: Tag[] = labelsToOptions(['Multiple Choice', 'Vocabulary']);

    Array.from(Array(cardCount)).forEach((_, chapterIndex) => {
        const category = labelsToOptions(['Chapter ' + (chapterIndex + 1)])[0];

        tags.forEach((tag) => {
            const name = `category-${category.value}-tag-${tag.value}`;

            cardSets.push({
                name,
                cards: Array.from(Array(cardCount)).map((_, cardIndex) => {
                    const cardNum: number = cardIndex + 1;

                    return {
                        id: `${name}-card-${cardNum}`,
                        front: `${`Card ${cardNum}`}
${category.label}
${tag.label}
Front`,
                        back: `${`Card ${cardNum}`}
${category.label}
${tag.label}
Back`,
                    };
                }),
                category,
                tags: [tag],
            });
        });
    });

    const directory = './public/fake-data/';

    readdirSync(directory).forEach((file) => unlinkSync(path.join(directory, file)));

    cardSets.forEach((data) => {
        writeFileSync(directory + data.name + '.json', JSON.stringify(data, null, '\t'));
    });

    writeFileSync(
        directory + 'index.json',
        JSON.stringify(
            {
                updated: new Date(),
                files: readdirSync(directory),
            },
            null,
            '\t'
        )
    );
}

generateFakeData();
