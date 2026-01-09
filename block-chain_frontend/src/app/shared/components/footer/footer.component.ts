import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  footerLinks = [
    { label: 'About', route: '/about' },
    { label: 'How it Works', route: '/how-it-works' },
    { label: 'Contact', route: '/contact' },
    { label: 'GitHub', url: 'https://github.com/your-repo', external: true },
    { label: 'Docs', route: '/docs' }
  ];

  socialLinks = [
    { icon: '📧', label: 'Email', url: 'mailto:contact@oliveguard.com' },
    { icon: '🐙', label: 'GitHub', url: 'https://github.com/your-repo' },
    { icon: '💼', label: 'LinkedIn', url: 'https://linkedin.com' }
  ];
}
