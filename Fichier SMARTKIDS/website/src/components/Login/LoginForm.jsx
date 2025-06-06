import React, { useState } from 'react';
import heroThumbOne from '../../assets/images/new/hero-thumb-one.png';
import heroThumbTwo from '../../assets/images/new/hero-thumb-two.png';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { useSigninMutation } from '../../features/user/userApiSlice';

export const SignupSchema = z.object({
    email: z
        .string({
            invalid_type_error: "Ce champ est requis",
            required_error: "Ce champ est requis",
        })
        .email({
            message: "Veuillez saisir une adresse email valide",
        }),
    password: z.string({
        invalid_type_error: "Ce champ est requis",
        required_error: "Ce champ est requis",
    }),
});

function LoginForm() {

    const [signin, { isLoading }] = useSigninMutation();
    const navigate = useNavigate();

    const [errorMessage, setErrorMessage] = useState('');

    const form = useForm({
        resolver: zodResolver(SignupSchema),
    });

    const {
        register,
        control,
        reset,
        handleSubmit,
        setError
    } = form;

    const onSubmit = (data) => {
        setErrorMessage("")
        signin(data).then((res) => {
            if ("data" in res && res.data) {
                if (res.data.status === "EMAIL_VERIFICATION_PENDING") {
                    navigate("/verify-email", { state: {
                        email: data.email,
                        token: res.data?.data?.access_token,
                    }});
                } else {
                    navigate("/etablissement")
                }

                reset();
                return;
            }

            if ('error' in res && res.error) {
                setErrorMessage(res.error.data.message);
            }
        });
    };

    return (
        <>
            <section className="register-section">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="contact-form">
                                <h4>Connectez-vous</h4>
                                { errorMessage.length > 0 && (<p className="text-danger">{errorMessage}</p>) }
                                <form onSubmit={handleSubmit(onSubmit)} className="row mt-4">
                                    <div className="col-md-12">
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="Adresse email"
                                            {...register('email')}
                                        />
                                    </div>
                                    <div className="col-md-12">
                                        <input
                                            type="password"
                                            name="password"
                                            placeholder="Mot de passe"
                                            {...register('password')}
                                        />
                                    </div>
                                    <div className="col-md-12 text-right">
                                        <Link style={{ color: '#CFBBA1', fontWeight: 500 }} to={'/forgetten-password'}>Mot de passe oublié ?</Link>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="appie-btn-box">
                                            <button type="submit" className="main-btn" disabled={isLoading}>
                                                Connexion
                                            </button>
                                        </div>
                                    </div>
                                    <div className="col-md-12 mt-4">
                                        <p>Vous n’avez pas compte ? <Link style={{ color: '#CFBBA1', fontWeight: 'bold' }} to={'/register'}>Inscrivez-vous </Link></p>
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
        </>
    );
}

export default LoginForm;
