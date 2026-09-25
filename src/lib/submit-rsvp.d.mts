export type RsvpConfig = { portalId?: string; formId?: string; endpoint?: string };
export function submitRsvp(values: Record<string, string>, config: RsvpConfig): Promise<void>;
