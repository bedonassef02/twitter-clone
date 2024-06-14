import {
  Notification,
  NotificationSchema,
} from '../entities/notification.entity';

export const notificationSchemaHelper = {
  name: Notification.name,
  useFactory: () => {
    const schema = NotificationSchema;
    schema.post('find', function (docs) {
      docs.forEach((doc: Notification) => {
        if (!doc.seen) {
          doc.seen = true;
        }
      });
    });
    return schema;
  },
};
