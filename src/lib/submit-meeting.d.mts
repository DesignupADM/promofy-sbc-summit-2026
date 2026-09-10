export type MeetingConfig = { portalId?: string; formId?: string; endpoint?: string };
export function submitMeeting(values: Record<string, string>, config: MeetingConfig): Promise<void>;
