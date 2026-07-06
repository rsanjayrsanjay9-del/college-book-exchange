import Debug "mo:core/Debug";
import Principal "mo:core/Principal";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import VarArray "mo:core/VarArray";
import Types "../types/notifications";
import Common "../types/common";
import UserTypes "../types/users";
import BookTypes "../types/books";
import InterestTypes "../types/interests";
import UserLib "../lib/users";
import NotificationLib "../lib/notifications";

mixin (
  users : Map.Map<Common.UserId, UserTypes.User>,
  books : Map.Map<Common.BookId, BookTypes.Book>,
  interests : Map.Map<Common.InterestId, InterestTypes.Interest>,
  notifications : Map.Map<Types.NotificationId, Types.Notification>,
  nextNotificationId : { var value : Types.NotificationId },
) {
  public shared ({ caller }) func getAdminNotifications() : async [Types.Notification] {
    if (not UserLib.isAdmin(users, caller)) {
      Runtime.trap("Unauthorized: admin access required");
    };
    NotificationLib.listNotifications(notifications);
  };

  public shared ({ caller }) func getUnreadAdminNotificationCount() : async Nat {
    if (not UserLib.isAdmin(users, caller)) {
      Runtime.trap("Unauthorized: admin access required");
    };
    NotificationLib.countUnread(notifications);
  };

  public shared ({ caller }) func markAdminNotificationAsRead(id : Types.NotificationId) : async ?Types.Notification {
    if (not UserLib.isAdmin(users, caller)) {
      Runtime.trap("Unauthorized: admin access required");
    };
    NotificationLib.markAsRead(notifications, id);
  };

  public shared ({ caller }) func adminGetNewInterestNotifications() : async [InterestTypes.InterestWithDetails] {
    if (not UserLib.isAdmin(users, caller)) {
      Runtime.trap("Unauthorized: admin access required");
    };
    let unreadNotifications = NotificationLib.listUnreadNotifications(notifications);
    let arr = VarArray.repeat<InterestTypes.InterestWithDetails>({
      id = 0;
      bookId = 0;
      buyerId = Principal.fromText("aaaaa-aa");
      buyerName = "";
      buyerEmail = "";
      buyerPhone = "";
      bookTitle = "";
      createdAt = 0;
    }, unreadNotifications.size());
    var i = 0;
    for (notification in unreadNotifications.vals()) {
      switch (interests.get(notification.interestId)) {
        case (?interest) {
          let buyer = switch (users.get(interest.buyerId)) {
            case (?u) { u };
            case null {
              {
                id = interest.buyerId;
                name = "Unknown";
                email = "";
                phone = "";
                collegeName = null;
                isAdmin = false;
                createdAt = 0;
              };
            };
          };
          let book = switch (books.get(interest.bookId)) {
            case (?b) { b };
            case null {
              {
                id = interest.bookId;
                sellerId = interest.buyerId;
                title = "Unknown";
                author = "";
                subject = "";
                price = 0;
                photoUrl = null;
                status = #available;
                createdAt = 0;
              };
            };
          };
          let detail : InterestTypes.InterestWithDetails = {
            id = interest.id;
            bookId = interest.bookId;
            buyerId = interest.buyerId;
            buyerName = buyer.name;
            buyerEmail = buyer.email;
            buyerPhone = buyer.phone;
            bookTitle = book.title;
            createdAt = interest.createdAt;
          };
          arr[i] := detail;
          i += 1;
        };
        case null {};
      };
    };
    Array.tabulate(i, func(j) { arr[j] });
  };
};
