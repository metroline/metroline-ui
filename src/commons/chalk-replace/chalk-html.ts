import AnsiUp from 'ansi_up';

const ansiUp = new AnsiUp();

export function chalkHtml(str: string): string | undefined {
  if (!str) {
    return undefined;
  }
  let replaced = str;
  replaced = ansiUp.ansi_to_html(replaced);
  replaced = replaced.replace(/\n/g, '<br/>');
  return replaced;
}
