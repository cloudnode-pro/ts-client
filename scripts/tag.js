import {Listr} from "listr2";
import inquirer from "listr-inquirer";
import asyncExec from "./util/asyncExec.js";
import fs from "node:fs/promises";

const tasks = new Listr([
    {
        title: "Check current branch",
        retry: 1,
        task: async (ctx, task) => {
            const defaultBranch = (await asyncExec("git symbolic-ref refs/remotes/origin/HEAD | sed 's@^refs/remotes/origin/@@'")).trim();
            const branch = (await asyncExec("git branch --show-current")).trim();
            if (branch !== defaultBranch) {
                return inquirer([
                    {
                        type: "confirm",
                        name: "switchBranch",
                        message: `Switch to ${defaultBranch}?`,
                    }
                ], async answers => {
                    if (answers.switchBranch) {
                        await asyncExec(`git checkout ${defaultBranch}`);
                        throw new Error("Branch switched. Will retry.");
                    }
                })
            }
        }
    },
    {
        title: "Ask for new version",
        task: async (ctx, task) => inquirer([
            {
                type: "input",
                name: "version",
                message: "New version:",
                validate: i => i.match(/^\d+\.\d+\.\d+(-\w+)?$/) ? true : "Version must be in the format major.minor.patch[-label]"
            }
        ], answers => {
            ctx.version = answers.version;
        })
    },
    {
        title: "Set version",
        task: async ctx => {
            const packageJson = JSON.parse(await fs.readFile("package.json", "utf-8"));
            packageJson.version = ctx.version;
            await fs.writeFile("package.json", JSON.stringify(packageJson, null, 2) + "\n");
            // update package-lock.json
            await asyncExec("npm install");
        }
    },/*
    {
        title: "Update readme",
        task: async () => {
            await asyncExec("npm run readme");
        }
    },*/
    {
        title: "Commit changes",
        task: async ctx => {
            await asyncExec("git reset");
            //await asyncExec("git add README.md package.json package-lock.json");
            await asyncExec("git add package.json package-lock.json");
            await asyncExec(`git commit -m "${ctx.version}"`);
        }
    },
    {
        title: "Create tag",
        task: async ctx => {
            await asyncExec(`git tag -s v${ctx.version} -m "v${ctx.version}"`);
        }
    },
    {
        title: "Ask to push",
        task: async () => inquirer([
            {
                type: "confirm",
                name: "push",
                message: "Push commit and tag to remote?",
            }
        ], answers => {
            if (answers.push) {
                asyncExec("git push");
                asyncExec("git push --tags");
            }
        })
    }
]);

tasks.run().catch(console.error);
