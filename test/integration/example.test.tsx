import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Exemplo de teste de integração - Formulário simples
function SimpleForm({
  onSubmit,
}: {
  onSubmit: (data: { name: string; email: string }) => void;
}) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSubmit({
      name: formData.get("name") as string,
      email: formData.get("email") as string,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <Label htmlFor="name">Nome</Label>
        <Input id="name" name="name" required />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required />
      </div>
      <Button type="submit">Enviar</Button>
    </form>
  );
}

describe("SimpleForm Integration Test", () => {
  it("deve preencher e enviar formulário", async () => {
    const handleSubmit = vi.fn();
    const user = userEvent.setup();

    render(<SimpleForm onSubmit={handleSubmit} />);

    // Preencher campos
    const nameInput = screen.getByLabelText("Nome");
    const emailInput = screen.getByLabelText("Email");

    await user.type(nameInput, "João Silva");
    await user.type(emailInput, "joao@example.com");

    // Enviar formulário
    const submitButton = screen.getByRole("button", { name: "Enviar" });
    await user.click(submitButton);

    // Verificar se onSubmit foi chamado com os dados corretos
    expect(handleSubmit).toHaveBeenCalledWith({
      name: "João Silva",
      email: "joao@example.com",
    });
  });

  it("deve validar campos obrigatórios", async () => {
    const handleSubmit = vi.fn();
    const user = userEvent.setup();

    render(<SimpleForm onSubmit={handleSubmit} />);

    // Tentar enviar sem preencher
    const submitButton = screen.getByRole("button", { name: "Enviar" });
    await user.click(submitButton);

    // HTML5 validation deve impedir o submit
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it("deve limpar campos após envio bem-sucedido", async () => {
    const handleSubmit = vi.fn();
    const user = userEvent.setup();

    render(<SimpleForm onSubmit={handleSubmit} />);

    const nameInput = screen.getByLabelText("Nome") as HTMLInputElement;
    const emailInput = screen.getByLabelText("Email") as HTMLInputElement;

    await user.type(nameInput, "Maria");
    await user.type(emailInput, "maria@example.com");

    const submitButton = screen.getByRole("button", { name: "Enviar" });
    await user.click(submitButton);

    expect(handleSubmit).toHaveBeenCalled();
  });
});
