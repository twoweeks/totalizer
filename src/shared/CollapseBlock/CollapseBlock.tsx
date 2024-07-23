import { FunctionComponent, ComponentChildren, VNode } from "preact";
import { useState } from "preact/hooks";

import clsx from "clsx";

import styles from "./CollapseBlock.module.scss";

type CollapseBlockProps = {
  baseClassName?: string;
  headerClassName?: string;
  headerContentClassName?: string;
  buttonClassName?: string;
  contentClassName?: string;
  headerContent?: VNode | VNode[];
  openByDefault?: boolean;
  children?: ComponentChildren;
};

export const CollapseBlock: FunctionComponent<CollapseBlockProps> = ({
  baseClassName,
  headerClassName,
  headerContentClassName,
  buttonClassName,
  contentClassName,
  headerContent,
  openByDefault = false,
  children,
}) => {
  const [open, setOpen] = useState(openByDefault);

  return (
    <div className={clsx(styles.collapseBlock, baseClassName)}>
      <div className={clsx(styles.collapseBlock__header, headerClassName)}>
        <div
          className={clsx(
            styles.collapseBlock__header__content,
            headerContentClassName,
          )}
        >
          {headerContent}
        </div>

        <button
          className={clsx(styles.collapseBlock__button, buttonClassName)}
          onClick={() => setOpen(!open)}
        >
          {open ? "︿" : "﹀"}
        </button>
      </div>

      <div
        className={clsx(
          styles.collapseBlock__content,
          open ? "" : styles["collapseBlock__content--hidden"],
          contentClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
};
