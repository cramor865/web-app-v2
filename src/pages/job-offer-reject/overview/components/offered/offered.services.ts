import { Applicant } from 'src/components/molecules/applicant-list/applicant-list.types';

import { isoToStandard } from '../../../../../core/time';
import { Offer } from '../../../../../core/types';

export function jobToApplicantListAdaptor(applicant: Offer[]): Applicant[] {
  if (applicant.length === 0) {
    return [];
  }
  // console.log('applicant ', applicant);
  return applicant.map((item) => {
    return {
      id: item.id,
      name: item.recipient.meta.name,
      image: item.recipient.meta.avatar || '',
      profileLink: '',
      applyDate: isoToStandard(item.created_at),
      coverLetter: item.applicant?.cover_letter,
      user_id: item.recipient.meta.id,
    };
  });
}
