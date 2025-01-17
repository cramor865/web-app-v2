import { useSelector } from 'react-redux';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { COUNTRIES_DICT } from 'src/constants/COUNTRIES';
import { IdentityReq } from 'src/core/types';
import { RootState } from 'src/store';

import { Resolver } from './job-detail.types';

export const useJobDetailShared = () => {
  const navigate = useNavigate();
  const { jobDetail: job, screeningQuestions } = useLoaderData();

  function getCountryName(shortname?: keyof typeof COUNTRIES_DICT | undefined) {
    if (shortname && COUNTRIES_DICT[shortname]) {
      return COUNTRIES_DICT[shortname];
    } else {
      return shortname;
    }
  }

  const location = `${job.identity_meta.city}, ${getCountryName(
    job.identity_meta.country as keyof typeof COUNTRIES_DICT | undefined,
  )}`;

  const identity = useSelector<RootState, IdentityReq | undefined>((state) => {
    return state.identity.entities.find((identity) => identity.current);
  });

  return { navigate, job, identity, location, screeningQuestions: screeningQuestions.questions };
};
