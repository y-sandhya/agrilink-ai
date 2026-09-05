import express from "express";

const router = express.Router();

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
const OSRM_URL = "https://router.project-osrm.org/route/v1/driving";

const geocodeCache = new Map();

/**
 * Clean AGMARKNET market names before geocoding.
 * Example:
 * "Madanapalli APMC" -> "Madanapalli"
 * "Madanapalli Sub-yard" -> "Madanapalli"
 */
function cleanPlaceName(place) {
  return place
    .replace(/\bAPMC\b/gi, "")
    .replace(/\bSub[- ]?yard\b/gi, "")
    .replace(/\bAMC\b/gi, "")
    .replace(/\s+/g, " ")
    .replace(/,\s*,/g, ",")
    .trim()
    .replace(/^,\s*/, "")
    .replace(/,\s*$/, "");
}

/**
 * Geocode a place using OpenStreetMap Nominatim.
 * Tries several versions of the location if necessary.
 */
async function geocodePlace(place) {
  const originalPlace = place.trim();
  const cacheKey = originalPlace.toLowerCase();

  if (geocodeCache.has(cacheKey)) {
    return geocodeCache.get(cacheKey);
  }

  const cleanedPlace = cleanPlaceName(originalPlace);

  const queries = [
    originalPlace,
    cleanedPlace
  ];

  // Remove duplicate queries
  const uniqueQueries = [...new Set(
    queries
      .map((query) => query.trim())
      .filter(Boolean)
  )];

  for (const query of uniqueQueries) {
    try {
      const url =
        `${NOMINATIM_URL}?format=jsonv2&limit=1` +
        `&countrycodes=in` +
        `&q=${encodeURIComponent(query)}`;

      console.log(`Geocoding: ${query}`);

      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
          "Accept-Language": "en",
          "User-Agent": "AgriLink-AI/1.0"
        }
      });

      if (!response.ok) {
        console.log(
          `Geocoding request failed: ${response.status}`
        );
        continue;
      }

      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        const coordinates = {
          lat: Number(data[0].lat),
          lon: Number(data[0].lon),
          display_name: data[0].display_name
        };

        geocodeCache.set(cacheKey, coordinates);

        console.log(
          `Found: ${data[0].display_name}`
        );

        return coordinates;
      }
    } catch (error) {
      console.error(
        `Geocoding error for "${query}":`,
        error.message
      );
    }
  }

  throw new Error(
    `Location not found: ${originalPlace}`
  );
}

/**
 * Calculate real driving distance using OSRM.
 */
async function getRoadRoute(origin, destination) {
  const url =
    `${OSRM_URL}/` +
    `${origin.lon},${origin.lat};` +
    `${destination.lon},${destination.lat}` +
    `?overview=false`;

  console.log("Calculating road route...");

  const response = await fetch(url, {
    headers: {
      Accept: "application/json"
    }
  });

  if (!response.ok) {
    throw new Error(
      `Routing service failed: ${response.status}`
    );
  }

  const data = await response.json();

  if (
    data.code !== "Ok" ||
    !data.routes ||
    data.routes.length === 0
  ) {
    throw new Error("No road route found");
  }

  const route = data.routes[0];

  return {
    distance_km: Number(
      (route.distance / 1000).toFixed(1)
    ),
    duration_minutes: Math.round(
      route.duration / 60
    )
  };
}

/**
 * GET /api/route
 *
 * Example:
 * /api/route?origin=Madanapalle,Andhra Pradesh&destination=Madanapalle,Andhra Pradesh,India
 */
router.get("/route", async (req, res) => {
  try {
    const origin = String(
      req.query.origin || ""
    ).trim();

    const destination = String(
      req.query.destination || ""
    ).trim();

    if (!origin || !destination) {
      return res.status(400).json({
        ok: false,
        error:
          "origin and destination are required"
      });
    }

    console.log("");
    console.log("=================================");
    console.log("ROUTE REQUEST");
    console.log("Origin:", origin);
    console.log("Destination:", destination);
    console.log("=================================");

    // Geocode farmer location
    const originCoordinates =
      await geocodePlace(origin);

    // Geocode market location
    const destinationCoordinates =
      await geocodePlace(destination);

    // Calculate actual driving route
    const route = await getRoadRoute(
      originCoordinates,
      destinationCoordinates
    );

    const result = {
      ok: true,

      origin,
      destination,

      distance_km: route.distance_km,

      duration_minutes:
        route.duration_minutes,

      origin_coordinates: {
        lat: originCoordinates.lat,
        lon: originCoordinates.lon
      },

      destination_coordinates: {
        lat: destinationCoordinates.lat,
        lon: destinationCoordinates.lon
      }
    };

    console.log(
      `Distance: ${route.distance_km} km`
    );

    console.log(
      `Duration: ${route.duration_minutes} minutes`
    );

    console.log("=================================");
    console.log("");

    return res.json(result);

  } catch (error) {
    console.error(
      "Route API error:",
      error
    );

    return res.status(500).json({
      ok: false,
      error:
        error.message ||
        "Unable to calculate route"
    });
  }
});

export default router;