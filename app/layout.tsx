// app/layout.tsx
import Header from "./components/header";
import "./styles/globals.css";
import { Toaster } from "react-hot-toast";
// import Providers from "./components/Providers.tsx"; // Import the Providers component
// import LoginModal from "./components/LoginModal";

// Define metadata
export const metadata = {
  title: "Safaris-Center",
  description: "Safaris-Center est une application web permettant d'enregistrer les utilisateurs et de gérer la comptabilité des services proposés.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="icon" href="/safaris-center-icon.ico" />
      </head>
      <body>
        {/* Wrap your app with the Providers component */}
        {/* <Providers> */}
          <Toaster />
          <Header />
          <main className="mx-auto p-4">{children}</main>
          {/* <LoginModal /> */}
        {/* </Providers> */}
      </body>
    </html>
  );
}