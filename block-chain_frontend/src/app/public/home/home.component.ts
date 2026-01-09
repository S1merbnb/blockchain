import { Component, OnInit } from '@angular/core';

interface Feature {
  icon: string;
  title: string;
  description: string;
  gradient: string;
}

interface Step {
  number: string;
  title: string;
  description: string;
  icon: string;
}

interface Stat {
  value: string;
  label: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  
  features: Feature[] = [
    {
      icon: '🌦️',
      title: 'Real-time Weather Monitoring',
      description: 'Advanced multi-source weather data aggregation with AI-powered prediction models for precise local conditions.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: '📊',
      title: 'Automated Damage Detection',
      description: 'Machine learning algorithms analyze patterns and thresholds to detect potential crop damage with 95%+ accuracy.',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: '🔒',
      title: 'Blockchain Transparency',
      description: 'Immutable event logging on distributed ledger technology ensures complete audit trails and data integrity.',
      gradient: 'from-amber-500 to-orange-500'
    },
    {
      icon: '👥',
      title: 'Expert Validation',
      description: 'Experienced insurance professionals review all automated detections before claim processing begins.',
      gradient: 'from-green-500 to-emerald-500'
    }
  ];

  steps: Step[] = [
    {
      number: '01',
      title: 'Multi-Source Data Collection',
      description: 'Aggregate real-time data from satellite imagery, local sensors, and weather APIs for comprehensive coverage.',
      icon: '📡'
    },
    {
      number: '02',
      title: 'AI-Powered Analysis',
      description: 'Advanced algorithms process environmental data and assign confidence scores to potential damage events.',
      icon: '🤖'
    },
    {
      number: '03',
      title: 'Immutable Blockchain Record',
      description: 'Events are cryptographically timestamped and stored on-chain for permanent, tamper-proof documentation.',
      icon: '⛓️'
    },
    {
      number: '04',
      title: 'Professional Review & Action',
      description: 'Insurance experts validate detections and initiate claims—farmers receive instant notifications upon approval.',
      icon: '✅'
    }
  ];

  stats: Stat[] = [
    { value: '99.7%', label: 'Detection Accuracy' },
    { value: '< 24h', label: 'Claim Processing' },
    { value: '2,500+', label: 'Protected Farms' },
    { value: '$8.5M', label: 'Claims Paid' }
  ];

  constructor() {}

  ngOnInit(): void {}
}
