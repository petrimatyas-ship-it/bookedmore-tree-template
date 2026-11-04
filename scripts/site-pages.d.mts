export function withView<T extends Record<string, unknown>>(data: T, path?: string): (T & { view: Record<string, unknown> }) | null;
export function sitePaths(data: Record<string, unknown>): string[];
