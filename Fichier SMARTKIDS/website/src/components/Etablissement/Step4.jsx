import React, { useCallback, useEffect } from 'react';
import { useGetCategoriesQuery, useGetOptionsQuery } from '../../features/user/userApiSlice';
import { useDispatch, useSelector } from 'react-redux';
import { setCreateEtablissement } from '../../features/user/userSlice';

function Step4({
    onChangeIndex,
    handleBack
}) {

    const { createEtablissement } = useSelector((state) => state.auth);

    const { data, isLoading } = useGetOptionsQuery({ category: createEtablissement?.category });

    const dispatch = useDispatch();

    useEffect(() => {
        if (!createEtablissement?.options) {
            dispatch(setCreateEtablissement({ options: [] }));
        }
    }, []);

    const handlePress = (item) => {
        let options = createEtablissement?.options;

        if (options) {
            if (options?.includes(item.id)) {
                options = options.filter(option => option !== item.id);
            } else {
                options = [...options, item.id];
            }
        } else {
            options = [item.id];
        }

        dispatch(setCreateEtablissement({ options: options }));
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-12">
                    <h3 className="mb-5">
                        Ce que propose votre établissement
                    </h3>
                </div>
                <div className="col-12 col-md-12">
                    <div className="row">
                        {
                            data?.data.map((item, index) => (
                                <div
                                    className="col-md-3 mb-4 col-6 col-lg-3"
                                    key={index}
                                    onClick={() => handlePress(item)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div
                                        className="card p-4 text-center"
                                        style={{ border: `2px solid ${createEtablissement?.options && createEtablissement?.options.includes(item.id) ? '#CFBBA1' : 'black'}`, borderRadius: "10px" }}
                                    >
                                        <div className="icon">
                                            <img src={item.icon?.src} width={50} />
                                        </div>
                                        <div className="card-body">
                                            <p className="text-dark" style={{ fontSize: '16px' }}>{item.titre}</p>
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
                    <div style={{cursor: 'pointer'}} onClick={handleBack}>
                        Retour
                    </div>
                </div>
                <div className="col-6 appie-btn-box col-md-6 text-right">
                    <button className="main-btn" onClick={onChangeIndex}>
                        Suivant
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Step4;
