import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Button } from '../../commons/components/Button';
import { useEnv } from '../../providers/EnvProvider';
import { axios } from '../../providers/axios';
import { extractExrrorMessage } from '../../utils/extract-exrror-message';

export function CancelPipeline({ pipelineId, onCancelled }: { pipelineId: string; onCancelled: (date: Date) => void }) {
  const env = useEnv();
  const [loading, setLoading] = useState(false);

  const cancelPipeline = () => {
    setLoading(true);
    axios
      .post(`${env.METROLINE_SERVER_URL}/api/v1/pipelines/${pipelineId}/cancel`)
      .then(res => onCancelled(new Date(res.data)))
      .then(() => toast('Pipeline cancelled', { type: 'success' }))
      .catch(err => {
        console.error(err);
        toast(`Could not cancel pipeline: ${extractExrrorMessage(err)}`, { type: 'error' });
      })
      .finally(() => setLoading(false));
  };

  return (
    <Button type="button" onClick={cancelPipeline} loading={loading}>
      Cancel
    </Button>
  );
}
