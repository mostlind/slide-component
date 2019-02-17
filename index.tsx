import React, {
  useRef,
  ReactElement,
  Children,
  useLayoutEffect,
  useState
} from "react";

const getTrueHeight = (element: HTMLElement) => {
  let paddingTopSet = false;
  let paddingBottomSet = false;
  let height = null;

  const style = getComputedStyle(element);

  if (parseInt(style.paddingTop || "0") === 0) {
    element.style.paddingTop = "1px";
    paddingTopSet = true;
  }

  if (parseInt(style.paddingBottom || "0") === 0) {
    element.style.paddingBottom = "1px";
    paddingBottomSet = true;
  }
  height = element.getBoundingClientRect().height;

  if (paddingBottomSet) element.style.paddingBottom = "";
  if (paddingTopSet) element.style.paddingTop = "";

  return height;
};

const schedule = (callback: () => void, delay = 0) => {
  const twoFrames = (1000 / 60) * 2;
  if (delay < twoFrames) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        callback();
      });
    });
  } else {
    setTimeout(callback, delay);
  }
};

interface CollapsibleProps {
  children: ReactElement;
  isOpen: boolean;
  animationLengthMs?: number;
  closeDelayMs?: number;
}

export function Collapsible({
  children,
  isOpen,
  animationLengthMs = 100,
  closeDelayMs = 0
}: CollapsibleProps) {
  // assert that Collapsible only has one child
  Children.only(children);

  const inner = useRef(null as HTMLElement | null);
  const outer = useRef(null as HTMLElement | null);
  const [height, setHeight] = useState(0 as number | string);

  useLayoutEffect(() => {
    if (inner.current === null || outer.current === null) {
      return;
    }

    const trueHeight = getTrueHeight(inner.current);

    if (isOpen) {
      schedule(() => setHeight(trueHeight));
      setTimeout(() => {
        setHeight("auto");
      }, animationLengthMs);
    } else {
      if (height === "auto") {
        setHeight(trueHeight);
      }
      schedule(() => setHeight(0), closeDelayMs);
    }
  }, [isOpen, inner, outer]);

  return (
    <div
      style={{
        overflowY: "hidden",
        transition: `height ${animationLengthMs}ms ease-out`,
        height
      }}
      ref={outer as any}
    >
      {React.cloneElement(children, { ref: inner })}
    </div>
  );
}
