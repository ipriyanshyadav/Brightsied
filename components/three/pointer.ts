// Latest pointer position in viewport px, shared by every live tile. Written by one window
// listener (installed by LiveLayer), read inside frame loops; never React state.
export const pointer = { x: 0, y: 0, active: false };

export function trackPointer() {
  const onMove = (e: PointerEvent) => {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    pointer.active = true;
  };
  const onLeave = () => {
    pointer.active = false;
  };
  window.addEventListener("pointermove", onMove, { passive: true });
  document.documentElement.addEventListener("pointerleave", onLeave);
  return () => {
    window.removeEventListener("pointermove", onMove);
    document.documentElement.removeEventListener("pointerleave", onLeave);
  };
}
