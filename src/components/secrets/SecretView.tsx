import React from 'react';
import { DeleteSecret } from './DeleteSecret';
import { UpdateSecret } from './UpdateSecret';
import styles from './SecretView.module.scss';
import { GlobalSecret, Secret } from './secret';

export function SecretView({
  secret,
  onUpdated,
  onDeleted,
}: {
  secret: Secret | GlobalSecret;
  onUpdated?: (secret: Secret) => void;
  onDeleted?;
}) {
  return (
    <li className={styles.secret}>
      <strong className={styles.name}>{secret.name}</strong>
      <div className="d-flex align-items-center">
        {secret.protectedBranchesOnly && <span className="badge badge-danger text-light">protected branches</span>}
        {secret.branches && secret.branches.length !== 0 && (
          <div className="secret-branches d-flex align-items-center">
            {secret.branches.map((pattern, index) => (
              <span className="badge badge-success text-light" key={index}>
                {pattern}
              </span>
            ))}
          </div>
        )}
        <div className="ml-3">
          {(secret as Secret)._id ? (
            <>
              <UpdateSecret secret={secret as Secret} onUpdated={onUpdated} />
              <DeleteSecret secretId={(secret as Secret)._id} repoId={(secret as Secret).repoId} onDeleted={onDeleted} />
            </>
          ) : (
            <>
              <span className="badge badge-primary">global</span>
            </>
          )}
        </div>
      </div>
    </li>
  );
}
