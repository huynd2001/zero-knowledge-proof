export function p2s(point: Point): string {
  if (point === "identity") {
    return "Inf";
  }

  return `(${point.x}, ${point.y})`;
}
