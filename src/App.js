import "./App.css";
import React from "react";
import { MantineProvider } from "@mantine/core";
import { AuthProvider } from "./Providers/Authentication/Authentication";
import RenderRoutes from "./Routes/Index";
import { NotificationsProvider } from "@mantine/notifications";

function App() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <NotificationsProvider position="bottom-left">
        <AuthProvider>
          <RenderRoutes />
        </AuthProvider>
      </NotificationsProvider>
    </MantineProvider>
  );
}

export default App;
