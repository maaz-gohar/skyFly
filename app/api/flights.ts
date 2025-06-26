import type { Flight, FlightSearchParams } from "../types";
import { apiRequest } from "./config";

// Search flights with filters - fallback to regular flights if search fails
export const searchFlights = async (params: FlightSearchParams) => {
  try {
    console.log("Searching flights with params:", params);

    const queryParams = new URLSearchParams();

    // Build query string using valid backend keys only
    if (params.origin || params.from)
      queryParams.append("origin", params.origin || params.from!);
    if (params.destination || params.to)
      queryParams.append("destination", params.destination || params.to!);
    
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toISOString().split("T")[0]; // gives 'YYYY-MM-DD'
    };

    if (params.departureDate)
      queryParams.append("departureDate", formatDate(params.departureDate));
    if (params.returnDate)
      queryParams.append("returnDate", formatDate(params.returnDate));
    if (params.passengers)
      queryParams.append("passengers", params.passengers.toString());
    if (params.class) queryParams.append("class", params.class);

    const queryString = `?${queryParams.toString()}`;
    console.log("Search query string:", queryString);

    // ✅ Call to correct endpoint
    const response = await apiRequest(`/flights/search${queryString}`);
    console.log("Search response:", response);

    if (response.data) {
      return transformFlights(response.data);
    }

    return [];
  } catch (error) {
    console.error("searchFlights error:", error);
    throw new Error("Failed to fetch flights. Please try again.");
  }
};

// Transform backend data to frontend format
const transformFlights = (flights: any[]): Flight[] => {
  console.log("Transforming flights:", flights);

  return flights.map((flight: any) => {
    // Handle both _id and id
    const id = flight._id || flight.id || Math.random().toString();

    // Calculate duration if not provided
    let duration = flight.duration;
    if (!duration && flight.departureTime && flight.arrivalTime) {
      duration = calculateDuration(flight.departureTime, flight.arrivalTime);
    } else if (typeof duration === "string") {
      // Convert string duration like "2h 30m" to minutes
      duration = parseDurationString(duration);
    }

    return {
      id,
      _id: flight._id,
      flightNumber:
        flight.flightNumber ||
        `${flight.airline?.substring(0, 2).toUpperCase()}${Math.floor(
          Math.random() * 1000
        )}`,
      airline: flight.airline || "Unknown Airline",
      logo:
        flight.logo ||
        `https://via.placeholder.com/40x40?text=${(
          flight.airline || "A"
        ).charAt(0)}`,
      origin: flight.origin || flight.from || "Unknown",
      destination: flight.destination || flight.to || "Unknown",
      departureTime: flight.departureTime || new Date().toISOString(),
      arrivalTime:
        flight.arrivalTime ||
        new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      duration: duration || 120, // Default 2 hours
      stops: flight.stops || 0,
      price: flight.price || 0,
      availableSeats: flight.availableSeats || flight.seats || 50,
      totalSeats: flight.totalSeats || 150,
      class: flight.class || "Economy",
      isActive: flight.isActive !== false,
      amenities: flight.amenities || [],
      baggage: flight.baggage || { carry: "7kg", checked: "20kg" },
    };
  });
};

// Helper function to calculate duration in minutes
const calculateDuration = (
  departureTime: string,
  arrivalTime: string
): number => {
  const departure = new Date(departureTime);
  const arrival = new Date(arrivalTime);
  return Math.floor((arrival.getTime() - departure.getTime()) / (1000 * 60));
};

// Helper function to parse duration string like "2h 30m" to minutes
const parseDurationString = (durationStr: string): number => {
  if (typeof durationStr === "number") return durationStr;

  const hours = durationStr.match(/(\d+)h/);
  const minutes = durationStr.match(/(\d+)m/);

  const h = hours ? Number.parseInt(hours[1]) : 0;
  const m = minutes ? Number.parseInt(minutes[1]) : 0;

  return h * 60 + m;
};

// Get all flights with optional filters
export const getFlights = async (params: FlightSearchParams = {}) => {
  try {
    console.log("Getting flights with params:", params);

    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    const queryString = queryParams.toString()
      ? `?${queryParams.toString()}`
      : "";
    console.log("Query string:", queryString);

    const response = await apiRequest(`/flights${queryString}`);
    console.log("Get flights response:", response);

    if (response.data) {
      return transformFlights(response.data);
    } else if (Array.isArray(response)) {
      return transformFlights(response);
    }

    return [];
  } catch (error) {
    console.error("Get flights error:", error);
    throw error;
  }
};

// Get flight by ID
export const getFlightById = async (id: string): Promise<Flight> => {
  try {
    console.log("Getting flight by ID:", id);

    const response = await apiRequest(`/flights/${id}`);
    console.log("Get flight by ID response:", response);

    const flight = response.data || response;
    return transformFlights([flight])[0];
  } catch (error) {
    console.error("Get flight by ID error:", error);
    throw error;
  }
};

// Admin: Create new flight
export const createFlight = async (flightData: any) => {
  return await apiRequest("/flights", "POST", flightData, true);
};

// Admin: Update flight
export const updateFlight = async (id: string, flightData: any) => {
  return await apiRequest(`/flights/${id}`, "PUT", flightData, true);
};

// Admin: Delete flight
export const deleteFlight = async (id: string) => {
  return await apiRequest(`/flights/${id}`, "DELETE", null, true);
};
