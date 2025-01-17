import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { isTouchDevice } from 'src/core/device-type-detector';
import { RootState } from 'src/store';

import { Desktop } from './desktop/desktop';
import { Mobile } from './mobile/mobile';

export const SignInContainer = (): JSX.Element => {
  const status = useSelector((state: RootState) => state.identity.status);

  if (status === 'succeeded') return <Navigate to="/jobs" />;

  if (status === 'loading') {
    return <div></div>;
  }

  return isTouchDevice() ? <Mobile /> : <Desktop />;
};
