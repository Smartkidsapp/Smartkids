import React, { useEffect } from "react";
import { Button, Card } from "react-bootstrap";
import { useLazyListStripePaymentMethodsQuery } from "../../features/user/userApiSlice";
import visa from '../../assets/images/visa.png';
import StripePaymentMethodForm from "./StripePaymentMethodForm";

export default function StripePaymentMethods({
    onMethodSelected,
    selectedMethod,
}) {

    const [list, { data, isFetching }] = useLazyListStripePaymentMethodsQuery();

    useEffect(() => {
        const id = setInterval(() => {
            list();
        }, 3000);

        return () => {
            clearTimeout(id);
        };
    }, []);

    return (
        <div className="d-flex flex-column" style={{ gap: 16 }}>
            {(data?.data)?.map((method, idx) => (
                <div onClick={() =>
                    onMethodSelected?.({
                        label: `**** ${method.last_four}`,
                        type: 'stripe',
                        value: method.id,
                    })}
                    className="d-flex justify-content-between align-items-center mt-3"
                    style={{ backgroundColor: 'rgba(0, 194, 242, 0.15)', borderRadius: 5, height: 55, padding: 15, cursor: 'pointer' }}
                >
                    <div className="d-flex align-items-center" style={{ gap: 10 }}>
                        {method.id === selectedMethod && (
                            <div
                                style={{
                                    backgroundColor: '#CFBBA1',
                                    height: 15,
                                    width: 15,
                                    borderRadius: 100
                                }}
                            >
                            </div>
                        )}

                        {method.id !== selectedMethod && (
                            <div
                                style={{
                                    border: '2px solid #CFBBA1',
                                    height: 15,
                                    width: 15,
                                    borderRadius: 100
                                }}
                            >
                            </div>
                        )}
                        <img src={visa} style={{ height: 15 }} />
                        <span className="m-0">
                            **** {method.last_four}
                        </span>
                    </div>
                    {/*<Button className="btn btn-danger btn-sm" onClick={() => { }}>
                        <i className="fa fa-trash"></i>
                    </Button>*/}
                </div>
            ))}

            {!isFetching && data?.data?.length === 0 ? (
                <div className="d-flex justify-content-between align-items-center mt-3" style={{ backgroundColor: 'rgba(0, 194, 242, 0.15)', borderRadius: 5, height: 55, padding: 15 }}>
                    <span className="m-0">
                        Vous n'avez enregistré aucune carte de crédit.
                    </span>
                </div>
            ) : null}
        </div>
    );
}
