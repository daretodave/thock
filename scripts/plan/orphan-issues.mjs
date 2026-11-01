// scripts/plan/orphan-issues.mjs: mirrored finding issues with no row left in the plan.
//
// /iterate Step 2.5 mirrors a picked finding to GitHub (labels loop:opened + source:<x>) and records `- issue: #N` on
// its AUDIT.md / CRITIQUE.md row. If the tick ends before that row is written, or a rewrite drops it, the issue stays
// open but no audit ever sees it again (/iterate reads the plan files, not the issue list). This lists those orphans
// so /iterate Step 1.5 can backfill a Pending row for each before picking work.
//
// An issue is a mirror when it carries `loop:opened` and a `source:*` label (spec issues and lock asks carry
// loop:opened without a source label and are not findings). It is referenced when `#N` appears anywhere in
// plan/AUDIT.md or plan/CRITIQUE.md.
//
//   node scripts/plan/orphan-issues.mjs [--json]
//
// Prints one `orphan #N [severity] <title>` line per orphan, then `clean` or a count. Exit 0; 3 when gh can't be
// read (best-effort: the calling tick continues).
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';

export const PLAN_FILES = ['plan/AUDIT.md', 'plan/CRITIQUE.md'];

export function isMirror(issue) {
  const names = (issue.labels ?? []).map((l) => (typeof l === 'string' ? l : l.name));
  return names.includes('loop:opened') && names.some((n) => n.startsWith('source:'));
}

export function severityOf(issue) {
  const names = (issue.labels ?? []).map((l) => (typeof l === 'string' ? l : l.name));
  const sev = names.find((n) => n.startsWith('severity:'));
  return sev ? sev.slice('severity:'.length) : 'unknown';
}

export function findOrphans(issues, planText) {
  return issues
    .filter(isMirror)
    .filter((issue) => !new RegExp(String.raw`#${issue.number}(?!\d)`).test(planText))
    .map((issue) => ({ number: issue.number, title: issue.title, severity: severityOf(issue) }))
    .sort((a, b) => a.number - b.number);
}

function listIssues() {
  const out = execFileSync(
    'gh',
    ['issue', 'list', '--state', 'open', '--label', 'loop:opened', '--limit', '200', '--json', 'number,title,labels'],
    { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] },
  );
  return JSON.parse(out);
}

function main(argv) {
  const json = argv.includes('--json');
  let issues;
  try {
    issues = listIssues();
  } catch (err) {
    process.stderr.write(`orphan-issues: gh unreadable (${err.message.split('\n')[0]})\n`);
    return 3;
  }
  const planText = PLAN_FILES.filter((f) => fs.existsSync(f))
    .map((f) => fs.readFileSync(f, 'utf8'))
    .join('\n');
  const orphans = findOrphans(issues, planText);
  if (json) {
    process.stdout.write(`${JSON.stringify(orphans, null, 2)}\n`);
    return 0;
  }
  for (const o of orphans) process.stdout.write(`orphan #${o.number} [${o.severity}] ${o.title}\n`);
  process.stdout.write(orphans.length ? `${orphans.length} orphaned\n` : 'clean\n');
  return 0;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  process.exit(main(process.argv.slice(2)));
}
