import Map "mo:core/Map";

module {
  type User = {
    id : Principal;
    name : Text;
    email : Text;
    phone : Text;
    collegeName : ?Text;
    isAdmin : Bool;
    createdAt : Nat;
  };

  type Book = {
    id : Nat;
    sellerId : Principal;
    title : Text;
    author : Text;
    subject : Text;
    price : Nat;
    photoUrl : ?Text;
    status : { #available; #sold };
    createdAt : Nat;
  };

  type Interest = {
    id : Nat;
    bookId : Nat;
    buyerId : Principal;
    createdAt : Nat;
  };

  type Notification = {
    id : Nat;
    interestId : Nat;
    bookId : Nat;
    buyerId : Principal;
    buyerName : Text;
    buyerEmail : Text;
    buyerPhone : Text;
    bookTitle : Text;
    createdAt : Nat;
    isRead : Bool;
  };

  type OldActor = {
    var users : Map.Map<Principal, User>;
    var books : Map.Map<Nat, Book>;
    var interests : Map.Map<Nat, Interest>;
    var nextBookId : { var value : Nat };
    var nextInterestId : { var value : Nat };
  };

  type NewActor = {
    var users : Map.Map<Principal, User>;
    var books : Map.Map<Nat, Book>;
    var interests : Map.Map<Nat, Interest>;
    var notifications : Map.Map<Nat, Notification>;
    var nextBookId : { var value : Nat };
    var nextInterestId : { var value : Nat };
    var nextNotificationId : { var value : Nat };
  };

  public func migration(old : OldActor) : NewActor {
    {
      var users = old.users;
      var books = old.books;
      var interests = old.interests;
      var notifications = Map.empty<Nat, Notification>();
      var nextBookId = old.nextBookId;
      var nextInterestId = old.nextInterestId;
      var nextNotificationId = { var value = 1 };
    }
  };
};
