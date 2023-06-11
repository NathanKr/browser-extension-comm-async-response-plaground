export default interface IRunOnTabReady {
  tabId: number;
  onComplete: (value: unknown) => void;
  message: unknown;
}