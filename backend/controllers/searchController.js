import Hotel from "../models/Hotel.js";

/**
 * Get search suggestions based on query
 * Returns hotel names and locations
 */
export const getSearchSuggestions = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q || q.trim().length === 0) {
            return res.json({ suggestions: [] });
        }

        const query = q.trim();
        const regex = new RegExp(query, "i"); // Case-insensitive search

        // Find hotels matching the query in name or location
        const hotels = await Hotel.find({
            $or: [
                { hotelName: { $regex: regex } },
                { location: { $regex: regex } },
            ],
        })
            .select("hotelName location images")
            .limit(8);

        // Create suggestions array
        const suggestions = [];
        const locationSet = new Set();
        const hotelSet = new Set();

        // Add unique locations first
        hotels.forEach((hotel) => {
            const locationLower = hotel.location.toLowerCase();
            if (
                locationLower.includes(query.toLowerCase()) &&
                !locationSet.has(locationLower)
            ) {
                locationSet.add(locationLower);
                suggestions.push({
                    type: "location",
                    text: hotel.location,
                    icon: "📍",
                });
            }
        });

        // Add unique hotel names
        hotels.forEach((hotel) => {
            const hotelNameLower = hotel.hotelName.toLowerCase();
            if (
                hotelNameLower.includes(query.toLowerCase()) &&
                !hotelSet.has(hotelNameLower)
            ) {
                hotelSet.add(hotelNameLower);
                suggestions.push({
                    type: "hotel",
                    text: hotel.hotelName,
                    location: hotel.location,
                    image: hotel.images && hotel.images[0] ? hotel.images[0] : null,
                    icon: "🏨",
                    hotelId: hotel._id,
                });
            }
        });

        // Limit to 8 total suggestions
        const limitedSuggestions = suggestions.slice(0, 8);

        res.json({ suggestions: limitedSuggestions });
    } catch (error) {
        console.error("Search suggestions error:", error);
        res.status(500).json({ message: error.message });
    }
};
