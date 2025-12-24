import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function safePromise<T, E = any>(
  promise: () => Promise<T>,
  onFail?: (err: Error) => E,
  onFinally?: () => void,
): Promise<[T, undefined] | [undefined, E | Error]> {
  try {
    const data = await promise();
    return [data, undefined] as [T, undefined];
  } catch (error) {
    if (onFail) {
      const errorData = onFail(error as Error);
      return [undefined, errorData] as [undefined, E];
    }
    return [undefined, error as Error] as [undefined, Error];
  } finally {
    if (onFinally) onFinally();
  }
}
