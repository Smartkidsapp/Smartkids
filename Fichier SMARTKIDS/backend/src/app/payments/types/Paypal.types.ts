export interface PaypalOauthTokenResponse {
  scope: string;
  access_token: string;
  token_type: 'Bearer';
  app_id: string;
  expires_in: number;
  nonce: string;
}

export interface PaypalSetupTokenResponse {
  payment_source: {
    card?: {
      name: string;
      last_digits: string;
      verification: {
        network_transaction_id: string;
        time: string;
        amount: {
          currency_code: string;
          value: string;
        };
        processor_response: {
          avs_code: 'A';
          cvv_code: 'E';
        };
        three_d_secure: null;
      };
      brand: 'VISA';
      expiry: string;
      verification_status: string;
    };
    paypal?: {
      email_address: string;
      name: {
        full_name: string;
      };
      phone: {
        phone_type: 'FAX';
        phone_number: {
          country_code: string;
          national_number: string;
          extension_number: string;
        };
      };
      address: {
        address_line_1: string;
        address_line_2: string;
        admin_area_2: string;
        admin_area_1: string;
        postal_code: string;
        country_code: 'st';
      };
      account_id: string;
      phone_number: {
        country_code: string;
        national_number: string;
        extension_number: string;
      };
    };
    venmo?: {
      email_address: string;
      name: {
        full_name: string;
      };
      phone: {
        phone_type: 'FAX';
        phone_number: {
          country_code: string;
          national_number: string;
          extension_number: string;
        };
      };
      address: {
        address_line_1: string;
        address_line_2: string;
        admin_area_2: string;
        admin_area_1: string;
        postal_code: string;
        country_code: 'st';
      };
      user_name: string;
    };
  };
  links: [
    {
      href: string;
      rel: string;
      method: 'GET';
    },
  ];
  id: string;
  ordinal: 1;
  customer: {
    id: string;
  };
  status: 'CREATED';
}

export interface PaypalPaymentTokenResponse {
  payment_source: {
    card: {
      name: string;
      last_digits: string;
      verification: {
        network_transaction_id: string;
        time: string;
        amount: {
          currency_code: string;
          value: string;
        };
        processor_response: {
          avs_code: 'A';
          cvv_code: 'E';
        };
        three_d_secure: null;
      };
      brand: 'VISA';
      expiry: string;
      verification_status: string;
    };
    paypal: {
      email_address: string;
      name: {
        full_name: string;
      };
      phone: {
        phone_type: 'FAX';
        phone_number: {
          country_code: string;
          national_number: string;
          extension_number: string;
        };
      };
      address: {
        address_line_1: string;
        address_line_2: string;
        admin_area_2: string;
        admin_area_1: string;
        postal_code: string;
        country_code: 'st';
      };
      account_id: string;
      phone_number: {
        country_code: string;
        national_number: string;
        extension_number: string;
      };
    };
    venmo: {
      email_address: string;
      name: {
        full_name: string;
      };
      phone: {
        phone_type: 'FAX';
        phone_number: {
          country_code: string;
          national_number: string;
          extension_number: string;
        };
      };
      address: {
        address_line_1: string;
        address_line_2: string;
        admin_area_2: string;
        admin_area_1: string;
        postal_code: string;
        country_code: 'st';
      };
      user_name: string;
    };
    apple_pay: {
      card: {
        name: string;
        last_digits: string;
        type: 'CREDIT';
        brand: 'VISA';
        billing_address: {
          address_line_1: string;
          address_line_2: string;
          admin_area_2: string;
          admin_area_1: string;
          postal_code: string;
          country_code: 'st';
        };
      };
    };
    bank: {
      ach_debit: {
        verification_status: 'NOT_VERIFIED';
      };
    };
  };
  links: [
    {
      href: string;
      rel: string;
      method: 'GET';
    },
  ];
  id: string;
  customer: {
    id: string;
  };
}

export interface PaypalOrderRequest {
  purchase_units?: [
    {
      reference_id?: string;
      description?: string;
      custom_id?: string;
      invoice_id?: string;
      soft_descriptor?: string;
      items?: [
        {
          name: string;
          quantity: string;
          description: string;
          sku: string;
          url: 'http://example.com';
          category: 'DIGITAL_GOODS';
          image_url: 'http://example.com';
          unit_amount: {
            currency_code: string;
            value: string;
          };
          tax: {
            currency_code: string;
            value: string;
          };
          upc: {
            type: 'UPC-A';
            code: string;
          };
        },
      ];
      amount: {
        currency_code: string;
        value: string;
        breakdown?: {
          item_total: {
            currency_code: string;
            value: string;
          };
          shipping: {
            currency_code: string;
            value: string;
          };
          handling: {
            currency_code: string;
            value: string;
          };
          tax_total: {
            currency_code: string;
            value: string;
          };
          insurance: {
            currency_code: string;
            value: string;
          };
          shipping_discount: {
            currency_code: string;
            value: string;
          };
          discount: {
            currency_code: string;
            value: string;
          };
        };
      };
      payee?: {
        email_address: string;
        merchant_id: string;
      };
      payment_instruction?: {
        platform_fees: [
          {
            amount: {
              currency_code: string;
              value: string;
            };
            payee: {
              email_address: string;
              merchant_id: string;
            };
          },
        ];
        payee_pricing_tier_id: string;
        payee_receivable_fx_rate_id: string;
        disbursement_mode: 'INSTANT';
      };
      shipping?: {
        type: 'SHIPPING';
        options: [
          {
            id: string;
            label: string;
            selected: true;
            type: 'SHIPPING';
            amount: {
              currency_code: string;
              value: string;
            };
          },
        ];
        name: {
          given_name: string;
          surname: string;
        };
        address: {
          address_line_1: string;
          address_line_2: string;
          admin_area_2: string;
          admin_area_1: string;
          postal_code: string;
          country_code: 'st';
        };
      };
      supplementary_data?: {
        card: {
          level_2: {
            invoice_id: string;
            tax_total: {
              currency_code: string;
              value: string;
            };
          };
          level_3: {
            ships_from_postal_code: string;
            line_items: [
              {
                name: null;
                quantity: null;
                description: null;
                sku: null;
                url: null;
                category: null;
                image_url: null;
                unit_amount: null;
                tax: null;
                upc: null;
                commodity_code: null;
                unit_of_measure: null;
                discount_amount: null;
                total_amount: null;
              },
            ];
            shipping_amount: {
              currency_code: string;
              value: string;
            };
            duty_amount: {
              currency_code: string;
              value: string;
            };
            discount_amount: {
              currency_code: string;
              value: string;
            };
            shipping_address: {
              address_line_1: string;
              address_line_2: string;
              admin_area_2: string;
              admin_area_1: string;
              postal_code: string;
              country_code: 'st';
            };
          };
        };
      };
    },
  ];
  intent: 'CAPTURE';
  payer?: {
    email_address: string;
    payer_id: string;
    name: {
      given_name: string;
      surname: string;
    };
    phone: {
      phone_type: 'FAX';
      phone_number: {
        national_number: string;
      };
    };
    birth_date: 'stringstri';
    tax_info: {
      tax_id: string;
      tax_id_type: 'BR_CPF';
    };
    address: {
      address_line_1: string;
      address_line_2: string;
      admin_area_2: string;
      admin_area_1: string;
      postal_code: string;
      country_code: 'st';
    };
  };
  payment_source: {
    paypal: {
      vault_id: string;
    };
  };
}

export interface PayPalOrderResponse {
  id: string;
  status: string;
  payment_source: {
    paypal: {
      email_address: string;
      account_id: string;
      name: {
        given_name: string;
        surname: string;
      };
      address: {
        country_code: string;
      };
    };
  };
  purchase_units: Array<{
    reference_id: string;
    payments: {
      captures: Array<{
        id: string;
        status: string;
        amount: {
          currency_code: string;
          value: string;
        };
        final_capture: boolean;
        seller_protection: {
          status: string;
          dispute_categories: string[];
        };
        seller_receivable_breakdown: {
          gross_amount: {
            currency_code: string;
            value: string;
          };
          paypal_fee: {
            currency_code: string;
            value: string;
          };
          net_amount: {
            currency_code: string;
            value: string;
          };
        };
        links: Array<{
          href: string;
          rel: string;
          method: string;
        }>;
        create_time: string;
        update_time: string;
      }>;
    };
  }>;
  payer: {
    name: {
      given_name: string;
      surname: string;
    };
    email_address: string;
    payer_id: string;
    address: {
      country_code: string;
    };
  };
  links: Array<{
    href: string;
    rel: string;
    method: string;
  }>;
}

export interface PaypalProductResponse {
  id: string;
  name: string;
  description: string;
  type: string;
  category: string;
  image_url: 'http://example.com';
  home_url: 'http://example.com';
  links: [
    {
      href: string;
      rel: string;
      method: 'GET';
    },
  ];
  create_time: string;
  update_time: string;
}

export interface PaypalPlanResponse {
  id: string;
  product_id: string;
  name: string;
  status: string;
  description: string;
  billing_cycles: [
    {
      tenure_type: string;
      sequence: number;
      total_cycles: number;
      pricing_scheme: {
        version: number;
        pricing_model: string;
        tiers: [
          {
            starting_quantity: string;
            ending_quantity: string;
            amount: {
              currency_code: string;
              value: string;
            };
          },
        ];
        fixed_price: {
          currency_code: string;
          value: string;
        };
        create_time: string;
        update_time: string;
      };
      frequency: {
        interval_unit: string;
        interval_count: number;
      };
    },
  ];
  quantity_supported: false;
  links: [
    {
      href: string;
      rel: string;
      method: 'GET';
    },
  ];
  payment_preferences: {
    auto_bill_outstanding: true;
    setup_fee_failure_action: 'CONTINUE';
    payment_failure_threshold: number;
    setup_fee: {
      currency_code: string;
      value: string;
    };
  };
  taxes: {
    inclusive: true;
    percentage: string;
  };
  create_time: string;
  update_time: string;
}

export interface PaypalSubscriptionReponse {
  status: string;
  status_change_note: string;
  status_update_time: string;
  id: string;
  plan_id: string;
  quantity: string;
  custom_id: string;
  plan_overridden: true;
  links: [
    {
      href: string;
      rel: string;
      method: 'GET';
    },
  ];
  start_time: string;
  shipping_amount: {
    currency_code: string;
    value: string;
  };
  subscriber: {
    email_address: string;
    payer_id: string;
    name: {
      given_name: string;
      surname: string;
    };
    phone: {
      phone_type: string;
      phone_number: {
        national_number: string;
      };
    };
    shipping_address: {
      type: string;
      name: {
        given_name: string;
        surname: string;
      };
      address: {
        address_line_1: string;
        address_line_2: string;
        admin_area_2: string;
        admin_area_1: string;
        postal_code: string;
        country_code: 'st';
      };
    };
    payment_source: {
      card: {
        name: string;
        last_digits: string;
        verification: {
          network_transaction_id: string;
          time: string;
          amount: {
            currency_code: string;
            value: string;
          };
          processor_response: {
            avs_code: 'A';
            cvv_code: 'E';
          };
          three_d_secure: null;
        };
        brand: 'VISA';
        expiry: string;
        verification_status: string;
      };
      paypal: {
        email_address: string;
        name: {
          full_name: string;
        };
        phone: {
          phone_type: 'FAX';
          phone_number: {
            country_code: string;
            national_number: string;
            extension_number: string;
          };
        };
        address: {
          address_line_1: string;
          address_line_2: string;
          admin_area_2: string;
          admin_area_1: string;
          postal_code: string;
          country_code: 'st';
        };
        account_id: string;
        phone_number: {
          country_code: string;
          national_number: string;
          extension_number: string;
        };
      };
      venmo: {
        email_address: string;
        name: {
          full_name: string;
        };
        phone: {
          phone_type: 'FAX';
          phone_number: {
            country_code: string;
            national_number: string;
            extension_number: string;
          };
        };
        address: {
          address_line_1: string;
          address_line_2: string;
          admin_area_2: string;
          admin_area_1: string;
          postal_code: string;
          country_code: 'st';
        };
        user_name: string;
      };
      apple_pay: {
        card: {
          name: string;
          last_digits: string;
          type: 'CREDIT';
          brand: 'VISA';
          billing_address: {
            address_line_1: string;
            address_line_2: string;
            admin_area_2: string;
            admin_area_1: string;
            postal_code: string;
            country_code: 'st';
          };
        };
      };
      bank: {
        ach_debit: {
          verification_status: 'NOT_VERIFIED';
        };
      };
    };
  };
  billing_info: {
    cycle_executions: [
      {
        tenure_type: 'REGULAR';
        sequence: 99;
        cycles_completed: 9999;
        cycles_remaining: 9999;
        current_pricing_scheme_version: 1;
        total_cycles: 999;
      },
    ];
    failed_payments_count: 999;
    outstanding_balance: {
      currency_code: string;
      value: string;
    };
    last_payment: {
      status: 'COMPLETED';
      amount: {
        currency_code: string;
        value: string;
      };
      time: string;
    };
    next_billing_time: string;
    final_payment_time: string;
    last_failed_payment: {
      reason_code: 'PAYMENT_DENIED';
      amount: {
        currency_code: string;
        value: string;
      };
      time: string;
      next_payment_retry_time: string;
    };
  };
  create_time: string;
  update_time: string;
  plan: {
    product_id: string;
    name: string;
    description: string;
    billing_cycles: [
      {
        tenure_type: 'REGULAR';
        sequence: 1;
        total_cycles: 1;
        pricing_scheme: {
          version: 999;
          pricing_model: 'VOLUME';
          tiers: [
            {
              starting_quantity: string;
              ending_quantity: string;
              amount: {
                currency_code: null;
                value: null;
              };
            },
          ];
          fixed_price: {
            currency_code: string;
            value: string;
          };
          create_time: string;
          update_time: string;
        };
        frequency: {
          interval_unit: 'DAY';
          interval_count: 1;
        };
      },
    ];
    quantity_supported: false;
    payment_preferences: {
      auto_bill_outstanding: true;
      setup_fee_failure_action: 'CONTINUE';
      payment_failure_threshold: 0;
      setup_fee: {
        currency_code: string;
        value: string;
      };
    };
    taxes: {
      inclusive: true;
      percentage: string;
    };
  };
}

export interface RefundResponse {
  status: 'CANCELLED' | 'FAILED' | 'PENDING' | 'COMPLETED';
  status_details: {
    reason: 'ECHECK';
  };
  id: 'string';
  invoice_id: 'string';
  custom_id: 'string';
  acquirer_reference_number: 'string';
  note_to_payer: 'string';
  seller_payable_breakdown: {
    platform_fees: [
      {
        amount: {
          currency_code: 'str';
          value: 'string';
        };
        payee: {
          email_address: 'string';
          merchant_id: 'stringstrings';
        };
      },
    ];
    net_amount_breakdown: [
      {
        payable_amount: {
          currency_code: 'str';
          value: 'string';
        };
        converted_amount: {
          currency_code: 'str';
          value: 'string';
        };
        exchange_rate: {
          value: 'string';
          source_currency: 'str';
          target_currency: 'str';
        };
      },
    ];
    gross_amount: {
      currency_code: 'str';
      value: 'string';
    };
    paypal_fee: {
      currency_code: 'str';
      value: 'string';
    };
    paypal_fee_in_receivable_currency: {
      currency_code: 'str';
      value: 'string';
    };
    net_amount: {
      currency_code: 'str';
      value: 'string';
    };
    net_amount_in_receivable_currency: {
      currency_code: 'str';
      value: 'string';
    };
    total_refunded_amount: {
      currency_code: 'str';
      value: 'string';
    };
  };
  links: [
    {
      href: 'string';
      rel: 'string';
      method: 'GET';
    },
  ];
  amount: {
    currency_code: 'str';
    value: 'string';
  };
  payer: {
    email_address: 'string';
    merchant_id: 'stringstrings';
  };
  create_time: 'stringstringstringst';
  update_time: 'stringstringstringst';
}
