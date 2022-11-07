import { DEFAULT_CARD_STAT } from './constants';

export default function getCardProgress(proficiencyGoal: number, stat: CardStat = DEFAULT_CARD_STAT) {
    const cardTotal = (stat.right || 0) - (stat.left || 0);

    if (cardTotal < 0) return 0;

    if (cardTotal >= proficiencyGoal) return 100;

    return Math.round((cardTotal / proficiencyGoal) * 100);
}
