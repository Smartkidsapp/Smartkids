import React, { useCallback, useEffect, useState } from 'react';
import { useGetCategoriesQuery } from '../../features/user/userApiSlice';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { setCreateEtablissement } from '../../features/user/userSlice';
import Slider from '@mui/material/Slider';

export const CreateEtablissementStep2Schema = z.object({
    phone: z.string({ message: 'Le numéro de téléphone est requis' }),
    nom: z.string({ message: "Le nom de l'établissement est requis" }),
    description: z.string({ message: 'Le description est requise' }),
    code_promo: z.string().optional(),
});

function valuetext(value) {
    return `${value}°C`;
}

function Step2({
    onChangeIndex,
    handleBack
}) {

    const [values, setValues] = useState([0, 99]);

    const { createEtablissement } = useSelector((state) => state.auth);

    const dispatch = useDispatch();

    const form = useForm({
        resolver: zodResolver(CreateEtablissementStep2Schema),
    });

    const onSubmit = (data) => {
        dispatch(setCreateEtablissement(data));
        onChangeIndex();
    };

    const {
        register,
        control,
        reset,
        handleSubmit,
        setError
    } = form;

    const [descriptionLength, setDescriptionLength] = useState(0);
    const maxDescriptionLength = 3000;

    const handleDescriptionChange = (e) => {
        setDescriptionLength(e.target.value.length);
    };

    const handleChange = (event, newValue) => {
        setValues(newValue);
        dispatch(setCreateEtablissement({ min_age: values[0], max_age: values[1] }));
    };

    useEffect(() => {
        dispatch(setCreateEtablissement({ min_age: 0, max_age: 99 }));
    }, [])

    return (
        <div className="container">
            <form onSubmit={handleSubmit(onSubmit)} className="contact-form">
                <div className="row">
                    <div className="col-12">
                        <h3 className="mb-5">
                            Parler nous un peu de votre établissement
                        </h3>
                    </div>
                    <div className="col-12 col-md-8">
                        {/* Name or Business Name */}
                        <div className="mb-3">
                            <label htmlFor="businessName" className="form-label">
                                Nom ou raison sociale*
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Entrer le nom ou la raison social de votre établissement..."
                                name="nom"
                                required
                                {...register('nom')}
                            />
                        </div>

                        {/* Description */}
                        <div className="mb-3">
                            <label htmlFor="description" className="form-label">
                                Décrivez votre établissement*
                            </label>
                            <textarea
                                className="form-control"
                                id="description"
                                rows="3"
                                maxLength={maxDescriptionLength}
                                onChange={handleDescriptionChange}
                                placeholder="Décrivez votre établissement"
                                name="description"
                                required
                                {...register('description')}
                            ></textarea>
                            <small className="form-text text-muted">
                                {descriptionLength}/{maxDescriptionLength}
                            </small>
                        </div>

                        {/* Promo Code */}
                        <div className="mb-3">
                            <label htmlFor="promoCode" className="form-label">
                                Code promo
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Entrer le code promotionnel"
                                name="code_promo"
                                {...register('code_promo')}
                            />
                            <small className="form-text text-muted">
                                Les utilisateurs pouront utiliser ce code pour bénéficier d'une réduction
                            </small>
                        </div>

                        {/* Phone Number */}
                        <div className="mb-3">
                            <label htmlFor="phoneNumber" className="form-label">
                                Numéro de téléphone*
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Ex: +33 653 58 74 27"
                                name="phone"
                                required
                                {...register('phone')}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="phoneNumber" className="form-label">
                                Pour quelle catégorie d’âge convient votre établissement ?
                            </label>
                            <Slider
                                getAriaLabel={() => 'Temperature range'}
                                value={values}
                                onChange={handleChange}
                                valueLabelDisplay="auto"
                                getAriaValueText={valuetext}
                                style={{ color: "#CFBBA1" }}
                            />
                            <div className="d-flex align-items-center justify-content-between">
                                <p>{values[0]} an{values[0] > 1 && 's'}</p>
                                <p>{values[1]} ans</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row mt-5">
                    <div className="col-6 col-md-6 d-flex align-items-center justify-content-start">
                        <div style={{ cursor: 'pointer' }} onClick={handleBack}>
                            Retour
                        </div>
                    </div>
                    <div className="col-6 appie-btn-box col-md-6 text-right">
                        <button className="main-btn" type="submit">
                            Suivant
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default Step2;
