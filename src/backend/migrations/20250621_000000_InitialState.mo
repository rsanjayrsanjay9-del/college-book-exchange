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

  type OldActor = {};

  type NewActor = {
    var users : Map.Map<Principal, User>;
    var books : Map.Map<Nat, Book>;
    var interests : Map.Map<Nat, Interest>;
    var nextBookId : { var value : Nat };
    var nextInterestId : { var value : Nat };
  };

  public func migration(old : OldActor) : NewActor {
    {
      var users = Map.empty<Principal, User>();
      var books = Map.empty<Nat, Book>();
      var interests = Map.empty<Nat, Interest>();
      var nextBookId = { var value = 1 };
      var nextInterestId = { var value = 1 };
    }
  };
};
