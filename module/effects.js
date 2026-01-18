/**
 * Manage Active Effect instances through an Actor or Item Sheet via effect control buttons.
 * @param {MouseEvent} event      The left-click event on the effect control
 * @param {Actor|Item} owner      The owning document which manages this effect
 */
export function onManageActiveEffect(event, owner) {
    event.preventDefault();
    const a = event.currentTarget;
    const li = a.closest('li');
    const effect = li.dataset.effectId
        ? owner.effects.get(li.dataset.effectId)
        : null;
    switch (a.dataset.action) {
        case 'create':
            return owner.createEmbeddedDocuments('ActiveEffect', [
                {
                    name: game.i18n.format('DOCUMENT.New', {
                        type: game.i18n.localize('DOCUMENT.ActiveEffect'),
                    }),
                    icon: 'icons/svg/aura.svg',
                    origin: owner.uuid,
                    'duration.rounds':
                        li.dataset.effectType === 'temporary' ? 1 : undefined,
                    disabled: li.dataset.effectType === 'inactive',
                },
            ]);
        case 'edit':
            return effect.sheet.render(true);
        case 'delete':
            return effect.delete();
        case 'toggle':
            return effect.update({ disabled: !effect.disabled });
    }
}
export function prepareActiveEffectCategories(effects) {
    // Define effect header categories
    const categories = {
        temporary: {
            type: 'temporary',
            label: game.i18n.localize('sheet.effects.temporary'),
            effects: [],
        },
        passive: {
            type: 'passive',
            label: game.i18n.localize('sheet.effects.passive'),
            effects: [],
        },
    };

    for (let e of effects) {
        if (e.isTemporary) categories.temporary.effects.push(e);
        else categories.passive.effects.push(e);
    }
    return categories;
}

const SECONDS_IN_YEAR = 31536000;
const SECONDS_IN_DAY = 86400;
const SECONDS_IN_HOUR = 3600;
const SECONDS_IN_MINUTE = 60;

export function formatDuration(seconds) {
    if (seconds < 60) return game.i18n.format('sheet.effects.durationPeriod.seconds', { count: seconds });

    const years = Math.floor(seconds / SECONDS_IN_YEAR);
    seconds %= SECONDS_IN_YEAR;

    const days = Math.floor(seconds / SECONDS_IN_DAY);
    seconds %= SECONDS_IN_DAY;

    const hours = Math.floor(seconds / SECONDS_IN_HOUR);
    seconds %= SECONDS_IN_HOUR;

    const minutes = Math.floor(seconds / SECONDS_IN_MINUTE);
    seconds %= SECONDS_IN_MINUTE;

    const parts = [];
    if (years) parts.push(game.i18n.format('sheet.effects.durationPeriod.years', { count: years }));
    if (days) parts.push(game.i18n.format('sheet.effects.durationPeriod.days', { count: days }));
    if (hours) parts.push(game.i18n.format('sheet.effects.durationPeriod.hours', { count: hours }));
    if (minutes) parts.push(game.i18n.format('sheet.effects.durationPeriod.minutes', { count: minutes }));
    if (seconds) parts.push(game.i18n.format('sheet.effects.durationPeriod.seconds', { count: seconds }));

    return parts.join(', ');
}

