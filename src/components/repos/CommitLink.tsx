import React from 'react';

export function CommitLink({ sha, url, useLink }: { sha; url; useLink?: boolean }) {
  const inner = <code>{sha.substr(0, 8)}</code>;

  return useLink ? (
    <a href={url} target="_blank" rel="noopener noreferrer" className="ml-1 mr-1 d-inline-block" onClick={e => e.stopPropagation()}>
      {inner}
    </a>
  ) : (
    <span
      className="link ml-1 mr-1 d-inline-block"
      onClick={e => {
        e.stopPropagation();
        e.preventDefault();
        window.open(url, '_blank');
      }}
    >
      {inner}
    </span>
  );
}
