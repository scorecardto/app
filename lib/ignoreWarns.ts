import { LogBox } from 'react-native';

const blocking: (string|RegExp)[] = [];

const trueWarn = console.warn;
console.warn = (message: string, ...args) => {
    if (blocking.some((pattern) => message.match(pattern))) return;

    trueWarn(message, ...args);
};


export default function ignoreWarns(patterns: (string|RegExp)[]) {
    blocking.push(...patterns);
}