"use client";

import { useState, useRef } from "react";
import {
  NotificationIconButton,
  NotificationFeedPopover,
} from "@knocklabs/react";

export default function NotifyBtn() {
  const [isVisible, setIsVisible] = useState(false);
  
  // Specifică tipul corect pentru NotificationIconButton
  const notifButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <div>
      <NotificationIconButton
        ref={notifButtonRef}
        onClick={() => setIsVisible(!isVisible)}
      />
      <NotificationFeedPopover
        // Convertește tipul de referință în mod sigur pentru NotificationFeedPopover
        // HTMLButtonElement extinde HTMLElement, deci această conversie este sigură
        buttonRef={notifButtonRef as unknown as React.RefObject<HTMLElement>}
        isVisible={isVisible}
        onClose={() => setIsVisible(false)}
      />
    </div>
  );
}