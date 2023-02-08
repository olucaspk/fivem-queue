let processQueueInterval;
const queue: Record<number, QueueData> = {};
const serverIdPromises: Record<number, Promise<void>> = {};
const serverIdResolvers: Record<number, Function> = {};

const processQueue = () => {
  try {
    const queueLength = getQueueLength();
    if (queueLength > 0) {
      const firstPlayerInQueue = getFirstPlayerInQueue();

      if (serverIdResolvers[firstPlayerInQueue.serverId]) {
        serverIdResolvers[firstPlayerInQueue.serverId]();
      }

      delete queue[firstPlayerInQueue.serverId];
    }
  } catch (err) {
    console.error(err);
  }
};

const joinQueue = (serverId: number, connectTime: number, priority: number): void => {
  queue[serverId] = {
    serverId,
    connectTime,
    priority,
    boosted: false,
    crashed: false,
    ip: GetPlayerEndpoint(String(serverId)),
  };

  serverIdPromises[serverId] = new Promise((resolve) => {
    serverIdResolvers[serverId] = resolve;
  });
};

const leaveQueue = (serverId: number): void => {
  delete queue[serverId];
  delete serverIdPromises[serverId];
  delete serverIdResolvers[serverId];
};

const getFirstPlayerInQueue = (): QueueData => {
  const queueSortedByPositions = getQueueSortedByPositions();
  return queueSortedByPositions[0];
};

const getPlayerPositionInQueue = (serverId: number): number => {
  const queueSortedByPositions = getQueueSortedByPositions();
  return queueSortedByPositions.findIndex((player) => player.serverId === serverId);
};

const getQueueSortedByPositions = (): Array<QueueData> => {
  return Object.values(queue).sort(
    (a: QueueData, b: QueueData): number => b.priority - a.priority || a.connectTime - b.connectTime
  );
};

const getQueue = (): Record<number, QueueData> => {
  return queue;
};

const getQueueLength = () => {
  return Object.keys(queue).length;
};

const playerAccepted = async (serverId: number): Promise<void> => {
  await serverIdPromises[serverId];
};

const start = () => {
  processQueueInterval = setInterval(() => {
    processQueue();
  }, 1000);
};

export const QueueManager = {
  start,
  getQueue,
  getQueueLength,
  joinQueue,
  leaveQueue,
  getPlayerPositionInQueue,
  playerAccepted,
};
