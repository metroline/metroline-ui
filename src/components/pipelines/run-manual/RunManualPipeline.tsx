import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast } from 'react-toastify';
import { faPlay, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Tooltip, tooltipToggle } from '../../../commons/components/Tooltip';
import { RunManualPipelineModal } from './RunManualPipelineModal';
import { axios } from '../../../providers/axios';
import { useEnv } from '../../../providers/EnvProvider';
import { dropdownToggle } from '../../../commons/components/dropdown/Dropdown';
import { routerHistory } from '../../../providers/history';

export function RunManualPipeline({ repoId }: { repoId: string }) {
  const [selectedBranch, setSelectedBranch] = useState<any>();
  const [loading, setLoading] = useState(false);
  const env = useEnv();

  useEffect(() => {
    if (selectedBranch) {
      setLoading(true);
      axios
        .post(`${env.METROLINE_SERVER_URL}/api/v1/repos/${repoId}/pipelines`, { name: selectedBranch.name })
        .then(res => routerHistory.push(`/repos/${repoId}/pipelines/${res.data._id}`))
        .catch(err => toast(`Could not run pipeline: ${err}`, { type: 'error' }))
        .finally(() => setLoading(false));
    }
  }, [env, selectedBranch, repoId]);

  const dropdownId = `run-manual-pipeline-dropdown-${repoId}`;
  const tooltipId = `run-manual-pipeline-tooltip-${repoId}`;
  return (
    <>
      {!loading ? (
        <FontAwesomeIcon icon={faPlay} className="btn-icon" {...dropdownToggle(dropdownId)} />
      ) : (
        <FontAwesomeIcon icon={faSpinner} spin className="btn-icon text-muted" {...tooltipToggle(tooltipId)} />
      )}
      <Tooltip id={`run-manual-pipeline-tooltip-${repoId}`}>Run manual pipeline</Tooltip>
      {!loading && <RunManualPipelineModal repoId={repoId} id={dropdownId} onBranchClick={setSelectedBranch} />}
    </>
  );
}
