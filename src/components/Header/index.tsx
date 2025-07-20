import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";

// Componente de cabeçalho fixo da aplicação
const Header: React.FC = () => (
  <AppBar
    position="fixed"
    className="header-appbar"
    sx={{
      py: { xs: 1, sm: 2 }, // Mantém responsivo no sx
    }}
    elevation={2}
    role="banner"
  >
    <Toolbar>
      <Typography
        variant="h6"
        component="div"
        className="header-title"
        sx={{
          flexGrow: 1,
          fontSize: { xs: "1.2rem", sm: "2rem", md: "2.5rem" }, // Mantém responsivo no sx
        }}
      >
        Desafio Localizalabs
      </Typography>
    </Toolbar>
  </AppBar>
);

export default Header;
