"use client";

import Image from "next/image";
import { useCallback, useRef } from "react";
import { delay } from "../../../lib/utils";

import styles from "./Goose.module.css";
import goose from "./goose.png";

const TOOLTIP_TIMEOUT = 3000;
const TRANSITION_DURATION = 200;
const SCALE_SCALE = 100;
const HEARTS = ["❤️", "🧡", "💛", "💚", "💙", "💜"];

export function Goose() {
  const ref = useRef<HTMLButtonElement>(null);
  const settingsRef = useRef({ current: 0, count: 0 });

  const onClick = useCallback(async () => {
    const parent = ref.current;
    const settings = settingsRef.current;
    if (!parent) {
      return;
    }

    const heart = document.createElement("div");
    heart.classList.add(styles["goose-heart"]!);
    settings.current = (settings.current - 1 + HEARTS.length) % HEARTS.length;
    heart.textContent = HEARTS[settings.current]!;
    heart.ariaHidden = "true";

    const translateX = Math.floor(Math.random() * 100);
    const translateY = Math.floor(Math.random() * 10);
    heart.style.left = `${translateX}%`;
    heart.style.transform = `translateX(-${translateX}%) translateY(${translateY}px) scale(${
      (settings.count + SCALE_SCALE) / SCALE_SCALE
    })`;

    parent.appendChild(heart);
    // eslint-disable-next-line no-plusplus
    settings.count++;

    if (
      typeof umami !== "undefined" &&
      (settings.count === 1 ||
        settings.count === 5 ||
        settings.count % 10 === 0)
    ) {
      umami.trackEvent("goose", { count: settings.count });
    }

    await delay(TOOLTIP_TIMEOUT);
    heart.classList.add(styles["goose-heart-exit"]!);

    await delay(TRANSITION_DURATION);
    parent.removeChild(heart);
  }, []);

  return (
    <button
      id="goose"
      className={styles.button}
      aria-label="Goose"
      onClick={onClick}
      ref={ref}
    >
      <Image src={goose} alt="" width={48} height={48} loading="eager" />
    </button>
  );
}
