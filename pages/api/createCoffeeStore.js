import { table, getMinifiedRecords, findRecordByFilter } from "@/lib/airtable";

const createCoffeeStore = async (req, res) => {
  if (req.method === "POST") {
    const { id, name, address, city, zip_code, img_url, voting } = req.body;

    try {
      if (id) {
        const records = await findRecordByFilter(id);
        //1.find a record if it already exists
        if (records.length !== 0) {
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
                  city,
                  zip_code,
                  voting,
                  img_url,
                },
              },
            ]);
            const records = getMinifiedRecords(createRecords);
            res.json(records);
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
