import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProductsPage from "./index";

beforeEach(() => {
  jest.resetAllMocks();
});
afterEach(() => {
  jest.restoreAllMocks();
});

test("Mostra o carregando durante a busca", () => {
  render(<ProductsPage />);
  expect(screen.getByRole("progressbar")).toBeInTheDocument();
});

test("Mostra menssagem de erro quando a requisição falha", async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: false,
      json: () => Promise.resolve({}),
    })
  ) as any;
  render(<ProductsPage />);
  expect(
    await screen.findByText(/Erro ao buscar produtos/i)
  ).toBeInTheDocument();
});

test("Mostra a lista de produtos após carregar", async () => {
  const mockProducts = [
    {
      id: 1,
      title: "Produto Teste",
      price: 123.45,
      images: ["https://via.placeholder.com/50x50?text=Image"],
    },
  ];
  global.fetch = jest
    .fn()
    .mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockProducts),
    })
    .mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockProducts),
    });

  render(<ProductsPage />);
  expect(await screen.findByText(/Produto Teste/i)).toBeInTheDocument();
  expect(screen.getByText(/R\$ 123,45/i)).toBeInTheDocument();
});

test("Mostra o detalhe do produto ao clicar no título", async () => {
  const mockProducts = [
    {
      id: 1,
      title: "Produto Teste",
      price: 123.45,
      images: ["https://via.placeholder.com/50x50?text=Image"],
    },
  ];
  const mockProductDetail = {
    id: 1,
    title: "Produto Teste",
    price: 123.45,
    description: "Descrição do produto",
    category: { id: 2, name: "Categoria Teste" },
    images: ["https://via.placeholder.com/80x80?text=Image"],
  };

  global.fetch = jest.fn((url) => {
    if (url.includes("/products/1")) {
      // Product detail fetch
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockProductDetail),
      });
    }
    // Product list fetch
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockProducts),
    });
  }) as any;

  render(<ProductsPage />);
  const title = await screen.findByText(/Produto Teste/i);
  await userEvent.click(title);
  expect(
    await screen.findByRole("button", { name: /voltar/i })
  ).toBeInTheDocument();
});

test("Mostra o controle de paginação", async () => {
  const mockProducts = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    title: `Produto ${i + 1}`,
    price: (i + 1) * 10,
    images: ["https://via.placeholder.com/50x50?text=Image"],
  }));
  global.fetch = jest
    .fn()
    .mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockProducts),
    })
    .mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockProducts),
    });

  render(<ProductsPage />);
  expect(await screen.findByRole("navigation")).toBeInTheDocument();
});
