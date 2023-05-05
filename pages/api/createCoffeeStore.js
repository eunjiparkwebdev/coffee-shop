const Airtable = require("airtable");
const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_TABLENAME);

const table = base("coffee-stores");

console.log({ table });

const createCoffeeStore = async (req, res) => {
  console.log({ req });
  if (req.method === "POST") {
    const { id, name, address, imgUrl, voting } = req.body;

    try {
      if (id) {
        const findCoffeeStoreRecords = await table
          .select({
            filterByFormula: `id=${id}`,
          })
          .firstPage();
        console.log({ findCoffeeStoreRecords });
        //1.find a record if it already exists
        if (findCoffeeStoreRecords.length !== 0) {
          const records = findCoffeeStoreRecords.map((record) => {
            //you only want a fields object in each record object
            return { ...record.fields };
          });
          res.json(records);
        } else {
          ///2.ft not existing, create a record
          if (name) {
            const createRecords = await table.create([
              {
                fields: {
                  id,
                  name,
                  address,
                  voting,
                  imgUrl,
                },
              },
            ]);
            const records = createRecords.map((record) => {
              return { ...record.fields };
            });
            res.json({ records });
          } else {
            res.status(400);
            res.json({ message: "Id or name is missing. " });
          }
        }
      } else {
        res.status(400);
        res.json({ message: "Id is missing. " });
      }
    } catch (err) {
      console.error("Error creating or finding a store", err);
      res.status(500);
      res.json({ message: "Error finding store", err });
    }
  }
};

export default createCoffeeStore;
