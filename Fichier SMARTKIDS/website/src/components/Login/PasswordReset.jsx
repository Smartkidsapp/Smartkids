import React from 'react';
import Drawer from '../Mobile/Drawer';
import useToggle from '../../Hooks/useToggle';
import HeaderHomeTwo from '../HomeTwo/HeaderHomeTwo';
import FooterHomeTwo from '../HomeTwo/FooterHomeTwo';
import BackToTop from '../BackToTop';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRequestOTPMutation, useResetPasswordMutation } from '../../features/user/userApiSlice';
import heroThumbOne from '../../assets/images/new/hero-thumb-one.png';
import heroThumbTwo from '../../assets/images/new/hero-thumb-two.png';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

export const PasswordResetSchema = z.object({
    password: z.string({
        invalid_type_error: "Ce champ est requis",
        required_error: "Ce champ est requis",
    }),
    passwordConfirmation: z.string({
        invalid_type_error: "Ce champ est requis",
        required_error: "Ce champ est requis",
    }),
});

function PasswordReset() {

    const location = useLocation();

    let email = location.state.email;
    let token = location.state.token;

    const [drawer, drawerAction] = useToggle(false);

    const [resetPassword, { isLoading }] = useResetPasswordMutation();
    const navigate = useNavigate();

    const form = useForm({
        resolver: zodResolver(PasswordResetSchema),
    });

    const {
        register,
        control,
        reset,
        handleSubmit,
        setError
    } = form;

    const onSubmit = (data) => {
        console.log(email)
        if (data.password !== data.passwordConfirmation) {
            alert("Les deux mots de passe ne correspondent pas!");
            return;
        }

        resetPassword({
            email: email,
            password: data.password,
            token: token,
        }).then(res => {
            if (res && 'data' in res) {
                navigate("/login")
                alert("Mot de passe mis à jour avec succès");
            }

            if ('error' in res && res.error) {
            }
        });
    };
    return (
        <>
            <Drawer drawer={drawer} action={drawerAction.toggle} />
            <HeaderHomeTwo action={drawerAction.toggle} />
            <section className="register-section">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="contact-form">
                                <h4>Mot de pass oublié</h4>
                                <p>Créez un nouveau mot de passe</p>
                                <form onSubmit={handleSubmit(onSubmit)} className="row mt-4">
                                    <div className="col-md-12">
                                        <input
                                            type="password"
                                            name="password"
                                            placeholder="Nouveau mot de passe"
                                            {...register('password')}
                                        />
                                    </div>
                                    <div className="col-md-12">
                                        <input
                                            type="password"
                                            name="passwordConfirmation"
                                            placeholder="Confirmer le nouveau mot de passe"
                                            {...register('passwordConfirmation')}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <div className="appie-btn-box">
                                            <button type="submit" className="main-btn" disabled={isLoading}>
                                                Envoyer
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="col-md-6 d-none d-md-block">
                            <div className="appie-hero-thumb">
                                <div
                                    className="thumb wow animated fadeInUp"
                                    data-wow-duration="2000ms"
                                    data-wow-delay="200ms"
                                >
                                    <img src={heroThumbOne} className="thum-img" alt="" />
                                </div>
                                <div
                                    className="thumb-2 wow animated fadeInRight"
                                    data-wow-duration="2000ms"
                                    data-wow-delay="600ms"
                                >
                                    <img src={heroThumbTwo} className="thum-img-1" alt="" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <FooterHomeTwo />
            <BackToTop className="back-to-top-2" />
        </>
    );
}

export default PasswordReset;
