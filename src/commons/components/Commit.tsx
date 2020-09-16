import React from 'react';
import { CommitLink } from '../../components/repos/CommitLink';

interface Commit {
  author: string;
  url: string;
  branch: string;
  sha: string;
}

export function Commit({ commit, useLink }: { commit: Commit; useLink?: boolean }) {
  return (
    <small className="text-muted">
      <strong>{commit.author}</strong>
      {' '}
      pushed
      <CommitLink sha={commit.sha} url={commit.url} useLink={false} />
      to
      {' '}
      <strong>{commit.branch}</strong>
    </small>
  );
}
