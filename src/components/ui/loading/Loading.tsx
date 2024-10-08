import cn from "clsx";

import styles from "./styles.module.css";

interface Props {
  className?: string;
}

export const Loading = ({ className }: Props): JSX.Element => {
  const classList = cn(styles.root, className);
  return <div className={classList}></div>;
};
