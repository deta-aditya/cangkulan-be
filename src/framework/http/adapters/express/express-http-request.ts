import type { Request } from "npm:@types/express@4.17.17";
import type { HttpRequest } from "@/framework/http.ts";
import type { Json } from "@/core/common/json.ts";
import { Option } from "@/core/common/option.ts";

export class ExpressHttpRequest implements HttpRequest {
  constructor(private expressRequest: Request) {}

  body(): Json {
    return this.expressRequest.body;
  }

  params(key: string): Option<string> {
    return Option.fromNullable(this.expressRequest.params[key]);
  }

  query(): Record<string, string> {
    return Object.fromEntries(
      Object.entries(this.expressRequest.query)
        .map(([key, value]) => [key, String(value)]),
    );
  }
}
