import fs from "node:fs/promises";

/**
 * This script returns the name of the main class
 */
console.log((JSON.parse(await fs.readFile("gen/config.json", "utf8"))).name);
