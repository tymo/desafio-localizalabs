import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";

// Componente de cabeçalho fixo da aplicação
const Header: React.FC = () => (
  <AppBar
    position="fixed"
    sx={{
      backgroundColor: "#006400", // Cor de fundo do cabeçalho
      color: "#FFFFFF", // Cor do texto
      paddingY: 2, // Espaçamento vertical interno
    }}
    elevation={1}
    role="banner"
  >
    <Toolbar>
      <Typography
        variant="h6"
        component="div"
        sx={{
          flexGrow: 1, // Ocupa toda a largura disponível
          textAlign: "center", // Centraliza o texto
          fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" }, // Tamanhos responsivos
        }}
      >
        Desafio Localizalabs
      </Typography>
    </Toolbar>
  </AppBar>
);

export default Header;
