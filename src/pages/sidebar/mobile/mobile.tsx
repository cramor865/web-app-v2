import { CSSProperties } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { nonPermanentStorage } from 'src/core/storage/non-permanent';
import { useAuth } from 'src/hooks/use-auth';

import css from './mobile.module.scss';
import { AccountsModel } from './mobile.types';
import { Avatar } from '../../../components/atoms/avatar/avatar';
import { Button } from '../../../components/atoms/button/button';
import { ProfileView } from '../../../components/molecules/profile-view/profile-view';
import { identities } from '../../../core/api';
import { hapticsImpactLight } from '../../../core/haptic/haptic';
import { IdentityReq } from '../../../core/types';
import { printWhen } from '../../../core/utils';
import { RootState } from '../../../store';
import { setIdentityList } from '../../../store/reducers/identity.reducer';
import { visibility } from '../../../store/reducers/menu.reducer';
import { setIdentityHeader, logout } from '../sidebar.service';

export const Mobile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const identity = useSelector<RootState, IdentityReq>((state) => {
    return state.identity.entities.find((identity) => identity.current) as IdentityReq;
  });

  const avatarImg = identity?.meta?.avatar || identity?.meta?.image;
  const avatarType = identity?.type;

  const isVisible = useSelector<RootState, boolean>((state) => {
    return state.menu;
  });

  const accountList = useSelector<RootState, AccountsModel[]>((state) => {
    return state.identity.entities.map((item) => {
      return {
        name: item.meta.name,
        image: item.meta.image,
        avatar: item?.meta?.avatar,
        type: item.type,
        id: item.id,
        current: item.current,
      };
    });
  });

  const closeSidebar = () => {
    dispatch(visibility(false));
  };

  const switchAccount = async (id: string) => {
    hapticsImpactLight();
    await setIdentityHeader(id);
    identities()
      .then((resp) => dispatch(setIdentityList(resp)))
      .then(() => navigate('/jobs'))
      .then(closeSidebar);
  };

  const navigateToCreateOrg = () => {
    hapticsImpactLight();
    navigate(`/organization/create/intro`);
    closeSidebar();
  };

  function navigateToProfile() {
    hapticsImpactLight();
    if (identity.type === 'users') {
      navigate(`/profile/users/${identity.meta.username}/view`);
    } else {
      navigate(`/profile/organizations/${identity.meta.shortname}/view`);
    }
    closeSidebar();
  }

  function navigateToSignIn() {
    hapticsImpactLight();
    logout()
      .then(() => navigate('/sign-in'))
      .then(closeSidebar)
      .then(() => nonPermanentStorage.clear());
  }

  function sidebarStyles(isVisible: boolean): CSSProperties {
    if (isVisible) {
      return {
        transform: 'translateX(0%)',
      };
    }
    return {
      transform: 'translateX(-100%)',
    };
  }

  function bgStyles(isVisible: boolean): CSSProperties {
    if (isVisible) {
      return {
        opacity: 1,
        visibility: 'visible',
      };
    }
    return {
      opacity: 0,
      visibility: 'hidden',
      width: 0,
    };
  }

  function navigateToTeam() {
    hapticsImpactLight();
    navigate(`/team/${identity.id}`);
    closeSidebar();
  }

  function navigateToConnections() {
    hapticsImpactLight();
    navigate('/network/connections');
    closeSidebar();
  }

  function navigateToFollowing() {
    hapticsImpactLight();
    navigate('/network/followings');
    closeSidebar();
  }

  function navigateToCreatedJobs() {
    hapticsImpactLight();
    navigate(`/jobs/created/${identity.id}`);
    closeSidebar();
  }

  const navigateToRoute = (route: string) => {
    hapticsImpactLight();
    navigate(`../${route}`);
    closeSidebar();
  };

  function navigateToAppliedApplications() {
    hapticsImpactLight();
    navigate(`/jobs/applied/${identity.id}`);
    closeSidebar();
  }

  const networkOrgJSX = (
    <>
      <div onClick={navigateToConnections} className={css.row}>
        <img src="/icons/connection.svg" />
        <span>Connections</span>
      </div>
      <div onClick={navigateToFollowing} className={css.row}>
        <img src="/icons/followers.svg" />
        <span>Following</span>
      </div>
      <div onClick={navigateToTeam} className={css.row}>
        <img src="/icons/team.svg" />
        <span>Team</span>
      </div>
    </>
  );

  const networkUserJSX = (
    <>
      <div onClick={navigateToConnections} className={css.row}>
        <img src="/icons/connection.svg" />
        <span>Connections</span>
      </div>
      <div onClick={navigateToFollowing} className={css.row}>
        <img src="/icons/followers.svg" />
        <span>Following</span>
      </div>
    </>
  );

  const createdLinkJSX = (
    <div onClick={navigateToCreatedJobs} className={css.row}>
      <img src="/icons/folder-black.svg" />
      <span>Created</span>
    </div>
  );

  const myApplicationsJSX = (
    <div onClick={navigateToAppliedApplications} className={css.row}>
      <img src="/icons/document-black.svg" />
      <span>My applications</span>
    </div>
  );

  function filterCurrentIdentity(acc: AccountsModel) {
    return !acc.current;
  }

  const switchToJSX = (
    <div className={css.items}>
      <div className={css.title}>Switch To</div>
      {accountList.filter(filterCurrentIdentity).map((item) => {
        return (
          <div
            onClick={() => {
              switchAccount(item.id);
            }}
            key={item.id}
            className={css.row}
          >
            <Avatar size="2rem" type={item.type} img={item.type === 'organizations' ? item.image : item.avatar} />
            <span>{item.name}</span>
          </div>
        );
      })}
    </div>
  );

  const paymentJSX = (
    <div className={css.items}>
      <div className={css.title}>Billing & Payments</div>
      <div className={css.row} onClick={() => navigateToRoute('wallet')}>
        <img src="/icons/wallet.svg" />
        <span>Wallet</span>
      </div>
    </div>
  );

  const headerJSX = (
    <div className={css.header}>
      <div className={css.organization}>
        <Button onClick={navigateToCreateOrg} color="white" width="160px">
          Add organization
        </Button>
        <div className={css.dotIcon}>
          <img src="/icons/three-dots-blue.svg" alt="" />
        </div>
      </div>
      <div className={css.info}>
        <ProfileView
          name={identity?.meta?.name}
          location={
            <div className={css.profileLink} onClick={navigateToProfile}>
              View my profile
            </div>
          }
          size="3rem"
          type={avatarType}
          img={avatarImg}
        />
      </div>
      <div className={css.connections}>
        {/* <span>4 Connections</span>
            <span>11 Followers</span> */}
      </div>
    </div>
  );

  return (
    <div className={css.container}>
      <div style={bgStyles(isVisible)} className={css.bg} onClick={closeSidebar} />
      <div style={sidebarStyles(isVisible)} className={css.sidebar}>
        {printWhen(headerJSX, isLoggedIn)}
        {printWhen(
          <div className={css.items}>
            <div className={css.title}>Organization</div>
            {networkOrgJSX}
          </div>,
          identity?.type === 'organizations' && isLoggedIn,
        )}
        {printWhen(
          <div className={css.items}>
            <div className={css.title}>Network</div>
            {networkUserJSX}
          </div>,
          identity?.type === 'users' && isLoggedIn,
        )}
        <div className={css.items}>
          {printWhen(<div className={css.title}>Jobs</div>, isLoggedIn)}
          {printWhen(myApplicationsJSX, identity?.type === 'users')}
          {printWhen(createdLinkJSX, identity?.type === 'organizations')}
        </div>
        {printWhen(switchToJSX, accountList.length > 1)}
        {printWhen(paymentJSX, identity?.type === 'users')}
        <div className={css.items}>
          <div className={css.title}>Settings</div>
          <div className={css.row} onClick={() => navigateToRoute('privacy-policy')}>
            <img src="/icons/document-one-black.svg" />
            <span>Privacy policy</span>
          </div>
          <div className={css.row} onClick={() => navigateToRoute('terms-conditions')}>
            <img src="/icons/document-one-black.svg" />
            <span>Terms & conditions</span>
          </div>
          {printWhen(
            <div className={css.row} onClick={() => navigateToRoute('change-password')}>
              <img src="/icons/key-black.svg" width={22} height={22} />
              <span>Change password</span>
            </div>,
            isLoggedIn,
          )}
          {printWhen(
            <div className={css.row} onClick={() => navigateToRoute('delete-profile/delete')}>
              <img src="/icons/delete-account-black.svg" />
              <span>Delete Account</span>
            </div>,
            isLoggedIn,
          )}
        </div>
        {printWhen(
          <div className={css.items}>
            <div className={css.row} onClick={() => navigateToSignIn()}>
              <img src="/icons/logout-red.svg" height={22} className={css.redIcon} />
              <span>Log out</span>
            </div>
          </div>,
          isLoggedIn,
        )}
        {printWhen(
          <div className={css.items}>
            <div className={css.row} onClick={() => navigateToSignIn()}>
              <img src="/icons/logout-red.svg" height={22} className={css.redIcon} />
              <span>Log in</span>
            </div>
          </div>,
          !isLoggedIn,
        )}
      </div>
    </div>
  );
};
