import { useState } from 'react';
import { Button } from 'src/components/atoms/button/button';
import { Card } from 'src/components/atoms/card/card';
import { CategoriesClickable } from 'src/components/atoms/categories-clickable/categories-clickable';
import { Search } from 'src/components/atoms/search/search';
import { Steps } from 'src/components/atoms/steps/steps';
import { useOrganizationCreateShared } from 'src/pages/organization-create/organization-create.shared';
import { SOCIAL_CAUSES } from 'src/pages/organization-create/social-causes/social-causes.services';

import css from './desktop.module.scss';

export const Desktop = (): JSX.Element => {
  const { socialCauses, updateSocialCauses, isSocialCausesValid, navigateToProfile, navigateToType } =
    useOrganizationCreateShared();
  const [list, setList] = useState(SOCIAL_CAUSES);

  function onSearch(value: string) {
    const filtered = SOCIAL_CAUSES.filter((item) => item.label.toLowerCase().includes(value.toLowerCase()));
    setList(filtered);
  }

  return (
    <div className={css.container}>
      <Card padding="0" className={css.card}>
        <div className={css.header}>
          <div className={css.chevron} onClick={navigateToType}>
            <img height={24} src="/icons/chevron-left.svg" />
          </div>
          <div className={css.stepsContainer}>
            <Steps clickable={false} length={6} current={2} />
          </div>
        </div>
        <div className={css.questionContainer}>
          <div className={css.question}>What are your social causes?</div>
          <div className={css.limitStatement}>Select up to 5 social causes.</div>
          <div className={css.search}>
            <Search width="100%" placeholder="Search" onValueChange={onSearch} />
          </div>
        </div>
        <div className={css.main}>
          <div className={css.categoryTitle}>Popular</div>
          <CategoriesClickable clickable onChange={updateSocialCauses} list={list} selected={socialCauses} />
        </div>
        <div className={css.buttonContainer}>
          <Button disabled={!isSocialCausesValid} onClick={navigateToProfile}>
            Continue
          </Button>
        </div>
      </Card>
    </div>
  );
};
