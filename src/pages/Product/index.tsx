import React, { useEffect, useState } from "react";
import ProductDetail from "./detail";
import {
  Box,
  Typography,
  CardMedia,
  CircularProgress,
  Alert,
  Pagination,
} from "@mui/material";
import Grid from "@mui/material/Grid";

type Product = {
  id: number;
  title: string;
  price: number;
  images?: string[];
};

const PRODUCTS_PER_PAGE = 10;

const ProductsPage: React.FC = () => {
  // Estados para controle dos produtos, carregamento, erro, paginação e seleção de produto
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Efeito para buscar produtos ao mudar de página
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        // Busca o total de produtos para calcular a paginação
        const countRes = await fetch(
          "https://api.escuelajs.co/api/v1/products"
        );
        const countData = await countRes.json();
        setTotalProducts(Array.isArray(countData) ? countData.length : 0);

        // Busca os produtos da página atual
        const offset = (currentPage - 1) * PRODUCTS_PER_PAGE;
        const productsRes = await fetch(
          `https://api.escuelajs.co/api/v1/products?offset=${offset}&limit=${PRODUCTS_PER_PAGE}`
        );
        if (!productsRes.ok) throw new Error();
        const productsData = await productsRes.json();
        setProducts(productsData || []);
      } catch {
        setError("Erro ao buscar produtos.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [currentPage]);

  // Calcula o total de páginas para a paginação
  const totalPages = Math.max(1, Math.ceil(totalProducts / PRODUCTS_PER_PAGE));

  // Exibe detalhes do produto selecionado
  if (selectedId !== null) {
    return (
      <Box sx={{ maxWidth: 700, mx: "auto", mt: 4 }}>
        <ProductDetail id={selectedId} onBack={() => setSelectedId(null)} />
      </Box>
    );
  }

  return (
    // Layout principal da página, com compensação para o header fixo
    <Box
      sx={{
        maxWidth: 900,
        mx: "auto",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        pt: "64px",
        px: { xs: 2, sm: 3 }, // Padding lateral responsivo
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Lista de Produtos
      </Typography>
      {/* Exibe indicador de carregamento */}
      {loading && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight={200}
          flexGrow={1}
        >
          <CircularProgress />
        </Box>
      )}
      {/* Exibe mensagem de erro */}
      {error && (
        <Alert severity="error" sx={{ mt: 2, flexGrow: 1 }}>
          {error}
        </Alert>
      )}
      {/* Exibe lista de produtos e paginação */}
      {!loading && !error && (
        <>
          {/* Lista de produtos rolável, ocupando no máximo 58% da área visível */}
          <Box
            sx={{
              flexGrow: 1,
              minHeight: 0,
              maxHeight: "58vh", // Limita a altura máxima a 58% da viewport
              overflowY: "auto",
              border: "1px solid #ddd",
              borderRadius: 2,
              pr: 1,
            }}
          >
            <Grid
              component="div"
              sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}
            >
              {/* Mensagem caso não haja produtos */}
              {products.length === 0 && (
                <Grid
                  component="div"
                  sx={{ flex: "1 1 100%", maxWidth: "100%" }}
                >
                  <Typography variant="body1">
                    Nenhum produto encontrado.
                  </Typography>
                </Grid>
              )}
              {/* Renderiza cada produto */}
              {products.map((product) => (
                <Grid
                  component="div"
                  key={product.id}
                  sx={{
                    flex: "1 1 100%",
                    maxWidth: "100%",
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      border: "1px solid #eee",
                      borderRadius: 2,
                      p: 2,
                      background: "#fafafa",
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={
                        product.images && product.images.length > 0
                          ? product.images[0]
                          : "https://via.placeholder.com/50x50?text=No+Image"
                      }
                      alt={product.title}
                      sx={{
                        width: 50,
                        height: 50,
                        objectFit: "cover",
                        borderRadius: 2,
                      }}
                    />
                    <Box
                      sx={{
                        ml: "15px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                      }}
                    >
                      <Typography
                        variant="h6"
                        component="div"
                        sx={{
                          cursor: "pointer",
                          color: "#1976d2",
                          textAlign: "left",
                        }}
                        onClick={() => setSelectedId(product.id)}
                      >
                        {product.title}
                      </Typography>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ mt: 0.5, textAlign: "left" }}
                      >
                        {product.price.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
          {/* Paginação sempre visível na parte inferior */}
          <Box
            display="flex"
            justifyContent="center"
            sx={{
              flexShrink: 0,
              border: "1px solid #ddd", // Borda ao redor da paginação
              borderRadius: 8,
              mt: "10px", // Espaço de 10px acima da paginação
              p: 1, // Espaçamento interno opcional
              background: "#fafafa", // Opcional: destaca a área da paginação
            }}
          >
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(_, value) => setCurrentPage(value)}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
              disabled={products.length === 0}
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default ProductsPage;
