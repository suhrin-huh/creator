/** Server Action 응답 타입 */
export type ActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};
