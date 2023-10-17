import css from './fab.module.scss';
import { FabProps } from './fab.types';

export const Fab = (props: FabProps): JSX.Element => {
  return (
    <div onClick={props.onClick} className={`${css.container} ${props.className} bottom-24 md:bottom-10`}>
      <img height={24} src="/icons/plus.svg" />
    </div>
  );
};
