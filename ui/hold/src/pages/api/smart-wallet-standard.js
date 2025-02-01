import fs from "fs";
export default async function handler(req, res) {
  try {
    const result = fs
      .readFileSync("../contracts/smart-wallet-standard.clar")
      .toString();
    res.setHeader("Content-Type", "text/plain");
    res.status(200).send(result.toString());
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: "failed to fetch data" });
  }
}
