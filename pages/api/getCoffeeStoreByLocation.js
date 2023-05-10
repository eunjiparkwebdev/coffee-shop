import { FetchCoffeeStores } from "@/lib/coffee-store";

const getCoffeeStoreByLocation = async (req, res) => {
  try {
    const { latitude, longitude, limit } = req.query;

    const response = await FetchCoffeeStores(latitude, longitude, limit);
    res.status(200);
    res.json(response);
    console.log(response);
  } catch (err) {
    console.error("There is an error", err);
    res.status(500);
    res.json({ message: "something  went wrong", err });
  }
};

export default getCoffeeStoreByLocation;
