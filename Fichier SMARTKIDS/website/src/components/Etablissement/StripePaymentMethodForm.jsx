import React, { useCallback, useEffect, useState } from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap';

export default function StripePaymentMethodForm() {
    const [accessToken, setAccessToken] = useState();

    useEffect(() => {
        let localAccessToken = localStorage.getItem("access_token");
        if (localAccessToken) {
            setAccessToken(localAccessToken);
        }
    }, []);

    const handleIframeMessage = useCallback(
        (event) => {
            const msg = event.data;
            const { message, status } = JSON.parse(msg);

            if (status === 'ERROR') {
                console.error({ message });
                return;
            }

            alert(message);

            if (status === 'SUCCESS') {
                //resetList(undefined, false);
            }
        },
        []
    );

    useEffect(() => {
        window.addEventListener('message', handleIframeMessage);
        return () => {
            window.removeEventListener('message', handleIframeMessage);
        };
    }, [handleIframeMessage]);

    return (
        <div className="content-container">
            {accessToken ? (
                <iframe
                    title="Stripe Payment"
                    src={`https://payments-gateway.smartkidsapp.com/stripe-web?token=${accessToken}&redirect_status=no`}
                    style={{ width: '100%', height: '500px', border: 'none' }}
                />
            ) : (
                <div className="text-center">
                    <span>Chargement...</span>
                </div>
            )}
        </div>
    );
}
