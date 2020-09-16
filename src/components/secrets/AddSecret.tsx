import { Controller, useForm } from 'react-hook-form';
import React, { useState } from 'react';
import { useEnv } from '../../providers/EnvProvider';
import { axios } from '../../providers/axios';
import { required } from '../../commons/components/forms/form-constants';
import { AlertError } from '../../commons/components/AlertError';
import { Button } from '../../commons/components/Button';
import { InputError } from '../../commons/components/forms/InputError';
import { Toggle } from '../../commons/components/forms/Toggle';
import { Secret } from './secret';
import { splitSecretBranches } from './split-secret-branches';

export function AddSecret({ repoId, onAdded }: { repoId: string; onAdded: (secret: Secret) => void }) {
  const { register, handleSubmit, reset, errors, control } = useForm({ mode: 'onChange' });
  const env = useEnv();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const [nameInputRef, setNameInputRef] = useState<HTMLInputElement>();

  const submit = data => {
    setLoading(true);
    setError(undefined);
    const secretBody = {
      ...data,
      branches: splitSecretBranches(data.branches),
    };
    axios
      .post(`${env.METROLINE_SERVER_URL}/api/v1/repos/${repoId}/secrets`, secretBody)
      .then(res => onAdded(res.data))
      .then(() => {
        reset();
        nameInputRef.focus();
      })
      .catch(setError)
      .finally(() => setLoading(false));
  };

  return (
    <form onSubmit={handleSubmit(submit)}>
      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          className="form-control"
          id="name"
          name="name"
          placeholder="MY_SECRET"
          ref={ref => {
            setNameInputRef(ref);
            register({ required })(ref);
          }}
        />
        <InputError error={errors?.name} />
      </div>
      <div className="form-group">
        <label htmlFor="value">Value</label>
        <textarea className="form-control" autoComplete="off" id="value" name="value" rows={5} ref={register({ required })} />
        <InputError error={errors?.value} />
      </div>
      <div className="form-group">
        <Controller
          control={control}
          name="protectedBranchesOnly"
          defaultValue={false}
          as={<Toggle togglePosition="left">Protected branches only</Toggle>}
        />
        <InputError error={errors?.protectedBranchesOnly} />
      </div>
      <div className="form-group">
        <label htmlFor="branches">Branches</label>
        <input type="text" className="form-control" id="branches" name="branches" placeholder="master,preview/.*" ref={register()} />
        <small className="form-text">
          Comma-separated list of branches to which this secret should be restricted. Each item is a Javascript regex.
        </small>
        <InputError error={errors?.branches} />
      </div>
      {error && <AlertError error={error} className="mt-4" />}
      <div className="mt-4">
        <Button type="submit" loading={loading}>
          Save
        </Button>
      </div>
    </form>
  );
}
