// app/layout.tsx
import Header from "./components/header";
import "./styles/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="container mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}