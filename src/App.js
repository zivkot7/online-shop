import "./App.css";
import React from "react";
import { MantineProvider } from "@mantine/core";
import { AuthProvider } from "./Providers/Authentication/Authentication";
import RenderRoutes from "./Routes/Index";
import { Notifications } from "@mantine/notifications";

function App() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <AuthProvider>
        <RenderRoutes />
        <Notifications position="bottom-left" />
      </AuthProvider>
    </MantineProvider>
  );
}

export default App;
