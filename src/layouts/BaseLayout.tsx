import { ReactNode } from "react";
import { BaseFooter, BaseHeader } from "@/components";

interface Props {
  children: ReactNode;
}

const BaseLayout = ({ children }: Props) => {
  return (
    <div className="root flex flex-col min-h-screen">
      <BaseHeader />
      <div className="content flex flex-col grow">{children}</div>
      <BaseFooter />
    </div>
  );
};

export { BaseLayout };
