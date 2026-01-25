import { Link } from 'react-router-dom';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { DEFAULT_FOOTER } from '../config/siteSettingsTypes';
import { theme } from '../theme/colors';

const SiteFooter = () => {
  const year = new Date().getFullYear();
  const { settings } = useSiteSettings();
  const footer = settings.footer ?? DEFAULT_FOOTER;
  const header = settings.header ?? { brandName: 'Bayangi Agro Market', brandMark: 'BAM', searchPlaceholder: 'Search products...' };
  const quickLinks = footer.quickLinks?.length ? footer.quickLinks : DEFAULT_FOOTER.quickLinks;

  return (
    <footer
      style={{
        background: `linear-gradient(180deg, ${theme.colors.primary.main} 0%, ${theme.colors.primary.dark} 100%)`,
        color: theme.colors.ui.white,
        borderTop: `1px solid ${theme.colors.neutral[200]}`
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '56px 20px 28px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '32px',
            alignItems: 'start'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <img
                src="/Bayangi agro marke logot.png"
                alt="Bayangi Agro Market Logo"
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  objectFit: 'cover'
                }}
              />
              <div>
                <div style={{ fontSize: '18px', fontWeight: 900, letterSpacing: '-0.02em', color: theme.colors.ui.white }}>{header.brandName}</div>
                <div style={{ fontSize: '13px', color: theme.colors.ui.white, opacity: 0.85 }}>{footer.tagline}</div>
              </div>
            </div>

            <div style={{ fontSize: '14px', color: theme.colors.ui.white, opacity: 0.78, lineHeight: 1.7, maxWidth: '360px' }}>
              {footer.description}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '14px', fontWeight: 900, color: theme.colors.ui.white, marginBottom: '12px' }}>Quick links</div>
            <div style={{ display: 'grid', gap: '10px' }}>
              {quickLinks.map((link) => (
                <Link key={link.path + link.label} to={link.path} style={{ color: theme.colors.ui.white, opacity: 0.82, textDecoration: 'none' }}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '14px', fontWeight: 900, color: theme.colors.ui.white, marginBottom: '12px' }}>Contact</div>
            <div style={{ display: 'grid', gap: '10px', color: theme.colors.ui.white, opacity: 0.82, fontSize: '14px' }}>
              <div>{footer.contactEmail}</div>
              <div>{footer.contactPhone}</div>
              <div>{footer.contactAddress}</div>
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: '34px',
            paddingTop: '18px',
            borderTop: `1px solid ${theme.colors.neutral[200]}`,
            display: 'flex',
            justifyContent: 'space-between',
            gap: '12px',
            flexWrap: 'wrap',
            alignItems: 'center',
            color: theme.colors.ui.white,
            opacity: 0.7,
            fontSize: '13px'
          }}
        >
          <div>© {year} Bayangi Agro Market. All rights reserved.</div>
          <div>{footer.bottomLine}</div>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
