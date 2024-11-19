import { HomeServisex } from "@/components";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <div className="grow flex flex-col">
        <HomeServisex />
      </div>
    </main>
  );
}
