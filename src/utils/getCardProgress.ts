export default function getCardProgress(proficiencyGoal: number, cardTotal: number = 0) {
    if (cardTotal < 0) return 0;

    if (cardTotal >= proficiencyGoal) return 100;

    return Math.round((cardTotal / proficiencyGoal) * 100);
}
