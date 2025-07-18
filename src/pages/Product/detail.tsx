import React, { useEffect, useState } from "react";
import {
  CardContent,
  CardMedia,
  Typography,
  Box,
  Card,
  CircularProgress,
  Alert,
  Divider,
  Button,
  IconButton,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

// Tipo para os dados do produto
type Product = {
  id: number;
  title: string;
  price: number;
  description?: string;
  category?: { id: number; name: string; image?: string };
  images?: string[];
};

interface ProductDetailProps {
  id: number;
  onBack?: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ id, onBack }) => {
  // Estados para armazenar o produto, status de carregamento, erro e índice do carrossel de imagens
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [carouselIdx, setCarouselIdx] = useState(0);

  // Busca os dados do produto ao montar o componente ou quando o id muda
  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`https://api.escuelajs.co/api/v1/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao buscar produto.");
        return res.json();
      })
      .then((data) => {
        setProduct(data as Product);
        setCarouselIdx(0);
        setLoading(false);
      })
      .catch(() => {
        setError("Erro ao buscar produto.");
        setLoading(false);
      });
  }, [id]);

  // Exibe indicador de carregamento
  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight={200}
      >
        <CircularProgress />
      </Box>
    );
  // Exibe mensagem de erro
  if (error)
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  // Exibe mensagem caso o produto não seja encontrado
  if (!product)
    return (
      <Alert severity="warning" sx={{ mt: 2 }}>
        Produto não encontrado.
      </Alert>
    );

  // Define as imagens do produto ou uma imagem placeholder
  const images =
    product.images && product.images.length > 0
      ? product.images
      : ["https://via.placeholder.com/240x240?text=Sem+Imagem"];

  // Funções para navegação do carrossel de imagens
  const handlePrev = () =>
    setCarouselIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const handleNext = () =>
    setCarouselIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  return (
    <Box sx={{ maxWidth: 1400, mx: "auto", mt: 4 }}>
      <Card sx={{ boxShadow: 3, borderRadius: 3 }}>
        <CardContent>
          {/* Detalhes do produto */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              textAlign: "left",
              mb: 3,
            }}
          >
            <Typography variant="body1" component="div" gutterBottom>
              <strong>Id:</strong> {product.id}
            </Typography>
            <Typography variant="body1" component="div" gutterBottom>
              <strong>Nome:</strong> {product.title}
            </Typography>
            <Typography variant="body1" component="div" gutterBottom>
              <strong>Descrição:</strong>{" "}
              {product.description || "Sem descrição"}
            </Typography>
            <Typography variant="body1" component="div" gutterBottom>
              <strong>Categoria:</strong>{" "}
              {product.category?.name || "Sem categoria"}
            </Typography>
            <Typography variant="body1" component="div" gutterBottom>
              <strong>Preço: </strong>
              {product.price.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </Typography>
          </Box>
          {/* Carrossel de imagens do produto */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 260,
              mb: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton
                aria-label="Imagem anterior"
                onClick={handlePrev}
                disabled={images.length <= 1}
                size="large"
              >
                <ArrowBackIosNewIcon />
              </IconButton>
              <CardMedia
                component="img"
                image={images[carouselIdx]}
                alt={`Imagem ${carouselIdx + 1} de ${product.title}`}
                sx={{
                  width: 200,
                  height: 200,
                  objectFit: "cover",
                  borderRadius: 2,
                  border: "1px solid #ccc",
                  background: "#fafafa",
                  mx: 2,
                }}
              />
              <IconButton
                aria-label="Próxima imagem"
                onClick={handleNext}
                disabled={images.length <= 1}
                size="large"
              >
                <ArrowForwardIosIcon />
              </IconButton>
            </Box>
            <Typography variant="caption" sx={{ mt: 1 }}>
              {images.length > 1
                ? `Imagem ${carouselIdx + 1} de ${images.length}`
                : "Sem outras imagens"}
            </Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          {/* Botão para voltar à lista de produtos */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={onBack}
              aria-label="Voltar para a lista de produtos"
            >
              Voltar
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProductDetail;
