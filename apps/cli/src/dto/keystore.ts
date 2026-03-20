import { Schema } from "effect";

export const GetKeystoreParams = Schema.Struct({
  alias: Schema.String.annotate({
    description: "The alias of the wallet to retrieve",
  }),
});

export const ListKeystoreParams = Schema.Void;

export const CreateKeystoreParams = Schema.Struct({
  alias: Schema.String.annotate({
    description: "The alias of the wallet to create",
  }),
  password: Schema.redact(Schema.String).annotate({
    description: "The password to encrypt the keystore with",
  }),
});

export const DecryptKeystoreParams = Schema.Struct({
  alias: Schema.String.annotate({
    description: "The alias of the keystore to decrypt",
  }),
  password: Schema.redact(Schema.String).annotate({
    description: "The password to decrypt the keystore with",
  }),
});

export const DecryptKeystoreResponse = Schema.Struct({
  address: Schema.String.annotate({
    description: "The address of the keystore",
  }),
  alias: Schema.String.annotate({
    description: "The alias of the keystore",
  }),
  privateKey: Schema.Redacted(Schema.String).annotate({
    description: "The private key of the keystore",
  }),
  publicKey: Schema.String.annotate({
    description: "The public key of the keystore",
  }),
});

export const ImportKeystoreParams = Schema.Struct({
  alias: Schema.String.annotate({
    description: "The alias of the keystore to import",
  }),
  privateKey: Schema.String.annotate({
    description: "The private key of the keystore to import",
  }),
  password: Schema.Redacted(Schema.String).annotate({
    description: "The password to encrypt the keystore with",
  }),
});

export type GetKeystoreParams = typeof GetKeystoreParams.Type;
export type ListKeystoreParams = typeof ListKeystoreParams.Type;
export type CreateKeystoreParams = typeof CreateKeystoreParams.Type;
export type DecryptKeystoreParams = typeof DecryptKeystoreParams.Type;
export type DecryptKeystoreResponse = typeof DecryptKeystoreResponse.Type;
export type ImportKeystoreParams = typeof ImportKeystoreParams.Type;
