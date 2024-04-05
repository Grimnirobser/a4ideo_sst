"use client";

import { createContext, useState, useContext } from "react";
import { CurrentChannelContext } from "@/context/CurrentChannelContext";


type SignInOptionState = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const SignInOptionContext = createContext<SignInOptionState | null>(null);

const SignInOptionProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const currentChannel = useContext(CurrentChannelContext);
    const [isOpen, setIsOpen] = useState(false);

  return (
    <SignInOptionContext.Provider
      value={{
        isOpen,
        onOpen: () => currentChannel ? {} : setIsOpen(true),
        onClose: () => setIsOpen(false),
      }}
    >
      {children}
    </SignInOptionContext.Provider>
  );
};

export default SignInOptionProvider;
