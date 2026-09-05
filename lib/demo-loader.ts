import { cache } from "react";
import { getDemo } from "@/lib/db";

/**
 * One database read per request, shared by the layout and the page beneath
 * it. React's `cache` dedupes them for the life of the request.
 */
export const loadDemo = cache(getDemo);
