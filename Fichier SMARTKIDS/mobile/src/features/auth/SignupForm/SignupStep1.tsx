import React from 'react';
import { useSignupState } from '../../../context/SignupProvider';
import VerifyEmailScreen from '../../../../screens/VerifyEmail';

export default function SignupStep1() {
  const { email } = useSignupState();
  return <VerifyEmailScreen email={email!} />;
}
