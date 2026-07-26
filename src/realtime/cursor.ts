export interface CursorPosition {
  from: number;
  to: number;
}

export interface CursorData {
  userId: string;
  name: string;
  color: string;
  position: CursorPosition | null;
}

export interface TypingUser {
  userId: string;
  name: string;
  color: string;
}
