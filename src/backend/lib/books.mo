import Debug "mo:core/Debug";
import Principal "mo:core/Principal";
import Map "mo:core/Map";
import List "mo:core/List";
import Types "../types/books";
import Common "../types/common";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Char "mo:core/Char";

module {
  func toLowercase(t : Text) : Text {
    let chars = t.toArray();
    let lower = Array.tabulate(chars.size(), func(i : Nat) : Char {
      let c = chars[i];
      if (c >= 'A' and c <= 'Z') {
        Char.fromNat32(c.toNat32() + 32);
      } else {
        c;
      };
    });
    Text.fromArray(lower);
  };
  public func createBook(
    books : Map.Map<Common.BookId, Types.Book>,
    nextBookId : { var value : Common.BookId },
    sellerId : Common.UserId,
    input : Types.BookInput,
    now : Common.Timestamp,
  ) : Types.Book {
    let id = nextBookId.value;
    nextBookId.value := id + 1;
    let book : Types.Book = {
      id = id;
      sellerId = sellerId;
      title = input.title;
      author = input.author;
      subject = input.subject;
      price = input.price;
      photoUrl = input.photoUrl;
      status = #available;
      createdAt = now;
    };
    books.add(id, book);
    book;
  };

  public func getBook(
    books : Map.Map<Common.BookId, Types.Book>,
    id : Common.BookId,
  ) : ?Types.Book {
    books.get(id);
  };

  public func updateBook(
    books : Map.Map<Common.BookId, Types.Book>,
    id : Common.BookId,
    input : Types.BookInput,
  ) : ?Types.Book {
    switch (books.get(id)) {
      case (?oldBook) {
        let updated = {
          oldBook with
          title = input.title;
          author = input.author;
          subject = input.subject;
          price = input.price;
          photoUrl = input.photoUrl;
        };
        books.add(id, updated);
        ?updated;
      };
      case null { null };
    };
  };

  public func deleteBook(
    books : Map.Map<Common.BookId, Types.Book>,
    id : Common.BookId,
  ) : Bool {
    switch (books.get(id)) {
      case (?_) { ignore books.remove(id); true };
      case null { false };
    };
  };

  public func listBooks(
    books : Map.Map<Common.BookId, Types.Book>,
  ) : [Types.Book] {
    let arr = List.empty<Types.Book>();
    for ((_, book) in books.entries()) {
      arr.add(book);
    };
    arr.toArray();
  };

  public func searchBooks(
    books : Map.Map<Common.BookId, Types.Book>,
    searchTerm : ?Text,
    collegeFilter : ?Text,
    sellerCollegeMap : Map.Map<Common.UserId, ?Text>,
  ) : [Types.Book] {
    let arr = List.empty<Types.Book>();
    for ((_, book) in books.entries()) {
      let matchesSearch = switch (searchTerm) {
        case (?term) {
          let termLower = toLowercase(term);
          let titleLower = toLowercase(book.title);
          let authorLower = toLowercase(book.author);
          let subjectLower = toLowercase(book.subject);
          titleLower.contains(#text termLower) or authorLower.contains(#text termLower) or subjectLower.contains(#text termLower);
        };
        case null { true };
      };
      let matchesCollege = switch (collegeFilter) {
        case (?college) {
          switch (sellerCollegeMap.get(book.sellerId)) {
            case (?(?sellerCollege)) { sellerCollege == college };
            case _ { false };
          };
        };
        case null { true };
      };
      if (matchesSearch and matchesCollege) {
        arr.add(book);
      };
    };
    arr.toArray();
  };

  public func markBookSold(
    books : Map.Map<Common.BookId, Types.Book>,
    id : Common.BookId,
  ) : ?Types.Book {
    switch (books.get(id)) {
      case (?oldBook) {
        let updated = { oldBook with status = #sold };
        books.add(id, updated);
        ?updated;
      };
      case null { null };
    };
  };

  public func confirmAvailability(
    books : Map.Map<Common.BookId, Types.Book>,
    id : Common.BookId,
  ) : ?Types.Book {
    switch (books.get(id)) {
      case (?oldBook) {
        let updated = { oldBook with status = #available };
        books.add(id, updated);
        ?updated;
      };
      case null { null };
    };
  };

  public func getBooksBySeller(
    books : Map.Map<Common.BookId, Types.Book>,
    sellerId : Common.UserId,
  ) : [Types.Book] {
    let arr = List.empty<Types.Book>();
    for ((_, book) in books.entries()) {
      if (Principal.equal(book.sellerId, sellerId)) {
        arr.add(book);
      };
    };
    arr.toArray();
  };
};
