export type Json = number | string | boolean | null | Json[] | {
  [key: string]: Json;
};
