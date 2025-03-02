import { jsx, jsxs } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter, useMatches, useActionData, useLoaderData, useParams, useRouteError, Link, Meta, Links, ScrollRestoration, Scripts, Outlet, isRouteErrorResponse } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { createElement, useState, useEffect } from "react";
import { useJsApiLoader, GoogleMap, Marker } from "@react-google-maps/api";
import axios from "axios";
const streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    let userAgent = request.headers.get("user-agent");
    let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(ServerRouter, { context: routerContext, url: request.url }),
      {
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, streamTimeout + 1e3);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest,
  streamTimeout
}, Symbol.toStringTag, { value: "Module" }));
function withComponentProps(Component) {
  return function Wrapped() {
    const props = {
      params: useParams(),
      loaderData: useLoaderData(),
      actionData: useActionData(),
      matches: useMatches()
    };
    return createElement(Component, props);
  };
}
function withErrorBoundaryProps(ErrorBoundary3) {
  return function Wrapped() {
    const props = {
      params: useParams(),
      loaderData: useLoaderData(),
      actionData: useActionData(),
      error: useRouteError()
    };
    return createElement(ErrorBoundary3, props);
  };
}
function Navbar() {
  return /* @__PURE__ */ jsx("nav", { className: "navbar", children: /* @__PURE__ */ jsxs("ul", { children: [
    /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/", children: "Home" }) }),
    /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/about", children: "About" }) })
  ] }) });
}
function Footer() {
  return /* @__PURE__ */ jsxs("footer", { className: "bg-gray-200 text-gray-700 p-4 text-center", children: [
    "© ",
    (/* @__PURE__ */ new Date()).getFullYear(),
    " Code 4 Change. All rights reserved."
  ] });
}
const links = () => [{
  rel: "preconnect",
  href: "https://fonts.googleapis.com"
}, {
  rel: "preconnect",
  href: "https://fonts.gstatic.com",
  crossOrigin: "anonymous"
}, {
  rel: "stylesheet",
  href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
}];
function Layout({
  children
}) {
  return /* @__PURE__ */ jsxs("html", {
    lang: "en",
    children: [/* @__PURE__ */ jsxs("head", {
      children: [/* @__PURE__ */ jsx("meta", {
        charSet: "utf-8"
      }), /* @__PURE__ */ jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      }), /* @__PURE__ */ jsx(Meta, {}), /* @__PURE__ */ jsx(Links, {})]
    }), /* @__PURE__ */ jsxs("body", {
      children: [/* @__PURE__ */ jsx("header", {
        children: /* @__PURE__ */ jsx(Navbar, {})
      }), children, /* @__PURE__ */ jsx("header", {
        children: /* @__PURE__ */ jsx(Footer, {})
      }), /* @__PURE__ */ jsx(ScrollRestoration, {}), /* @__PURE__ */ jsx(Scripts, {})]
    })]
  });
}
const root = withComponentProps(function App() {
  return /* @__PURE__ */ jsx(Outlet, {});
});
const ErrorBoundary = withErrorBoundaryProps(function ErrorBoundary2({
  error
}) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack;
  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  }
  return /* @__PURE__ */ jsxs("main", {
    className: "pt-16 p-4 container mx-auto",
    children: [/* @__PURE__ */ jsx("h1", {
      children: message
    }), /* @__PURE__ */ jsx("p", {
      children: details
    }), stack]
  });
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  Layout,
  default: root,
  links
}, Symbol.toStringTag, { value: "Module" }));
const EventCard = ({ image, description, severity }) => /* @__PURE__ */ jsxs("div", { className: "event-card", style: { border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }, children: [
  /* @__PURE__ */ jsx("img", { src: image, alt: description, style: { width: "10vw", height: "150px", objectFit: "cover" } }),
  /* @__PURE__ */ jsxs("div", { style: { marginTop: "0.5rem" }, children: [
    /* @__PURE__ */ jsx("p", { children: description }),
    /* @__PURE__ */ jsxs("p", { children: [
      "Severity: ",
      severity
    ] })
  ] })
] });
function MyComponent() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: void 0
  });
  const [currentLocation, setCurrentLocation] = useState(null);
  const [pins, setPins] = useState([]);
  const [events, setEvents] = useState([]);
  const [testPins, setTest] = useState([]);
  const [showEvents, setShowEvents] = useState(false);
  const [menuSelect, setmenuSelect] = useState(true);
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setCurrentLocation({
            lat,
            lng
          });
          const nearby = generateNearbyPins(lat, lng, 5);
          setTest(nearby);
        },
        (error) => {
          console.error("Error getting location:", error);
          setCurrentLocation({ lat: 40.7128, lng: -74.006 });
        }
      );
    }
  }, []);
  const generateNearbyPins = (lat, lng, count) => {
    const pins2 = [];
    for (let i = 0; i < count; i++) {
      const latOffset = (Math.random() - 0.5) * 0.05;
      const lngOffset = (Math.random() - 0.5) * 0.05;
      pins2.push({
        lat: lat + latOffset,
        lng: lng + lngOffset,
        title: `Test Pin ${i + 1}`
      });
    }
    return pins2;
  };
  useEffect(() => {
    axios.get("http://localhost:5000/api/products").then((response) => {
      if (response.data && Array.isArray(response.data.data)) {
        const data = response.data.data;
        const fetchedPins = data.filter((product) => product.location).map((product) => ({
          lat: product.location.lat,
          lng: product.location.lng,
          title: product.description || `Pin ${product._id}`
        }));
        const fetchedEvents = data.map((product) => ({
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
    }).catch((error) => console.error("Error fetching pins:", error));
  }, []);
  const handleClick = (e) => {
    e.preventDefault();
    setShowEvents(!showEvents);
  };
  if (!isLoaded || !currentLocation) {
    return /* @__PURE__ */ jsx("div", { children: "Loading map..." });
  }
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs(
      GoogleMap,
      {
        mapContainerStyle: { width: "100vw", height: "100vh" },
        center: currentLocation,
        zoom: 10,
        onClick: (e) => {
          if (e.latLng) {
            console.log(e.latLng.lat(), e.latLng.lng());
          }
        },
        children: [
          /* @__PURE__ */ jsx(Marker, { position: currentLocation }),
          pins.map((pin, index) => /* @__PURE__ */ jsx(Marker, { position: { lat: pin.lat, lng: pin.lng } }, index))
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      width: "100%"
    }, children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          onMouseEnter: () => setmenuSelect(false),
          onMouseLeave: () => setmenuSelect(true),
          style: { color: menuSelect ? "blue" : "white", width: "50%", textAlign: "center", padding: 15 },
          children: /* @__PURE__ */ jsx("button", { onClick: handleClick, children: showEvents ? "Hide Events" : "Show Events" })
        }
      ),
      showEvents && /* @__PURE__ */ jsx("div", { className: "event-list", style: { width: "50%", margin: "0 auto" }, children: events.map((event) => /* @__PURE__ */ jsx(EventCard, { ...event }, event.id)) })
    ] })
  ] });
}
function Welcome() {
  return /* @__PURE__ */ jsx("div", { className: "flex flex-col", children: /* @__PURE__ */ jsxs("main", { className: "flex-1 flex flex-col items-center justify-center p-4", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-4xl font-bold mb-4", children: "Alachua County Public Health" }),
    /* @__PURE__ */ jsx("p", { className: "text-lg text-center", children: "This is for Code 4 Change. Explore our resources and learn how you can make a difference." }),
    /* @__PURE__ */ jsx(MyComponent, {})
  ] }) });
}
function meta$1({}) {
  return [{
    title: "Home"
  }, {
    name: "Home Page",
    content: "The Landing Page for Code 4 Change"
  }];
}
const home = withComponentProps(function Home() {
  return /* @__PURE__ */ jsx(Welcome, {});
});
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: home,
  meta: meta$1
}, Symbol.toStringTag, { value: "Module" }));
function About() {
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("h1", { children: "About Page" }),
    /* @__PURE__ */ jsx("p", { children: "This is the about page!" })
  ] });
}
function meta({}) {
  return [{
    title: "About"
  }, {
    name: "About Us Page",
    content: "About Page"
  }];
}
const about = withComponentProps(function AboutPage() {
  return /* @__PURE__ */ jsx(About, {});
});
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: about,
  meta
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-Cp2zOdRB.js", "imports": ["/assets/chunk-HA7DTUK3-_vc9zzy1.js", "/assets/index-DG_yn4Dn.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": true, "module": "/assets/root-Dm2xTnpq.js", "imports": ["/assets/chunk-HA7DTUK3-_vc9zzy1.js", "/assets/index-DG_yn4Dn.js", "/assets/navbar-D7zZeD7a.js"], "css": ["/assets/root-MBB1d6gG.css", "/assets/navbar-CTiEB9gK.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "hydrateFallbackModule": void 0 }, "routes/home": { "id": "routes/home", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/home-CV_E7VlQ.js", "imports": ["/assets/navbar-D7zZeD7a.js", "/assets/chunk-HA7DTUK3-_vc9zzy1.js", "/assets/index-DG_yn4Dn.js"], "css": ["/assets/navbar-CTiEB9gK.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "hydrateFallbackModule": void 0 }, "routes/about": { "id": "routes/about", "parentId": "root", "path": "about", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/about-Duqnd4C8.js", "imports": ["/assets/navbar-D7zZeD7a.js", "/assets/chunk-HA7DTUK3-_vc9zzy1.js"], "css": ["/assets/navbar-CTiEB9gK.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/assets/manifest-e27d2624.js", "version": "e27d2624" };
const assetsBuildDirectory = "build\\client";
const basename = "/";
const future = { "unstable_optimizeDeps": false, "unstable_splitRouteModules": false, "unstable_viteEnvironmentApi": false };
const ssr = true;
const isSpaMode = false;
const prerender = [];
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/home": {
    id: "routes/home",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route1
  },
  "routes/about": {
    id: "routes/about",
    parentId: "root",
    path: "about",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  prerender,
  publicPath,
  routes,
  ssr
};
