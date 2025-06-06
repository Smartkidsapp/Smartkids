import React, { useCallback } from 'react';
import { useGetCategoriesQuery } from '../../features/user/userApiSlice';
import { useDispatch, useSelector } from 'react-redux';
import { selectAuth, setCreateEtablissement } from '../../features/user/userSlice';

function Step1({
    onChangeIndex,
    handleBack
}) {
    const { createEtablissement } = useSelector((state) => state.auth);

    const dispatch = useDispatch();

    const { data, isLoading } = useGetCategoriesQuery();

    const handlePress = (id) => {
        dispatch(setCreateEtablissement({ category: id }));
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-12">
                    <h3 className="mb-5">
                        Laquelle de ces propositions décrit le mieux votre établissement ?
                    </h3>
                </div>
                <div className="col-12 col-md-12">
                    <div className="row">
                        {
                            data?.data.map((item, index) => (
                                <div
                                    className="col-md-3 mb-4 col-6 col-lg-2"
                                    key={index}
                                    onClick={() => handlePress(item.id)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div
                                        className="card p-4 text-center"
                                        style={{ border: `2px solid ${createEtablissement?.category == item.id ? '#CFBBA1': 'black'}`, borderRadius: "10px" }}
                                    >
                                        <div className="icon">
                                            <img src={item.icon?.src} width={50} />
                                        </div>
                                        <div className="card-body">
                                            <p className="text-dark" style={{ fontSize: '12px' }}>{item.titre}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
            <div className="row mt-5">
                <div className="col-6 col-md-6 d-flex align-items-center justify-content-start">
                    <div style={{cursor: 'pointer'}}>
                        Retour
                    </div>
                </div>
                <div className="col-6 appie-btn-box col-md-6 text-right">
                    <button className="main-btn" onClick={onChangeIndex} disabled={!createEtablissement?.category}>
                        Suivant
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Step1;
