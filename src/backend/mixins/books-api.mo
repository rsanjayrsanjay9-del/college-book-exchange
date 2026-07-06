import Debug "mo:core/Debug";
import Principal "mo:core/Principal";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Types "../types/books";
import Common "../types/common";
import BookLib "../lib/books";
import Time "mo:core/Time";
import UserTypes "../types/users";
import Int "mo:core/Int";

mixin (
  books : Map.Map<Common.BookId, Types.Book>,
  nextBookId : { var value : Common.BookId },
  users : Map.Map<Common.UserId, UserTypes.User>,
) {
  public shared ({ caller }) func createBook(input : Types.BookInput) : async Types.Book {
    let now = Time.now().toNat();
    BookLib.createBook(books, nextBookId, caller, input, now);
  };

  public query func getBook(id : Common.BookId) : async ?Types.Book {
    BookLib.getBook(books, id);
  };

  public shared ({ caller }) func updateBook(id : Common.BookId, input : Types.BookInput) : async ?Types.Book {
    switch (BookLib.getBook(books, id)) {
      case (?book) {
        if (not Principal.equal(book.sellerId, caller)) {
          Runtime.trap("Unauthorized: only the seller can update this book");
        };
        BookLib.updateBook(books, id, input);
      };
      case null { null };
    };
  };

  public shared ({ caller }) func deleteBook(id : Common.BookId) : async Bool {
    switch (BookLib.getBook(books, id)) {
      case (?book) {
        if (not Principal.equal(book.sellerId, caller)) {
          Runtime.trap("Unauthorized: only the seller can delete this book");
        };
        BookLib.deleteBook(books, id);
      };
      case null { false };
    };
  };

  public query func listBooks() : async [Types.Book] {
    BookLib.listBooks(books);
  };

  public query func searchBooks(searchTerm : ?Text, collegeFilter : ?Text) : async [Types.Book] {
    let sellerCollegeMap = Map.empty<Common.UserId, ?Text>();
    for ((userId, user) in users.entries()) {
      sellerCollegeMap.add(userId, user.collegeName);
    };
    BookLib.searchBooks(books, searchTerm, collegeFilter, sellerCollegeMap);
  };

  public shared ({ caller }) func getMyBooks() : async [Types.Book] {
    BookLib.getBooksBySeller(books, caller);
  };
};
