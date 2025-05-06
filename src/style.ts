/* eslint-disable @typescript-eslint/no-explicit-any */
import { HassEntity } from 'home-assistant-js-websocket';

import { rgbToHex } from './utils/color.util';

function getBackgroundColor(
  domain: string,
  isOn: boolean,
  attributes: any,
  defaultColor: string = '#4b4b4b'
): string {
  if (domain !== 'light' || !isOn) return defaultColor;
  if (attributes.rgb_color) return rgbToHex(attributes.rgb_color);
  return '#ffc107';
}

export async function getKeyStyle(key: any, state: HassEntity) {
  const entityId = key.data.entityId;
  const domain = entityId.split('.')[0];

  const isOn = state.state === 'on';

  return {
    ...key.style,

    showIcon: true,
    icon: state.attributes.icon
      ? `mdi ${state.attributes.icon.replace(':', '-')}`
      : key.style.icon || 'mdi mdi-toggle-switch',

    bgColor: getBackgroundColor(domain, isOn, state.attributes),
  };
}
