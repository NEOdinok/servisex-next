import { useEffect, useState } from "react";

import { usePathname } from "next/navigation";

const useIntro = () => {
  const pathName = usePathname();
  const storage = typeof window !== "undefined" ? window.localStorage : null; // Only access `localStorage` if it's available in the browser
  const currTimestamp = Date.now();

  const storedTimestamp = storage ? parseInt(storage.getItem(`timestamp${pathName}`) || "0", 10) : 0;

  const timeLimit = 3 * 60 * 60 * 1000; // 3 hours
  const initialHasTimePassed = currTimestamp - storedTimestamp > timeLimit;

  const [hasTimePassed, setHasTimePassed] = useState(initialHasTimePassed);

  useEffect(() => {
    if (initialHasTimePassed && storage) {
      storage.setItem(`timestamp${pathName}`, currTimestamp.toString());
    }

    setHasTimePassed(initialHasTimePassed);
  }, [initialHasTimePassed, currTimestamp, storedTimestamp, storage, pathName]);

  return hasTimePassed;
};

export { useIntro };
