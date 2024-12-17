import { Suspense } from "react";

import { LoadingServisex, Thanks } from "@/components";
import { BaseLayout } from "@/layouts/BaseLayout";

const ThanksPage = () => {
  return (
    <BaseLayout>
      <Suspense fallback={<LoadingServisex />}>
        <Thanks />
      </Suspense>
    </BaseLayout>
  );
};

export default ThanksPage;
