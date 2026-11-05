export function catalogMode(value: string | undefined): "demo" | "database" {
  const mode = value || "demo";
  if (mode !== "demo" && mode !== "database") {
    throw new Error("CATALOG_SOURCE must be demo or database.");
  }
  return mode;
}
