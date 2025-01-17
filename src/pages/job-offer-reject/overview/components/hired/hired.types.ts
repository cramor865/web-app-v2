import { MissionsResp } from '../../../../../core/types';

export type HiredProps = {
  hiredList: MissionsResp;
  endHiredList: MissionsResp;
  onDone: () => void;
};
