import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { UserInfo } from './auth/UserInfo';
import { Dropdown, dropdownToggle } from '../commons/components/dropdown/Dropdown';
import { DropdownLink } from '../commons/components/dropdown/DropdownLink';
import DropdownSeparator from '../commons/components/dropdown/DropdownSeparator';
import { useAuth } from '../providers/AuthProvider';
import { SyncRepos } from './repos/SyncRepos';
import styles from './Header.module.scss';
import { RepoSearch } from './repos/search/RepoSearch';
import { Logo } from './Logo';
import { SignIn } from './auth/SignIn';
import { Loader } from '../commons/components/Loader';
import RepoIcon from './icons/RepoIcon';

export function Header() {
  const { signOut, user } = useAuth();
  return (
    <header className={`${styles.header} d-flex align-items-center justify-content-between pt-2 pb-2`}>
      <Link to="/">
        <Logo />
      </Link>

      <div className="pl-3 pr-3 d-flex justify-content-center flex-grow-1" />

      <div className="d-flex align-items-center">
        <div className="mr-3 d-flex align-items-center">
          <RepoSearch />
        </div>
        {user === undefined ? (
          <Loader />
        ) : user === null ? (
          <>
            <SignIn />
          </>
        ) : (
          <>
            <div className="mr-3 d-flex align-items-center">
              <SyncRepos />
            </div>
            <UserInfo {...dropdownToggle('main-menu')} className="cursor-pointer" />
            <Dropdown id="main-menu" data-event-off="click">
              <DropdownLink to="/" icon={<RepoIcon />}>
                Repos
              </DropdownLink>
              <DropdownSeparator />
              <DropdownLink icon={<FontAwesomeIcon icon={faSignOutAlt} />} onClick={signOut}>
                Sign out
              </DropdownLink>
            </Dropdown>
          </>
        )}
      </div>
    </header>
  );
}
