import readline from "readline";
import { evaluateArgument } from "./arguments.js";
import { applyStyles } from "./styles.js";
import { solveCode } from "./code.js";

export function tag(process, hierarchy) {
  const prefix = createPrefix(hierarchy);

  signalStart(prefix, hierarchy);
  if (process.stdout) signalLine(prefix, process.stdout);
  if (process.stderr) signalLine(prefix, process.stderr);
  signalCLose(prefix, process);
}

function createPrefix(hierarchy) {
  const length = evaluateArgument("length");

  return hierarchy.reduce((formattedHierarchyNames, script) => {
    const { name, styles } = script;
    const tagText = name
      ? assureLength(name, length)
      : createRandomTagText(length);
    const formattedScriptName = applyStyles(`[${tagText}]`, styles);
    return `${formattedHierarchyNames}${formattedScriptName}`;
  }, "");
}

function signalStart(prefix, hierarchy) {
  const script = hierarchy[hierarchy.length - 1];
  console.info(`${prefix} starting: ${script.command}`);
}

function signalLine(prefix, stream) {
  const rl = readline.createInterface({
    input: stream,
    terminal: false,
  });
  rl.on("line", (line) => console.info(`${prefix} ${line}`));
}

function signalCLose(prefix, process) {
  process.on("close", (rawCode) => {
    const code = solveCode(rawCode);
    console.info(`${prefix} exited with code ${code}`);
  });
}

function assureLength(str, length) {
  if (!length) return str;
  return str.padEnd(length, " ").slice(0, length);
}

function createRandomTagText(length = 5) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const pick = () => chars.charAt(Math.floor(Math.random() * chars.length));

  const filled = Array(length).fill(null);
  return filled.reduce((acc) => acc + pick(), "");
}
