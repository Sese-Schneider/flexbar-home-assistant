import { getEntityState } from './api';
import { Context } from './types';
import { rgbToHex } from './utils/color.util';

function getBackgroundColor(
    domain: string,
    isOn: boolean,
    attributes: any,
    defaultColor: string
): string {
    if (domain !== 'light' || !isOn) return defaultColor;
    if (attributes.rgb_color) return rgbToHex(attributes.rgb_color);
    return '#ffc107';
}

export async function getKeyStyle(key: any, context: Context) {
    const entityId = key.data.entityId;
    const domain = entityId.split('.')[0];

    const state = await getEntityState(entityId, context);
    const isOn = state.state === 'on';

    context.logger?.info('state', state);

    return {
        ...key.style,

        showIcon: true,
        icon: state.attributes.icon
            ? `mdi ${state.attributes.icon.replace(':', '-')}`
            : key.style.icon || 'mdi mdi-toggle-switch',

        bgColor: getBackgroundColor(
            domain,
            isOn,
            state.attributes,
            key.style.bgColor
        ),
    };
}
