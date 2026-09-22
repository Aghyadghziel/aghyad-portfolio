import 'server-only';
import { requireAdmin } from './auth';
import { ensureSchema, requireDb } from './db';

export const MESSAGE_STATUSES = ['new', 'read', 'replied', 'archived'] as const;
export type MessageStatus = (typeof MESSAGE_STATUSES)[number];

export type NewMessage = {
  name: string;
  email: string;
  subject: string | null;
  message: string;
  sessionId: string | null;
  entryPath: string | null;
  ipHash: string | null;
  country: string | null;
  city: string | null;
};

/** Stored before the email is sent, so a failed send never loses a message. */
export async function saveMessage(input: NewMessage) {
  await ensureSchema();
  const sql = requireDb();
  const rows = (await sql`
    insert into messages (name, email, subject, message, session_id, entry_path, ip_hash, country, city)
    values (${input.name}, ${input.email}, ${input.subject}, ${input.message}, ${input.sessionId}, ${input.entryPath},
            ${input.ipHash}, ${input.country}, ${input.city})
    returning id`) as { id: number }[];
  return rows[0].id;
}

export async function markMessageEmailed(id: number) {
  const sql = requireDb();
  await sql`update messages set emailed = true where id = ${id}`;
}

export async function listMessages() {
  await requireAdmin();
  await ensureSchema();
  const sql = requireDb();
  return (await sql`
    select id, created_at, name, email, subject, message, status, emailed, country, city, session_id
    from messages order by created_at desc limit 200`) as Record<string, unknown>[];
}

export async function setMessageStatus(id: number, status: MessageStatus) {
  await requireAdmin();
  const sql = requireDb();
  await sql`update messages set status = ${status} where id = ${id}`;
}

export async function deleteMessage(id: number) {
  await requireAdmin();
  const sql = requireDb();
  await sql`delete from messages where id = ${id}`;
}
