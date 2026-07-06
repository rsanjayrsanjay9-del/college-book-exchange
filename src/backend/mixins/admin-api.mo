import Debug "mo:core/Debug";
import Principal "mo:core/Principal";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import UserTypes "../types/users";
import BookTypes "../types/books";
import InterestTypes "../types/interests";
import Common "../types/common";
import UserLib "../lib/users";
import BookLib "../lib/books";
import InterestLib "../lib/interests";

mixin (
  users : Map.Map<Common.UserId, UserTypes.User>,
  books : Map.Map<Common.BookId, BookTypes.Book>,
  interests : Map.Map<Common.InterestId, InterestTypes.Interest>,
) {
  public shared ({ caller }) func adminDeleteBook(id : Common.BookId) : async Bool {
    if (not UserLib.isAdmin(users, caller)) {
      Runtime.trap("Unauthorized: admin access required");
    };
    BookLib.deleteBook(books, id);
  };

  public shared ({ caller }) func adminUpdateBook(id : Common.BookId, input : BookTypes.BookInput) : async ?BookTypes.Book {
    if (not UserLib.isAdmin(users, caller)) {
      Runtime.trap("Unauthorized: admin access required");
    };
    BookLib.updateBook(books, id, input);
  };

  public shared ({ caller }) func adminMarkBookSold(id : Common.BookId) : async ?BookTypes.Book {
    if (not UserLib.isAdmin(users, caller)) {
      Runtime.trap("Unauthorized: admin access required");
    };
    BookLib.markBookSold(books, id);
  };

  public shared ({ caller }) func adminConfirmAvailability(id : Common.BookId) : async ?BookTypes.Book {
    if (not UserLib.isAdmin(users, caller)) {
      Runtime.trap("Unauthorized: admin access required");
    };
    BookLib.confirmAvailability(books, id);
  };

  public shared ({ caller }) func adminGetSellerContact(bookId : Common.BookId) : async ?{ name : Text; email : Text; phone : Text } {
    if (not UserLib.isAdmin(users, caller)) {
      Runtime.trap("Unauthorized: admin access required");
    };
    switch (BookLib.getBook(books, bookId)) {
      case (?book) {
        switch (UserLib.getUser(users, book.sellerId)) {
          case (?user) {
            ?{ name = user.name; email = user.email; phone = user.phone };
          };
          case null { null };
        };
      };
      case null { null };
    };
  };

  public shared ({ caller }) func adminDeleteUser(id : Common.UserId) : async Bool {
    if (not UserLib.isAdmin(users, caller)) {
      Runtime.trap("Unauthorized: admin access required");
    };
    UserLib.deleteUser(users, id);
  };

  public shared ({ caller }) func adminListAllInterests() : async [InterestTypes.InterestWithDetails] {
    if (not UserLib.isAdmin(users, caller)) {
      Runtime.trap("Unauthorized: admin access required");
    };
    InterestLib.listInterestsWithDetails(interests, users, books);
  };
};
