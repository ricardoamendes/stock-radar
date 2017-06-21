// pushnotification.tsx

let enabled;
let closeTimeout = 4000;

/**
 * W3C Push Notifications API.
 */
class PushNotification {

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

    /**
     * Fires and displays a notification.
     * @param {String} message Notification message
     * @return {void}
     */
    static create(message) {
        let notification = new Notification(message);
        setTimeout(notification.close.bind(notification), closeTimeout);
    }
}

export default PushNotification;