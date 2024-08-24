import Image from "next/image";
import { Welcome } from "@/components";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <div className="grow flex flex-col">
        <Welcome />
      </div>
    </main>
  );
}
