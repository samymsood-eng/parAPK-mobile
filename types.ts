
export interface ConnectionData {
  ip: string;
  port: string;
  protocol: 'http' | 'https' | 'ws' | 'wss' | 'tcp' | 'udp' | 'webrtc' | 'tcp-nodelay';
  appName?: string;
  webrtcOffer?: string; // Encoded SDP offer for P2P
  wifiSsid?: string;
  wifiPassword?: string;
  wifiHidden?: boolean;
  wifiEncryption?: 'WPA' | 'WEP' | 'nopass';
  iceServers?: string[]; // Dynamic ICE servers
  enableDataChannel?: boolean;
}

export interface WifiNetwork {
  ssid: string;
  strength: 'strong' | 'medium' | 'weak';
  isSecure: boolean;
  id: string;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
}

export type ConnectionStatus = 
  | 'disconnected' 
  | 'initializing' 
  | 'gathering' 
  | 'signaling' 
  | 'checking'
  | 'connected' 
  | 'failed' 
  | 'error' 
  | 'listening';

export interface SystemHealth {
  status: 'optimal' | 'repairing' | 'warning';
  lastCheck: string;
  activeModules: string[];
  autoFixedIssues: number;
}

export interface ConnectedDevice {
  id: string;
  name: string;
  type: 'mobile' | 'tablet' | 'other';
  connectedAt: string;
  ip: string;
  status: 'active' | 'offline';
  latency?: number; // Simulated latency
}

export interface DiscoveredDevice {
  ip: string;
  name: string;
  port: string;
  type: 'pc' | 'mobile' | 'server';
  status: 'available' | 'busy';
}

export type UserRole = 'admin' | 'operator' | 'viewer';

export interface UserAccount {
  id: string;
  username: string;
  password?: string;
  role: UserRole;
  lastLogin: string;
  lastLogout?: string;
  permissions: {
    canScan: boolean;
    canConnect: boolean;
    canManageUsers: boolean;
  };
}
