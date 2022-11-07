import Dexie, { Table } from 'dexie';
import { DEFAULT_SETTINGS } from './constants';

export class FlashCardsDexie extends Dexie {
    settings!: Table<SettingsMeta>;

    constructor() {
        super('FlashCards1');

        this.version(4).stores({
            settings: '&key, value, updated',
        });
    }
}

export const db = new FlashCardsDexie();

db.on('populate', () => {
    return db.settings.bulkAdd([
        { key: 'proficiency', value: DEFAULT_SETTINGS.proficiency, updated: new Date() },
        { key: 'cardStats', value: DEFAULT_SETTINGS.cardStats, updated: new Date() },
    ]);
});
