import { CategoriesClickable } from 'src/components/atoms/categories-clickable/categories-clickable';
import { Search } from 'src/components/atoms/search/search';
import { WebModal } from 'src/components/templates/web-modal';
import { JobReq } from 'src/core/api';

import css from './skills-modal.module.scss';
import { SkillsModalProps } from './skills-modal.types';
import { createFormInitState, jobEditRequest } from '../../info/info.services';
import { useSkillsShared } from '../skills.shared';

export const SkillsModal: React.FC<SkillsModalProps> = ({ open, onClose, onDone, jobOverview }) => {
  const { onSearch, socialCauses, selectedSkills, isValid, setSelectedSkills } = useSkillsShared(jobOverview.skills);

  function editSkills() {
    jobEditRequest(jobOverview.id, {
      ...createFormInitState(jobOverview),
      skills: selectedSkills,
    } as JobReq).then((resp) => {
      onClose();
      onDone(resp);
    });
  }
  return (
    <>
      <WebModal
        header="Skills"
        open={open}
        onClose={() => {
          onClose();
        }}
        buttons={[
          {
            children: 'Save changes',
            disabled: !isValid,
            onClick: () => {
              editSkills();
              onClose();
            },
          },
          {
            children: 'Cancel',
            color: 'white',
            onClick: () => {
              onClose();
            },
          },
        ]}
      >
        <>
          <div className={css.questionContainer}>
            <div className={css.question}>Select up to 10 relevant skills</div>
            <div className={css.limitStatement}>Skills used in this job</div>
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
              onChange={(list) => {
                setSelectedSkills(list);
                // dispatch(setPostSkills(list));
              }}
              list={socialCauses}
              selected={selectedSkills}
            />
          </div>
        </>
      </WebModal>
    </>
  );
};
