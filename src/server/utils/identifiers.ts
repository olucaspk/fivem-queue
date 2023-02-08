export enum Identifiers {
  LICENSE = 'license',
  STEAM = 'steam',
  DISCORD = 'discord',
  LIVE = 'live',
  XBL = 'xbl',
  FIVEM = 'fivem',
  IP = 'ip',
}

export const getIdentifiers = (serverId: number) => {
  const identifiers: Record<string, string> = {};

  for (let i = 0; i < GetNumPlayerIdentifiers(serverId.toString()); i++) {
    const identifier = GetPlayerIdentifier(serverId.toString(), i);
    const [prefix] = identifier.split(':');
    identifiers[prefix] = identifier.replace(`${prefix}:`, '');
  }

  return identifiers;
};

export const getIdentifierByType = (serverId: number, type: Identifiers) => {
  const identifiers = getIdentifiers(serverId);
  return identifiers[type];
};
