// Copyright (c) 2023 Stuart Thomson.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import clsx from "clsx";
import { PropsWithChildren, ReactNode } from "react";

export interface CardProps extends PropsWithChildren {
  className?: string;
  header?: ReactNode;
  footer?: ReactNode;
}

export function Card({ className, header, footer, children }: CardProps) {
  return (
    <div
      className={clsx(
        className,
        "rounded-xl border border-neutral-400 bg-neutral-100 p-4 dark:border-neutral-800 dark:bg-neutral-900",
      )}
    >
      {header && <div className="pb-4">{header}</div>}
      {children}
      {footer && <div className="pt-4">{footer}</div>}
    </div>
  );
}
