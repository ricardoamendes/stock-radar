// pushnotification.tsx

let enabled;
let closeTimeout = 4000;

/**
 * W3C Push Notifications API.
 */
class PushNotification {

    static registration : any;

    /**
     * Initializes push notifications.
     * @return {void}
     */
    static init() {
        let NotificationAPI = (Notification as any);
        if (!("Notification" in window)) {
            alert("This browser does not support desktop notification");
        } else if (NotificationAPI.permission === "granted") {
            enabled = true;
        } else if (NotificationAPI.permission !== "denied") {
            Notification.requestPermission(permission => {
                if (permission === "granted") {
                    enabled = true;
                }
            });
        }
    }

    static registerServiceWorker() {
        // Check that service workers are supported
        if ("serviceWorker" in navigator) {
            navigator
                .serviceWorker
                .register("./service-worker.js")
                .catch((err) => {
                    alert("Unable to Register SW\", \"Sorry this demo requires a service worker to work and i" +
                            "t failed to install - sorry :(");
                    console.error(err);
                })
                .then(this.onRegistration.bind(this))
        } else {
            alert("Service Worker Not Supported\", \"Sorry this demo requires service worker support " +
                    "in your browser. Please try this demo in Chrome or Firefox Nightly.");
        }
    }

    static onRegistration(registration) {
        console.log("on registration")
        this.registration = registration
        if (registration.waiting) {
            console.log("waiting", registration.waiting);
            registration
                .waiting
                .addEventListener("statechange", this.onStateChange("waiting"));
        }

        if (registration.installing) {
            console.log("installing", registration.installing);
            registration
                .installing
                .addEventListener("statechange", this.onStateChange("installing"));
        }

        if (registration.active) {
            console.log("active", registration.active);
            registration
                .active
                .addEventListener("statechange", this.onStateChange("active"));
        }
    }

    static onStateChange(from) {
        return function (e) {
            console.log("statechange", from, "to", e.target.state);
        }
    }

    /**
     * Fires and displays a notification.
     * @param {String} message Notification message
     * @return {void}
     */
    static create(message) {
        let notificationTitle = "Price Update";
        const notificationOptions = {
            body: message,
            icon: "./images/logo-192x192.png",
            badge: "./images/badge-72x72.png"
        };
        this.registration.showNotification(notificationTitle, notificationOptions)
    }
}

export default PushNotification;