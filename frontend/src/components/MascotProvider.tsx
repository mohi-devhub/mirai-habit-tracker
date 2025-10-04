import React, { createContext, useContext, ReactNode } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { MascotMessage } from "@/types";
import {
  showMessage,
  hideMessage,
  clearCurrentMessage,
} from "@/store/slices/mascotSlice";
import { MascotModal } from "./MascotModal";

interface MascotContextType {
  showMascotMessage: (message: MascotMessage) => void;
  hideMascotMessage: () => void;
  clearCurrentMascotMessage: () => void;
}

const MascotContext = createContext<MascotContextType | undefined>(undefined);

interface MascotProviderProps {
  children: ReactNode;
}

export const MascotProvider: React.FC<MascotProviderProps> = ({ children }) => {
  const dispatch = useDispatch();
  const { currentMessage, isVisible } = useSelector(
    (state: RootState) => state.mascot
  );

  const showMascotMessage = (message: MascotMessage) => {
    dispatch(showMessage(message));
  };

  const hideMascotMessage = () => {
    dispatch(hideMessage());
  };

  const clearCurrentMascotMessage = () => {
    dispatch(clearCurrentMessage());
  };

  const contextValue: MascotContextType = {
    showMascotMessage,
    hideMascotMessage,
    clearCurrentMascotMessage,
  };

  return (
    <MascotContext.Provider value={contextValue}>
      {children}
      {isVisible && currentMessage && (
        <MascotModal message={currentMessage} onClose={hideMascotMessage} />
      )}
    </MascotContext.Provider>
  );
};

export const useMascot = (): MascotContextType => {
  const context = useContext(MascotContext);
  if (context === undefined) {
    throw new Error("useMascot must be used within a MascotProvider");
  }
  return context;
};
