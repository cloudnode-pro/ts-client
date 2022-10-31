import child_process from "node:child_process";

/**
 * Execute a command asynchronously
 * @param command
 */
export default function asyncExec(command) {
    return new Promise((resolve, reject) => {
        child_process.exec(command, (error, stdout) => {
            if (error) reject(error);
            else resolve(stdout);
        });
    });
}
