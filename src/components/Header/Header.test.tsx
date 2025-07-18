import { render, screen } from "@testing-library/react";
import Header from "./index";

test("Mostra o Header com o título", () => {
  render(<Header />);
  expect(screen.getByText(/Desafio Localizalabs/i)).toBeInTheDocument();
});
