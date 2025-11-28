import { LinkedIn, GitHub, Mail, ArrowOutward, ContentCopy, Check } from '@mui/icons-material';
import { useState } from 'react';

const EMAIL = 'diegoforrestcruz@gmail.com';

const footerLinks = [
  { name: 'Linkedin', icon: LinkedIn, url: 'https://www.linkedin.com/in/diegoforrestcruz/' },
  { name: 'Github', icon: GitHub, url: 'https://github.com/diegoforrest' },
];

export const Footer = () => {
  const [copied, setCopied] = useState(false);

  const copyEmail = async (e) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-divider"></div>
        <div className="footer-content">
          <p className="footer-copyright">© 2025. All rights reserved.</p>
          <div className="footer-links">
            {footerLinks.map((link) => {
              const IconComponent = link.icon;
              return (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  <IconComponent sx={{ fontSize: 18 }} />
                  <span>{link.name}</span>
                  <ArrowOutward sx={{ fontSize: 16 }} className="footer-link-arrow" />
                </a>
              );
            })}
            <button
              onClick={copyEmail}
              className="footer-link footer-mail-btn"
            >
              <Mail sx={{ fontSize: 18 }} />
              <span>{copied ? 'Copied!' : 'Mail'}</span>
              {copied ? (
                <Check sx={{ fontSize: 16 }} className="footer-link-arrow" />
              ) : (
                <ContentCopy sx={{ fontSize: 16 }} className="footer-link-arrow" />
              )}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
