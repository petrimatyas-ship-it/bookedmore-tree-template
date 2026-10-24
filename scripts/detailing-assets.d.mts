export function resolveAssets<T extends Record<string, unknown>>(data: T): T & { asset: { icon: string; icon96: string } };
