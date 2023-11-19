import { describe, it, expect } from "@jest/globals";
import { randomUUID } from "crypto";
import createUser from "./createUser";

describe("Creating user", () => {
  it.only("Should return user object with correct attributes", async () => {
    const nonce = randomUUID();
    const newUser = await createUser(
      "0x5D5C86fE8dfE9445A231469fDdD576E7E18C923f",
      "username",
      ["user"],
      "name",
      "",
      "",
      nonce,
    );
    expect(newUser.eAddr).toBe("0x5D5C86fE8dfE9445A231469fDdD576E7E18C923f");
  });
});
