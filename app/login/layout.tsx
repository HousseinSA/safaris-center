
export default function Layout({
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
          <main className="mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}