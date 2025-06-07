import React, { ReactNode, createContext, useContext, useState } from 'react';

interface SignupContextProps {
  email: string | undefined;
  setEmail: (email: string) => void;
  token: string | undefined;
  setToken: (token: string) => void;
}

const SignupContext = createContext<SignupContextProps | undefined>(undefined);

export const SignupProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [email, setEmail] = useState<string | undefined>(undefined);
  const [token, setToken] = useState<string | undefined>(undefined);

  return (
    <SignupContext.Provider
      value={{
        email,
        setEmail,
        token,
        setToken,
      }}>
      {children}
    </SignupContext.Provider>
  );
};

export const useSignupState = (): SignupContextProps => {
  const context = useContext(SignupContext);
  if (!context) {
    throw new Error('useSignupState must be used within a SignupProvider');
  }
  return context;
};
