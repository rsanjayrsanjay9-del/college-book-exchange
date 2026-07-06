import Map "mo:core/Map";
import List "mo:core/List";
import Types "../types/notifications";
import Common "../types/common";
import InterestTypes "../types/interests";
import UserTypes "../types/users";
import BookTypes "../types/books";

module {
  public func createNotification(
    notifications : Map.Map<Types.NotificationId, Types.Notification>,
    nextNotificationId : { var value : Types.NotificationId },
    interest : InterestTypes.Interest,
    buyer : UserTypes.User,
    book : BookTypes.Book,
    now : Common.Timestamp,
  ) : Types.Notification {
    let id = nextNotificationId.value;
    nextNotificationId.value := id + 1;
    let notification : Types.Notification = {
      id = id;
      interestId = interest.id;
      bookId = interest.bookId;
      buyerId = interest.buyerId;
      buyerName = buyer.name;
      buyerEmail = buyer.email;
      buyerPhone = buyer.phone;
      bookTitle = book.title;
      createdAt = now;
      isRead = false;
    };
    notifications.add(id, notification);
    notification;
  };

  public func getNotification(
    notifications : Map.Map<Types.NotificationId, Types.Notification>,
    id : Types.NotificationId,
  ) : ?Types.Notification {
    notifications.get(id);
  };

  public func markAsRead(
    notifications : Map.Map<Types.NotificationId, Types.Notification>,
    id : Types.NotificationId,
  ) : ?Types.Notification {
    switch (notifications.get(id)) {
      case (?old) {
        let updated = { old with isRead = true };
        notifications.add(id, updated);
        ?updated;
      };
      case null { null };
    };
  };

  public func listNotifications(
    notifications : Map.Map<Types.NotificationId, Types.Notification>,
  ) : [Types.Notification] {
    let arr = List.empty<Types.Notification>();
    for ((_, n) in notifications.entries()) {
      arr.add(n);
    };
    arr.toArray();
  };

  public func listUnreadNotifications(
    notifications : Map.Map<Types.NotificationId, Types.Notification>,
  ) : [Types.Notification] {
    let arr = List.empty<Types.Notification>();
    for ((_, n) in notifications.entries()) {
      if (not n.isRead) {
        arr.add(n);
      };
    };
    arr.toArray();
  };

  public func countUnread(
    notifications : Map.Map<Types.NotificationId, Types.Notification>,
  ) : Nat {
    var count = 0;
    for ((_, n) in notifications.entries()) {
      if (not n.isRead) {
        count += 1;
      };
    };
    count;
  };
};
