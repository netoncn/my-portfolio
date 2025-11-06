export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t py-8 px-4">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
        <p>
          © {currentYear} Nelson Christovam Neto. Todos os direitos reservados.
        </p>
        <p>Desenvolvido com Next.js e Firebase</p>
      </div>
    </footer>
  );
}
