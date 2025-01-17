import { ActionSheet, ActionSheetButtonStyle } from '@capacitor/action-sheet';
import { Dialog } from '@mui/material';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Avatar } from 'src/components/atoms/avatar/avatar';
import { Card } from 'src/components/atoms/card/card';
import { CardMenu } from 'src/components/molecules/card-menu/card-menu';
import { FeedList } from 'src/components/organisms/feed-list/feed-list';
import { Modal } from 'src/components/templates/modal/modal';
import { ProfileCard } from 'src/components/templates/profile-card';
import { CurrentIdentity, Post } from 'src/core/api';
import { isTouchDevice } from 'src/core/device-type-detector';
import { useAuth } from 'src/hooks/use-auth';
import { DialogCreate } from 'src/pages/feed/dialog-create/dialog-create';
import { ModalCreate } from 'src/pages/feed/modal-create';
import { RootState } from 'src/store';

import css from './feed.module.scss';
import MobileHeader from './mobileHeader.tsx/mobileHeader';
import { useFeed } from './useFeed';

export const Feeds = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [openMoreBox, setOpenMoreBox] = useState(false);
  const [moreOptions, setMoreOptions] = useState<{ title: string }[]>([]);
  const [touchDevice] = useState(isTouchDevice());
  const [feed, setFeed] = useState<Post>();

  const identity = useSelector<RootState, CurrentIdentity | undefined>((state) => {
    return state.identity.entities.find((identity) => identity.current);
  });

  const avatarImg = useSelector<RootState, string>((state) => {
    return state.identity.avatarImage;
  });

  const {
    onMoreClick,
    onMorePage,
    onRemoveLike,
    onLike,
    feedList,
    handleClickOpen,
    setFeedList,
    handleClose,
    openDialog,
    onShowSeeMore,
  } = useFeed();

  const NetworkMenuList = [
    { label: 'Connections', icon: '/icons/connection.svg', link: () => navigate('/network/connections') },
    { label: 'Following', icon: '/icons/followers.svg', link: () => navigate('/network/followings') },
  ];

  const NetworkMenuListOrg = [
    ...NetworkMenuList,
    { label: 'Team', icon: '/icons/team.svg', link: () => navigate(`/team/${identity?.id}`) },
  ];

  const jobsMenuListUser = [
    {
      label: 'My applications',
      icon: '/icons/my-applications.svg',
      link: () => navigate(`/jobs/applied/${identity?.id}`),
    },
  ];

  const jobsMenuListOrg = [
    {
      label: 'Created',
      icon: '/icons/folder-black.svg',
      link: () => navigate(`/jobs/created/${identity?.id}`),
    },
  ];

  const showActions = async (feed: Post) => {
    const name = feed.identity_meta.name;
    if (touchDevice) {
      const result = await ActionSheet.showActions({
        title: 'What do you want to do?',
        options: [
          { title: `Block ${name}` },
          { title: `Report ${name}` },
          { title: 'Cancel', style: ActionSheetButtonStyle.Cancel },
        ],
      });
      onMoreClick(result.index, feed);
    } else {
      const options = [{ title: `Block ${name}` }, { title: `Report ${name}` }, { title: 'Cancel' }];
      setMoreOptions(options);
      setFeed(feed);
      setOpenMoreBox(true);
    }
  };

  const onClickMoreOption = (index: number) => {
    onMoreClick(index, feed as Post);
    setOpenMoreBox(false);
  };

  return (
    <div className="w-full h-full">
      <div className="md:hidden">
        <MobileHeader />
      </div>
      <div className={css.container}>
        <div className={`${css.boundaries} md:mt-10 md:mr-10 md:mb-0 md:ml-10`}>
          {isLoggedIn && (
            <div className="w-[20rem] hidden md:block">
              <div className="grid grid-cols-1 gap-4">
                <ProfileCard />
                <CardMenu
                  title="Network"
                  list={identity?.type === 'organizations' ? NetworkMenuListOrg : NetworkMenuList}
                />
                {identity?.type === 'users' && <CardMenu title="Jobs" list={jobsMenuListUser} />}
                {identity?.type === 'organizations' && <CardMenu title="Jobs" list={jobsMenuListOrg} />}
              </div>
            </div>
          )}
          <div className={`w-full ${isLoggedIn && 'max-w-[38.5rem]'} flex flex-col`}>
            <div className="hidden md:block">
              <div className={css.banner}>
                <div className={css.title}>Your Feed</div>
                <div className={css.tagline}>See what is happening in your network</div>
              </div>
            </div>
            {isLoggedIn && (
              <div className="w-full pt-6 pr-4 pb-2 pl-4">
                <Card>
                  <div className="flex items-center gap-4">
                    <Avatar size="3rem" type="users" img={avatarImg} />
                    <div onClick={handleClickOpen} className={css.createButton}>
                      Create a post
                    </div>
                  </div>
                </Card>
              </div>
            )}
            <div className="md:py-4 md:px-0">
              <FeedList
                data={feedList}
                onMoreClick={(feed) => showActions(feed)}
                onLike={onLike}
                onRemoveLike={onRemoveLike}
                onMorePageClick={onMorePage}
                showSeeMore={onShowSeeMore(feedList.length)}
              />

              <Modal open={openMoreBox} onClose={() => setOpenMoreBox(false)}>
                <div className={css.moreBox}>
                  <div className={css.moreHeader}>What do you want to do?</div>
                  {moreOptions?.map((option, index) => (
                    <div key={option.title} className={css.moreOption} onClick={() => onClickMoreOption(index)}>
                      {option.title}
                    </div>
                  ))}
                </div>
              </Modal>
            </div>
          </div>
        </div>
      </div>
      {touchDevice ? (
        <div className="sm:hidden">
          <Dialog fullScreen open={openDialog}>
            <DialogCreate onClose={handleClose} setFeedList={setFeedList} />
          </Dialog>
        </div>
      ) : (
        <ModalCreate open={openDialog} onClose={handleClose} setFeedList={setFeedList} />
      )}
    </div>
  );
};
