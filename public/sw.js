function receive_push(event) {
    const { image, tag, url, title, body } = event.data.json();

    const options = {
        data: url,
        body: body,
        icon: image,
        vibrate: [200, 100, 200],
        tag: tag,
        image: image,
    };
    event.waitUntil(self.registration.showNotification(title, options));
}

self.addEventListener("push", receive_push);