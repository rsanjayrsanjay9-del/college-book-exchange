import Debug "mo:core/Debug";
import Principal "mo:core/Principal";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Types "../types/interests";
import Common "../types/common";
import InterestLib "../lib/interests";
import Time "mo:core/Time";
import UserTypes "../types/users";
import BookTypes "../types/books";
import List "mo:core/List";
import Int "mo:core/Int";
import NotificationTypes "../types/notifications";
import NotificationLib "../lib/notifications";

mixin (
  interests : Map.Map<Common.InterestId, Types.Interest>,
  nextInterestId : { var value : Common.InterestId },
  users : Map.Map<Common.UserId, UserTypes.User>,
  books : Map.Map<Common.BookId, BookTypes.Book>,
  notifications : Map.Map<NotificationTypes.NotificationId, NotificationTypes.Notification>,
  nextNotificationId : { var value : NotificationTypes.NotificationId },
) {
  public shared ({ caller }) func expressInterest(bookId : Common.BookId) : async Types.Interest {
    let now = Time.now().toNat();
    let interest = InterestLib.createInterest(interests, nextInterestId, bookId, caller, now);
    switch (books.get(bookId)) {
      case (?book) {
        switch (users.get(caller)) {
          case (?buyer) {
            ignore NotificationLib.createNotification(notifications, nextNotificationId, interest, buyer, book, now);
          };
          case null {};
        };
      };
      case null {};
    };
    interest;
  };

  public query func getInterest(id : Common.InterestId) : async ?Types.Interest {
    InterestLib.getInterest(interests, id);
  };

  public shared ({ caller }) func deleteInterest(id : Common.InterestId) : async Bool {
    switch (InterestLib.getInterest(interests, id)) {
      case (?interest) {
        if (not Principal.equal(interest.buyerId, caller)) {
          Runtime.trap("Unauthorized: only the buyer can delete this interest");
        };
        InterestLib.deleteInterest(interests, id);
      };
      case null { false };
    };
  };

  public query func listInterests() : async [Types.Interest] {
    InterestLib.listInterests(interests);
  };

  public query func listInterestsWithDetails() : async [Types.InterestWithDetails] {
    InterestLib.listInterestsWithDetails(interests, users, books);
  };

  public shared ({ caller }) func getMyInterests() : async [Types.Interest] {
    InterestLib.getInterestsByBuyer(interests, caller);
  };

  public shared ({ caller }) func getInterestsForMyBooks() : async [Types.Interest] {
    let arr = List.empty<Types.Interest>();
    for ((_, interest) in interests.entries()) {
      switch (books.get(interest.bookId)) {
        case (?book) {
          if (Principal.equal(book.sellerId, caller)) {
            arr.add(interest);
          };
        };
        case null {};
      };
    };
    arr.toArray();
  };
};
