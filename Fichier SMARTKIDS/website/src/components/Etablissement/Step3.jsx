import React, { useCallback, useMemo, useState } from 'react';
import { useGetCategoriesQuery } from '../../features/user/userApiSlice';
import WorkingHourItem from './WorkingHourItem';
import { useDispatch, useSelector } from 'react-redux';
import { setCreateEtablissement } from '../../features/user/userSlice';
import { timeLabelToIsoTimeStr, timeLabelToTimeStr } from '../../lib/date';

const INITIAL_OPENING_HOURS = [1, 2, 3, 4, 5, 6, 0]
    .map((day) => ({
        day,
        from: "08h00",
        to: "18h00",
        available: true,
    }))
    .reduce((acc, curr) => {
        acc.set(curr.day, curr);
        return acc;
    }, new Map());

function Step3({
    onChangeIndex,
    handleBack
}) {
    const { createEtablissement } = useSelector((state) => state.auth);

    const dispatch = useDispatch();

    const [currentDailyopeningHours, setcurrentDailyopeningHours] = useState(() => {
        return INITIAL_OPENING_HOURS;
    });

    const openinHours = Array.from(currentDailyopeningHours.keys()).map((op) =>
        currentDailyopeningHours.get(op)
    );

    const [services, setServices] = useState([]);
    const [newService, setNewService] = useState({ title: '', price: '' });

    const handleNewServiceChange = (e) => {
        setNewService({
            ...newService,
            [e.target.name]: e.target.value,
        });
    };

    const handleServiceChange = (index, e) => {
        const { name, value } = e.target;
    
        const updatedServices = [...services];
        
        updatedServices[index] = {
            ...updatedServices[index],
            [name]: value,
        };
        
        setServices(updatedServices);
    };

    const addService = () => {
        setServices([...services, newService]);
        setNewService({ title: '', price: '' });
    };

    const removeService = (index) => {
        const updatedServices = services.filter((_, i) => i !== index);
        setServices(updatedServices);
    };

    const onSubmit = (data) => {
        const openinHours = Array.from(currentDailyopeningHours.keys()).map(
            (op) => {
                const opHours = currentDailyopeningHours.get(op);
                return {
                    ...opHours,
                    from: timeLabelToTimeStr(opHours.from),
                    to: timeLabelToTimeStr(opHours.to),
                };
            }
        );

        if (services.length > 0) {
            let validServices = services.filter((service) => {
                if (service.title.length > 0 && service.price.length > 0) {
                    return { title: service.title, price: service.price };
                }
            });

            if (newService.title.length > 0 && newService.price.length > 0) {
                validServices = [...validServices, { title: newService.title, price: newService.price }];
            }

            dispatch(setCreateEtablissement({ services: validServices }));
        } else {
            dispatch(setCreateEtablissement({ services: [] }));
        }

        dispatch(setCreateEtablissement({ dailyOpeningHours: openinHours }));

        onChangeIndex();
    };

    const onChange = useCallback(
        (op) => {
            setcurrentDailyopeningHours((prev) => {
                const nextV = new Map();
                Array.from(prev.keys()).map((k) => {
                    if (k == op.day) {
                        nextV.set(op.day, op);
                    } else {
                        nextV.set(k, prev.get(k));
                    }
                });
                return nextV;
            });
        },
        [setcurrentDailyopeningHours]
    );

    const OpeningHours = useMemo(() => {
        const openinHours = Array.from(currentDailyopeningHours.keys()).map((op) =>
            currentDailyopeningHours.get(op)
        );

        return openinHours.map((op) => {
            return (
                <WorkingHourItem
                    key={`${op.day}_${op?.from}_${op?.to}`}
                    day={op.day}
                    value={op}
                    onChange={onChange}
                />
            );
        });
    }, [currentDailyopeningHours]);

    return (
        <div className="container">
            <div className="row">
                <div className="col-12">
                    <h3 className="mb-5">
                        Quels sont vos services et vos horaires d'ouvertures ?
                    </h3>
                </div>
                <div className="col-12 col-md-8">
                    {/* Services */}
                    <h5>Services que vous proposez</h5>
                    <div className="my-4 contact-form">
                        {services.map((service, index) => (
                            <div key={index} className="d-flex align-items-start mb-2" style={{ gap: 10 }}>
                                <input
                                    name="title"
                                    type="text"
                                    className="form-control me-2"
                                    value={service.title}
                                    style={{ width: "40%", marginBottom: 0 }}
                                    onChange={(e) => handleServiceChange(index, e)}
                                />
                                <div style={{ width: "30%" }}>
                                    <input
                                        name="price"
                                        type="text"
                                        className="form-control me-2"
                                        value={service.price}
                                        style={{ width: "100%", marginBottom: 0 }}
                                        onChange={(e) => handleServiceChange(index, e)}
                                    />
                                    <small className="form-text text-muted">
                                        Ex: 10 €
                                    </small>
                                </div>
                                <button
                                    className="btn btn-danger ms-2"
                                    onClick={() => removeService(index)}
                                >
                                    <i className="fa fa-trash"></i>
                                </button>
                            </div>
                        ))}

                        {/* New service input */}
                        <div className="d-flex align-items-start" style={{ gap: 10 }}>
                            <input
                                type="text"
                                className="form-control me-2"
                                name="title"
                                value={newService.title}
                                placeholder="Titre du service"
                                onChange={handleNewServiceChange}
                                style={{ width: "40%", marginBottom: 0 }}
                            />
                            <div style={{ width: "30%" }}>
                                <input
                                    type="text"
                                    className="form-control me-2"
                                    name="price"
                                    value={newService.price}
                                    placeholder="Prix"
                                    onChange={handleNewServiceChange}
                                    style={{ width: "100%", marginBottom: 0 }}
                                />
                                <small className="form-text text-muted">
                                    Ex: 10 €
                                </small>
                            </div>
                            <button className="btn btn-dark ms-2" onClick={addService}>
                                <i className="fa fa-plus"></i>
                            </button>
                        </div>
                    </div>

                    {/* Opening Hours */}
                    <h5>Horaires d'ouvertures</h5>
                    <div className="contact-form mt-4">
                        <div className="opening-hours">
                            {OpeningHours}
                            {/*days.map((day, index) => (
                                    <div className="mb-3">
                                        <span className="mb-2">{day}</span>
                                        <div key={day} className="day-row">
                                            <label className="custom-checkbox">
                                                <input
                                                    type="checkbox"
                                                    checked={openingHours[index].isOpen}
                                                    onChange={() => handleCheckboxChange(index)}
                                                />
                                                <span className="checkbox-icon"></span>
                                                <span className="checkbox-label">
                                                    {openingHours[index].isOpen ? 'Ouvert' : 'Fermé'}
                                                </span>
                                            </label>
                                            <select
                                                value={openingHours[index].openTime}
                                                onChange={(e) => handleTimeChange(index, 'openTime', e.target.value)}
                                                disabled={!openingHours[index].isOpen}
                                            >
                                                {hours.map((hour) => (
                                                    <option key={hour} value={hour}>
                                                        {hour}
                                                    </option>
                                                ))}
                                            </select>
                                            <span>à</span>
                                            <select
                                                value={openingHours[index].closeTime}
                                                onChange={(e) => handleTimeChange(index, 'closeTime', e.target.value)}
                                                disabled={!openingHours[index].isOpen}
                                            >
                                                {hours.map((hour) => (
                                                    <option key={hour} value={hour}>
                                                        {hour}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                ))*/}
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
                    <button className="main-btn" onClick={onSubmit}>
                        Suivant
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Step3


