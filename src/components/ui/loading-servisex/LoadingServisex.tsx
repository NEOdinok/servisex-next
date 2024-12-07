import React from "react";

import Image from "next/image";
import loading from "public/images/servisex-loading.gif";

export const LoadingServisex: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <Image src={loading} alt="Loading..." height={128} width={128} />
    </div>
  );
};
