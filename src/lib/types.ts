export type BubbleData = {
  side: 'l' | 'r';
  text: string;
  error: boolean;
  hiddenText?: string;
}

export type LogData = {
  question: string;
  answer: string;
  reason: string;
}