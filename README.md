# Mojaloop SDK Example Scheme Adapter

This package provides an example of a scheme adapter that interfaces between a Mojaloop API compliant switch and a DFSP backend platform that oes not natively implement the Mojaloop API.

The demonstrated API between the scheme adapter and the DFSP backend is synchronous HTTP while the interface between the scheme adapter and the switch is native Mojaloop API.

This package exemplifies the use of the Mojaloop SDK Standard Components for TLS, JWS and ILP (available [here](www.github.com/modusbox/mojaloop-sdk-standard-components)).

## DFSP Backend API

DFSP backends must implement the [DFSP Inbound API](docs/dfspInboundApi.yaml) in order for the scheme adapter to make incoming transfers i.e. to receive funds to a customer account.

DFSP backends can call the [DFSP Outbound API](/src/outboundApi/api.yaml) in order to make outgoing transfers i.e. to send funds from a customer account.