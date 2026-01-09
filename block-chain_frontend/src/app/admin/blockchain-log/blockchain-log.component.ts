import { Component, OnInit } from '@angular/core';

interface LogEntry {
  eventId: string;
  action: 'Pending' | 'Confirmed' | 'Cancelled';
  timestamp: string; // ISO
  txHash?: string | null;
}

@Component({
  selector: 'app-blockchain-log',
  templateUrl: './blockchain-log.component.html',
  styleUrls: ['./blockchain-log.component.scss']
})
export class BlockchainLogComponent implements OnInit {
  entries: LogEntry[] = [];

  ngOnInit(): void {
    // mock entries - in a real app these would come from an API
    this.entries = [
      { eventId: 'EVT-1005', action: 'Confirmed', timestamp: '2026-01-06T12:15:00Z', txHash: '0x6a3b...f2c1' },
      { eventId: 'EVT-1001', action: 'Confirmed', timestamp: '2026-01-05T09:02:00Z', txHash: '0x9c2d...a3b4' },
      { eventId: 'EVT-1004', action: 'Cancelled', timestamp: '2026-01-03T14:22:00Z', txHash: '0x2e7f...8d9a' },
      { eventId: 'EVT-1002', action: 'Pending', timestamp: '2026-01-05T08:20:00Z', txHash: null },
      { eventId: 'EVT-1003', action: 'Pending', timestamp: '2025-12-28T14:30:00Z', txHash: null }
    ];
  }

  explorerUrl(tx?: string | null) {
    if (!tx) return null;
    // default to Etherscan for demo; replace with chain-specific explorer as needed
    return `https://etherscan.io/tx/${tx}`;
  }
}
