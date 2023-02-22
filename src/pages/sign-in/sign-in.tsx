import css from './sign-in.module.scss';
import { useNavigate } from '@tanstack/react-location';
import { Button } from '../../components/atoms/button/button';
import { Input } from '../../components/atoms/input/input';
import { Link } from '../../components/atoms/link/link';
import { Typography } from '../../components/atoms/typography/typography';
import { BottomStatic } from '../../components/templates/bottom-static/bottom-static';
import { LoginPayload } from './sign-in.types';
import { login } from './sign-in.services';
import { formModel } from './sign-in.form';
import { useForm } from '../../core/form';

export const SignIn = (): JSX.Element => {
  const navigate = useNavigate();

  function goToJobList(navigator: typeof navigate) {
    return (loginSucceed: boolean): void => {
      loginSucceed && navigator({ to: '/jobs', replace: true });
    };
  }

  async function onLogin(credentials: LoginPayload) {
    login(credentials).then(goToJobList(navigate));
  }

  const form = useForm(formModel);
  console.log('form: ', form);

  return (
    <BottomStatic>
      <div className={css.top}>
        <div className={css.header}>
          <Typography marginBottom=".5rem" type="heading" size="l">
            Sign in to Socious
          </Typography>
        </div>
        <form className={css.formContainer}>
          <Input register={form} autoComplete="Email" label="Email" name="email" placeholder="Email" />
          <Input
            register={form}
            autoComplete="current-password"
            type="password"
            label="Password"
            name="password"
            placeholder="Password"
          />
        </form>
        <div className={css.forgotPassword}>
          <Link onClick={console.log}>Forgot your password?</Link>
        </div>
      </div>
      <div>
        <div className={css.bottom}>
          <Button disabled={!form.isValid} onClick={console.log}>
            Sign in
          </Button>
          {/* <Button disabled={!isValid} onClick={handleSubmit(onLogin)}>
            Sign in
          </Button> */}
          <Typography marginTop="1rem">
            <span>Not a member? </span>
            <Link onClick={() => navigate({ to: '/sign-up/user/email' })}>Sign up</Link>
          </Typography>
        </div>
      </div>
    </BottomStatic>
  );
};
