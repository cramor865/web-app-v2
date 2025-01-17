import { useLoaderData, useNavigate } from 'react-router-dom';
import { Button } from 'src/components/atoms/button/button';
import { CategoriesClickable } from 'src/components/atoms/categories-clickable/categories-clickable';
import { Search } from 'src/components/atoms/search/search';
import { Job } from 'src/components/organisms/job-list/job-list.types';
import { JobReq } from 'src/core/api';
import { createFormInitState, jobEditRequest } from 'src/pages/job-edit/info/info.services';
import { useSocialCausesShared } from 'src/pages/job-edit/social-causes/social-causes.shared';

import css from './mobile.module.scss';

export const Mobile = (): JSX.Element => {
  const navigate = useNavigate();
  const { overview } = useLoaderData() as { overview: Job };
  const { onSearch, socialCauses, selectedSocialCauses, isValid, setSelectedSocialCauses } = useSocialCausesShared(
    overview.causes_tags,
  );
  function editSocialCauses() {
    jobEditRequest(overview.id, { ...createFormInitState(overview), causes_tags: selectedSocialCauses } as JobReq).then(
      () => {
        onBack();
      },
    );
  }
  function onBack() {
    navigate(`/jobs/created/${overview.id}/overview`);
  }

  return (
    <div className={css.container}>
      <div className={css.header}>
        <div className={css.chevron} onClick={onBack}>
          <img height={24} src="/icons/chevron-left.svg" />
        </div>
        <div className={css.headerTitle}>Social causes</div>
      </div>
      <div className={css.questionContainer}>
        <div className={css.question}>What is your job about?</div>
        <div className={css.limitStatement}>Select up to 1 social cause</div>
      </div>
      <div className={css.search}>
        <Search
          backgroundColor="var(--color-off-white-01)"
          width="100%"
          placeholder="Search"
          onValueChange={onSearch}
        />
      </div>
      <div className={css.main}>
        <div className={css.categoryTitle}>Popular</div>
        <CategoriesClickable
          clickable
          onChange={(list) => setSelectedSocialCauses(list)}
          list={socialCauses}
          selected={selectedSocialCauses}
        />
      </div>

      <div className={css.bottom}>
        <Button disabled={!isValid} onClick={editSocialCauses}>
          Save changes
        </Button>
        <Button color="white" onClick={onBack}>
          Cancel
        </Button>
      </div>
    </div>
  );
};
