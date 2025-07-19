import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";

// Componente de cabeçalho fixo da aplicação
const Header: React.FC = () => (
  <AppBar
    position="fixed"
    sx={{
      backgroundColor: "#006400", // Cor de fundo do cabeçalho
      color: "#FFFFFF", // Cor do texto
      py: { xs: 1, sm: 2 }, // Responsivo
    }}
    elevation={2}
    role="banner"
  >
    <Toolbar>
      {/* Exemplo de logo */}
      {/* <img src="/logo192.png" alt="Logo" style={{ height: 32, marginRight: 16 }} /> */}
      <Typography
        variant="h6"
        component="div"
        sx={{
          flexGrow: 1, // Ocupa toda a largura disponível
          textAlign: "center", // Centraliza o texto
          fontWeight: "bold",
          letterSpacing: 1,
          fontSize: { xs: "1.2rem", sm: "2rem", md: "2.5rem" }, // Tamanhos responsivos
          textTransform: "uppercase",
        }}
      >
        Desafio Localizalabs
      </Typography>
    </Toolbar>
  </AppBar>
);

export default Header;
