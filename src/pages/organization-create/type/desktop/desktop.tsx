import { Button } from 'src/components/atoms/button/button';
import { Card } from 'src/components/atoms/card/card';
import { Steps } from 'src/components/atoms/steps/steps';
import { TypeSelector } from 'src/components/atoms/type-selector/type-selector';
import { ORGANIZATION_TYPE } from 'src/constants/ORGANIZATION_TYPE';
import { useOrganizationCreateShared } from 'src/pages/organization-create/organization-create.shared';

import css from './desktop.module.scss';

export const Desktop = (): JSX.Element => {
  const { type, updateOrgType, navigateToSocialCauses, navigateToIntro } = useOrganizationCreateShared();

  return (
    <div className={css.container}>
      <Card padding="0" className={css.card}>
        <div className={css.header}>
          <div className={css.chevron} onClick={navigateToIntro}>
            <img height={24} src="/icons/chevron-left.svg" />
          </div>
          <div className={css.stepsContainer}>
            <Steps clickable={false} length={6} current={1} />
          </div>
        </div>
        <div className={css.question}>What type of organization?</div>
        <div className={css.main}>
          <TypeSelector value={type || ''} padding="2rem 1rem" onChange={updateOrgType} list={ORGANIZATION_TYPE} />
        </div>
        <div className={css.buttonContainer}>
          <Button disabled={!type} onClick={navigateToSocialCauses}>
            Continue
          </Button>
        </div>
      </Card>
    </div>
  );
};
