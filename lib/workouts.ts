import {env} from "cloudflare:workers";
export function workoutDb(){if(!env.DB)throw Error("Database unavailable");return env.DB;}
