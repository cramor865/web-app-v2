import React, { useState } from 'react';
import variables from 'src/components/_exports.module.scss';
import { Icon } from 'src/Nowruz/general/Icon';
import { IconDropDown } from 'src/Nowruz/modules/general/components/iconDropDown';
import { Input } from 'src/Nowruz/modules/general/components/input/input';
import { SlideOut } from 'src/Nowruz/modules/general/components/slideOut';

import css from './headerNavBar.module.scss';
import { useHeaderNavBar } from './useHeaderNavBar';
import { Notifications } from '../../containers/notifications';
import NotifBellIcon from '../notifBellIcon';
import { StatusDropDown } from '../statusDropDown';

interface HeaderNavBarProps {
  setOpen: (val: boolean) => void;
  logout: () => void;
}
const HeaderNavBar: React.FC<HeaderNavBarProps> = ({ setOpen, logout }) => {
  const {
    userIsLoggedIn,
    userType,
    image,
    accounts,
    openToVolunteer,
    openToWork,
    hiring,
    handleOpenToWork,
    handleOpenToVolunteer,
    handleHiring,
    openNotifPanel,
    setOpenNotifPanel,
    notifList,
  } = useHeaderNavBar();

  const [searchTerm, setSearchTerm] = useState('');
  return (
    <div className={`h-16 md:h-[72px] px-4 md:px-8 shadow-Shadows/shadow-sm md:[box-shadow:none] ${css.container}`}>
      <div
        className="md:hidden w-10 h-10 p-2 rounded-default"
        onClick={() => {
          setOpen(true);
        }}
      >
        <Icon fontSize={24} name="menu-02" color={variables.color_grey_500} />
      </div>
      <div className="hidden md:block md:ml-20">
        <Input
          id="search-input"
          name="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search"
        />
      </div>
      {userIsLoggedIn && (
        <div className="flex w-fit h-10 gap-2 md:gap-4 ">
          <div className="flex gap-4 md:hidden mr-2">
            <Icon name="search-lg" fontSize={24} className="text-Gray-light-mode-500" />
          </div>
          <div onClick={() => setOpenNotifPanel(true)}>
            <NotifBellIcon unread />
          </div>
          <div className="hidden md:block">
            <StatusDropDown
              type={userType}
              hiring={hiring}
              openToWork={openToWork}
              openToVolunteer={openToVolunteer}
              handleOpenToWork={handleOpenToWork}
              handleOpenToVolunteer={handleOpenToVolunteer}
              handleHiring={handleHiring}
            />
          </div>

          <IconDropDown
            type={userType}
            img={image}
            accounts={accounts}
            iconItems={[
              { iconName: 'help-circle', label: 'Support' },
              { iconName: 'log-out-01', label: 'Log out', onClick: logout },
            ]}
          />
        </div>
      )}
      <SlideOut
        component={<Notifications handleClose={() => setOpenNotifPanel(false)} list={notifList} />}
        open={openNotifPanel}
        handleClose={() => setOpenNotifPanel(false)}
      />
    </div>
  );
};

export default HeaderNavBar;