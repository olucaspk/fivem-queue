interface Deferrals {
  defer(): void;
  done(failureReason?: string): void;
  handover(data: {}): void;
  presentCard(card: string | {}, cb?: CardCallback): void;
  update(message: string): void;
}

interface QueueData {
  serverId: number;
  connectTime: number;
  priority: number;
  boosted?: boolean;
  crashed?: boolean;
  ip: string;
}

interface DiscordUser {
  roles: string[];
}
