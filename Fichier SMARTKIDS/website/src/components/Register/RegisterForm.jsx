import React from 'react';
import heroThumbOne from '../../assets/images/new/hero-thumb-one.png';
import heroThumbTwo from '../../assets/images/new/hero-thumb-two.png';
import { useSignupMutation } from '../../features/user/userApiSlice';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';

export const SignupSchema = z.object({
    name: z.string({
        invalid_type_error: "Ce champ est requis",
        required_error: "Ce champ est requis",
    }),
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

function RegisterForm() {

    const [signup, { isLoading }] = useSignupMutation();
    const navigate = useNavigate();

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
        signup(data).then((res) => {
            if ("data" in res && res.data) {
                navigate("/verify-email", { state: {
                    email: data.email,
                    token: res.data?.data?.access_token,
                }});
                reset();
                return;
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
                                <h4>Créer votre compte</h4>
                                <p>Rejoignez une communauté passionnante...</p>
                                <form onSubmit={handleSubmit(onSubmit)} className="row">
                                    <div className="col-md-12">
                                        <input
                                            type="text"
                                            name="f-name"
                                            placeholder="Nom"
                                            {...register('name')}
                                        />
                                    </div>
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
                                    <div className="col-md-6">
                                        <div className="appie-btn-box">
                                            <button type="submit" className="main-btn" disabled={isLoading}>
                                                Créer mon compte
                                            </button>
                                        </div>
                                    </div>
                                    <div className="col-md-12 mt-4">
                                        <p>Vous avez déjà un compte ? <Link style={{color: '#CFBBA1', fontWeight: 'bold'}} to={'/login'}>Connectez-vous</Link></p>
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

export default RegisterForm;
