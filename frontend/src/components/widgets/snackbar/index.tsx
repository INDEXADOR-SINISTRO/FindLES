"use client";

import React, { createContext, useContext, useCallback } from "react";

import CloseIcon from "@mui/icons-material/Close";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";

type AlertType = "success" | "error" | "warning" | "info";

interface MessageEvent {
  message: string;
  duration?: number;
  type: AlertType;
}

interface SnackbarContextValue {
  showMessage: (event: MessageEvent) => void;
}

const SnackbarContext = createContext<SnackbarContextValue | undefined>(
  undefined
);

export const SnackbarProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [open, setOpen] = React.useState(false);
  const [messageInfo, setMessageInfo] = React.useState<MessageEvent>({
    message: "",
    type: "success"
  });

  const showMessage = useCallback(
    ({ message, duration = 5000, type }: MessageEvent) => {
      setMessageInfo({ message, duration, type });
      setOpen(true);
    },
    []
  );

  const handleClose = (event: React.SyntheticEvent | Event, reason: string) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <SnackbarContext.Provider value={{ showMessage }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={messageInfo.duration}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        
      >
        <Alert
          severity={messageInfo.type}
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={() => setOpen(false)}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        >
          {messageInfo.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = (): SnackbarContextValue => {
  const context = useContext(SnackbarContext);

  if (!context) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }

  return context;
};
