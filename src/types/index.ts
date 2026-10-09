export type Role = 'Admin' | 'Maker' | 'Checker';
export type Environment = 'PROD' | 'DEV';
export type ActiveEngine = 'home' | 'notification' | 'sms' | 'whatsapp';

export interface ToastMessage {
  id: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
}

export interface StreamEvent {
  id: string;
  ref: string;
  timestamp: string;
  engine: 'NOTIFICATION' | 'SMS' | 'WHATSAPP';
  templateCode: string;
  templateTitle: string;
  recipient: string;
  recipientSub: string;
  channelNode: string;
  channelNodeSub: string;
  latency: string;
  status: 'DELIVERED' | 'READ (2-TICK)' | 'RE-ROUTED SMS' | 'FAILED';
}
