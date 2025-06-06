import React from 'react';
import Drawer from '../Mobile/Drawer';
import useToggle from '../../Hooks/useToggle';
import HeaderHomeTwo from '../HomeTwo/HeaderHomeTwo';
import FooterHomeTwo from '../HomeTwo/FooterHomeTwo';
import BackToTop from '../BackToTop';
import { useNavigate } from 'react-router-dom';
import { useRequestOTPMutation } from '../../features/user/userApiSlice';
import heroThumbOne from '../../assets/images/new/hero-thumb-one.png';
import heroThumbTwo from '../../assets/images/new/hero-thumb-two.png';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

export const PasswordForgottenSchema = z.object({
    email: z
        .string({
            invalid_type_error: "Ce champ est requis",
            required_error: "Ce champ est requis",
        })
        .email({
            message: "Veuillez saisir une adresse email valide",
        }),
});

function PasswordForgottenScreen() {
    const [drawer, drawerAction] = useToggle(false);

    const [requestPasswordOTP, { isLoading }] = useRequestOTPMutation();
    const navigate = useNavigate();

    const form = useForm({
        resolver: zodResolver(PasswordForgottenSchema),
    });

    const {
        register,
        control,
        reset,
        handleSubmit,
        setError
    } = form;

    const onSubmit = (data) => {
        requestPasswordOTP({
            email: data.email,
            type: 'psd',
        }).then(res => {
            if (res && 'data' in res) {
                reset();
                navigate("/password-recovery", { state: {
                    email: data.email,
                    token: res.data?.data?.access_token,
                }})
            }

            if ('error' in res) {
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
                                <h4>Mot de passe oublié</h4>
                                <p>Saisissez l'adresse e-mail associée à votre compte, et nous vous enverrons un code de réinitialisation du mot de passe.</p>
                                <form onSubmit={handleSubmit(onSubmit)} className="row mt-4">
                                    <div className="col-md-12">
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="Adresse email"
                                            required
                                            {...register('email')}
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

export default PasswordForgottenScreen;
