import Debug "mo:core/Debug";
import Principal "mo:core/Principal";
import Map "mo:core/Map";
import List "mo:core/List";
import Types "../types/interests";
import UserTypes "../types/users";
import BookTypes "../types/books";
import Common "../types/common";

module {
  public func createInterest(
    interests : Map.Map<Common.InterestId, Types.Interest>,
    nextInterestId : { var value : Common.InterestId },
    bookId : Common.BookId,
    buyerId : Common.UserId,
    now : Common.Timestamp,
  ) : Types.Interest {
    let id = nextInterestId.value;
    nextInterestId.value := id + 1;
    let interest : Types.Interest = {
      id = id;
      bookId = bookId;
      buyerId = buyerId;
      createdAt = now;
    };
    interests.add(id, interest);
    interest;
  };

  public func getInterest(
    interests : Map.Map<Common.InterestId, Types.Interest>,
    id : Common.InterestId,
  ) : ?Types.Interest {
    interests.get(id);
  };

  public func deleteInterest(
    interests : Map.Map<Common.InterestId, Types.Interest>,
    id : Common.InterestId,
  ) : Bool {
    switch (interests.get(id)) {
      case (?_) { ignore interests.remove(id); true };
      case null { false };
    };
  };

  public func listInterests(
    interests : Map.Map<Common.InterestId, Types.Interest>,
  ) : [Types.Interest] {
    let arr = List.empty<Types.Interest>();
    for ((_, interest) in interests.entries()) {
      arr.add(interest);
    };
    arr.toArray();
  };

  public func listInterestsWithDetails(
    interests : Map.Map<Common.InterestId, Types.Interest>,
    users : Map.Map<Common.UserId, UserTypes.User>,
    books : Map.Map<Common.BookId, BookTypes.Book>,
  ) : [Types.InterestWithDetails] {
    let arr = List.empty<Types.InterestWithDetails>();
    for ((_, interest) in interests.entries()) {
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
      let detail : Types.InterestWithDetails = {
        id = interest.id;
        bookId = interest.bookId;
        buyerId = interest.buyerId;
        buyerName = buyer.name;
        buyerEmail = buyer.email;
        buyerPhone = buyer.phone;
        bookTitle = book.title;
        createdAt = interest.createdAt;
      };
      arr.add(detail);
    };
    arr.toArray();
  };

  public func getInterestsByBook(
    interests : Map.Map<Common.InterestId, Types.Interest>,
    bookId : Common.BookId,
  ) : [Types.Interest] {
    let arr = List.empty<Types.Interest>();
    for ((_, interest) in interests.entries()) {
      if (interest.bookId == bookId) {
        arr.add(interest);
      };
    };
    arr.toArray();
  };

  public func getInterestsByBuyer(
    interests : Map.Map<Common.InterestId, Types.Interest>,
    buyerId : Common.UserId,
  ) : [Types.Interest] {
    let arr = List.empty<Types.Interest>();
    for ((_, interest) in interests.entries()) {
      if (Principal.equal(interest.buyerId, buyerId)) {
        arr.add(interest);
      };
    };
    arr.toArray();
  };
};
