import React, { createContext, useContext, useState, ReactNode } from 'react';
import PricesModal from './PricesModal';
import ProfileModal from './ProfileModal';
import CommunityWriteModal from './CommunityWriteModal';

interface ModalContextType {
  openPricesModal: () => void;
  openProfileModal: () => void;
  openCommunityWriteModal: (communityName: string) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function useModalManager() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModalManager must be used within a ModalProvider');
  }
  return context;
}

interface ModalProviderProps {
  children: ReactNode;
}

export function ModalProvider({ children }: ModalProviderProps) {
  const [pricesModalOpen, setPricesModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [communityWriteModalOpen, setCommunityWriteModalOpen] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState('');

  const openPricesModal = () => {
    setPricesModalOpen(true);
  };

  const openProfileModal = () => {
    setProfileModalOpen(true);
  };

  const openCommunityWriteModal = (communityName: string) => {
    setSelectedCommunity(communityName);
    setCommunityWriteModalOpen(true);
  };

  const closePricesModal = () => {
    setPricesModalOpen(false);
  };

  const closeProfileModal = () => {
    setProfileModalOpen(false);
  };

  const closeCommunityWriteModal = () => {
    setCommunityWriteModalOpen(false);
    setSelectedCommunity('');
  };

  // Make functions available globally
  React.useEffect(() => {
    (window as any).openPricesModal = openPricesModal;
    (window as any).openProfileModal = openProfileModal;
    (window as any).openCommunityWriteModal = openCommunityWriteModal;

    return () => {
      delete (window as any).openPricesModal;
      delete (window as any).openProfileModal;
      delete (window as any).openCommunityWriteModal;
    };
  }, []);

  return (
    <ModalContext.Provider value={{ openPricesModal, openProfileModal, openCommunityWriteModal }}>
      {children}
      
      <PricesModal isOpen={pricesModalOpen} onClose={closePricesModal} />
      <ProfileModal isOpen={profileModalOpen} onClose={closeProfileModal} />
      <CommunityWriteModal 
        isOpen={communityWriteModalOpen} 
        onClose={closeCommunityWriteModal} 
        communityName={selectedCommunity}
      />
    </ModalContext.Provider>
  );
}
