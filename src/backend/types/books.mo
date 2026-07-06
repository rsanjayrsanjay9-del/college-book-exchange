import Common "common";

module {
  public type BookStatus = {
    #available;
    #sold;
  };

  public type Book = {
    id : Common.BookId;
    sellerId : Common.UserId;
    title : Text;
    author : Text;
    subject : Text;
    price : Nat;
    photoUrl : ?Text;
    status : BookStatus;
    createdAt : Common.Timestamp;
  };

  public type BookInput = {
    title : Text;
    author : Text;
    subject : Text;
    price : Nat;
    photoUrl : ?Text;
  };
};
