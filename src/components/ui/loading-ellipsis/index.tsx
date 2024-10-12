import React from "react";

import styles from "./styles.module.css";

interface Props {
  text?: string;
}

export const LoadingEllipsis: React.FC<Props> = ({ text }) => {
  return (
    <div className="flex">
      <span>Грузим {text}</span>
      <DotsAnimation />
    </div>
  );
};

const DotsAnimation = () => {
  return (
    <>
      <span className={styles.dot1}>.</span>
      <span className={styles.dot2}>.</span>
      <span className={styles.dot3}>.</span>
    </>
  );
};
