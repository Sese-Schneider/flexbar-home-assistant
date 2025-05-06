import {
  callService,
  Connection,
  createConnection,
  createLongLivedTokenAuth,
  HassEntities,
  HassEntity,
  subscribeEntities,
} from 'home-assistant-js-websocket';
import WebSocket from 'ws';

import { Config, Context } from './types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).WebSocket = WebSocket;

let configCache: Config | null = null;
let connectionCache: Connection | null = null;

let entityStateCache: HassEntities = {};
const entitySubscriptions: ((state: HassEntities) => void)[] = [];
const entityLastChangedCache = new Map<string, string>();

/**
 * Used by the application settings flow to test the connection.
 */
async function testConnection(config: Config): Promise<boolean> {
  const url = `${config.url}/api/`;
  const result = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${config.api_key}`,
      'Content-Type': 'application/json',
    },
  });
  return result.ok;
}

async function openConnection(context: Context): Promise<Connection> {
  if (connectionCache) return connectionCache;

  const config = await getConfig(context);
  const auth = createLongLivedTokenAuth(config.url, config.api_key);

  try {
    const connection = await createConnection({ auth });
    connectionCache = connection;

    context.logger?.info(
      `Connected to Home Assistant v${connection.haVersion}`
    );

    subscribeEntities(connection, state => {
      entityStateCache = state;
      entitySubscriptions.forEach(subscription => subscription(state));
    });

    return connection;
  } catch (error) {
    context.logger?.error('Failed to connect to WebSocket:', error);
    throw error;
  }
}

async function getConfig(context: Context): Promise<Config> {
  if (configCache) return configCache;
  configCache = (await context.plugin.getConfig()) as Config;
  return configCache;
}

async function toggle(domain: string, entityId: string, context: Context) {
  const connection = await openConnection(context);
  callService(
    connection,
    domain,
    'toggle',
    {},
    {
      entity_id: entityId,
    }
  );
}

async function subscribeToEntities(
  entityIds: string[],
  context: Context,
  callback: (entities: HassEntity[]) => void
): Promise<() => void> {
  await openConnection(context);
  entityLastChangedCache.clear();

  const subscription = (state: HassEntities) => {
    const changedEntities = Object.values(state)
      .filter(entity => entityIds.includes(entity.entity_id))
      .filter(entity => {
        const lastChanged = entityLastChangedCache.get(entity.entity_id);
        const hasChanged = lastChanged !== entity.last_changed;
        if (hasChanged) {
          entityLastChangedCache.set(entity.entity_id, entity.last_changed);
        }

        return hasChanged;
      });

    if (changedEntities.length > 0) {
      callback(changedEntities);
    }
  };
  subscription(entityStateCache);
  entitySubscriptions.push(subscription);

  return () => {
    entitySubscriptions.splice(entitySubscriptions.indexOf(subscription), 1);
  };
}

export { subscribeToEntities, testConnection, toggle };
