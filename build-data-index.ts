import fs from 'fs';
import path from 'path';

function buildIndex() {
    const directory = './public/data/';

    fs.unlinkSync(path.join(directory, 'index.json'));

    const files = fs.readdirSync(directory);

    fs.writeFileSync(
        directory + 'index.json',
        JSON.stringify(
            {
                updated: new Date(),
                files,
            },
            null,
            '\t'
        )
    );
}

buildIndex();
