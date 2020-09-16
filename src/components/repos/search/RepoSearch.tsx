import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { Tooltip, tooltipToggle } from '../../../commons/components/Tooltip';
import { RepoSearchModal } from './RepoSearchModal';

export function RepoSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <>
      <FontAwesomeIcon icon={faSearch} className="btn-icon" {...tooltipToggle('search-repos-tooltip')} onClick={openModal} />
      <Tooltip id="search-repos-tooltip">Search repos</Tooltip>
      <RepoSearchModal isOpen={isOpen} closeModal={closeModal} />
    </>
  );
}
