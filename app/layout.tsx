// app/layout.tsx
import Header from "./components/header";
import "./styles/globals.css";
import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
       <Toaster />
        <Header />
        <main className="container mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}