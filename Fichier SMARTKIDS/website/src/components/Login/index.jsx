import React from 'react';
import Drawer from '../Mobile/Drawer';
import useToggle from '../../Hooks/useToggle';
import HeaderHomeTwo from '../HomeTwo/HeaderHomeTwo';
import FooterHomeTwo from '../HomeTwo/FooterHomeTwo';
import BackToTop from '../BackToTop';
import LoginForm from './LoginForm';

function Login() {
    const [drawer, drawerAction] = useToggle(false);
    return (
        <>
            <Drawer drawer={drawer} action={drawerAction.toggle} />
            <HeaderHomeTwo action={drawerAction.toggle} />
            <LoginForm />
            <FooterHomeTwo />
            <BackToTop className="back-to-top-2" />
        </>
    );
}

export default Login;
