import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Store, ShoppingBag } from 'lucide-react';
import { theme } from '../theme/colors';

const CardContainer = styled(Box)({
  position: 'relative',
  borderRadius: '15px',
  overflow: 'hidden',
  cursor: 'pointer',
  boxShadow: `0 4px 12px ${theme.colors.ui.shadow}`,
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    borderColor: theme.colors.primary.main,
  },
  border: `1px solid ${theme.colors.neutral[200]}`,
});

const BackgroundImage = styled('div')<{ image: string }>(({ image }) => ({
  width: '100%',
  height: '280px',
  backgroundImage: `url(${image})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
}));

const Content = styled(Box)({
  position: 'absolute',
  bottom: '20px',
  left: '20px',
  color: 'white',
  zIndex: 10,
});

const Title = styled(Typography)({
  fontWeight: 700,
  fontSize: '1.5rem',
  marginBottom: '0.25rem',
  textShadow: '0 2px 6px rgba(0,0,0,0.7)',
});

const Description = styled(Typography)({
  fontSize: '1rem',
  marginBottom: '0.75rem',
  textShadow: '0 1px 4px rgba(0,0,0,0.7)',
});

const Stats = styled(Box)({
  display: 'flex',
  gap: '1.5rem',
  fontSize: '0.9rem',
  fontWeight: 600,
  color: theme.colors.ui.white,
  alignItems: 'center',
});

const StatItem = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '0.3rem',
});

interface CommunityCardProps {
  heroImage: string;
  name: string;
  description: string;
  vendorCount: number;
  productCount: number;
}

const CommunityCard: React.FC<CommunityCardProps> = ({
  heroImage,
  name,
  description,
  vendorCount,
  productCount,
}) => {
  return (
    <CardContainer>
      <BackgroundImage image={heroImage} />
      <Content>
        <Title>{`Explore ${name}`}</Title>
        <Description>{description}</Description>
        <Stats>
          <StatItem>
            <Store size={18} />
            {`${vendorCount}+ Vendors`}
          </StatItem>
          <StatItem>
            <ShoppingBag size={18} color={theme.colors.ui.white} />
            {`${productCount}+ Products`}
          </StatItem>
        </Stats>
      </Content>
    </CardContainer>
  );
};

export default CommunityCard;
