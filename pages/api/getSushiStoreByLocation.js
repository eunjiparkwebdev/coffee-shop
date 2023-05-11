import { FetchSushiStores } from "@/lib/sushi-store";

const getSushiStoreByLocation = async (req, res) => {
  try {
    const { latitude, longitude, limit } = req.query;

    const response = await FetchSushiStores(latitude, longitude, limit);
    res.status(200);
    res.json(response);
  } catch (err) {
    console.error("There is an error", err);
    res.status(500);
    res.json({ message: "something  went wrong", err });
  }
};

export default getSushiStoreByLocation;
