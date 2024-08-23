import { ReactNode } from "react";
import { BaseHeader } from "@/components";

interface Props {
  children: ReactNode;
}

const BaseLayout = ({ children }: Props) => {
  return (
    <>
      <BaseHeader />
      <main className="base-layout flex flex-col min-h-screen">
        <div className="flex flex-col grow">{children}</div>
      </main>
      {/* <Footer /> */}
    </>
  );
};

export default BaseLayout;
