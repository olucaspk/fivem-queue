import { DiscordManager } from 'managers/discord-manager';
import { QueueManager } from 'managers/queue-manager';
import { getAccountOrCreate } from 'repositories/account-repository';
import { Delay, getIdentifierByType, Identifiers } from 'utils';
import './repositories/index';

const playerIntervals: Record<number, NodeJS.Timeout> = {};

const onPlayerConnecting = async (name: string, setKickReason: Function, deferrals: Deferrals) => {
  const serverId = global.source;
  const connectTime = GetGameTimer();

  deferrals.defer();

  await Delay(0);

  deferrals.update('Conectando...');

  const license = getIdentifierByType(serverId, Identifiers.LICENSE);
  if (!license) {
    deferrals.done('Não foi possível encontrar sua licença.');
    return;
  }

  const account = await getAccountOrCreate(license);
  if (!account) {
    deferrals.done('Não foi possível encontrar sua conta.');
    return;
  }

  if (!account.isAllowed) {
    deferrals.done('Você não tem permissão para entrar no servidor.');
    return;
  }

  const priority = await DiscordManager.getUserPriority(serverId);
  QueueManager.joinQueue(serverId, connectTime, priority);

  playerIntervals[serverId] = setInterval(() => {
    const position = QueueManager.getPlayerPositionInQueue(serverId);
    deferrals.update(
      `Você está na posição ${position}/${QueueManager.getQueueLength()} da fila.\nSeu nível de prioridade é: ${priority}}`
    );
  }, 1000);

  await QueueManager.playerAccepted(serverId);

  clearInterval(playerIntervals[serverId]);

  deferrals.done();
};

const onPlayerDropped = () => {
  const serverId = global.source;

  QueueManager.leaveQueue(serverId);
  clearInterval(playerIntervals[serverId]);
};

const start = () => {
  QueueManager.start();

  on('playerConnecting', onPlayerConnecting);
  on('playerDropped', onPlayerDropped);
};

start();
