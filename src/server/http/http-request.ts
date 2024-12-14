import type { Json } from "@/core/common/json.ts";
import type { Option } from "@/core/common/option.ts";

export interface HttpRequest {
  body(): Json;
  params(key: string): Option<string>;
  query(): Record<string, string>;
}
