import crypto from "crypto";

import JSONBrasileirao from "../../src/services/brasileirao";

function getHash(senha: string): string {
  const secret = "secret_bem_incomum_da_galera_montar_tabelas";
  return crypto.createHmac("sha256", secret).update(senha).digest("hex");
}

const TEST_EMAIL = "joao@gmail.com";
const TEST_PASSWORD = "123456789";

test("Brasileirao", () => {
  describe("Brasileirao", () => {
    const service = new JSONBrasileirao();
  });
});
