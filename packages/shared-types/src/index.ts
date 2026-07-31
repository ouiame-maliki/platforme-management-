export * from "./schemas";
export * from "./types";

import * as schemas from "./schemas";
import * as types from "./types";

export default {
    ...schemas,
    ...types,
};