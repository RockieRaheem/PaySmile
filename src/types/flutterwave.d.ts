declare module "flutterwave-node-v3" {
  export default class Flutterwave {
    constructor(publicKey: string, secretKey: string);

    Charge: {
      card(payload: any): Promise<any>;
    };

    Transaction: {
      verify(params: { id: string }): Promise<any>;
    };
  }
}
