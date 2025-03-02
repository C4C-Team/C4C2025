import React, { useEffect, useState, type ReactHTMLElement } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import axios from 'axios';


// from here; this is the fake db, the events that we would get
// from the db. We we will also getting the longtitude and latitude

  // A component to render each event
  interface EventCardProps {
    id: number;
    image: string;
    description: string;
    severity: string;
  }
  
  const EventCard = ({ image, description, severity }: EventCardProps) => (
    <div className="event-card" style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
      <img src={image} alt={description} style={{ width: '10vw', height: '150px', objectFit: 'cover' }} />
      <div style={{ marginTop: '0.5rem' }}>
        <p>{description}</p>
        <p>Severity: {severity}</p>
      </div>
    </div>
  );

export function MyComponent() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  });

  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [pins, setPins] = useState<{ lat: number; lng: number; title: string }[]>([]);
  const [events, setEvents] = useState<{ id: number; image: string; description: string; severity: string }[]>([]);

  const [testPins, setTest] = useState<any[]>([]);
  const [showEvents, setShowEvents] = useState(false);

  // mouse hover event
  const [menuSelect, setmenuSelect] = useState(true);

  interface Pin {
    lat: number;
    lng: number;
    title: string;
  }

  // Get current location using the Geolocation API
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;    


          setCurrentLocation({
            lat: lat,
            lng: lng,
          });
          const nearby = generateNearbyPins(lat, lng, 5);
          setTest(nearby);
        },
        (error) => {
          console.error("Error getting location:", error);
          // Fallback location (e.g., New York City)
          setCurrentLocation({ lat: 40.7128, lng: -74.006 });
        }
      );
    }
  }, []);



// This is for testing
const generateNearbyPins = (lat: number, lng: number, count: number): Pin[] => {
    const pins: Pin[] = [];
    for (let i = 0; i < count; i++) {
        // Generate random offset (roughly within a few miles)
        const latOffset = (Math.random() - 0.5) * 0.05;
        const lngOffset = (Math.random() - 0.5) * 0.05;
        
        pins.push({
            lat: lat + latOffset,
            lng: lng + lngOffset,
            title: `Test Pin ${i+1}`
        });
    }
    return pins;
};

  // Fetch existing pins from MongoDB
  useEffect(() => {
    axios.get('https://c4c2025-back.onrender.com/api/products')
      .then(response => {
        if (response.data && Array.isArray(response.data.data)) {
          const data = response.data.data;
          
         // Separate pins and events from the response
        const fetchedPins = data
        .filter((product: any) => product.location)
        .map((product: any) => ({
          lat: product.location.lat,
          lng: product.location.lng,
          title: product.description || `Pin ${product._id}`
        }));

       const fetchedEvents = data
         .map((product: any) => ({
           id: product._id,
           image: product.image,
           description: product.description,
           severity: product.severity
         }));


        console.log(fetchedPins);
        console.log(fetchedEvents);

        setPins(fetchedPins);
        setEvents(fetchedEvents);

        return;
        }
    })
      .catch(error => console.error("Error fetching pins:", error));
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowEvents(!showEvents);
  }
  
  if (!isLoaded || !currentLocation) {
    return <div>Loading map...</div>;
  }

  return (
    <div>
      <GoogleMap
          mapContainerStyle={{ width: '100vw', height: '100vh' }}
          center={currentLocation}
          zoom={10}
          onClick={(e) => {
            if (e.latLng) {
              console.log(e.latLng.lat(), e.latLng.lng());
            }
          }}
          >
          {/* Render the current location pin */}
          <Marker position={currentLocation} />

          {/* Render all stored pins */}
          {pins.map((pin, index) => (
            <Marker key={index} position={{ lat: pin.lat, lng: pin.lng }} />
        ))}
      </GoogleMap>

  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%'
    }}>
      <div onMouseEnter={() => setmenuSelect(false)}
          onMouseLeave={() => setmenuSelect(true)}
          style={{color: menuSelect ? "blue" : "white", width: '50%', textAlign: 'center', padding: 15 }}>
        <button onClick={handleClick}>
          {showEvents ? 'Hide Events' : 'Show Events'}
        </button>
      </div>

      {showEvents && (
        <div className="event-list" style={{width: '50%', margin: '0 auto'}}>
          {events.map((event) => (
            <EventCard key={event.id} {...event} />
          ))}
        </div>
      )}
    </div>
  </div>



  );
}
