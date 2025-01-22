// app/components/Header.tsx
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

export default function Header() {
  return (
    <header className="bg-white shadow sticky top-0 left-0">
      <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center"> 
            <Link href="/">
              <div className="flex py-2 items-center">
                <Image
                  src="/safariscenter.png"
                  alt="safariscenter Logo"
                  width={80}
                  height={40}
                  className="rounded-full"
                />
              </div>
            </Link>
          </div>
          <Link href="/newclient">
            <Button className="bg-primary text-white hover:bg-primary-dark">
              Créer un client
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}