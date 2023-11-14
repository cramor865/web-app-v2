import { TextField, InputAdornment, Typography } from '@mui/material';
import { AlertCircle } from 'public/icons/nowruz/alert-circle';
import { useEffect, useState } from 'react';
import variables from 'src/components/_exports.module.scss';

import css from './input.module.scss';
import { InputProps } from './input.types';
import { Icon } from 'src/Nowruz/general/Icon';

export const Input: React.FC<InputProps> = ({
  id,
  label,
  name,
  required,
  errors,
  isValid,
  validMessage,
  prefix,
  color,
  register,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [endIcon, setEndIcon] = useState<React.ReactNode>('');
  const [inputType, setInputType] = useState(props.type || 'text');
  const [showEyeIcon, setshowEyeIcon] = useState(false);
  useEffect(() => {
    if (errors) setEndIcon(<AlertCircle width={14} height={14} stroke={`${variables.color_error_600}`} />);
    else if (props.type === 'password' && showPassword && showEyeIcon) {
      setInputType('text');
      setEndIcon(
        <img
          src="/icons/nowruz/eye-off.svg"
          onClick={() => setShowPassword(false)}
          alt=""
          className="cursor-pointer"
        />,
        // <Icon name="eye-off" color={variables.color_grey_500} fontSize={24} />,
      );
    } else if (props.type === 'password' && !showPassword && showEyeIcon) {
      setInputType('password');
      setEndIcon(
        <img src="/icons/nowruz/eye.svg" onClick={() => setShowPassword(true)} alt="" className="cursor-pointer" />,
        // <Icon name="eye" color={variables.color_grey_500} fontSize={24} />,
      );
    } else setEndIcon('');
  }, [errors, showPassword, showEyeIcon]);

  const setValue = (v: string) => {
    let val = v;
    if (props.type !== 'password') {
      val = val.trim();
    }
    if (props.type === 'password')
      if (val.length) setshowEyeIcon(true);
      else setshowEyeIcon(false);
    return val;
  };

  return (
    <div className={css.labelContainer}>
      {label && (
        <div>
          <label className={css.label}>{label}</label>
        </div>
      )}

      <TextField
        variant="outlined"
        className={`${css.default} ${errors ? css.errorColor : css.defaultColor}`}
        fullWidth
        InputProps={{
          style: {
            height: props.customHeight ? props.customHeight : '44px',
          },
          endAdornment: <InputAdornment position="end">{endIcon}</InputAdornment>,
          startAdornment: prefix && (
            <InputAdornment position="start" className={css.prefix}>
              {prefix}
            </InputAdornment>
          ),
        }}
        {...(register
          ? register(name, {
              setValueAs: setValue,
            })
          : {})}
        {...props}
        type={inputType}
      />
      {errors &&
        errors.map((e, index) => (
          <p key={index} className={`${css.errorMsg} ${css.msg}`}>
            {e}
          </p>
        ))}

      {isValid && validMessage && <p className={`${css.successMsg} ${css.msg}`}>{validMessage}</p>}
    </div>
  );
};
