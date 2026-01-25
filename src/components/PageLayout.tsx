import type { ReactNode } from 'react';
import AnnouncementBar from './AnnouncementBar';
import EcommerceHeader from './EcommerceHeader';
import CategoryNavigation from './CategoryNavigation';
import { Box } from '@mui/material';
import SiteFooter from './SiteFooter';

interface PageLayoutProps {
  children: ReactNode;
  showAnnouncementBar?: boolean;
  showCategoryNav?: boolean;
  showFooter?: boolean;
}

export default function PageLayout({
  children,
  showAnnouncementBar = true,
  showCategoryNav = true,
  showFooter = true,
}: PageLayoutProps) {
  return (
    <Box>
      {showAnnouncementBar && <AnnouncementBar />}
      <EcommerceHeader />
      {showCategoryNav && <CategoryNavigation />}
      {children}
      {showFooter && <SiteFooter />}
    </Box>
  );
}
