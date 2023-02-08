import axios from 'axios';
import 'dotenv/config';
import { getIdentifierByType, Identifiers } from 'utils';

const PRIORITY = new Map<string, number>([
  ['1064628398313451541', 50],
  ['ROLE_ID', 100],
]);

const discordFetch = async <T>(endpoint: string): Promise<T> => {
  let data: T;

  const req = await axios.get(`https://discordapp.com/api/${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bot ${process.env.BOT_TOKEN}`,
    },
  });

  if (req.status === 200) {
    data = await req.data;
  }

  return data;
};

const fetchDiscordRoles = async (serverId: number) => {
  const discordId = getIdentifierByType(serverId, Identifiers.DISCORD);
  if (!discordId) return;

  const endpoint = `guilds/${process.env.GUILD_ID}/members/${discordId}`;
  const user: DiscordUser = await discordFetch(endpoint);
  if (!user) throw new Error('Não foi possível encontrar o usuário no Discord.');

  return user.roles;
};

const getUserPriority = async (serverId: number) => {
  const roles = await fetchDiscordRoles(serverId);
  if (!roles) return 0;

  let priorityLevel;

  for (const role of roles) {
    const priority = PRIORITY.get(role);
    if (priority && (!priorityLevel || priority > priorityLevel)) {
      priorityLevel = priority;
    }
  }

  return priorityLevel || 0;
};

export const DiscordManager = {
  getUserPriority,
  fetchDiscordRoles,
};
