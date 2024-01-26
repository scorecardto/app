export let reloadApp: () => void = () => {};

export function setReloadApp(fn: () => void) {
  reloadApp = fn;
}