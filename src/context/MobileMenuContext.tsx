import { createContext, useContext, type ReactNode } from 'react';

interface MobileMenuContextType {
  mobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
}

const MobileMenuContext = createContext<MobileMenuContextType | undefined>(undefined);

export function useMobileMenu() {
  const context = useContext(MobileMenuContext);
  if (context === undefined) {
    throw new Error('useMobileMenu must be used within a MobileMenuProvider');
  }
  return context;
}

interface MobileMenuProviderProps {
  children: ReactNode;
  mobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
}

export function MobileMenuProvider({ children, mobileMenuOpen, toggleMobileMenu }: MobileMenuProviderProps) {
  return (
    <MobileMenuContext.Provider value={{ mobileMenuOpen, toggleMobileMenu }}>
      {children}
    </MobileMenuContext.Provider>
  );
}
