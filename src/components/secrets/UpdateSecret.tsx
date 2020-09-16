import { Controller, useForm } from 'react-hook-form';
import React, { useEffect, useState } from 'react';
import { useEnv } from '../../providers/EnvProvider';
import { axios } from '../../providers/axios';
import { required } from '../../commons/components/forms/form-constants';
import { AlertError } from '../../commons/components/AlertError';
import { Button } from '../../commons/components/Button';
import { InputError } from '../../commons/components/forms/InputError';
import { AppModal } from '../../commons/components/AppModal';
import { Toggle } from '../../commons/components/forms/Toggle';
import { Secret } from './secret';
import { splitSecretBranches } from './split-secret-branches';

function EditSecretForm({ secret, onUpdated }: { secret: Secret; onUpdated: (data: Secret) => void }) {
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
      .put(`${env.METROLINE_SERVER_URL}/api/v1/repos/${secret.repoId}/secrets/${secret._id}`, secretBody)
      .then(res => onUpdated(res.data))
      .then(() => {
        reset();
        nameInputRef.focus();
      })
      .catch(setError)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    reset({
      ...secret,
      branches: (secret.branches || []).join(','),
    });
  }, [secret, reset]);

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

// http://reactcommunity.org/react-modal/styles/
const customStyles = {
  content: {
    width: 'auto',
    minWidth: '800px',
  },
};

export function UpdateSecret({ secret, onUpdated }: { secret: Secret; onUpdated: (secret: Secret) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <>
      <button className="btn btn-primary btn-sm" type="button" onClick={openModal}>
        Edit
      </button>
      <AppModal open={isOpen} title="Edit secret" closeModal={closeModal} style={customStyles}>
        <EditSecretForm
          secret={secret}
          onUpdated={updatedSecret => {
            closeModal();
            onUpdated(updatedSecret);
          }}
        />
      </AppModal>
    </>
  );
}
