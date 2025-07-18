import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProductDetail from "./detail";

beforeEach(() => {
  jest.resetAllMocks();
});

afterEach(() => {
  jest.restoreAllMocks();
});

test("Mostra o carregando ao iniciar", () => {
  render(<ProductDetail id={1} />);
  expect(screen.getByRole("progressbar")).toBeInTheDocument();
});

test("Mostra mensagem de erro se o fetch falhar", async () => {
  global.fetch = jest.fn(() => Promise.resolve({ ok: false })) as any;
  render(<ProductDetail id={999} />);
  expect(
    await screen.findByText(/Erro ao buscar produto/i)
  ).toBeInTheDocument();
});

test("Mostra detalhes do produto quando carregado", async () => {
  const mockProduct = {
    id: 1,
    title: "Produto Teste",
    price: 123.45,
    description: "Descrição do produto",
    category: { id: 2, name: "Categoria Teste" },
    images: ["https://via.placeholder.com/80x80?text=Image"],
  };
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockProduct),
    })
  ) as any;

  render(<ProductDetail id={1} />);
  expect(await screen.findByText(/Produto Teste/i)).toBeInTheDocument();
  expect(screen.getByText(/Descrição do produto/i)).toBeInTheDocument();
  expect(screen.getByText(/Categoria Teste/i)).toBeInTheDocument();
  expect(screen.getByText(/R\$ 123,45/i)).toBeInTheDocument();
});

test("Mostra 'Sem outras imagens' quando não há imagens", async () => {
  const mockProduct = {
    id: 1,
    title: "Produto Teste",
    price: 123.45,
    description: "Descrição do produto",
    category: { id: 2, name: "Categoria Teste" },
    images: [],
  };
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockProduct),
    })
  ) as any;

  render(<ProductDetail id={1} />);
  expect(await screen.findByText(/sem outras imagens/i)).toBeInTheDocument();
});

test("Chama onBack ao clicar no botão Voltar", async () => {
  const mockProduct = {
    id: 1,
    title: "Produto Teste",
    price: 123.45,
    description: "Descrição do produto",
    category: { id: 2, name: "Categoria Teste" },
    images: [],
  };
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockProduct),
    })
  ) as any;

  const onBack = jest.fn();
  render(<ProductDetail id={1} onBack={onBack} />);
  const button = await screen.findByRole("button", { name: /voltar/i });
  await userEvent.click(button);
  expect(onBack).toHaveBeenCalled();
});
