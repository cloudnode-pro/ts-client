import fs from "node:fs/promises";
import path from "node:path";
import {Config} from "./Config";
import {minify} from "terser";
import assert from "assert";

// create a browser-compatible SDK
export async function createBrowserSDK(config: Config): Promise<void> {
    const mainJs = await fs.readFile(path.join("src", config.name + ".js"), "utf-8");
    // remove imports at beginning of file and export default at end of file
    const browserJs = mainJs.replace(/^import.*$/gm, "").replace(/^export default \w+;$/gm, "");
    // evaluate the code to verify it works
    const fetch = () => {};
    eval(browserJs);
    // create folder `/browser` if it doesn't exist
    try {
        await fs.mkdir("browser");
    }
    catch (e) {}
    // write the file
    await fs.writeFile(path.join("browser", config.name + ".js"), browserJs);
    // create minified version
    const minified = await minify(browserJs);
    assert(minified.code !== undefined);
    await fs.writeFile(path.join("browser", config.name + ".min.js"), minified.code);
}
