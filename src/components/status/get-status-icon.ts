import {
  faBan,
  faBars,
  faCheck,
  faExclamationTriangle,
  faFastForward,
  faQuestion,
  faRocket,
  faSpinner,
  faTimes,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { PipelineJobStatus, PipelineStatus } from '../pipelines/types/pipeline';

export function getStatusIcon(status: PipelineStatus | PipelineJobStatus | string): { icon: IconDefinition; spin?: boolean } {
  switch (status) {
    case 'success':
      return { icon: faCheck };
    case 'failure':
      return { icon: faTimes };
    case 'partial':
      return { icon: faExclamationTriangle };
    case 'running':
      return { icon: faSpinner, spin: true };
    case 'created':
      return { icon: faBars };
    case 'cancelled':
      return { icon: faBan };
    case 'skipped':
      return { icon: faFastForward };
    case 'unknown':
      return { icon: faQuestion };
    default:
      return { icon: faRocket };
  }
}
