import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FaSearchLocation } from "react-icons/fa";

// Main Locator Component
const FinStartLocator: React.FC = () => {
    const [location, setLocation] = useState('');
    const [banks, setBanks] = useState<any[]>([]);
    const [userLocation, setUserLocation] = useState({ lat: 19.136932, lon: 72.855920 }); // Default: Mumbai

    // Haversine formula to calculate distance between two coordinates
    const haversine = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371; // Radius of Earth in km
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) ** 2;
        return (2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(2);
    };

    // Fetch user's current location (optional)
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({ lat: position.coords.latitude, lon: position.coords.longitude });
                },
                (error) => console.warn("Geolocation not allowed:", error)
            );
        }
    }, []);

    // Fetch banks from your backend server
    const fetchBanks = async () => {
        if (!location) return;
        try {
          const response = await fetch(`/api/fetchBanks?location=${location}`);
      
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
      
          const data = await response.json();
          console.log("API Response:", data);
      
          if (data.banks) {
            const formattedBanks = data.banks.map((bank: any) => ({
              name: bank.title,
              address: bank.address,
              rating: bank.rating || "N/A",
              lat: bank.gps_coordinates.latitude,
              lon: bank.gps_coordinates.longitude,
            }));
      
            setBanks(formattedBanks);
            toast.success('Microfinance banks fetched successfully!');
          } else {
            toast.error("No microfinance banks found for this location.");
          }
        } catch (error) {
          console.error('Error fetching banks:', error);
          toast.error('Error fetching banks. Please try again.');
        }
      };
      

    return (
        <div className="min-h-screen bg-gradient-to-b from-yellow-400 to-white py-12 p-6">
            <div className="container mx-auto space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">Microfinance Locator</h2>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="bg-white p-6 rounded-lg shadow-lg space-y-4"
                >
                    <input
                        type="text"
                        placeholder="Enter location (e.g., Mumbai)"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full p-3 bg-gray-100 text-gray-800 rounded-lg border border-yellow-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-300 transition-all"
                    />
                    <motion.button
                        onClick={fetchBanks}
                        className="flex w-full items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-all transform hover:scale-105"
                        whileHover={{ scale: 1.05 }}
                    >
                        <FaSearchLocation className="h-5 w-5" />
                        Find Microfinance Banks
                    </motion.button>
                </motion.div>

                <div className="mt-6 h-96 w-full rounded-lg overflow-hidden">
                    <MapContainer center={[userLocation.lat, userLocation.lon]} zoom={12} className="h-full w-full">
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        {banks.map((bank, index) => (
                            <Marker key={index} position={[bank.lat, bank.lon]}>
                                <Popup>
                                    <strong>{bank.name}</strong><br />
                                    📍 {bank.address}<br />
                                    ⭐ Rating: {bank.rating}<br />
                                    📏 Distance: {bank.distance} km<br />
                                    <a
                                        href={`https://www.google.com/maps/dir/?api=1&destination=${bank.lat},${bank.lon}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-400 hover:underline"
                                    >
                                        🗺️ Get Directions
                                    </a>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>
            </div>
        </div>
    );
};

export default FinStartLocator;
