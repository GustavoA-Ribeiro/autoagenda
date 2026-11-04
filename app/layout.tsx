import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AutoAgenda | Gestão de agendamentos automotivos",
  description: "Organize os serviços, clientes e horários do seu negócio automotivo.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
